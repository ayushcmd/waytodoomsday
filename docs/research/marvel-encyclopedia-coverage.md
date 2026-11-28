# Marvel Character Encyclopedia & Team Directory — Research Coverage Report

**Date of Verification:** 2026-11-28  
**Scope:** Verified film portrayals across released Marvel cinematic continuities  
**Repository Branch:** `fix/encyclopedia-accuracy-and-ux`  
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

The dataset contains **46 verified character portrayals** and **15 verified teams/organizations** spanning **9 cinematic continuities**:

| Continuity ID | Cinematic Continuity Name | Designation | Portrayals | Teams & Organizations |
|---|---|---|---|---|
| `mcu` | Marvel Cinematic Universe | Earth-616 / Sacred Timeline | 19 | Avengers, Guardians of the Galaxy, S.H.I.E.L.D., HYDRA, Dora Milaje, Ravagers, TVA, Thunderbolts*, Eternals |
| `fox-xmen` | Fox X-Men Universe (Original & Prequel) | Earth-10005 | 10 | X-Men, Brotherhood of Mutants, X-Force |
| `story-fantastic-four` | Tim Story Fantastic Four (2005/2007) | Earth-121698 | 5 | Fantastic Four |
| `raimi-spiderman` | Sam Raimi Spider-Man Trilogy | Earth-96283 | 3 | — |
| `sony-spiderverse` | Sony's Spider-Verse Animated | Multiverse | 3 | Spider-Society |
| `webb-spiderman` | Marc Webb The Amazing Spider-Man | Earth-120703 | 2 | — |
| `mcu-838` | Multiverse of Madness Alternate Reality | Earth-838 | 2 | The Illuminati |
| `sony-ssu` | Sony's Spider-Man Universe | Earth-688 | 1 | — |
| `trill-blade` | New Line Cinema Blade Trilogy | Earth-26320 | 1 | — |

**Total Published Portrayals:** 46  
**Total Verified Teams:** 15

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

---

## 4. Verified Character Portrayal Inventory (46 Portrayals)

### A. Marvel Cinematic Universe (Earth-616) — 19 Portrayals
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

### B. Sam Raimi Spider-Man Trilogy (Earth-96283) — 3 Portrayals
20. **Spider-Man (Peter Parker)** — Tobey Maguire (`spider-man-tobey-maguire`)
21. **Green Goblin (Norman Osborn)** — Willem Dafoe (`green-goblin-willem-dafoe`)
22. **Doctor Octopus (Otto Octavius)** — Alfred Molina (`doctor-octopus-alfred-molina`)

### C. Marc Webb The Amazing Spider-Man (Earth-120703) — 2 Portrayals
23. **Spider-Man (Peter Parker)** — Andrew Garfield (`spider-man-andrew-garfield`)
24. **Electro (Max Dillon)** — Jamie Foxx (`electro-jamie-foxx`)

### D. Sony's Animated Spider-Verse — 3 Portrayals
25. **Spider-Man (Miles Morales)** — Shameik Moore (`miles-morales-spider-verse`)
26. **Spider-Gwen (Gwen Stacy)** — Hailee Steinfeld (`spider-gwen-hailee-steinfeld`)
27. **Spider-Man 2099 (Miguel O'Hara)** — Oscar Isaac (`spider-man-2099-oscar-isaac`)

### E. Fox X-Men Universe (Earth-10005) — 10 Portrayals
28. **Wolverine (Logan - Earth-10005)** — Hugh Jackman (`wolverine-hugh-jackman`)
29. **Professor X (Charles Xavier - Earth-10005)** — Patrick Stewart (`professor-x-patrick-stewart`)
30. **Professor X (Young Charles Xavier)** — James McAvoy (`professor-x-james-mcavoy`)
31. **Magneto (Erik Lehnsherr)** — Ian McKellen (`magneto-ian-mckellen`)
32. **Magneto (Young Erik Lehnsherr)** — Michael Fassbender (`magneto-michael-fassbender`)
33. **Deadpool (Wade Wilson)** — Ryan Reynolds (`deadpool-ryan-reynolds`)
34. **Weapon XI (Wade Wilson)** — Ryan Reynolds (`weapon-xi-wade-wilson`)
35. **Storm (Ororo Munroe)** — Halle Berry (`storm-halle-berry`)
36. **Jean Grey / Phoenix** — Famke Janssen (`jean-grey-famke-janssen`)
37. **Cyclops (Scott Summers)** — James Marsden (`cyclops-james-marsden`)

### F. Sony's Spider-Man Universe (SSU) — 1 Portrayal
38. **Venom (Eddie Brock)** — Tom Hardy (`venom-tom-hardy`)

### G. Tim Story Fantastic Four (Earth-121698) — 5 Portrayals
39. **Mister Fantastic (Reed Richards)** — Ioan Gruffudd (`reed-richards-ioan-gruffudd`)
40. **Invisible Woman (Sue Storm)** — Jessica Alba (`invisible-woman-jessica-alba`)
41. **Human Torch (Johnny Storm)** — Chris Evans (`human-torch-chris-evans`)
42. **The Thing (Ben Grimm)** — Michael Chiklis (`the-thing-michael-chiklis`)
43. **Doctor Doom (Victor von Doom)** — Julian McMahon (`doctor-doom-julian-mcmahon`)

### H. Alternate Multiversal Variant (Earth-838) — 2 Portrayals
44. **Mister Fantastic (Reed Richards - Earth-838)** — John Krasinski (`reed-richards-earth-838`)
45. **Professor X (Charles Xavier - Earth-838)** — Patrick Stewart (`professor-x-earth-838`)

### I. Blade Trilogy (Earth-26320) — 1 Portrayal
46. **Blade (Eric Brooks)** — Wesley Snipes (`blade-wesley-snipes`)

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
- Unique ID and slug enforcement across all 46 portrayals
- Existence of parent identity in `identities.json`
- Valid continuity reference in `universes.json`
- Valid film debut and appearance IDs in `films.json` / `movies.json`
- Verified team references in `teams.json`
- Strict separation between roster members (`getTeamMembers`) and affiliated allies (`getTeamAllies`)
- Accurate documentation count verification (preventing doc/data drift)
- Spoiler warning presence on characters with hidden narrative developments
- Preservation of legacy properties on the 5 original MCU character profiles
