import test from "node:test";
import assert from "node:assert/strict";
import {
  UNIVERSES,
  FILMS,
  IDENTITIES,
  TEAMS,
  PORTRAYALS,
  getPortrayalBySlug,
  getPortrayalById,
  getPortrayalsByIdentity,
  getAlternatePortrayals,
  getTeamBySlug,
  getTeamById,
  getTeamMembers,
  getUniverseById,
  getFilmById,
  searchAndFilterPortrayals,
  getTeamAllies,
  isTeamMember,
  isTeamAlly,
} from "../src/data/encyclopedia/index.js";
import { CHARACTERS } from "../src/data/characters.js";
import mcuMovies from "../src/data/movies.json" with { type: "json" };
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test("1. Data schema validation for portrayals, teams, universes, and films", () => {
  assert.ok(UNIVERSES.length >= 7, "Must contain at least 7 major continuities");
  assert.ok(TEAMS.length >= 12, "Must contain at least 12 verified teams and organizations");
  assert.ok(PORTRAYALS.length >= 30, "Must contain at least 30 verified portrayals");

  const universeIds = new Set(UNIVERSES.map((u) => u.id));
  const identityIds = new Set(IDENTITIES.map((i) => i.id));
  const filmIds = new Set(FILMS.map((f) => f.id));
  const teamIds = new Set(TEAMS.map((t) => t.id));

  for (const portrayal of PORTRAYALS) {
    assert.ok(portrayal.id, "Portrayal must have an id");
    assert.ok(portrayal.slug, "Portrayal must have a slug");
    assert.ok(portrayal.name, "Portrayal must have a display name");
    assert.ok(portrayal.actor, "Portrayal must have an actor credit");
    assert.ok(portrayal.biography && portrayal.biography.length > 50, "Portrayal must have a substantial biography");
    assert.ok(universeIds.has(portrayal.universeId), `Portrayal ${portrayal.slug} has invalid universeId ${portrayal.universeId}`);
    assert.ok(identityIds.has(portrayal.identityId), `Portrayal ${portrayal.slug} has invalid identityId ${portrayal.identityId}`);

    // Film debut verification
    assert.ok(portrayal.filmDebut, `Portrayal ${portrayal.slug} missing filmDebut`);
    assert.ok(portrayal.filmDebut.year >= 1985, `Portrayal ${portrayal.slug} filmDebut year must be valid`);
    assert.ok(filmIds.has(portrayal.filmDebut.filmId), `Film debut ${portrayal.filmDebut.filmId} missing from films.json`);

    // Film appearances verification
    assert.ok(Array.isArray(portrayal.appearances) && portrayal.appearances.length > 0);
    for (const app of portrayal.appearances) {
      assert.ok(filmIds.has(app.filmId), `Appearance filmId ${app.filmId} missing from films.json`);
    }

    // Team membership integrity
    if (Array.isArray(portrayal.teamMemberships)) {
      for (const m of portrayal.teamMemberships) {
        assert.ok(teamIds.has(m.teamId), `Team ID ${m.teamId} in ${portrayal.slug} does not exist in teams.json`);
      }
    }

    // Source verification
    assert.ok(Array.isArray(portrayal.sources) && portrayal.sources.length > 0, `${portrayal.slug} must have sources`);
    for (const src of portrayal.sources) {
      assert.ok(src.url.startsWith("https://"), `Source URL must be https in ${portrayal.slug}`);
      assert.match(src.verifiedDate, /^\d{4}-\d{2}-\d{2}$/, `Source verifiedDate must be YYYY-MM-DD in ${portrayal.slug}`);
    }
  }
});

