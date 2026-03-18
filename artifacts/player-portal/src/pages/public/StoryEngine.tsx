import { useState, useEffect } from "react";
import { Link, useSearch } from "wouter";
import { PublicLayout } from "@/layouts/PublicLayout";

type Screen = "welcome" | "name" | "pronouns" | "companion" | "story" | "summary";
type Pronoun = "she/her" | "he/him" | "they/them";
type Companion = "cat" | "dinosaur" | "robot" | "dragon" | "fox" | "owl";

const COMPANION_OPTIONS: { id: Companion; emoji: string; label: string; desc: string }[] = [
  { id: "cat",      emoji: "🐱", label: "A Magical Cat",        desc: "Who can talk and knows all the secret paths" },
  { id: "fox",      emoji: "🦊", label: "A Clever Fox",         desc: "Quick, sharp, and always three steps ahead" },
  { id: "dinosaur", emoji: "🦕", label: "A Tiny Dinosaur",      desc: "Who fits in your pocket and loves adventure" },
  { id: "owl",      emoji: "🦉", label: "A Wise Owl",           desc: "Ancient knowledge hidden behind twinkling eyes" },
  { id: "robot",    emoji: "🤖", label: "A Friendly Robot",     desc: "Speaks 47 languages and maps every road" },
  { id: "dragon",   emoji: "🐉", label: "A Baby Dragon",        desc: "Breathes warm sparkles instead of fire" },
];

interface StoryState {
  name: string;
  pronoun: Pronoun | "";
  companion: Companion | null;
  traits: string[];
  favAnimal: string;
  biggestDream: string;
}

function pronounParts(pronoun: Pronoun | "") {
  if (pronoun === "she/her")   return { sub: "she", obj: "her",   pos: "her",   subCap: "She" };
  if (pronoun === "he/him")    return { sub: "he",  obj: "him",   pos: "his",   subCap: "He"  };
  return                              { sub: "they", obj: "them",  pos: "their", subCap: "They" };
}

function getStoryPages(s: StoryState) {
  const name      = s.name || "the adventurer";
  const p         = pronounParts(s.pronoun);
  const companion = COMPANION_OPTIONS.find((c) => c.id === s.companion);
  const cEmoji    = companion?.emoji ?? "🐱";
  const cLabel    = companion?.label ?? "a magical friend";

  const t1 = s.traits?.[0]?.toLowerCase() || "brave";
  const t2 = s.traits?.[1]?.toLowerCase() || "curious";
  const t3 = s.traits?.[2]?.toLowerCase() || "kind";
  const hasTrait  = s.traits.length > 0;
  const animal    = s.favAnimal?.trim();
  const dream     = s.biggestDream?.trim();

  return [
    {
      page: 1,
      title: "The Discovery",
      illustration: "🌾",
      text: `The morning mist lay low over the fields when ${name} found it — half-hidden beneath an old oak tree, covered in rust and wonder: the Time-Travelling Tractor. Something ${t1} stirred inside ${p.pos} chest as ${p.sub} reached out and touched the weathered steering wheel. It hummed with a warm golden glow — as if it had been waiting for someone exactly like ${name}.${animal ? ` In the hedgerow nearby, a ${animal} watched with knowing eyes.` : ""}`,
    },
    {
      page: 2,
      title: "An Unexpected Friend",
      illustration: cEmoji,
      text: `"Don't be scared," said a voice. ${name} spun around to find ${cLabel} ${cEmoji} perched on the mudguard, eyes bright with mischief. ${animal ? `"A ${animal} sent me to find you," ${p.pos} new companion said with a grin.` : `"The tractor told me you'd come," the companion said with a grin.`} "This isn't any ordinary tractor. It travels to the places where stories live — and it only chooses the most ${t1} of adventurers to carry." ${name} stood a little taller.`,
    },
    {
      page: 3,
      title: "The First Jump",
      illustration: "✨",
      text: `With ${p.pos} ${t2} mind racing, ${name} grabbed the wheel. The engine roared — not like thunder, but like a thousand stories being told at once. The sky folded. Colours swirled. And with a burst of golden light — silence. They had landed in a valley where sunflowers grew as tall as houses, and in the distance, a castle made entirely of light stood waiting. "What is this place?" ${name} whispered. "It's wherever you need it to be," replied ${p.pos} companion.`,
    },
    {
      page: 4,
      title: "The Challenge",
      illustration: "🏰",
      text: `The castle gates were locked. A sign carved in silver read: "Only those who know what they are truly meant for may enter." ${name} studied the words, ${t2} as ever. ${dream ? `${p.subCap} thought about ${p.pos} greatest dream — ${dream} — the thing ${p.sub} had always carried quietly in ${p.pos} heart.` : `${p.subCap} thought about all the moments ${p.sub} had felt truly, fully ${p.pos}self.`} The answer wasn't out there. It was already inside ${p.obj}.`,
    },
    {
      page: 5,
      title: "The Answer",
      illustration: "🗝️",
      text: `"${dream ? dream.charAt(0).toUpperCase() + dream.slice(1) : `To be exactly who I am`}," said ${name} — quietly but without any doubt. The gates swung open. Inside was a library that stretched all the way to the stars — every book ever written, and some not yet imagined. One book on the highest shelf glowed with a warm, steady light. It had ${p.pos} name on the cover.${hasTrait ? ` And on the spine, in golden letters: ${[t1, t2, t3].map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(", ")}.` : ""}`,
    },
    {
      page: 6,
      title: "Home",
      illustration: "🌅",
      text: `The tractor hummed ${name} home as the sun dipped low. ${p.subCap} climbed down, the glowing book tucked under ${p.pos} arm. "Same time tomorrow?" ${p.pos} companion asked. ${name} smiled the smile of someone who is ${t1}, ${t2}, and ${t3} — and who knows, with all ${p.pos} heart, that the best adventures are still to come.`,
    },
  ];
}

