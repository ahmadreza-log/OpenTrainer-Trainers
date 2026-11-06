# Contributing a Trainer

You submit metadata through a pull request. You never upload a binary here.

## Requirements

A trainer is accepted only if all of these are true:

- It targets single-player or offline gameplay.
- It doesn't bypass or evade anti-cheat.
- It doesn't bundle adware, miners, installers or other unrelated software.
- It's a single `.exe` file, up to 500 MiB, attached to a GitHub Release.
- You're the author, or the author's license or written permission allows it to be listed and hosted where you link to.

Archives and DLL plugins aren't supported yet.

## Steps

1. **Choose your identifiers.** IDs use lowercase letters, numbers and hyphens, such as `example-game`.
2. **Add the game** if it's missing, at `games/<game-id>.json`. See [the example](examples/games/example-game.json).
3. **Add the manifest** at `manifests/<game-id>/<trainer-id>.json`. See [the example](examples/manifests/example-game/example-trainer.json).
4. **Get the hash and size** of the exact file on the release:

   ```powershell
   Get-FileHash .\Trainer.exe -Algorithm SHA256
   (Get-Item .\Trainer.exe).Length
   ```

   Write the hash in lowercase.

5. **Run the checks:**

   ```bash
   npm ci
   npm run format
   npm run validate
   ```

6. **Open a pull request** and fill in the template, including the licensing evidence described below.

## Game versions

`gameVersions` must name versions the author says are supported, such as `1.2.0` or `0.80.34.0 (Xbox / Microsoft Store)`. Use `any` only if the author says it works on every version. If the author doesn't name a version, ask them to. Don't guess from your own testing alone or leave a vague label, because such a submission will be declined.

## Hosting

Set `distribution.hostedBy` to one of these:

- **`author`:** the release is in the author's own GitHub account. Set `author.github`, and CI checks that the account owns the download URL.
- **`permission`:** someone else hosts it. Set `distribution.permissionUrl` to a public page showing the permission.

Only `https://github.com/<owner>/<repo>/releases/download/<tag>/<file>` links are accepted.

## Licenses

Trainers aren't assumed to share a license. Set `license.name` and link to the terms in `license.url`. Add `license.spdxId` if there's a single matching [SPDX identifier](https://spdx.org/licenses/). CI rejects unknown identifiers. A trainer without a clear right to distribute it will be declined.

### Licensing evidence

Being publicly downloadable doesn't mean a trainer can be listed. Include this in your pull request:

| Evidence                              | What to provide                                                                                            |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| License                               | A link to the license at the release's tag, not just the default branch.                                   |
| Authorship                            | Why the release account is the real author, such as matching commit history and license holder.            |
| Bundled dependencies                  | The licenses of anything compiled into the executable. An MIT repository can still ship a copyleft binary. |
| Permission, if hosted by someone else | A public link where the author grants permission. A private message isn't enough.                          |
| Source, if available                  | A link to the source at the release's tag, and how the file was built if you know.                         |

Maintainers record what they found in the [evidence log](docs/catalog-evidence.md), including anything they couldn't verify.

By contributing, you agree that your metadata in `games/`, `manifests/` and `examples/` is released under [CC0 1.0](LICENSE-CC0), and everything else under the [MIT License](LICENSE). This covers your submission only, not the trainer it describes. Don't copy descriptions or other text you don't have the right to release this way.

## Updating a trainer

Add a new entry to the `releases` array. Published entries are immutable: CI rejects deleting one, changing its URL, file name, hash or size, or turning off `requiresElevation`.

Revocation is permanent. CI rejects changing a revoked release back, and listing the same file again anywhere in the catalog. Reversing a mistaken revocation needs a maintainer to deliberately override the checks.

To withdraw a release, change its `status` and add a `statusReason`:

| Status       | Meaning                                                |
| ------------ | ------------------------------------------------------ |
| `active`     | Available                                              |
| `deprecated` | Replaced or outdated, and shouldn't be newly installed |
| `revoked`    | Unsafe or unlawful, and the app must refuse to use it  |

## What review covers

**CI checks:**

- Schema and repository policy
- No binaries in the repository
- The linked file's size and SHA-256 hash, without ever running it
- That published releases haven't changed
- That an author-hosted release belongs to the GitHub account listed, which doesn't prove that account wrote the trainer

**Maintainers check:**

- Whether the metadata looks accurate and the listed author is the real author
- License and permission evidence, by opening the links
- The single-player and anti-cheat rules
- Any changes to scripts, schemas or workflows

**Nobody can guarantee** that a closed-source binary is safe. Passing review doesn't mean that it is.

## Copyright or policy concerns

If you own a listed trainer and want it removed, open a **Policy or license report**. For suspected malware, report privately as described in [SECURITY.md](SECURITY.md).
