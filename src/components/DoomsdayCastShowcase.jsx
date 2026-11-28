import { useEffect, useId, useRef, useState } from "react";
import {
  CAST_GROUPS, CAST_SOURCES, CAST_VERIFIED_AT, FEATURED_CAST,
  UNDISCLOSED_CAST, VERIFIED_CAST, filterCast,
} from "../data/doomsdayCast.js";
import "../styles/doomsday-cast.css";

const verificationDate = new Intl.DateTimeFormat("en-GB", {
  day: "numeric", month: "short", year: "numeric", timeZone: "UTC",
}).format(new Date(`${CAST_VERIFIED_AT}T00:00:00Z`));

function Portrait({ entry }) {
  const [failed, setFailed] = useState(false);
  const initials = entry.characterName.split(/[\s-]+/).slice(0, 2)
    .map((part) => part[0]).join("");
  return (
    <span className="cast-portrait" aria-hidden="true">
      {entry.imagePath && !failed ? (
        <img src={entry.imagePath} alt="" width="48" height="56"
          loading="lazy" decoding="async" onError={() => setFailed(true)} />
      ) : initials}
    </span>
  );
}

function CharacterCard({ entry, compact = false }) {
  return (
    <li className={`cast-card${compact ? " cast-card--compact" : ""}`}
      data-group={entry.displayGroup}>
      <Portrait entry={entry} />
      <div className="cast-card-copy">
        <h3>{entry.characterName}</h3>
        {entry.aliases.length > 0 && <p className="cast-alias">{entry.aliases.join(" / ")}</p>}
        <p className="cast-actor">{entry.actorName}</p>
        {!compact && <>
          <p className="cast-category">{CAST_GROUPS[entry.displayGroup]}</p>
          {entry.continuity && <p className="cast-category">{entry.continuity}</p>}
          <a className="cast-evidence" href={entry.sourceUrl} target="_blank" rel="noopener noreferrer"
            aria-label={`Official confirmation for ${entry.characterName}, played by ${entry.actorName}`}>
            Official confirmation
          </a>
        </>}
      </div>
    </li>
  );
}

