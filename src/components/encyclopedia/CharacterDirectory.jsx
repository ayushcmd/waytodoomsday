import { useState, useEffect, useMemo, useId } from "react";
import CharacterCard from "./CharacterCard.jsx";
import {
  PORTRAYALS,
  UNIVERSES,
  TEAMS,
  searchAndFilterPortrayals,
} from "../../data/encyclopedia/index.js";

export default function CharacterDirectory() {
  const searchInputId = useId();

  // Initialize state from URL params if available on client
  const [query, setQuery] = useState("");
  const [universe, setUniverse] = useState("all");
  const [team, setTeam] = useState("all");
  const [role, setRole] = useState("all");
  const [sort, setSort] = useState("debut-asc");

  // Read initial URL params on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.has("q")) setQuery(params.get("q"));
    if (params.has("universe")) setUniverse(params.get("universe"));
    if (params.has("team")) setTeam(params.get("team"));
    if (params.has("role")) setRole(params.get("role"));
    if (params.has("sort")) setSort(params.get("sort"));
  }, []);

  // Sync state to URL params
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (universe !== "all") params.set("universe", universe);
    if (team !== "all") params.set("team", team);
    if (role !== "all") params.set("role", role);
    if (sort !== "debut-asc") params.set("sort", sort);

    const queryString = params.toString();
    const newUrl = queryString
      ? `${window.location.pathname}?${queryString}`
      : window.location.pathname;

    window.history.replaceState(null, "", newUrl);
  }, [query, universe, team, role, sort]);

  const filteredCharacters = useMemo(() => {
    return searchAndFilterPortrayals({
      query,
      universe,
      team,
      role,
      sort,
    });
  }, [query, universe, team, role, sort]);

  const handleReset = () => {
    setQuery("");
    setUniverse("all");
    setTeam("all");
    setRole("all");
    setSort("debut-asc");
  };

  const isFiltered = query || universe !== "all" || team !== "all" || role !== "all" || sort !== "debut-asc";

  return (
    <div className="w-full">
      {/* Controls Container */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5 sm:p-7 shadow-xl shadow-black/40 mb-10">
        {/* Search input bar */}
        <div className="relative w-full">
          <label htmlFor={searchInputId} className="sr-only">
            Search Marvel characters
          </label>
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted">
            <svg
              className="w-5 h-5 text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            id={searchInputId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by character, real name, actor, movie, or team..."
            className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-black/60 border border-white/15 text-white placeholder-muted text-sm sm:text-base focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted hover:text-white"
            >
              <span className="w-5 h-5 flex items-center justify-center rounded-full bg-white/10 text-xs">
                ✕
              </span>
            </button>
          )}
        </div>

        {/* Universe Quick Filter Tabs */}
        <div className="mt-6">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-2.5">
            Cinematic Continuities
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            <button
              type="button"
              onClick={() => setUniverse("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                universe === "all"
                  ? "bg-accent text-white shadow-sm"
                  : "bg-white/5 text-muted hover:text-white hover:bg-white/10"
              }`}
            >
              All Multiverses ({PORTRAYALS.length})
            </button>
            {UNIVERSES.map((u) => {
              const count = PORTRAYALS.filter((p) => p.universeId === u.id).length;
              if (count === 0) return null;
              const isActive = universe === u.id;
              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => setUniverse(u.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    isActive
                      ? "bg-accent text-white shadow-sm"
                      : "bg-white/5 text-muted hover:text-white hover:bg-white/10"
                  }`}
                >
                  {u.shortName} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Secondary Filters Grid */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4 border-t border-white/5">
          {/* Role Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1.5">
              Character Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:outline-none focus:border-accent"
            >
              <option value="all">All Roles</option>
              <option value="hero">Heroes</option>
              <option value="villain">Villains</option>
              <option value="anti-hero">Anti-Heroes</option>
              <option value="supporting">Supporting</option>
            </select>
          </div>

          {/* Team Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1.5">
              Team / Organization
            </label>
            <select
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:outline-none focus:border-accent"
            >
              <option value="all">All Groups</option>
              {TEAMS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.category})
                </option>
              ))}
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1.5">
              Sort Order
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:outline-none focus:border-accent"
            >
              <option value="debut-asc">Film Debut (Oldest First)</option>
              <option value="debut-desc">Film Debut (Newest First)</option>
              <option value="name-asc">Name (A to Z)</option>
              <option value="name-desc">Name (Z to A)</option>
            </select>
          </div>
        </div>

        {/* Results Bar / Reset */}
        <div className="mt-5 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-muted">
            Showing <span className="text-white font-bold">{filteredCharacters.length}</span> of{" "}
            <span className="text-white font-semibold">{PORTRAYALS.length}</span> verified portrayals
            {universe !== "all" && (
              <span>
                {" "}
                in <span className="text-accent-bright">{UNIVERSES.find((u) => u.id === universe)?.name}</span>
              </span>
            )}
          </div>

          {isFiltered && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs text-accent-bright hover:text-white font-medium transition-colors"
            >
              <span>✕</span> Reset all filters
            </button>
          )}
        </div>
      </div>

      {/* Grid or Empty State */}
      {filteredCharacters.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
          {filteredCharacters.map((character) => (
            <CharacterCard key={character.id} character={character} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 rounded-3xl border border-white/10 bg-white/[0.02]">
          <div className="w-16 h-16 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted mb-4 text-2xl">
            🔍
          </div>
          <h3 className="font-display text-3xl text-white">No Characters Found</h3>
          <p className="text-sm text-muted mt-2 max-w-md mx-auto">
            We couldn't find any verified character portrayals matching your search criteria.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center text-xs font-bold uppercase tracking-wide px-5 py-2.5 rounded-full bg-accent text-white hover:bg-accent-bright transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
