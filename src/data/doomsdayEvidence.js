import entries from "./doomsdayCandidates.json" with { type: "json" };
import { VERIFIED_CAST, CAST_SOURCES, filterCastEntries } from "./doomsdayCast.js";

export const RESEARCH_DATE = "2026-11-28";
export const DEFAULT_EVIDENCE_SECTION = "confirmed";
export const EVIDENCE_SECTIONS = [
  { key: "confirmed", label: "Confirmed", unit: "confirmed characters",
    note: "Named characters announced by Marvel / Disney. The guide contains 31; Kate Bishop was announced separately." },
  { key: "preview", label: "Official preview", unit: "preview characters",
    note: "Identified in official Doomsday preview footage, separately from the cast guide. Preview footage does not guarantee the final theatrical cut." },
  { key: "reported", label: "Reported", unit: "unresolved named candidates",
    note: "Dated reporting or actor statements with studio confirmation outstanding. Contradictory remarks remain unresolved." },
  { key: "speculation", label: "Speculation", unit: "speculative candidates",
    note: "Fan-interest possibilities, not established casting facts. Story teases, denials, writing credits and retracted rumors retain their caveats." },
  { key: "undisclosed", label: "Roles undisclosed", unit: "actors with undisclosed roles",
    note: "Actor-only records: one official cast listing and one trade report. Neither establishes a named character; these actors are excluded from character counts." },
];

export const EVIDENCE_LABELS = {
  "studio-character-confirmed": { label: "Officially confirmed", tone: "confirmed" },
  "studio-preview-identification": { label: "Official preview only", tone: "preview" },
  "studio-cast-actor-identity-not-disclosed": { label: "Official actor listing · role undisclosed", tone: "preview" },
  "industry-reported-actor-unknown-role": { label: "Reported actor · role undisclosed", tone: "reported" },
  "actor-claim-disputed": { label: "Actor claim disputed", tone: "reported" },
  "official-story-tease": { label: "Story tease · film role unconfirmed", tone: "speculation" },
  "insider-rumor-unverified": { label: "Unverified insider rumor", tone: "speculation" },
  "unverified-fan-speculation": { label: "Unverified fan speculation", tone: "speculation" },
  "actor-denied": { label: "Actor denied appearing", tone: "speculation" },
  "nonacting-credit-only": { label: "Non-acting credit only", tone: "speculation" },
  "fan-theory": { label: "Fan theory", tone: "speculation" },
  "rumor-retracted": { label: "Rumor retracted", tone: "speculation" },
};

const sectionForStatus = {
  "studio-preview-identification": "preview",
  "studio-cast-actor-identity-not-disclosed": "undisclosed",
  "industry-reported-actor-unknown-role": "undisclosed",
  "actor-claim-disputed": "reported",
  "official-story-tease": "speculation",
  "insider-rumor-unverified": "speculation",
  "unverified-fan-speculation": "speculation",
  "actor-denied": "speculation",
  "nonacting-credit-only": "speculation",
  "fan-theory": "speculation",
  "rumor-retracted": "speculation",
};

const normalize = (value) => value.normalize("NFD").replace(/\p{M}/gu, "")
  .toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
const portrayalKey = (entry) => `${normalize(entry.actorName)}|${normalize(entry.characterName ?? "role-undisclosed")}`;

export function partitionEvidence(confirmed = VERIFIED_CAST, candidates = entries) {
  const sections = Object.fromEntries(EVIDENCE_SECTIONS.map(({ key }) => [key, []]));
  const ids = new Set(), portrayals = new Set();
  for (const entry of [...confirmed, ...candidates]) {
    const key = portrayalKey(entry);
    if (ids.has(entry.id) || portrayals.has(key)) throw new Error(`Duplicate evidence record: ${entry.id}`);
    ids.add(entry.id); portrayals.add(key);
    if (entry.status === "officially-confirmed" && entry.researchStatus
      && entry.researchStatus !== "studio-character-confirmed") throw new Error(`Conflicting confirmation tier: ${entry.id}`);
    const section = entry.status === "officially-confirmed" ? "confirmed" : sectionForStatus[entry.researchStatus];
    if (!section || (entry.section && entry.section !== section)) throw new Error(`Invalid evidence tier: ${entry.id}`);
    if (section === "undisclosed" ? entry.characterName !== null || entry.kind !== "actor"
      : !entry.characterName || entry.kind === "actor") throw new Error(`Invalid character/actor separation: ${entry.id}`);
    sections[section].push(entry);
  }
  return sections;
}

