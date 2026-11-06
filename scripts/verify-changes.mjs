import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { checkImmutability, verifyDownload } from "./lib.mjs";

const base = process.argv[2];
if (!/^[a-f0-9]{40}$/.test(base ?? "")) {
  console.error("Usage: verify-changes.mjs <base commit SHA>");
  process.exit(2);
}

const git = (...args) =>
  execFileSync("git", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  });
const paths = git(
  "diff",
  "--name-status",
  "--no-renames",
  base,
  "HEAD",
  "--",
  "manifests/",
)
  .split("\n")
  .filter(Boolean)
  .map((line) => line.split("\t"));

const errors = [];
for (const [status, path] of paths) {
  if (!path.endsWith(".json")) continue;

  let previous = null;
  if (status !== "A") previous = JSON.parse(git("show", `${base}:${path}`));
  const current =
    status === "D" ? { releases: [] } : JSON.parse(readFileSync(path, "utf8"));
  if (previous) errors.push(...checkImmutability(previous, current, path));

  for (const release of current.releases) {
    if (release.status !== "active") continue;
    console.log(`Checking ${path} ${release.version}`);
    const problem = await verifyDownload(release.download).catch(
      (error) => error.message,
    );
    if (problem) errors.push(`${path}: release ${release.version}: ${problem}`);
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Checked ${paths.length} changed manifest(s).`);
