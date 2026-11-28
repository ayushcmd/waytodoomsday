import test from "node:test";
import assert from "node:assert/strict";
import research from "../docs/research/doomsday-cast-2026-11-28.json" with { type: "json" };
import candidates from "../src/data/doomsdayCandidates.json" with { type: "json" };
import { VERIFIED_CAST, FEATURED_CAST, UNDISCLOSED_CAST } from "../src/data/doomsdayCast.js";
import { getActorPortraitUrl } from "../src/data/tmdb.js";
import {
  DEFAULT_EVIDENCE_SECTION, EVIDENCE_ROSTER, EVIDENCE_COUNTS, EVIDENCE_SECTIONS,
  RESEARCH_DATE, partitionEvidence, filterEvidence, evidenceDetails, nextEvidenceTab,
  promoteEvidenceRecord, isOfficialEvidence,
} from "../src/data/doomsdayEvidence.js";

test("published tiers match the supplied snapshot, with confirmed as the safe default", () => {
  assert.equal(RESEARCH_DATE, research.researchDate);
  assert.equal(DEFAULT_EVIDENCE_SECTION, "confirmed");
  assert.deepEqual(EVIDENCE_COUNTS, { confirmed: 32, preview: 4, reported: 1, speculation: 8, undisclosed: 2 });
  assert.equal(VERIFIED_CAST.length, research.countSummary.studioConfirmedNamedTotalAfterAddition);
  assert.ok(FEATURED_CAST.every((entry) => entry.status === "officially-confirmed"));
  assert.equal(VERIFIED_CAST.filter((entry) => entry.actorName === "Hailee Steinfeld").length, 1);
  for (const baseline of research.existingConfirmedAudit.entries) {
    const entry = VERIFIED_CAST.find((item) => item.actorName === baseline.actorName && item.characterName === baseline.characterName);
    assert.ok(entry);
    assert.equal(entry.displayGroup, baseline.displayGroup);
    assert.equal(entry.sourceUrl, baseline.sourceUrl);
    assert.ok(entry.tmdb.personId && entry.tmdb.profilePath && entry.tmdb.verifiedAt && entry.tmdb.creditId);
  }
  assert.equal(filterEvidence("confirmed", "Mark Ruffalo").length, 0);
  assert.equal(filterEvidence("preview", "Mark Ruffalo").length, 1);
  assert.equal(filterEvidence("confirmed", "Elizabeth Olsen").length, 0);
  assert.equal(filterEvidence("speculation", "Elizabeth Olsen")[0].researchStatus, "official-story-tease");
  assert.equal(filterEvidence("reported", "Benedict")[0].researchStatus, "actor-claim-disputed");
});

