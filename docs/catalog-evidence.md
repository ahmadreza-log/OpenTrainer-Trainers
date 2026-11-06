# Catalog Evidence Log

Why each trainer was accepted or rejected, and what couldn't be verified. Add a row or section whenever a trainer is added or declined.

A listing isn't an endorsement. None of these files were run during review, and no binaries are stored in this repository.

## Accepted

Reviewed on 2026-11-06. Both entries link to the author's own GitHub Release, so nothing is mirrored.

### God Hand Trainer 1.0.1

| Item             | Evidence                                                                                                                                                                                                                                       |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Source           | [AFreoN/godhand-trainer at v1.0.1](https://github.com/AFreoN/godhand-trainer/tree/v1.0.1)                                                                                                                                                      |
| Author           | The commit author and `LICENSE` holder are both Sahid Afridi. The account is named the same and dates from 2019.                                                                                                                               |
| License          | [MIT at the release tag](https://github.com/AFreoN/godhand-trainer/blob/v1.0.1/LICENSE). The project has no third-party package references, and the file also contains the .NET runtime.                                                       |
| Build            | The [release workflow](https://github.com/AFreoN/godhand-trainer/blob/v1.0.1/.github/workflows/release.yml) built and uploaded the file ([run](https://github.com/AFreoN/godhand-trainer/actions/runs/25503804401)) from tag commit `a89ee44`. |
| File             | x64 Windows executable, unsigned, 51,681,149 bytes. The embedded manifest requests administrator rights.                                                                                                                                       |
| SHA-256          | `1130423636ae7142e1cfb34a9e09c7ba331043b95ef978c47b7674eac1c77295`, matching GitHub's published digest                                                                                                                                         |
| Compatibility    | The [release notes](https://github.com/AFreoN/godhand-trainer/releases/tag/v1.0.1) name PCSX2 1.6.0 (32-bit).                                                                                                                                  |
| Scope            | Attaches only to `pcsx2.exe`. A source search at the tag found no network or process-launching calls.                                                                                                                                          |
| Windows Defender | No threats found                                                                                                                                                                                                                               |

**Not verified:**

- Which God Hand disc region it supports. The author doesn't say, and memory addresses can differ by region.
- That it works, because it wasn't run.
- That the single-player attestations are the author's. The reviewer made them from the source and from the game being a PS2 title.

The author's later commits add features after 1.0.1, so `cheats` lists only what's in the release source.

### Olden Era Trainer 0.1.0

| Item             | Evidence                                                                                                                                                                           |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Source           | [2012952877/olden-era-trainer at v0.1.0](https://github.com/2012952877/olden-era-trainer/tree/v0.1.0)                                                                              |
| Author           | The commit author and `LICENSE` holder are both Deon Chen. The account is named the same and dates from 2019.                                                                      |
| License          | [MIT at the release tag](https://github.com/2012952877/olden-era-trainer/blob/v0.1.0/LICENSE). The build references only .NET Framework assemblies.                                |
| Build            | Uploaded by the author. The source is one C# file with a `build.cmd`, but the file wasn't rebuilt or compared.                                                                     |
| File             | x64 .NET executable, unsigned, 23,040 bytes. The embedded manifest uses `asInvoker`, so it doesn't request administrator rights.                                                   |
| SHA-256          | `ac02a1f5f331b982339b2e61672f9814595a44bf56c3e0d7f687848b33ab1833`, matching GitHub's published digest                                                                             |
| Compatibility    | The [README](https://github.com/2012952877/olden-era-trainer/blob/v0.1.0/README.md) names Xbox version 0.80.34.0. The Steam version isn't claimed.                                 |
| Scope            | The source checks for `EPlay.Local` before each write and treats network games and replays as read-only. The executable contains the matching message. No network calls in source. |
| Windows Defender | No threats found                                                                                                                                                                   |

**Not verified:**

- That the executable was built from this source, or that the guard works in a real multiplayer game.
- Whether the game has anti-cheat. The trainer doesn't claim to bypass any.
- That the attestations are the author's. They were made from the author's `SECURITY.md` and source.

**For maintainers to weigh:** this game has online multiplayer. The trainer also allows local hotseat play, which is multiple people on one PC. The repository has one commit and few downloads, so it has little track record.

## Rejected

Reviewed on 2026-11-06.

| Repository                                                                                          | Reason                                                                                                                                                                                       |
| --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Tanishq-JM/Project-IGI-Offline-Trainer](https://github.com/Tanishq-JM/Project-IGI-Offline-Trainer) | MIT and a strong candidate, but the author only says "32-bit build". Without a named version, neither an exact version nor `any` would be true. Could be accepted once the author names one. |
| [un4ckn0wl3z/pvz-trainer-slint](https://github.com/un4ckn0wl3z/pvz-trainer-slint)                   | The repository is MIT, but the binary links `libmem` (AGPL-3.0 on crates.io) and Slint, with no Slint attribution found. The binary's license is unclear.                                    |
| [ThisKo0/PvZTrainer](https://github.com/ThisKo0/PvZTrainer)                                         | The release also carries `Plants.vs.Zombies.rar`, which looks like a copy of the game. Not downloaded.                                                                                       |
| [RebeloX/TrainerX](https://github.com/RebeloX/TrainerX)                                             | Its README describes a cheat for SA:MP, a multiplayer mod.                                                                                                                                   |
| [MayconRobert/MinesweeperXPTrainer](https://github.com/MayconRobert/MinesweeperXPTrainer)           | The only tested game build is a Microsoft executable linked from the Web Archive, with no clear lawful source. It names no version either.                                                   |
| [xCaptainTroy/trainerforge](https://github.com/xCaptainTroy/trainerforge)                           | A general toolkit with no game of its own, so it doesn't fit a per-game manifest.                                                                                                            |
| [az-trainer-app/az_trainer](https://github.com/az-trainer-app/az_trainer)                           | Multi-game, and third-party search results say it downloads scripts on first launch, so a listed hash wouldn't cover what runs. Not inspected further.                                       |
| [sailro/EscapeFromTarkov-Trainer](https://github.com/sailro/EscapeFromTarkov-Trainer)               | Targets an online game that uses anti-cheat.                                                                                                                                                 |
| [MAFINS/MenyooSP](https://github.com/MAFINS/MenyooSP)                                               | Rejected from its description: a mod menu for GTA V, a game with a large online mode. Archived and not inspected further.                                                                    |

**Blocked by the EXE-only rule (decision D3), not by any finding against them:** [geedium/pvz-trainer](https://github.com/geedium/pvz-trainer), [Puh00/Resident-Evil-5-Trainer](https://github.com/Puh00/Resident-Evil-5-Trainer), [CN-Scars/MisideTrainer](https://github.com/CN-Scars/MisideTrainer), [Eveldee/NobetaTrainer](https://github.com/Eveldee/NobetaTrainer), [oppahansi/metroexodustrainer](https://github.com/oppahansi/metroexodustrainer), [JKAnderson/DS-Gadget](https://github.com/JKAnderson/DS-Gadget), [JKAnderson/DSR-Gadget](https://github.com/JKAnderson/DSR-Gadget), [veeenu/darksoulsiii-practice-tool](https://github.com/veeenu/darksoulsiii-practice-tool) and [Sivenesis/MD2Trainer](https://github.com/Sivenesis/MD2Trainer) all ship archives. Their licenses and scope weren't reviewed.

**Spam pattern:** GitHub search returns many recent repositories with near-identical pitches, about 56 stars, HTML-only or no real source, and words like "undetected". They weren't downloaded or listed. Treat this pattern as a warning sign.
