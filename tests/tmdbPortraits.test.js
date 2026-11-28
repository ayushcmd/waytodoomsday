import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile, unlink, rmdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { DOOMSDAY_CAST } from "../src/data/doomsdayCast.js";
import { getActorPortraitUrl, isProfilePath } from "../src/data/tmdb.js";
import { createClient, resolveEntry, verifiedPortrait, refreshPortraits } from "../scripts/refresh-doomsday-portraits.mjs";

const date = "2026-11-28";
const now = new Date(`${date}T12:00:00Z`);
const unverified = (entry) => ({ ...entry, tmdb: { ...entry.tmdb,
  personId: null, profilePath: null, verifiedAt: null, creditId: null } });
const entry = unverified(DOOMSDAY_CAST[0]);
const person = (record, index = 1) => ({
  id: index, name: record.actorName, profile_path: `/test${index}.jpg`,
  combined_credits: { cast: [{ id: index + 1000,
    title: record.tmdb.matchCredit.title, name: record.tmdb.matchCredit.title,
    media_type: record.tmdb.matchCredit.mediaType, character: record.tmdb.matchCredit.character,
    release_date: `${record.tmdb.matchCredit.year}-01-01`, first_air_date: `${record.tmdb.matchCredit.year}-01-01` }] },
});

async function withRoster(run) {
  const directory = await mkdtemp(join(tmpdir(), "doomsday-portraits-test-"));
  const url = pathToFileURL(join(directory, "cast.json"));
  await writeFile(url, JSON.stringify(DOOMSDAY_CAST.map(unverified)));
  try { await run(url); }
  finally { await unlink(url); await rmdir(directory); }
}

test("every current cast entry has its own portrait identity-check credit and safe metadata", () => {
  const ids = new Set(), paths = new Set();
  for (const record of DOOMSDAY_CAST) {
    assert.ok(record.tmdb.matchCredit.title && record.tmdb.matchCredit.character);
    assert.ok(Number.isInteger(record.tmdb.matchCredit.year));
    assert.ok(["movie", "tv"].includes(record.tmdb.matchCredit.mediaType));
    if (record.tmdb.personId === null) {
      assert.equal(record.tmdb.profilePath, null);
      assert.equal(record.tmdb.verifiedAt, null);
      assert.equal(getActorPortraitUrl(record, now), null);
    } else {
      assert.ok(Number.isSafeInteger(record.tmdb.personId) && record.tmdb.personId > 0);
      assert.ok(!ids.has(record.tmdb.personId)); ids.add(record.tmdb.personId);
      if (record.tmdb.profilePath) {
        assert.ok(isProfilePath(record.tmdb.profilePath));
        assert.ok(!paths.has(record.tmdb.profilePath)); paths.add(record.tmdb.profilePath);
      }
    }
  }
});

test("only verified, recent, official-CDN paths can produce portrait URLs", () => {
  const tmdb = verifiedPortrait(person(entry), entry, date);
  assert.equal(getActorPortraitUrl({ tmdb }, now), "https://image.tmdb.org/t/p/w185/test1.jpg");
  for (const path of ["https://example.com/photo.jpg", "//example.com/photo.jpg", "/../test.jpg", "/test.jpg?api_key=bad", "/test.svg"]) {
    assert.equal(getActorPortraitUrl({ tmdb: { ...tmdb, profilePath: path } }, now), null);
  }
  assert.equal(getActorPortraitUrl({ tmdb: { ...tmdb, verifiedAt: "2026-01-01" } }, now), null);
  assert.equal(getActorPortraitUrl({ tmdb: { ...tmdb, verifiedAt: "2027-01-01" } }, now), null);
});

test("matching name alone is insufficient: exact prior title, year and role must agree", () => {
  for (const record of DOOMSDAY_CAST) assert.ok(verifiedPortrait(person(record), record, date));
  assert.equal(verifiedPortrait({ ...person(entry), name: "Someone Else" }, entry, date), null);
  for (const mismatch of [{ title: "Other film" }, { release_date: "2025-01-01" }, { character: "Other role" }]) {
    const candidate = person(entry);
    Object.assign(candidate.combined_credits.cast[0], mismatch);
    assert.equal(verifiedPortrait(candidate, entry, date), null);
  }
  const missingImage = { ...person(entry), profile_path: null };
  assert.equal(verifiedPortrait(missingImage, entry, date).profilePath, null);
});

test("resolver checks beyond the first result and rejects two equally verified identities", async () => {
  const api = async (path) => path === "search/person" ? { total_pages: 1, results: [{ id: 2 }, { id: 1 }] }
    : path === "person/2" ? { ...person(entry, 2), combined_credits: { cast: [] } } : person(entry);
  assert.equal((await resolveEntry(entry, api, date)).personId, 1);
  const ambiguous = async (path) => path === "search/person" ? { total_pages: 1, results: [{ id: 1 }, { id: 2 }] }
    : person(entry, Number(path.split("/")[1]));
  assert.equal(await resolveEntry(entry, ambiguous, date), null);
});

test("missing credentials is an offline no-op and licensing remains explicit", async () => withRoster(async (rosterUrl) => {
  const before = await readFile(rosterUrl, "utf8");
  const result = await refreshPortraits({ rosterUrl, log: () => {}, api: () => assert.fail("No API request expected") });
  assert.equal(result.updated, false);
  assert.equal(await readFile(rosterUrl, "utf8"), before);
  await assert.rejects(refreshPortraits({ rosterUrl, token: "test-only", licenseReviewed: false }), /license eligibility/);
}));

test("complete development-time refresh verifies every entry without changing official cast evidence", async () => withRoster(async (rosterUrl) => {
  const api = async (path, params) => {
    if (path === "configuration") return { images: { secure_base_url: "https://image.tmdb.org/t/p/", profile_sizes: ["w185"] } };
    if (path === "search/person") return { total_pages: 1, results: [{ id: DOOMSDAY_CAST.findIndex((record) => record.actorName === params.query) + 1 }] };
    const index = Number(path.split("/")[1]);
    return person(DOOMSDAY_CAST[index - 1], index);
  };
  const result = await refreshPortraits({ rosterUrl, token: "test-only", licenseReviewed: true, api, verifiedAt: date, log: () => {} });
  assert.equal(result.verified, DOOMSDAY_CAST.length);
  const next = JSON.parse(await readFile(rosterUrl, "utf8"));
  next.forEach((record, index) => {
    assert.ok(record.tmdb.personId && record.tmdb.profilePath && record.tmdb.creditId);
    const { tmdb: beforeTmdb, ...before } = DOOMSDAY_CAST[index];
    const { tmdb: afterTmdb, ...after } = record;
    assert.deepEqual(after, before);
  });
  await refreshPortraits({ rosterUrl, clear: true, log: () => {} });
  assert.ok(JSON.parse(await readFile(rosterUrl, "utf8")).every((record) => record.tmdb.personId === null));
}));

test("network/auth failures cannot leak token or mutate the roster", async () => withRoster(async (rosterUrl) => {
  const token = "SECRET-SENTINEL-TEST-ONLY";
  const client = createClient(token, async (url, options) => {
    assert.ok(!String(url).includes(token));
    assert.equal(options.headers.Authorization, `Bearer ${token}`);
    throw new Error(`upstream error accidentally included ${token}`);
  });
  const before = await readFile(rosterUrl, "utf8");
  await assert.rejects(refreshPortraits({ rosterUrl, token, licenseReviewed: true, api: client }), (error) => {
    assert.ok(!error.message.includes(token)); return true;
  });
  assert.equal(await readFile(rosterUrl, "utf8"), before);
}));
