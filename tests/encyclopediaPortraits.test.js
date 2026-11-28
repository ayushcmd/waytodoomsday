import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile, unlink, rmdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import {
  PORTRAYALS,
  ACTOR_PORTRAITS,
  getPortrayalBySlug,
  getPortrayalPortraitEntry,
  getPortrayalPortraitUrl,
} from "../src/data/encyclopedia/index.js";
import {
  getActorPortraitUrl,
  isProfilePath,
  TMDB_PROFILE_SIZE,
  TMDB_PROFILE_LARGE_SIZE,
} from "../src/data/tmdb.js";
import {
  createClient,
  resolveEntry,
  verifiedPortrait,
  refreshEncyclopediaPortraits,
} from "../scripts/refresh-encyclopedia-portraits.mjs";

const date = "2026-11-28";
const now = new Date(`${date}T12:00:00Z`);
const unverified = (entry) => ({
  ...entry,
  tmdb: {
    ...entry.tmdb,
    personId: null,
    profilePath: null,
    verifiedAt: null,
    creditId: null,
  },
});

const sampleEntry = unverified(ACTOR_PORTRAITS[0]);
const makePerson = (record, index = 1) => ({
  id: index,
  name: record.actorName,
  profile_path: `/enc${index}.jpg`,
  combined_credits: {
    cast: [
      {
        id: index + 2000,
        title: record.tmdb.matchCredit.title,
        name: record.tmdb.matchCredit.title,
        media_type: record.tmdb.matchCredit.mediaType,
        character: record.tmdb.matchCredit.character,
        release_date: `${record.tmdb.matchCredit.year}-01-01`,
        first_air_date: `${record.tmdb.matchCredit.year}-01-01`,
      },
    ],
  },
});

async function withPortraits(run) {
  const directory = await mkdtemp(join(tmpdir(), "encyclopedia-portraits-test-"));
  const url = pathToFileURL(join(directory, "portraits.json"));
  await writeFile(url, JSON.stringify(ACTOR_PORTRAITS.map(unverified)));
  try {
    await run(url);
  } finally {
    await unlink(url);
    await rmdir(directory);
  }
}

test("1. Every published portrayal maps to a verified actor portrait entry with safe metadata", () => {
  const personIds = new Set();
  for (const record of ACTOR_PORTRAITS) {
    assert.ok(record.actorName);
    assert.ok(Array.isArray(record.portrayalSlugs) && record.portrayalSlugs.length > 0);
    assert.ok(record.tmdb.matchCredit.title && record.tmdb.matchCredit.character);
    assert.ok(Number.isInteger(record.tmdb.matchCredit.year));
    assert.ok(["movie", "tv"].includes(record.tmdb.matchCredit.mediaType));

    if (record.tmdb.personId !== null) {
      assert.ok(Number.isSafeInteger(record.tmdb.personId) && record.tmdb.personId > 0);
      assert.ok(!personIds.has(record.tmdb.personId), `Duplicate personId in portraits.json: ${record.actorName}`);
      personIds.add(record.tmdb.personId);
      if (record.tmdb.profilePath) {
        assert.ok(isProfilePath(record.tmdb.profilePath));
      }
    }
  }

  for (const portrayal of PORTRAYALS) {
    const entry = getPortrayalPortraitEntry(portrayal);
    assert.ok(entry, `Missing portrait entry for portrayal ${portrayal.slug}`);
    const urlSmall = getPortrayalPortraitUrl(portrayal, TMDB_PROFILE_SIZE, now);
    const urlLarge = getPortrayalPortraitUrl(portrayal, TMDB_PROFILE_LARGE_SIZE, now);
    if (entry.tmdb.profilePath) {
      assert.ok(urlSmall.startsWith("https://image.tmdb.org/t/p/w185/"));
      assert.ok(urlLarge.startsWith("https://image.tmdb.org/t/p/h632/"));
    } else {
      assert.equal(urlSmall, null);
      assert.equal(urlLarge, null);
    }
  }
});