test("2. Identity vs Portrayal separation: variants are distinct entities", () => {
  // Spider-Man identity variants check
  const spiderMen = getPortrayalsByIdentity("peter-parker");
  assert.ok(spiderMen.length >= 3, "Peter Parker must have at least 3 distinct portrayals");

  const actors = spiderMen.map((p) => p.actor);
  assert.ok(actors.includes("Tom Holland"), "Tom Holland must be Peter Parker");
  assert.ok(actors.includes("Tobey Maguire"), "Tobey Maguire must be Peter Parker");
  assert.ok(actors.includes("Andrew Garfield"), "Andrew Garfield must be Peter Parker");

  // Verify continuities are separate
  const continuities = new Set(spiderMen.map((p) => p.universeId));
  assert.equal(continuities.size, 3, "Each Spider-Man portrayal must belong to a different continuity");

  // Verify Miles Morales is a separate identity from Peter Parker
  const miles = getPortrayalsByIdentity("miles-morales");
  assert.equal(miles.length, 1);
  assert.notEqual(miles[0].identityId, "peter-parker");

  // Verify Reed Richards has multiple distinct portrayals (Story vs Earth-838)
  const reedVariants = getPortrayalsByIdentity("reed-richards");
  assert.ok(reedVariants.length >= 2, "Reed Richards must have multiple film variants");
  assert.notEqual(reedVariants[0].universeId, reedVariants[1].universeId);

  // Alternate portrayals lookup helper
  const hollandAlts = getAlternatePortrayals("spider-man");
  assert.equal(hollandAlts.length, 2);
  assert.ok(hollandAlts.every((p) => p.slug !== "spider-man"));
});

test("3. Unique ID and Slug generation across all portrayals and teams", () => {
  const portrayalSlugs = new Set();
  const portrayalIds = new Set();
  for (const p of PORTRAYALS) {
    assert.ok(!portrayalSlugs.has(p.slug), `Duplicate portrayal slug detected: ${p.slug}`);
    assert.ok(!portrayalIds.has(p.id), `Duplicate portrayal id detected: ${p.id}`);
    portrayalSlugs.add(p.slug);
    portrayalIds.add(p.id);
  }

  const teamSlugs = new Set();
  const teamIds = new Set();
  for (const t of TEAMS) {
    assert.ok(!teamSlugs.has(t.slug), `Duplicate team slug detected: ${t.slug}`);
    assert.ok(!teamIds.has(t.id), `Duplicate team id detected: ${t.id}`);
    teamSlugs.add(t.slug);
    teamIds.add(t.id);
  }
});

test("4. Invalid relationship detection and link validity", () => {
  const publishedSlugs = new Set(PORTRAYALS.map((p) => p.slug));
  for (const p of PORTRAYALS) {
    if (Array.isArray(p.relationships)) {
      for (const rel of p.relationships) {
        if (rel.portrayalSlug) {
          assert.ok(
            publishedSlugs.has(rel.portrayalSlug),
            `Relationship in ${p.slug} points to invalid portrayalSlug: ${rel.portrayalSlug}`
          );
        }
      }
    }
  }
});

test("5. Team and Organization distinction and membership integrity", () => {
  const avengers = getTeamBySlug("avengers-mcu");
  assert.ok(avengers);
  assert.equal(avengers.category, "team");

  const shield = getTeamBySlug("shield-mcu");
  assert.ok(shield);
  assert.equal(shield.category, "organization");

  const brotherhood = getTeamBySlug("brotherhood-of-mutants-fox");
  assert.ok(brotherhood);
  assert.equal(brotherhood.category, "faction");

  // Verify members resolve properly
  const avengerMembers = getTeamMembers("avengers-mcu");
  assert.ok(avengerMembers.length >= 6, "Avengers must have at least 6 verified members");
  assert.ok(avengerMembers.some((m) => m.slug === "iron-man"));
  assert.ok(avengerMembers.some((m) => m.slug === "captain-america"));
  assert.ok(avengerMembers.some((m) => m.slug === "thor"));

  const xmenMembers = getTeamMembers("x-men-fox");
  assert.ok(xmenMembers.length >= 4, "X-Men must have verified members");
  assert.ok(xmenMembers.some((m) => m.slug === "wolverine-hugh-jackman"));
});

test("6. Character search covers name, alias, actor, movie, and team", () => {
  // Search by hero name
  const ironManResults = searchAndFilterPortrayals({ query: "Iron Man" });
  assert.ok(ironManResults.some((p) => p.slug === "iron-man"));

  // Search by real name
  const starkResults = searchAndFilterPortrayals({ query: "Tony Stark" });
  assert.ok(starkResults.some((p) => p.slug === "iron-man"));

  // Search by actor
  const hollandResults = searchAndFilterPortrayals({ query: "Tom Holland" });
  assert.ok(hollandResults.some((p) => p.slug === "spider-man"));

  // Search by movie title
  const ragnarokResults = searchAndFilterPortrayals({ query: "Ragnarok" });
  assert.ok(ragnarokResults.some((p) => p.slug === "thor"));
  assert.ok(ragnarokResults.some((p) => p.slug === "hulk-bruce-banner"));

  // Search by team name
  const guardianResults = searchAndFilterPortrayals({ query: "Guardians of the Galaxy" });
  assert.ok(guardianResults.some((p) => p.slug === "star-lord"));
});

