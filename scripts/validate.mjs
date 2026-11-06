import { checkRepositoryFiles, loadRepository } from "./lib.mjs";

const root = process.cwd();
const { games, trainers, errors } = loadRepository(root);
errors.push(...checkRepositoryFiles(root));

if (errors.length > 0) {
  console.error(errors.join("\n"));
  console.error(`\n${errors.length} problem(s) found.`);
  process.exit(1);
}
console.log(`Valid: ${games.length} game(s), ${trainers.length} trainer(s).`);
