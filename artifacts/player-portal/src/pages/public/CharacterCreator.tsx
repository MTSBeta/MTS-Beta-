import { useState } from "react";
import { Link } from "wouter";
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

const STORIES = [
  { title: "The Ocean Guardian", desc: "Discover magical powers to communicate with sea creatures and embark on an underwater adventure to save the ocean.", tags: ["Adventure", "Nature", "Bravery"] },
  { title: "Dreamland Lullaby", desc: "When sleep won't come, discover the secret of the stars' bedtime song in a peaceful adventure through dreamland.", tags: ["Bedtime Calm", "Imagination"] },
  { title: "The Smart Solution", desc: "When forest animals lose their way home, use clever thinking and a kind heart to create a solution that helps everyone.", tags: ["Friendship", "Problem-Solving"] },
  { title: "The Confidence Mountain", desc: "Feel nervous about a big challenge? Climb the Confidence Mountain and discover your inner strength with a trusted friend.", tags: ["Confidence", "Resilience"] },
  { title: "The Kickabout Kid", desc: "When the team needs a hero, step up to the pitch and show what you're really made of — on and off the ball.", tags: ["Sport", "Teamwork"] },
  { title: "The Kindness Circle", desc: "When small creatures need help, your gentle nature and smart ideas create a chain of kindness that spreads everywhere.", tags: ["Kindness", "Community"] },
];

const AVATARS = ["🦁", "🐯", "🐼", "🦊", "🦄", "🐲", "🐬", "🦅", "🐘", "🦋"];

