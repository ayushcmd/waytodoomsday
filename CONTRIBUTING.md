# Contributing

Follow the [code of conduct](CODE_OF_CONDUCT.md). Use [support](SUPPORT.md) for
questions and [private reporting](SECURITY.md) for vulnerabilities. Never post
credentials or private exploit details in an issue or PR.

## Before changing files

Read the [README setup](README.md#local-setup), [AGENTS.md](AGENTS.md),
[CLAUDE.md](CLAUDE.md) and relevant [editorial guides](docs/README.md). Install
Node >=22.12.0 and use `npm ci`. A TMDB token is optional, not required for tests.

Search existing issues/PRs first. Discuss substantial feature, content-policy or
design changes in an issue. Fork the repository, fetch the latest upstream main,
and create a focused branch from it. Preserve unrelated work; avoid destructive
resets or force pushes. Explain the purpose of small, focused commits. Prefixes
such as `docs:`, `fix:` and `feat:` are welcome, not mandatory.

## Implementation and editorial rules

- Follow nearby Astro/React conventions, existing CSS and component boundaries.
  Avoid unrelated formatting or dependency churn. Consult the Astro guides linked
  in AGENTS.md for relevant component, routing or style work.
- Preserve existing routes, countdown, carousel, search, keyboard focus, mobile
  behavior and watch-progress keys/IDs. Explain any intentional migration.
- For catalogue/cast corrections, cite dated primary Marvel/Disney sources where
  available. Identify the actor, character and variant/continuity precisely;
  distinguish a performer returning as a different character from a returning role.
- Follow [cast evidence rules](docs/doomsday-evidence.md). Keep confirmed,
  preview, reported, speculative and actor-only records separate. Do not promote
  rumors, related-series teases, writing credits or TMDB portraits into casting
  confirmation. Retain denials, retractions, evidence dates and source links.
- Review portraits through the existing [TMDB workflow](docs/tmdb-portraits.md).
  Do not infer identity from the first search result or alter original cast data
  merely to match an image. Keep secrets out of commands, fixtures and screenshots.
- Submit original work or material you have permission to contribute; document
  provenance, license and required attribution. Do not upload copyrighted posters,
  footage, photos or other assets without an established basis for distribution.
  Project MIT terms do not relicense third-party content. No CLA is imposed here.

## Validate and open a PR

```sh
node --test tests/*.test.js
npm run build
git diff --check
```

For interactive/visual changes, use the background dev commands in the README;
check narrow/mobile and desktop widths, keyboard navigation, dialog Escape/focus
restoration, search/filter empty states and watch-progress preservation. Include
before/after screenshots when helpful, with private details removed. Document
untested devices or accessibility limitations. Documentation-only changes need
link/path and command checks, not invented UI screenshots.

Open a PR against `ayushcmd/waytodoomsday:main` using the template. Link the issue,
explain user-visible results, list actual checks and cite editorial evidence.
Review the full diff for secrets, generated files and asset rights. Never commit
`.env`, `node_modules/` or `dist/`. Flag licensing/privacy questions explicitly;
wait for maintainer review and do not assume an unmerged proposal is policy.
