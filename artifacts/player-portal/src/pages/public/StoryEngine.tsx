import { useState, useEffect } from "react";
import { Link, useSearch } from "wouter";
import { PublicLayout } from "@/layouts/PublicLayout";

type Screen = "welcome" | "name" | "pronouns" | "companion" | "story" | "summary";
type Pronoun = "she/her" | "he/him" | "they/them";
type Companion = "cat" | "dinosaur" | "robot" | "dragon" | "fox" | "owl";

const COMPANION_OPTIONS: { id: Companion; emoji: string; label: string; desc: string; color: string }[] = [
  { id: "cat",      emoji: "🐱", label: "A Magical Cat",    desc: "Knows all the secret paths and whispers in moonlight",  color: "#8b5cf6" },
  { id: "fox",      emoji: "🦊", label: "A Clever Fox",     desc: "Quick, sharp, always three steps ahead",                color: "#f97316" },
  { id: "dinosaur", emoji: "🦕", label: "A Tiny Dinosaur",  desc: "Fits in your pocket, loves adventure",                  color: "#10b981" },
  { id: "owl",      emoji: "🦉", label: "A Wise Owl",       desc: "Ancient knowledge behind twinkling eyes",               color: "#fbbf24" },
  { id: "robot",    emoji: "🤖", label: "A Friendly Robot", desc: "Speaks 47 languages and maps every road",              color: "#3b82f6" },
  { id: "dragon",   emoji: "🐉", label: "A Baby Dragon",    desc: "Breathes warm sparkles instead of fire",               color: "#ef4444" },
];

const CHAPTER_MOODS = [
  { bg: "linear-gradient(160deg, #3d1a00 0%, #7c3a00 50%, #f97316 100%)", accent: "#f97316", icon: "ri-seedling-line" },
  { bg: "linear-gradient(160deg, #064e3b 0%, #065f46 50%, #10b981 100%)", accent: "#10b981", icon: "ri-star-smile-line" },
  { bg: "linear-gradient(160deg, #2d1260 0%, #5b1f8a 50%, #9333ea 100%)", accent: "#c084fc", icon: "ri-flashlight-line" },
  { bg: "linear-gradient(160deg, #1a0c04 0%, #7c3a00 50%, #d97706 100%)", accent: "#fbbf24", icon: "ri-door-lock-line" },
  { bg: "linear-gradient(160deg, #3d0a0a 0%, #7c1d1d 50%, #dc2626 100%)", accent: "#fca5a5", icon: "ri-key-2-line" },
  { bg: "linear-gradient(160deg, #7c1d1d 0%, #b45309 50%, #fbbf24 100%)", accent: "#fbbf24", icon: "ri-home-heart-line" },
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
      page: 1, title: "The Discovery", illustration: "🌾",
      text: `The morning mist lay low over the fields when ${name} found it — half-hidden beneath an old oak tree, covered in rust and wonder: the Time-Travelling Tractor. Something ${t1} stirred inside ${p.pos} chest as ${p.sub} reached out and touched the weathered steering wheel. It hummed with a warm golden glow — as if it had been waiting for someone exactly like ${name}.${animal ? ` In the hedgerow nearby, a ${animal} watched with knowing eyes.` : ""}`,
    },
    {
      page: 2, title: "An Unexpected Friend", illustration: cEmoji,
      text: `"Don't be scared," said a voice. ${name} spun around to find ${cLabel} ${cEmoji} perched on the mudguard, eyes bright with mischief. ${animal ? `"A ${animal} sent me to find you," ${p.pos} new companion said with a grin.` : `"The tractor told me you'd come," the companion said with a grin.`} "This isn't any ordinary tractor. It travels to the places where stories live — and it only chooses the most ${t1} of adventurers to carry." ${name} stood a little taller.`,
    },
    {
      page: 3, title: "The First Jump", illustration: "✨",
      text: `With ${p.pos} ${t2} mind racing, ${name} grabbed the wheel. The engine roared — not like thunder, but like a thousand stories being told at once. The sky folded. Colours swirled. And with a burst of golden light — silence. They had landed in a valley where sunflowers grew as tall as houses, and in the distance, a castle made entirely of light stood waiting. "What is this place?" ${name} whispered. "It's wherever you need it to be," replied ${p.pos} companion.`,
    },
    {
      page: 4, title: "The Challenge", illustration: "🏰",
      text: `The castle gates were locked. A sign carved in silver read: "Only those who know what they are truly meant for may enter." ${name} studied the words, ${t2} as ever. ${dream ? `${p.subCap} thought about ${p.pos} greatest dream — ${dream} — the thing ${p.sub} had always carried quietly in ${p.pos} heart.` : `${p.subCap} thought about all the moments ${p.sub} had felt truly, fully ${p.pos}self.`} The answer wasn't out there. It was already inside ${p.obj}.`,
    },
    {
      page: 5, title: "The Answer", illustration: "🗝️",
      text: `"${dream ? dream.charAt(0).toUpperCase() + dream.slice(1) : `To be exactly who I am`}," said ${name} — quietly but without any doubt. The gates swung open. Inside was a library that stretched all the way to the stars — every book ever written, and some not yet imagined. One book on the highest shelf glowed with a warm, steady light. It had ${p.pos} name on the cover.${hasTrait ? ` And on the spine, in golden letters: ${[t1, t2, t3].map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(", ")}.` : ""}`,
    },
    {
      page: 6, title: "Home", illustration: "🌅",
      text: `The tractor hummed ${name} home as the sun dipped low. ${p.subCap} climbed down, the glowing book tucked under ${p.pos} arm. "Same time tomorrow?" ${p.pos} companion asked. ${name} smiled the smile of someone who is ${t1}, ${t2}, and ${t3} — and who knows, with all ${p.pos} heart, that the best adventures are still to come.`,
    },
  ];
}

