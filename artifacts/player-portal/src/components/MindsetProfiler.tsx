import { useState, useEffect } from "react";
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
// Score: strongly A = -2, slightly A = -1, both = 0, slightly B = +1, strongly B = +2

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

// How many questions map to each dimension (for normalisation)
const DIM_MAX: DimensionMax = {
  ambition: 6,    // Q1, Q6, Q11 → 3 × 2
  leadership: 2,  // Q2
  resilience: 8,  // Q3, Q7, Q10, Q12
  style: 2,       // Q4
  team: 4,        // Q5, Q8
  learning: 2,    // Q9
};

// Result display config
const DIMENSIONS: {
  key: DimensionKey; aLabel: string; bLabel: string; emoji: string; color: string;
}[] = [
  { key: "ambition",   aLabel: "Big Ambition",       bLabel: "Love of the Game",      emoji: "🏆", color: "#f59e0b" },
  { key: "leadership", aLabel: "Vocal Leader",        bLabel: "Lead by Example",       emoji: "📣", color: "#3b82f6" },
  { key: "resilience", aLabel: "Bounce Back Fast",    bLabel: "Reflect & Reset",       emoji: "💪", color: "#ef4444" },
  { key: "style",      aLabel: "Structured",          bLabel: "Creative Freedom",      emoji: "🎨", color: "#8b5cf6" },
  { key: "team",       aLabel: "Team First",          bLabel: "Own Expression",        emoji: "🤝", color: "#10b981" },
  { key: "learning",   aLabel: "Coach-Led",           bLabel: "Self-Discovery",        emoji: "📚", color: "#f97316" },
];

