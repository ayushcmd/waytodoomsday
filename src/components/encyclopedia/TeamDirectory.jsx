import { useState, useMemo } from "react";
import {
  TEAMS,
  UNIVERSES,
  getTeamMembers,
  getUniverseById,
} from "../../data/encyclopedia/index.js";

export default function TeamDirectory() {
  const [universe, setUniverse] = useState("all");
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");

  const filteredTeams = useMemo(() => {
    const q = search.trim().toLowerCase();
    return TEAMS.filter((t) => {
      if (universe !== "all" && t.universeId !== universe) return false;
      if (category !== "all" && t.category !== category) return false;
      if (q) {
        const matchName = t.name.toLowerCase().includes(q);
        const matchLeader = t.leader ? t.leader.toLowerCase().includes(q) : false;
        const matchDesc = t.description ? t.description.toLowerCase().includes(q) : false;
        if (!matchName && !matchLeader && !matchDesc) return false;
      }
      return true;
    });
  }, [universe, category, search]);

  const handleReset = () => {
    setUniverse("all");
    setCategory("all");
    setSearch("");
  };

  const categoryLabels = {
    team: "Hero / Strike Team",
    organization: "Global / Multiversal Agency",
    faction: "Ideological Faction",
  };

  return (
    <div className="w-full">
      {/* Search & Filter Header */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5 sm:p-7 shadow-xl shadow-black/40 mb-10">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search teams by name, leader..."
              className="w-full pl-4 pr-9 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white placeholder-muted text-xs sm:text-sm focus:outline-none focus:border-accent"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full md:w-auto">
            {["all", "team", "organization", "faction"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors ${
                  category === cat
                    ? "bg-accent text-white shadow-sm"
                    : "bg-white/5 text-muted hover:text-white hover:bg-white/10"
                }`}
              >
                {cat === "all" ? "All Groups" : cat === "team" ? "Teams" : cat === "organization" ? "Organizations" : "Factions"}
              </button>
            ))}
          </div>
        </div>

        {/* Universe Row */}
        <div className="mt-5 pt-4 border-t border-white/5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted mr-2 shrink-0">
            Continuity:
          </span>
          <button
            type="button"
            onClick={() => setUniverse("all")}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              universe === "all" ? "bg-white/20 text-white" : "text-muted hover:text-white"
            }`}
          >
            All Universes
          </button>
          {UNIVERSES.map((u) => {
            const hasTeams = TEAMS.some((t) => t.universeId === u.id);
            if (!hasTeams) return null;
            return (
              <button
                key={u.id}
                type="button"
                onClick={() => setUniverse(u.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  universe === u.id ? "bg-white/20 text-white" : "text-muted hover:text-white"
                }`}
              >
                {u.shortName}
              </button>
            );
          })}
        </div>

        {/* Results Bar */}
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-muted">
          <span>
            Showing <strong class="text-white">{filteredTeams.length}</strong> groups
          </span>
          {(search || universe !== "all" || category !== "all") && (
            <button
              type="button"
              onClick={handleReset}
              className="text-accent-bright hover:text-white transition-colors"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.map((t) => {
          const u = getUniverseById(t.universeId);
          const members = getTeamMembers(t.id);

          return (
            <a
              key={t.id}
              href={`/teams/${t.slug}`}
              className="group flex flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-accent/50 p-6 transition-all duration-300 shadow-xl shadow-black/40 hover:shadow-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${u?.badgeColor || 'border-white/10 text-white'}`}>
                    {u?.shortName || t.universeId}
                  </span>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-300">
                    {t.category}
                  </span>
                </div>

                <h3 className="font-display text-3xl text-white tracking-wide group-hover:text-accent-bright transition-colors leading-tight">
                  {t.name}
                </h3>

                {t.leader && (
                  <p className="text-xs text-neutral-300 font-medium mt-1">
                    Leader: <span class="text-white">{t.leader}</span>
                  </p>
                )}

                <p className="text-xs text-neutral-400 mt-3 line-clamp-3 leading-relaxed">
                  {t.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-muted">
                <span className="font-medium text-emerald-400">
                  {members.length} {members.length === 1 ? "verified member" : "verified members"}
                </span>
                <span className="group-hover:text-white transition-colors">
                  Explore roster →
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