test("7. Universe and role filtering functionality", () => {
  const foxResults = searchAndFilterPortrayals({ universe: "fox-xmen" });
  assert.ok(foxResults.length >= 8);
  assert.ok(foxResults.every((p) => p.universeId === "fox-xmen"));

  const villains = searchAndFilterPortrayals({ role: "villain" });
  assert.ok(villains.length >= 3);
  assert.ok(villains.some((p) => p.slug === "green-goblin-willem-dafoe"));
  assert.ok(villains.some((p) => p.slug === "doctor-octopus-alfred-molina"));

  // Combined filter
  const raimiVillains = searchAndFilterPortrayals({ universe: "raimi-spiderman", role: "villain" });
  assert.ok(raimiVillains.length >= 2);
  assert.ok(raimiVillains.every((p) => p.universeId === "raimi-spiderman" && p.role === "villain"));
});

test("8. Legacy route compatibility with the 5 original characters", () => {
  const legacySlugs = ["iron-man", "thor", "captain-america", "spider-man", "star-lord"];

  // Verify CHARACTERS in characters.js retains the 5 legacy items
  assert.equal(CHARACTERS.length, 5);
  for (const legacy of CHARACTERS) {
    assert.ok(legacySlugs.includes(legacy.slug));
    assert.ok(legacy.name && legacy.actor && legacy.tagline && legacy.poster);
    assert.ok(Array.isArray(legacy.movieIds) && legacy.movieIds.length > 0);
  }

  // Verify that encyclopedia portrays these exact slugs
  for (const slug of legacySlugs) {
    const p = getPortrayalBySlug(slug);
    assert.ok(p, `Legacy slug ${slug} must exist in the encyclopedia`);
    assert.equal(p.slug, slug);
  }
});

test("9. Film-reference matching and separation from movies.json", () => {
  const mcuIds = new Set(mcuMovies.map((m) => m.id));

  // Verify MCU films in films.json correctly correspond to movies.json
  const mcuFilms = FILMS.filter((f) => f.isMcu);
  for (const film of mcuFilms) {
    assert.ok(mcuIds.has(film.id), `MCU film ${film.id} in films.json does not exist in movies.json`);
  }

  // Verify non-MCU films are flagged as isMcu: false
  const nonMcuFilms = FILMS.filter((f) => !f.isMcu);
  assert.ok(nonMcuFilms.length >= 10, "Must have non-MCU film references");
  for (const film of nonMcuFilms) {
    assert.equal(film.isMcu, false);
    assert.notEqual(film.universeId, "mcu");
  }
});

test("10. Draft/unverified records are strictly excluded from published PORTRAYALS", () => {
  for (const p of PORTRAYALS) {
    assert.equal(p.status, "published");
    assert.ok(p.biography && p.biography.length > 0);
    assert.ok(p.sources && p.sources.length > 0);
  }
});

test("11. Published count integrity and research document synchronization", () => {
  assert.equal(PORTRAYALS.length, 95, "Expected exactly 95 published character portrayals");

  const docPath = path.resolve(__dirname, "../docs/research/marvel-encyclopedia-coverage.md");
  assert.ok(fs.existsSync(docPath), "Research coverage document must exist");
  const docContent = fs.readFileSync(docPath, "utf-8");

  // Verify documentation claims 95 portrayals
  assert.match(
    docContent,
    /\*\*95 verified character portrayals\*\*/,
    "Research documentation must specify exactly 95 verified character portrayals"
  );
  assert.match(
    docContent,
    /\*\*Total Published Portrayals:\*\* 95/,
    "Research documentation summary must state 95 published portrayals"
  );

  // Check per-universe count synchronization in documentation table
  const universeCounts = {};
  for (const p of PORTRAYALS) {
    universeCounts[p.universeId] = (universeCounts[p.universeId] || 0) + 1;
  }
  assert.equal(universeCounts["mcu"], 41);
  assert.equal(universeCounts["fox-xmen"], 17);
  assert.equal(universeCounts["mcu-828"], 6);
  assert.equal(universeCounts["story-fantastic-four"], 5);
  assert.equal(universeCounts["fox-daredevil"], 5);
  assert.equal(universeCounts["sony-ghost-rider"], 4);
  assert.equal(universeCounts["raimi-spiderman"], 3);
  assert.equal(universeCounts["sony-spiderverse"], 3);
  assert.equal(universeCounts["webb-spiderman"], 2);
  assert.equal(universeCounts["mcu-838"], 2);
  assert.equal(universeCounts["punisher-2004"], 2);
  assert.equal(universeCounts["punisher-war-zone-2008"], 2);
  assert.equal(universeCounts["sony-ssu"], 1);
  assert.equal(universeCounts["trill-blade"], 1);
  assert.equal(universeCounts["punisher-1989"], 1);
});

