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

const STEP_LABELS = ["Your Hero", "Personality", "Begin the Story"];

const inputClass = "w-full px-4 py-3.5 rounded-xl text-base transition-all focus:outline-none focus:ring-2 focus:ring-amber-400/50 placeholder-amber-900/30";
const inputStyle = { background: "rgba(249,115,22,0.04)", border: "1px solid rgba(249,115,22,0.18)", color: "#1a0800" };

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

  return (
    <PublicLayout>
      {/* ── Dark warm header with step indicator ── */}
      <section
        className="py-12 text-white"
        style={{ background: "linear-gradient(160deg, #1a0c04 0%, #0d0a08 60%, #120804 100%)" }}
      >
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="text-5xl mb-3">🚜</div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: "#fef3e2" }}>Build Your Character</h1>
          <p className="text-sm mb-8" style={{ color: "rgba(254,243,226,0.50)" }}>
            Your personalised version of <strong style={{ color: "#fbbf24" }}>The Time-Travelling Tractor</strong> awaits
          </p>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                  style={
                    step === s
                      ? { background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#1a0800", boxShadow: "0 0 16px rgba(249,115,22,0.40)" }
                      : step > s
                        ? { background: "#34d399", color: "white" }
                        : { background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.12)" }
                  }
                >
                  {step > s ? "✓" : s}
                </div>
                {s < 3 && (
                  <div
                    className="w-10 md:w-14 h-0.5 rounded-full transition-all"
                    style={{ background: step > s ? "#34d399" : "rgba(255,255,255,0.10)" }}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-6 md:gap-12">
            {STEP_LABELS.map((label, i) => (
              <span
                key={label}
                className="text-[11px] transition-colors"
                style={{ color: step === i + 1 ? "#fbbf24" : "rgba(255,255,255,0.25)", fontWeight: step === i + 1 ? 600 : 400 }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Form area — warm cream ── */}
      <div className="min-h-screen" style={{ background: "#fef9f0" }}>
        <div className="max-w-xl mx-auto px-4 py-10">

          {/* ── STEP 1: Your Hero ── */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold mb-0.5" style={{ color: "#1a0800" }}>Step 1 — Tell us about your hero</h2>
                <p className="text-sm" style={{ color: "rgba(26,8,0,0.45)" }}>The more you share, the more personal the story.</p>
              </div>

              <div>
                <label className="text-sm font-semibold mb-1.5 block" style={{ color: "#1a0800" }}>
                  Hero's Name <span className="text-red-400">*</span>
                </label>
                <input
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  className={inputClass}
                  style={inputStyle}
                  placeholder="e.g. Mia, Oliver, Alex..."
                />
                {data.name.trim() && (
                  <p className="text-xs mt-1.5 font-semibold" style={{ color: "#f97316" }}>
                    ✨ Every page will say <strong>{data.name}</strong>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold mb-1.5 block" style={{ color: "#1a0800" }}>
                    Age <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number" min={3} max={16}
                    value={data.age}
                    onChange={(e) => setData({ ...data, age: e.target.value })}
                    className={inputClass}
                    style={inputStyle}
                    placeholder="e.g. 7"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1.5 block" style={{ color: "#1a0800" }}>
                    Pronouns <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={data.pronouns}
                    onChange={(e) => setData({ ...data, pronouns: e.target.value as Pronoun })}
                    className={inputClass}
                    style={{ ...inputStyle, appearance: "none" }}
                  >
                    <option value="">Select...</option>
                    <option value="she/her">She / Her</option>
                    <option value="he/him">He / Him</option>
                    <option value="they/them">They / Them</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold mb-1.5 block" style={{ color: "#1a0800" }}>Favourite Animal</label>
                <input
                  value={data.favAnimal}
                  onChange={(e) => setData({ ...data, favAnimal: e.target.value })}
                  className={inputClass}
                  style={inputStyle}
                  placeholder="Lion, Cat, Dragon, Fox..."
                />
                <p className="text-xs mt-1" style={{ color: "rgba(26,8,0,0.38)" }}>This creature will appear in the story 🐾</p>
              </div>

              <div>
                <label className="text-sm font-semibold mb-1.5 block" style={{ color: "#1a0800" }}>Biggest Dream</label>
                <input
                  value={data.biggestDream}
                  onChange={(e) => setData({ ...data, biggestDream: e.target.value })}
                  className={inputClass}
                  style={inputStyle}
                  placeholder="To be a footballer, astronaut, help animals..."
                />
                <p className="text-xs mt-1" style={{ color: "rgba(26,8,0,0.38)" }}>The story's ending will reflect this dream 🌟</p>
              </div>

              <button
                disabled={!canGoStep2}
                onClick={() => setStep(2)}
                className="w-full py-4 font-bold text-base rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.01] shadow-lg"
                style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#1a0800" }}
              >
                Continue to Personality →
              </button>
            </div>
          )}

          {/* ── STEP 2: Personality ── */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-0.5" style={{ color: "#1a0800" }}>
                  Step 2 — What makes <span style={{ color: "#f97316" }}>{data.name || "your hero"}</span> unique?
                </h2>
                <p className="text-sm" style={{ color: "rgba(26,8,0,0.45)" }}>These traits shape every decision your hero makes in the story.</p>
              </div>

              <div>
                <p className="text-sm font-semibold mb-1" style={{ color: "#1a0800" }}>Choose exactly 3 personality traits</p>
                <p className="text-xs mb-3" style={{ color: "rgba(26,8,0,0.40)" }}>
                  {data.traits.length}/3 selected{data.traits.length === 3 ? " — perfect! ✅" : ""}
                </p>
                <div className="flex flex-wrap gap-2">
                  {TRAITS.map((trait) => {
                    const selected = data.traits.includes(trait);
                    const disabled = !selected && data.traits.length >= 3;
                    return (
                      <button
                        key={trait}
                        onClick={() => toggleTrait(trait)}
                        disabled={disabled}
                        className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
                        style={
                          selected
                            ? { background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#1a0800", border: "1px solid transparent", boxShadow: "0 2px 8px rgba(249,115,22,0.30)" }
                            : disabled
                              ? { background: "rgba(0,0,0,0.04)", color: "rgba(26,8,0,0.20)", border: "1px solid rgba(0,0,0,0.06)", cursor: "not-allowed" }
                              : { background: "white", color: "#78350f", border: "1px solid rgba(249,115,22,0.25)", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }
                        }
                      >
                        {trait}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold mb-3" style={{ color: "#1a0800" }}>Story themes <span className="font-normal opacity-60">(optional)</span></p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {THEMES.map(({ emoji, label }) => (
                    <button
                      key={label}
                      onClick={() => toggleTheme(label)}
                      className="flex items-center gap-2 p-3 rounded-xl text-sm font-medium transition-all"
                      style={data.themes.includes(label)
                        ? { background: "rgba(249,115,22,0.10)", border: "1px solid rgba(249,115,22,0.35)", color: "#c2410c" }
                        : { background: "white", border: "1px solid rgba(249,115,22,0.15)", color: "#78350f", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }
                      }
                    >
                      <span>{emoji}</span> {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold mb-1.5 block" style={{ color: "#1a0800" }}>
                  Parent note <span className="font-normal opacity-60">(optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={data.parentNotes}
                  onChange={(e) => setData({ ...data, parentNotes: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                  style={inputStyle}
                  placeholder="e.g. 'Starting a new school soon, loves dinosaurs, needs a confidence boost...'"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 font-semibold text-sm rounded-xl transition-colors hover:bg-amber-50"
                  style={{ background: "white", border: "1.5px solid rgba(249,115,22,0.30)", color: "#78350f" }}
                >
                  ← Back
                </button>
                <button
                  disabled={!canGoStep3}
                  onClick={() => setStep(3)}
                  className="flex-[3] py-4 font-bold text-base rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.01] shadow-lg"
                  style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#1a0800" }}
                >
                  Build My Story →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Story ready ── */}
          {step === 3 && (
            <div className="space-y-5">
              {/* Character card */}
              <div className="rounded-2xl overflow-hidden shadow-lg" style={{ border: "1px solid rgba(249,115,22,0.20)" }}>
                <div
                  className="px-6 py-5 text-white"
                  style={{ background: "linear-gradient(135deg, #1a0c04 0%, #7c2d12 100%)" }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                      style={{ background: "rgba(251,191,36,0.20)", border: "1px solid rgba(251,191,36,0.30)" }}>
                      {data.favAnimal ? "🐾" : "⭐"}
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-widest font-bold mb-0.5" style={{ color: "rgba(254,243,226,0.45)" }}>Your Hero</div>
                      <div className="text-xl font-bold" style={{ color: "#fef3e2" }}>{data.name}</div>
                      <div className="text-sm" style={{ color: "rgba(254,243,226,0.55)" }}>Age {data.age} · {data.pronouns}</div>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-5 space-y-3" style={{ background: "#fffbf5" }}>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "rgba(26,8,0,0.35)" }}>Personality Traits</div>
                    <div className="flex flex-wrap gap-2">
                      {data.traits.map((t) => (
                        <span key={t} className="px-3 py-1 rounded-full text-sm font-semibold"
                          style={{ background: "rgba(249,115,22,0.10)", color: "#c2410c", border: "1px solid rgba(249,115,22,0.20)" }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  {data.favAnimal && (
                    <div className="flex items-center gap-2 text-sm" style={{ color: "rgba(26,8,0,0.65)" }}>
                      <span className="text-base">🐾</span>
                      <span>Favourite animal: <strong>{data.favAnimal}</strong> — will appear in the story</span>
                    </div>
                  )}
                  {data.biggestDream && (
                    <div className="flex items-center gap-2 text-sm" style={{ color: "rgba(26,8,0,0.65)" }}>
                      <span className="text-base">🌟</span>
                      <span>Biggest dream: <strong>{data.biggestDream}</strong> — woven into the ending</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Story preview */}
              <div
                className="rounded-2xl p-5"
                style={{ background: "linear-gradient(135deg, #fffbf0 0%, #fef3e2 100%)", border: "1px solid rgba(249,115,22,0.15)" }}
              >
                <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(249,115,22,0.70)" }}>
                  🚜 Story Preview — Chapter 1
                </div>
                <p className="text-sm leading-relaxed italic" style={{ fontFamily: "Georgia, serif", color: "rgba(26,8,0,0.75)" }}>
                  "The morning mist lay low over the fields when{" "}
                  <strong style={{ color: "#c2410c" }}>{data.name}</strong> found it — half-hidden beneath an old oak tree, covered in rust and wonder: the Time-Travelling Tractor. Something{" "}
                  <strong>{data.traits[0]?.toLowerCase() || "brave"}</strong> stirred inside {data.pronouns === "she/her" ? "her" : data.pronouns === "he/him" ? "his" : "their"} chest…"
                </p>
              </div>

              <button
                onClick={launchStory}
                className="w-full py-5 font-black text-xl rounded-2xl shadow-xl transition-all hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#1a0800", boxShadow: "0 4px 24px rgba(249,115,22,0.35)" }}
              >
                🚜 Read {data.name}'s Story Now!
              </button>

              <p className="text-center text-xs" style={{ color: "rgba(26,8,0,0.35)" }}>
                Your character is embedded in the story — every chapter is written just for {data.name}.
              </p>

              <button
                onClick={() => setStep(2)}
                className="w-full text-sm py-2 transition-colors hover:opacity-70"
                style={{ color: "rgba(26,8,0,0.35)" }}
              >
                ← Edit personality
              </button>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
