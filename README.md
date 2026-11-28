# Way to Doomsday

An unofficial, non-commercial fan website for planning a Marvel watch order and
tracking the road to *Avengers: Doomsday*. Not affiliated with or endorsed by
Marvel Studios, Disney, or TMDB. Built by [ayushcmd](https://github.com/ayushcmd).

## Current website

- Search the curated film/series catalogue by title, year or cast; switch between
  story/release order, timeline/grid views and phase/type filters.
- Mark titles watched without an account. The timeline, character playlists and
  15-title Disney+ recommended Doomsday checklist share progress for matching IDs.
  The checklist includes two Fox X-Men films; it is separate from MCU chronology.
- View the release countdown, Road to Doomsday rail and five character spotlight
  pages. The countdown target is configured in `CountdownTimer.jsx`.
- Browse the confirmed-cast carousel and searchable evidence modal. The
  November 28, 2026 snapshot has **32 confirmed characters** (including Kate Bishop),
  **4 official-preview identifications**, **1 unresolved reported candidate**,
  **8 speculative candidates**, and **2 actors with undisclosed roles**. These
  counts are separate; preview footage and rumors are not formal confirmation.
- Actor thumbnails use verified TMDB person/profile metadata, lazy loading and
  initials on missing, failed or expired images. Portraits do not prove casting.
- Submit ordinary feedback through the Formspree enquiry widget. For sensitive
  security reports use [SECURITY.md](SECURITY.md), not that widget or public issues.

This is a curated fan reference, not a guarantee of exhaustive coverage, future
release dates, final-film appearances or the availability/authorization of external
watch links. See [content and asset notices](THIRD_PARTY_NOTICES.md).

## Local setup

Requires **Node.js >=22.12.0** (from [package.json](package.json)), npm and Git.
Use the committed lockfile; no credentials are required to build or run tests.

```sh
git clone https://github.com/ayushcmd/waytodoomsday.git
cd waytodoomsday
npm ci
npm run dev -- --background
```

Astro prints the local URL (normally `http://localhost:4321`). Manage the
background server as required by [AGENTS.md](AGENTS.md) and [CLAUDE.md](CLAUDE.md):

```sh
npm run dev -- status
npm run dev -- logs
npm run dev -- stop
```

```sh
node --test tests/*.test.js
npm run build
npm run preview
```

The test command runs the existing cast, evidence and portrait tests; there is
no `npm test` script. Build outputs seven static routes to `dist/`. Preview serves
that output locally; stop preview with Ctrl+C.

### Optional portrait refresh

Copy [.env.example](.env.example) to an ignored `.env` **in your checkout**, then
set `TMDB_API_READ_ACCESS_TOKEN` locally. Set `TMDB_LICENSE_REVIEWED=1` only after
reviewing the applicable TMDB terms and your use. Never use a `PUBLIC_` token,
paste credentials into reports, or commit `.env`.

```sh
npm run portraits:refresh
npm run portraits:refresh -- --evidence
```

These explicit development commands update the confirmed and other-evidence
rosters respectively. Builds do not fetch TMDB data. Missing credentials make
refresh a no-op, leaving stored metadata intact. Review each identity/credit and
JSON diff before committing. See [TMDB procedures](docs/tmdb-portraits.md) for
attribution, expiry, clearing metadata and licensing; see
[cast evidence](docs/doomsday-evidence.md) before changing any casting status.

## Architecture and data

Astro 7 generates static pages with React 19 islands. Tailwind CSS 4 and plain
CSS style the site; Framer Motion handles selected animation. Vite and the Astro
React integration build the project. `hls.js` is installed but currently unused
by source imports; background footage uses native video. Exact resolved versions
and dependency licenses are recorded in [package-lock.json](package-lock.json).

| Path | Purpose |
| --- | --- |
| [src/pages](src/pages) | Home, privacy page and five generated character routes |
| [src/components](src/components) | Timeline, countdown, cast modal, watchlist and enquiry widget |
| [src/data/movies.json](src/data/movies.json) | Catalogue, stable title IDs, chronology and external links |
| [src/data/characters.js](src/data/characters.js) | Five spotlight/character playlists |
| [src/data/doomsdayCast.json](src/data/doomsdayCast.json) | Confirmed cast and portrait metadata |
| [src/data/doomsdayCandidates.json](src/data/doomsdayCandidates.json) | Preview, reported, speculative and actor-only evidence |
| [src/data/doomsdayEvidence.js](src/data/doomsdayEvidence.js) | Evidence partitioning, validation and counts |
| [src/hooks/useWatched.js](src/hooks/useWatched.js) | Shared local watch progress |
| [scripts/refresh-doomsday-portraits.mjs](scripts/refresh-doomsday-portraits.mjs) | Development-only portrait resolver |
| [public](public) | Posters, branding, icons and background footage; rights vary |
| [docs](docs/README.md) | Editorial sources, maintenance and review notes |

Watch status uses browser local storage key `waytodoomsday:watched`; view and
sort preferences use `waytodoomsday:view` and `waytodoomsday:sortMode`. No account
or cloud backup is implemented. Progress stays in that browser/origin; clearing
site data, private sessions or changing deployment domains can lose it. Export
important data before clearing storage. Do not change stable title IDs casually.

## Deployment and privacy considerations

Deploy `dist/` to a static host after `npm ci` and `npm run build`. Preserve asset
paths and generated character directories. Review third-party rights and outbound
links before publication. No hosting configuration or deployment is added here.

TMDB credentials are not needed on the host. Stored profile paths produce requests
to TMDB's image CDN; Google Fonts and the TMDB logo also load externally. Submitting
feedback sends the message and enquiry type to Formspree. The existing form
endpoint is client-visible, not a private API credential; forks should configure
their own endpoint before accepting feedback. Do not put account secrets in it.
Host/provider logging and third-party processing are outside local watch storage.

The [website privacy page source](src/pages/privacy-policy.astro) exists, but its
no-personal-data and official-links-only statements need owner reconciliation
with current behavior. This README does not promise those practices. See the
[documented review items](docs/community-review.md).

## Contributing, help and rights

Start with [CONTRIBUTING.md](CONTRIBUTING.md), [SUPPORT.md](SUPPORT.md),
[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md), [SECURITY.md](SECURITY.md) and the
[documentation index](docs/README.md). Verified merged changes are recorded in
[CHANGELOG.md](CHANGELOG.md); package version `0.0.1` is not a release history.

The [MIT license](LICENSE) covers original project code/documentation only where
the copyright holder has the relevant rights. Marvel/Disney characters, titles,
posters, footage, photographs, trademarks and other third-party material are
excluded. Dependencies and adapted documents retain their own terms. Read
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) before reuse or distribution;
fan status and attribution do not establish permission.
