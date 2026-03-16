import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ProfilerQuestion {
  emoji: string;
  a: string;
  b: string;
  dimension: keyof DimensionScores;
}

type DimensionKey = "ambition" | "leadership" | "resilience" | "style" | "team" | "learning";
type DimensionScores = Record<DimensionKey, number>;
type DimensionMax = Record<DimensionKey, number>;

// ── Questions ──────────────────────────────────────────────────────────────────

const QUESTIONS: ProfilerQuestion[] = [
  { emoji: "🏆", a: "I want to be the best player I can be", b: "I want football to always stay fun", dimension: "ambition" },
  { emoji: "📣", a: "I like to speak up and lead the team", b: "I like to lead quietly by working hard", dimension: "leadership" },
  { emoji: "💪", a: "After a bad game, I fix it straight away", b: "After a bad game, I need to rest and reset", dimension: "resilience" },
  { emoji: "🎨", a: "I love having a clear plan to follow", b: "I love having freedom to play my own way", dimension: "style" },
  { emoji: "⭐", a: "I love when my coach tells me I did well", b: "I'm happy helping my team even if nobody notices", dimension: "team" },
  { emoji: "🔥", a: "Tough challenges excite me — bring it on!", b: "I play best when I feel comfortable and settled", dimension: "ambition" },
  { emoji: "⚡", a: "After a mistake, I push myself even harder", b: "After a mistake, I take a breath and calm down", dimension: "resilience" },
  { emoji: "🤝", a: "I'd rather do what's best for the team", b: "I'd rather show everyone what I can do", dimension: "team" },
  { emoji: "📚", a: "I learn best when a coach shows me what to do", b: "I learn best by trying and figuring it out myself", dimension: "learning" },
  { emoji: "🎯", a: "When the game's close, I want the ball", b: "When the game's close, I keep things simple", dimension: "resilience" },
  { emoji: "🚀", a: "Big goals and dreams keep me going", b: "Getting better every single day keeps me going", dimension: "ambition" },
  { emoji: "💡", a: "When I struggle, I want to prove everyone wrong", b: "When I struggle, I want to understand what to work on", dimension: "resilience" },
];

const DIM_MAX: DimensionMax = {
  ambition: 6, leadership: 2, resilience: 8, style: 2, team: 4, learning: 2,
};

const DIMENSIONS: { key: DimensionKey; aLabel: string; bLabel: string; emoji: string; color: string }[] = [
  { key: "ambition",   aLabel: "Big Ambition",    bLabel: "Love of the Game",  emoji: "🏆", color: "#f59e0b" },
  { key: "leadership", aLabel: "Vocal Leader",     bLabel: "Lead by Example",   emoji: "📣", color: "#3b82f6" },
  { key: "resilience", aLabel: "Bounce Back Fast", bLabel: "Reflect & Reset",   emoji: "💪", color: "#ef4444" },
  { key: "style",      aLabel: "Structured",       bLabel: "Creative Freedom",  emoji: "🎨", color: "#8b5cf6" },
  { key: "team",       aLabel: "Team First",       bLabel: "Own Expression",    emoji: "🤝", color: "#10b981" },
  { key: "learning",   aLabel: "Coach-Led",        bLabel: "Self-Discovery",    emoji: "📚", color: "#f97316" },
];

function describeScore(pct: number, aLabel: string, bLabel: string): string {
  if (pct < 20) return `Strongly ${aLabel}`;
  if (pct < 40) return `Leans ${aLabel}`;
  if (pct < 60) return `Balanced`;
  if (pct < 80) return `Leans ${bLabel}`;
  return `Strongly ${bLabel}`;
}

function buildResultText(scores: DimensionScores): string {
  const lines = ["=== PLAYER MINDSET DNA ==="];
  for (const d of DIMENSIONS) {
    const max = DIM_MAX[d.key];
    const raw = scores[d.key];
    const pct = Math.round(((raw + max) / (2 * max)) * 100);
    lines.push(`${d.aLabel} ←→ ${d.bLabel}: ${describeScore(pct, d.aLabel, d.bLabel)} (${pct}%)`);
  }
  lines.push("==========================");
  return lines.join("\n");
}

// ── Spectrum segments config ──────────────────────────────────────────────────