// 5-point choice options — value: -2 → strongly A, +2 → strongly B
const CHOICE_OPTS = [
  { value: -2, aLabel: "YES!", bLabel: "" },
  { value: -1, aLabel: "KIND OF", bLabel: "" },
  { value:  0, aLabel: "BOTH!", bLabel: "BOTH!" },
  { value:  1, aLabel: "", bLabel: "KIND OF" },
  { value:  2, aLabel: "", bLabel: "YES!" },
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

  const handleChoice = (value: number) => {
    if (advancing) return;
    setSelected(value);
    setAdvancing(true);

    // Update score
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
    }, 650);
  };

  // ── Intro screen ────────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6 text-center">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 30%, ${primaryColor}25 0%, transparent 65%)` }} />
        </div>
        <div className="relative z-10 max-w-sm mx-auto w-full">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 180 }}
            className="text-7xl mb-6"
          >🧬</motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: primaryColor }}>Quick Quiz First</p>
            <h1 className="text-4xl font-display font-black text-white uppercase leading-tight mb-4">
              What Kind of Player<br />
              <span style={{ color: primaryColor }}>Are You?</span>
            </h1>
            <p className="text-white/55 text-base leading-relaxed mb-2">
              12 quick questions. No right or wrong answers.
            </p>
            <p className="text-white/35 text-sm leading-relaxed mb-8">
              Just pick the one that feels most like <strong className="text-white/60">{firstName}</strong>!
            </p>
          </motion.div>

          {/* How it works */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="rounded-2xl p-4 mb-8 space-y-3"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            {[
              { emoji: "👀", text: "You'll see two statements" },
              { emoji: "👆", text: "Tap the one that's more like you" },
              { emoji: "🧬", text: "Unlock your Player DNA!" },
            ].map((tip, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xl shrink-0">{tip.emoji}</span>
                <span className="text-white/60 text-sm font-semibold">{tip.text}</span>
              </div>
            ))}
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setPhase("questions")}
            className="w-full py-4 rounded-2xl font-black text-lg uppercase tracking-widest font-display"
            style={{ background: primaryColor, color: "#fff", boxShadow: `0 8px 32px ${primaryColor}55` }}
          >
            Let's Go! 🚀
          </motion.button>
        </div>
      </div>
    );
  }

  // ── Results screen ──────────────────────────────────────────────────────────
  if (phase === "results") {
    const resultText = buildResultText(scores);

    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col overflow-y-auto pb-32">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.2) 0%, transparent 60%)" }} />
        </div>

        <div className="relative z-10 max-w-sm mx-auto w-full px-5 pt-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 180 }}
            className="text-center mb-8"
          >
            <div className="text-6xl mb-3">🧬</div>
            <p className="text-xs font-black uppercase tracking-widest text-purple-400 mb-2">Your Player DNA</p>
            <h1 className="text-3xl font-display font-black text-white uppercase leading-tight">
              {firstName}'s<br />Football Personality
            </h1>
          </motion.div>

          {/* Spectrum bars */}
          <div className="space-y-5 mb-8">
            {DIMENSIONS.map((dim, i) => {
              const max = DIM_MAX[dim.key];
              const raw = scores[dim.key];
              const pct = Math.round(((raw + max) / (2 * max)) * 100);

              return (
                <motion.div
                  key={dim.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.2 }}
                  className="space-y-2"
                >
                  {/* Labels row */}
                  <div className="flex items-center justify-between">
                    <span className="text-white/50 text-[10px] font-bold uppercase tracking-wide">{dim.aLabel}</span>
                    <span className="text-base">{dim.emoji}</span>
                    <span className="text-white/50 text-[10px] font-bold uppercase tracking-wide">{dim.bLabel}</span>
                  </div>

                  {/* Track */}
                  <div className="relative h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                    {/* Gradient fill */}
                    <div className="absolute inset-0 rounded-full" style={{
                      background: `linear-gradient(to right, ${dim.color}60, ${dim.color})`,
                    }} />
                    {/* Mask from right to hide bar toward B */}
                    {/* Actually let's show a pointer */}
                  </div>

                  {/* Better: animated dot on track */}
                  <div className="relative h-3 -mt-5">
                    <div className="absolute inset-0 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
                    <motion.div
                      className="absolute top-0 h-3 rounded-full"
                      style={{ background: `linear-gradient(to right, ${dim.color}80, ${dim.color})`, left: 0 }}
                      initial={{ width: "50%" }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: i * 0.1 + 0.4, duration: 0.8, ease: "easeOut" }}
                    />
                    <motion.div
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-lg"
                      style={{ background: dim.color, borderColor: "white" }}
                      initial={{ left: "50%" }}
                      animate={{ left: `calc(${pct}% - 8px)` }}
                      transition={{ delay: i * 0.1 + 0.4, duration: 0.8, ease: "easeOut" }}
                    />
                  </div>

                  {/* Where they sit */}
                  <p className="text-center text-xs font-semibold" style={{ color: dim.color }}>
                    {describeScore(pct, dim.aLabel, dim.bLabel)}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-white/30 text-xs text-center mb-6 leading-relaxed"
          >
            These insights help us write a story that's totally unique to {firstName} — no one else will have one like it.
          </motion.p>
        </div>

        {/* CTA */}
        <div className="fixed bottom-0 left-0 right-0 z-30 px-5 pb-8 pt-3"
          style={{ background: "linear-gradient(to top, #0a0a0a 70%, transparent)" }}>
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onComplete(resultText)}
            className="w-full py-4 rounded-2xl font-black text-lg uppercase tracking-widest font-display max-w-sm mx-auto block"
            style={{ background: primaryColor, color: "#fff", boxShadow: `0 8px 32px ${primaryColor}55` }}
          >
            Start My Story! 📖
          </motion.button>
        </div>
      </div>
    );
  }

  // ── Question screen ──────────────────────────────────────────────────────────
  const aColor = "#f59e0b";
  const bColor = primaryColor;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 0%, ${primaryColor}15 0%, transparent 55%)` }} />
      </div>

      {/* Header */}
      <div className="relative z-10 px-5 pt-5 pb-3">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white/35 text-xs font-bold uppercase tracking-widest">Player DNA</span>
          <span className="font-black text-white/40 text-sm font-mono">{qIdx + 1}<span className="text-white/20"> / {total}</span></span>
        </div>
        {/* Progress bar */}
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: primaryColor }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-5 gap-4 pb-6">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={qIdx}
            custom={dir}
            initial={{ opacity: 0, x: dir * 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -50 }}
            transition={{ duration: 0.22 }}
            className="flex flex-col gap-4"
          >
            {/* Emoji + label */}
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.05, type: "spring", stiffness: 220 }}
                className="text-6xl mb-3"
              >{q.emoji}</motion.div>
              <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Which one is more YOU?</p>
            </div>

            {/* Option A card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="rounded-2xl px-5 py-4 text-center"
              style={{
                background: selected !== null && selected < 0 ? `${aColor}25` : "rgba(255,255,255,0.05)",
                border: selected !== null && selected < 0 ? `1.5px solid ${aColor}70` : "1.5px solid rgba(255,255,255,0.08)",
                transition: "all 0.25s",
              }}
            >
              <p className="text-white font-bold text-lg leading-snug">{q.a}</p>
              {selected !== null && selected < 0 && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-black mt-1" style={{ color: aColor }}>
                  {selected === -2 ? "Definitely you! ✓" : "Kind of you ✓"}
                </motion.p>
              )}
            </motion.div>

            {/* 5-choice strip */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.12 }}
              className="space-y-2"
            >
              <div className="flex gap-1.5">
                {CHOICE_OPTS.map((opt, i) => {
                  const isA = opt.value < 0;
                  const isB = opt.value > 0;
                  const isMid = opt.value === 0;
                  const isSelected = selected === opt.value;
                  const dimmed = selected !== null && !isSelected;

                  const baseColor = isA ? aColor : isB ? bColor : "rgba(255,255,255,0.5)";

                  return (
                    <motion.button
                      key={i}
                      type="button"
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleChoice(opt.value)}
                      disabled={advancing}
                      className="flex-1 rounded-xl py-3 flex flex-col items-center gap-1 transition-all"
                      style={{
                        background: isSelected
                          ? isA ? aColor : isB ? bColor : "rgba(255,255,255,0.3)"
                          : dimmed
                          ? "rgba(255,255,255,0.02)"
                          : isA ? `${aColor}18` : isB ? `${bColor}18` : "rgba(255,255,255,0.06)",
                        border: `1.5px solid ${isSelected ? "transparent" : dimmed ? "rgba(255,255,255,0.04)" : isA ? `${aColor}40` : isB ? `${bColor}40` : "rgba(255,255,255,0.15)"}`,
                        opacity: dimmed ? 0.35 : 1,
                      }}
                    >
                      <span className="text-xs font-black uppercase tracking-wide leading-none"
                        style={{ color: isSelected ? "#fff" : dimmed ? "rgba(255,255,255,0.3)" : baseColor }}>
                        {isMid ? "BOTH" : isA ? (opt.value === -2 ? "YES!" : "KIND\nOF") : (opt.value === 2 ? "YES!" : "KIND\nOF")}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {/* A ←→ B axis labels */}
              <div className="flex justify-between px-1">
                <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: `${aColor}80` }}>← OPTION A</span>
                <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: `${bColor}80` }}>OPTION B →</span>
              </div>
            </motion.div>

            {/* Option B card */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="rounded-2xl px-5 py-4 text-center"
              style={{
                background: selected !== null && selected > 0 ? `${bColor}20` : "rgba(255,255,255,0.05)",
                border: selected !== null && selected > 0 ? `1.5px solid ${bColor}60` : "1.5px solid rgba(255,255,255,0.08)",
                transition: "all 0.25s",
              }}
            >
              <p className="text-white font-bold text-lg leading-snug">{q.b}</p>
              {selected !== null && selected > 0 && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-black mt-1" style={{ color: bColor }}>
                  {selected === 2 ? "Definitely you! ✓" : "Kind of you ✓"}
                </motion.p>
              )}
            </motion.div>

            {/* Skip hint */}
            {selected === null && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center text-white/20 text-[10px]"
              >
                Tap YES! / KIND OF / BOTH — no wrong answers
              </motion.p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
