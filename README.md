# OpenTrainer Trainers

The community catalog for [OpenTrainer](https://github.com/ahmadreza-log/OpenTrainer). It holds metadata that describes game trainers and where to download them.

> **Status: the catalog has its first entries, and the validation tools work.** The OpenTrainer app reads this catalog, but it hasn't had a public release yet. See the [evidence log](docs/catalog-evidence.md) for what was reviewed and what couldn't be verified.

This repository contains **no trainer binaries**. Files stay in GitHub Releases, published by their authors or with their permission.

## Before you rely on this catalog

Listing here is not an endorsement or a safety guarantee. Automated checks and maintainer review cover metadata and policy. They can't prove that a closed-source executable is harmless, and a matching SHA-256 hash only shows that the file is the one listed.

Trainers are for single-player and offline gameplay. Anti-cheat bypasses and competitive multiplayer manipulation aren't accepted.

## Layout

| Path                                    | Purpose                                            |
| --------------------------------------- | -------------------------------------------------- |
| `games/<game-id>.json`                  | One record per game                                |
| `manifests/<game-id>/<trainer-id>.json` | One manifest per trainer, listing its releases     |
| `schemas/`                              | JSON Schemas for games, manifests and the catalog  |
| `scripts/`                              | Validation, catalog build and download checks      |
| `examples/`                             | Fictional fixtures, never published                |
| `docs/catalog-evidence.md`              | Review evidence for accepted and rejected trainers |

## The catalog

On each merge to `main`, CI publishes a generated file as a release asset. Never edit it by hand:

```text
https://github.com/ahmadreza-log/OpenTrainer-Trainers/releases/download/catalog/catalog.v1.json
```

It has this shape, and [`examples/catalog.v1.example.json`](examples/catalog.v1.example.json) shows a complete copy:

```json
{
  "schemaVersion": 1,
  "generatedAt": "2026-11-06T12:00:00.000Z",
  "commit": "<source commit, or null>",
  "games": [],
  "trainers": []
}
```

`games` holds the game records and `trainers` holds the full manifests, so the app can work offline from this one file.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). To report a dangerous trainer, follow [SECURITY.md](SECURITY.md). All participants follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Local checks

These need Node.js LTS:

```bash
npm ci
npm run validate
npm test
npm run format:check
```

## License

| Content                                                                  | License                |
| ------------------------------------------------------------------------ | ---------------------- |
| Catalog metadata: `games/`, `manifests/`, `examples/`, generated catalog | [CC0 1.0](LICENSE-CC0) |
| Everything else, including scripts, schemas, workflows and documentation | [MIT](LICENSE)         |

**Neither license covers trainers.** Trainers listed here are third-party works under their own terms, and each manifest records them. Names and trademarks mentioned in the metadata also stay with their owners.
