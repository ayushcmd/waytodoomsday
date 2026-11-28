# Marvel Character Encyclopedia & Team Directory — Research Coverage Report

**Date of Verification:** 2026-11-28  
**Scope:** Verified film portrayals across released Marvel cinematic continuities  
**Repository Branch:** `feat/encyclopedia-expansion-batch-2`  
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

Following Content Expansion Batch 2 (adding **20 verified portrayals** to the **75** baseline), the dataset contains **95 verified character portrayals**, **77 identity families**, **87 unique verified TMDB actor identities**, and **16 verified teams/organizations** spanning **15 cinematic continuities**:

| Continuity ID | Cinematic Continuity Name | Designation | Portrayals | Teams & Organizations |
|---|---|---|---|---|
| `mcu` | Marvel Cinematic Universe | Earth-616 / Sacred Timeline | 41 | Avengers, Guardians of the Galaxy, S.H.I.E.L.D., HYDRA, Dora Milaje, Ravagers, TVA, Thunderbolts*, Eternals |
| `fox-xmen` | Fox X-Men Universe (Original & Prequel) | Earth-10005 | 17 | X-Men, Brotherhood of Mutants, X-Force |
| `mcu-828` | Earth-828 (Fantastic Four: First Steps) | Earth-828 | 6 | Fantastic Four (Earth-828) |
| `story-fantastic-four` | Tim Story Fantastic Four (2005/2007) | Earth-121698 | 5 | Fantastic Four |
| `fox-daredevil` | Daredevil & Elektra (2003 / 2005) | Earth-701306 | 5 | — |
| `sony-ghost-rider` | Ghost Rider Films (2007 / 2012) | Earth-121347 / Soft-Reboot | 4 | — |
| `raimi-spiderman` | Sam Raimi Spider-Man Trilogy | Earth-96283 | 3 | — |
| `sony-spiderverse` | Sony's Spider-Verse Animated | Multiverse | 3 | Spider-Society |
| `webb-spiderman` | Marc Webb The Amazing Spider-Man | Earth-120703 | 2 | — |
| `mcu-838` | Multiverse of Madness Alternate Reality | Earth-838 | 2 | The Illuminati |
| `punisher-2004` | The Punisher (2004) | Earth-58732 | 2 | — |
| `punisher-war-zone-2008` | Punisher: War Zone (2008) | Earth-20082 | 2 | — |
| `sony-ssu` | Sony's Spider-Man Universe | Earth-688 | 1 | — |
| `trill-blade` | New Line Cinema Blade Trilogy | Earth-26320 | 1 | — |
| `punisher-1989` | The Punisher (1989) | Earth-58627 | 1 | — |

**Total Published Portrayals:** 95  
**Total Verified Teams:** 16  

### Batch 2 Additions & Editorial Continuity Decisions
- **The Fantastic Four: First Steps (2025 — Earth-828, 6 Portrayals):**
  - Classified under dedicated alternate reality `mcu-828` (*Earth-828*) rather than Earth-616 (`mcu`), while linking `fantastic-four-first-steps` to the existing MCU watch-tracker anchor (`isMcu: true`).
  - Added dedicated team `fantastic-four-828` (*Fantastic Four (Earth-828)*) with Pedro Pascal (Reed Richards), Vanessa Kirby (Sue Storm), Joseph Quinn (Johnny Storm), Ebon Moss-Bachrach (Ben Grimm), plus antagonists/heralds Ralph Ineson (Galactus) and Julia Garner (Silver Surfer / Shalla-Bal).
- **Daredevil & Elektra (2003 / 2005 — Earth-701306, 5 Portrayals):**
  - Added Matt Murdock (Ben Affleck), Elektra Natchios (Jennifer Garner, including her *Deadpool & Wolverine* 2024 Void appearance), Wilson Fisk (Michael Clarke Duncan), Bullseye (Colin Farrell), and Stick (Terence Stamp). No artificial team page was created.
- **Ghost Rider (2007 / 2012 — `sony-ghost-rider`, 4 Portrayals):**
  - Added Johnny Blaze (Nicolas Cage, spanning 2007 and the 2012 soft-rebooted continuation *Spirit of Vengeance*), Blackheart (Wes Bentley), Mephistopheles (Peter Fonda), and Roxanne Simpson (Eva Mendes). Explicitly documented *Spirit of Vengeance* as a soft-reboot continuation rather than manufacturing a rigid single-continuity claim for supporting characters.
