import CharacterAvatar from "./CharacterAvatar.jsx";
import { getUniverseById, getTeamById, getPortrayalPortraitUrl } from "../../data/encyclopedia/index.js";

export default function CharacterCard({ character }) {
  const universe = getUniverseById(character.universeId);
  const portraitUrl = getPortrayalPortraitUrl(character);
  const primaryTeam = character.teamMemberships?.[0]
    ? getTeamById(character.teamMemberships[0].teamId)
    : null;

  const roleColors = {
    hero: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    villain: "bg-red-500/10 text-red-400 border-red-500/20",
    "anti-hero": "bg-purple-500/10 text-purple-400 border-purple-500/20",
    supporting: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  };

  const roleLabel = {
    hero: "Hero",
    villain: "Villain",
    "anti-hero": "Anti-Hero",
    supporting: "Supporting",
  }[character.role] || character.role;

  return (
    <a
      href={`/character/${character.slug}`}
      className="group relative flex flex-col rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-accent/50 transition-all duration-300 shadow-lg shadow-black/40 hover:shadow-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      aria-label={`View profile of ${character.name}, portrayed by ${character.actor}`}
    >
      {/* Top Banner / Avatar */}
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        <CharacterAvatar
          src={portraitUrl}
          alt={`Actor portrait of ${character.actor} (${character.name})`}
          fallbackName={character.name}
          accentColor={universe?.accentColor}
          aspectRatio="aspect-[3/4]"
          className="transition-transform duration-500 group-hover:scale-105"
        />

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 z-10 pointer-events-none">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border backdrop-blur-md ${
              universe?.badgeColor || "border-white/20 text-white bg-black/60"
            }`}
          >
            {universe?.shortName || character.universeId}
          </span>

          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border backdrop-blur-md ${
              roleColors[character.role] || "border-white/20 text-white bg-black/60"
            }`}
          >
            {roleLabel}
          </span>
        </div>

        {/* Film debut year badge at bottom right of image */}
        {character.filmDebut && (
          <div className="absolute bottom-3 right-3 z-10 pointer-events-none">
            <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-black/80 border border-white/15 text-neutral-300 backdrop-blur-sm">
              Debut {character.filmDebut.year}
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        <div className="flex-1">
          <h3 className="font-display text-2xl tracking-wide text-white leading-tight group-hover:text-accent-bright transition-colors">
            {character.name}
          </h3>

          <p className="text-xs text-muted font-medium mt-0.5">
            {character.realName && character.realName !== character.name ? (
              <span>{character.realName} · </span>
            ) : null}
            <span className="text-neutral-300">{character.actor}</span>
          </p>

          <p className="text-xs text-neutral-400 mt-2.5 line-clamp-2 leading-relaxed">
            {character.tagline || character.biography}
          </p>
        </div>

        {/* Footer meta: Primary team or appearances */}
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-muted">
          {primaryTeam ? (
            <span className="inline-flex items-center gap-1 text-emerald-400/90 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {primaryTeam.name}
            </span>
          ) : (
            <span className="text-neutral-500 italic">Independent</span>
          )}

          <span className="text-[11px] font-medium text-neutral-400 group-hover:text-white transition-colors">
            {character.appearances?.length || 1}{" "}
            {character.appearances?.length === 1 ? "film" : "films"} →
          </span>
        </div>
      </div>
    </a>
  );
}
