import { useState, useRef, useEffect } from "react";
import { useChildName } from "@/contexts/ChildNameContext";

export function WelcomePrompt() {
  const { childName, setChildName, promptOpen, closePrompt } = useChildName();
  const [inputValue, setInputValue] = useState(childName || "");
  const [confirmed, setConfirmed] = useState(false);
  const [visible, setVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (promptOpen) {
      const t = setTimeout(() => setVisible(true), 30);
      return () => clearTimeout(t);
    } else {
      setVisible(false);
    }
  }, [promptOpen]);

  useEffect(() => {
    if (visible && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [visible]);

  if (!promptOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setChildName(inputValue.trim());
    setConfirmed(true);
    setTimeout(() => {
      setVisible(false);
      setTimeout(closePrompt, 350);
    }, 1400);
  };

  const handleSkip = () => {
    setVisible(false);
    setTimeout(closePrompt, 350);
  };

  const name = inputValue.trim()
    ? inputValue.trim().charAt(0).toUpperCase() + inputValue.trim().slice(1).toLowerCase()
    : "";

  return (
    <>
      {/* Backdrop — very subtle, click to skip */}
      <div
        className="fixed inset-0 z-40 pointer-events-auto"
        style={{ background: "transparent" }}
        onClick={handleSkip}
      />

      {/* Prompt card */}
      <div
        className="fixed z-50 pointer-events-auto"
        style={{
          bottom: "1.5rem",
          right: "1.5rem",
          left: "auto",
          width: "min(380px, calc(100vw - 2rem))",
          transition: "opacity 0.35s ease, transform 0.35s cubic-bezier(0.16,1,0.3,1)",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
        }}
      >
        <div
          className="rounded-3xl overflow-hidden shadow-2xl"
          style={{
            background: "#fef9f0",
            border: "1.5px solid rgba(251,191,36,0.30)",
            boxShadow: "0 24px 64px rgba(180,100,0,0.15), 0 4px 16px rgba(0,0,0,0.10)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {confirmed ? (
            /* Confirmation state */
            <div className="px-7 py-8 text-center">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4"
                style={{ background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.30)" }}
              >
                <i className="ri-sparkles-fill" style={{ color: "#f97316" }}></i>
              </div>
              <p className="text-base font-black mb-1" style={{ color: "#1a0800" }}>
                Welcome, {name}!
              </p>
              <p className="text-sm" style={{ color: "rgba(26,8,0,0.50)" }}>
                We'll personalise everything for {name} as you explore.
              </p>
            </div>
          ) : (
            /* Input state */
            <>
              <div className="px-7 pt-7 pb-5">
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, rgba(251,191,36,0.20), rgba(249,115,22,0.15))", border: "1px solid rgba(251,191,36,0.30)" }}
                    >
                      <i className="ri-book-open-fill" style={{ color: "#f97316", fontSize: 18 }}></i>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.12em]" style={{ color: "#f97316" }}>
                        Me Time Stories
                      </p>
                      <p className="text-[13px]" style={{ color: "rgba(26,8,0,0.45)" }}>
                        Let's make it personal
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleSkip}
                    className="w-7 h-7 flex items-center justify-center rounded-full transition-colors hover:bg-black/06 text-[#1a0800]/30 hover:text-[#1a0800]/60 flex-shrink-0"
                    aria-label="Skip"
                  >
                    <i className="ri-close-line text-sm"></i>
                  </button>
                </div>

                <p className="text-lg font-black leading-snug mb-5" style={{ color: "#1a0800" }}>
                  What's your little one<br />called?
                </p>

                <form onSubmit={handleSubmit}>
                  <div className="relative mb-4">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="e.g. Mia, Ty, Zara…"
                      maxLength={20}
                      className="w-full px-4 py-3.5 rounded-2xl text-base font-semibold outline-none transition-all"
                      style={{
                        background: "rgba(255,255,255,0.80)",
                        border: "1.5px solid rgba(251,191,36,0.35)",
                        color: "#1a0800",
                        caretColor: "#f97316",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "rgba(249,115,22,0.60)")}
                      onBlur={(e) => (e.target.style.borderColor = "rgba(251,191,36,0.35)")}
                    />
                    {name && (
                      <span
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(249,115,22,0.12)", color: "#f97316" }}
                      >
                        {name}
                      </span>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="w-full py-3.5 rounded-2xl font-bold text-base transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                    style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#1a0800" }}
                  >
                    {name ? `Personalise for ${name} →` : "Let's start →"}
                  </button>
                </form>
              </div>

              <div
                className="px-7 py-3 flex items-center justify-between"
                style={{ borderTop: "1px solid rgba(251,191,36,0.15)" }}
              >
                <p className="text-[11px]" style={{ color: "rgba(26,8,0,0.35)" }}>
                  <i className="ri-lock-line mr-1"></i>Stays on your device only
                </p>
                <button
                  onClick={handleSkip}
                  className="text-[11px] font-medium transition-colors hover:opacity-80"
                  style={{ color: "rgba(26,8,0,0.40)" }}
                >
                  Skip for now
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
