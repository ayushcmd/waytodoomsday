import universesData from "./universes.json" with { type: "json" };
import filmsData from "./films.json" with { type: "json" };
import identitiesData from "./identities.json" with { type: "json" };
import teamsData from "./teams.json" with { type: "json" };
import portrayalsData from "./portrayals.json" with { type: "json" };
import portraitsData from "./portraits.json" with { type: "json" };
import { getActorPortraitUrl, TMDB_PROFILE_SIZE } from "../tmdb.js";

export const UNIVERSES = universesData;
export const FILMS = filmsData;
export const IDENTITIES = identitiesData;
export const TEAMS = teamsData;
export const PORTRAYALS = portrayalsData.filter((p) => p.status === "published");
export const ACTOR_PORTRAITS = portraitsData;

const portraitByPortrayalSlug = new Map();
for (const entry of ACTOR_PORTRAITS) {
  for (const slug of entry.portrayalSlugs ?? []) {
    portraitByPortrayalSlug.set(slug, entry);
  }
}

export function getPortrayalPortraitEntry(portrayalOrSlug) {
  const slug = typeof portrayalOrSlug === "string" ? portrayalOrSlug : portrayalOrSlug?.slug;
  return slug ? portraitByPortrayalSlug.get(slug) || null : null;
}

export function getPortrayalPortraitUrl(portrayalOrSlug, size = TMDB_PROFILE_SIZE, now = new Date()) {
  const entry = getPortrayalPortraitEntry(portrayalOrSlug);
  return entry ? getActorPortraitUrl(entry, now, size) : null;
}

const universesById = new Map(UNIVERSES.map((u) => [u.id, u]));
const filmsById = new Map(FILMS.map((f) => [f.id, f]));
const identitiesById = new Map(IDENTITIES.map((i) => [i.id, i]));
const teamsById = new Map(TEAMS.map((t) => [t.id, t]));
const teamsBySlug = new Map(TEAMS.map((t) => [t.slug, t]));
const portrayalsBySlug = new Map(PORTRAYALS.map((p) => [p.slug, p]));
const portrayalsById = new Map(PORTRAYALS.map((p) => [p.id, p]));

export function getUniverseById(id) {
  return universesById.get(id) || null;
}

export function getFilmById(id) {
  return filmsById.get(id) || null;
}

export function getIdentityById(id) {
  return identitiesById.get(id) || null;
}

export function getTeamById(id) {
  return teamsById.get(id) || null;
}

export function getTeamBySlug(slug) {
  return teamsBySlug.get(slug) || teamsById.get(slug) || null;
}

export function getPortrayalBySlug(slug) {
  return portrayalsBySlug.get(slug) || null;
}

export function getPortrayalById(id) {
  return portrayalsById.get(id) || null;
}

export function getPortrayalsByIdentity(identityId) {
  return PORTRAYALS.filter((p) => p.identityId === identityId);
}

export function getAlternatePortrayals(slug) {
  const current = getPortrayalBySlug(slug);
  if (!current || !current.identityId) return [];
  return PORTRAYALS.filter((p) => p.identityId === current.identityId && p.slug !== slug);
}

export function isTeamMember(membership) {
  if (!membership) return false;
  return membership.type === "member" || membership.type === "former-member" || !membership.type;
}

export function isTeamAlly(membership) {
  if (!membership) return false;
  return membership.type === "ally" || membership.type === "collaborator";
}

export function getTeamMembers(teamId) {
  return PORTRAYALS.filter((p) =>
    Array.isArray(p.teamMemberships) &&
    p.teamMemberships.some((m) => m.teamId === teamId && isTeamMember(m))
  );
}

export function getTeamAllies(teamId) {
  return PORTRAYALS.filter((p) =>
    Array.isArray(p.teamMemberships) &&
    p.teamMemberships.some((m) => m.teamId === teamId && isTeamAlly(m))
  );
}

export function searchAndFilterPortrayals({
  query = "",
  universe = "all",
  team = "all",
  role = "all",
  sort = "debut-asc"
} = {}) {
  const cleanQuery = query.trim().toLowerCase();

  const filtered = PORTRAYALS.filter((item) => {
    if (universe !== "all" && item.universeId !== universe) {
      return false;
    }

    if (role !== "all" && item.role !== role) {
      return false;
    }

    if (team !== "all") {
      const inTeam = Array.isArray(item.teamMemberships) &&
        item.teamMemberships.some((m) => m.teamId === team);
      if (!inTeam) return false;
    }

    if (cleanQuery) {
      const matchName = item.name.toLowerCase().includes(cleanQuery);
      const matchReal = item.realName ? item.realName.toLowerCase().includes(cleanQuery) : false;
      const matchActor = item.actor ? item.actor.toLowerCase().includes(cleanQuery) : false;
      const matchAliases = Array.isArray(item.aliases) &&
        item.aliases.some((a) => a.toLowerCase().includes(cleanQuery));
      const matchFilms = Array.isArray(item.appearances) &&
        item.appearances.some((a) => a.title.toLowerCase().includes(cleanQuery));
      const matchTeams = Array.isArray(item.teamMemberships) &&
        item.teamMemberships.some((m) => {
          const t = getTeamById(m.teamId);
          return t ? t.name.toLowerCase().includes(cleanQuery) : false;
        });

      if (!matchName && !matchReal && !matchActor && !matchAliases && !matchFilms && !matchTeams) {
        return false;
      }
    }

    return true;
  });

  return filtered.sort((a, b) => {
    if (sort === "name-asc") {
      return a.name.localeCompare(b.name);
    }
    if (sort === "name-desc") {
      return b.name.localeCompare(a.name);
    }
    if (sort === "debut-desc") {
      const yearA = a.filmDebut?.year || 0;
      const yearB = b.filmDebut?.year || 0;
      return yearB - yearA;
    }
    // Default debut-asc
    const yearA = a.filmDebut?.year || 0;
    const yearB = b.filmDebut?.year || 0;
    if (yearA !== yearB) return yearA - yearB;
    return a.name.localeCompare(b.name);
  });
}
