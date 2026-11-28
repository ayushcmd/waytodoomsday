# Third-party notices and rights review

Way to Doomsday is an unofficial, non-commercial fan project, not affiliated with
or endorsed by Marvel, Disney, TMDB or other referenced providers. Identification,
attribution and a fan disclaimer do not establish permission or a fair-use finding.

## Scope of the original-code license

The root [MIT license](LICENSE) applies only to original software/documentation
for which its named copyright holder has the relevant rights. On November 28,
2026 the repository owner approved the MIT choice and “Copyright (c) 2026 Ayush
Raj” attribution. The exact MIT text is reused from closed, unmerged
[PR #2](https://github.com/ayushcmd/waytodoomsday/pull/2), head `b7b7b169fe5fe4939120a08c1ce64d0a634926c4`.
That proposal was reviewed, not assumed to have been merged. This notice expands
its original distinction between project code and third-party material.

This grant does not claim rights over all contributions, dependencies, licensed
documents or assets. Preserve their copyright and license notices. No Marvel,
Disney, actor-photo, trademark, music or footage rights are granted by MIT.

## Assets, data and services

| Material / location | Source or use | Rights and review status |
| --- | --- | --- |
| `public/posters/` | Film/series promotional artwork used throughout the catalogue | Third-party artwork; exact asset provenance and redistribution permissions are not recorded. Owner must review each asset before reuse/distribution. |
| `public/bg/doomsday.mp4` | Bundled background footage | Footage and any audio have separate rights. Source/permission not established by this repository; manual review required. |
| `public/banner/marvel.jpg` | Marvel branding imagery | Third-party branding/artwork; no trademark or artwork license established here. |
| `public/banner/brave.png` | Brave promotional graphic | Third-party graphic/branding; permission/provenance needs review. The download links do not establish an affiliation. |
| Root `image.png`, `docs/screenshots/`, public PNG/ICO application icons and `favicon.svg` | Repository imagery, screenshots and site icons | Provenance/underlying artwork rights are not fully documented. Screenshots may contain third-party artwork even if captured by a contributor. No blanket original-art claim. |
| `src/data/movies.json`, `characters.js`, Doomsday JSON and research snapshot | Curated titles, chronology, cast and external evidence links | Character identities, franchise names and source material are distinct from original code. See [cast sources](docs/doomsday-cast.md) and [evidence policy](docs/doomsday-evidence.md). Links do not grant rights to republish source articles or images. |
| TMDB actor portraits and logo, loaded remotely | Official TMDB image CDN and approved logo URL in footer Credits | Governed by [TMDB API terms](https://www.themoviedb.org/api-terms-of-use), [FAQ](https://developer.themoviedb.org/docs/faq) and applicable image rights, not MIT. No portrait image files are bundled by the resolver. Follow [portrait maintenance](docs/tmdb-portraits.md), including cache/expiry and attribution. |
| Bebas Neue and Roboto, loaded via Google Fonts in `Layout.astro` | Remote font stylesheets/binaries | Upstream font distributions use SIL Open Font License 1.1; see [Bebas Neue license](https://github.com/google/fonts/blob/main/ofl/bebasneue/OFL.txt) and [Roboto license](https://github.com/google/fonts/blob/main/ofl/roboto/OFL.txt). Preserve applicable notices if self-hosting. |
| Formspree enquiry service | Browser sends submitted message/type and subject to Formspree | Service processing is subject to provider terms/privacy. This service is not part of the MIT grant. Account credentials must remain private. |
| Catalogue `link`, `play` and `redirect` URLs | External watch/download/redirect destinations, including Drive and non-studio sites | Authorization and availability have not been verified. Do not describe all destinations as official or authorized; owner review is required. |

Marvel/Disney-related characters, film titles, logos and artwork remain subject to
their respective rights holders' rights; other studios, photographers, performers
and providers may hold separate rights. This inventory does not determine ownership
of each asset or certify lawful distribution. Do not copy unverified media into
new distributions based on this file.

The owner described the site as non-commercial. TMDB's developer API conditions
require attribution for qualifying non-commercial use; commercial use requires
separate licensing review. The footer distinguishes official casting evidence from
portrait data, links TMDB and shows its logo/non-endorsement notice. Those measures
do not grant unrelated film-artwork or footage rights.

## Software and adapted documents

Direct dependency license identifiers below come from the committed
[package-lock.json](package-lock.json), reviewed November 28, 2026. Each installed
package's own license/NOTICE files govern; this table is not a complete transitive
dependency license bundle or a substitute for distributing required notices.

| Direct dependencies | Recorded license |
| --- | --- |
| `astro`, `@astrojs/react` | MIT |
| `react`, `react-dom`, `@types/react`, `@types/react-dom` | MIT |
| `tailwindcss`, `@tailwindcss/vite` | MIT |
| `framer-motion` | MIT |
| `hls.js` (installed, no current source import) | Apache-2.0 |

Preserve upstream MIT copyright/permission notices with substantial copies. For
Apache-2.0 components preserve the license and applicable notices and meet its
redistribution conditions. Audit the actual installed/bundled transitive tree and
include its required notices when distributing software; dependencies are not
relicensed as project-original code.

[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) adapts the
[Contributor Covenant 2.1](https://www.contributor-covenant.org/version/2/1/code_of_conduct/).
It preserves upstream attribution and identifies local reporting/response changes;
the upstream document's terms apply separately from project MIT.

## Unresolved owner review

Confirm asset provenance and permissions, external-link authorization, privacy-page
accuracy and distribution-specific third-party notice requirements before
publication. See [community review notes](docs/community-review.md). No rights audit
has been completed merely by adding these documents. Send private rights evidence
to [ayush_24a12res897@iitp.ac.in](mailto:ayush_24a12res897@iitp.ac.in).