test("12. Professor X variant separation: Earth-10005 vs Earth-838", () => {
  const foxXavier = getPortrayalBySlug("professor-x-patrick-stewart");
  assert.ok(foxXavier, "Fox Professor X must exist");
  assert.equal(foxXavier.universeId, "fox-xmen");
  assert.equal(foxXavier.actor, "Patrick Stewart");
  assert.ok(foxXavier.teamMemberships.some((m) => m.teamId === "x-men-fox"));
  assert.ok(!foxXavier.teamMemberships.some((m) => m.teamId === "illuminati-earth-838"));
  assert.ok(!foxXavier.appearances.some((a) => a.filmId === "doctor-strange-multiverse-of-madness"));

  const earth838Xavier = getPortrayalBySlug("professor-x-earth-838");
  assert.ok(earth838Xavier, "Earth-838 Professor X must exist");
  assert.equal(earth838Xavier.universeId, "mcu-838");
  assert.equal(earth838Xavier.actor, "Patrick Stewart");
  assert.ok(earth838Xavier.teamMemberships.some((m) => m.teamId === "illuminati-earth-838"));
  assert.ok(!earth838Xavier.teamMemberships.some((m) => m.teamId === "x-men-fox"));
  assert.equal(earth838Xavier.appearances.length, 1);
  assert.equal(earth838Xavier.appearances[0].filmId, "doctor-strange-multiverse-of-madness");

  // Both share the same identity family
  assert.equal(foxXavier.identityId, "charles-xavier");
  assert.equal(earth838Xavier.identityId, "charles-xavier");

  // Alternate portrayals cross-linking works
  const xavierVariants = getAlternatePortrayals(foxXavier.slug);
  assert.ok(xavierVariants.some((v) => v.slug === "professor-x-earth-838"));
  assert.ok(xavierVariants.some((v) => v.slug === "professor-x-james-mcavoy"));
});

test("13. Wolverine variant separation: Earth-10005 vs Deadpool & Wolverine alternate variant", () => {
  const foxLogan = getPortrayalBySlug("wolverine-hugh-jackman");
  assert.ok(foxLogan, "Original Fox Wolverine must exist");
  assert.equal(foxLogan.universeId, "fox-xmen");
  assert.ok(foxLogan.appearances.some((a) => a.filmId === "x-men-2000"));
  assert.ok(foxLogan.appearances.some((a) => a.filmId === "logan-2017"));
  assert.ok(!foxLogan.appearances.some((a) => a.filmId === "deadpool-and-wolverine"));

  const altLogan = getPortrayalBySlug("wolverine-alternate-variant");
  assert.ok(altLogan, "Alternate Wolverine variant must exist");
  assert.equal(altLogan.universeId, "mcu");
  assert.equal(altLogan.filmDebut.filmId, "deadpool-and-wolverine");
  assert.equal(altLogan.filmDebut.year, 2024);
  assert.equal(altLogan.appearances.length, 1);
  assert.equal(altLogan.appearances[0].filmId, "deadpool-and-wolverine");

  // Alternate Wolverine must NOT be affiliated with Earth-10005 Fox X-Men
  assert.ok(
    !altLogan.teamMemberships || !altLogan.teamMemberships.some((m) => m.teamId === "x-men-fox"),
    "Alternate Wolverine must not be affiliated with Earth-10005 Fox X-Men"
  );
  const foxXmen = getTeamMembers("x-men-fox");
  assert.ok(
    !foxXmen.some((m) => m.slug === "wolverine-alternate-variant"),
    "Alternate Wolverine must not appear in Earth-10005 Fox X-Men roster"
  );
  assert.ok(
    foxXmen.some((m) => m.slug === "wolverine-hugh-jackman"),
    "Original Fox Wolverine must be in Fox X-Men roster"
  );

  // Shared identity
  assert.equal(foxLogan.identityId, "logan-wolverine");
  assert.equal(altLogan.identityId, "logan-wolverine");

  // Alternate portrayals cross-linking works
  const loganVariants = getAlternatePortrayals(foxLogan.slug);
  assert.ok(loganVariants.some((v) => v.slug === "wolverine-alternate-variant"));
});

