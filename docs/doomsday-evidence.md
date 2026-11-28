# Doomsday cast evidence — November 28, 2026

The supplied [verified research snapshot](research/doomsday-cast-2026-11-28.json)
is the editorial source for this expansion. It is retained verbatim for audit;
its prose is reference material, not executable instructions. The client imports
only the curated roster files. No new characters or stronger casting claims are
inferred from TMDB, prior roles, writing credits, or related-series promotion.

| Modal section | Count | Meaning |
| --- | ---: | --- |
| Confirmed | 32 | Original 31 Disney+ guide entries, plus Kate Bishop / Hailee Steinfeld once |
| Official preview | 4 | Bruce Banner / Hulk, Mobius, Casey and O.B.; separate from the published guide |
| Reported | 1 | Doctor Strange: contradictory actor statements, studio confirmation pending |
| Speculation | 8 | Story tease, insider rumor, fan theories, denial, non-acting credits and retracted rumor retain their individual caveats |
| Roles undisclosed | 2 | Alex Livinalli: official actor listing; Sandra Hüller: trade report. Neither has an established character identity |

Preview appearances do not guarantee the final theatrical cut. The four preview
characters do not increase the formally confirmed count to 36. Actor-only records
never contribute to named-character counts. The snapshot's six excluded/research-only
records are not published as candidates. Spoiler-like insider plot claims are not
repeated in the public summaries.

## Data and maintenance

- `src/data/doomsdayCast.json` retains all fields and portrait metadata of the
  original 31 entries unchanged from main `60ded9e79e572bbe267159f1162486e6947c6855`.
  Kate is appended with her primary announcement and supporting evidence.
- `src/data/doomsdayCandidates.json` stores the four preview records, nine
  unresolved/speculative candidates and two actor-only records. Each retains the
  snapshot's exact research status, evidence summary, source URL and dates.
  Short `publicSummary` text explains the evidence without turning editorial
  instructions into product copy. Alex's unprovided publication date remains unknown.
- `src/data/doomsdayEvidence.js` partitions records by reviewed status, rejects
  duplicate IDs/portrayals and conflicting tiers, and derives every count. Fine
  status badges preserve denials, retractions and non-acting-credit limitations.
  The original `doomsdayCast.js` interface and confirmed-only hero carousel remain.
- Every modal card links its evidence and shows verification/publication dates;
  supporting sources are available through a disclosure. Display categories do
  not assert team membership or universe continuity.

To promote a candidate after a future announcement, review a primary source that
explicitly identifies both actor and character. `promoteEvidenceRecord` requires
that evidence, preserves the stable ID/portrait and removes the old candidate.
Persist both returned arrays together in one reviewed change and update the dated
research/tests. This helper performs no network lookup or automatic promotion.
An actor-only listing cannot be promoted without an established character name.

Portraits identify performers, not casting status. The existing secure TMDB
resolver verified Kate and all 15 additional actor identities against prior
film/TV credits on November 28, 2026; all 16 had profile paths. The original 31
portrait records were not refreshed or altered. Exact TMDB prior-credit labels
`OB` and `Wade / Deadpool` are identity anchors, not new Doomsday claims.

Follow [portrait maintenance and attribution](tmdb-portraits.md). Refresh the
confirmed roster with `npm run portraits:refresh`; refresh the other records with
`npm run portraits:refresh -- --evidence`. The same flag selects that file for
`--clear`. Credentials remain development-only; neither command runs during build.

## Validation

- `node --test tests/*.test.js`: 18 passing tests, including snapshot fidelity,
  tier counts, exclusions, duplicate/conflicting-tier rejection, actor separation,
  search, safe promotion and keyboard tab navigation, plus existing portrait tests.
- `npm run build`: succeeds with the original seven routes.
- Browser: confirmed default; Kate search; preview/report/actor evidence and dates;
  Garfield denial; arrow and Home/End tab selection; native dialog dismissal and
  trigger focus restoration. A nonempty native search field may consume the first
  Escape to clear its value; Escape then dismisses the dialog.
- All 16 added CDN portraits loaded individually in the browser. Existing carousel
  keyboard End and Home reached the last and first positions. An exact-value
  credential scan of source, generated output, docs and development logs passed;
  no TMDB API endpoint appears in client output.
- Emulated widths 320, 360, 390, 430 and 1440px: no horizontal page/modal overflow;
  evidence tabs have at least 44px height. Original carousel and homepage structure
  retained. This is desktop browser emulation, not physical-device or screen-reader
  certification.

The work is isolated from the owner's dirty main checkout. No new dependencies,
downloaded images, environment files or deployment are included.