export const EVIDENCE_ROSTER = partitionEvidence();
export const EVIDENCE_COUNTS = Object.fromEntries(EVIDENCE_SECTIONS.map(({ key }) => [key, EVIDENCE_ROSTER[key].length]));
export function filterEvidence(section = DEFAULT_EVIDENCE_SECTION, query = "", group = "all") {
  return filterCastEntries(EVIDENCE_ROSTER[section] ?? [], query, group);
}

export function nextEvidenceTab(index, key) {
  if (key === "Home") return 0;
  if (key === "End") return EVIDENCE_SECTIONS.length - 1;
  if (key === "ArrowRight") return (index + 1) % EVIDENCE_SECTIONS.length;
  if (key === "ArrowLeft") return (index + EVIDENCE_SECTIONS.length - 1) % EVIDENCE_SECTIONS.length;
  return index;
}

export function evidenceDetails(entry) {
  const status = entry.researchStatus ?? "studio-character-confirmed";
  const confirmed = entry.status === "officially-confirmed";
  return {
    ...EVIDENCE_LABELS[status],
    publisher: entry.sourcePublisher ?? "Disney+",
    sourceDate: entry.sourcePublishedAt ?? (entry.sourceUrl === CAST_SOURCES.guide ? "2026-11-25" : null),
    sourceDateLabel: entry.sourcePublishedAt ? "Published" : "Guide revised",
    summary: entry.publicSummary ?? "Disney+ lists this character and performer in its official cast guide.",
    sourceLabel: confirmed ? "Official confirmation" : status === "studio-preview-identification"
      ? "Official preview evidence" : entry.section === "reported" || status === "industry-reported-actor-unknown-role"
        ? "Read report" : status === "studio-cast-actor-identity-not-disclosed" ? "Official actor listing" : "Read context",
  };
}

export function isOfficialEvidence(entry) {
  let url;
  try { url = new URL(entry.sourceUrl); } catch { return false; }
  if (url.protocol !== "https:") return false;
  if (["www.marvel.com", "www.disneyplus.com", "thewaltdisneycompany.com", "movies.disney.com",
    "press.disney.co.uk", "d23.com"].includes(url.hostname)) return true;
  return (url.href === "https://www.instagram.com/reels/DgEIM1quijm/" && entry.actorName === "Hailee Steinfeld")
    || url.href === "https://lumiere-a.akamaihd.net/v1/documents/avengers_doomsday_uk_project_profile_updated_4b024a7e.pdf";
}

// Explicit editorial operation after reviewing a NEW primary source; never automatic.
// The caller persists both arrays in the same reviewed change, retaining the stable ID.
export function promoteEvidenceRecord(confirmed, candidates, id, officialEvidence) {
  const candidate = candidates.find((entry) => entry.id === id);
  if (!candidate || officialEvidence.researchStatus !== "studio-character-confirmed"
    || !officialEvidence.evidenceSummary || !officialEvidence.verifiedAt
    || !isOfficialEvidence({ ...candidate, ...officialEvidence })) throw new Error("Reviewed official actor/character evidence is required.");
  const entry = { ...candidate, ...officialEvidence, status: "officially-confirmed", kind: "character",
    publicSummary: officialEvidence.publicSummary ?? officialEvidence.evidenceSummary,
    section: "confirmed", featured: false, sortOrder: Math.max(0, ...confirmed.map((item) => item.sortOrder)) + 1 };
  if (!entry.characterName) throw new Error("An official character identity is required; an actor name alone is insufficient.");
  const result = { confirmed: [...confirmed, entry], candidates: candidates.filter((item) => item.id !== id) };
  partitionEvidence(result.confirmed, result.candidates);
  return result;
}