test("14. Deadpool continuity audit: Deadpool vs Weapon XI separation", () => {
  const deadpool = getPortrayalBySlug("deadpool-ryan-reynolds");
  assert.ok(deadpool, "Main Deadpool portrayal must exist");
  assert.equal(deadpool.role, "anti-hero");
  assert.equal(deadpool.filmDebut.filmId, "deadpool-2016");
  assert.ok(deadpool.teamMemberships.some((m) => m.teamId === "x-force-fox"));

  const weaponXI = getPortrayalBySlug("weapon-xi-wade-wilson");
  assert.ok(weaponXI, "Weapon XI portrayal must exist");
  assert.equal(weaponXI.role, "villain");
  assert.equal(weaponXI.filmDebut.filmId, "x-men-origins-wolverine-2009");
  assert.ok(!weaponXI.teamMemberships?.some((m) => m.teamId === "x-force-fox"));

  // Shared identity
  assert.equal(deadpool.identityId, "wade-wilson");
  assert.equal(weaponXI.identityId, "wade-wilson");

  // Cross-linking
  const wadeVariants = getAlternatePortrayals(deadpool.slug);
  assert.ok(wadeVariants.some((v) => v.slug === "weapon-xi-wade-wilson"));
});

test("15. Team roster vs ally distinction", () => {
  // Avengers: Doctor Strange and Black Panther are allies, not core roster members
  const avengerMembers = getTeamMembers("avengers-mcu");
  const avengerAllies = getTeamAllies("avengers-mcu");

  assert.ok(!avengerMembers.some((m) => m.slug === "doctor-strange"), "Doctor Strange is an ally, not a core member");
  assert.ok(!avengerMembers.some((m) => m.slug === "black-panther"), "Black Panther is an ally, not a core member");

  assert.ok(avengerAllies.some((a) => a.slug === "doctor-strange"), "Doctor Strange must be in Avengers allies");
  assert.ok(avengerAllies.some((a) => a.slug === "black-panther"), "Black Panther must be in Avengers allies");

  // Guardians of the Galaxy: Thor is an ally/collaborator, not a core member
  const guardianMembers = getTeamMembers("guardians-of-the-galaxy-mcu");
  const guardianAllies = getTeamAllies("guardians-of-the-galaxy-mcu");
  assert.ok(!guardianMembers.some((m) => m.slug === "thor"), "Thor is an ally of the Guardians, not a full member");
  assert.ok(guardianAllies.some((a) => a.slug === "thor"), "Thor must be in Guardians allies");

  // TVA: Loki is an ally/collaborator
  const tvaMembers = getTeamMembers("tva-mcu");
  const tvaAllies = getTeamAllies("tva-mcu");
  assert.ok(!tvaMembers.some((m) => m.slug === "loki"), "Loki is a consultant/collaborator, not staff member");
  assert.ok(tvaAllies.some((a) => a.slug === "loki"), "Loki must be in TVA collaborators");

  // Helper validation
  assert.ok(isTeamMember({ type: "member" }));
  assert.ok(isTeamMember({ type: "former-member" }));
  assert.ok(!isTeamMember({ type: "ally" }));
  assert.ok(isTeamAlly({ type: "ally" }));
  assert.ok(isTeamAlly({ type: "collaborator" }));
  assert.ok(!isTeamAlly({ type: "member" }));
});