- **Punisher Film Continuities (1989 / 2004 / 2008, 5 Portrayals):**
  - Kept the three theatrical adaptations strictly separate: Thomas Jane (`punisher-2004`) + John Travolta (Howard Saint); Ray Stevenson (`punisher-war-zone-2008`) + Dominic West (Jigsaw); and Dolph Lundgren (`punisher-1989`).
- **Deferred Candidates:** Additional supporting characters from *The Fantastic Four: First Steps* (e.g., Harvey Elder / Mole Man, Rachel Rozman), *Blade II* / *Blade: Trinity* supporting cast, and *Fant4stic* (2015) are deferred to future batches to keep Batch 2 focused on primary verified leads and antagonists.

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

## 4. Verified Character Portrayal Inventory (95 Portrayals)

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

### J. Earth-828 (The Fantastic Four: First Steps, 2025) — 6 Portrayals
76. **Mister Fantastic (Reed Richards)** — Pedro Pascal (`reed-richards-pedro-pascal`)
77. **Invisible Woman (Sue Storm)** — Vanessa Kirby (`sue-storm-vanessa-kirby`)
78. **Human Torch (Johnny Storm)** — Joseph Quinn (`johnny-storm-joseph-quinn`)
79. **The Thing (Ben Grimm)** — Ebon Moss-Bachrach (`ben-grimm-ebon-moss-bachrach`)
80. **Galactus (Galan)** — Ralph Ineson (`galactus-ralph-ineson`)
81. **Silver Surfer (Shalla-Bal)** — Julia Garner (`silver-surfer-shalla-bal`)

### K. Daredevil & Elektra (2003 / 2005 — Earth-701306) — 5 Portrayals
82. **Daredevil (Matt Murdock)** — Ben Affleck (`daredevil-ben-affleck`)
83. **Elektra (Elektra Natchios)** — Jennifer Garner (`elektra-jennifer-garner`)
84. **Kingpin (Wilson Fisk)** — Michael Clarke Duncan (`kingpin-michael-clarke-duncan`)
85. **Bullseye** — Colin Farrell (`bullseye-colin-farrell`)
86. **Stick** — Terence Stamp (`stick-terence-stamp`)

### L. Ghost Rider Films (2007 / 2012) — 4 Portrayals
87. **Ghost Rider (Johnny Blaze)** — Nicolas Cage (`ghost-rider-nicolas-cage`)
88. **Blackheart** — Wes Bentley (`blackheart-wes-bentley`)
89. **Mephistopheles** — Peter Fonda (`mephistopheles-peter-fonda`)
90. **Roxanne Simpson** — Eva Mendes (`roxanne-simpson-eva-mendes`)

### M. Punisher Film Continuities (1989 / 2004 / 2008) — 5 Portrayals
91. **The Punisher (Frank Castle - 2004)** — Thomas Jane (`punisher-thomas-jane`)
92. **Howard Saint** — John Travolta (`howard-saint-john-travolta`)
93. **The Punisher (Frank Castle - War Zone, 2008)** — Ray Stevenson (`punisher-ray-stevenson`)
94. **Jigsaw (Billy Russoti)** — Dominic West (`jigsaw-dominic-west`)
95. **The Punisher (Frank Castle - 1989)** — Dolph Lundgren (`punisher-dolph-lundgren`)

---

## 5. Verified Teams and Organizations (16 Groups)

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
16. **Fantastic Four (Earth-828)** (`fantastic-four-828`) — Team — Leader: Reed Richards (Mister Fantastic)

---

## 6. Automated Data Validation Suite

All records are programmatically verified in `tests/encyclopedia.test.js`:
- Unique ID and slug enforcement across all 95 portrayals
- Existence of parent identity in `identities.json`
- Valid continuity reference in `universes.json`
- Valid film debut and appearance IDs in `films.json` / `movies.json`
- Verified team references in `teams.json`
- Strict separation between roster members (`getTeamMembers`) and affiliated allies (`getTeamAllies`)
- Accurate documentation count verification (preventing doc/data drift)
- Spoiler warning presence on characters with hidden narrative developments
- Preservation of legacy properties on the 5 original MCU character profiles
