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
} from "../src/data/encyclopedia/index.js";
import { CHARACTERS } from "../src/data/characters.js";
import mcuMovies from "../src/data/movies.json" with { type: "json" };

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
    assert.ok(portrayal.filmDebut.year > 1990, `Portrayal ${portrayal.slug} filmDebut year must be valid`);
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