test("16. Spoiler concealing integrity: sensitive narrative data is separated", () => {
  const charactersWithSpoilers = PORTRAYALS.filter((p) => p.spoilerWarning);
  assert.ok(charactersWithSpoilers.length >= 14, "Must have spoiler protection on major fate-bearing characters");

  for (const c of charactersWithSpoilers) {
    assert.ok(c.spoilerBio && c.spoilerBio.length > 30, `${c.slug} must have a non-empty spoilerBio`);
    // Basic biography should not contain explicit death spoilers
    assert.ok(
      !c.biography.toLowerCase().includes("sacrifices his life") &&
      !c.biography.toLowerCase().includes("sacrificed his life") &&
      !c.biography.toLowerCase().includes("snapping the infinity stones to defeat thanos"),
      `${c.slug} base biography should not reveal endgame death`
    );
  }

  // Specific check for Iron Man
  const ironMan = getPortrayalBySlug("iron-man");
  assert.ok(ironMan.spoilerWarning);
  assert.ok(ironMan.spoilerBio.includes("sacrificing his life"));

  // Specific check for Fox Wolverine
  const foxLogan = getPortrayalBySlug("wolverine-hugh-jackman");
  assert.ok(foxLogan.spoilerWarning);
  assert.ok(foxLogan.spoilerBio.includes("holding Laura's hand"));

  // Specific check for Jean Grey
  const jean = getPortrayalBySlug("jean-grey-famke-janssen");
  assert.ok(jean.spoilerWarning);
  assert.ok(jean.spoilerBio.includes("pleaded with Logan to end her life"));
  assert.ok(!jean.biography.includes("begged Logan to end her life"));

  // Specific check for Thor
  const thor = getPortrayalBySlug("thor");
  assert.ok(thor.spoilerWarning);
  assert.ok(thor.spoilerBio.includes("Jane Foster"));
  assert.ok(!thor.biography.includes("destruction of Asgard"));

  // Specific check for Hawkeye
  const hawkeye = getPortrayalBySlug("hawkeye");
  assert.ok(hawkeye.spoilerWarning);
  assert.ok(hawkeye.spoilerBio.includes("Ronin"));
  assert.ok(!hawkeye.biography.includes("blood-soaked persona of Ronin"));

  // Specific check for Andrew Garfield Spider-Man
  const andrew = getPortrayalBySlug("spider-man-andrew-garfield");
  assert.ok(andrew.spoilerWarning);
  assert.ok(andrew.spoilerBio.includes("Gwen Stacy fell"));
  assert.ok(!andrew.biography.includes("devastating loss of Gwen Stacy"));

  // Specific check for Sam Wilson
  const sam = getPortrayalBySlug("sam-wilson");
  assert.ok(sam.spoilerWarning);
  assert.ok(sam.spoilerBio.includes("passed his original circular vibranium shield to Wilson"));
  assert.ok(!sam.biography.includes("passed his shield to Wilson"));
});

test("17. CharacterDirectory search and filter normalization resilience", () => {
  // Test search covering aliases, actors, and movies
  const searchResults = searchAndFilterPortrayals({ query: "Gwen" });
  assert.ok(searchResults.some((p) => p.slug === "spider-gwen-hailee-steinfeld"));

  // Test URL query string parameter formatting matches expected keys
  const formatParams = (filters) => {
    const params = new URLSearchParams();
    if (filters.query?.trim()) params.set("q", filters.query.trim());
    if (filters.universe && filters.universe !== "all") params.set("universe", filters.universe);
    if (filters.team && filters.team !== "all") params.set("team", filters.team);
    if (filters.role && filters.role !== "all") params.set("role", filters.role);
    if (filters.sort && filters.sort !== "debut-asc") params.set("sort", filters.sort);
    return params.toString();
  };

  const formatted = formatParams({
    query: "Logan",
    universe: "fox-xmen",
    role: "hero",
    sort: "name-asc",
  });
  assert.equal(formatted, "q=Logan&universe=fox-xmen&role=hero&sort=name-asc");

  // Re-parsing gives exact same values
  const parsed = new URLSearchParams(formatted);
  assert.equal(parsed.get("q"), "Logan");
  assert.equal(parsed.get("universe"), "fox-xmen");
  assert.equal(parsed.get("role"), "hero");
  assert.equal(parsed.get("sort"), "name-asc");
});