export default function DoomsdayCastShowcase() {
  const id = useId();
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);
  const searchRef = useRef(null);
  const railRef = useRef(null);
  const [isOpen, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("all");
  const results = filterCast(query, group);

  useEffect(() => {
    if (!isOpen) return;
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Native top-layer dialog supplies background inertness and focus trapping,
    // including when this island lives inside the hero's clipped/blurred panel.
    dialog.showModal();
    searchRef.current?.focus({ preventScroll: true });
    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  const scrollPreview = (direction) => {
    const rail = railRef.current;
    const distance = rail.firstElementChild?.getBoundingClientRect().width ?? rail.clientWidth;
    rail.scrollBy({ left: direction * (distance + 8),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };

  const handleRailKey = (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      scrollPreview(event.key === "ArrowRight" ? 1 : -1);
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      railRef.current.scrollTo({ left: event.key === "Home" ? 0 : railRef.current.scrollWidth,
        behavior: "instant" });
    }
  };

  return (
    <section className="doomsday-cast" aria-labelledby={`${id}-heading`}>
      <h2 id={`${id}-heading`} className="cast-heading">WHO'S IN AVENGERS: DOOMSDAY?</h2>
      <ul id={`${id}-preview`} ref={railRef} className="cast-preview" tabIndex={0}
        aria-label="Featured confirmed characters. Swipe or use Left and Right arrow keys."
        onKeyDown={handleRailKey}>
        {FEATURED_CAST.map((entry) => <CharacterCard key={entry.id} entry={entry} compact />)}
      </ul>
      <div className="cast-actions">
        <button ref={triggerRef} type="button" className="cast-view-all"
          aria-haspopup="dialog" aria-controls={`${id}-dialog`} aria-expanded={isOpen}
          onClick={() => { setQuery(""); setGroup("all"); setOpen(true); }}>
          View All Characters <span className="cast-count">{VERIFIED_CAST.length}</span>
        </button>
        <div className="cast-rail-controls">
          <button type="button" aria-label="Previous confirmed characters"
            aria-controls={`${id}-preview`} onClick={() => scrollPreview(-1)}>‹</button>
          <button type="button" aria-label="Next confirmed characters"
            aria-controls={`${id}-preview`} onClick={() => scrollPreview(1)}>›</button>
        </div>
      </div>
      <p className="cast-source">
        <a href={CAST_SOURCES.guide} target="_blank" rel="noopener noreferrer">Disney+ source</a>
        {" · Verified "}<time dateTime={CAST_VERIFIED_AT}>{verificationDate}</time>
      </p>

      <dialog ref={dialogRef} id={`${id}-dialog`} className="cast-dialog"
        aria-labelledby={`${id}-title`} aria-describedby={`${id}-note`}
        onClose={() => setOpen(false)}>
        {isOpen && <div className="cast-dialog-inner">
          <header className="cast-dialog-header">
            <div>
              <p className="cast-eyebrow">The officially confirmed lineup</p>
              <h2 id={`${id}-title`} className="cast-heading">AVENGERS: DOOMSDAY CHARACTERS</h2>
            </div>
            <button type="button" className="cast-close" aria-label="Close character roster"
              onClick={() => dialogRef.current.close()}>×</button>
          </header>
          <p id={`${id}-note`} className="cast-note">
            Verified identities so far; surprise appearances may remain unknown.
            Categories help you browse and do not imply team membership or a specific universe.
          </p>
          <div className="cast-search-row">
            <label className="cast-search" htmlFor={`${id}-search`}>
              Search character or actor
              <input ref={searchRef} id={`${id}-search`} type="search" value={query}
                placeholder="Try Captain America or Pedro Pascal"
                onChange={(event) => setQuery(event.target.value)} />
            </label>
            <label className="cast-filter" htmlFor={`${id}-filter`}>
              Display category
              <select id={`${id}-filter`} value={group} onChange={(event) => setGroup(event.target.value)}>
                <option value="all">All categories</option>
                {Object.entries(CAST_GROUPS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
              </select>
            </label>
          </div>
          <p className="cast-results" role="status" aria-live="polite" aria-atomic="true">
            {results.length} of {VERIFIED_CAST.length} confirmed characters
          </p>
          {results.length > 0 ? (
            <ul className="cast-grid" aria-label="Confirmed character results">
              {results.map((entry) => <CharacterCard key={entry.id} entry={entry} />)}
            </ul>
          ) : (
            <div className="cast-empty">
              <p>No characters match this search and category.</p>
              <button type="button" onClick={() => { setQuery(""); setGroup("all"); }}>Clear search and filters</button>
            </div>
          )}
          <footer className="cast-dialog-footer">
            <p>Verified <time dateTime={CAST_VERIFIED_AT}>{verificationDate}</time>. Sources: {" "}
              <a href={CAST_SOURCES.guide} target="_blank" rel="noopener noreferrer">Disney+ character guide</a>{" · "}
              <a href={CAST_SOURCES.update} target="_blank" rel="noopener noreferrer">Latest Disney+ overview</a>{" · "}
              <a href={CAST_SOURCES.film} target="_blank" rel="noopener noreferrer">Official film page</a>
            </p>
            {UNDISCLOSED_CAST.map((entry) => <p key={entry.actorName}>
              <a href={entry.sourceUrl} target="_blank" rel="noopener noreferrer">{entry.actorName}</a>
              {" is listed in the official cast; role not officially disclosed in the sources checked. Excluded from the character count."}
            </p>)}
            <p>Unofficial fan project. Not affiliated with Marvel Studios or Disney.</p>
          </footer>
        </div>}
      </dialog>
    </section>
  );
}
