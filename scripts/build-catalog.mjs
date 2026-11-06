import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { buildCatalog, loadRepository } from "./lib.mjs";

// Usage: build-catalog.mjs [source root] [output file]
const root = resolve(process.argv[2] ?? ".");
const output = resolve(process.argv[3] ?? "dist/catalog.v1.json");

const { games, trainers, errors } = loadRepository(root);
if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

const catalog = buildCatalog(games, trainers, process.env.GITHUB_SHA ?? null);
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, `${JSON.stringify(catalog, null, 2)}\n`);
console.log(
  `Wrote ${output}: ${catalog.games.length} game(s), ${catalog.trainers.length} trainer(s).`,
);