test("18. Batch 1 expansion: Guardians roster, Mystique variants, and spoiler integrity", () => {
  // Guardians of the Galaxy roster members vs Yondu ally
  const guardianMembers = getTeamMembers("guardians-of-the-galaxy-mcu");
  const guardianAllies = getTeamAllies("guardians-of-the-galaxy-mcu");
  for (const slug of ["star-lord", "gamora", "drax", "rocket-raccoon", "groot", "nebula", "mantis"]) {
    assert.ok(guardianMembers.some((m) => m.slug === slug), `${slug} must be a Guardians member`);
  }
  assert.ok(!guardianMembers.some((m) => m.slug === "yondu-udonta"), "Yondu is an ally, not a core Guardians member");
  assert.ok(guardianAllies.some((a) => a.slug === "yondu-udonta"), "Yondu must appear in Guardians allies");

  // Mystique dual-incarnation variant separation
  const mystiques = getPortrayalsByIdentity("raven-darkholme");
  assert.equal(mystiques.length, 2);
  const youngMystique = getPortrayalBySlug("mystique-jennifer-lawrence");
  const origMystique = getPortrayalBySlug("mystique-rebecca-romijn");
  assert.equal(youngMystique.actor, "Jennifer Lawrence");
  assert.equal(origMystique.actor, "Rebecca Romijn");
  assert.ok(getAlternatePortrayals("mystique-jennifer-lawrence").some((p) => p.slug === "mystique-rebecca-romijn"));

  // Batch 1 spoiler checks
  for (const slug of [
    "gamora",
    "gamora-2014-variant",
    "groot",
    "groot-young",
    "yondu-udonta",
    "thanos",
    "thanos-2014-variant",
    "nebula-2014-variant",
    "vision",
    "mysterio-jake-gyllenhaal",
    "mystique-jennifer-lawrence",
  ]) {
    const p = getPortrayalBySlug(slug);
    assert.ok(p.spoilerWarning, `${slug} must have spoilerWarning`);
    assert.ok(p.spoilerBio && p.spoilerBio.length > 30, `${slug} must have spoilerBio`);
  }
});

test("19. Gamora, Groot, Thanos, and Nebula variant & lineage separation", () => {
  // Gamora separation: original Guardians Gamora vs 2014 Ravager Gamora
  const origGamora = getPortrayalBySlug("gamora");
  const varGamora = getPortrayalBySlug("gamora-2014-variant");
  assert.ok(origGamora && varGamora);
  assert.equal(origGamora.identityId, "gamora");
  assert.equal(varGamora.identityId, "gamora");
  assert.deepEqual(
    origGamora.appearances.map((a) => a.filmId),
    ["guardians-vol-1", "guardians-vol-2", "avengers-infinity-war"]
  );
  assert.deepEqual(
    varGamora.appearances.map((a) => a.filmId),
    ["avengers-endgame", "guardians-vol-3"]
  );
  assert.ok(origGamora.teamMemberships.some((m) => m.teamId === "guardians-of-the-galaxy-mcu"));
  assert.ok(!origGamora.teamMemberships.some((m) => m.teamId === "ravagers-mcu"));
  assert.ok(varGamora.teamMemberships.some((m) => m.teamId === "ravagers-mcu"));
  assert.ok(!varGamora.teamMemberships.some((m) => m.teamId === "guardians-of-the-galaxy-mcu"));
  assert.ok(!getTeamMembers("guardians-of-the-galaxy-mcu").some((m) => m.slug === "gamora-2014-variant"));

  // Groot lineage: original Groot vs son (Young Groot) as distinct identities
  const origGroot = getPortrayalBySlug("groot");
  const youngGroot = getPortrayalBySlug("groot-young");
  assert.ok(origGroot && youngGroot);
  assert.notEqual(origGroot.identityId, youngGroot.identityId, "Father and son Groot must have distinct identities");
  assert.deepEqual(origGroot.appearances.map((a) => a.filmId), ["guardians-vol-1"]);
  assert.ok(youngGroot.appearances.some((a) => a.filmId === "guardians-vol-2"));
  assert.ok(youngGroot.appearances.some((a) => a.filmId === "guardians-vol-3"));
  assert.ok(origGroot.relationships.some((r) => r.portrayalSlug === "groot-young"));
  assert.ok(youngGroot.relationships.some((r) => r.portrayalSlug === "groot"));

  // Thanos & Nebula 2014 variants + no unsupported Eternal-Deviant claim
  const origThanos = getPortrayalBySlug("thanos");
  const varThanos = getPortrayalBySlug("thanos-2014-variant");
  assert.ok(origThanos && varThanos);
  assert.ok(!origThanos.biography.includes("Eternal-Deviant"));
  assert.deepEqual(varThanos.appearances.map((a) => a.filmId), ["avengers-endgame"]);

  const varNebula = getPortrayalBySlug("nebula-2014-variant");
  assert.ok(varNebula);
  assert.equal(varNebula.role, "villain");
  assert.equal(varNebula.teamMemberships.length, 0);
  assert.deepEqual(varNebula.appearances.map((a) => a.filmId), ["avengers-endgame"]);
});

