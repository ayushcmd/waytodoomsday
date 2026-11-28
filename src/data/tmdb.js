// Public image configuration only. API credentials must never enter src/.
// https://developer.themoviedb.org/docs/image-basics
export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/";
export const TMDB_PROFILE_SIZE = "w185";
export const TMDB_PROFILE_LARGE_SIZE = "h632";
const ALLOWED_PROFILE_SIZES = new Set([TMDB_PROFILE_SIZE, TMDB_PROFILE_LARGE_SIZE]);
export const isProfilePath = (path) => typeof path === "string" && /^\/[a-zA-Z0-9_-]+\.(jpg|png|webp)$/.test(path);

export function portraitIsCurrent(tmdb, now = new Date()) {
  if (!Number.isSafeInteger(tmdb?.personId) || tmdb.personId <= 0
    || !Number.isSafeInteger(tmdb.creditId) || tmdb.creditId <= 0 || !isProfilePath(tmdb.profilePath)) return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(tmdb.verifiedAt ?? "")) return false;
  const verified = new Date(`${tmdb.verifiedAt}T00:00:00Z`);
  if (!Number.isFinite(verified.getTime()) || verified.toISOString().slice(0, 10) !== tmdb.verifiedAt || verified > now) return false;
  // TMDB's API terms limit cached metadata to six months. Refresh sooner.
  const expiry = new Date(verified.getTime() + 180 * 24 * 60 * 60 * 1000);
  return now < expiry;
}

export function getActorPortraitUrl(entry, now, size = TMDB_PROFILE_SIZE) {
  const safeSize = ALLOWED_PROFILE_SIZES.has(size) ? size : TMDB_PROFILE_SIZE;
  return portraitIsCurrent(entry?.tmdb, now)
    ? `${TMDB_IMAGE_BASE}${safeSize}${entry.tmdb.profilePath}`
    : null;
}