export default function CharacterCreator() {
  const [step, setStep] = useState(1);
  const [avatar, setAvatar] = useState("🦁");
  const [data, setData] = useState<CharacterData>({
    name: "", age: "", pronouns: "", favAnimal: "", biggestDream: "", traits: [], themes: [], parentNotes: "",
  });
  const [submitted, setSubmitted] = useState(false);

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

  return (
    <PublicLayout>
      {/* Progress header */}
      <section
        className="py-10 text-white"
        style={{ background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)" }}
      >
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Create Your Story Character</h1>
          <p className="text-indigo-200 mb-6">3 steps to your child's personalised adventure</p>
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    step === s ? "bg-white text-indigo-600" : step > s ? "bg-green-400 text-white" : "bg-white/20 text-white"
                  }`}
                >
                  {step > s ? <i className="ri-check-line"></i> : s}
                </div>
                {s < 3 && <div className={`w-12 h-0.5 ${step > s ? "bg-green-400" : "bg-white/20"}`} />}
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-12 mt-2">
            {["Character Builder", "Personality & Themes", "Your Story Library"].map((label, i) => (
              <span key={label} className={`text-xs ${step === i + 1 ? "text-white font-medium" : "text-white/50"}`}>
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 py-12">

        {/* ── STEP 1: Character Builder ── */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Step 1: Character Builder</h2>

            {/* Avatar picker */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <p className="text-sm font-semibold text-gray-700 mb-4">Choose an avatar for your hero</p>
              <div className="flex flex-wrap gap-3 justify-center mb-4">
                {AVATARS.map((em) => (
                  <button
                    key={em}
                    onClick={() => setAvatar(em)}
                    className={`w-14 h-14 rounded-2xl text-3xl flex items-center justify-center transition-all ${
                      avatar === em ? "ring-4 ring-indigo-500 scale-110 bg-indigo-50" : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>
              {/* Avatar preview */}
              <div className="w-24 h-24 mx-auto rounded-2xl flex items-center justify-center text-5xl shadow-inner bg-gradient-to-br from-indigo-100 to-purple-100">
                {avatar}
              </div>
            </div>

            {/* Name & Age */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Hero's Name</label>
                <input
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your hero's name"
                />
                {data.name && (
                  <p className="text-xs text-indigo-600 mt-1.5">✨ Every page of the story will say <strong>{data.name}</strong></p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Age</label>
                <input
                  type="number"
                  min={3}
                  max={12}
                  value={data.age}
                  onChange={(e) => setData({ ...data, age: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. 7"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Pronouns</label>
                <select
                  value={data.pronouns}
                  onChange={(e) => setData({ ...data, pronouns: e.target.value as Pronoun })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="">Select...</option>
                  <option value="she/her">She/Her</option>
                  <option value="he/him">He/Him</option>
                  <option value="they/them">They/Them</option>
                </select>
              </div>
            </div>

            {/* Favourite things */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Favourite Animal</label>
              <input
                value={data.favAnimal}
                onChange={(e) => setData({ ...data, favAnimal: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Lion, Cat, Dragon..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Biggest Dream</label>
              <input
                value={data.biggestDream}
                onChange={(e) => setData({ ...data, biggestDream: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="To become an astronaut, help animals..."
              />
            </div>

            <button
              disabled={!canGoStep2}
              onClick={() => setStep(2)}
              className="w-full py-4 text-white font-semibold text-lg rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#6366f1" }}
            >
              Continue to Personality & Themes →
            </button>
          </div>
        )}

        {/* ── STEP 2: Personality & Themes ── */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Step 2: Personality & Themes</h2>

            {/* Traits */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">
                Select exactly 3 personality traits for{" "}
                <strong className="text-indigo-600">{data.name || "your hero"}</strong>
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
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                        selected
                          ? "text-white border-transparent"
                          : disabled
                            ? "text-gray-300 border-gray-100 cursor-not-allowed"
                            : "text-gray-600 border-gray-200 hover:border-indigo-400 hover:text-indigo-600"
                      }`}
                      style={selected ? { backgroundColor: "#6366f1", borderColor: "#6366f1" } : undefined}
                    >
                      {trait}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {data.traits.length}/3 traits selected
                {data.traits.length === 3 && " ✅"}
              </p>
            </div>

            {/* Themes */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">What story themes matter most? (choose any)</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {THEMES.map(({ emoji, label }) => (
                  <button
                    key={label}
                    onClick={() => toggleTheme(label)}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${
                      data.themes.includes(label)
                        ? "border-indigo-400 bg-indigo-50 text-indigo-700"
                        : "border-gray-200 text-gray-600 hover:border-indigo-200"
                    }`}
                  >
                    <span>{emoji}</span>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Parent notes */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Parent Notes (optional)</label>
              <textarea
                rows={3}
                value={data.parentNotes}
                onChange={(e) => setData({ ...data, parentNotes: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                placeholder="e.g. 'Starting a new school soon, loves dinosaurs, needs a confidence boost...'"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-4 border-2 border-gray-200 text-gray-600 font-semibold text-lg rounded-xl hover:bg-gray-50 transition-colors"
              >
                ← Back
              </button>
              <button
                disabled={!canGoStep3}
                onClick={() => setStep(3)}
                className="flex-[3] py-4 text-white font-semibold text-lg rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#6366f1" }}
              >
                See Your Story Library →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Story Library ── */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">{avatar}</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {data.name ? `${data.name}'s Personalised Library` : "Your Personalised Library"}
              </h2>
              <p className="text-gray-500 text-sm">
                Each story features {data.name || "your hero"} as the main character — with{" "}
                {data.traits.slice(0, 2).join(", ") || "unique traits"} woven into every adventure.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {STORIES.map(({ title, desc, tags }) => (
                <div key={title} className="border border-gray-100 rounded-2xl p-4 hover:border-indigo-200 hover:shadow-sm transition-all">
                  <div className="w-full h-24 rounded-xl mb-3 flex items-center justify-center text-3xl"
                    style={{ background: "linear-gradient(135deg, #ede9fe 0%, #fce7f3 100%)" }}>
                    📖
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1 text-sm">{title}</h4>
                  <p className="text-xs text-gray-500 mb-2 leading-relaxed">
                    {desc.replace(/you/gi, data.name || "your hero")}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {tags.map((t) => (
                      <span key={t} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
                <div className="text-3xl mb-2">🎉</div>
                <h3 className="font-bold text-green-900 mb-1">Character saved!</h3>
                <p className="text-green-700 text-sm">We'll be in touch with {data.name || "your child"}'s first story.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setSubmitted(true)}
                  className="w-full py-4 text-white font-semibold text-lg rounded-xl shadow-lg"
                  style={{ background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)" }}
                >
                  Start Reading — Get {data.name || "Your"}'s First Story
                </button>
                <button
                  onClick={() => setStep(1)}
                  className="w-full py-4 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Edit Character
                </button>
                <Link
                  href="/stories/time-travelling-tractor"
                  className="block w-full py-4 text-center border-2 border-indigo-200 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-colors"
                >
                  Try Our Story Engine First
                </Link>
              </div>
            )}

            <button onClick={() => setStep(2)} className="w-full text-gray-400 text-sm hover:text-gray-600 transition-colors">
              ← Back to Personality
            </button>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