test("2. Shared actors across different character portrayals resolve consistently", () => {
  // Chris Evans: Captain America & Human Torch
  const capUrl = getPortrayalPortraitUrl("captain-america", TMDB_PROFILE_SIZE, now);
  const torchUrl = getPortrayalPortraitUrl("human-torch-chris-evans", TMDB_PROFILE_SIZE, now);
  assert.ok(capUrl);
  assert.equal(capUrl, torchUrl);

  // Hugh Jackman: Fox Wolverine & Alternate Wolverine
  const foxWolv = getPortrayalPortraitUrl("wolverine-hugh-jackman", TMDB_PROFILE_SIZE, now);
  const altWolv = getPortrayalPortraitUrl("wolverine-alternate-variant", TMDB_PROFILE_SIZE, now);
  assert.ok(foxWolv);
  assert.equal(foxWolv, altWolv);

  // Patrick Stewart: Fox Professor X & Earth-838 Professor X
  const foxProf = getPortrayalPortraitUrl("professor-x-patrick-stewart", TMDB_PROFILE_SIZE, now);
  const e838Prof = getPortrayalPortraitUrl("professor-x-earth-838", TMDB_PROFILE_SIZE, now);
  assert.ok(foxProf);
  assert.equal(foxProf, e838Prof);

  // Ryan Reynolds: Deadpool & Weapon XI
  const dpUrl = getPortrayalPortraitUrl("deadpool-ryan-reynolds", TMDB_PROFILE_SIZE, now);
  const wxiUrl = getPortrayalPortraitUrl("weapon-xi-wade-wilson", TMDB_PROFILE_SIZE, now);
  assert.ok(dpUrl);
  assert.equal(dpUrl, wxiUrl);
});

test("3. Incorrect actor, wrong film credit, missing profile, expired date, and unsafe paths are rejected", () => {
  const tmdb = verifiedPortrait(makePerson(sampleEntry), sampleEntry, date);
  assert.equal(getActorPortraitUrl({ tmdb }, now, TMDB_PROFILE_SIZE), "https://image.tmdb.org/t/p/w185/enc1.jpg");
  assert.equal(getActorPortraitUrl({ tmdb }, now, TMDB_PROFILE_LARGE_SIZE), "https://image.tmdb.org/t/p/h632/enc1.jpg");

  // Unsafe size falls back to w185
  assert.equal(getActorPortraitUrl({ tmdb }, now, "original"), "https://image.tmdb.org/t/p/w185/enc1.jpg");

  // Incorrect actor name
  assert.equal(verifiedPortrait({ ...makePerson(sampleEntry), name: "Wrong Actor" }, sampleEntry, date), null);

  // Mismatched film credit
  for (const mismatch of [{ title: "Wrong Movie" }, { release_date: "1999-01-01" }, { character: "Wrong Role" }]) {
    const candidate = makePerson(sampleEntry);
    Object.assign(candidate.combined_credits.cast[0], mismatch);
    assert.equal(verifiedPortrait(candidate, sampleEntry, date), null);
  }

  // Missing profile_path
  const missingImage = { ...makePerson(sampleEntry), profile_path: null };
  assert.equal(verifiedPortrait(missingImage, sampleEntry, date).profilePath, null);
  assert.equal(getActorPortraitUrl({ tmdb: { ...tmdb, profilePath: null } }, now), null);

  // Unsafe image paths
  for (const badPath of ["https://evil.com/x.jpg", "//evil.com/x.jpg", "/../x.jpg", "/x.jpg?api_key=123", "/x.svg"]) {
    assert.equal(getActorPortraitUrl({ tmdb: { ...tmdb, profilePath: badPath } }, now), null);
  }

  // Expired (> 180 days) and future verification dates
  assert.equal(getActorPortraitUrl({ tmdb: { ...tmdb, verifiedAt: "2026-01-01" } }, now), null);
  assert.equal(getActorPortraitUrl({ tmdb: { ...tmdb, verifiedAt: "2027-01-01" } }, now), null);
});

