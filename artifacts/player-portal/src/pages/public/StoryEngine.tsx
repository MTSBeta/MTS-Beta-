import { useState } from "react";
import { Link } from "wouter";
import { PublicLayout } from "@/layouts/PublicLayout";

type Screen =
  | "welcome"
  | "name"
  | "pronouns"
  | "appearance"
  | "companion"
  | "story"
  | "summary";

type Pronoun = "she/her" | "he/him" | "they/them";
type Appearance = "red" | "blue" | "green" | "purple";
type Companion = "cat" | "dinosaur" | "robot" | "dragon";

const APPEARANCE_OPTIONS: { id: Appearance; emoji: string; label: string; color: string }[] = [
  { id: "red", emoji: "🧢", label: "Red Cap Adventurer", color: "#ef4444" },
  { id: "blue", emoji: "🎒", label: "Blue Backpack Explorer", color: "#3b82f6" },
  { id: "green", emoji: "🌿", label: "Green Nature Ranger", color: "#10b981" },
  { id: "purple", emoji: "⭐", label: "Purple Star Traveller", color: "#8b5cf6" },
];

const COMPANION_OPTIONS: { id: Companion; emoji: string; label: string; desc: string }[] = [
  { id: "cat", emoji: "🐱", label: "A Magical Cat", desc: "Who can talk and knows all the secret paths" },
  { id: "dinosaur", emoji: "🦕", label: "A Tiny Dinosaur", desc: "Who fits in your pocket and loves adventure" },
  { id: "robot", emoji: "🤖", label: "A Friendly Robot", desc: "Who speaks 47 languages and maps every road" },
  { id: "dragon", emoji: "🐉", label: "A Baby Dragon", desc: "Who breathes warm sparkles instead of fire" },
];

interface StoryState {
  name: string;
  pronoun: Pronoun | "";
  appearance: Appearance | null;
  companion: Companion | null;
}

const getStoryPages = (s: StoryState) => {
  const name = s.name || "the adventurer";
  const pronoun = s.pronoun === "she/her" ? "she" : s.pronoun === "he/him" ? "he" : "they";
  const possessive = pronoun === "they" ? "their" : pronoun === "she" ? "her" : "his";
  const companionEmoji = COMPANION_OPTIONS.find((c) => c.id === s.companion)?.emoji ?? "🐱";
  const companionLabel = COMPANION_OPTIONS.find((c) => c.id === s.companion)?.label ?? "a magical friend";
  const appearanceEmoji = APPEARANCE_OPTIONS.find((a) => a.id === s.appearance)?.emoji ?? "🌟";

  return [
    {
      page: 1,
      title: "The Discovery",
      illustration: "🌾",
      text: `The morning mist lay low over the fields when ${name} found it — half-hidden in the hedgerow, covered in rust and mystery: the Time-Travelling Tractor. ${pronoun.charAt(0).toUpperCase() + pronoun.slice(1)} touched the old steering wheel, and it hummed with a warm golden glow.`,
    },
    {
      page: 2,
      title: "An Unexpected Friend",
      illustration: companionEmoji,
      text: `"Don't be scared," said a voice. ${name} spun around to see ${companionLabel} ${companionEmoji} perched on the mudguard. "This tractor doesn't go to the shops," ${possessive} new friend explained. "It goes to ${pronoun === "they" ? "their" : pronoun === "she" ? "her" : "his"} stories. It goes to ANYWHERE." `,
    },
    {
      page: 3,
      title: "The First Jump",
      illustration: "✨",
      text: `With ${possessive} heart pounding, ${name} climbed up and grabbed the wheel. The engine roared — not like thunder, but like music. The world shimmered, colours swirled, and then... silence. They had landed in a field of sunflowers as tall as houses, and in the distance, a castle made entirely of light.`,
    },
    {
      page: 4,
      title: "The Challenge",
      illustration: "🏰",
      text: `The castle gates were locked. A sign read: "Only those who know their own courage may enter." ${name} looked at ${possessive} companion, then at ${possessive} own reflection in the castle's golden walls. ${pronoun.charAt(0).toUpperCase() + pronoun.slice(1)} thought about all the times ${pronoun} had been afraid — and had done the thing anyway.`,
    },
    {
      page: 5,
      title: "The Answer",
      illustration: "🗝️",
      text: `"I know my courage," said ${name} quietly. "It's not about not being scared. It's about going anyway." The gates swung open. Inside was a library that stretched to the sky — every book about every adventure that had ever happened, and some that were yet to come. One book had ${possessive} name on the cover.`,
    },
    {
      page: 6,
      title: "Home",
      illustration: "🌅",
      text: `The tractor hummed them home as the sun dipped low. ${name} climbed down, the magical book tucked under ${possessive} arm. "Same time tomorrow?" asked ${possessive} companion with a grin. And ${name} smiled the smile of someone who knows they have a thousand adventures still to come.`,
    },
  ];
};