const SEGMENTS = [
  { value: -2, line1: "Very", line2: "much A", side: "a" as const },
  { value: -1, line1: "A bit",  line2: "more A",  side: "a" as const },
  { value:  0, line1: "Both",   line2: "feel true", side: "mid" as const },
  { value:  1, line1: "A bit",  line2: "more B",  side: "b" as const },
  { value:  2, line1: "Very", line2: "much B", side: "b" as const },
];

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  primaryColor: string;
  playerName: string;
  onComplete: (resultText: string) => void;
}

export function MindsetProfiler({ primaryColor, playerName, onComplete }: Props) {
  const firstName = playerName.split(" ")[0];
  const [phase, setPhase] = useState<"intro" | "questions" | "results">("intro");
  const [qIdx, setQIdx] = useState(0);
  const [scores, setScores] = useState<DimensionScores>({ ambition: 0, leadership: 0, resilience: 0, style: 0, team: 0, learning: 0 });
  const [selected, setSelected] = useState<number | null>(null);
  const [advancing, setAdvancing] = useState(false);
  const [dir, setDir] = useState(1);

  const q = QUESTIONS[qIdx];
  const total = QUESTIONS.length;
  const progressPct = (qIdx / total) * 100;

  // Accent colours
  const GOLD = "#d4a017";
  const CLUB = primaryColor;

  const handleChoice = (value: number) => {
    if (advancing) return;
    setSelected(value);
    setAdvancing(true);
    setScores(prev => ({ ...prev, [q.dimension]: prev[q.dimension] + value }));
    setTimeout(() => {
      if (qIdx < total - 1) {
        setDir(1);
        setQIdx(i => i + 1);
        setSelected(null);
        setAdvancing(false);
      } else {
        setPhase("results");
        setAdvancing(false);
      }
    }, 600);
  };

  // ── Intro ─────────────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6 text-center">
        <div className="fixed inset-0 z-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 80% 60% at 50% 30%, ${GOLD}18 0%, transparent 65%)` }} />

        <div className="relative z-10 max-w-xs mx-auto w-full">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 180 }}
            className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center text-4xl"
            style={{ background: `${GOLD}18`, border: `1px solid ${GOLD}30`, boxShadow: `0 0 40px ${GOLD}25` }}
          >🧬</motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4" style={{ color: GOLD }}>Player DNA</p>
            <h1 className="text-3xl font-display font-black text-white uppercase leading-tight mb-3">
              What Kind of<br />
              <span style={{ color: GOLD }}>Player Are You?</span>
            </h1>
            <p className="text-white/45 text-sm leading-relaxed mb-6">
              12 quick questions. No right or wrong answers — just pick what feels most like{" "}
              <span className="text-white/70 font-semibold">{firstName}</span>.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="rounded-2xl p-4 mb-7 space-y-3"
            style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            {[
              { icon: "👀", text: "Two statements appear" },
              { icon: "👆", text: "Pick the one that's more you" },
              { icon: "🧬", text: "Unlock your Player DNA" },
            ].map((tip, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-lg shrink-0">{tip.icon}</span>
                <span className="text-white/55 text-sm font-medium">{tip.text}</span>
              </div>
            ))}
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setPhase("questions")}
            className="w-full py-4 rounded-2xl font-display font-black text-sm uppercase tracking-widest"
            style={{ background: GOLD, color: "#000", boxShadow: `0 8px 32px ${GOLD}45` }}
          >
            Let's Go →
          </motion.button>
        </div>
      </div>
    );
  }

  // ── Results ───────────────────────────────────────────────────────────────
  if (phase === "results") {
    const resultText = buildResultText(scores);
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col overflow-y-auto pb-32">
        <div className="fixed inset-0 z-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(212,160,23,0.15) 0%, transparent 60%)" }} />

        <div className="relative z-10 max-w-sm mx-auto w-full px-5 pt-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 160 }}
            className="text-center mb-8"
          >
            <div className="w-20 h-20 rounded-3xl mx-auto mb-4 flex items-center justify-center text-4xl"
              style={{ background: `${GOLD}18`, border: `1px solid ${GOLD}30`, boxShadow: `0 0 40px ${GOLD}20` }}>
              🧬
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2" style={{ color: GOLD }}>Your Player DNA</p>
            <h1 className="text-2xl font-display font-black text-white uppercase leading-tight">
              {firstName}'s Football Personality
            </h1>
          </motion.div>

          <div className="space-y-5 mb-8">
            {DIMENSIONS.map((dim, i) => {
              const max = DIM_MAX[dim.key];
              const raw = scores[dim.key];
              const pct = Math.round(((raw + max) / (2 * max)) * 100);
              return (
                <motion.div key={dim.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.09 + 0.2 }} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white/40 text-[10px] font-bold uppercase tracking-wide">{dim.aLabel}</span>
                    <span className="text-sm">{dim.emoji}</span>
                    <span className="text-white/40 text-[10px] font-bold uppercase tracking-wide">{dim.bLabel}</span>
                  </div>
                  <div className="relative h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.07)" }}>
                    <motion.div className="absolute top-0 left-0 h-full rounded-full"
                      style={{ background: `linear-gradient(to right, ${dim.color}70, ${dim.color})` }}
                      initial={{ width: "50%" }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: i * 0.09 + 0.4, duration: 0.9, ease: "easeOut" }}
                    />
                    <motion.div
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-[#0a0a0a] shadow-lg"
                      style={{ background: dim.color }}
                      initial={{ left: "50%" }}
                      animate={{ left: `calc(${pct}% - 8px)` }}
                      transition={{ delay: i * 0.09 + 0.4, duration: 0.9, ease: "easeOut" }}
                    />
                  </div>
                  <p className="text-center text-[10px] font-bold uppercase tracking-wide" style={{ color: dim.color }}>
                    {describeScore(pct, dim.aLabel, dim.bLabel)}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
            className="text-white/25 text-xs text-center mb-6 leading-relaxed">
            These insights shape a story that's completely unique to {firstName}.
          </motion.p>
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-30 px-5 pb-8 pt-3"
          style={{ background: "linear-gradient(to top, #0a0a0a 70%, transparent)" }}>
          <motion.button
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onComplete(resultText)}
            className="w-full py-4 rounded-2xl font-display font-black text-sm uppercase tracking-widest max-w-sm mx-auto block"
            style={{ background: GOLD, color: "#000", boxShadow: `0 8px 32px ${GOLD}45` }}
          >
            Start My Story →
          </motion.button>
        </div>
      </div>
    );
  }

  // ── Questions ─────────────────────────────────────────────────────────────

  const aActive = selected !== null && selected < 0;
  const bActive = selected !== null && selected > 0;
  const midActive = selected === 0;

  const segmentColor = (side: "a" | "b" | "mid", value: number) => {
    if (side === "a") return GOLD;
    if (side === "b") return CLUB;
    return "rgba(255,255,255,0.85)";
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Ambient glow — shifts based on selection */}
      <div className="fixed inset-0 z-0 pointer-events-none transition-all duration-700"
        style={{
          background: aActive
            ? `radial-gradient(ellipse 90% 60% at 20% 100%, ${GOLD}14 0%, transparent 65%)`
            : bActive
            ? `radial-gradient(ellipse 90% 60% at 80% 100%, ${CLUB}14 0%, transparent 65%)`
            : `radial-gradient(ellipse 70% 50% at 50% 100%, rgba(255,255,255,0.05) 0%, transparent 65%)`,
        }}
      />

      {/* Header */}
      <div className="relative z-10 px-5 pt-5 pb-4">
        <div className="flex items-center justify-between mb-3 max-w-sm mx-auto">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">Player DNA</p>
          <p className="text-xs font-mono font-bold" style={{ color: GOLD }}>
            {qIdx + 1}<span className="text-white/20 font-normal"> / {total}</span>
          </p>
        </div>
        {/* Progress bar */}
        <div className="max-w-sm mx-auto">
          <div className="h-[3px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(to right, ${GOLD}, ${GOLD}cc)` }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
            />
          </div>
        </div>
      </div>

      {/* Question body */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-5 pb-6">
        <div className="max-w-sm mx-auto w-full">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={qIdx}
              custom={dir}
              initial={{ opacity: 0, x: dir * 36 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -36 }}
              transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex flex-col gap-4"
            >
              {/* Central statement card */}
              <div
                className="rounded-3xl overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
                }}
              >
                {/* Statement A */}
                <motion.div
                  className="px-5 pt-5 pb-4 transition-all duration-300"
                  style={{
                    background: aActive ? `${GOLD}10` : "transparent",
                    borderLeft: aActive ? `3px solid ${GOLD}` : "3px solid transparent",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md shrink-0 mt-0.5 font-display"
                      style={{ background: `${GOLD}22`, color: GOLD, border: `1px solid ${GOLD}35` }}
                    >A</span>
                    <p
                      className="font-semibold leading-snug transition-colors duration-300"
                      style={{
                        color: aActive ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.7)",
                        fontSize: "15px",
                      }}
                    >{q.a}</p>
                  </div>
                </motion.div>

                {/* Divider */}
                <div className="flex items-center px-5 py-2 gap-3">
                  <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">or</span>
                  <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                </div>

                {/* Statement B */}
                <motion.div
                  className="px-5 pt-3 pb-5 transition-all duration-300"
                  style={{
                    background: bActive ? `${CLUB}0e` : "transparent",
                    borderLeft: bActive ? `3px solid ${CLUB}` : "3px solid transparent",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md shrink-0 mt-0.5 font-display"
                      style={{ background: `${CLUB}22`, color: CLUB, border: `1px solid ${CLUB}35` }}
                    >B</span>
                    <p
                      className="font-semibold leading-snug transition-colors duration-300"
                      style={{
                        color: bActive ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.7)",
                        fontSize: "15px",
                      }}
                    >{q.b}</p>
                  </div>
                </motion.div>
              </div>

              {/* Helper label */}
              <p className="text-center text-[10px] font-bold uppercase tracking-[0.15em] text-white/25">
                ← Which is more like you? →
              </p>

              {/* Unified spectrum selector */}
              <div
                className="flex rounded-2xl overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {SEGMENTS.map((seg, i) => {
                  const isSelected = selected === seg.value;
                  const isDimmed = selected !== null && !isSelected;
                  const color = segmentColor(seg.side, seg.value);
                  const isFirst = i === 0;
                  const isLast = i === SEGMENTS.length - 1;
                  const isMid = seg.side === "mid";

                  return (
                    <motion.button
                      key={seg.value}
                      type="button"
                      onClick={() => handleChoice(seg.value)}
                      disabled={advancing}
                      whileHover={!advancing ? { scale: 1.03 } : {}}
                      whileTap={{ scale: 0.94 }}
                      className="flex-1 flex flex-col items-center justify-center py-3.5 gap-0.5 relative transition-colors duration-200 disabled:cursor-default"
                      style={{
                        background: isSelected
                          ? isMid
                            ? "rgba(255,255,255,0.18)"
                            : `${color}35`
                          : isDimmed
                          ? "transparent"
                          : "transparent",
                        borderRight: i < SEGMENTS.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                        boxShadow: isSelected && !isMid ? `inset 0 0 20px ${color}25` : "none",
                      }}
                    >
                      {/* Active indicator dot at top */}
                      {isSelected && (
                        <motion.div
                          layoutId="seg-indicator"
                          className="absolute top-0 left-0 right-0 h-[2px] rounded-b-full"
                          style={{ background: isMid ? "rgba(255,255,255,0.7)" : color }}
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}

                      <span
                        className="text-[9px] font-black uppercase leading-tight text-center transition-colors duration-200 font-display"
                        style={{
                          color: isSelected
                            ? isMid ? "rgba(255,255,255,0.95)" : color
                            : isDimmed
                            ? "rgba(255,255,255,0.15)"
                            : isMid
                            ? "rgba(255,255,255,0.45)"
                            : `${color}99`,
                          letterSpacing: "0.04em",
                        }}
                      >
                        {seg.line1}
                      </span>
                      <span
                        className="text-[9px] font-bold leading-tight text-center transition-colors duration-200"
                        style={{
                          color: isSelected
                            ? isMid ? "rgba(255,255,255,0.9)" : color
                            : isDimmed
                            ? "rgba(255,255,255,0.12)"
                            : isMid
                            ? "rgba(255,255,255,0.35)"
                            : `${color}80`,
                          letterSpacing: "0.02em",
                        }}
                      >
                        {seg.line2}
                      </span>

                      {/* Selected checkmark */}
                      {isSelected && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-[10px] mt-0.5"
                          style={{ color: isMid ? "rgba(255,255,255,0.8)" : color }}
                        >✓</motion.span>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Directional hint labels under the spectrum */}
              <div className="flex justify-between px-1">
                <span className="text-[9px] font-bold uppercase tracking-wide" style={{ color: `${GOLD}60` }}>
                  Strongly A
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wide" style={{ color: `${CLUB}60` }}>
                  Strongly B
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
