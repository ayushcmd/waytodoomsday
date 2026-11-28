// Development-only. No part of this module is imported by browser code.
import { readFile, writeFile, rename, unlink } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { TMDB_IMAGE_BASE, TMDB_PROFILE_SIZE, isProfilePath } from "../src/data/tmdb.js";

const dataUrl = new URL("../src/data/doomsdayCast.json", import.meta.url);
const apiBase = "https://api.themoviedb.org/3/";
const normalize = (value) => String(value ?? "").normalize("NFD").replace(/\p{M}/gu, "")
  .toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");

export function matchesActor(person, entry) {
  const expected = [entry.actorName, ...(entry.tmdb.nameAliases ?? [])].map(normalize);
  return [person.name, ...(person.also_known_as ?? [])].some((name) => expected.includes(normalize(name)));
}

export function matchingCredit(credits, expected) {
  return credits.find((credit) => credit.media_type === expected.mediaType
    && normalize(credit.title ?? credit.name) === normalize(expected.title)
    && (credit.release_date ?? credit.first_air_date ?? "").slice(0, 4) === String(expected.year)
    && normalize(credit.character).includes(normalize(expected.character)));
}

export function verifiedPortrait(person, entry, verifiedAt) {
  if (!Number.isSafeInteger(person.id) || person.id <= 0 || !matchesActor(person, entry)) return null;
  const credit = matchingCredit(person.combined_credits?.cast ?? [], entry.tmdb.matchCredit);
  if (!credit || !Number.isSafeInteger(credit.id) || credit.id <= 0) return null;
  // No profile is a valid API outcome. Keep the verified person but use initials.
  if (person.profile_path !== null && !isProfilePath(person.profile_path)) return null;
  return { ...entry.tmdb, personId: person.id, profilePath: person.profile_path,
    verifiedAt, creditId: credit.id };
}

export function createClient(token, fetchImpl = fetch) {
  return async (path, params = {}) => {
    const url = new URL(path, apiBase);
    for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
    let response;
    try {
      response = await fetchImpl(url, { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        signal: AbortSignal.timeout(15000), redirect: "error" });
    } catch {
      throw new Error("TMDB request failed (network or timeout); no metadata was written.");
    }
    // Never log request options, raw error objects, response bodies or credentials.
    if (!response.ok) throw new Error(`TMDB returned HTTP ${response.status}; no metadata was written.`);
    try { return await response.json(); }
    catch { throw new Error("TMDB returned invalid JSON; no metadata was written."); }
  };
}

export async function resolveEntry(entry, api, verifiedAt) {
  if (entry.tmdb.personId) {
    if (!Number.isSafeInteger(entry.tmdb.personId) || entry.tmdb.personId <= 0) return null;
    const person = await api(`person/${entry.tmdb.personId}`, { append_to_response: "combined_credits" });
    return verifiedPortrait(person, entry, verifiedAt);
  }
  const first = await api("search/person", { query: entry.actorName, include_adult: "false", page: "1" });
  // Review the complete search result set. Broad/ambiguous queries need an editor.
  if (!Number.isInteger(first.total_pages) || first.total_pages > 5) return null;
  const candidates = [...(first.results ?? [])];
  for (let page = 2; page <= first.total_pages; page++) {
    const result = await api("search/person", { query: entry.actorName, include_adult: "false", page: String(page) });
    candidates.push(...(result.results ?? []));
  }
  const matches = new Map();
  for (const candidate of candidates) {
    if (!Number.isSafeInteger(candidate.id) || candidate.id <= 0) continue;
    // Even exact search names must be checked against details AND a film/TV role.
    const person = await api(`person/${candidate.id}`, { append_to_response: "combined_credits" });
    const verified = verifiedPortrait(person, entry, verifiedAt);
    if (verified) matches.set(person.id, verified);
  }
  return matches.size === 1 ? [...matches.values()][0] : null;
}

export async function refreshPortraits({ token, licenseReviewed, clear = false, api, verifiedAt,
  rosterUrl = dataUrl, log = console.log } = {}) {
  const entries = JSON.parse(await readFile(rosterUrl, "utf8"));
  if (!clear && !token) {
    log("TMDB_API_READ_ACCESS_TOKEN is not set. Kept existing portraits/initials; build remains offline-compatible.");
    return { updated: false, verified: 0 };
  }
  if (!clear && !licenseReviewed) throw new Error(
    "Confirm this site's TMDB license eligibility, then set TMDB_LICENSE_REVIEWED=1. See docs/tmdb-portraits.md.");
  const client = api ?? createClient(token);
  const date = verifiedAt ?? new Date().toISOString().slice(0, 10);
  if (!clear) {
    const config = await client("configuration");
    if (config.images?.secure_base_url !== TMDB_IMAGE_BASE
      || !config.images?.profile_sizes?.includes(TMDB_PROFILE_SIZE)) {
      throw new Error("TMDB image configuration changed; review CDN settings before updating portraits.");
    }
  }
  const next = [];
  const usedPeople = new Set();
  const usedPaths = new Set();
  const unresolved = [];
  for (const entry of entries) {
    if (!entry.tmdb?.matchCredit) throw new Error(`Missing identity-check credit for ${entry.actorName}.`);
    const portrait = clear ? { ...entry.tmdb, personId: null, profilePath: null, verifiedAt: null, creditId: null }
      : await resolveEntry(entry, client, date);
    if (!portrait) { unresolved.push(entry.actorName); continue; }
    if (!clear && (usedPeople.has(portrait.personId)
      || (portrait.profilePath && usedPaths.has(portrait.profilePath)))) {
      throw new Error(`Duplicate actor/profile resolved for ${entry.actorName}; no metadata was written.`);
    }
    usedPeople.add(portrait.personId);
    if (portrait.profilePath) usedPaths.add(portrait.profilePath);
    next.push({ ...entry, tmdb: portrait });
  }
  // Fail atomically rather than silently shipping first-result guesses or half a roster.
  if (unresolved.length) throw new Error(`Identity checks need review for: ${unresolved.join(", ")}. No metadata was written.`);
  const temporaryUrl = new URL(`${rosterUrl.href}.tmp`);
  try {
    await writeFile(temporaryUrl, `${JSON.stringify(next, null, 2)}\n`, { flag: "wx" });
    await rename(temporaryUrl, rosterUrl);
  } catch (error) {
    await unlink(temporaryUrl).catch(() => {});
    // This path is filesystem-only; do not print arbitrary exception details.
    throw new Error("Unable to replace portrait metadata safely. Check file access and retry.", { cause: error });
  }
  log(clear ? "Cleared TMDB metadata; all cards use existing fallbacks."
    : `Verified ${next.length} actor identities; ${next.filter((entry) => entry.tmdb.profilePath).length} portraits available.`);
  return { updated: true, verified: clear ? 0 : next.length };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  // Node >=22.12 (already required by this project) supports loading local .env.
  // Never copy .env into src/, public/, build output, Git or command arguments.
  try { process.loadEnvFile(fileURLToPath(new URL("../.env", import.meta.url))); }
  catch (error) { if (error.code !== "ENOENT") { console.error("Unable to load local .env safely."); process.exit(1); } }
  try {
    await refreshPortraits({ token: process.env.TMDB_API_READ_ACCESS_TOKEN,
      licenseReviewed: process.env.TMDB_LICENSE_REVIEWED === "1", clear: process.argv.includes("--clear") });
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
