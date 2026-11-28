// Editorial display categories, never automatic claims of team membership.
// Update procedure and research caveats: docs/doomsday-cast.md.
export const CAST_GROUPS = {
  antagonist: "Central antagonist",
  avengers: "Avengers & allies",
  fantastic: "Fantastic Four",
  mutants: "X-Men & mutant legacy",
  newAvengers: "New Avengers / Thunderbolts",
  wakanda: "Wakanda & Talokan",
  others: "Other returning characters",
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
 * imagePath assets with documented permission; otherwise the UI uses initials.
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
 */

// All mappings individually checked in the November 25 Disney+ guide on Nov 28.
// These defaults are materialized in every entry, so exports remain reusable.
const confirmed = (entry) => ({
  status: "officially-confirmed",
  sourceUrl: CAST_SOURCES.guide,
  verifiedAt: "2026-11-28",
  aliases: [],
  featured: false,
  ...entry,
});

/** @type {DoomsdayCastEntry[]} */
export const DOOMSDAY_CAST = [
  confirmed({
    id: "doomsday-victor-von-doom-downey", characterName: "Doctor Doom",
    actorName: "Robert Downey Jr.", aliases: ["Victor Von Doom"],
    displayGroup: "antagonist", featured: true, sortOrder: 1,
  }),
  confirmed({
    id: "doomsday-steve-rogers-evans", characterName: "Steve Rogers",
    actorName: "Chris Evans", aliases: ["Captain America"],
    displayGroup: "avengers", featured: true, sortOrder: 2,
  }),
  confirmed({
    id: "doomsday-thor-hemsworth", characterName: "Thor",
    actorName: "Chris Hemsworth", displayGroup: "avengers", featured: true, sortOrder: 3,
  }),
  confirmed({
    id: "doomsday-sam-wilson-mackie", characterName: "Sam Wilson",
    actorName: "Anthony Mackie", aliases: ["Captain America"],
    displayGroup: "avengers", featured: true, sortOrder: 4,
  }),
  confirmed({
    id: "doomsday-scott-lang-rudd", characterName: "Scott Lang",
    actorName: "Paul Rudd", aliases: ["Ant-Man"], displayGroup: "avengers", sortOrder: 5,
  }),
  confirmed({
    id: "doomsday-shang-chi-liu", characterName: "Shang-Chi",
    actorName: "Simu Liu", displayGroup: "avengers", sortOrder: 6,
  }),
  confirmed({
    id: "doomsday-reed-richards-pascal", characterName: "Reed Richards",
    actorName: "Pedro Pascal", aliases: ["Mister Fantastic"],
    displayGroup: "fantastic", featured: true, sortOrder: 7,
  }),
  confirmed({
    id: "doomsday-sue-storm-kirby", characterName: "Sue Storm",
    actorName: "Vanessa Kirby", aliases: ["Invisible Woman"], displayGroup: "fantastic", sortOrder: 8,
  }),
  confirmed({
    id: "doomsday-johnny-storm-quinn", characterName: "Johnny Storm",
    actorName: "Joseph Quinn", aliases: ["Human Torch"], displayGroup: "fantastic", sortOrder: 9,
  }),
  confirmed({
    id: "doomsday-ben-grimm-moss-bachrach", characterName: "Ben Grimm",
    actorName: "Ebon Moss-Bachrach", aliases: ["The Thing"], displayGroup: "fantastic", sortOrder: 10,
  }),
  confirmed({
    id: "doomsday-charles-xavier-stewart", characterName: "Charles Xavier",
    actorName: "Patrick Stewart", aliases: ["Professor X"],
    displayGroup: "mutants", featured: true, sortOrder: 11,
  }),
  confirmed({
    id: "doomsday-erik-lehnsherr-mckellen", characterName: "Erik Lehnsherr",
    actorName: "Ian McKellen", aliases: ["Magneto"], displayGroup: "mutants", sortOrder: 12,
  }),
  confirmed({
    id: "doomsday-scott-summers-marsden", characterName: "Scott Summers",
    actorName: "James Marsden", aliases: ["Cyclops"], displayGroup: "mutants", sortOrder: 13,
  }),
  confirmed({
    id: "doomsday-hank-mccoy-grammer", characterName: "Hank McCoy",
    actorName: "Kelsey Grammer", aliases: ["Beast"], displayGroup: "mutants", sortOrder: 14,
  }),
  confirmed({
    id: "doomsday-kurt-wagner-cumming", characterName: "Kurt Wagner",
    actorName: "Alan Cumming", aliases: ["Nightcrawler"], displayGroup: "mutants", sortOrder: 15,
  }),
  confirmed({
    id: "doomsday-raven-darkholme-romijn", characterName: "Raven Darkholme",
    actorName: "Rebecca Romijn", aliases: ["Mystique"], displayGroup: "mutants", sortOrder: 16,
  }),
  confirmed({
    id: "doomsday-remy-lebeau-tatum", characterName: "Remy LeBeau",
    actorName: "Channing Tatum", aliases: ["Gambit"], displayGroup: "mutants", sortOrder: 17,
  }),
  confirmed({
    id: "doomsday-yelena-belova-pugh", characterName: "Yelena Belova",
    actorName: "Florence Pugh", displayGroup: "newAvengers", featured: true, sortOrder: 18,
  }),
  confirmed({
    id: "doomsday-bucky-barnes-stan", characterName: "Bucky Barnes",
    actorName: "Sebastian Stan", aliases: ["Winter Soldier"], displayGroup: "newAvengers", sortOrder: 19,
  }),
  confirmed({
    id: "doomsday-john-walker-russell", characterName: "John Walker",
    actorName: "Wyatt Russell", aliases: ["U.S. Agent"], displayGroup: "newAvengers", sortOrder: 20,
  }),
  confirmed({
    id: "doomsday-alexei-shostakov-harbour", characterName: "Alexei Shostakov",
    actorName: "David Harbour", aliases: ["Red Guardian"], displayGroup: "newAvengers", sortOrder: 21,
  }),
  confirmed({
    id: "doomsday-ava-starr-john-kamen", characterName: "Ava Starr",
    actorName: "Hannah John-Kamen", aliases: ["Ghost"], displayGroup: "newAvengers", sortOrder: 22,
  }),
  confirmed({
    id: "doomsday-bob-reynolds-pullman", characterName: "Bob Reynolds",
    actorName: "Lewis Pullman", aliases: ["Sentry"], displayGroup: "newAvengers", sortOrder: 23,
  }),
  confirmed({
    id: "doomsday-shuri-wright", characterName: "Shuri",
    actorName: "Letitia Wright", aliases: ["Black Panther"],
    displayGroup: "wakanda", featured: true, sortOrder: 24,
  }),
  confirmed({
    id: "doomsday-mbaku-duke", characterName: "M’Baku",
    actorName: "Winston Duke", displayGroup: "wakanda", sortOrder: 25,
  }),
  confirmed({
    id: "doomsday-namor-huerta-mejia", characterName: "Namor",
    actorName: "Tenoch Huerta Mejía", displayGroup: "wakanda", sortOrder: 26,
  }),
  confirmed({
    id: "doomsday-namora-cadena", characterName: "Namora",
    actorName: "Mabel Cadena", displayGroup: "wakanda", sortOrder: 27,
  }),
  confirmed({
    id: "doomsday-loki-hiddleston", characterName: "Loki",
    actorName: "Tom Hiddleston", displayGroup: "others", sortOrder: 28,
  }),
  confirmed({
    id: "doomsday-peggy-carter-atwell", characterName: "Peggy Carter",
    actorName: "Hayley Atwell", displayGroup: "others", sortOrder: 29,
  }),
  confirmed({
    id: "doomsday-joaquin-torres-ramirez", characterName: "Joaquin Torres",
    actorName: "Danny Ramirez", aliases: ["Falcon"], displayGroup: "others", sortOrder: 30,
  }),
  confirmed({
    id: "doomsday-cassie-lang-newton", characterName: "Cassie Lang",
    actorName: "Kathryn Newton", displayGroup: "others", sortOrder: 31,
  }),
];

// Actor confirmation alone is not enough to publish a character identity.
export const UNDISCLOSED_CAST = [{
  actorName: "Alex Livanalli",
  status: "role-not-officially-disclosed",
  sourceUrl: CAST_SOURCES.film,
  verifiedAt: "2026-11-28",
}];

export const VERIFIED_CAST = DOOMSDAY_CAST
  .filter((entry) => entry.status === "officially-confirmed")
  .sort((a, b) => a.sortOrder - b.sortOrder);
export const FEATURED_CAST = VERIFIED_CAST.filter((entry) => entry.featured);
// The oldest entry's verification date is the safe date for the whole roster.
export const CAST_VERIFIED_AT = VERIFIED_CAST.map((entry) => entry.verifiedAt).sort()[0];

const normalize = (value) => value.normalize("NFD").replace(/\p{M}/gu, "")
  .toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();

export function filterCast(query = "", group = "all") {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  return VERIFIED_CAST.filter((entry) => {
    if (group !== "all" && entry.displayGroup !== group) return false;
    const text = normalize([entry.characterName, entry.actorName, ...entry.aliases].join(" "));
    return words.every((word) => text.includes(word));
  });
}
