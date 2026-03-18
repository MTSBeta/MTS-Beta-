import { useState } from "react";
import { useLocation } from "wouter";
import { PublicLayout } from "@/layouts/PublicLayout";

type Pronoun = "she/her" | "he/him" | "they/them";

interface CharacterData {
  name: string;
  age: string;
  pronouns: Pronoun | "";
  favAnimal: string;
  biggestDream: string;
  traits: string[];
  themes: string[];
  parentNotes: string;
}

const TRAITS = [
  "Brave", "Creative", "Kind", "Curious", "Funny",
  "Determined", "Caring", "Adventurous", "Thoughtful", "Energetic",
  "Gentle", "Confident", "Imaginative", "Helpful", "Resilient",
];

const THEMES = [
  { emoji: "🚀", label: "Adventure" },
  { emoji: "🦁", label: "Confidence" },
  { emoji: "🌈", label: "Friendship" },
  { emoji: "🏫", label: "New School" },
  { emoji: "💤", label: "Bedtime Calm" },
  { emoji: "🌊", label: "Nature" },
  { emoji: "⚽", label: "Sport" },
  { emoji: "🧠", label: "Wellbeing" },
  { emoji: "🎨", label: "Creativity" },
  { emoji: "🌍", label: "Diversity" },
];

const STEP_LABELS = ["Your Hero", "Personality", "Begin"];

