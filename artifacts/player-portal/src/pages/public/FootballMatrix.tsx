import { useState } from "react";
import { Link } from "wouter";
import { PublicLayout } from "@/layouts/PublicLayout";

type Section = "pitch" | "dashboard" | "training" | "academy";

interface Position {
  id: string;
  label: string;
  x: number;
  y: number;
  challenges: string;
  lessons: string[];
  advice: string;
  deliverables: string[];
}

const positions: Position[] = [
  { id: "gk",  label: "Goalkeeper",   x: 50, y: 90,
    challenges: "Isolation, last line of defence pressure, decision-making under extreme stress.",
    lessons: ["Trust your instincts and your training", "Leadership from the back — your voice matters", "Mistakes are data, not defeats"],
    advice: "The best goalkeepers have the shortest memory. Let it go, reset, and be ready for the next moment.",
    deliverables: ["Isolation & courage story", "Decision-making under pressure", "Leadership voice narrative"] },
  { id: "cb",  label: "Centre Back",  x: 35, y: 76,
    challenges: "Leadership responsibility, communication under pressure, managing physical confrontation.",
    lessons: ["Command your area with confidence", "Calmness is a superpower at the back", "Read the game before it happens"],
    advice: "A great defender wins the battle before the ball arrives — in their head.",
    deliverables: ["Leadership under pressure", "Defensive composure story", "Team communication narrative"] },
  { id: "cb2", label: "Centre Back",  x: 65, y: 76,
    challenges: "Leadership responsibility, communication under pressure, managing physical confrontation.",
    lessons: ["Command your area with confidence", "Calmness is a superpower at the back", "Read the game before it happens"],
    advice: "A great defender wins the battle before the ball arrives — in their head.",
    deliverables: ["Leadership under pressure", "Defensive composure story", "Team communication narrative"] },
  { id: "lb",  label: "Left Back",    x: 15, y: 72,
    challenges: "Balancing attack and defence, positional discipline, dealing with wide play pressure.",
    lessons: ["Discipline creates freedom — know your role", "Recovery runs build mental toughness", "Your position is a foundation, not a limitation"],
    advice: "The most underrated players shape the game from the side. Own your lane.",
    deliverables: ["Positional confidence story", "Resilience after mistakes", "Wide play mental strength"] },
  { id: "rb",  label: "Right Back",   x: 85, y: 72,
    challenges: "Balancing attack and defence, positional discipline, dealing with wide play pressure.",
    lessons: ["Discipline creates freedom — know your role", "Recovery runs build mental toughness", "Your position is a foundation, not a limitation"],
    advice: "The most underrated players shape the game from the side. Own your lane.",
    deliverables: ["Positional confidence story", "Resilience after mistakes", "Wide play mental strength"] },
  { id: "cm1", label: "Central Mid",  x: 30, y: 54,
    challenges: "Managing the tempo, constant decision-making, box-to-box physical demand.",
    lessons: ["You set the rhythm — own it", "Decisions under fatigue define character", "Protect and create — both with equal pride"],
    advice: "The engine room players rarely get the headlines. The team can't function without them.",
    deliverables: ["Engine room identity story", "Tempo management narrative", "Tireless effort story"] },
  { id: "cm2", label: "Central Mid",  x: 70, y: 54,
    challenges: "Managing the tempo, constant decision-making, box-to-box physical demand.",
    lessons: ["You set the rhythm — own it", "Decisions under fatigue define character", "Protect and create — both with equal pride"],
    advice: "The engine room players rarely get the headlines. The team can't function without them.",
    deliverables: ["Engine room identity story", "Tempo management narrative", "Tireless effort story"] },
  { id: "cam", label: "Attacking Mid", x: 50, y: 42,
    challenges: "Creative pressure, inconsistency expectations, failing in front of goal.",
    lessons: ["Creativity requires permission to fail", "Your vision is a weapon — trust it", "Moments of magic come from moments of courage"],
    advice: "The most creative players have the thickest skin. Let your imagination run free.",
    deliverables: ["Creative courage story", "Bouncing back narrative", "Vision & playmaking identity"] },
  { id: "lw",  label: "Left Winger",  x: 12, y: 35,
    challenges: "1v1 pressure, confidence after misplaced dribbles, speed and agility expectations.",
    lessons: ["Take the dribble — the cross won't take itself", "Confidence is a decision, not a feeling", "Your pace and skill create moments of magic"],
    advice: "Wingers live on the edge of disaster and brilliance. Embrace both.",
    deliverables: ["1v1 courage story", "Confidence decision narrative", "Pace & skill identity"] },
  { id: "rw",  label: "Right Winger", x: 88, y: 35,
    challenges: "1v1 pressure, confidence after misplaced dribbles, speed and agility expectations.",
    lessons: ["Take the dribble — the cross won't take itself", "Confidence is a decision, not a feeling", "Your pace and skill create moments of magic"],
    advice: "Wingers live on the edge of disaster and brilliance. Embrace both.",
    deliverables: ["1v1 courage story", "Confidence decision narrative", "Pace & skill identity"] },
  { id: "st",  label: "Striker",      x: 50, y: 18,
    challenges: "Goal drought mental health, pressure to score, isolation at the top of the press.",
    lessons: ["Your job is to want the ball — even when it hurts", "Strikers are defined by how they respond to misses", "Goals are the result of relentless work"],
    advice: "Every great striker has missed hundreds. The ones who make it kept asking for the ball.",
    deliverables: ["Goal drought resilience story", "Striker identity narrative", "Pressure & belief story"] },
];

