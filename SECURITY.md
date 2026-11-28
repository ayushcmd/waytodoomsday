# Security policy

## Supported code

This small website maintains the current `main` branch. Older commits, forks and
preview deployments have no separate security-maintenance commitment. There is
no published version support matrix, guaranteed response deadline or bug bounty.

## Report privately

Do not use public issues, PRs, comments or the website enquiry widget for
vulnerability details, credentials or sensitive personal data.

1. On the repository's [Security Advisories page](https://github.com/ayushcmd/waytodoomsday/security/advisories),
   use **Report a vulnerability** if GitHub displays it. Private vulnerability
   reporting is a repository setting; this file does not enable it. GitHub's public
   API reported it **disabled on November 28, 2026**. Use the email below unless
   the owner subsequently enables the GitHub option.
2. If that option is unavailable, email the owner-approved private reporting
   contact [ayush_24a12res897@iitp.ac.in](mailto:ayush_24a12res897@iitp.ac.in).
   Use a subject such as “Way to Doomsday security report”. Send a minimal initial
   description and arrange safe sharing of sensitive evidence; ordinary email is
   not an end-to-end encrypted channel. No encryption key is published here.

Include the affected commit/URL, impact, safe reproduction steps and a minimal
proof of concept using your own test data. Redact tokens, account identifiers and
other people's data. Coordinate publication with the maintainer after assessment
and remediation; a specific timeline must be agreed rather than assumed.

## Safe research and credentials

Prefer a local checkout. Do not access others' data, cause service disruption,
spam forms or test third-party providers without their authorization. Stop and
report privately if a test exposes sensitive data. This policy does not grant
permission to test infrastructure owned by GitHub, TMDB, Formspree or the host.

TMDB tokens belong only in ignored development environment files, never `PUBLIC_`
variables or browser output. Do not share Formspree account credentials or host
secrets. The existing client form endpoint is public by design and is not an
account secret. If a real secret is exposed, revoke/rotate it through its provider
and notify the maintainer privately; deleting a file alone does not remove Git
history or invalidate the credential.

Factual cast errors, broken layout and ordinary usage questions belong in
[SUPPORT.md](SUPPORT.md). Privacy/asset-policy discrepancies recorded in
[review notes](docs/community-review.md) are not proof of an exploitable flaw;
report actual vulnerabilities privately.