const DARK_BG = "radial-gradient(ellipse at 50% 0%, #1a0c04 0%, #0d0802 55%, #060402 100%)";

const GlassPanel = ({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) => (
  <div
    className={`rounded-3xl overflow-hidden ${className}`}
    style={{
      backdropFilter: "blur(24px)",
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.09)",
      boxShadow: "0 24px 64px rgba(0,0,0,0.50)",
      ...style,
    }}
  >
    {children}
  </div>
);

export default function StoryEngine() {
  const search = useSearch();
  const [screen, setScreen]         = useState<Screen>("welcome");
  const [story, setStory]           = useState<StoryState>({ name: "", pronoun: "", companion: null, traits: [], favAnimal: "", biggestDream: "" });
  const [currentPage, setCurrentPage] = useState(0);
  const [points, setPoints]         = useState(0);
  const [nameInput, setNameInput]   = useState("");
  const [fromBuilder, setFromBuilder] = useState(false);

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
      setScreen("companion");
    }
  }, [search]);

  const pages = getStoryPages(story);
  const addPoints = (p: number) => setPoints((prev) => prev + p);
  const startStory = () => { addPoints(10); setCurrentPage(0); setScreen("story"); };
  const nextPage = () => { addPoints(5); currentPage < pages.length - 1 ? setCurrentPage((p) => p + 1) : setScreen("summary"); };
  const prevPage = () => { if (currentPage > 0) setCurrentPage((p) => p - 1); };
  const resetAll = () => { setScreen("welcome"); setStory({ name: "", pronoun: "", companion: null, traits: [], favAnimal: "", biggestDream: "" }); setCurrentPage(0); setPoints(0); setNameInput(""); setFromBuilder(false); };

  return (
    <PublicLayout>
      <div className="min-h-screen relative" style={{ background: DARK_BG }}>

        {/* Ambient star field */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[
            { top: "8%", left: "12%", size: 1.5, op: 0.4 }, { top: "15%", left: "78%", size: 1, op: 0.3 },
            { top: "32%", left: "55%", size: 2, op: 0.25 }, { top: "58%", left: "22%", size: 1.5, op: 0.3 },
            { top: "72%", left: "85%", size: 1, op: 0.35 }, { top: "85%", left: "45%", size: 2, op: 0.2 },
            { top: "22%", left: "38%", size: 1, op: 0.25 }, { top: "45%", left: "90%", size: 1.5, op: 0.3 },
          ].map((star, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                top: star.top, left: star.left,
                width: star.size, height: star.size,
                background: "white", opacity: star.op,
              }}
            />
          ))}
          {/* Ambient glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-[0.08]"
            style={{ background: "radial-gradient(ellipse, #f97316 0%, transparent 70%)", filter: "blur(40px)" }} />
        </div>

        {/* Points badge */}
        {screen !== "welcome" && points > 0 && (
          <div
            className="fixed top-20 right-4 z-40 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-lg"
            style={{ backdropFilter: "blur(16px)", background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.30)", color: "#fbbf24" }}
          >
            <i className="ri-star-fill text-xs"></i> {points} pts
          </div>
        )}

        {/* Character loaded banner */}
        {fromBuilder && screen === "companion" && (
          <div className="fixed top-16 left-0 right-0 z-30 flex justify-center px-4 pt-3">
            <div
              className="flex items-center gap-2 px-5 py-2.5 rounded-full shadow-lg text-xs font-semibold"
              style={{ backdropFilter: "blur(16px)", background: "rgba(52,211,153,0.20)", border: "1px solid rgba(52,211,153,0.40)", color: "#34d399" }}
            >
              <i className="ri-check-line"></i> {story.name}'s character loaded — choose your companion!
            </div>
          </div>
        )}

        <div className="relative max-w-lg mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">

          {/* ── WELCOME ── */}
          {screen === "welcome" && (
            <div className="text-center w-full">
              {/* Book cover */}
              <GlassPanel className="mb-8 overflow-hidden" style={{ boxShadow: "0 0 60px rgba(249,115,22,0.18), 0 24px 64px rgba(0,0,0,0.60)" }}>
                {/* Atmospheric top */}
                <div className="relative py-14 px-6 text-center overflow-hidden"
                  style={{ background: "linear-gradient(160deg, #1a0c04 0%, #3d1a00 40%, #7c3a00 100%)" }}>
                  <div className="absolute inset-0 opacity-30"
                    style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(249,115,22,0.5) 0%, transparent 70%)" }} />
                  <div className="relative">
                    <div className="text-6xl mb-4">🚜</div>
                    <h1 className="text-2xl md:text-3xl font-black mb-2 leading-tight" style={{ color: "#fef3e2" }}>
                      The Time-Travelling Tractor
                    </h1>
                    <p className="text-sm" style={{ color: "rgba(254,243,226,0.50)" }}>
                      An interactive adventure where <strong style={{ color: "#fbbf24" }}>you</strong> are the hero
                    </p>
                  </div>
                </div>
                {/* CTA row */}
                <div className="p-6 space-y-3">
                  <button
                    onClick={() => setScreen("name")}
                    className="w-full py-3.5 font-bold text-sm rounded-xl transition-all hover:scale-[1.01]"
                    style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#1a0800", boxShadow: "0 4px 24px rgba(249,115,22,0.35)" }}
                  >
                    <i className="ri-rocket-line"></i> Start the Adventure
                  </button>
                  <Link
                    href="/characters/create"
                    className="flex items-center justify-center gap-2 w-full py-3 font-semibold text-sm rounded-xl transition-all"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", color: "rgba(254,243,226,0.65)" }}
                  >
                    <i className="ri-user-smile-line"></i> Build Character First
                  </Link>
                </div>
              </GlassPanel>
              <div className="flex justify-center gap-6 text-xs" style={{ color: "rgba(254,243,226,0.25)" }}>
                <span><i className="ri-time-line"></i> 5 minutes</span>
                <span><i className="ri-group-line"></i> Ages 3–16</span>
                <span><i className="ri-star-line"></i> Earn points</span>
              </div>
            </div>
          )}

          {/* ── NAME ── */}
          {screen === "name" && (
            <GlassPanel className="w-full">
              <div className="p-8 text-center">
                <button
                  onClick={() => setScreen("welcome")}
                  className="flex items-center gap-1.5 text-xs mb-6 mx-auto transition-colors"
                  style={{ color: "rgba(254,243,226,0.35)" }}
                >
                  <i className="ri-arrow-left-line"></i> Back
                </button>
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-5"
                  style={{ background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.25)" }}
                >
                  <i className="ri-user-heart-line" style={{ color: "#f97316" }}></i>
                </div>
                <h2 className="text-xl font-bold mb-1.5" style={{ color: "#fef3e2" }}>What's your name?</h2>
                <p className="text-sm mb-6" style={{ color: "rgba(254,243,226,0.40)" }}>
                  Your name will appear on every single page.
                </p>
                <input
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl text-center text-base font-bold focus:outline-none focus:ring-2 focus:ring-amber-400/40 mb-4"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#fef3e2" }}
                  placeholder="Enter your name..."
                  onKeyDown={(e) => { if (e.key === "Enter" && nameInput.trim()) { setStory({ ...story, name: nameInput.trim() }); addPoints(10); setScreen("pronouns"); } }}
                />
                {nameInput.trim() && (
                  <p className="text-xs mb-4 font-semibold" style={{ color: "#fbbf24" }}>
                    <i className="ri-sparkling-2-line"></i> Every page will be written for <strong>{nameInput}</strong>
                  </p>
                )}
                <button
                  disabled={!nameInput.trim()}
                  onClick={() => { setStory({ ...story, name: nameInput.trim() }); addPoints(10); setScreen("pronouns"); }}
                  className="w-full py-3.5 font-bold text-sm rounded-xl transition-all disabled:opacity-30 hover:scale-[1.01]"
                  style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#1a0800", boxShadow: "0 4px 20px rgba(249,115,22,0.30)" }}
                >
                  That's my name! <i className="ri-arrow-right-line"></i>
                </button>
              </div>
            </GlassPanel>
          )}

          {/* ── PRONOUNS ── */}
          {screen === "pronouns" && (
            <GlassPanel className="w-full">
              <div className="p-8">
                <button
                  onClick={() => setScreen("name")}
                  className="flex items-center gap-1.5 text-xs mb-6 transition-colors"
                  style={{ color: "rgba(254,243,226,0.35)" }}
                >
                  <i className="ri-arrow-left-line"></i> Back
                </button>
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-5"
                  style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.25)" }}
                >
                  <i className="ri-rainbow-line text-2xl" style={{ color: "#a78bfa" }}></i>
                </div>
                <h2 className="text-xl font-bold mb-1.5 text-center" style={{ color: "#fef3e2" }}>Choose your pronouns</h2>
                <p className="text-sm mb-6 text-center" style={{ color: "rgba(254,243,226,0.40)" }}>
                  The story will use these when telling {story.name}'s adventure.
                </p>
                <div className="space-y-2.5">
                  {[
                    { value: "she/her",    label: "She / Her",    color: "#c084fc" },
                    { value: "he/him",     label: "He / Him",     color: "#60a5fa" },
                    { value: "they/them",  label: "They / Them",  color: "#34d399" },
                  ].map(({ value, label, color }) => (
                    <button
                      key={value}
                      onClick={() => { setStory({ ...story, pronoun: value as Pronoun }); addPoints(5); setScreen("companion"); }}
                      className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all hover:scale-[1.01] text-left"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", color: "#fef3e2" }}
                    >
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
                      <span className="font-semibold text-sm">{label}</span>
                      <i className="ri-arrow-right-line ml-auto text-xs" style={{ color: "rgba(254,243,226,0.25)" }}></i>
                    </button>
                  ))}
                </div>
              </div>
            </GlassPanel>
          )}

          {/* ── COMPANION ── */}
          {screen === "companion" && (
            <GlassPanel className="w-full">
              <div className="p-6">
                {fromBuilder ? (
                  <Link href="/characters/create" className="flex items-center gap-1.5 text-xs mb-5 transition-colors" style={{ color: "rgba(254,243,226,0.35)" }}>
                    <i className="ri-arrow-left-line"></i> Edit character
                  </Link>
                ) : (
                  <button onClick={() => setScreen("pronouns")} className="flex items-center gap-1.5 text-xs mb-5 transition-colors" style={{ color: "rgba(254,243,226,0.35)" }}>
                    <i className="ri-arrow-left-line"></i> Back
                  </button>
                )}
                <div className="text-center mb-5">
                  <h2 className="text-lg font-bold mb-1" style={{ color: "#fef3e2" }}>
                    Choose {story.name ? `${story.name}'s` : "your"} companion
                  </h2>
                  <p className="text-xs" style={{ color: "rgba(254,243,226,0.35)" }}>Every hero needs a friend by their side.</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {COMPANION_OPTIONS.map(({ id, emoji, label, desc, color }) => (
                    <button
                      key={id}
                      onClick={() => { setStory({ ...story, companion: id }); addPoints(15); startStory(); }}
                      className="p-4 rounded-2xl transition-all hover:scale-[1.02] text-left"
                      style={{
                        background: `${color}10`,
                        border: `1px solid ${color}25`,
                        boxShadow: `0 0 16px ${color}08`,
                      }}
                    >
                      <div className="text-2xl mb-2">{emoji}</div>
                      <div className="text-xs font-bold mb-1" style={{ color: "#fef3e2" }}>{label}</div>
                      <div className="text-[10px] leading-snug" style={{ color: "rgba(254,243,226,0.40)" }}>{desc}</div>
                    </button>
                  ))}
                </div>
                {story.traits.length > 0 && (
                  <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                    <p className="text-[10px] mb-2 text-center" style={{ color: "rgba(254,243,226,0.28)" }}>Traits woven into your story:</p>
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {story.traits.map(t => (
                        <span key={t} className="text-[10px] px-2.5 py-0.5 rounded-full font-semibold"
                          style={{ background: "rgba(249,115,22,0.15)", color: "#fbbf24", border: "1px solid rgba(249,115,22,0.25)" }}>{t}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </GlassPanel>
          )}

          {/* ── STORY PAGES — The Book ── */}
          {screen === "story" && pages[currentPage] && (() => {
            const mood = CHAPTER_MOODS[currentPage] ?? CHAPTER_MOODS[0];
            const progress = ((currentPage + 1) / pages.length) * 100;
            return (
              <div className="w-full">
                {/* Progress bar + meta */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-[10px] mb-2" style={{ color: "rgba(254,243,226,0.30)" }}>
                    <span>Chapter {currentPage + 1} of {pages.length}</span>
                    <span style={{ color: "#fbbf24" }}><i className="ri-star-fill"></i> {points} pts</span>
                  </div>
                  <div className="h-0.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <div
                      className="h-0.5 rounded-full transition-all duration-700"
                      style={{ width: `${progress}%`, background: "linear-gradient(90deg, #f97316, #fbbf24)" }}
                    />
                  </div>
                </div>

                {/* Book */}
                <div
                  className="rounded-3xl overflow-hidden shadow-2xl"
                  style={{
                    border: "1px solid rgba(255,255,255,0.09)",
                    boxShadow: `0 0 60px ${mood.accent}18, 0 32px 80px rgba(0,0,0,0.70)`,
                  }}
                >
                  {/* Illustration zone — full-bleed atmospheric gradient */}
                  <div
                    className="relative px-8 py-14 flex flex-col items-center justify-center text-center overflow-hidden"
                    style={{ background: mood.bg, minHeight: 180 }}
                  >
                    {/* Ambient inner glow */}
                    <div className="absolute inset-0 opacity-40"
                      style={{ background: `radial-gradient(ellipse at 50% 60%, ${mood.accent}60 0%, transparent 65%)` }} />
                    {/* Chapter icon */}
                    <div
                      className="relative w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
                      style={{ background: "rgba(0,0,0,0.25)", border: `1px solid ${mood.accent}40`, backdropFilter: "blur(8px)" }}
                    >
                      <i className={`${mood.icon} text-2xl`} style={{ color: mood.accent }}></i>
                    </div>
                    {/* Illustration emoji in a subtle chip */}
                    <div className="relative text-5xl mb-2" style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.40))" }}>
                      {pages[currentPage].illustration}
                    </div>
                    {/* Chapter title */}
                    <p className="relative text-xs font-bold uppercase tracking-[0.18em]" style={{ color: `${mood.accent}` }}>
                      {pages[currentPage].title}
                    </p>
                  </div>

                  {/* Reading pane */}
                  <div
                    className="px-7 py-7"
                    style={{
                      background: "rgba(15,8,2,0.92)",
                      borderTop: `2px solid ${mood.accent}30`,
                    }}
                  >
                    <p
                      className="text-base leading-[1.9] mb-7"
                      style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: "rgba(254,243,226,0.85)", letterSpacing: "0.01em" }}
                    >
                      {pages[currentPage].text}
                    </p>

                    {/* Navigation */}
                    <div className="flex items-center gap-3">
                      {currentPage > 0 && (
                        <button
                          onClick={prevPage}
                          className="flex items-center gap-1.5 px-4 py-3 rounded-xl text-xs font-semibold transition-all"
                          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", color: "rgba(254,243,226,0.55)" }}
                        >
                          <i className="ri-arrow-left-line"></i> Prev
                        </button>
                      )}
                      <button
                        onClick={nextPage}
                        className="flex-1 flex items-center justify-center gap-2 py-3 font-bold text-sm rounded-xl transition-all hover:scale-[1.01]"
                        style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#1a0800", boxShadow: "0 4px 20px rgba(249,115,22,0.30)" }}
                      >
                        {currentPage < pages.length - 1
                          ? <><span>Next Chapter</span> <i className="ri-arrow-right-line"></i></>
                          : <><i className="ri-flag-2-line"></i> <span>Finish the Adventure</span></>
                        }
                      </button>
                      <button
                        onClick={resetAll}
                        className="flex items-center px-3 py-3 rounded-xl transition-all text-sm"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(254,243,226,0.35)" }}
                        title="Restart"
                      >
                        <i className="ri-home-4-line"></i>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Page dots */}
                <div className="flex justify-center gap-1.5 mt-4">
                  {pages.map((_, i) => (
                    <div
                      key={i}
                      className="rounded-full transition-all duration-300"
                      style={{
                        width: i === currentPage ? 18 : 5, height: 5,
                        background: i === currentPage ? "#f97316" : "rgba(255,255,255,0.15)",
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })()}

          {/* ── SUMMARY ── */}
          {screen === "summary" && (
            <GlassPanel className="w-full text-center" style={{ boxShadow: "0 0 60px rgba(251,191,36,0.10), 0 32px 80px rgba(0,0,0,0.60)" }}>
              {/* Gold top */}
              <div className="relative py-10 px-6 overflow-hidden"
                style={{ background: "linear-gradient(160deg, #1a0c04 0%, #7c3a00 60%, #b45309 100%)", borderBottom: "1px solid rgba(251,191,36,0.20)" }}>
                <div className="absolute inset-0 opacity-30"
                  style={{ background: "radial-gradient(ellipse at 50% 80%, rgba(251,191,36,0.5) 0%, transparent 65%)" }} />
                <div className="relative">
                  <div className="text-5xl mb-3">🏆</div>
                  <h2 className="text-xl font-black mb-1" style={{ color: "#fef3e2" }}>Adventure Complete!</h2>
                  <p className="text-sm" style={{ color: "rgba(254,243,226,0.55)" }}>
                    <strong style={{ color: "#fbbf24" }}>{story.name || "Your hero"}</strong> has read The Time-Travelling Tractor
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { val: points, label: "Adventure Points", icon: "ri-star-fill", color: "#fbbf24" },
                    { val: pages.length, label: "Chapters Read", icon: "ri-book-open-line", color: "#34d399" },
                    { val: COMPANION_OPTIONS.find((c) => c.id === story.companion)?.emoji ?? "⭐", label: "Companion", icon: null, color: "#a78bfa" },
                    { val: null, label: "Hero Badge", icon: "ri-medal-2-line", color: "#f97316" },
                  ].map(({ val, label, icon, color }, i) => (
                    <div
                      key={i}
                      className="rounded-2xl p-4 text-center"
                      style={{ background: `${color}10`, border: `1px solid ${color}20` }}
                    >
                      {icon ? (
                        <div className="text-xl mb-1" style={{ color }}><i className={icon}></i></div>
                      ) : (
                        <div className="text-xl mb-1">{val}</div>
                      )}
                      <div className="text-lg font-black" style={{ color }}>{typeof val === "number" ? val : icon ? "" : ""}</div>
                      <p className="text-[10px] mt-0.5" style={{ color: "rgba(254,243,226,0.35)" }}>{label}</p>
                    </div>
                  ))}
                </div>

                {story.traits.length > 0 && (
                  <div className="mb-5 pb-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                    <p className="text-[10px] mb-2" style={{ color: "rgba(254,243,226,0.28)" }}>This story was personalised with:</p>
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {story.traits.map(t => (
                        <span key={t} className="text-xs px-2.5 py-1 rounded-full font-semibold"
                          style={{ background: "rgba(249,115,22,0.15)", color: "#fbbf24", border: "1px solid rgba(249,115,22,0.25)" }}>{t}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <Link
                    href="/characters/create"
                    className="flex items-center justify-center gap-2 w-full py-3.5 font-bold text-sm rounded-xl transition-all hover:scale-[1.01]"
                    style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#1a0800", boxShadow: "0 4px 20px rgba(249,115,22,0.30)" }}
                  >
                    <i className="ri-user-smile-line"></i>
                    {story.name ? `Create ${story.name}'s Full Character` : "Build Your Full Character"}
                  </Link>
                  <button
                    onClick={resetAll}
                    className="w-full py-3 font-semibold text-sm rounded-xl transition-all"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", color: "rgba(254,243,226,0.55)" }}
                  >
                    <i className="ri-refresh-line"></i> Play Again
                  </button>
                  <Link href="/" className="flex items-center justify-center gap-1.5 w-full py-2.5 text-xs transition-colors"
                    style={{ color: "rgba(254,243,226,0.28)" }}>
                    <i className="ri-arrow-left-line"></i> Back to home
                  </Link>
                </div>
              </div>
            </GlassPanel>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
