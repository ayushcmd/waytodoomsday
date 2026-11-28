# Doomsday cast editorial notes

Last checked: **2026-11-28**. The roster describes confirmed character/actor
portrayals in this film, not every possible appearance or a complete leaked cast.

## Official evidence

- [Disney+ character guide](https://www.disneyplus.com/explore/articles/avengers-doomsday-cast-characters),
  revised November 25, 2026: individually checked all 31 character/actor mappings,
  including Namor and Namora in its full list. This supplies every entry's source.
- [Disney+ film overview](https://www.disneyplus.com/explore/articles/avengers-doomsday),
  revised November 27, 2026: cross-checks the named returns and identities. No
  additional character mapping was found beyond the guide's starting list.
- [Disney's original announcement](https://thewaltdisneycompany.com/news/marvel-studios-avengers-doomsday-cast/),
  March 26, 2025: confirms the originally announced actors; does not independently
  map every role. Its old release date is superseded; it does not drive the UI.
- [Disney UK press announcement](https://press.disney.co.uk/news/marvel-studios-avengers-doomsday-debuts-new-trailer-and-poster),
  July 20, 2026: additional official actor cross-check, not sufficient alone to
  assign undisclosed roles. UK and US theatrical dates differ.
- [Official Disney film page](https://movies.disney.com/avengers-doomsday): lists
  **Alex Livanalli** in addition to actors represented in the guide, without a role
  mapping. Retained separately in `UNDISCLOSED_CAST`, disclosed below the full
  roster, and excluded from confirmed-character cards and counts. Do not assume
  Attuma from the actor's previous work. Hayley Atwell's Peggy Carter mapping is
  supported explicitly by both Disney+ articles even though that actor is absent
  from the film page's current cast line.

All five URLs were accessible during this review. Targeted official-domain searches
found no newer supported character identities to add. Sources can change: this is
a dated editorial review, not an assertion that every cameo has been announced.

## Identity, imagery and grouping decisions

- Downey portrays Doctor Doom / Victor Von Doom; no Tony Stark alias or Iron Man
  artwork. Steve Rogers and Sam Wilson retain separate actor/character IDs.
- The Fantastic Four, mutant legacy, and other headings are **display categories**.
  They do not assert a person's team membership or the exact universe/variant
  appearing in Doomsday. No speculative continuity values or profile routes added.
- Existing posters do not establish reusable image rights or correct Doomsday
  variants. New cards use original CSS/initials placeholders with no asset requests.
  `imagePath` remains optional for future approved local media; the component
  reserves dimensions, lazy-loads images and falls back to initials on error.
- The existing fan-project disclaimer remains; the modal also shows it.
- This feature neither implements the encyclopedia (#7) nor edits the watchlist,
  watched-storage keys, timeline, character profiles or spotlight.

## Updating the roster

1. Check the current official guide, overview, film page and newer Marvel/Disney
   announcements. An actor's casting alone does not establish a character.
2. Add/edit a record in `src/data/doomsdayCast.json`, with a stable film + character +
   actor portrayal ID, accurate aliases, a display category, the exact supporting
   `sourceUrl` and the **actual** `verifiedAt` date. Recheck existing entries before
   changing their dates. The existing `doomsdayCast.js` exports load this single
   roster. Do not change stable IDs just to reorder the UI. TMDB portrait metadata
   is separate from official casting evidence; see [portrait setup](tmdb-portraits.md).
3. Keep unmapped official actors in `UNDISCLOSED_CAST`. Remove the unresolved
   record when an official character mapping becomes available. Never count it as
   a verified character. Add continuity or approved local imagery only with evidence.
4. Set `featured` and `sortOrder` editorially. Counts and filters derive from data;
   the displayed verification date uses the oldest verification among published
   entries. Categories apply once per entry to prevent double-counting.
5. Run `node --test tests/doomsdayCast.test.js` and `npm run build`. Review source
   links manually (tests validate official URL shape, not live page contents).
   Validate the actual UI at 320, 360, 390, 430px and desktop; test search, category
   combinations, keyboard scrolling, dialog Escape/close/focus restoration and
   watch-progress persistence. Amend the reviewed baseline test for real official
   corrections; newly confirmed entries may extend it without changing a total.

## Implementation validation (November 28, 2026)

- Base: `f1f0842fe4520e330cc162596fd59fde484efbab`, fetched again before PR
  preparation. Implementation isolated from the original checkout's four local
  modifications in a Git worktree on `feat/doomsday-confirmed-cast`.
- `node --test tests/doomsdayCast.test.js`: **4 passed**. Covers the reviewed
  starting portrayals, metadata/duplicates, identity distinctions, normalized
  search, combined filters and full category coverage.
- `npm run build`: **passed**, all 7 existing routes generated. No dependency
  additions or package/lockfile edits. Both dev and production previews inspected.
- Browser CSS viewport widths: **320, 360, 390, 430 and 1440px** (also inspected
  tablet). No page overflow; timer fits its container at all four mobile sizes.
  New section height is about 189px at 320/360 and 182px at 390/430. Placement
  measured after countdown and before the existing CTA group. Hero sizing remains
  content-driven; timer adjustment is scoped to the homepage wrapper.
- Confirmed all 31 cards render in the full list; category counts are
  1/5/4/7/6/4/4. Checked actor/alias searches, accent-insensitive search, combined
  empty state/reset, carousel controls and Home/End keyboard scrolling.
- Checked modal initial search focus, keyboard focus containment, Escape, close
  button, focus restoration, scrollable mobile layout and body scroll locking.
- Checked playing hero video, spotlight selection/profile href, timeline phase
  filtering, Start Watch Order navigation, and shared official-watchlist progress
  updating/persisting after reload. Reverted the test watched toggle afterward.
- [Mobile hero screenshot at 390px](screenshots/doomsday-mobile-390.jpg).

Limitations: desktop browser viewport emulation is not a physical Android-device
or screen-reader test; no Lighthouse/mobile CPU benchmark was run. Reduced-motion
behavior was checked in source, without changing the user's OS preference. The
unchanged existing countdown can emit a server/client time hydration mismatch;
it continues updating after React recovers. That component's clock logic is outside
this change, and local edits to it in the original checkout were preserved.
