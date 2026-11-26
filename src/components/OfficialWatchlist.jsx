import movies from "../data/movies.json";
import { useWatched } from "../hooks/useWatched.js";

// Disney+'s "Countdown to Avengers: Doomsday" 15-title collection.
// Keep this curated order separate from the main MCU chronological timeline.
// https://www.disneyplus.com/explore/articles/countdown-to-avengers-doomsday
const COLLECTION = [
  { id: "x-men-2000", title: "X-Men", year: 2000, type: "movie", universe: "Fox X-Men" },
  { id: "x2-2003", title: "X2", year: 2003, type: "movie", universe: "Fox X-Men" },
  { id: "captain-america-first-avenger" },
  { id: "avengers" },
  { id: "avengers-infinity-war" },
  { id: "avengers-endgame" },
  { id: "loki", note: "Watch seasons 1 & 2" },
  { id: "shang-chi" },
  { id: "spider-man-no-way-home" },
  { id: "doctor-strange-multiverse-of-madness" },
  { id: "black-panther-wakanda-forever" },
  { id: "deadpool-and-wolverine" },
  { id: "captain-america-brave-new-world" },
  { id: "thunderbolts" },
  { id: "fantastic-four-first-steps" },
];

const byId = new Map(movies.map((item) => [item.id, item]));
const items = COLLECTION.map((entry) => ({ ...byId.get(entry.id), ...entry }));

export default function OfficialWatchlist() {
  const { watchedMap, toggleWatched } = useWatched();
  const completed = items.filter((item) => watchedMap[item.id]).length;

  return (
    <section id="official-watchlist" className="scroll-mt-24 border-t border-white/10 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-accent font-bold mb-2">Disney+ recommended collection</p>
            <h2 className="font-display text-2xl sm:text-4xl tracking-wide">
              OFFICIAL <span className="text-accent">DOOMSDAY WATCHLIST</span>
            </h2>
            <p className="text-sm text-muted mt-3 max-w-2xl leading-relaxed">
              15 recommended movies and shows to revisit before Avengers: Doomsday.
              This includes two X-Men films from a separate universe; it is not the main MCU timeline.
            </p>
          </div>
          <a href="https://www.disneyplus.com/explore/articles/countdown-to-avengers-doomsday"
             target="_blank" rel="noopener noreferrer"
             className="text-sm text-white underline underline-offset-4 hover:text-accent shrink-0">
            View Disney+ source ↗
          </a>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 mb-6" aria-live="polite">
          <div className="flex items-center justify-between gap-3 mb-3">
            <span className="text-sm font-semibold">Your official-list progress</span>
            <span className="text-sm text-white font-bold tabular-nums">{completed} / {items.length} watched</span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden" role="progressbar"
               aria-label="Official Doomsday watchlist progress" aria-valuemin={0}
               aria-valuemax={items.length} aria-valuenow={completed}>
            <div className="h-full bg-accent rounded-full transition-all duration-300"
                 style={{ width: `${(completed / items.length) * 100}%` }} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((item, index) => {
            const watched = !!watchedMap[item.id];
            return (
              <button type="button" key={item.id} onClick={() => toggleWatched(item.id)}
                aria-pressed={watched}
                className={`text-left flex items-center gap-3 rounded-xl border p-3 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  watched ? "border-accent/60 bg-accent/10" : "border-white/10 bg-white/[0.04] hover:border-white/30"
                }`}>
                <div className="w-12 h-16 shrink-0 rounded-md overflow-hidden bg-gradient-to-br from-green-950 to-zinc-900 flex items-center justify-center">
                  {item.poster ? (
                    <img src={item.poster} alt="" loading="lazy" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-xs font-black text-white/70">X</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase tracking-widest text-muted mb-1">
                    {String(index + 1).padStart(2, "0")} · {item.type === "series" ? "Series" : "Movie"} · {item.year}
                  </p>
                  <h3 className="font-semibold text-sm text-white leading-tight">{item.title}</h3>
                  {(item.note || item.universe) && (
                    <p className="text-xs text-muted mt-1">{item.note || item.universe}</p>
                  )}
                </div>
                <span aria-hidden="true"
                  className={`shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-xs ${
                    watched ? "bg-accent border-accent text-white" : "border-white/40 text-transparent"
                  }`}>✓</span>
              </button>
            );
          })}
        </div>
        <p className="mt-5 text-xs text-muted">
          Tap a title to mark it watched. Progress syncs with the main timeline for shared titles and stays on this device.
          Disney+ recommendations are a viewing guide, not a requirement to understand the film.
        </p>
      </div>
    </section>
  );
}
