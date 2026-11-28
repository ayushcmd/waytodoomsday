import { useState } from "react";

function getCleanInitials(name) {
  if (!name) return "M";
  // Remove parentheticals like (Young), (Earth-838)
  const withoutParens = name.replace(/\(.*?\)/g, "").trim();
  // Split on hyphen or whitespace to handle "Spider-Man", "Iron Man", etc.
  const parts = withoutParens.split(/[\s-]+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  if (parts.length === 1 && parts[0].length >= 2) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return withoutParens.slice(0, 2).toUpperCase() || "M";
}

export default function CharacterAvatar({
  src,
  alt,
  initials,
  className = "",
  accentColor = "#22c55e",
  aspectRatio = "aspect-[3/4]"
}) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const fallbackInitials = initials || getCleanInitials(alt);
  const showImage = Boolean(src) && !error;

  return (
    <div
      className={`relative overflow-hidden bg-neutral-950 flex items-center justify-center select-none ${aspectRatio} ${className}`}
    >
      {showImage ? (
        <>
          <img
            src={src}
            alt={alt || "Character portrait"}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
          />
          {!loaded && (
            <div className="absolute inset-0 bg-neutral-900 animate-pulse" />
          )}
        </>
      ) : (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-950 to-black text-center">
          {/* Ambient colored backdrop glow */}
          <div
            className="absolute -top-12 -right-12 w-36 h-36 rounded-full opacity-25 blur-2xl pointer-events-none"
            style={{ backgroundColor: accentColor }}
          />
          <div
            className="absolute -bottom-12 -left-12 w-36 h-36 rounded-full opacity-20 blur-2xl pointer-events-none"
            style={{ backgroundColor: accentColor }}
          />

          {/* Monogram emblem */}
          <div
            className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center font-display text-3xl sm:text-4xl tracking-widest text-white border border-white/15 shadow-xl"
            style={{
              background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.18), rgba(0,0,0,0.75))`,
              boxShadow: `0 0 25px -4px ${accentColor}50`
            }}
          >
            {fallbackInitials}
          </div>

          <span className="relative z-10 font-display text-xs sm:text-sm tracking-widest uppercase text-neutral-300 mt-3 px-2 line-clamp-1 drop-shadow-sm">
            {alt}
          </span>
        </div>
      )}

      {/* Subtle overlay gradient at the bottom */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-bg via-transparent to-transparent opacity-80" />
    </div>
  );
}