export default function CharacterCreator() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<CharacterData>({
    name: "", age: "", pronouns: "", favAnimal: "", biggestDream: "",
    traits: [], themes: [], parentNotes: "",
  });

  const toggleTrait = (trait: string) => {
    setData((d) => ({
      ...d,
      traits: d.traits.includes(trait)
        ? d.traits.filter((t) => t !== trait)
        : d.traits.length < 3
          ? [...d.traits, trait]
          : d.traits,
    }));
  };

  const toggleTheme = (theme: string) => {
    setData((d) => ({
      ...d,
      themes: d.themes.includes(theme)
        ? d.themes.filter((t) => t !== theme)
        : [...d.themes, theme],
    }));
  };

  const canGoStep2 = data.name.trim() && data.age && data.pronouns;
  const canGoStep3 = data.traits.length === 3;

  const launchStory = () => {
    const params = new URLSearchParams({
      name: data.name.trim(),
      pronoun: data.pronouns,
      traits: data.traits.join(","),
      ...(data.favAnimal && { favAnimal: data.favAnimal }),
      ...(data.biggestDream && { dream: data.biggestDream }),
      ...(data.themes.length && { themes: data.themes.join(",") }),
    });
    navigate(`/stories/time-travelling-tractor?${params.toString()}`);
  };

  const inputClass = "w-full px-4 py-3.5 rounded-xl text-sm font-medium transition-all focus:outline-none placeholder-white/25";
  const inputStyle = {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "#fef3e2",
  };
  const inputFocusRing = "focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/40";

  return (
    <PublicLayout>
      <div
        className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden py-10 px-4"
        style={{ background: "radial-gradient(ellipse at 50% 0%, #1a0c04 0%, #0d0a08 55%, #060402 100%)" }}
      >
        {/* Ambient glow orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] rounded-full opacity-[0.07]"
            style={{ background: "radial-gradient(circle, #f97316 0%, transparent 70%)", filter: "blur(60px)" }} />
          <div className="absolute top-1/2 -right-32 w-[400px] h-[400px] rounded-full opacity-[0.05]"
            style={{ background: "radial-gradient(circle, #fbbf24 0%, transparent 70%)", filter: "blur(50px)" }} />
          <div className="absolute -bottom-20 left-1/3 w-[350px] h-[350px] rounded-full opacity-[0.04]"
            style={{ background: "radial-gradient(circle, #f97316 0%, transparent 70%)", filter: "blur(40px)" }} />
        </div>

        {/* Main glass panel */}
        <div
          className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
          style={{
            backdropFilter: "blur(24px)",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow: "0 0 60px rgba(249,115,22,0.08), 0 24px 64px rgba(0,0,0,0.50)",
          }}
        >
          {/* Panel top bar */}
          <div
            className="px-6 pt-6 pb-5 text-center"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
          >
            {/* Step indicator */}
            <div className="flex items-center justify-center gap-2 mb-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                    style={
                      step === s
                        ? { background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#1a0800", boxShadow: "0 0 20px rgba(249,115,22,0.50)" }
                        : step > s
                          ? { background: "rgba(52,211,153,0.20)", color: "#34d399", border: "1px solid rgba(52,211,153,0.40)" }
                          : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.25)", border: "1px solid rgba(255,255,255,0.08)" }
                    }
                  >
                    {step > s ? <i className="ri-check-line text-xs"></i> : s}
                  </div>
                  {s < 3 && (
                    <div
                      className="w-8 h-px transition-all duration-500"
                      style={{ background: step > s ? "rgba(52,211,153,0.50)" : "rgba(255,255,255,0.08)" }}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-8">
              {STEP_LABELS.map((label, i) => (
                <span
                  key={label}
                  className="text-[10px] font-semibold uppercase tracking-widest transition-colors"
                  style={{ color: step === i + 1 ? "#fbbf24" : "rgba(255,255,255,0.18)" }}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Panel body */}
          <div className="px-6 py-6">

            {/* ── STEP 1: Your Hero ── */}
            {step === 1 && (
              <div className="space-y-5">
                <div className="mb-1">
                  <h2 className="text-lg font-bold mb-0.5" style={{ color: "#fef3e2" }}>
                    Tell us about your hero
                  </h2>
                  <p className="text-xs" style={{ color: "rgba(254,243,226,0.40)" }}>
                    The more you share, the more personal the story.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-widest block mb-2" style={{ color: "rgba(254,243,226,0.40)" }}>
                    Hero's Name <span style={{ color: "#f97316" }}>*</span>
                  </label>
                  <input
                    value={data.name}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    className={`${inputClass} ${inputFocusRing}`}
                    style={inputStyle}
                    placeholder="e.g. Mia, Oliver, Alex..."
                  />
                  {data.name.trim() && (
                    <p className="text-xs mt-1.5 font-semibold" style={{ color: "#fbbf24" }}>
                      <i className="ri-sparkling-2-line"></i> Every page will say <strong>{data.name}</strong>
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest block mb-2" style={{ color: "rgba(254,243,226,0.40)" }}>
                      Age <span style={{ color: "#f97316" }}>*</span>
                    </label>
                    <input
                      type="number" min={3} max={16}
                      value={data.age}
                      onChange={(e) => setData({ ...data, age: e.target.value })}
                      className={`${inputClass} ${inputFocusRing}`}
                      style={inputStyle}
                      placeholder="e.g. 7"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest block mb-2" style={{ color: "rgba(254,243,226,0.40)" }}>
                      Pronouns <span style={{ color: "#f97316" }}>*</span>
                    </label>
                    <select
                      value={data.pronouns}
                      onChange={(e) => setData({ ...data, pronouns: e.target.value as Pronoun })}
                      className={`${inputClass} ${inputFocusRing}`}
                      style={{ ...inputStyle, appearance: "none" as const }}
                    >
                      <option value="" style={{ background: "#0d0a08" }}>Select...</option>
                      <option value="she/her" style={{ background: "#0d0a08" }}>She / Her</option>
                      <option value="he/him" style={{ background: "#0d0a08" }}>He / Him</option>
                      <option value="they/them" style={{ background: "#0d0a08" }}>They / Them</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-widest block mb-2" style={{ color: "rgba(254,243,226,0.40)" }}>
                    Favourite Animal
                  </label>
                  <input
                    value={data.favAnimal}
                    onChange={(e) => setData({ ...data, favAnimal: e.target.value })}
                    className={`${inputClass} ${inputFocusRing}`}
                    style={inputStyle}
                    placeholder="Lion, Cat, Dragon, Fox..."
                  />
                  <p className="text-xs mt-1" style={{ color: "rgba(254,243,226,0.25)" }}>
                    This creature will appear in the story 🐾
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-widest block mb-2" style={{ color: "rgba(254,243,226,0.40)" }}>
                    Biggest Dream
                  </label>
                  <input
                    value={data.biggestDream}
                    onChange={(e) => setData({ ...data, biggestDream: e.target.value })}
                    className={`${inputClass} ${inputFocusRing}`}
                    style={inputStyle}
                    placeholder="To be a footballer, astronaut, help animals..."
                  />
                  <p className="text-xs mt-1" style={{ color: "rgba(254,243,226,0.25)" }}>
                    The story's ending will reflect this dream 🌟
                  </p>
                </div>

                <button
                  disabled={!canGoStep2}
                  onClick={() => setStep(2)}
                  className="w-full py-3.5 font-bold text-sm rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:scale-[1.01]"
                  style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#1a0800", boxShadow: canGoStep2 ? "0 4px 20px rgba(249,115,22,0.30)" : "none" }}
                >
                  Continue to Personality <i className="ri-arrow-right-line"></i>
                </button>
              </div>
            )}

            {/* ── STEP 2: Personality ── */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="mb-1">
                  <h2 className="text-lg font-bold mb-0.5" style={{ color: "#fef3e2" }}>
                    What makes <span style={{ color: "#fbbf24" }}>{data.name || "your hero"}</span> unique?
                  </h2>
                  <p className="text-xs" style={{ color: "rgba(254,243,226,0.40)" }}>
                    These traits shape every decision your hero makes in the story.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "rgba(254,243,226,0.40)" }}>
                      Choose exactly 3 traits
                    </p>
                    <span
                      className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                      style={data.traits.length === 3
                        ? { background: "rgba(52,211,153,0.15)", color: "#34d399", border: "1px solid rgba(52,211,153,0.30)" }
                        : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.08)" }
                      }
                    >
                      {data.traits.length}/3
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {TRAITS.map((trait) => {
                      const selected = data.traits.includes(trait);
                      const disabled = !selected && data.traits.length >= 3;
                      return (
                        <button
                          key={trait}
                          onClick={() => toggleTrait(trait)}
                          disabled={disabled}
                          className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all"
                          style={
                            selected
                              ? { background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#1a0800", boxShadow: "0 0 12px rgba(249,115,22,0.35)" }
                              : disabled
                                ? { background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.05)", cursor: "not-allowed" }
                                : { background: "rgba(255,255,255,0.06)", color: "rgba(254,243,226,0.70)", border: "1px solid rgba(255,255,255,0.10)" }
                          }
                        >
                          {trait}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(254,243,226,0.40)" }}>
                    Story themes <span className="font-normal normal-case tracking-normal" style={{ color: "rgba(254,243,226,0.25)" }}>(optional)</span>
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {THEMES.map(({ emoji, label }) => (
                      <button
                        key={label}
                        onClick={() => toggleTheme(label)}
                        className="flex items-center gap-2.5 p-3 rounded-xl text-xs font-semibold transition-all text-left"
                        style={data.themes.includes(label)
                          ? { background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.35)", color: "#fbbf24", boxShadow: "0 0 12px rgba(249,115,22,0.15)" }
                          : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(254,243,226,0.55)" }
                        }
                      >
                        <span className="text-base">{emoji}</span> {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-widest block mb-2" style={{ color: "rgba(254,243,226,0.40)" }}>
                    Parent note <span className="font-normal normal-case tracking-normal" style={{ color: "rgba(254,243,226,0.25)" }}>(optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={data.parentNotes}
                    onChange={(e) => setData({ ...data, parentNotes: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl text-xs resize-none focus:outline-none ${inputFocusRing}`}
                    style={{ ...inputStyle, fontFamily: "inherit" }}
                    placeholder="e.g. 'Starting a new school soon, loves dinosaurs, needs a confidence boost...'"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="px-5 py-3.5 font-semibold text-xs rounded-xl transition-all"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", color: "rgba(254,243,226,0.60)" }}
                  >
                    <i className="ri-arrow-left-line"></i> Back
                  </button>
                  <button
                    disabled={!canGoStep3}
                    onClick={() => setStep(3)}
                    className="flex-1 py-3.5 font-bold text-sm rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:scale-[1.01]"
                    style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#1a0800", boxShadow: canGoStep3 ? "0 4px 20px rgba(249,115,22,0.30)" : "none" }}
                  >
                    Build My Story <i className="ri-arrow-right-line"></i>
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3: Ready ── */}
            {step === 3 && (
              <div className="space-y-4">
                {/* Character summary card */}
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{ border: "1px solid rgba(251,191,36,0.20)" }}
                >
                  <div
                    className="px-5 py-4 flex items-center gap-4"
                    style={{ background: "linear-gradient(135deg, rgba(249,115,22,0.18) 0%, rgba(251,191,36,0.10) 100%)", borderBottom: "1px solid rgba(251,191,36,0.15)" }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.25)" }}
                    >
                      <i className="ri-user-star-line text-xl" style={{ color: "#fbbf24" }}></i>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-widest font-bold mb-0.5" style={{ color: "rgba(254,243,226,0.40)" }}>Your Hero</div>
                      <div className="text-base font-bold" style={{ color: "#fef3e2" }}>{data.name}</div>
                      <div className="text-xs" style={{ color: "rgba(254,243,226,0.50)" }}>Age {data.age} · {data.pronouns}</div>
                    </div>
                  </div>
                  <div className="px-5 py-4 space-y-3" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "rgba(254,243,226,0.30)" }}>Personality Traits</div>
                      <div className="flex flex-wrap gap-1.5">
                        {data.traits.map((t) => (
                          <span key={t} className="px-3 py-1 rounded-full text-xs font-semibold"
                            style={{ background: "rgba(249,115,22,0.15)", color: "#fbbf24", border: "1px solid rgba(249,115,22,0.25)" }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    {data.favAnimal && (
                      <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(254,243,226,0.55)" }}>
                        <i className="ri-footprint-line" style={{ color: "#f97316" }}></i>
                        <span>Favourite animal: <strong style={{ color: "#fef3e2" }}>{data.favAnimal}</strong> — will appear in the story</span>
                      </div>
                    )}
                    {data.biggestDream && (
                      <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(254,243,226,0.55)" }}>
                        <i className="ri-star-line" style={{ color: "#fbbf24" }}></i>
                        <span>Biggest dream: <strong style={{ color: "#fef3e2" }}>{data.biggestDream}</strong> — woven into the ending</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Story preview */}
                <div
                  className="rounded-2xl p-5"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <i className="ri-book-open-line text-xs" style={{ color: "rgba(249,115,22,0.70)" }}></i>
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(249,115,22,0.70)" }}>
                      Story Preview — Chapter 1
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ fontFamily: "Georgia, serif", color: "rgba(254,243,226,0.65)", fontStyle: "italic" }}>
                    "The morning mist lay low over the fields when{" "}
                    <strong style={{ color: "#fbbf24", fontStyle: "normal" }}>{data.name}</strong> found it — half-hidden beneath an old oak tree, covered in rust and wonder: the Time-Travelling Tractor. Something{" "}
                    <strong style={{ fontStyle: "normal", color: "#fef3e2" }}>{data.traits[0]?.toLowerCase() || "brave"}</strong> stirred inside {data.pronouns === "she/her" ? "her" : data.pronouns === "he/him" ? "his" : "their"} chest…"
                  </p>
                </div>

                {/* CTA */}
                <button
                  onClick={launchStory}
                  className="w-full py-4 font-black text-base rounded-2xl transition-all hover:scale-[1.02]"
                  style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#1a0800", boxShadow: "0 6px 30px rgba(249,115,22,0.40)" }}
                >
                  <i className="ri-play-fill"></i> Read {data.name}'s Story Now
                </button>

                <p className="text-center text-[11px]" style={{ color: "rgba(254,243,226,0.25)" }}>
                  Every chapter is written just for {data.name} — personalised in real time.
                </p>

                <button
                  onClick={() => setStep(2)}
                  className="w-full text-xs py-2 transition-colors"
                  style={{ color: "rgba(254,243,226,0.25)" }}
                >
                  <i className="ri-pencil-line"></i> Edit personality
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sub-copy below the panel */}
        <p className="mt-6 text-xs text-center" style={{ color: "rgba(254,243,226,0.20)" }}>
          Your character data is never stored without your permission.
        </p>
      </div>
    </PublicLayout>
  );
}