const trainingPaths = [
  { position: "Goalkeepers", focus: "Courage & Decision-Making",   stories: 4, color: "#3b82f6", icon: "ri-shield-user-line" },
  { position: "Defenders",   focus: "Leadership & Communication",  stories: 6, color: "#8b5cf6", icon: "ri-shield-star-line" },
  { position: "Midfielders", focus: "Resilience & Tempo Control",  stories: 5, color: "#10b981", icon: "ri-flashlight-line" },
  { position: "Wingers",     focus: "Confidence & 1v1 Duels",      stories: 4, color: "#f97316", icon: "ri-speed-up-line" },
  { position: "Strikers",    focus: "Belief & Mental Bounce-Back", stories: 5, color: "#ef4444", icon: "ri-focus-3-line" },
];

const GLASS = "backdrop-blur-xl bg-white/[0.06] border border-white/[0.10]";
const GLASS_HOVER = "hover:bg-white/[0.10] hover:border-white/[0.18]";

export default function FootballMatrix() {
  const [activeSection, setActiveSection]     = useState<Section>("pitch");
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [enquiryOpen, setEnquiryOpen]         = useState(false);
  const [formSubmitted, setFormSubmitted]     = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => { setEnquiryOpen(false); setFormSubmitted(false); }, 2500);
  };

  const SECTION_LABELS: Record<Section, { label: string; icon: string }> = {
    pitch:     { label: "Pitch",     icon: "ri-football-line" },
    dashboard: { label: "Stats",     icon: "ri-bar-chart-2-line" },
    training:  { label: "Training",  icon: "ri-run-line" },
    academy:   { label: "Academy",   icon: "ri-building-4-line" },
  };

  return (
    <PublicLayout>
      {/* Background — dark stadium atmosphere */}
      <div
        className="min-h-screen relative"
        style={{ background: "radial-gradient(ellipse at 50% 0%, #0f2a4a 0%, #0b1220 45%, #060810 100%)" }}
      >
        {/* Subtle floodlight rays */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-1/4 left-1/4 w-96 h-[60vh] opacity-[0.04]"
            style={{ background: "linear-gradient(180deg, #fbbf24 0%, transparent 100%)", transform: "rotate(-15deg)", filter: "blur(40px)" }} />
          <div className="absolute -top-1/4 right-1/4 w-96 h-[60vh] opacity-[0.04]"
            style={{ background: "linear-gradient(180deg, #fbbf24 0%, transparent 100%)", transform: "rotate(15deg)", filter: "blur(40px)" }} />
        </div>

        {/* ── Sticky header / tab bar ─────────────────────────────────── */}
        <div
          className="sticky top-[60px] z-40 border-b border-white/[0.08]"
          style={{ backdropFilter: "blur(24px)", background: "rgba(6, 8, 16, 0.85)" }}
        >
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
            {/* Brand lockup */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                style={{ background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.30)", boxShadow: "0 0 12px rgba(251,191,36,0.20)" }}>
                <i className="ri-football-line text-amber-400"></i>
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-none">Me Time Stories</p>
                <p className="text-[10px] text-amber-400/70 leading-none mt-0.5">Football Academy Matrix</p>
              </div>
            </div>

            {/* Section tabs */}
            <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              {(Object.entries(SECTION_LABELS) as [Section, { label: string; icon: string }][]).map(([s, { label, icon }]) => (
                <button
                  key={s}
                  onClick={() => setActiveSection(s)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
                  style={activeSection === s ? {
                    background: "rgba(251,191,36,0.18)",
                    color: "#fbbf24",
                    border: "1px solid rgba(251,191,36,0.35)",
                    boxShadow: "0 0 12px rgba(251,191,36,0.20)",
                  } : {
                    color: "rgba(255,255,255,0.40)",
                    border: "1px solid transparent",
                  }}
                >
                  <i className={icon}></i> {label}
                </button>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={() => setEnquiryOpen(true)}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#1a0800" }}
            >
              <i className="ri-mail-line"></i> Enquire
            </button>
          </div>
        </div>

        {/* ── PITCH ──────────────────────────────────────────────────── */}
        {activeSection === "pitch" && (
          <div className="max-w-6xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Interactive Position Matrix</h2>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.40)" }}>
                Select any position to explore its personalised story programme.
              </p>
            </div>

            <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 items-start">
              {/* Pitch */}
              <div>
                <div
                  className="relative rounded-3xl overflow-hidden shadow-2xl"
                  style={{ border: "1px solid rgba(255,255,255,0.10)", boxShadow: "0 0 60px rgba(22,101,52,0.30)" }}
                >
                  <svg viewBox="0 0 100 115" className="w-full" style={{ background: "linear-gradient(180deg, #14532d 0%, #166534 30%, #15803d 50%, #166534 70%, #14532d 100%)" }}>
                    {/* Turf stripes */}
                    {[0,1,2,3,4,5,6].map(i => (
                      <rect key={i} x="5" y={5 + i * 15} width="90" height="15" fill={i%2===0 ? "rgba(0,0,0,0.06)" : "transparent"} />
                    ))}

                    {/* Pitch outline */}
                    <rect x="5" y="5" width="90" height="105" rx="1.5" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="0.6" />
                    {/* Halfway line */}
                    <line x1="5" y1="57.5" x2="95" y2="57.5" stroke="rgba(255,255,255,0.55)" strokeWidth="0.6" />
                    {/* Centre circle */}
                    <circle cx="50" cy="57.5" r="10" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="0.6" />
                    <circle cx="50" cy="57.5" r="0.8" fill="rgba(255,255,255,0.70)" />
                    {/* Penalty areas */}
                    <rect x="28" y="5" width="44" height="17" fill="none" stroke="rgba(255,255,255,0.50)" strokeWidth="0.5" />
                    <rect x="28" y="93" width="44" height="17" fill="none" stroke="rgba(255,255,255,0.50)" strokeWidth="0.5" />
                    {/* 6-yard boxes */}
                    <rect x="38" y="5" width="24" height="8" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="0.5" />
                    <rect x="38" y="102" width="24" height="8" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="0.5" />
                    {/* Penalty spots */}
                    <circle cx="50" cy="17" r="0.8" fill="rgba(255,255,255,0.60)" />
                    <circle cx="50" cy="98" r="0.8" fill="rgba(255,255,255,0.60)" />
                    {/* Penalty arcs */}
                    <path d="M 37 22 A 10 10 0 0 0 63 22" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="0.5" />
                    <path d="M 37 93 A 10 10 0 0 1 63 93" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="0.5" />
                    {/* Corner arcs */}
                    <path d="M 5 8 A 3 3 0 0 0 8 5" fill="none" stroke="rgba(255,255,255,0.40)" strokeWidth="0.5" />
                    <path d="M 92 5 A 3 3 0 0 0 95 8" fill="none" stroke="rgba(255,255,255,0.40)" strokeWidth="0.5" />
                    <path d="M 5 107 A 3 3 0 0 1 8 110" fill="none" stroke="rgba(255,255,255,0.40)" strokeWidth="0.5" />
                    <path d="M 92 110 A 3 3 0 0 1 95 107" fill="none" stroke="rgba(255,255,255,0.40)" strokeWidth="0.5" />

                    {/* Position dots */}
                    {positions.map((pos) => {
                      const isSelected = selectedPosition?.id === pos.id;
                      return (
                        <g key={pos.id} onClick={() => setSelectedPosition(isSelected ? null : pos)} className="cursor-pointer">
                          {/* Glow ring — selected */}
                          {isSelected && (
                            <circle cx={pos.x} cy={pos.y} r="7" fill="rgba(251,191,36,0.20)" stroke="rgba(251,191,36,0.60)" strokeWidth="0.8" />
                          )}
                          {/* Hover ring */}
                          <circle cx={pos.x} cy={pos.y} r="5.5" fill="transparent" className="cursor-pointer" />
                          {/* Main dot */}
                          <circle
                            cx={pos.x} cy={pos.y} r="3.5"
                            fill={isSelected ? "#fbbf24" : "rgba(255,255,255,0.92)"}
                            stroke={isSelected ? "#f97316" : "rgba(255,255,255,0.30)"}
                            strokeWidth="0.5"
                          />
                          {/* Label */}
                          <text x={pos.x} y={pos.y + 7} textAnchor="middle" fontSize="3" fill="rgba(255,255,255,0.80)">
                            {pos.label.split(" ")[0]}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                <p className="text-center mt-3 text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
                  {selectedPosition ? `Showing: ${selectedPosition.label} programme` : "Tap any position dot"}
                </p>
              </div>

              {/* Position detail panel */}
              <div>
                {selectedPosition ? (
                  <div className={`rounded-3xl p-6 shadow-2xl ${GLASS}`} style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.40)" }}>
                    <div className="flex justify-between items-start mb-5">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>
                          Position Programme
                        </div>
                        <h3 className="text-2xl font-bold" style={{ color: "#fbbf24" }}>{selectedPosition.label}</h3>
                      </div>
                      <button
                        onClick={() => setSelectedPosition(null)}
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <i className="ri-close-line"></i>
                      </button>
                    </div>

                    <div className="space-y-5">
                      {/* Challenges */}
                      <div className="p-4 rounded-2xl" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.20)" }}>
                        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#f87171" }}>Key Challenges</p>
                        <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>{selectedPosition.challenges}</p>
                      </div>

                      {/* Lessons */}
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: "rgba(255,255,255,0.35)" }}>Story Lessons</p>
                        <div className="space-y-2">
                          {selectedPosition.lessons.map((l) => (
                            <div key={l} className="flex items-start gap-3 text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>
                              <span className="text-amber-400 mt-0.5 flex-shrink-0">→</span>
                              {l}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Advice */}
                      <blockquote
                        className="px-4 py-3 rounded-xl text-sm italic leading-relaxed"
                        style={{ borderLeft: "3px solid #fbbf24", background: "rgba(251,191,36,0.06)", color: "rgba(255,255,255,0.80)" }}
                      >
                        "{selectedPosition.advice}"
                      </blockquote>

                      {/* Deliverables */}
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: "rgba(255,255,255,0.35)" }}>Story Deliverables</p>
                        <div className="space-y-2">
                          {selectedPosition.deliverables.map((d) => (
                            <div key={d} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,0.08)" }}>
                              <span className="text-amber-400 text-base">📖</span>
                              {d}
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => setEnquiryOpen(true)}
                        className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]"
                        style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#1a0800" }}
                      >
                        Request {selectedPosition.label} Programme
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Placeholder when no position selected */
                  <div className={`rounded-3xl p-8 text-center ${GLASS}`} style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.30)" }}>
                    <div className="text-5xl mb-4">⚽</div>
                    <h3 className="text-lg font-bold text-white mb-2">Select a Position</h3>
                    <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.40)" }}>
                      Click any dot on the pitch to explore that position's tailored mental performance story programme.
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { num: "11", label: "Positions" },
                        { num: "24", label: "Story titles" },
                        { num: "42+", label: "Academies" },
                      ].map(({ num, label }) => (
                        <div key={label} className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                          <div className="text-xl font-black text-amber-400">{num}</div>
                          <div className="text-[10px] text-white/30 mt-0.5">{label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── DASHBOARD ──────────────────────────────────────────────── */}
        {activeSection === "dashboard" && (
          <div className="max-w-5xl mx-auto px-4 py-10">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">Academy Dashboard</h2>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.40)" }}>
                A live overview of your academy's story engagement and player wellbeing.
              </p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { num: "42", label: "Active Players",   icon: "ri-team-line",     color: "#3b82f6", glow: "rgba(59,130,246,0.20)" },
                { num: "28", label: "Stories Delivered", icon: "ri-book-2-line",   color: "#10b981", glow: "rgba(16,185,129,0.20)" },
                { num: "94%", label: "Read Rate",        icon: "ri-eye-line",      color: "#f97316", glow: "rgba(249,115,22,0.20)" },
                { num: "4.8", label: "Parent Rating",    icon: "ri-star-line",     color: "#fbbf24", glow: "rgba(251,191,36,0.20)" },
              ].map(({ num, label, icon, color, glow }) => (
                <div
                  key={label}
                  className={`rounded-2xl p-5 text-center ${GLASS}`}
                  style={{ boxShadow: `0 0 24px ${glow}, 0 8px 24px rgba(0,0,0,0.30)` }}
                >
                  <div className="text-2xl mb-2" style={{ color }}><i className={icon}></i></div>
                  <div
                    className="text-3xl font-black mb-1"
                    style={{ color, textShadow: `0 0 16px ${color}` }}
                  >
                    {num}
                  </div>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.40)" }}>{label}</p>
                </div>
              ))}
            </div>

            {/* Recent deliveries */}
            <div className={`rounded-3xl p-6 ${GLASS}`} style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.30)" }}>
              <h3 className="text-base font-bold text-white mb-5">Recent Story Deliveries</h3>
              <div className="space-y-2.5">
                {[
                  { name: "Marcus R.", pos: "Striker",     story: "The Goal Drought",      status: "Read",      color: "#10b981" },
                  { name: "Jamie T.", pos: "Goalkeeper",   story: "Courage in the Box",    status: "Delivered", color: "#3b82f6" },
                  { name: "Kofi A.",  pos: "Centre Back",  story: "Holding the Line",      status: "Read",      color: "#10b981" },
                  { name: "Luca M.", pos: "Left Winger",   story: "Take the Dribble",      status: "Read",      color: "#10b981" },
                  { name: "Ethan P.", pos: "Central Mid",  story: "Engine Room",           status: "Delivered", color: "#3b82f6" },
                ].map(({ name, pos, story, status, color }) => (
                  <div
                    key={name}
                    className={`flex items-center justify-between p-3.5 rounded-xl transition-colors ${GLASS_HOVER}`}
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                        style={{ background: "rgba(59,130,246,0.20)", color: "#93c5fd" }}
                      >
                        {name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{name} · <span className="font-normal text-white/50">{pos}</span></p>
                        <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>"{story}"</p>
                      </div>
                    </div>
                    <span
                      className="text-xs px-2.5 py-1 rounded-full font-semibold"
                      style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}
                    >
                      {status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TRAINING ───────────────────────────────────────────────── */}
        {activeSection === "training" && (
          <div className="max-w-5xl mx-auto px-4 py-10">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">Position-Based Training Paths</h2>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.40)" }}>
                Tailored story programmes aligned to key mental performance themes.
              </p>
            </div>
            <div className="space-y-3">
              {trainingPaths.map(({ position, focus, stories, color, icon }) => (
                <div
                  key={position}
                  className={`rounded-2xl p-5 flex items-center justify-between transition-all duration-200 ${GLASS} ${GLASS_HOVER}`}
                  style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.25)" }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: `${color}18`, border: `1px solid ${color}40`, boxShadow: `0 0 16px ${color}25`, color }}
                    >
                      <i className={icon}></i>
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">{position}</h3>
                      <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>{focus}</p>
                      {/* Progress bar */}
                      <div className="mt-2 w-40 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                        <div
                          className="h-1.5 rounded-full"
                          style={{ width: `${(stories / 6) * 100}%`, background: `linear-gradient(90deg, ${color}, ${color}aa)` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-2xl font-black" style={{ color, textShadow: `0 0 12px ${color}` }}>{stories}</div>
                    <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.30)" }}>stories</p>
                  </div>
                </div>
              ))}
            </div>

            <div className={`mt-6 rounded-2xl p-5 ${GLASS}`}>
              <div className="flex flex-wrap gap-3 items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-white">Ready to start your academy's programme?</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.40)" }}>Get all 24 stories across every position group.</p>
                </div>
                <button
                  onClick={() => setEnquiryOpen(true)}
                  className="px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]"
                  style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#1a0800" }}
                >
                  Enquire Now →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── ACADEMY ────────────────────────────────────────────────── */}
        {activeSection === "academy" && (
          <div className="max-w-5xl mx-auto px-4 py-10">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">Academy Ecosystem</h2>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.40)" }}>
                How Me Time Stories integrates across your entire academy structure.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {[
                { icon: "ri-football-line",     title: "Players",              desc: "Receive stories personalised to their position, personality, and current developmental challenges.",  color: "#fbbf24" },
                { icon: "ri-home-heart-line",   title: "Parents",              desc: "Read alongside their children at home, deepening family-club bonds and pastoral engagement.",          color: "#3b82f6" },
                { icon: "ri-whistle-line",       title: "Coaches",              desc: "Stories reinforce coaching values and culture. Wellbeing data surfaces in the staff dashboard.",        color: "#10b981" },
                { icon: "ri-mental-health-line", title: "Sports Psychologists", desc: "Complement existing mental performance programmes with narrative-based therapeutic content.",           color: "#8b5cf6" },
              ].map(({ icon, title, desc, color }) => (
                <div
                  key={title}
                  className={`rounded-2xl p-6 transition-all duration-200 ${GLASS} ${GLASS_HOVER}`}
                  style={{ boxShadow: `0 0 20px ${color}12, 0 8px 24px rgba(0,0,0,0.25)` }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4"
                    style={{ background: `${color}18`, border: `1px solid ${color}40`, color }}
                  >
                    <i className={icon}></i>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.50)" }}>{desc}</p>
                </div>
              ))}
            </div>

            {/* Partner academies strip */}
            <div className={`rounded-2xl p-5 mb-5 ${GLASS}`}>
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.30)" }}>
                42+ Partner Academies
              </p>
              <div className="flex flex-wrap gap-2">
                {["Arsenal", "Chelsea", "Liverpool", "Man City", "Man United", "Spurs", "Everton", "Brighton", "Leicester", "Aston Villa"].map((club) => (
                  <span
                    key={club}
                    className="text-xs px-3 py-1.5 rounded-full font-medium"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.60)" }}
                  >
                    {club}
                  </span>
                ))}
                <span
                  className="text-xs px-3 py-1.5 rounded-full font-medium"
                  style={{ background: "rgba(251,191,36,0.10)", border: "1px solid rgba(251,191,36,0.25)", color: "#fbbf24" }}
                >
                  + 32 more
                </span>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setEnquiryOpen(true)}
                className="px-8 py-4 rounded-2xl font-bold text-base transition-all hover:scale-[1.02] shadow-2xl"
                style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#1a0800", boxShadow: "0 0 32px rgba(249,115,22,0.30)" }}
              >
                Enquire About the Academy Programme
              </button>
              <p className="text-xs mt-3" style={{ color: "rgba(255,255,255,0.25)" }}>We respond within 2 business days.</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Enquiry modal ──────────────────────────────────────────────── */}
      {enquiryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backdropFilter: "blur(12px)", background: "rgba(0,0,0,0.70)" }}>
          <div
            className="w-full max-w-md rounded-3xl p-8 shadow-2xl relative"
            style={{ backdropFilter: "blur(24px)", background: "rgba(15,20,35,0.95)", border: "1px solid rgba(255,255,255,0.12)" }}
          >
            <button
              onClick={() => { setEnquiryOpen(false); setFormSubmitted(false); }}
              className="absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            >
              <i className="ri-close-line"></i>
            </button>
            {formSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
                  style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.30)" }}>
                  ✓
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Enquiry Sent!</h3>
                <p className="text-white/50 text-sm">We'll be in touch within 2 business days.</p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-white mb-1">Academy Programme Enquiry</h3>
                <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.40)" }}>Tell us about your academy and we'll arrange a demo.</p>
                <form onSubmit={handleSubmit} className="space-y-3">
                  {[
                    { placeholder: "Your name", type: "text" },
                    { placeholder: "Work email", type: "email" },
                    { placeholder: "Academy / Club name", type: "text" },
                  ].map(({ placeholder, type }) => (
                    <input
                      key={placeholder}
                      required
                      type={type}
                      placeholder={placeholder}
                      className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:ring-1 focus:ring-amber-400/50 transition-all"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}
                    />
                  ))}
                  <select
                    required
                    className="w-full px-4 py-3 rounded-xl text-sm text-white/60 focus:outline-none focus:ring-1 focus:ring-amber-400/50"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}
                  >
                    <option value="">Select your league</option>
                    <option>Premier League</option>
                    <option>EFL Championship</option>
                    <option>League One</option>
                    <option>League Two</option>
                    <option>Other</option>
                  </select>
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]"
                    style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#1a0800" }}
                  >
                    Send Enquiry →
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </PublicLayout>
  );
}
