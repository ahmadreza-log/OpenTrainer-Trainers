# Security Policy

## Report a malicious or compromised trainer

Report privately through GitHub: open this repository's **Security** tab and choose **Report a vulnerability**. Include the game ID, trainer ID, release version and your evidence.

Maintainers respond by setting that release's `status` to `revoked`, and the next published catalog marks it as revoked. The OpenTrainer app refuses revoked releases, but an offline copy only learns about a revocation once it next updates its catalog.

This is a volunteer project, so we can't promise fixed response times. Reports of harmful trainers take priority over other work.

## Also in scope

- Ways to get an unreviewed change into the published catalog
- Flaws in validation that let a file skip size, hash or policy checks
- Workflow permission problems

## Antivirus detections

An antivirus alert alone isn't proof of malware, because trainers modify other processes' memory and are commonly flagged for it. An alert isn't proof of safety either. Please send the detection details along with any behavior you observed.

## Limits

Catalog listing is not an endorsement. A matching SHA-256 hash shows only that a file matches its catalog entry. See the [README](README.md) for what review can and can't do.
