# Marvel Character Encyclopedia & Team Directory — Research Coverage Report

**Date of Verification:** 2026-11-28  
**Scope:** Verified film portrayals across released Marvel cinematic continuities  
**Repository Branch:** `feat/marvel-encyclopedia-foundation`  
**Related Issue:** #7 (Umbrella Feature Specification)

---

## 1. Editorial Policy & Evidence Standards

Every entry published in this encyclopedia foundation satisfies strict evidentiary criteria:
1. **Film-Grounded Canon Only:** All abilities, memberships, and narrative events are derived solely from released feature films. Comic-book continuity, animated series not linked to film universes, fan speculation, leaks, and rumors are excluded.
2. **Identity vs. Portrayal Segregation:** Shared character identities (e.g. Peter Parker, Charles Xavier, Reed Richards) are split into discrete portrayal records associated with their specific actor and continuity. Powers, relationships, and filmographies are never merged across variants.
3. **Verified Primary Sources:** Every portrayal includes official studio documentation URLs (Marvel.com, Sony Pictures, 20th Century Studios) and verified review timestamps.
4. **Backward Compatibility:** All 5 original MCU character routes (`/character/iron-man`, `/character/thor`, `/character/captain-america`, `/character/spider-man`, `/character/star-lord`) and existing watch progression keys (`waytodoomsday:watched`) remain fully functional.

---

## 2. Representation Across Continuities

The pilot dataset includes **38 verified character portrayals** and **15 verified teams/organizations** spanning **9 cinematic continuities**:

| Continuity ID | Cinematic Continuity Name | Designation | Portrayals | Teams & Organizations |
|---|---|---|---|---|
| `mcu` | Marvel Cinematic Universe | Earth-616 / Sacred Timeline | 18 | Avengers, Guardians of the Galaxy, S.H.I.E.L.D., HYDRA, Dora Milaje, Ravagers, TVA, Thunderbolts*, Eternals |
| `fox-xmen` | Fox X-Men Universe (Original & Prequel) | Earth-10005 | 8 | X-Men, Brotherhood of Mutants, X-Force |
| `raimi-spiderman` | Sam Raimi Spider-Man Trilogy | Earth-96283 | 3 | — |
| `webb-spiderman` | Marc Webb The Amazing Spider-Man | Earth-120703 | 2 | — |
| `sony-spiderverse` | Sony's Spider-Verse Animated | Multiverse | 3 | Spider-Society |
| `sony-ssu` | Sony's Spider-Man Universe | Earth-688 | 1 | — |
| `story-fantastic-four` | Tim Story Fantastic Four (2005/2007) | Earth-121698 | 5 | Fantastic Four |
| `mcu-838` | Multiverse of Madness Alternate Reality | Earth-838 | 1 | The Illuminati |
| `trill-blade` | New Line Cinema Blade Trilogy | Earth-26320 | 1 | — |

---

## 3. Verified Character Portrayal Inventory

### A. Marvel Cinematic Universe (Earth-616)
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

### B. Sam Raimi Spider-Man Trilogy (Earth-96283)
19. **Spider-Man (Peter Parker)** — Tobey Maguire (`spider-man-tobey-maguire`)
20. **Green Goblin (Norman Osborn)** — Willem Dafoe (`green-goblin-willem-dafoe`)
21. **Doctor Octopus (Otto Octavius)** — Alfred Molina (`doctor-octopus-alfred-molina`)

### C. Marc Webb The Amazing Spider-Man (Earth-120703)
22. **Spider-Man (Peter Parker)** — Andrew Garfield (`spider-man-andrew-garfield`)
23. **Electro (Max Dillon)** — Jamie Foxx (`electro-jamie-foxx`)

### D. Sony's Animated Spider-Verse
24. **Spider-Man (Miles Morales)** — Shameik Moore (`miles-morales-spider-verse`)
25. **Spider-Gwen (Gwen Stacy)** — Hailee Steinfeld (`spider-gwen-hailee-steinfeld`)
26. **Spider-Man 2099 (Miguel O'Hara)** — Oscar Isaac (`spider-man-2099-oscar-isaac`)

### E. Fox X-Men Universe (Earth-10005)
27. **Wolverine (Logan)** — Hugh Jackman (`wolverine-hugh-jackman`)
28. **Professor X (Charles Xavier)** — Patrick Stewart (`professor-x-patrick-stewart`)
29. **Professor X (Young Charles Xavier)** — James McAvoy (`professor-x-james-mcavoy`)
30. **Magneto (Erik Lehnsherr)** — Ian McKellen (`magneto-ian-mckellen`)
31. **Magneto (Young Erik Lehnsherr)** — Michael Fassbender (`magneto-michael-fassbender`)
32. **Deadpool (Wade Wilson)** — Ryan Reynolds (`deadpool-ryan-reynolds`)
33. **Storm (Ororo Munroe)** — Halle Berry (`storm-halle-berry`)
34. **Jean Grey / Phoenix** — Famke Janssen (`jean-grey-famke-janssen`)
35. **Cyclops (Scott Summers)** — James Marsden (`cyclops-james-marsden`)

### F. Sony's Spider-Man Universe (SSU)
36. **Venom (Eddie Brock)** — Tom Hardy (`venom-tom-hardy`)

### G. Tim Story Fantastic Four (Earth-121698)
37. **Mister Fantastic (Reed Richards)** — Ioan Gruffudd (`reed-richards-ioan-gruffudd`)
38. **Invisible Woman (Sue Storm)** — Jessica Alba (`invisible-woman-jessica-alba`)
39. **Human Torch (Johnny Storm)** — Chris Evans (`human-torch-chris-evans`)
40. **The Thing (Ben Grimm)** — Michael Chiklis (`the-thing-michael-chiklis`)
41. **Doctor Doom (Victor von Doom)** — Julian McMahon (`doctor-doom-julian-mcmahon`)

### H. Alternate Multiversal Variant (Earth-838)
42. **Mister Fantastic (Reed Richards - Earth-838)** — John Krasinski (`reed-richards-earth-838`)

### I. Blade Trilogy (Earth-26320)
43. **Blade (Eric Brooks)** — Wesley Snipes (`blade-wesley-snipes`)

---

## 4. Verified Teams and Organizations

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

## 5. Automated Data Validation Suite

All records are programmatically verified against:
- Unique ID and slug enforcement
- Existence of parent identity in `identities.json`
- Valid continuity reference in `universes.json`
- Valid film debut and appearance IDs in `films.json` / `movies.json`
- Verified team references in `teams.json`
- Integrity of character relationships
- Non-empty source citations and ISO dates
- Strict separation between portrayals sharing identical hero identities
