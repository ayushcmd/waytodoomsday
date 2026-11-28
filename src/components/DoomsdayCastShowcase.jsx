import { useEffect, useId, useRef, useState } from "react";
import {
  CAST_GROUPS, CAST_SOURCES, CAST_VERIFIED_AT, FEATURED_CAST,
  VERIFIED_CAST,
} from "../data/doomsdayCast.js";
import {
  DEFAULT_EVIDENCE_SECTION, EVIDENCE_SECTIONS, EVIDENCE_COUNTS,
  filterEvidence, evidenceDetails, nextEvidenceTab,
} from "../data/doomsdayEvidence.js";
import "../styles/doomsday-cast.css";
import { getActorPortraitUrl } from "../data/tmdb.js";

const verificationDate = new Intl.DateTimeFormat("en-GB", {
  day: "numeric", month: "short", year: "numeric", timeZone: "UTC",
}).format(new Date(`${CAST_VERIFIED_AT}T00:00:00Z`));
const formatDate = (date) => new Intl.DateTimeFormat("en-GB", {
  day: "numeric", month: "short", year: "numeric", timeZone: "UTC",
}).format(new Date(`${date}T00:00:00Z`));

export function Portrait({ entry, compact }) {
  const portraitRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [failedUrl, setFailedUrl] = useState(null);
  const imageUrl = entry.imagePath || getActorPortraitUrl(entry);
  useEffect(() => {
    if (!imageUrl) return;
    if (!("IntersectionObserver" in window)) { setReady(true); return; }
    const node = portraitRef.current;
    const observer = new IntersectionObserver(([observed]) => {
      if (observed.isIntersecting) { setReady(true); observer.disconnect(); }
    }, { root: node.closest(compact ? ".cast-preview" : "dialog"),
      rootMargin: compact ? "0px 80px" : "160px 0px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, [imageUrl, compact]);
  const initials = (entry.characterName || entry.actorName).split(/[\s-]+/).slice(0, 2)
    .map((part) => part[0]).join("");
  return (
    <span ref={portraitRef} className="cast-portrait" aria-hidden="true">
      {imageUrl && ready && failedUrl !== imageUrl ? (
        <img src={imageUrl} alt="" width="48" height="56"
          loading="lazy" decoding="async" referrerPolicy="no-referrer"
          onError={() => setFailedUrl(imageUrl)} />
      ) : initials}
    </span>
  );
}

function EvidenceDetails({ entry }) {
  const evidence = evidenceDetails(entry);
  return <>
    <p className="cast-status" data-tone={evidence.tone}>{evidence.label}</p>
    <p className="cast-evidence-summary">{evidence.summary}</p>
    <p className="cast-evidence-date">Verified <time dateTime={entry.verifiedAt}>{formatDate(entry.verifiedAt)}</time></p>
    <p className="cast-evidence-date">{evidence.sourceDate
      ? <>{evidence.sourceDateLabel} <time dateTime={evidence.sourceDate}>{formatDate(evidence.sourceDate)}</time></>
      : "Source publication date not provided"}</p>
    <a className="cast-evidence" href={entry.sourceUrl} target="_blank" rel="noopener noreferrer"
      aria-label={`${evidence.sourceLabel} for ${entry.characterName || entry.actorName}`}>
      {evidence.sourceLabel} · {evidence.publisher}
    </a>
    {entry.additionalSources?.length > 0 && <details className="cast-extra-sources">
      <summary>Supporting sources</summary>
      <ul>{entry.additionalSources.map((url) => <li key={url}>
        <a href={url} target="_blank" rel="noopener noreferrer">{new URL(url).hostname.replace(/^www\./, "")}</a>
      </li>)}</ul>
    </details>}
  </>;
}

function CharacterCard({ entry, compact = false }) {
  return (
    <li className={`cast-card${compact ? " cast-card--compact" : ""}`}
      data-group={entry.displayGroup} data-evidence-section={entry.section ?? "confirmed"}>
      <Portrait entry={entry} compact={compact} />
      <div className="cast-card-copy">
        <h3>{entry.characterName}</h3>
        {entry.aliases.length > 0 && <p className="cast-alias">{entry.aliases.join(" / ")}</p>}
        <p className="cast-actor">{entry.actorName}</p>
        {!compact && <>
          <p className="cast-category">{CAST_GROUPS[entry.displayGroup]}</p>
          {entry.continuity && <p className="cast-category">{entry.continuity}</p>}
          <EvidenceDetails entry={entry} />
        </>}
      </div>
    </li>
  );
}

function ActorCard({ entry }) {
  return <li className="cast-card cast-actor-only" data-evidence-section="undisclosed">
    <Portrait entry={entry} compact={false} />
    <div className="cast-card-copy">
      <h3>{entry.actorName}</h3>
      <p className="cast-actor">Character role undisclosed</p>
      <EvidenceDetails entry={entry} />
    </div>
  </li>;
}

export default function DoomsdayCastShowcase() {
  const id = useId();
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);
  const searchRef = useRef(null);
  const railRef = useRef(null);
  const tabRefs = useRef([]);
  const [isOpen, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("all");
  const [section, setSection] = useState(DEFAULT_EVIDENCE_SECTION);
  const currentSection = EVIDENCE_SECTIONS.find((item) => item.key === section);
  const results = filterEvidence(section, query, group);

  const handleTabKey = (event, index) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = nextEvidenceTab(index, event.key);
    setSection(EVIDENCE_SECTIONS[next].key);
    tabRefs.current[next]?.focus();
  };

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
          aria-label={`View all characters; ${VERIFIED_CAST.length} officially confirmed`}
          onClick={() => { setQuery(""); setGroup("all"); setSection(DEFAULT_EVIDENCE_SECTION); setOpen(true); }}>
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
              <p className="cast-eyebrow">Cast evidence &amp; fan possibilities</p>
              <h2 id={`${id}-title`} className="cast-heading">AVENGERS: DOOMSDAY CHARACTERS</h2>
            </div>
            <button type="button" className="cast-close" aria-label="Close character roster"
              onClick={() => dialogRef.current.close()}>×</button>
          </header>
          <p id={`${id}-note`} className="cast-note">
            Confirmed characters, official previews, reports and speculation stay separate.
            Categories do not imply team membership or a specific universe. Actor portraits identify performers; they are not casting evidence.
          </p>
          <div className="cast-evidence-tabs" role="tablist" aria-label="Doomsday evidence categories">
            {EVIDENCE_SECTIONS.map((item, index) => <button key={item.key} type="button" role="tab"
              id={`${id}-tab-${item.key}`} aria-controls={`${id}-panel-${item.key}`}
              aria-selected={section === item.key} tabIndex={section === item.key ? 0 : -1}
              ref={(node) => { tabRefs.current[index] = node; }}
              onClick={() => setSection(item.key)} onKeyDown={(event) => handleTabKey(event, index)}>
              <span>{item.label}</span><span className="cast-tab-count">{EVIDENCE_COUNTS[item.key]}</span>
              <span className="sr-only">{" "}{item.unit}</span>
            </button>)}
          </div>
          {EVIDENCE_SECTIONS.map((item) => <div key={item.key} id={`${id}-panel-${item.key}`}
            role="tabpanel" aria-labelledby={`${id}-tab-${item.key}`} hidden={section !== item.key}>
            {section === item.key && <>
              <p className="cast-tier-note">{currentSection.note}</p>
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
                {results.length} of {EVIDENCE_COUNTS[section]} {currentSection.unit}
              </p>
              {results.length > 0 ? (
                <ul className="cast-grid" aria-label={section === "undisclosed" ? "Actors with undisclosed roles" : `${currentSection.label} character results`}>
                  {results.map((entry) => entry.kind === "actor" ? <ActorCard key={entry.id} entry={entry} /> : <CharacterCard key={entry.id} entry={entry} />)}
                </ul>
              ) : (
                <div className="cast-empty">
                  <p>No {section === "undisclosed" ? "actors" : "characters"} match this search and category.</p>
                  <button type="button" onClick={() => { setQuery(""); setGroup("all"); }}>Clear search and filters</button>
                </div>
              )}
            </>}
          </div>)}
          <footer className="cast-dialog-footer">
            <p>Official roster reviewed <time dateTime={CAST_VERIFIED_AT}>{verificationDate}</time>. Sources: {" "}
              <a href={CAST_SOURCES.guide} target="_blank" rel="noopener noreferrer">Disney+ character guide</a>{" · "}
              <a href={CAST_SOURCES.update} target="_blank" rel="noopener noreferrer">Latest Disney+ overview</a>{" · "}
              <a href={CAST_SOURCES.film} target="_blank" rel="noopener noreferrer">Official film page</a>
            </p>
            <p>Counts are separate by evidence tier. Roles undisclosed lists actors only. No public source guarantees every appearance in the finished film.</p>
            <p>Unofficial fan project. Not affiliated with Marvel Studios or Disney.</p>
          </footer>
        </div>}
      </dialog>
    </section>
  );
}