test("20. Batch 2 continuities: Fantastic Four (Earth-828), Daredevil/Elektra, Ghost Rider, and Punisher", () => {
  // 1. Fantastic Four (2025) Earth-828 vs 2005 Story vs Earth-838
  const reed828 = getPortrayalBySlug("reed-richards-pedro-pascal");
  const reedStory = getPortrayalBySlug("reed-richards-ioan-gruffudd");
  const reed838 = getPortrayalBySlug("reed-richards-earth-838");
  assert.ok(reed828 && reedStory && reed838);
  assert.equal(reed828.universeId, "mcu-828");
  assert.equal(reedStory.universeId, "story-fantastic-four");
  assert.equal(reed838.universeId, "mcu-838");
  assert.equal(reed828.identityId, "reed-richards");

  const f4828 = getTeamBySlug("fantastic-four-828");
  assert.ok(f4828);
  const f4828Members = getTeamMembers("fantastic-four-828");
  assert.equal(f4828Members.length, 4);
  for (const slug of [
    "reed-richards-pedro-pascal",
    "sue-storm-vanessa-kirby",
    "johnny-storm-joseph-quinn",
    "ben-grimm-ebon-moss-bachrach",
  ]) {
    assert.ok(f4828Members.some((m) => m.slug === slug), `${slug} must be in Fantastic Four (Earth-828)`);
  }

  // 2. Daredevil & Elektra shared Fox continuity + Elektra Deadpool & Wolverine appearance
  const dd = getPortrayalBySlug("daredevil-ben-affleck");
  const elektra = getPortrayalBySlug("elektra-jennifer-garner");
  assert.equal(dd.universeId, "fox-daredevil");
  assert.equal(elektra.universeId, "fox-daredevil");
  assert.deepEqual(
    elektra.appearances.map((a) => a.filmId),
    ["daredevil-2003", "elektra-2005", "deadpool-and-wolverine"]
  );

  // 3. Ghost Rider duology
  const blaze = getPortrayalBySlug("ghost-rider-nicolas-cage");
  assert.equal(blaze.universeId, "sony-ghost-rider");
  assert.deepEqual(
    blaze.appearances.map((a) => a.filmId),
    ["ghost-rider-2007", "ghost-rider-spirit-of-vengeance-2012"]
  );

  // 4. Three distinct Punisher continuities sharing frank-castle identity
  const p1989 = getPortrayalBySlug("punisher-dolph-lundgren");
  const p2004 = getPortrayalBySlug("punisher-thomas-jane");
  const p2008 = getPortrayalBySlug("punisher-ray-stevenson");
  assert.equal(p1989.identityId, "frank-castle");
  assert.equal(p2004.identityId, "frank-castle");
  assert.equal(p2008.identityId, "frank-castle");
  assert.equal(new Set([p1989.universeId, p2004.universeId, p2008.universeId]).size, 3);

  // 5. Batch 2 spoiler checks
  for (const slug of [
    "reed-richards-pedro-pascal",
    "sue-storm-vanessa-kirby",
    "galactus-ralph-ineson",
    "silver-surfer-shalla-bal",
    "elektra-jennifer-garner",
    "punisher-thomas-jane",
  ]) {
    const p = getPortrayalBySlug(slug);
    assert.ok(p.spoilerWarning && p.spoilerBio && p.spoilerBio.length > 30, `${slug} must have spoiler protection`);
  }
});
