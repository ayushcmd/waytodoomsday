// Development-only. No part of this module is imported by browser code.
import { readFile, writeFile, rename, unlink } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { resolve } from "node:path";
import {
  TMDB_IMAGE_BASE,
  TMDB_PROFILE_SIZE,
  TMDB_PROFILE_LARGE_SIZE,
} from "../src/data/tmdb.js";
import {
  createClient,
  resolveEntry,
  verifiedPortrait,
  matchesActor,
  matchingCredit,
} from "./refresh-doomsday-portraits.mjs";

const dataUrl = new URL("../src/data/encyclopedia/portraits.json", import.meta.url);

export { createClient, resolveEntry, verifiedPortrait, matchesActor, matchingCredit };

export async function refreshEncyclopediaPortraits({
  token,
  licenseReviewed,
  clear = false,
  api,
  verifiedAt,
  portraitsUrl = dataUrl,
  log = console.log,
} = {}) {
  const entries = JSON.parse(await readFile(portraitsUrl, "utf8"));

  if (!clear && !token) {
    log("TMDB_API_READ_ACCESS_TOKEN is not set. Kept existing encyclopedia portraits/initials; build remains offline-compatible.");
    return { updated: false, verified: 0 };
  }

  if (!clear && !licenseReviewed) {
    throw new Error(
      "Confirm this site's TMDB license eligibility, then set TMDB_LICENSE_REVIEWED=1. See docs/tmdb-portraits.md."
    );
  }

  const client = api ?? createClient(token);
  const date = verifiedAt ?? new Date().toISOString().slice(0, 10);

  if (!clear) {
    const config = await client("configuration");
    const sizes = config.images?.profile_sizes ?? [];
    if (
      config.images?.secure_base_url !== TMDB_IMAGE_BASE ||
      !sizes.includes(TMDB_PROFILE_SIZE) ||
      !sizes.includes(TMDB_PROFILE_LARGE_SIZE)
    ) {
      throw new Error("TMDB image configuration changed; review CDN settings before updating encyclopedia portraits.");
    }
  }

  const next = [];
  const usedPeople = new Set();
  const unresolved = [];

  for (const entry of entries) {
    if (!entry.tmdb?.matchCredit) {
      throw new Error(`Missing identity-check credit for ${entry.actorName}.`);
    }

    const portrait = clear
      ? { ...entry.tmdb, personId: null, profilePath: null, verifiedAt: null, creditId: null }
      : await resolveEntry(entry, client, date);

    if (!portrait) {
      unresolved.push(entry.actorName);
      continue;
    }

    if (!clear && usedPeople.has(portrait.personId)) {
      throw new Error(`Duplicate TMDB person resolved for distinct actor ${entry.actorName}; no metadata was written.`);
    }

    usedPeople.add(portrait.personId);
    next.push({ ...entry, tmdb: portrait });
  }

  if (unresolved.length) {
    throw new Error(
      `Identity checks need review for: ${unresolved.join(", ")}. No metadata was written.`
    );
  }

  const temporaryUrl = new URL(`${portraitsUrl.href}.tmp`);
  try {
    await writeFile(temporaryUrl, `${JSON.stringify(next, null, 2)}\n`, { flag: "wx" });
    await rename(temporaryUrl, portraitsUrl);
  } catch (error) {
    await unlink(temporaryUrl).catch(() => {});
    throw new Error("Unable to replace encyclopedia portrait metadata safely. Check file access and retry.", {
      cause: error,
    });
  }

  const withImages = next.filter((entry) => entry.tmdb.profilePath).length;
  log(
    clear
      ? "Cleared encyclopedia TMDB metadata; all cards use existing fallbacks."
      : `Verified ${next.length} actor identities; ${withImages} portraits available.`
  );
  return { updated: true, verified: clear ? 0 : next.length, withImages };
}

function tryLoadEnv() {
  const candidates = [
    new URL("../.env", import.meta.url),
    new URL("../../../.env", import.meta.url),
  ];
  for (const envUrl of candidates) {
    try {
      process.loadEnvFile(fileURLToPath(envUrl));
      return;
    } catch (error) {
      if (error.code !== "ENOENT") {
        console.error("Unable to load local .env safely.");
        process.exit(1);
      }
    }
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  tryLoadEnv();
  try {
    await refreshEncyclopediaPortraits({
      token: process.env.TMDB_API_READ_ACCESS_TOKEN,
      licenseReviewed: process.env.TMDB_LICENSE_REVIEWED === "1",
      clear: process.argv.includes("--clear"),
    });
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
