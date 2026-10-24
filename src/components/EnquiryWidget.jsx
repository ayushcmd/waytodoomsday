import React, { useState, useEffect, useRef } from "react";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mjyyvbal";

const ENQUIRY_TYPES = [
  "Report a Bug",
  "Website Issue",
  "Ask a Question",
  "Suggestion",
  "Other",
];

export default function EnquiryWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [enquiryType, setEnquiryType] = useState(ENQUIRY_TYPES[0]);
  const [message, setMessage] = useState("");
  const [validationError, setValidationError] = useState("");
  const [status, setStatus] = useState("idle"); // 'idle' | 'submitting' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);

  const panelRef = useRef(null);
  const textareaRef = useRef(null);
  const triggerButtonRef = useRef(null);

  // Close on Escape key press
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        triggerButtonRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Focus textarea when panel opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
    setShowTooltip(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    triggerButtonRef.current?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");
    setErrorMessage("");

    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      setValidationError("Please describe the issue or question before sending.");
      textareaRef.current?.focus();
      return;
    }

    setStatus("submitting");

    const dynamicSubject = `[Way to Doomsday] Website Enquiry: ${enquiryType}`;

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          enquiry_type: enquiryType,
          message: trimmedMessage,
          subject: dynamicSubject,
          _subject: dynamicSubject,
        }),
      });

      if (response.ok) {
        setStatus("success");
        setMessage("");
        setEnquiryType(ENQUIRY_TYPES[0]);
      } else {
        const data = await response.json().catch(() => null);
        const errorText =
          data?.errors?.map((err) => err.message).join(", ") ||
          "Unable to submit enquiry. Please try again in a moment.";
        setErrorMessage(errorText);
        setStatus("error");
      }
    } catch (err) {
      setErrorMessage(
        "Network connection failed. Please check your internet and try again."
      );
      setStatus("error");
    }
  };

  const handleResetForNewEnquiry = () => {
    setStatus("idle");
    setErrorMessage("");
    setValidationError("");
  };

  return (
    <>
      <style>{`
        @keyframes enquiryPopIn {
          0% {
            opacity: 0;
            transform: translateY(16px) scale(0.97);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .enquiry-panel-animated {
          animation: enquiryPopIn 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Floating Trigger Button & Desktop Tooltip */}
      <div
        className="fixed z-[60] flex items-center gap-3 select-none pointer-events-auto"
        style={{
          bottom: "max(1.25rem, env(safe-area-inset-bottom, 1.25rem))",
          right: "max(1.25rem, env(safe-area-inset-right, 1.25rem))",
        }}
      >
        {/* Desktop Tooltip */}
        <div
          role="tooltip"
          className={`hidden md:flex items-center px-3 py-1.5 rounded-lg bg-black/90 text-white text-xs font-medium border border-white/15 shadow-xl shadow-black/80 pointer-events-none transition-all duration-200 transform ${
            showTooltip && !isOpen
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-2 pointer-events-none"
          }`}
        >
          <span>Report a problem or ask a question</span>
          <div className="w-1.5 h-1.5 bg-black/90 border-t border-r border-white/15 transform rotate-45 ml-2 -mr-1"></div>
        </div>

        {/* Floating Circular Button */}
        <button
          ref={triggerButtonRef}
          type="button"
          onClick={toggleOpen}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onFocus={() => setShowTooltip(true)}
          onBlur={() => setShowTooltip(false)}
          aria-label={
            isOpen ? "Close enquiry modal" : "Report a problem or ask a question"
          }
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          title="Report a problem or ask a question"
          className={`relative group w-12 h-12 sm:w-13 sm:h-13 rounded-full flex items-center justify-center shadow-2xl transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-accent-bright focus:ring-offset-2 focus:ring-offset-black cursor-pointer ${
            isOpen
              ? "bg-[#1c1c20] text-white hover:bg-[#28282e] border border-white/25 shadow-black"
              : "bg-accent-bright text-black hover:bg-emerald-400 hover:scale-105 hover:shadow-accent-bright/30 shadow-black/80"
          }`}
        >
          {isOpen ? (
            /* Close X Icon */
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            /* Chat / Message Icon */
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-200 group-hover:scale-110"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          )}

          {/* Pulse ring when closed */}
          {!isOpen && (
            <span className="absolute -inset-1 rounded-full bg-accent-bright/25 animate-ping pointer-events-none -z-10" />
          )}
        </button>
      </div>

      {/* Backdrop & Enquiry Panel */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="enquiry-modal-title"
          className="fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm flex items-end justify-center sm:justify-end p-3 sm:p-6 transition-opacity duration-200"
          onClick={handleClose}
        >
          <div
            ref={panelRef}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxHeight: "calc(100dvh - 6.5rem)",
              marginBottom: "max(4.25rem, calc(env(safe-area-inset-bottom, 1.25rem) + 3.75rem))",
            }}
            className="enquiry-panel-animated w-full sm:w-[390px] max-w-[420px] rounded-2xl bg-[#131317] border border-white/20 shadow-2xl shadow-black/95 flex flex-col text-left overflow-hidden"
          >
            {/* Top Accent Gradient Bar */}
            <div className="h-1 w-full bg-gradient-to-r from-emerald-600 via-accent-bright to-emerald-500 rounded-t-2xl flex-shrink-0" />

            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-start justify-between gap-3 flex-shrink-0 bg-[#16161b]">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-accent-bright font-semibold mb-1 px-2 py-0.5 rounded-full bg-accent-bright/10 border border-accent-bright/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-bright animate-pulse" />
                  Feedback & Support
                </div>
                <h2
                  id="enquiry-modal-title"
                  className="font-display text-2xl tracking-wide text-white leading-none"
                >
                  WEBSITE <span className="text-accent-bright">ENQUIRY</span>
                </h2>
                <p className="mt-1 text-xs text-muted leading-relaxed">
                  Found a bug or have a question about this website? Let us know.
                </p>
              </div>

              <button
                type="button"
                onClick={handleClose}
                aria-label="Close enquiry modal"
                className="text-muted hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-1 focus:ring-accent-bright cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Body (Scrollable) */}
            <div className="p-4 sm:p-5 overflow-y-auto flex-1">
              {status === "success" ? (
                /* Success State */
                <div className="py-6 px-2 flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-accent-bright/15 border border-accent-bright/30 text-accent-bright flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 className="font-display text-xl text-white tracking-wide">
                    ENQUIRY SUBMITTED
                  </h3>
                  <p className="mt-2 text-xs text-muted leading-relaxed max-w-[280px]">
                    Thank you! Your feedback has been sent directly to the site
                    maintainer. We appreciate you helping us improve Way to Doomsday.
                  </p>
                  <div className="mt-6 flex flex-col sm:flex-row gap-2.5 w-full">
                    <button
                      type="button"
                      onClick={handleResetForNewEnquiry}
                      className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl border border-white/15 bg-white/5 text-white hover:bg-white/10 hover:border-white/25 transition-colors focus:outline-none focus:ring-1 focus:ring-accent-bright cursor-pointer"
                    >
                      Send Another Note
                    </button>
                    <button
                      type="button"
                      onClick={handleClose}
                      className="flex-1 py-2 px-3 text-xs font-bold rounded-xl bg-accent-bright text-black hover:bg-emerald-400 transition-colors focus:outline-none focus:ring-1 focus:ring-accent-bright cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                /* Enquiry Form */
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  {/* Error Notification Banner */}
                  {status === "error" && errorMessage && (
                    <div
                      role="alert"
                      className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs leading-relaxed flex items-start gap-2.5"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-red-400 flex-shrink-0 mt-0.5"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      <div className="flex-1">
                        <span className="font-semibold block text-red-300">
                          Submission Failed
                        </span>
                        <span>{errorMessage}</span>
                      </div>
                    </div>
                  )}

                  {/* Enquiry Type Field */}
                  <div>
                    <label
                      htmlFor="enquiry-type-select"
                      className="block text-xs font-semibold text-text uppercase tracking-wider mb-1.5"
                    >
                      Enquiry Type
                    </label>
                    <div className="relative">
                      <select
                        id="enquiry-type-select"
                        value={enquiryType}
                        disabled={status === "submitting"}
                        onChange={(e) => setEnquiryType(e.target.value)}
                        className="w-full appearance-none rounded-xl bg-black/70 border border-white/15 px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-accent-bright focus:ring-1 focus:ring-accent-bright transition-colors cursor-pointer disabled:opacity-50 pr-9"
                      >
                        {ENQUIRY_TYPES.map((type) => (
                          <option
                            key={type}
                            value={type}
                            className="bg-[#131317] text-white"
                          >
                            {type}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Message Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="enquiry-message-input"
                        className="block text-xs font-semibold text-text uppercase tracking-wider"
                      >
                        Website Problem / Enquiry{" "}
                        <span className="text-accent-bright">*</span>
                      </label>
                      <span className="text-[10px] text-muted font-mono">
                        No login required
                      </span>
                    </div>
                    <textarea
                      id="enquiry-message-input"
                      ref={textareaRef}
                      rows={4}
                      value={message}
                      disabled={status === "submitting"}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        if (validationError && e.target.value.trim()) {
                          setValidationError("");
                        }
                      }}
                      placeholder="Describe the issue or question..."
                      className={`w-full rounded-xl bg-black/70 border px-3 py-2.5 text-xs sm:text-sm text-white placeholder:text-muted/60 focus:outline-none focus:ring-1 transition-colors resize-none disabled:opacity-50 ${
                        validationError
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-white/15 focus:border-accent-bright focus:ring-accent-bright"
                      }`}
                    />
                    {validationError && (
                      <p className="mt-1.5 text-[11px] text-red-400 flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="12" />
                          <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        {validationError}
                      </p>
                    )}
                  </div>

                  {/* Privacy reassurance note */}
                  <div className="flex items-center gap-1.5 text-[10px] text-muted/70 px-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-accent-bright flex-shrink-0"
                    >
                      <rect
                        width="18"
                        height="11"
                        x="3"
                        y="11"
                        rx="2"
                        ry="2"
                      />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <span>Anonymous enquiry. No name or email collected.</span>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="w-full py-2.5 px-4 rounded-xl bg-accent-bright hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent-bright focus:ring-offset-2 focus:ring-offset-black cursor-pointer shadow-lg shadow-black/40"
                    >
                      {status === "submitting" ? (
                        <>
                          <svg
                            className="animate-spin h-3.5 w-3.5 text-black"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Enquiry</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="22" y1="2" x2="11" y2="13" />
                            <polygon points="22 2 15 22 11 13 2 9 22 2" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
