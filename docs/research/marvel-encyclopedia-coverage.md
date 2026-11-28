# Marvel Character Encyclopedia & Team Directory — Research Coverage Report

**Date of Verification:** 2026-11-28  
**Scope:** Verified film portrayals across released Marvel cinematic continuities  
**Repository Branch:** `feat/encyclopedia-expansion-batch-1`  
**Related Issue:** #7 (Umbrella Feature Specification)

---

## 1. Editorial Policy & Evidence Standards

Every entry published in this encyclopedia foundation satisfies strict evidentiary criteria:
1. **Film-Grounded Canon Only:** All abilities, memberships, and narrative events are derived solely from released feature films. Comic-book continuity, animated series not linked to film universes, fan speculation, leaks, and rumors are excluded.
2. **Identity vs. Portrayal Segregation:** Shared character identities (e.g. Peter Parker, Charles Xavier, Logan / Wolverine, Wade Wilson, Reed Richards) are split into discrete portrayal records associated with their specific actor and continuity. Powers, relationships, and filmographies are never merged across variants.
3. **Formal Roster vs. Ally Designation:** Characters who fight alongside teams in major battles without formal membership (e.g., Doctor Strange and Black Panther in *Avengers: Infinity War* / *Endgame*, Thor with the Guardians of the Galaxy in *Love and Thunder*, Loki cooperating with the TVA) are classified as allies (`type: "ally"` or `"collaborator"`), preserving roster integrity.
4. **Spoiler-Concealed Narrative History:** Major plot resolutions, character outcomes, and deaths are separated into dedicated spoiler narratives with accessible user-activated reveal toggles (`aria-expanded`), keeping basic character profiles spoiler-safe by default.
5. **Verified Primary Sources:** Every portrayal includes official studio documentation URLs (Marvel.com, Sony Pictures, 20th Century Studios) and verified review timestamps.
6. **Backward Compatibility:** All 5 original MCU character routes (`/character/iron-man`, `/character/thor`, `/character/captain-america`, `/character/spider-man`, `/character/star-lord`) and existing watch progression keys (`waytodoomsday:watched`) remain fully functional.

---

## 2. Representation Across Continuities

Following Content Expansion Batch 1 (adding **29 verified portrayals** including separated 2014 Time Heist variants and Young Groot), the dataset contains **75 verified character portrayals**, **63 identity families**, **67 unique verified TMDB actor identities**, and **15 verified teams/organizations** spanning **9 cinematic continuities**:

| Continuity ID | Cinematic Continuity Name | Designation | Portrayals | Teams & Organizations |
|---|---|---|---|---|
| `mcu` | Marvel Cinematic Universe | Earth-616 / Sacred Timeline | 41 | Avengers, Guardians of the Galaxy, S.H.I.E.L.D., HYDRA, Dora Milaje, Ravagers, TVA, Thunderbolts*, Eternals |
| `fox-xmen` | Fox X-Men Universe (Original & Prequel) | Earth-10005 | 17 | X-Men, Brotherhood of Mutants, X-Force |
| `story-fantastic-four` | Tim Story Fantastic Four (2005/2007) | Earth-121698 | 5 | Fantastic Four |
| `raimi-spiderman` | Sam Raimi Spider-Man Trilogy | Earth-96283 | 3 | — |
| `sony-spiderverse` | Sony's Spider-Verse Animated | Multiverse | 3 | Spider-Society |
| `webb-spiderman` | Marc Webb The Amazing Spider-Man | Earth-120703 | 2 | — |
| `mcu-838` | Multiverse of Madness Alternate Reality | Earth-838 | 2 | The Illuminati |
| `sony-ssu` | Sony's Spider-Man Universe | Earth-688 | 1 | — |
| `trill-blade` | New Line Cinema Blade Trilogy | Earth-26320 | 1 | — |

**Total Published Portrayals:** 75  
**Total Verified Teams:** 15  