export default function StoryEngine() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [story, setStory] = useState<StoryState>({ name: "", pronoun: "", appearance: null, companion: null });
  const [currentPage, setCurrentPage] = useState(0);
  const [points, setPoints] = useState(0);
  const [nameInput, setNameInput] = useState("");

  const pages = getStoryPages(story);

  const addPoints = (p: number) => setPoints((prev) => prev + p);

  const startStory = () => {
    addPoints(10);
    setCurrentPage(0);
    setScreen("story");
  };

  const nextPage = () => {
    addPoints(5);
    if (currentPage < pages.length - 1) {
      setCurrentPage((p) => p + 1);
    } else {
      setScreen("summary");
    }
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage((p) => p - 1);
  };

  const resetAll = () => {
    setScreen("welcome");
    setStory({ name: "", pronoun: "", appearance: null, companion: null });
    setCurrentPage(0);
    setPoints(0);
    setNameInput("");
  };

  return (
    <PublicLayout>
      <div
        className="min-h-screen relative"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0c2340 100%)",
        }}
      >
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {["top-12 left-[10%]", "top-24 right-[15%]", "top-48 left-[30%]", "bottom-24 right-[20%]", "bottom-40 left-[60%]"].map((pos, i) => (
            <div
              key={i}
              className={`absolute ${pos} text-yellow-300 opacity-30 text-2xl`}
              style={{ animation: `bounce ${2 + i * 0.4}s ease-in-out infinite alternate` }}
            >
              ✦
            </div>
          ))}
        </div>

        {/* Points counter */}
        {screen !== "welcome" && points > 0 && (
          <div className="fixed top-20 right-4 z-40 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-white text-sm font-semibold">
            ⭐ {points} Adventure Points
          </div>
        )}

        <div className="relative max-w-2xl mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">

          {/* WELCOME */}
          {screen === "welcome" && (
            <div className="text-center">
              <div className="text-7xl mb-6">🚜</div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-3">Story Engine</h1>
              <p className="text-indigo-200 text-xl mb-2 italic">The Time-Travelling Tractor</p>
              <p className="text-blue-300 mb-10 max-w-md mx-auto leading-relaxed">
                An interactive adventure where YOU become the hero. Choose your character, your companion, and write your own ending.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setScreen("name")}
                  className="px-8 py-4 text-white font-bold text-lg rounded-xl shadow-xl transition-all hover:scale-105"
                  style={{ background: "linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)" }}
                >
                  🚀 Start the Adventure
                </button>
                <Link
                  href="/"
                  className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-lg rounded-xl transition-colors"
                >
                  🏠 Back to Home
                </Link>
              </div>
              <div className="mt-8 flex justify-center gap-6 text-sm text-blue-300">
                <span>⏱ 5 minutes</span>
                <span>🎯 Ages 5–12</span>
                <span>⭐ Earn adventure points</span>
              </div>
            </div>
          )}

          {/* NAME */}
          {screen === "name" && (
            <div className="text-center w-full max-w-md">
              <div className="text-5xl mb-4">👤</div>
              <h2 className="text-3xl font-bold text-white mb-2">What's your name, brave adventurer?</h2>
              <p className="text-blue-300 mb-6">Your name will be on every page of the story.</p>
              <input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl text-center text-xl text-white bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-white/30 mb-6"
                placeholder="Enter your name here..."
                onKeyDown={(e) => e.key === "Enter" && nameInput.trim() && (setStory({ ...story, name: nameInput.trim() }), addPoints(10), setScreen("pronouns"))}
              />
              {nameInput.trim() && (
                <p className="text-yellow-300 mb-4 text-sm animate-pulse">
                  ✨ Welcome, <strong>{nameInput}</strong>! Every page will be written just for you.
                </p>
              )}
              <button
                disabled={!nameInput.trim()}
                onClick={() => { setStory({ ...story, name: nameInput.trim() }); addPoints(10); setScreen("pronouns"); }}
                className="px-10 py-4 text-white font-bold text-lg rounded-xl transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)" }}
              >
                That's my name! →
              </button>
            </div>
          )}

          {/* PRONOUNS */}
          {screen === "pronouns" && (
            <div className="text-center w-full max-w-md">
              <div className="text-5xl mb-4">✌️</div>
              <h2 className="text-3xl font-bold text-white mb-2">Choose your pronouns</h2>
              <p className="text-blue-300 mb-8">The story will use these to tell {story.name}'s adventure.</p>
              <div className="space-y-3">
                {[
                  { value: "she/her", label: "She / Her", emoji: "💜" },
                  { value: "he/him", label: "He / Him", emoji: "💙" },
                  { value: "they/them", label: "They / Them", emoji: "💚" },
                ].map(({ value, label, emoji }) => (
                  <button
                    key={value}
                    onClick={() => { setStory({ ...story, pronoun: value as Pronoun }); addPoints(5); setScreen("appearance"); }}
                    className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-semibold text-lg hover:bg-white/20 transition-all hover:scale-[1.02]"
                  >
                    <span className="text-2xl">{emoji}</span>
                    {label}
                    <i className="ri-arrow-right-line ml-auto text-white/50"></i>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* APPEARANCE */}
          {screen === "appearance" && (
            <div className="text-center w-full max-w-md">
              <div className="text-5xl mb-4">🎨</div>
              <h2 className="text-3xl font-bold text-white mb-2">What kind of adventurer is {story.name}?</h2>
              <p className="text-blue-300 mb-8">Choose your adventurer style.</p>
              <div className="grid grid-cols-2 gap-3">
                {APPEARANCE_OPTIONS.map(({ id, emoji, label, color }) => (
                  <button
                    key={id}
                    onClick={() => { setStory({ ...story, appearance: id }); addPoints(10); setScreen("companion"); }}
                    className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-white/10 border border-white/20 text-white hover:scale-105 transition-all"
                    style={{ borderColor: story.appearance === id ? color : undefined }}
                  >
                    <span className="text-4xl">{emoji}</span>
                    <span className="text-sm font-semibold">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* COMPANION */}
          {screen === "companion" && (
            <div className="text-center w-full max-w-md">
              <div className="text-5xl mb-4">🤝</div>
              <h2 className="text-3xl font-bold text-white mb-2">Choose your adventure companion</h2>
              <p className="text-blue-300 mb-8">Every hero needs a friend by their side.</p>
              <div className="space-y-3">
                {COMPANION_OPTIONS.map(({ id, emoji, label, desc }) => (
                  <button
                    key={id}
                    onClick={() => { setStory({ ...story, companion: id }); addPoints(15); startStory(); }}
                    className="w-full flex items-start gap-4 px-5 py-4 rounded-2xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all hover:scale-[1.02] text-left"
                  >
                    <span className="text-3xl flex-shrink-0">{emoji}</span>
                    <div>
                      <div className="font-semibold">{label}</div>
                      <div className="text-sm text-blue-300">{desc}</div>
                    </div>
                    <i className="ri-arrow-right-line ml-auto text-white/40 flex-shrink-0 mt-1"></i>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STORY PAGES */}
          {screen === "story" && pages[currentPage] && (
            <div className="w-full">
              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-blue-300 mb-1">
                  <span>Page {currentPage + 1} of {pages.length}</span>
                  <span>⭐ {points} points</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full">
                  <div
                    className="h-1.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${((currentPage + 1) / pages.length) * 100}%`,
                      backgroundColor: "#6366f1",
                    }}
                  />
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8">
                {/* Illustration */}
                <div
                  className="w-full h-48 md:h-64 rounded-2xl flex items-center justify-center text-8xl mb-6"
                  style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)" }}
                >
                  {pages[currentPage].illustration}
                </div>

                {/* Story text */}
                <div className="mb-6">
                  <p className="text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2">
                    Chapter {currentPage + 1}: {pages[currentPage].title}
                  </p>
                  <p className="text-white text-lg leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>
                    {pages[currentPage].text}
                  </p>
                </div>

                {/* Navigation */}
                <div className="flex gap-3 flex-wrap">
                  {currentPage > 0 && (
                    <button
                      onClick={prevPage}
                      className="flex items-center gap-2 px-5 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors"
                    >
                      <i className="ri-arrow-left-line"></i> Previous
                    </button>
                  )}
                  <button
                    onClick={nextPage}
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-3 text-white font-semibold rounded-xl transition-all hover:scale-[1.02]"
                    style={{ backgroundColor: "#6366f1" }}
                  >
                    {currentPage < pages.length - 1 ? (
                      <><span>Next Page</span> <i className="ri-arrow-right-line"></i></>
                    ) : (
                      <><span>Finish Adventure! 🎉</span></>
                    )}
                  </button>
                  <button
                    onClick={resetAll}
                    className="flex items-center gap-2 px-5 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors"
                  >
                    <i className="ri-home-line"></i>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SUMMARY */}
          {screen === "summary" && (
            <div className="text-center w-full max-w-md">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-3xl font-bold text-white mb-2">Adventure Complete!</h2>
              <p className="text-blue-300 mb-6">
                {story.name} completed The Time-Travelling Tractor adventure!
              </p>
              <div className="bg-white/10 border border-white/20 rounded-2xl p-6 mb-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-300">{points}</div>
                    <p className="text-blue-300 text-xs mt-1">Adventure Points</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400">{pages.length}</div>
                    <p className="text-blue-300 text-xs mt-1">Chapters Read</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl">
                      {COMPANION_OPTIONS.find((c) => c.id === story.companion)?.emoji ?? "⭐"}
                    </div>
                    <p className="text-blue-300 text-xs mt-1">Companion</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl">🏅</div>
                    <p className="text-blue-300 text-xs mt-1">Hero Badge</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Link
                  href="/characters/create"
                  className="block px-8 py-4 text-white font-semibold text-lg rounded-xl"
                  style={{ backgroundColor: "#6366f1" }}
                >
                  Create {story.name}'s Full Character →
                </Link>
                <button
                  onClick={resetAll}
                  className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-lg rounded-xl transition-colors"
                >
                  🔄 Play Again
                </button>
                <Link
                  href="/"
                  className="px-8 py-4 bg-white/10 text-white font-semibold text-lg rounded-xl hover:bg-white/20 transition-colors"
                >
                  🏠 Back to Home
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
