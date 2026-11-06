import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import {
  buildCatalog,
  checkImmutability,
  checkRepositoryFiles,
  loadRepository,
  validateData,
  verifyDownload,
} from "./lib.mjs";

const examples = loadRepository("examples");
const game = examples.games[0];
const trainer = examples.trainers[0];

function errorsWith(change) {
  const copy = structuredClone(trainer);
  change(copy.data);
  return validateData([game], [copy]);
}

const download = (change) =>
  errorsWith((data) => change(data.releases[0].download));

test("examples are valid", () => {
  assert.deepEqual(examples.errors, []);
  assert.equal(examples.trainers.length, 1);
});

test("catalog builds from the examples", () => {
  const catalog = buildCatalog(examples.games, examples.trainers);
  assert.equal(catalog.trainers[0].id, "example-trainer");
});

test("rejects a malformed hash", () => {
  assert.notEqual(download((d) => (d.sha256 = "ABC")).length, 0);
});

for (const url of [
  "http://github.com/example-author/x/releases/download/v1/a.exe",
  "https://evil.example/example-author/x/releases/download/v1/a.exe",
  "https://github.com.evil.example/example-author/x/releases/download/v1/a.exe",
  "https://github.com/example-author/x/raw/main/a.exe",
  "https://github.com/example-author/x/releases/download/../a.exe",
  "https://github.com/example-author/x/releases/download/v1/..",
  "https://github.com/example-author/x/releases/download/v1/a.exe?x=1",
]) {
  test(`rejects download URL ${url}`, () => {
    assert.notEqual(download((d) => (d.url = url)).length, 0);
  });
}

test("rejects a path in the file name", () => {
  assert.notEqual(download((d) => (d.fileName = "..\\..\\a.exe")).length, 0);
});

test("rejects DLLs in schema v1", () => {
  assert.notEqual(errorsWith((m) => (m.releases[0].format = "dll")).length, 0);
});

test("rejects a false attestation", () => {
  assert.notEqual(
    errorsWith((m) => (m.attestations.noAntiCheatBypass = false)).length,
    0,
  );
});

test("requires a reason to revoke", () => {
  assert.notEqual(
    errorsWith((m) => (m.releases[0].status = "revoked")).length,
    0,
  );
});

test("requires evidence for permission hosting", () => {
  assert.notEqual(
    errorsWith((m) => (m.distribution = { hostedBy: "permission" })).length,
    0,
  );
});

test("author hosting must match the URL owner", () => {
  const errors = errorsWith((m) => (m.author.github = "someone-else"));
  assert.ok(errors.some((e) => e.includes("isn't author.github")));
});

test("rejects duplicate release versions", () => {
  const errors = errorsWith(
    (m) => (m.releases[1].version = m.releases[0].version),
  );
  assert.ok(errors.some((e) => e.includes("duplicate release version")));
});

test("rejects a manifest in the wrong path or for an unknown game", () => {
  const errors = errorsWith((m) => (m.gameId = "other-game"));
  assert.ok(errors.some((e) => e.includes("file must be")));
  assert.ok(errors.some((e) => e.includes("unknown game")));
});

test("published releases are immutable", () => {
  const edited = structuredClone(trainer.data);
  edited.releases[0].download.sha256 = "0".repeat(64);
  assert.equal(checkImmutability(trainer.data, edited, "m").length, 1);

  const removed = structuredClone(trainer.data);
  removed.releases.pop();
  assert.ok(
    checkImmutability(trainer.data, removed, "m")[0].includes(
      "revoke it instead",
    ),
  );

  const revoked = structuredClone(trainer.data);
  revoked.releases[0].status = "revoked";
  revoked.releases[0].statusReason = "Unsafe.";
  assert.deepEqual(checkImmutability(trainer.data, revoked, "m"), []);
});

test("rejects binaries in the repository", () => {
  const dir = mkdtempSync(join(tmpdir(), "opentrainer-"));
  try {
    writeFileSync(join(dir, "Trainer.EXE"), "x");
    assert.equal(checkRepositoryFiles(dir).length, 1);
  } finally {
    rmSync(dir, { recursive: true });
  }
});

test("verifies download size and hash", async () => {
  const body = Buffer.from("foo");
  const sha256 =
    "2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae";
  const serve = async () => new Response(body);
  const check = (expected) =>
    verifyDownload({ url: "https://x", ...expected }, serve);

  assert.equal(await check({ sha256, sizeBytes: 3 }), null);
  assert.match(
    await check({ sha256: "0".repeat(64), sizeBytes: 3 }),
    /SHA-256/,
  );
  assert.match(await check({ sha256, sizeBytes: 2 }), /larger/);
  assert.match(await check({ sha256, sizeBytes: 4 }), /listed/);
  assert.match(
    await verifyDownload(
      { url: "https://x" },
      async () => new Response("", { status: 404 }),
    ),
    /404/,
  );
});