### Batch 1 Additions & Excluded/Deferred Candidates
- **Added (+29):**
  - *Guardians of the Galaxy & Variants (9):* Gamora (`gamora`), Gamora 2014 Variant (`gamora-2014-variant`, Ravagers), Drax, Rocket Raccoon, Original Groot (`groot`), Groot Young / Son (`groot-young`, distinct `groot-junior` identity), Nebula, Mantis, Yondu Udonta (Ravagers member / Guardians ally).
  - *MCU Heroes, Villains & Variants (13):* Thanos (`thanos`), Thanos 2014 Variant (`thanos-2014-variant`), Nebula 2014 Variant (`nebula-2014-variant`), Hela, Erik Killmonger, Vulture, Mysterio, Shang-Chi, Yelena Belova (Thunderbolts*), Namor, Okoye (Dora Milaje / Avengers ally), Vision (Avengers), Wong (Avengers ally).
  - *Fox X-Men (7):* Rogue, Nightcrawler, Iceman, Beast (Young), Quicksilver, Mystique (Young — Jennifer Lawrence), Mystique (Original Trilogy — Rebecca Romijn).
  - *New Film Catalog Entry:* `thunderbolts` (*Thunderbolts**, 2025, `mcu`, `isMcu: true`, synchronized with `movies.json`).
- **Deferred to Batch 2 (Excluded from Batch 1):**
  - Standalone early-2000s continuities (**Ghost Rider** — Nicolas Cage, **Daredevil** — Ben Affleck, **Elektra** — Jennifer Garner, **The Punisher** — Thomas Jane) and the **2025 Fantastic Four: First Steps** continuity cast require dedicated universe entries, non-MCU film catalogs, and team setup, so they are deferred to a dedicated Batch 2 expansion.

---

## 3. Multiverse Variant & Identity Segregation Rationale

### A. Professor Charles Xavier (Patrick Stewart)
- **Earth-10005 (`professor-x-patrick-stewart`):** Founder and leader of the Fox X-Men; experienced the events of *X-Men* (2000) through *Logan* (2017).
- **Earth-838 (`professor-x-earth-838`):** Co-leader of the Illuminati on Earth-838 in *Doctor Strange in the Multiverse of Madness* (2022); operates the hoverchair and mental telepathy defense against the Scarlet Witch. Distinct continuity, distinct team affiliations, distinct fate.

### B. Wolverine / Logan (Hugh Jackman)
- **Earth-10005 (`wolverine-hugh-jackman`):** Original Fox continuity Logan; veteran of the Weapon X program and core field leader of the Earth-10005 X-Men; sacrificed himself protecting Laura and mutant children in *Logan* (2017).
- **Alternate Timeline / Anchor Being Variant (`wolverine-alternate-variant`):** Introduced in *Deadpool & Wolverine* (2024); the "worst Wolverine" who let down his own universe's X-Men and subsequently co-anchors Earth-10005 alongside Wade Wilson. Not a member of Earth-10005's X-Men roster, preserving continuity accuracy while linked to the MCU film.

### C. Deadpool / Wade Wilson (Ryan Reynolds)
- **Weapon XI (`weapon-xi-wade-wilson`):** *X-Men Origins: Wolverine* (2009) portrayal; Stryker's genetically altered mutant killer with sewn mouth, teleportation, optic blasts, and arm-blades. Villain role.
- **Deadpool (`deadpool-ryan-reynolds`):** *Deadpool* (2016), *Deadpool 2* (2018), and *Deadpool & Wolverine* (2024) self-aware fourth-wall-breaking mercenary and anti-hero.

### D. 2014 Time Heist Variants (Gamora, Thanos, Nebula)
- **Gamora (`gamora` vs `gamora-2014-variant`):** Original Guardians Gamora died on Vormir in *Infinity War* (2018); the 2014 variant pulled into *Endgame* (2019) never joined the Guardians and instead became a Ravager (`ravagers-mcu`) in *Guardians Vol. 3* (2023).
- **Thanos (`thanos` vs `thanos-2014-variant`):** Sacred Timeline Thanos completed the Snap and was killed by Thor in *Endgame*'s opening; 2014 Thanos intercepted the Time Heist and was disintegrated by Tony Stark in the Battle of Earth.
- **Nebula (`nebula` vs `nebula-2014-variant`):** Redeemed 2023 Nebula survived the Blip and became a Guardian; loyalist 2014 Nebula infiltrated the Avengers Compound and was fatally shot by her future self in *Endgame*.