test("every supplied published record retains its exact evidence, status and dates", () => {
  const originals = [...research.newOfficiallyConfirmedCharacterAdditions,
    ...research.officialPreviewIdentificationsNotInPublishedCastGuide,
    ...research.candidateCharacterEntriesDoNotLabelConfirmed,
    ...research.officiallyListedActorsWithoutCharacterIdentifications,
    ...research.reputableTradeReportsWithoutCharacterIdentifications];
  const published = Object.values(EVIDENCE_ROSTER).flat();
  for (const original of originals) {
    const entry = published.find((item) => item.actorName === original.actorName && item.characterName === original.characterName);
    assert.ok(entry, original.actorName);
    for (const key of ["characterName", "researchStatus", "evidenceSummary", "sourceUrl", "verifiedAt", "sourcePublishedAt", "additionalSources"]) {
      assert.deepEqual(entry[key], original[key], `${original.actorName}: ${key}`);
    }
    assert.equal(new URL(entry.sourceUrl).protocol, "https:");
    assert.match(entry.verifiedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(entry.publicSummary && entry.sourcePublisher);
    if (entry.section === "preview" || entry.section === "confirmed") assert.ok(isOfficialEvidence(entry));
    if (entry.section !== "confirmed") assert.notEqual(evidenceDetails(entry).sourceLabel, "Official confirmation");
  }
  for (const excluded of research.excludedResearchOnly) {
    if (excluded.actorName) assert.ok(!published.some((item) => item.actorName === excluded.actorName));
    if (excluded.characterName) assert.ok(!published.some((item) => item.characterName === excluded.characterName));
  }
});

test("actor-only records stay unnamed and separate from every character count", () => {
  assert.deepEqual(EVIDENCE_ROSTER.undisclosed.map((entry) => entry.actorName), ["Alex Livinalli", "Sandra Hüller"]);
  assert.equal(UNDISCLOSED_CAST[0].actorName, "Alex Livinalli");
  for (const actor of EVIDENCE_ROSTER.undisclosed) {
    assert.equal(actor.characterName, null);
    assert.equal(actor.kind, "actor");
    for (const key of ["confirmed", "preview", "reported", "speculation"]) {
      assert.ok(!EVIDENCE_ROSTER[key].some((entry) => entry.actorName === actor.actorName));
    }
  }
  assert.equal(EVIDENCE_ROSTER.undisclosed[0].researchStatus, "studio-cast-actor-identity-not-disclosed");
  assert.equal(EVIDENCE_ROSTER.undisclosed[1].researchStatus, "industry-reported-actor-unknown-role");
});

test("search and category filters remain scoped to each evidence tier", () => {
  assert.equal(filterEvidence("speculation", "  ANDREW   GARFIELD  ", "others").length, 1);
  assert.equal(filterEvidence("speculation", "Andrew", "fantastic").length, 0);
  assert.equal(filterEvidence("confirmed", "Captain America").length, 2);
  assert.equal(filterEvidence("undisclosed", "Huller")[0].actorName, "Sandra Hüller");
  assert.equal(filterEvidence("reported", "Spider-Man").length, 0);
  assert.equal(filterEvidence("preview", "Ouroboros")[0].actorName, "Ke Huy Quan");
  assert.equal(filterEvidence("speculation", "Nobody with this name").length, 0);
  assert.equal(filterEvidence("speculation", "").length, EVIDENCE_COUNTS.speculation);
  assert.equal(getActorPortraitUrl({ tmdb: null }), null);
});

test("duplicate IDs, duplicate portrayals and accidental tier upgrades are rejected", () => {
  assert.throws(() => partitionEvidence(VERIFIED_CAST, [...candidates, candidates[0]]), /Duplicate/);
  assert.throws(() => partitionEvidence(VERIFIED_CAST, [...candidates, { ...candidates[0], id: "different-id" }]), /Duplicate/);
  const wrongTier = { ...candidates[0], status: "officially-confirmed" };
  assert.throws(() => partitionEvidence([...VERIFIED_CAST, wrongTier], candidates.slice(1)), /Conflicting/);
  assert.throws(() => partitionEvidence(VERIFIED_CAST, [{ ...candidates[0], section: "speculation" }]), /Invalid evidence tier/);
  assert.throws(() => partitionEvidence(VERIFIED_CAST, [{ ...EVIDENCE_ROSTER.undisclosed[0], characterName: "Attuma" }]), /separation/);
});

test("promotion needs reviewed primary evidence, preserves portraits and removes the old record", () => {
  const original = EVIDENCE_ROSTER.reported[0];
  const evidence = { researchStatus: "studio-character-confirmed", sourceUrl: "https://www.marvel.com/articles/movies/reviewed-future-announcement",
    sourcePublishedAt: "2026-11-28", verifiedAt: "2026-11-28", evidenceSummary: "Test fixture: a reviewed official actor/character announcement." };
  const result = promoteEvidenceRecord(VERIFIED_CAST, candidates, original.id, evidence);
  assert.equal(result.confirmed.length, VERIFIED_CAST.length + 1);
  assert.equal(result.candidates.length, candidates.length - 1);
  assert.equal(result.confirmed.at(-1).id, original.id);
  assert.deepEqual(result.confirmed.at(-1).tmdb, original.tmdb);
  assert.equal(result.confirmed.at(-1).publicSummary, evidence.evidenceSummary);
  assert.equal(partitionEvidence(result.confirmed, result.candidates).reported.length, 0);
  assert.equal(original.researchStatus, "actor-claim-disputed");
  assert.throws(() => promoteEvidenceRecord(VERIFIED_CAST, candidates, original.id,
    { ...evidence, researchStatus: "studio-preview-identification" }), /official/);
  assert.throws(() => promoteEvidenceRecord(VERIFIED_CAST, candidates, original.id,
    { ...evidence, sourceUrl: original.sourceUrl }), /official/);
  assert.throws(() => promoteEvidenceRecord(VERIFIED_CAST, candidates, EVIDENCE_ROSTER.undisclosed[0].id, evidence), /character identity/);
  assert.throws(() => promoteEvidenceRecord(result.confirmed, result.candidates, original.id, evidence), /official/);
});

test("tab keyboard navigation wraps and supports Home/End without changing counts", () => {
  const last = EVIDENCE_SECTIONS.length - 1;
  assert.equal(nextEvidenceTab(0, "ArrowLeft"), last);
  assert.equal(nextEvidenceTab(last, "ArrowRight"), 0);
  assert.equal(nextEvidenceTab(2, "Home"), 0);
  assert.equal(nextEvidenceTab(2, "End"), last);
  assert.equal(nextEvidenceTab(2, "Tab"), 2);
});
