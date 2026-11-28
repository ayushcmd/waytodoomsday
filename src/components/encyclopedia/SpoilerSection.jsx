import { useState } from "react";

export default function SpoilerSection({ spoilerBio, spoilerWarning }) {
  const [isRevealed, setIsRevealed] = useState(false);

  if (!spoilerBio) return null;

  return (
    <div className="mt-6 rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] p-5 sm:p-6 transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 text-sm font-bold shrink-0">
            ⚠️
          </span>
          <div>
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-300">
              Climactic Plot & Spoilers
            </h4>
            <p className="text-[11px] sm:text-xs text-neutral-400 mt-0.5">
              {spoilerWarning || "Contains major story developments and ending outcomes."}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsRevealed((prev) => !prev)}
          aria-expanded={isRevealed}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
            isRevealed
              ? "bg-white/10 text-neutral-200 hover:bg-white/20 hover:text-white"
              : "bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 hover:text-amber-200"
          }`}
        >
          {isRevealed ? "Hide Spoilers" : "Reveal Spoilers"}
        </button>
      </div>

      {isRevealed && (
        <div className="mt-4 pt-4 border-t border-amber-500/15">
          <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed whitespace-pre-line">
            {spoilerBio}
          </p>
        </div>
      )}
    </div>
  );
}
