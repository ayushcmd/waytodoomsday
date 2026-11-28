import castEntries from "./doomsdayCast.json" with { type: "json" };
import evidenceEntries from "./doomsdayCandidates.json" with { type: "json" };

// Editorial display categories, never automatic claims of team membership.
// Update procedure and research caveats: docs/doomsday-cast.md.
export const CAST_GROUPS = {
  antagonist: "Central antagonist",
  avengers: "Avengers & allies",
  fantastic: "Fantastic Four",
  mutants: "X-Men & mutant legacy",
  newAvengers: "New Avengers / Thunderbolts",
  wakanda: "Wakanda & Talokan",
  others: "Other characters",
};

export const CAST_SOURCES = {
  guide: "https://www.disneyplus.com/explore/articles/avengers-doomsday-cast-characters",
  update: "https://www.disneyplus.com/explore/articles/avengers-doomsday",
  announcement: "https://thewaltdisneycompany.com/news/marvel-studios-avengers-doomsday-cast/",
  press: "https://press.disney.co.uk/news/marvel-studios-avengers-doomsday-debuts-new-trailer-and-poster",
  film: "https://movies.disney.com/avengers-doomsday",
};

/**
 * Each record represents this film's character + actor portrayal, not a generic
 * comics identity. Continuity and profile links are deliberately omitted where
 * these sources do not establish the precise Doomsday variant. Only add local
 * imagePath assets with documented permission; TMDB metadata is resolved securely
 * by scripts/refresh-doomsday-portraits.mjs. Missing/unverified portraits use initials.
 * @typedef {Object} DoomsdayCastEntry
 * @property {string} id
 * @property {string} characterName
 * @property {string} actorName
 * @property {string[]} aliases
 * @property {keyof typeof CAST_GROUPS} displayGroup
 * @property {"officially-confirmed"} status
 * @property {string} sourceUrl
 * @property {string} verifiedAt
 * @property {boolean} featured
 * @property {number} sortOrder
 * @property {string} [imagePath]
 * @property {string} [continuity]
 * @property {Object} tmdb Development-verified portrait identity and image metadata.
 */

// Single editable roster: portraits and their identity-check anchors live beside each portrayal.
export const DOOMSDAY_CAST = castEntries;

// Actor confirmation alone is not enough to publish a character identity.
export const UNDISCLOSED_CAST = evidenceEntries.filter((entry) =>
  entry.researchStatus === "studio-cast-actor-identity-not-disclosed").map((entry) => ({
  ...entry,
  status: "role-not-officially-disclosed",
}));

export const VERIFIED_CAST = DOOMSDAY_CAST
  .filter((entry) => entry.status === "officially-confirmed")
  .sort((a, b) => a.sortOrder - b.sortOrder);
export const FEATURED_CAST = VERIFIED_CAST.filter((entry) => entry.featured);
// The oldest entry's verification date is the safe date for the whole roster.
export const CAST_VERIFIED_AT = VERIFIED_CAST.map((entry) => entry.verifiedAt).sort()[0];

const normalize = (value) => value.normalize("NFD").replace(/\p{M}/gu, "")
  .toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();

export function filterCast(query = "", group = "all") {
  return filterCastEntries(VERIFIED_CAST, query, group);
}

export function filterCastEntries(entries, query = "", group = "all") {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  return entries.filter((entry) => {
    if (group !== "all" && entry.displayGroup !== group) return false;
    const text = normalize([entry.characterName ?? "", entry.actorName, ...(entry.aliases ?? [])].join(" "));
    return words.every((word) => text.includes(word));
  });
}