export default function StoryEngine() {
  const search = useSearch();
  const [screen, setScreen]         = useState<Screen>("welcome");
  const [story, setStory]           = useState<StoryState>({ name: "", pronoun: "", companion: null, traits: [], favAnimal: "", biggestDream: "" });
  const [currentPage, setCurrentPage] = useState(0);
  const [points, setPoints]         = useState(0);
  const [nameInput, setNameInput]   = useState("");
  const [fromBuilder, setFromBuilder] = useState(false);

  // Read pre-filled data from URL params (CharacterCreator sends these)
  useEffect(() => {
    const params = new URLSearchParams(search);
    const pName   = params.get("name")     || "";
    const pPronoun = params.get("pronoun") as Pronoun | null;
    const pTraits  = params.get("traits")  ? params.get("traits")!.split(",").filter(Boolean) : [];
    const pAnimal  = params.get("favAnimal") || "";
    const pDream   = params.get("dream")   || "";

    if (pName) {
      setStory(prev => ({ ...prev, name: pName, pronoun: pPronoun || "", traits: pTraits, favAnimal: pAnimal, biggestDream: pDream }));
      setNameInput(pName);
      setFromBuilder(true);
      // If we have name + pronoun from builder, skip straight to companion
      if (pPronoun) {
        setScreen("companion");
      } else {
        setScreen("companion");
      }
    }
  }, [search]);

  const pages = getStoryPages(story);
  const addPoints = (p: number) => setPoints((prev) => prev + p);
  const startStory = () => { addPoints(10); setCurrentPage(0); setScreen("story"); };
  const nextPage = () => { addPoints(5); currentPage < pages.length - 1 ? setCurrentPage((p) => p + 1) : setScreen("summary"); };
  const prevPage = () => { if (currentPage > 0) setCurrentPage((p) => p - 1); };
  const resetAll = () => { setScreen("welcome"); setStory({ name: "", pronoun: "", companion: null, traits: [], favAnimal: "", biggestDream: "" }); setCurrentPage(0); setPoints(0); setNameInput(""); setFromBuilder(false); };

  const BG = "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0c2340 100%)";

  return (
    <PublicLayout>
      <div className="min-h-screen relative" style={{ background: BG }}>

        {/* Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {["top-12 left-[10%]", "top-24 right-[15%]", "top-52 left-[33%]", "bottom-28 right-[22%]", "bottom-44 left-[58%]"].map((pos, i) => (
            <div key={i} className={`absolute ${pos} text-yellow-300 opacity-25 text-2xl`} style={{ animation: `bounce ${2 + i * 0.4}s ease-in-out infinite alternate` }}>✦</div>
          ))}
        </div>

        {/* Points counter */}
        {screen !== "welcome" && points > 0 && (
          <div className="fixed top-20 right-4 z-40 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-white text-sm font-semibold shadow-lg">
            ⭐ {points} pts
          </div>
        )}

        {/* Character loaded banner (from CharacterCreator) */}
        {fromBuilder && screen === "companion" && (
          <div className="fixed top-16 left-0 right-0 z-30 flex justify-center px-4 pt-3">
            <div className="bg-green-500/90 backdrop-blur-md text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-lg flex items-center gap-2 max-w-sm">
              ✓ {story.name}'s character loaded — choose your companion!
            </div>
          </div>
        )}

        <div className="relative max-w-2xl mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">

          {/* ── WELCOME ── */}
          {screen === "welcome" && (
            <div className="text-center">
              <div className="text-7xl mb-6">🚜</div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-3">The Time-Travelling Tractor</h1>
              <p className="text-blue-300 mb-10 max-w-md mx-auto leading-relaxed text-lg">
                An interactive adventure where <strong className="text-white">you</strong> become the hero. Build your character, choose your companion, and discover your story.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <button
                  onClick={() => setScreen("name")}
                  className="px-8 py-4 text-gray-900 font-bold text-lg rounded-xl shadow-xl transition-all hover:scale-[1.02]"
                  style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)" }}
                >
                  🚀 Start the Adventure
                </button>
                <Link href="/characters/create" className="px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold text-lg rounded-xl hover:bg-white/20 transition-all">
                  ✨ Build Character First
                </Link>
              </div>
              <div className="flex justify-center gap-6 text-sm text-blue-300">
                <span>⏱ 5 minutes</span>
                <span>🎯 Ages 3–16</span>
                <span>⭐ Earn adventure points</span>
              </div>
            </div>
          )}

          {/* ── NAME ── */}
          {screen === "name" && (
            <div className="text-center w-full max-w-md">
              <button
                onClick={() => setScreen("welcome")}
                className="flex items-center gap-2 text-sm text-blue-300 hover:text-white transition-colors mb-6 mx-auto"
              >
                <i className="ri-arrow-left-line"></i> Back
              </button>
              <div className="text-5xl mb-4">👤</div>
              <h2 className="text-3xl font-bold text-white mb-2">What's your name, brave adventurer?</h2>
              <p className="text-blue-300 mb-6">Your name will be written on every page of the story.</p>
              <input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl text-center text-xl text-white bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-white/30 mb-6"
                placeholder="Enter your name here..."
                onKeyDown={(e) => { if (e.key === "Enter" && nameInput.trim()) { setStory({ ...story, name: nameInput.trim() }); addPoints(10); setScreen("pronouns"); } }}
              />
              {nameInput.trim() && (
                <p className="text-yellow-300 mb-4 text-sm animate-pulse">✨ Every page will be written for <strong>{nameInput}</strong>!</p>
              )}
              <button
                disabled={!nameInput.trim()}
                onClick={() => { setStory({ ...story, name: nameInput.trim() }); addPoints(10); setScreen("pronouns"); }}
                className="px-10 py-4 text-gray-900 font-bold text-lg rounded-xl transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed shadow-xl"
                style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)" }}
              >
                That's my name! →
              </button>
            </div>
          )}

          {/* ── PRONOUNS ── */}
          {screen === "pronouns" && (
            <div className="text-center w-full max-w-md">
              <button
                onClick={() => setScreen("name")}
                className="flex items-center gap-2 text-sm text-blue-300 hover:text-white transition-colors mb-6 mx-auto"
              >
                <i className="ri-arrow-left-line"></i> Back
              </button>
              <div className="text-5xl mb-4">✌️</div>
              <h2 className="text-3xl font-bold text-white mb-2">Choose your pronouns</h2>
              <p className="text-blue-300 mb-8">The story will use these when telling {story.name}'s adventure.</p>
              <div className="space-y-3">
                {[
                  { value: "she/her", label: "She / Her", emoji: "💜" },
                  { value: "he/him", label: "He / Him", emoji: "💙" },
                  { value: "they/them", label: "They / Them", emoji: "💚" },
                ].map(({ value, label, emoji }) => (
                  <button
                    key={value}
                    onClick={() => { setStory({ ...story, pronoun: value as Pronoun }); addPoints(5); setScreen("companion"); }}
                    className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-semibold text-lg hover:bg-white/20 transition-all hover:scale-[1.02]"
                  >
                    <span className="text-2xl">{emoji}</span>
                    {label}
                    <span className="ml-auto text-white/40">→</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── COMPANION ── */}
          {screen === "companion" && (
            <div className="text-center w-full max-w-md">
              {fromBuilder ? (
                <Link
                  href="/characters/create"
                  className="flex items-center gap-2 text-sm text-blue-300 hover:text-white transition-colors mb-6 mx-auto w-fit"
                >
                  <i className="ri-arrow-left-line"></i> Edit character
                </Link>
              ) : (
                <button
                  onClick={() => setScreen("pronouns")}
                  className="flex items-center gap-2 text-sm text-blue-300 hover:text-white transition-colors mb-6 mx-auto"
                >
                  <i className="ri-arrow-left-line"></i> Back
                </button>
              )}
              <div className="text-5xl mb-4">🤝</div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Choose {story.name ? `${story.name}'s` : "your"} adventure companion
              </h2>
              <p className="text-blue-300 mb-8">Every hero needs a friend by their side.</p>
              <div className="space-y-3">
                {COMPANION_OPTIONS.map(({ id, emoji, label, desc }) => (
                  <button
                    key={id}
                    onClick={() => { setStory({ ...story, companion: id }); addPoints(15); startStory(); }}
                    className="w-full flex items-start gap-4 px-5 py-4 rounded-2xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all hover:scale-[1.02] text-left"
                  >
                    <span className="text-3xl flex-shrink-0">{emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold">{label}</div>
                      <div className="text-sm text-blue-300 leading-relaxed">{desc}</div>
                    </div>
                    <span className="text-white/30 flex-shrink-0 mt-1">→</span>
                  </button>
                ))}
              </div>
              {/* Show traits preview if loaded from builder */}
              {story.traits.length > 0 && (
                <div className="mt-5 pt-5 border-t border-white/10">
                  <p className="text-blue-300/60 text-xs mb-2">Character traits woven into your story:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {story.traits.map(t => (
                      <span key={t} className="text-xs bg-orange-400/20 text-orange-300 border border-orange-400/30 px-2.5 py-0.5 rounded-full">{t}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── STORY PAGES ── */}
          {screen === "story" && pages[currentPage] && (
            <div className="w-full">
              <div className="mb-6">
                <div className="flex justify-between text-xs text-blue-300/70 mb-1.5">
                  <span>Page {currentPage + 1} of {pages.length}</span>
                  <span>⭐ {points} points</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${((currentPage + 1) / pages.length) * 100}%`, background: "linear-gradient(90deg, #f97316, #fbbf24)" }}
                  />
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                {/* Illustration */}
                <div
                  className="w-full flex items-center justify-center py-10"
                  style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)", fontSize: 80 }}
                >
                  {pages[currentPage].illustration}
                </div>

                <div className="p-6 md:p-8">
                  <p className="text-orange-400/80 text-xs font-bold uppercase tracking-widest mb-2">
                    Chapter {currentPage + 1}: {pages[currentPage].title}
                  </p>
                  <p className="text-white text-base md:text-lg leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>
                    {pages[currentPage].text}
                  </p>
                </div>

                <div className="px-6 pb-6 flex gap-3 flex-wrap">
                  {currentPage > 0 && (
                    <button onClick={prevPage} className="flex items-center gap-2 px-5 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors">
                      ← Previous
                    </button>
                  )}
                  <button
                    onClick={nextPage}
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-3 text-gray-900 font-bold rounded-xl transition-all hover:scale-[1.02] shadow-lg"
                    style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)" }}
                  >
                    {currentPage < pages.length - 1 ? "Next Page →" : "Finish the Adventure! 🎉"}
                  </button>
                  <button onClick={resetAll} className="px-4 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors" title="Restart">
                    🏠
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── SUMMARY ── */}
          {screen === "summary" && (
            <div className="text-center w-full max-w-md">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-3xl font-bold text-white mb-2">Adventure Complete!</h2>
              <p className="text-blue-300 mb-6 text-lg">
                <strong className="text-white">{story.name || "Your hero"}</strong> has completed The Time-Travelling Tractor!
              </p>

              <div className="bg-white/8 border border-white/15 rounded-2xl p-6 mb-8">
                <div className="grid grid-cols-2 gap-5">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-300">{points}</div>
                    <p className="text-blue-300 text-xs mt-1">Adventure Points</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400">{pages.length}</div>
                    <p className="text-blue-300 text-xs mt-1">Chapters Read</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl">{COMPANION_OPTIONS.find((c) => c.id === story.companion)?.emoji ?? "⭐"}</div>
                    <p className="text-blue-300 text-xs mt-1">Companion</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl">🏅</div>
                    <p className="text-blue-300 text-xs mt-1">Hero Badge</p>
                  </div>
                </div>

                {story.traits.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-blue-300/60 text-xs mb-2">This story was personalised for:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {story.traits.map(t => (
                        <span key={t} className="text-xs bg-orange-400/20 text-orange-300 border border-orange-400/30 px-2.5 py-0.5 rounded-full">{t}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3">
                {story.name ? (
                  <Link
                    href={`/characters/create`}
                    className="block px-8 py-4 font-bold text-lg rounded-xl shadow-xl text-gray-900"
                    style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)" }}
                  >
                    ✨ Create {story.name}'s Full Character →
                  </Link>
                ) : (
                  <Link
                    href="/characters/create"
                    className="block px-8 py-4 font-bold text-lg rounded-xl shadow-xl text-gray-900 text-center"
                    style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)" }}
                  >
                    ✨ Build Your Full Character
                  </Link>
                )}
                <button
                  onClick={resetAll}
                  className="px-8 py-4 bg-white/10 text-white font-semibold text-lg rounded-xl hover:bg-white/20 transition-colors"
                >
                  🔄 Play Again
                </button>
                <Link href="/" className="block px-8 py-4 text-blue-300 font-medium text-base hover:text-white transition-colors text-center">
                  ← Back to home
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
