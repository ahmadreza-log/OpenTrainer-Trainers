import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

const BINARY_EXTENSIONS = new Set([
  ".exe",
  ".dll",
  ".msi",
  ".scr",
  ".sys",
  ".zip",
  ".7z",
  ".rar",
  ".tar",
  ".gz",
]);
const MAX_REPO_FILE_BYTES = 1024 * 1024;
const IGNORED_DIRS = new Set([".git", "node_modules", "dist"]);

function readSchema(name) {
  return JSON.parse(readFileSync(join(repoRoot, "schemas", name), "utf8"));
}

function createAjv() {
  const ajv = new Ajv2020({ allErrors: true });
  addFormats(ajv);
  ajv.addSchema(readSchema("game.v1.schema.json"));
  ajv.addSchema(readSchema("manifest.v1.schema.json"));
  ajv.addSchema(readSchema("catalog.v1.schema.json"));
  return ajv;
}

const ajv = createAjv();
const validateGameSchema = ajv.getSchema("urn:opentrainer:schema:game:1");
const validateManifestSchema = ajv.getSchema(
  "urn:opentrainer:schema:manifest:1",
);
const validateCatalogSchema = ajv.getSchema("urn:opentrainer:schema:catalog:1");

function schemaErrors(validate, data, path) {
  if (validate(data)) return [];
  return validate.errors.map(
    (e) => `${path}: ${e.instancePath || "/"} ${e.message}`,
  );
}

function listFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (IGNORED_DIRS.has(entry.name)) return [];
    const path = join(dir, entry.name);
    return entry.isDirectory() ? listFiles(path) : [path];
  });
}

function loadJsonFiles(root, dirName, errors) {
  return listFiles(join(root, dirName))
    .filter((file) => basename(file) !== ".gitkeep")
    .flatMap((file) => {
      const path = relative(root, file).replaceAll("\\", "/");
      if (extname(file) !== ".json") {
        errors.push(`${path}: only .json files are allowed here`);
        return [];
      }
      try {
        return [{ path, data: JSON.parse(readFileSync(file, "utf8")) }];
      } catch (error) {
        errors.push(`${path}: invalid JSON: ${error.message}`);
        return [];
      }
    });
}

/** Rejects binaries and oversized files anywhere in the repository. */
export function checkRepositoryFiles(root) {
  const errors = [];
  for (const file of listFiles(root)) {
    const path = relative(root, file).replaceAll("\\", "/");
    if (BINARY_EXTENSIONS.has(extname(file).toLowerCase())) {
      errors.push(`${path}: binary files can't be committed`);
    } else if (statSync(file).size > MAX_REPO_FILE_BYTES) {
      errors.push(`${path}: file is larger than 1 MiB`);
    }
  }
  return errors;
}

/** Applies the schemas and the rules JSON Schema can't express. Takes [{ path, data }]. */
export function validateData(games, trainers) {
  const errors = [];
  const gameIds = new Set();

  for (const { path, data } of games) {
    errors.push(...schemaErrors(validateGameSchema, data, path));
    if (`games/${data.id}.json` !== path)
      errors.push(`${path}: file must be games/${data.id}.json`);
    gameIds.add(data.id);
  }

  for (const { path, data } of trainers) {
    errors.push(...schemaErrors(validateManifestSchema, data, path));
    if (`manifests/${data.gameId}/${data.id}.json` !== path) {
      errors.push(
        `${path}: file must be manifests/${data.gameId}/${data.id}.json`,
      );
    }
    if (!gameIds.has(data.gameId))
      errors.push(`${path}: unknown game "${data.gameId}"`);

    const releases = Array.isArray(data.releases) ? data.releases : [];
    const versions = releases.map((release) => release.version);
    for (const version of new Set(versions)) {
      if (versions.indexOf(version) !== versions.lastIndexOf(version)) {
        errors.push(`${path}: duplicate release version "${version}"`);
      }
    }

    for (const release of releases) {
      const gameVersions = release.gameVersions ?? [];
      if (gameVersions.includes("any") && gameVersions.length > 1) {
        errors.push(
          `${path}: release ${release.version}: "any" must be the only game version`,
        );
      }
      if (data.distribution?.hostedBy === "author") {
        // shortcut: proves the listed account owns the release, not that it wrote the trainer. Upgrade with publisher verification (D5).
        const owner = release.download?.url?.split("/")[3]?.toLowerCase();
        if (!data.author?.github) {
          errors.push(
            `${path}: author.github is required when hostedBy is "author"`,
          );
        } else if (owner !== data.author.github.toLowerCase()) {
          errors.push(
            `${path}: release ${release.version}: URL owner "${owner}" isn't author.github`,
          );
        }
      }
    }
  }
  return errors;
}

/** Published releases are immutable, so a merged hash can't be swapped through a later edit. */
export function checkImmutability(previous, current, path) {
  const errors = [];
  for (const before of previous.releases ?? []) {
    const after = (current.releases ?? []).find(
      (release) => release.version === before.version,
    );
    if (!after) {
      errors.push(
        `${path}: release ${before.version} was removed; revoke it instead`,
      );
      continue;
    }
    for (const field of ["url", "fileName", "sha256", "sizeBytes"]) {
      if (before.download[field] !== after.download?.[field]) {
        errors.push(
          `${path}: release ${before.version}: download.${field} can't change`,
        );
      }
    }
  }
  return errors;
}

/** Hashes a release file as it streams past. It's never written to disk or run. */
export async function verifyDownload(download, fetchImpl = fetch) {
  const response = await fetchImpl(download.url, {
    redirect: "follow",
    signal: AbortSignal.timeout(300_000),
  });
  if (!response.ok) return `download failed with HTTP ${response.status}`;

  const hash = createHash("sha256");
  let size = 0;
  for await (const chunk of response.body) {
    size += chunk.length;
    if (size > download.sizeBytes)
      return `file is larger than the listed ${download.sizeBytes} bytes`;
    hash.update(chunk);
  }
  if (size !== download.sizeBytes)
    return `file is ${size} bytes, but ${download.sizeBytes} are listed`;

  const actual = hash.digest("hex");
  return actual === download.sha256
    ? null
    : `SHA-256 is ${actual}, but ${download.sha256} is listed`;
}

export function loadRepository(root) {
  const errors = [];
  const games = loadJsonFiles(root, "games", errors);
  const trainers = loadJsonFiles(root, "manifests", errors);
  errors.push(...validateData(games, trainers));
  return { games, trainers, errors };
}

export function buildCatalog(games, trainers, commit = null, now = new Date()) {
  const byPath = (a, b) => (a.path < b.path ? -1 : 1);
  const catalog = {
    schemaVersion: 1,
    generatedAt: now.toISOString(),
    commit,
    games: [...games].sort(byPath).map((entry) => entry.data),
    trainers: [...trainers].sort(byPath).map((entry) => entry.data),
  };
  const errors = schemaErrors(validateCatalogSchema, catalog, "catalog");
  if (errors.length > 0) throw new Error(errors.join("\n"));
  return catalog;
}