### E. Groot Lineage (Father vs. Son)
- **Original Groot (`groot`):** Founding Guardian who sacrificed himself on Xandar in *Guardians of the Galaxy* (2014).
- **Groot (Young / Son — `groot-young`):** Distinct individual (`groot-junior` identity) grown from a surviving twig, appearing from *Guardians Vol. 1*'s epilogue through *Vol. 3*.

### F. Mystique (Rebecca Romijn vs. Jennifer Lawrence)
- **Mystique (`mystique-rebecca-romijn`):** Original X-Men trilogy Brotherhood lieutenant (*X-Men* 2000 – *The Last Stand* 2006).
- **Mystique (Young — `mystique-jennifer-lawrence`):** Prequel-era shapeshifter who transitioned from the Brotherhood to field leader of the X-Men (*First Class* 2011 – *Dark Phoenix* 2019).

---

## 4. Verified Character Portrayal Inventory (75 Portrayals)

### A. Marvel Cinematic Universe (Earth-616) — 41 Portrayals
1. **Iron Man (Tony Stark)** — Robert Downey Jr. (`iron-man`) [Legacy Route Preserved]
2. **Thor Odinson** — Chris Hemsworth (`thor`) [Legacy Route Preserved]
3. **Captain America (Steve Rogers)** — Chris Evans (`captain-america`) [Legacy Route Preserved]
4. **Spider-Man (Peter Parker)** — Tom Holland (`spider-man`) [Legacy Route Preserved]
5. **Star-Lord (Peter Quill)** — Chris Pratt (`star-lord`) [Legacy Route Preserved]
6. **Doctor Strange (Stephen Strange)** — Benedict Cumberbatch (`doctor-strange`)
7. **Black Widow (Natasha Romanoff)** — Scarlett Johansson (`black-widow`)
8. **Hulk (Bruce Banner)** — Mark Ruffalo (`hulk-bruce-banner`)
9. **Scarlet Witch (Wanda Maximoff)** — Elizabeth Olsen (`scarlet-witch`)
10. **Hawkeye (Clint Barton)** — Jeremy Renner (`hawkeye`)
11. **Black Panther (T'Challa)** — Chadwick Boseman (`black-panther`)
12. **Black Panther / Shuri** — Letitia Wright (`shuri`)
13. **Captain Marvel (Carol Danvers)** — Brie Larson (`captain-marvel`)
14. **Ant-Man (Scott Lang)** — Paul Rudd (`ant-man`)
15. **Winter Soldier (Bucky Barnes)** — Sebastian Stan (`winter-soldier`)
16. **Captain America / Falcon (Sam Wilson)** — Anthony Mackie (`sam-wilson`)
17. **Loki Laufeyson** — Tom Hiddleston (`loki`)
18. **Nick Fury** — Samuel L. Jackson (`nick-fury`)
19. **Wolverine (Alternate Variant)** — Hugh Jackman (`wolverine-alternate-variant`)
20. **Gamora** — Zoe Saldaña (`gamora`)
21. **Gamora (2014 Variant)** — Zoe Saldaña (`gamora-2014-variant`)
22. **Drax the Destroyer** — Dave Bautista (`drax`)
23. **Rocket Raccoon** — Bradley Cooper (Voice) (`rocket-raccoon`)
24. **Groot** — Vin Diesel (Voice) (`groot`)
25. **Groot (Young / Son)** — Vin Diesel (Voice) (`groot-young`)
26. **Nebula** — Karen Gillan (`nebula`)
27. **Nebula (2014 Variant)** — Karen Gillan (`nebula-2014-variant`)
28. **Mantis** — Pom Klementieff (`mantis`)
29. **Yondu Udonta** — Michael Rooker (`yondu-udonta`)
30. **Thanos** — Josh Brolin (`thanos`)
31. **Thanos (2014 Variant)** — Josh Brolin (`thanos-2014-variant`)
32. **Hela** — Cate Blanchett (`hela`)
33. **Erik Killmonger** — Michael B. Jordan (`killmonger`)
34. **Vulture (Adrian Toomes)** — Michael Keaton (`vulture-michael-keaton`)
35. **Mysterio (Quentin Beck)** — Jake Gyllenhaal (`mysterio-jake-gyllenhaal`)
36. **Shang-Chi** — Simu Liu (`shang-chi`)
37. **Yelena Belova** — Florence Pugh (`yelena-belova`)
38. **Namor** — Tenoch Huerta Mejía (`namor`)
39. **Okoye** — Danai Gurira (`okoye`)
40. **Vision** — Paul Bettany (`vision`)
41. **Wong** — Benedict Wong (`wong`)

### B. Sam Raimi Spider-Man Trilogy (Earth-96283) — 3 Portrayals
42. **Spider-Man (Peter Parker)** — Tobey Maguire (`spider-man-tobey-maguire`)
43. **Green Goblin (Norman Osborn)** — Willem Dafoe (`green-goblin-willem-dafoe`)
44. **Doctor Octopus (Otto Octavius)** — Alfred Molina (`doctor-octopus-alfred-molina`)

### C. Marc Webb The Amazing Spider-Man (Earth-120703) — 2 Portrayals
45. **Spider-Man (Peter Parker)** — Andrew Garfield (`spider-man-andrew-garfield`)
46. **Electro (Max Dillon)** — Jamie Foxx (`electro-jamie-foxx`)

### D. Sony's Animated Spider-Verse — 3 Portrayals
47. **Spider-Man (Miles Morales)** — Shameik Moore (`miles-morales-spider-verse`)
48. **Spider-Gwen (Gwen Stacy)** — Hailee Steinfeld (`spider-gwen-hailee-steinfeld`)
49. **Spider-Man 2099 (Miguel O'Hara)** — Oscar Isaac (`spider-man-2099-oscar-isaac`)

### E. Fox X-Men Universe (Earth-10005) — 17 Portrayals
50. **Wolverine (Logan - Earth-10005)** — Hugh Jackman (`wolverine-hugh-jackman`)
51. **Professor X (Charles Xavier - Earth-10005)** — Patrick Stewart (`professor-x-patrick-stewart`)
52. **Professor X (Young Charles Xavier)** — James McAvoy (`professor-x-james-mcavoy`)
53. **Magneto (Erik Lehnsherr)** — Ian McKellen (`magneto-ian-mckellen`)
54. **Magneto (Young Erik Lehnsherr)** — Michael Fassbender (`magneto-michael-fassbender`)
55. **Deadpool (Wade Wilson)** — Ryan Reynolds (`deadpool-ryan-reynolds`)
56. **Weapon XI (Wade Wilson)** — Ryan Reynolds (`weapon-xi-wade-wilson`)
57. **Storm (Ororo Munroe)** — Halle Berry (`storm-halle-berry`)
58. **Jean Grey / Phoenix** — Famke Janssen (`jean-grey-famke-janssen`)
59. **Cyclops (Scott Summers)** — James Marsden (`cyclops-james-marsden`)
60. **Rogue (Marie D'Ancanto)** — Anna Paquin (`rogue-anna-paquin`)
61. **Nightcrawler (Kurt Wagner)** — Alan Cumming (`nightcrawler-alan-cumming`)
62. **Iceman (Bobby Drake)** — Shawn Ashmore (`iceman-shawn-ashmore`)
63. **Beast (Young Hank McCoy)** — Nicholas Hoult (`beast-nicholas-hoult`)
64. **Quicksilver (Peter Maximoff)** — Evan Peters (`quicksilver-evan-peters`)
65. **Mystique (Young Raven Darkhölme)** — Jennifer Lawrence (`mystique-jennifer-lawrence`)
66. **Mystique (Raven Darkhölme)** — Rebecca Romijn (`mystique-rebecca-romijn`)

### F. Sony's Spider-Man Universe (SSU) — 1 Portrayal
67. **Venom (Eddie Brock)** — Tom Hardy (`venom-tom-hardy`)

### G. Tim Story Fantastic Four (Earth-121698) — 5 Portrayals
68. **Mister Fantastic (Reed Richards)** — Ioan Gruffudd (`reed-richards-ioan-gruffudd`)
69. **Invisible Woman (Sue Storm)** — Jessica Alba (`invisible-woman-jessica-alba`)
70. **Human Torch (Johnny Storm)** — Chris Evans (`human-torch-chris-evans`)
71. **The Thing (Ben Grimm)** — Michael Chiklis (`the-thing-michael-chiklis`)
72. **Doctor Doom (Victor von Doom)** — Julian McMahon (`doctor-doom-julian-mcmahon`)

### H. Alternate Multiversal Variant (Earth-838) — 2 Portrayals
73. **Mister Fantastic (Reed Richards - Earth-838)** — John Krasinski (`reed-richards-earth-838`)
74. **Professor X (Charles Xavier - Earth-838)** — Patrick Stewart (`professor-x-earth-838`)

### I. Blade Trilogy (Earth-26320) — 1 Portrayal
75. **Blade (Eric Brooks)** — Wesley Snipes (`blade-wesley-snipes`)

---

## 5. Verified Teams and Organizations (15 Groups)

1. **The Avengers** (`avengers-mcu`) — Team — Leader: Steve Rogers & Tony Stark
2. **Guardians of the Galaxy** (`guardians-of-the-galaxy-mcu`) — Team — Leader: Peter Quill
3. **The X-Men** (`x-men-fox`) — Team — Leader: Professor Charles Xavier
4. **Brotherhood of Mutants** (`brotherhood-of-mutants-fox`) — Faction — Leader: Erik Lehnsherr (Magneto)
5. **Fantastic Four** (`fantastic-four-story`) — Team — Leader: Reed Richards
6. **The Illuminati** (`illuminati-earth-838`) — Team — Leader: Charles Xavier & Reed Richards
7. **Spider-Society** (`spider-society`) — Organization — Leader: Miguel O'Hara
8. **X-Force** (`x-force-fox`) — Team — Leader: Wade Wilson (Deadpool)
9. **S.H.I.E.L.D.** (`shield-mcu`) — Organization — Leader: Nick Fury
10. **HYDRA** (`hydra-mcu`) — Organization — Leader: Red Skull / Alexander Pierce
11. **Dora Milaje** (`dora-milaje-mcu`) — Organization — Leader: General Okoye
12. **The Ravagers** (`ravagers-mcu`) — Faction — Leader: Yondu Udonta / Stakar Ogord
13. **Time Variance Authority (TVA)** (`tva-mcu`) — Organization — Leader: He Who Remains / B-15
14. **Thunderbolts* / New Avengers** (`thunderbolts-new-avengers-mcu`) — Team — Leader: Valentina Allegra de Fontaine
15. **The Eternals** (`eternals-mcu`) — Team — Leader: Ajak / Sersi

---

## 6. Automated Data Validation Suite

All records are programmatically verified in `tests/encyclopedia.test.js`:
- Unique ID and slug enforcement across all 75 portrayals
- Existence of parent identity in `identities.json`
- Valid continuity reference in `universes.json`
- Valid film debut and appearance IDs in `films.json` / `movies.json`
- Verified team references in `teams.json`
- Strict separation between roster members (`getTeamMembers`) and affiliated allies (`getTeamAllies`)
- Accurate documentation count verification (preventing doc/data drift)
- Spoiler warning presence on characters with hidden narrative developments
- Preservation of legacy properties on the 5 original MCU character profiles
