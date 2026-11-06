<!-- Tooling or documentation change? Replace the Submission, Rights and Checklist sections with a summary of what changed and why. -->

## Submission

- **Game:**
- **Trainer:**
- **Change:** <!-- new trainer, new release, deprecation, revocation, or tooling -->
- **Release page:** <!-- link to the GitHub Release -->

## Rights

<!-- See "Licensing evidence" in CONTRIBUTING.md. -->

- **Are you the author?**
- **License at the release tag:**
- **Why this account is the real author:**
- **Licenses of bundled dependencies:**
- **Author's permission, if someone else hosts it:**
- **Where the author names the supported game versions:**

## Checklist

- [ ] No binary files are included
- [ ] `npm run validate` passes
- [ ] I computed the hash and size from the exact file on the release
- [ ] It targets single-player or offline gameplay
- [ ] It doesn't bypass or evade anti-cheat
- [ ] It doesn't bundle unrelated software
- [ ] The license and hosting details are accurate
- [ ] I release my metadata under CC0 1.0 and other changes under MIT, as described in CONTRIBUTING.md
- [ ] I understand that a listing doesn't guarantee safety

## Maintainer review

- [ ] Author and release page look legitimate
- [ ] For `hostedBy: author`, the account is really the trainer's author, not someone re-uploading it (CI only checks that the account owns the release)
- [ ] For `hostedBy: permission`, the link was opened and shows the author's permission
- [ ] The license link was opened and matches the license listed
- [ ] Bundled dependency licenses were checked
- [ ] The result, including anything unverified, was added to `docs/catalog-evidence.md`
- [ ] Changes to scripts, schemas, workflows or dependencies were read line by line, because a passing check means little if the pull request changed the checks