test("4. Resolver rejects ambiguous candidates and verifies beyond first result", async () => {
  const api = async (path) =>
    path === "search/person"
      ? { total_pages: 1, results: [{ id: 2 }, { id: 1 }] }
      : path === "person/2"
      ? { ...makePerson(sampleEntry, 2), combined_credits: { cast: [] } }
      : makePerson(sampleEntry, 1);

  assert.equal((await resolveEntry(sampleEntry, api, date)).personId, 1);

  const ambiguous = async (path) =>
    path === "search/person"
      ? { total_pages: 1, results: [{ id: 1 }, { id: 2 }] }
      : makePerson(sampleEntry, Number(path.split("/")[1]));
  assert.equal(await resolveEntry(sampleEntry, ambiguous, date), null);
});

test("5. Offline no-op, license requirement, clear flag, and credential safety", async () =>
  withPortraits(async (portraitsUrl) => {
    const before = await readFile(portraitsUrl, "utf8");
    const offline = await refreshEncyclopediaPortraits({
      portraitsUrl,
      log: () => {},
      api: () => assert.fail("No API request expected offline"),
    });
    assert.equal(offline.updated, false);
    assert.equal(await readFile(portraitsUrl, "utf8"), before);

    await assert.rejects(
      refreshEncyclopediaPortraits({ portraitsUrl, token: "test-token", licenseReviewed: false }),
      /license eligibility/
    );

    const api = async (path, params) => {
      if (path === "configuration") {
        return { images: { secure_base_url: "https://image.tmdb.org/t/p/", profile_sizes: ["w185", "h632"] } };
      }
      if (path === "search/person") {
        const idx = ACTOR_PORTRAITS.findIndex((r) => r.actorName === params.query);
        return { total_pages: 1, results: [{ id: idx + 1 }] };
      }
      const id = Number(path.split("/")[1]);
      return makePerson(ACTOR_PORTRAITS[id - 1], id);
    };

    const refreshed = await refreshEncyclopediaPortraits({
      portraitsUrl,
      token: "test-token",
      licenseReviewed: true,
      api,
      verifiedAt: date,
      log: () => {},
    });
    assert.equal(refreshed.verified, ACTOR_PORTRAITS.length);

    await refreshEncyclopediaPortraits({ portraitsUrl, clear: true, log: () => {} });
    const cleared = JSON.parse(await readFile(portraitsUrl, "utf8"));
    assert.ok(cleared.every((r) => r.tmdb.personId === null && r.tmdb.profilePath === null));
  }));

test("6. Network/auth failures cannot leak token or corrupt metadata", async () =>
  withPortraits(async (portraitsUrl) => {
    const token = "SECRET-SENTINEL-DO-NOT-LEAK";
    const client = createClient(token, async (url, options) => {
      assert.ok(!String(url).includes(token));
      assert.equal(options.headers.Authorization, `Bearer ${token}`);
      throw new Error(`network failure containing ${token}`);
    });
    const before = await readFile(portraitsUrl, "utf8");
    await assert.rejects(
      refreshEncyclopediaPortraits({ portraitsUrl, token, licenseReviewed: true, api: client }),
      (err) => {
        assert.ok(!err.message.includes(token));
        return true;
      }
    );
    assert.equal(await readFile(portraitsUrl, "utf8"), before);
  }));

test("7. Legacy 5 character slugs remain compatible with encyclopedia portraits", () => {
  for (const slug of ["iron-man", "thor", "captain-america", "spider-man", "star-lord"]) {
    const p = getPortrayalBySlug(slug);
    assert.ok(p);
    assert.ok(getPortrayalPortraitUrl(p, TMDB_PROFILE_SIZE, now));
  }
});
