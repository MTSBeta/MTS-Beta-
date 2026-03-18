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
      {/* Header with progress */}
      <section
        className="py-10 text-white"
        style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4f46e5 100%)" }}
      >
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="text-4xl mb-3">🚜</div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">Build Your Character</h1>
          <p className="text-indigo-300 text-sm mb-7">
            Your personalised version of <strong className="text-white">The Time-Travelling Tractor</strong> awaits
          </p>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    step === s ? "bg-white text-indigo-600 shadow-lg" : step > s ? "bg-green-400 text-white" : "bg-white/15 text-white/60"
                  }`}
                >
                  {step > s ? "✓" : s}
                </div>
                {s < 3 && <div className={`w-10 md:w-16 h-0.5 rounded-full transition-all ${step > s ? "bg-green-400" : "bg-white/20"}`} />}
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-6 md:gap-14">
            {STEP_LABELS.map((label, i) => (
              <span key={label} className={`text-[11px] transition-colors ${step === i + 1 ? "text-white font-semibold" : "text-white/35"}`}>
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-xl mx-auto px-4 py-10">

        {/* ── STEP 1: Your Hero ── */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-gray-900">Step 1 — Tell us about your hero</h2>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Hero's Name <span className="text-red-400">*</span></label>
              <input
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                placeholder="e.g. Mia, Oliver, Alex..."
              />
              {data.name.trim() && (
                <p className="text-xs text-indigo-600 mt-1.5 font-medium">
                  ✨ Every page of The Time-Travelling Tractor will say <strong>{data.name}</strong>
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Age <span className="text-red-400">*</span></label>
                <input
                  type="number"
                  min={3} max={16}
                  value={data.age}
                  onChange={(e) => setData({ ...data, age: e.target.value })}
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                  placeholder="e.g. 7"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Pronouns <span className="text-red-400">*</span></label>
                <select
                  value={data.pronouns}
                  onChange={(e) => setData({ ...data, pronouns: e.target.value as Pronoun })}
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white transition"
                >
                  <option value="">Select...</option>
                  <option value="she/her">She / Her</option>
                  <option value="he/him">He / Him</option>
                  <option value="they/them">They / Them</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Favourite Animal</label>
              <input
                value={data.favAnimal}
                onChange={(e) => setData({ ...data, favAnimal: e.target.value })}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                placeholder="Lion, Cat, Dragon, Fox..."
              />
              <p className="text-xs text-gray-400 mt-1">This creature will appear in the story 🐾</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Biggest Dream</label>
              <input
                value={data.biggestDream}
                onChange={(e) => setData({ ...data, biggestDream: e.target.value })}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                placeholder="To be a footballer, astronaut, help animals..."
              />
              <p className="text-xs text-gray-400 mt-1">The story's ending will reflect this dream 🌟</p>
            </div>

            <button
              disabled={!canGoStep2}
              onClick={() => setStep(2)}
              className="w-full py-4 text-white font-bold text-lg rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.01] shadow-md"
              style={{ backgroundColor: "#4f46e5" }}
            >
              Continue to Personality →
            </button>
          </div>
        )}

        {/* ── STEP 2: Personality ── */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">
              Step 2 — What makes <span className="text-indigo-600">{data.name || "your hero"}</span> unique?
            </h2>

            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Choose exactly 3 personality traits</p>
              <p className="text-xs text-gray-400 mb-3">These will shape how the story is written — {data.name || "your hero"}'s decisions will reflect these traits.</p>
              <div className="flex flex-wrap gap-2">
                {TRAITS.map((trait) => {
                  const selected = data.traits.includes(trait);
                  const disabled = !selected && data.traits.length >= 3;
                  return (
                    <button
                      key={trait}
                      onClick={() => toggleTrait(trait)}
                      disabled={disabled}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                        selected
                          ? "text-white border-transparent shadow-sm"
                          : disabled
                            ? "text-gray-300 border-gray-100 cursor-not-allowed"
                            : "text-gray-600 border-gray-200 hover:border-indigo-400 hover:text-indigo-600"
                      }`}
                      style={selected ? { backgroundColor: "#4f46e5", borderColor: "#4f46e5" } : undefined}
                    >
                      {trait}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {data.traits.length}/3 selected{data.traits.length === 3 && " — perfect! ✅"}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">Story themes (optional — choose any)</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {THEMES.map(({ emoji, label }) => (
                  <button
                    key={label}
                    onClick={() => toggleTheme(label)}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${
                      data.themes.includes(label)
                        ? "border-indigo-400 bg-indigo-50 text-indigo-700"
                        : "border-gray-200 text-gray-600 hover:border-indigo-200 hover:bg-indigo-50/50"
                    }`}
                  >
                    <span>{emoji}</span> {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Parent note (optional)</label>
              <textarea
                rows={2}
                value={data.parentNotes}
                onChange={(e) => setData({ ...data, parentNotes: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                placeholder="e.g. 'Starting a new school soon, loves dinosaurs, needs a confidence boost...'"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-4 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
                ← Back
              </button>
              <button
                disabled={!canGoStep3}
                onClick={() => setStep(3)}
                className="flex-[3] py-4 text-white font-bold text-lg rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.01] shadow-md"
                style={{ backgroundColor: "#4f46e5" }}
              >
                Build My Story →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Story ready ── */}
        {step === 3 && (
          <div className="space-y-6">
            {/* Character card */}
            <div className="rounded-2xl overflow-hidden border border-indigo-100 shadow-lg">
              <div
                className="px-6 py-5 text-white"
                style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #4f46e5 100%)" }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center text-3xl">
                    {data.favAnimal ? "🐾" : "⭐"}
                  </div>
                  <div>
                    <div className="text-xs text-indigo-300 uppercase tracking-widest font-bold mb-0.5">Your Hero</div>
                    <div className="text-xl font-bold">{data.name}</div>
                    <div className="text-indigo-300 text-sm">Age {data.age} · {data.pronouns}</div>
                  </div>
                </div>
              </div>
              <div className="bg-white px-6 py-5 space-y-3">
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Personality Traits</div>
                  <div className="flex flex-wrap gap-2">
                    {data.traits.map(t => (
                      <span key={t} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold">{t}</span>
                    ))}
                  </div>
                </div>
                {data.favAnimal && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-lg">🐾</span>
                    <span>Favourite animal: <strong>{data.favAnimal}</strong> — will appear in the story</span>
                  </div>
                )}
                {data.biggestDream && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-lg">🌟</span>
                    <span>Biggest dream: <strong>{data.biggestDream}</strong> — woven into the ending</span>
                  </div>
                )}
              </div>
            </div>

            {/* Story preview */}
            <div
              className="rounded-2xl p-5 border border-indigo-100"
              style={{ background: "linear-gradient(135deg, #ede9fe 0%, #e0f2fe 100%)" }}
            >
              <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">🚜 Story Preview — Chapter 1</div>
              <p className="text-gray-700 text-sm leading-relaxed italic" style={{ fontFamily: "Georgia, serif" }}>
                "The morning mist lay low over the fields when <strong>{data.name}</strong> found it — half-hidden beneath an old oak tree, covered in rust and wonder: the Time-Travelling Tractor. Something <strong>{data.traits[0]?.toLowerCase() || "brave"}</strong> stirred inside {data.pronouns === "she/her" ? "her" : data.pronouns === "he/him" ? "his" : "their"} chest…"
              </p>
            </div>

            <button
              onClick={launchStory}
              className="w-full py-5 text-white font-black text-xl rounded-2xl shadow-xl transition-all hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#1a1a1a" }}
            >
              🚜 Read {data.name}'s Story Now!
            </button>

            <p className="text-center text-xs text-gray-400">
              Your character profile is embedded in the story — every chapter is written just for {data.name}.
            </p>

            <button onClick={() => setStep(2)} className="w-full text-gray-400 text-sm hover:text-gray-600 transition-colors py-2">
              ← Edit personality
            </button>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
