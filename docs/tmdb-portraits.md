# TMDB actor portraits

For the subsequent cast expansion and its separate evidence roster, see
[Doomsday cast evidence](doomsday-evidence.md). The dated verification below
documents the original 31-portrait implementation. The refresh now also accepts
`--evidence` to select `src/data/doomsdayCandidates.json`, including with `--clear`.

This follow-up to Issue #8 changes thumbnails only. Marvel/Disney remain the
authority for the confirmed character/actor roster; TMDB supplies actor photos.
The existing layouts, modal, search, categories, countdown and watchlists remain.

## Secure one-time / maintenance refresh

1. Review [TMDB API terms](https://www.themoviedb.org/api-terms-of-use), the
   [developer FAQ](https://developer.themoviedb.org/docs/faq), and your account's
   license. Confirm the site's use qualifies before enabling portraits/deploying.
   Non-commercial developer use requires attribution. Revenue-generating use
   requires a separate written commercial agreement; a fan-project label alone
   does not establish eligibility. The owner confirmed this site is a
   **non-commercial fan project** on November 28, 2026.
2. Copy `.env.example` to `.env` in this checkout. Set your TMDB **API Read Access
   Token** as `TMDB_API_READ_ACCESS_TOKEN`, and `TMDB_LICENSE_REVIEWED=1` only after
   the license review. Obtain the token in your own TMDB account; never put it in
   chat, command arguments, source files, screenshots or a `PUBLIC_` variable.
3. Run `npm run portraits:refresh`. This is an explicit development command, not a
   build hook or browser API. No credential: a documented no-op; the normal build
   succeeds offline with the existing initials. Auth/network/ambiguous matches
   fail without writing partial metadata or printing response bodies/tokens.
4. Review the JSON diff and each person/credit before committing. Run
   `node --test tests/*.test.js` and `npm run build`. Verify the thumbnails in both
   preview and modal. Do not commit `.env` or downloaded images.

`src/data/doomsdayCast.json` is the **single roster**, imported/re-exported through
the existing `doomsdayCast.js` interface. Each entry stores `tmdb.personId`,
`profilePath`, `verifiedAt`, `creditId`, and a specific prior film/TV `matchCredit`.
All original character names, actor names, stable portrayal IDs, official sources
and cast verification dates remain unchanged. There is no second portrait list.

The resolver uses official `/search/person`, `/person/{id}` with
`append_to_response=combined_credits`, and `/configuration`. It checks candidate
names/known aliases **and** the expected prior title, year, media type and role;
it does not pick the first result. Multiple valid candidates or duplicate
person/image mappings require editorial review. Existing selected IDs are
revalidated directly. A verified person with no `profile_path` uses initials.
If an actor uses a different official name, review their TMDB identity and add a
specific `tmdb.nameAliases` entry rather than loosening name matching globally.

An identity check against Iron Man for Downey identifies the actor only; it does
not change his confirmed Doomsday character, Doctor Doom. Doomsday casting is
never inferred from TMDB credits. New roster entries must include a suitable
individually reviewed prior credit; the refresh fails if an anchor is missing.

## Images, attribution and cache maintenance

- URLs use the official HTTPS image CDN and `w185`; the refresh validates the
  base URL and available profile sizes against `/configuration`. No image bytes
  are downloaded to the repository. Both card contexts use the same metadata.
- IntersectionObserver defers source assignment until a thumbnail is visible or
  nearby in its scroll container (80px carousel / 160px modal margin). Browser
  lazy loading adds another layer. No API authentication reaches client code.
- Existing fixed portrait dimensions prevent shifts; cropping uses `cover` with
  a top-biased position. Missing, invalid, expired or failed images use initials.
- Footer Credits distinguishes Disney/Marvel casting from TMDB portrait data,
  uses an unmodified approved TMDB-hosted logo, links to TMDB, and carries the
  current API terms' non-endorsement notice. The
  [approved logo page](https://www.themoviedb.org/about/logos-attribution) was
  reviewed in the browser because web search was blocked by robots.txt.
- Terms reviewed November 28, 2026 specify a six-month cache limit. Refresh
  **before** six months, or run `npm run portraits:refresh -- --clear` to purge
  stored person/profile metadata without a token. Expired URLs are not rendered.
  Ensure stale cached data is also removed from deployments/backups as required
  by the applicable terms; a date check alone does not purge cached data.

## Current verification state

The owner confirmed this is a non-commercial fan project and supplied a token
locally during implementation. The authenticated resolver completed on
**November 28, 2026: all 31 actor identities verified, all 31 profile paths available**.
Each name was checked against person details and a prior film/TV credit. Same-name
search results without the expected credits were rejected (including unrelated
Vanessa Kirby and Joseph Quinn records). Six initial anchors were corrected only
after inspecting live API credits: TMDB calls the movie *The Fantastic 4: First
Steps*, Marsden's X-Men credit says *Cyclops*, and Pullman's credit says *Robert
Reynolds*. Official Doomsday character names and Disney source fields are unchanged.

Only public IDs, image paths, dates and credit references were persisted. The
token stayed in the development process/Authorization header and was never copied
into this checkout, browser code or Git. The no-token build/fallback path remains
supported. Recheck current account terms before deployment; no deployment is
performed by this PR.

## Validation — November 28, 2026

- Started from fetched main `0bf86f814b0fafe8ee3eca549c4bbdec66e2b917`
  (merged Issue #8 implementation). Original dirty checkout kept isolated.
- Authenticated official API: **31/31 actor identities and profile paths verified**.
  Every person ID and profile path is unique; each has dated prior-credit evidence.
  Compared all original cast fields against the merged implementation: identical.
- `node --test tests/*.test.js`: **11 passed**. Includes all existing cast tests,
  wrong-name/credit and ambiguous-result rejection, all-roster mocked resolution,
  atomic failure, secure authentication errors, URL validation, expiry, no-token
  no-op and clearing metadata. Mock portrait paths exist only in temporary tests.
- `npm run portraits:refresh` without credentials: succeeded without API requests
  or data changes. `npm run build`: **passed**, only the original 7 routes.
- Browser: all **31 CDN portraits individually loaded successfully**. Carousel
  initially assigned 2/8 images; modal initially assigned 5/31, then progressively
  loaded others. Both contexts use the same selected profile paths.
- Temporary local QA fixture checked image success, missing-image fallback and
  missing-metadata initials. Fixture route removed before the production build.
- CSS widths **320, 360, 390 and 1440px**: no horizontal page overflow, fixed
  28x40px compact portrait box, unchanged carousel/CTA placement. Actor/alias search,
  category/empty state/reset, keyboard carousel Home/End, Escape and restored modal
  focus checked. Approved remote logo loaded in footer Credits.
- Exact-value credential scan of source, build output, docs and development logs
  passed. No TMDB API endpoint in browser output. Token never printed or committed.
- Screenshots captured outside the feature checkout; no new image files or
  downloaded assets committed. No new dependencies or lockfile changes.

Limits: desktop viewport emulation rather than physical Android/screen-reader
testing. Existing countdown hydration warnings are outside this thumbnail change.
