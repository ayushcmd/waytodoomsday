import test from "node:test";
import assert from "node:assert/strict";
import {
  DOOMSDAY_CAST, VERIFIED_CAST, FEATURED_CAST, CAST_GROUPS,
  CAST_VERIFIED_AT, UNDISCLOSED_CAST, filterCast,
} from "../src/data/doomsdayCast.js";

test("published portrayals have unique identities, official evidence and valid metadata", () => {
  const ids = new Set();
  const portrayals = new Set();
  for (const entry of DOOMSDAY_CAST) {
    assert.ok(entry.id && entry.characterName && entry.actorName);
    assert.ok(!ids.has(entry.id), `Duplicate ID: ${entry.id}`);
    ids.add(entry.id);
    const portrayal = `${entry.characterName}|${entry.actorName}`;
    assert.ok(!portrayals.has(portrayal), `Duplicate portrayal: ${portrayal}`);
    portrayals.add(portrayal);
    assert.equal(entry.status, "officially-confirmed");
    assert.ok(Object.hasOwn(CAST_GROUPS, entry.displayGroup));
    assert.ok(Array.isArray(entry.aliases));
    const source = new URL(entry.sourceUrl);
    assert.equal(source.protocol, "https:");
    assert.ok(["www.disneyplus.com", "movies.disney.com", "www.marvel.com",
      "thewaltdisneycompany.com", "press.disney.co.uk"].includes(source.hostname));
    assert.match(entry.verifiedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.equal(new Date(`${entry.verifiedAt}T00:00:00Z`).toISOString().slice(0, 10), entry.verifiedAt);
    assert.ok(Number.isFinite(entry.sortOrder));
  }
  assert.equal(VERIFIED_CAST.length, DOOMSDAY_CAST.length);
  assert.ok(FEATURED_CAST.length > 0 && FEATURED_CAST.length < VERIFIED_CAST.length);
  assert.ok(FEATURED_CAST.every((entry) => ids.has(entry.id)));
  assert.equal(CAST_VERIFIED_AT, [...VERIFIED_CAST].map((entry) => entry.verifiedAt).sort()[0]);
});

test("all 31 source-checked starting portrayals remain present, including returning roles", () => {
  // A reviewed baseline, not a maximum roster size: new verified entries may be added.
  const baseline = [
    ["Doctor Doom", "Robert Downey Jr."], ["Steve Rogers", "Chris Evans"],
    ["Thor", "Chris Hemsworth"], ["Sam Wilson", "Anthony Mackie"],
    ["Scott Lang", "Paul Rudd"], ["Shang-Chi", "Simu Liu"],
    ["Reed Richards", "Pedro Pascal"], ["Sue Storm", "Vanessa Kirby"],
    ["Johnny Storm", "Joseph Quinn"], ["Ben Grimm", "Ebon Moss-Bachrach"],
    ["Charles Xavier", "Patrick Stewart"], ["Erik Lehnsherr", "Ian McKellen"],
    ["Scott Summers", "James Marsden"], ["Hank McCoy", "Kelsey Grammer"],
    ["Kurt Wagner", "Alan Cumming"], ["Raven Darkholme", "Rebecca Romijn"],
    ["Remy LeBeau", "Channing Tatum"], ["Yelena Belova", "Florence Pugh"],
    ["Bucky Barnes", "Sebastian Stan"], ["John Walker", "Wyatt Russell"],
    ["Alexei Shostakov", "David Harbour"], ["Ava Starr", "Hannah John-Kamen"],
    ["Bob Reynolds", "Lewis Pullman"], ["Shuri", "Letitia Wright"],
    ["M’Baku", "Winston Duke"], ["Namor", "Tenoch Huerta Mejía"],
    ["Namora", "Mabel Cadena"], ["Loki", "Tom Hiddleston"],
    ["Peggy Carter", "Hayley Atwell"], ["Joaquin Torres", "Danny Ramirez"],
    ["Cassie Lang", "Kathryn Newton"],
  ];
  for (const [character, actor] of baseline) {
    assert.ok(VERIFIED_CAST.some((entry) => entry.characterName === character && entry.actorName === actor),
      `Missing or changed reviewed pairing: ${character} / ${actor}`);
  }
  assert.deepEqual(filterCast("Robert Downey").map((entry) => entry.characterName), ["Doctor Doom"]);
  assert.equal(filterCast("Iron Man").length, 0);
  assert.equal(filterCast("Tony Stark").length, 0);
  assert.deepEqual(filterCast("Captain America").map((entry) => entry.characterName), ["Steve Rogers", "Sam Wilson"]);
  assert.ok(UNDISCLOSED_CAST.every((actor) => !VERIFIED_CAST.some((entry) => entry.actorName === actor.actorName)));
});

test("search covers aliases, actors, accents, whitespace, punctuation and combined filters", () => {
  assert.equal(filterCast("  PEDRO   pascal ")[0].characterName, "Reed Richards");
  assert.equal(filterCast("Mister Fantastic")[0].actorName, "Pedro Pascal");
  assert.equal(filterCast("Mejia")[0].characterName, "Namor");
  assert.equal(filterCast("M'Baku")[0].actorName, "Winston Duke");
  assert.equal(filterCast("U.S. Agent")[0].actorName, "Wyatt Russell");
  assert.equal(filterCast("Captain America", "fantastic").length, 0);
  assert.equal(filterCast("Captain America", "avengers").length, 2);
  assert.equal(filterCast("nobody with this name").length, 0);
  assert.equal(filterCast("  ").length, VERIFIED_CAST.length);
});

test("All results and category partitions cover every verified entry exactly once", () => {
  assert.deepEqual(filterCast().map((entry) => entry.id), VERIFIED_CAST.map((entry) => entry.id));
  const grouped = Object.keys(CAST_GROUPS).flatMap((key) => filterCast("", key));
  assert.equal(grouped.length, VERIFIED_CAST.length);
  assert.equal(new Set(grouped.map((entry) => entry.id)).size, VERIFIED_CAST.length);
});
