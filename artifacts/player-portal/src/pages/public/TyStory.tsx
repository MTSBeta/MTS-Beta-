import { useState } from "react";
import { Link } from "wouter";
import { PublicLayout } from "@/layouts/PublicLayout";
import { publicAssetUrl } from "@/lib/publicAssetUrl";

type Screen = "cover" | "step1" | "step2" | "step3" | "story" | "end";
type Pronoun = "he/him" | "she/her" | "they/them";

interface TyVars {
  name: string;
  pronoun: Pronoun;
  guardian: string;
  personality: string;
  farm_animal: string;
  tractor_colour: string;
  fave_dino: string;
  snack1: string;
  snack2: string;
  fruit: string;
  loves_mud: boolean;
  loves_dinosaurs: boolean;
}

const DEFAULT_VARS: TyVars = {
  name: "",
  pronoun: "he/him",
  guardian: "Mummy and Daddy",
  personality: "curious",
  farm_animal: "lamb",
  tractor_colour: "red",
  fave_dino: "T-Rex",
  snack1: "crisps",
  snack2: "cheese",
  fruit: "apples",
  loves_mud: false,
  loves_dinosaurs: true,
};

function pp(pronoun: Pronoun): { sub: string; obj: string; pos: string; subCap: string; } {
  if (pronoun === "he/him")   return { sub: "he", obj: "him", pos: "his", subCap: "He" };
  if (pronoun === "she/her")  return { sub: "she", obj: "her", pos: "her", subCap: "She" };
  return                             { sub: "they", obj: "them", pos: "their", subCap: "They" };
}

function getTyPages(v: TyVars) {
  const n = v.name.trim() || "Ty";
  const pr = pp(v.pronoun);
  const guardianShort = v.guardian.includes("and") ? v.guardian.split(" and ")[0] : v.guardian;

  return [
    {
      page: 1, title: "The Farm", emoji: "🌾",
      bg: "linear-gradient(160deg, #064e3b 0%, #065f46 50%, #10b981 100%)",
      accent: "#34d399",
      text: `${n} went to the farm with ${v.guardian}. ${n} was feeling ${
        v.personality === "brave" ? "brave and ready for anything" :
        v.personality === "playful" ? "bouncy and full of excitement" :
        v.personality === "kind" ? "warm and happy inside" :
        v.personality === "adventurous" ? "like anything could happen" :
        "full of wonder and questions"
      } — and the farm had so much to explore! ${n} spotted a cow munching on grass, ${
        v.loves_mud
          ? `a pig rolling joyfully in the mud — ${n}'s absolute favourite thing!`
          : `a pig rolling around in the mud`
      }, and a ${v.farm_animal} jumping playfully in the field.`,
    },
    {
      page: 2, title: "The Wish", emoji: "🚜",
      bg: "linear-gradient(160deg, #3d1a00 0%, #7c3a00 50%, #f97316 100%)",
      accent: "#fb923c",
      text: `${n} was having so much fun that ${pr.sub} didn't want the day to end. So ${pr.sub} climbed up into the farmer's big ${v.tractor_colour} tractor, closed ${pr.pos} eyes tight, and made a wish. ${n} wished to go somewhere where ${pr.sub} could see the most incredible, amazing creatures in the whole wide world${
        v.loves_dinosaurs ? " — maybe even real dinosaurs!" : "!"
      }`,
    },
    {
      page: 3, title: "Time Travel!", emoji: "✨",
      bg: "linear-gradient(160deg, #1e1b4b 0%, #4c1d95 50%, #7c3aed 100%)",
      accent: "#a78bfa",
      text: `When ${n} opened ${pr.pos} eyes, ${pr.sub} realised ${pr.sub} wasn't at the farm any more. The ${v.tractor_colour} tractor had done something magical — it had travelled back in time! ${n} looked around in amazement. There were huge, tall trees, giant footprints in the mud, and a sound like thunder in the distance. ${n} was in the land of the dinosaurs!`,
    },
    {
      page: 4, title: "Stuck in the Mud", emoji: "🦕",
      bg: "linear-gradient(160deg, #064e3b 0%, #065f46 50%, #059669 100%)",
      accent: "#34d399",
      text: `${n} drove the ${v.tractor_colour} tractor carefully down the hill. There, stuck deep in the mud, was a very worried-looking Triceratops. "What's the matter, Mr. Triceratops?" asked ${n}. "I'm stuck!" cried the Triceratops. "I've been here all morning. Can you help me get free?" ${pr.subCap} was ${v.personality === "brave" ? "already reaching for the controls" : v.personality === "kind" ? "instantly full of kindness" : "thinking fast"}. ${n} used the digger on the end of the tractor to gently dig the Triceratops free. "Thank you!" said the Triceratops with the biggest, happiest smile.`,
    },
    {
      page: 5, title: "The Hungry T-Rex", emoji: "🦖",
      bg: "linear-gradient(160deg, #7c1d1d 0%, #b45309 50%, #f59e0b 100%)",
      accent: "#fbbf24",
      text: `${n} drove into the forest and found a sad T-Rex sitting under an enormous tree. "What's the matter, Mr. T-Rex?" asked ${n}. "I can't reach the fruit up in the tree," cried the T-Rex sadly. "My arms are far too tiny!" ${n} looked up — the branches were very, very high. But ${pr.sub} had an idea! ${n} used the tractor's long extendable arm to pick ${v.fruit}, oranges, and mangos from the tallest branches and placed them gently in front of the T-Rex. "Thank you!" roared the T-Rex, with a beaming smile.`,
    },
    {
      page: 6, title: "The Brachiosaurus Bath", emoji: "🦒",
      bg: "linear-gradient(160deg, #0c4a6e 0%, #0369a1 50%, #38bdf8 100%)",
      accent: "#7dd3fc",
      text: `${n} drove the tractor to a beautiful shimmering lake, where a Brachiosaurus was having a lovely wash. Its long neck arched all the way up to the clouds! "Excuse me," said the Brachiosaurus politely. "Would you be so kind as to pass me the soap? I forgot to bring it into the lake with me!" ${n} giggled and used the tractor's extendable arm to pass the soap all the way across. "Thank you very much!" said the Brachiosaurus, with a beaming smile and a little splash.`,
    },
    {
      page: 7, title: "Getting Peckish", emoji: "🎒",
      bg: "linear-gradient(160deg, #3d1a00 0%, #92400e 50%, #d97706 100%)",
      accent: "#fbbf24",
      text: `${n} had been working so hard — digging, reaching, passing — that ${pr.pos} tummy let out a very loud rumble. ${pr.subCap} was really, really hungry! Good job ${guardianShort} had packed ${pr.pos} backpack with all of ${pr.pos} very favourite foods before they left the farm.`,
    },
    {
      page: 8, title: "Picnic Time!", emoji: "🧺",
      bg: "linear-gradient(160deg, #14532d 0%, #16a34a 50%, #4ade80 100%)",
      accent: "#86efac",
      text: `${n} climbed out of the ${v.tractor_colour} tractor and found a perfect sunny patch of grass. ${pr.subCap} opened up ${pr.pos} backpack and laid everything out — ${v.snack1}, ${v.snack2}, and all ${pr.pos} other favourites. ${n} sat down and munched happily. Then… ${pr.sub} heard a rustling sound in the trees nearby. Something was coming…`,
    },
    {
      page: 9, title: "What's That Sound?", emoji: "🌿",
      bg: "linear-gradient(160deg, #1e1b4b 0%, #312e81 50%, #4f46e5 100%)",
      accent: "#a5b4fc",
      text: `${n} stopped eating and listened very carefully. The rustling grew louder. Leaves were shaking. Big footsteps were getting closer and closer. ${n} held ${pr.pos} breath. ${pr.subCap} was ${v.personality === "brave" ? "brave — and ready" : v.personality === "curious" ? "curious — and couldn't wait to see what it was" : v.personality === "adventurous" ? "excited for whatever came next" : "very still and very calm"}. The trees parted slowly…`,
    },
    {
      page: 10, title: "The Dinosaur Picnic!", emoji: "🎉",
      bg: "linear-gradient(160deg, #7c1d1d 0%, #b45309 50%, #f97316 100%)",
      accent: "#fb923c",
      text: `It was the dinosaurs! All three of them — the Triceratops, the T-Rex, and the Brachiosaurus — had come to join ${n}'s picnic! And at the front of the group was ${n}'s favourite dinosaur of all: the mighty ${v.fave_dino}! They each brought something to share: prehistoric berries, giant leaves to sit on, and the longest, widest smiles you've ever seen on a dinosaur.`,
    },
    {
      page: 11, title: "The Best Time Ever", emoji: "😂",
      bg: "linear-gradient(160deg, #064e3b 0%, #065f46 50%, #10b981 100%)",
      accent: "#6ee7b7",
      text: `${n} and the dinosaurs laughed and ate and had the most wonderful time ever. The ${v.fave_dino} tried a bit of ${v.snack1} and made a very funny face. The Triceratops kept accidentally bumping into things with its horns. And the Brachiosaurus could eat leaves from the very top of the tallest tree without even stretching! ${n} had never laughed so much in ${pr.pos} whole life.`,
    },
    {
      page: 12, title: "Time to Go Home", emoji: "🌅",
      bg: "linear-gradient(160deg, #1a0c04 0%, #7c3a00 50%, #d97706 100%)",
      accent: "#fbbf24",
      text: `But the sky was beginning to turn orange and pink — the colours that meant it was time to go home. ${n} packed up the last of ${pr.pos} picnic, lifted ${pr.pos} backpack onto ${pr.pos} back, and said goodbye to all ${pr.pos} new dinosaur friends. The ${v.fave_dino} let out a gentle, warm roar. The Triceratops bowed its great head. And the Brachiosaurus waved its enormous neck slowly from side to side. ${n} climbed back into the ${v.tractor_colour} tractor, closed ${pr.pos} eyes, and wished with all ${pr.pos} heart to be back on the farm.`,
    },
    {
      page: 13, title: "Back Again", emoji: "🌾",
      bg: "linear-gradient(160deg, #064e3b 0%, #065f46 50%, #059669 100%)",
      accent: "#34d399",
      text: `${n} opened ${pr.pos} eyes — and there ${pr.sub} was, back at the farm, just as the sun was setting behind the hills. "Have you had a good day, ${n}?" asked ${guardianShort} on the way home in the car. ${n} smiled the smile of someone who had the most ${v.personality === "brave" ? "brave and brilliant" : v.personality === "curious" ? "curious and wonderful" : v.personality === "playful" ? "playful and magical" : v.personality === "kind" ? "kind and unforgettable" : "adventurous and amazing"} day imaginable. "Yes," said ${n}. "I've had the best day ever."`,
    },
    {
      page: 14, title: "Sweet Dreams", emoji: "🌙",
      bg: "linear-gradient(160deg, #0f0a1e 0%, #1e1b4b 50%, #312e81 100%)",
      accent: "#c084fc",
      text: `That night, ${n} fell asleep almost before ${pr.pos} head hit the pillow — and dreamt all about the Time Travelling Tractor. ${pr.subCap} dreamt of the Triceratops with its big happy smile, the T-Rex with its tiny arms and enormous gratitude, and ${pr.pos} very favourite dinosaur, the ${v.fave_dino}, roaring a warm goodbye. ${n} couldn't wait to ride the tractor again.`,
    },
  ];
}

const FARM_ANIMALS = ["Lamb", "Pig", "Cow", "Horse", "Chicken", "Duck", "Goat", "Sheep"];
const TRACTOR_COLOURS = ["Red", "Blue", "Green", "Yellow", "Orange", "Purple", "Pink"];
const DINOS = ["T-Rex", "Triceratops", "Brachiosaurus", "Stegosaurus", "Velociraptor", "Diplodocus", "Ankylosaurus", "Pterodactyl"];
const PERSONALITIES = [
  { val: "curious",    emoji: "🔍", label: "Curious",     desc: "Always asking 'why?'" },
  { val: "brave",      emoji: "🦁", label: "Brave",       desc: "Charges ahead fearlessly" },
  { val: "playful",    emoji: "😄", label: "Playful",     desc: "Makes everything fun" },
  { val: "kind",       emoji: "💛", label: "Kind",        desc: "Always thinking of others" },
  { val: "adventurous",emoji: "🌍", label: "Adventurous", desc: "Born for big journeys" },
];
const GUARDIANS = [
  "Mummy and Daddy", "Mum and Dad", "Mummy", "Daddy", "Mum", "Dad",
  "Nanny and Grandad", "Grandma and Grandad", "Mummy and Nanna",
];

const GlassPanel = ({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) => (
  <div
    className={`rounded-3xl overflow-hidden ${className}`}
    style={{
      backdropFilter: "blur(24px)",
      background: "rgba(255,248,235,0.05)",
      border: "1px solid rgba(255,220,150,0.14)",
      boxShadow: "0 24px 64px rgba(0,0,0,0.50)",
      ...style,
    }}
  >
    {children}
  </div>
);

const inputClass = "w-full px-4 py-3.5 rounded-xl text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-amber-400/40";
const inputStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.12)",
  color: "#fef3e2",
};

export default function TyStory() {
  const [screen, setScreen] = useState<Screen>("cover");
  const [vars, setVars] = useState<TyVars>(DEFAULT_VARS);
  const [nameInput, setNameInput] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  const BG = "radial-gradient(ellipse at 50% 0%, #1a0c04 0%, #0d0802 55%, #060402 100%)";

  const pages = getTyPages({ ...vars, name: vars.name || "Ty" });
  const totalPages = pages.length;
  const progress = ((currentPage + 1) / totalPages) * 100;

  const mood = pages[currentPage] ?? pages[0];

  const goNext = () => {
    if (currentPage < totalPages - 1) setCurrentPage((p) => p + 1);
    else setScreen("end");
  };
  const goPrev = () => { if (currentPage > 0) setCurrentPage((p) => p - 1); };

  const resetAll = () => {
    setScreen("cover");
    setVars(DEFAULT_VARS);
    setNameInput("");
    setCurrentPage(0);
  };

  return (
    <PublicLayout>
      <div className="min-h-screen relative" style={{ background: BG }}>
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] opacity-[0.08]"
            style={{ background: "radial-gradient(ellipse, #f97316 0%, transparent 70%)", filter: "blur(50px)" }} />
        </div>

        <div className="relative max-w-lg mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen">

          {/* ── COVER ── */}
          {screen === "cover" && (
            <div className="w-full">
              <GlassPanel style={{ boxShadow: "0 0 80px rgba(249,115,22,0.20), 0 24px 64px rgba(0,0,0,0.70)" }}>
                {/* Book cover */}
                <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
                  <img
                    src={publicAssetUrl("images/ty-tractor-cover.png")}
                    alt="Ty and the Time Travelling Tractor"
                    className="w-full h-full object-cover"
                    style={{ objectPosition: "center top" }}
                  />
                  {/* Subtle bottom gradient for CTA readability */}
                  <div className="absolute inset-x-0 bottom-0 h-20" style={{
                    background: "linear-gradient(to top, rgba(6,4,2,0.70) 0%, transparent 100%)"
                  }} />
                  {/* Age badge */}
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold"
                    style={{ background: "rgba(249,115,22,0.90)", color: "#fff", backdropFilter: "blur(8px)" }}>
                    Ages 2–7
                  </div>
                </div>

                {/* CTA area */}
                <div className="p-6 space-y-3">
                  <div className="flex gap-3 text-xs justify-center mb-1" style={{ color: "rgba(254,243,226,0.35)" }}>
                    <span><i className="ri-book-open-line"></i> 14 pages</span>
                    <span><i className="ri-time-line"></i> 2 min setup</span>
                    <span><i className="ri-sparkling-2-line"></i> Fully personalised</span>
                  </div>
                  <button
                    onClick={() => setScreen("step1")}
                    className="w-full py-4 font-bold text-base rounded-xl transition-all hover:scale-[1.01]"
                    style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#1a0800", boxShadow: "0 4px 24px rgba(249,115,22,0.40)" }}
                  >
                    <i className="ri-rocket-line"></i> Personalise for {vars.name || "Your Child"}
                  </button>
                  <button
                    onClick={() => { setVars({ ...DEFAULT_VARS, name: "Ty" }); setCurrentPage(0); setScreen("story"); }}
                    className="w-full py-3 font-semibold text-sm rounded-xl transition-all"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", color: "rgba(254,243,226,0.60)" }}
                  >
                    <i className="ri-play-circle-line"></i> Read as Ty (demo)
                  </button>
                </div>
              </GlassPanel>
            </div>
          )}

          {/* ── STEP 1: Your Adventurer ── */}
          {screen === "step1" && (
            <GlassPanel className="w-full">
              <div className="p-7">
                {/* Step bar */}
                <div className="flex items-center justify-center gap-2 mb-6">
                  {[1,2,3].map((s) => (
                    <div key={s} className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold"
                        style={s === 1
                          ? { background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#1a0800" }
                          : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.25)", border: "1px solid rgba(255,255,255,0.10)" }}
                      >{s}</div>
                      {s < 3 && <div className="w-8 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />}
                    </div>
                  ))}
                </div>

                <div className="text-center mb-6">
                  <div className="text-4xl mb-2">🌟</div>
                  <h2 className="text-lg font-bold mb-0.5" style={{ color: "#fef3e2" }}>Your Adventurer</h2>
                  <p className="text-xs" style={{ color: "rgba(254,243,226,0.40)" }}>Tell us a little about your little one.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5" style={{ color: "rgba(254,243,226,0.40)" }}>
                      Child's Name <span style={{ color: "#f97316" }}>*</span>
                    </label>
                    <input
                      className={inputClass}
                      style={inputStyle}
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder="e.g. Ty, Mia, Noah, Zara…"
                      onKeyDown={(e) => e.key === "Enter" && nameInput.trim() && setVars((v) => ({ ...v, name: nameInput.trim() }))}
                    />
                    {nameInput.trim() && (
                      <p className="text-[11px] mt-1.5 font-semibold" style={{ color: "#fbbf24" }}>
                        <i className="ri-sparkling-2-line"></i> Every page will be written for <strong>{nameInput}</strong>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5" style={{ color: "rgba(254,243,226,0.40)" }}>
                      Pronouns
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["he/him", "she/her", "they/them"] as Pronoun[]).map((pro) => (
                        <button key={pro} onClick={() => setVars((v) => ({ ...v, pronoun: pro }))}
                          className="py-2.5 rounded-xl text-xs font-semibold transition-all"
                          style={vars.pronoun === pro
                            ? { background: "rgba(249,115,22,0.20)", border: "1px solid rgba(249,115,22,0.50)", color: "#fbbf24" }
                            : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(254,243,226,0.55)" }}
                        >{pro}</button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5" style={{ color: "rgba(254,243,226,0.40)" }}>
                      Who Goes to the Farm With Them?
                    </label>
                    <select
                      className={inputClass}
                      style={{ ...inputStyle, appearance: "none" }}
                      value={vars.guardian}
                      onChange={(e) => setVars((v) => ({ ...v, guardian: e.target.value }))}
                    >
                      {GUARDIANS.map((g) => <option key={g} value={g} style={{ background: "#1a0c04" }}>{g}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: "rgba(254,243,226,0.40)" }}>
                      Their Personality
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {PERSONALITIES.map(({ val, emoji, label, desc }) => (
                        <button key={val} onClick={() => setVars((v) => ({ ...v, personality: val }))}
                          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all hover:scale-[1.01]"
                          style={vars.personality === val
                            ? { background: "rgba(249,115,22,0.18)", border: "1px solid rgba(249,115,22,0.45)" }
                            : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                        >
                          <span className="text-xl">{emoji}</span>
                          <div>
                            <div className="text-sm font-bold" style={{ color: "#fef3e2" }}>{label}</div>
                            <div className="text-[11px]" style={{ color: "rgba(254,243,226,0.40)" }}>{desc}</div>
                          </div>
                          {vars.personality === val && (
                            <i className="ri-check-line ml-auto text-sm" style={{ color: "#fbbf24" }}></i>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  disabled={!nameInput.trim()}
                  onClick={() => { setVars((v) => ({ ...v, name: nameInput.trim() })); setScreen("step2"); }}
                  className="w-full py-4 font-bold text-sm rounded-xl mt-6 transition-all disabled:opacity-30 hover:scale-[1.01]"
                  style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#1a0800", boxShadow: "0 4px 20px rgba(249,115,22,0.30)" }}
                >
                  Next: Their World <i className="ri-arrow-right-line"></i>
                </button>
              </div>
            </GlassPanel>
          )}

          {/* ── STEP 2: Their World ── */}
          {screen === "step2" && (
            <GlassPanel className="w-full">
              <div className="p-7">
                <div className="flex items-center justify-center gap-2 mb-6">
                  {[1,2,3].map((s) => (
                    <div key={s} className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold"
                        style={s < 2
                          ? { background: "rgba(52,211,153,0.20)", color: "#34d399", border: "1px solid rgba(52,211,153,0.40)" }
                          : s === 2
                          ? { background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#1a0800" }
                          : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.25)", border: "1px solid rgba(255,255,255,0.10)" }}
                      >{s < 2 ? <i className="ri-check-line text-xs"></i> : s}</div>
                      {s < 3 && <div className="w-8 h-px" style={{ background: s < 2 ? "rgba(52,211,153,0.40)" : "rgba(255,255,255,0.08)" }} />}
                    </div>
                  ))}
                </div>

                <div className="text-center mb-6">
                  <div className="text-4xl mb-2">🚜</div>
                  <h2 className="text-lg font-bold mb-0.5" style={{ color: "#fef3e2" }}>{vars.name}'s World</h2>
                  <p className="text-xs" style={{ color: "rgba(254,243,226,0.40)" }}>What does {vars.name} love?</p>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: "rgba(254,243,226,0.40)" }}>
                      Favourite Farm Animal
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {FARM_ANIMALS.map((a) => (
                        <button key={a} onClick={() => setVars((v) => ({ ...v, farm_animal: a.toLowerCase() }))}
                          className="py-2 rounded-xl text-xs font-semibold transition-all"
                          style={vars.farm_animal === a.toLowerCase()
                            ? { background: "rgba(249,115,22,0.20)", border: "1px solid rgba(249,115,22,0.50)", color: "#fbbf24" }
                            : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(254,243,226,0.55)" }}
                        >{a}</button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: "rgba(254,243,226,0.40)" }}>
                      Tractor Colour
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {TRACTOR_COLOURS.map((c) => (
                        <button key={c} onClick={() => setVars((v) => ({ ...v, tractor_colour: c.toLowerCase() }))}
                          className="px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                          style={vars.tractor_colour === c.toLowerCase()
                            ? { background: "rgba(249,115,22,0.20)", border: "1px solid rgba(249,115,22,0.50)", color: "#fbbf24" }
                            : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(254,243,226,0.55)" }}
                        >🚜 {c}</button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: "rgba(254,243,226,0.40)" }}>
                      Favourite Dinosaur
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {DINOS.map((d) => (
                        <button key={d} onClick={() => setVars((v) => ({ ...v, fave_dino: d }))}
                          className="py-2 rounded-xl text-xs font-semibold transition-all"
                          style={vars.fave_dino === d
                            ? { background: "rgba(249,115,22,0.20)", border: "1px solid rgba(249,115,22,0.50)", color: "#fbbf24" }
                            : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(254,243,226,0.55)" }}
                        >🦕 {d}</button>
                      ))}
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="space-y-2.5">
                    {[
                      { key: "loves_mud" as const, emoji: "🌿", label: `Does ${vars.name} love playing in mud?` },
                      { key: "loves_dinosaurs" as const, emoji: "🦖", label: `Obsessed with dinosaurs?` },
                    ].map(({ key, emoji, label }) => (
                      <button key={key} onClick={() => setVars((v) => ({ ...v, [key]: !v[key] }))}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                      >
                        <span className="text-sm" style={{ color: "rgba(254,243,226,0.75)" }}>{emoji} {label}</span>
                        <div className="w-10 h-5 rounded-full relative transition-all"
                          style={{ background: vars[key] ? "rgba(249,115,22,0.70)" : "rgba(255,255,255,0.12)" }}>
                          <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
                            style={{ left: vars[key] ? "calc(100% - 18px)" : "2px" }} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={() => setScreen("step1")}
                    className="px-4 py-3.5 rounded-xl text-sm font-semibold transition-all"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", color: "rgba(254,243,226,0.50)" }}
                  ><i className="ri-arrow-left-line"></i></button>
                  <button onClick={() => setScreen("step3")}
                    className="flex-1 py-3.5 font-bold text-sm rounded-xl transition-all hover:scale-[1.01]"
                    style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#1a0800", boxShadow: "0 4px 20px rgba(249,115,22,0.30)" }}
                  >Next: Favourite Foods <i className="ri-arrow-right-line"></i></button>
                </div>
              </div>
            </GlassPanel>
          )}

          {/* ── STEP 3: Favourite Foods ── */}
          {screen === "step3" && (
            <GlassPanel className="w-full">
              <div className="p-7">
                <div className="flex items-center justify-center gap-2 mb-6">
                  {[1,2,3].map((s) => (
                    <div key={s} className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold"
                        style={s < 3
                          ? { background: "rgba(52,211,153,0.20)", color: "#34d399", border: "1px solid rgba(52,211,153,0.40)" }
                          : { background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#1a0800" }}
                      >{s < 3 ? <i className="ri-check-line text-xs"></i> : s}</div>
                      {s < 3 && <div className="w-8 h-px" style={{ background: "rgba(52,211,153,0.40)" }} />}
                    </div>
                  ))}
                </div>

                <div className="text-center mb-6">
                  <div className="text-4xl mb-2">🧺</div>
                  <h2 className="text-lg font-bold mb-0.5" style={{ color: "#fef3e2" }}>Pack the Picnic!</h2>
                  <p className="text-xs" style={{ color: "rgba(254,243,226,0.40)" }}>These will appear in {vars.name}'s dinosaur picnic.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5" style={{ color: "rgba(254,243,226,0.40)" }}>
                      Favourite Snack
                    </label>
                    <input className={inputClass} style={inputStyle} value={vars.snack1}
                      onChange={(e) => setVars((v) => ({ ...v, snack1: e.target.value }))}
                      placeholder="e.g. crisps, cucumber, carrots…"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5" style={{ color: "rgba(254,243,226,0.40)" }}>
                      Second Favourite Snack
                    </label>
                    <input className={inputClass} style={inputStyle} value={vars.snack2}
                      onChange={(e) => setVars((v) => ({ ...v, snack2: e.target.value }))}
                      placeholder="e.g. cheese, grapes, sandwiches…"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5" style={{ color: "rgba(254,243,226,0.40)" }}>
                      Favourite Fruit <span className="text-[10px] font-normal" style={{ color: "rgba(254,243,226,0.25)" }}>(for the T-Rex!)</span>
                    </label>
                    <input className={inputClass} style={inputStyle} value={vars.fruit}
                      onChange={(e) => setVars((v) => ({ ...v, fruit: e.target.value }))}
                      placeholder="e.g. strawberries, apples, bananas…"
                    />
                  </div>
                </div>

                {/* Preview teaser */}
                <div className="mt-5 rounded-2xl p-4 text-xs" style={{
                  background: "rgba(255,248,225,0.04)",
                  border: "1px solid rgba(251,191,36,0.15)",
                  color: "rgba(254,243,226,0.55)",
                  fontFamily: "Georgia, serif",
                  lineHeight: "1.8",
                }}>
                  <span style={{ color: "rgba(254,243,226,0.30)" }}>Preview: </span>
                  <span>{vars.name || "Ty"} opened up {pp(vars.pronoun).pos} backpack and laid everything out — </span>
                  <strong style={{ color: "#fbbf24" }}>{vars.snack1 || "crisps"}</strong>
                  <span>, </span>
                  <strong style={{ color: "#fbbf24" }}>{vars.snack2 || "cheese"}</strong>
                  <span>, and all {pp(vars.pronoun).pos} other favourites.</span>
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={() => setScreen("step2")}
                    className="px-4 py-4 rounded-xl text-sm font-semibold transition-all"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", color: "rgba(254,243,226,0.50)" }}
                  ><i className="ri-arrow-left-line"></i></button>
                  <button
                    onClick={() => { setCurrentPage(0); setScreen("story"); }}
                    className="flex-1 py-4 font-bold text-sm rounded-xl transition-all hover:scale-[1.01]"
                    style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#1a0800", boxShadow: "0 4px 24px rgba(249,115,22,0.40)" }}
                  >
                    <i className="ri-book-open-line"></i> Start Reading!
                  </button>
                </div>
              </div>
            </GlassPanel>
          )}

          {/* ── STORY ── */}
          {screen === "story" && (
            <div className="w-full">
              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-[11px] mb-2" style={{ color: "rgba(254,243,226,0.30)" }}>
                  <span>Page {currentPage + 1} of {totalPages}</span>
                  <button onClick={resetAll} className="flex items-center gap-1 transition-colors hover:text-amber-400"
                    style={{ color: "rgba(254,243,226,0.25)" }}>
                    <i className="ri-home-4-line"></i> Restart
                  </button>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <div className="h-1 rounded-full transition-all duration-700"
                    style={{ width: `${progress}%`, background: "linear-gradient(90deg, #f97316, #fbbf24)" }} />
                </div>
              </div>

              {/* Book */}
              <div className="rounded-3xl overflow-hidden shadow-2xl" style={{
                border: "1px solid rgba(255,255,255,0.09)",
                boxShadow: `0 0 60px rgba(249,115,22,0.12), 0 32px 80px rgba(0,0,0,0.70)`,
              }}>
                {/* Illustration zone */}
                <div className="relative px-8 py-12 flex flex-col items-center justify-center text-center overflow-hidden"
                  style={{ background: mood.bg, minHeight: 180 }}>
                  <div className="absolute inset-0 opacity-40"
                    style={{ background: `radial-gradient(ellipse at 50% 60%, ${mood.accent}60 0%, transparent 65%)` }} />
                  <div className="relative text-6xl mb-3" style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.40))" }}>
                    {mood.emoji}
                  </div>
                  <p className="relative text-xs font-bold uppercase tracking-[0.18em]" style={{ color: mood.accent }}>
                    Page {mood.page} — {mood.title}
                  </p>
                </div>

                {/* Reading pane */}
                <div className="px-7 py-7" style={{ background: "rgba(15,8,2,0.94)", borderTop: `2px solid ${mood.accent}28` }}>
                  <p className="text-base leading-[1.95] mb-7"
                    style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: "rgba(254,243,226,0.90)", letterSpacing: "0.01em" }}>
                    {mood.text}
                  </p>

                  {/* Navigation */}
                  <div className="flex items-center gap-3">
                    {currentPage > 0 && (
                      <button onClick={goPrev}
                        className="flex items-center gap-1.5 px-4 py-3 rounded-xl text-xs font-semibold transition-all"
                        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", color: "rgba(254,243,226,0.55)" }}>
                        <i className="ri-arrow-left-line"></i> Prev
                      </button>
                    )}
                    <button onClick={goNext}
                      className="flex-1 flex items-center justify-center gap-2 py-3.5 font-bold text-sm rounded-xl transition-all hover:scale-[1.01]"
                      style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#1a0800", boxShadow: "0 4px 20px rgba(249,115,22,0.35)" }}>
                      {currentPage < totalPages - 1
                        ? <><span>Next Page</span> <i className="ri-arrow-right-line"></i></>
                        : <><i className="ri-flag-2-line"></i> <span>The End!</span></>
                      }
                    </button>
                  </div>
                </div>
              </div>

              {/* Page dots */}
              <div className="flex justify-center gap-1 mt-4 flex-wrap">
                {pages.map((_, i) => (
                  <button key={i} onClick={() => setCurrentPage(i)}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: i === currentPage ? 16 : 5, height: 5,
                      background: i === currentPage ? "#f97316" : "rgba(255,255,255,0.15)",
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── END ── */}
          {screen === "end" && (
            <GlassPanel className="w-full text-center"
              style={{ boxShadow: "0 0 80px rgba(251,191,36,0.12), 0 32px 80px rgba(0,0,0,0.60)" }}>
              {/* Gold header */}
              <div className="relative py-10 px-6 overflow-hidden"
                style={{ background: "linear-gradient(160deg, #1a0c04 0%, #7c3a00 60%, #b45309 100%)", borderBottom: "1px solid rgba(251,191,36,0.20)" }}>
                <div className="absolute inset-0 opacity-30"
                  style={{ background: "radial-gradient(ellipse at 50% 80%, rgba(251,191,36,0.5) 0%, transparent 65%)" }} />
                <div className="relative">
                  <div className="text-5xl mb-3">🏆</div>
                  <h2 className="text-xl font-black mb-1" style={{ color: "#fef3e2" }}>The End!</h2>
                  <p className="text-sm" style={{ color: "rgba(254,243,226,0.55)" }}>
                    <strong style={{ color: "#fbbf24" }}>{vars.name || "Ty"}</strong> has ridden the Time Travelling Tractor
                  </p>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-sm leading-relaxed" style={{ color: "rgba(254,243,226,0.65)", fontFamily: "Georgia, serif" }}>
                  We hope {vars.name || "Ty"} loved meeting the dinosaurs — especially the mighty <strong style={{ color: "#fbbf24" }}>{vars.fave_dino}</strong>!
                </p>
                <p className="text-xs" style={{ color: "rgba(254,243,226,0.35)" }}>
                  This is a preview. The full illustrated, printed version of this personalised story is coming soon.
                </p>

                <div className="space-y-2.5 pt-2">
                  <button onClick={() => { setCurrentPage(0); setScreen("story"); }}
                    className="w-full py-3.5 font-bold text-sm rounded-xl transition-all hover:scale-[1.01]"
                    style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#1a0800" }}>
                    <i className="ri-replay-line"></i> Read Again
                  </button>
                  <button onClick={resetAll}
                    className="w-full py-3 font-semibold text-sm rounded-xl transition-all"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", color: "rgba(254,243,226,0.55)" }}>
                    <i className="ri-user-smile-line"></i> Personalise for Someone Else
                  </button>
                  <Link href="/characters/create"
                    className="flex items-center justify-center gap-2 w-full py-3 font-semibold text-sm rounded-xl transition-all"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(254,243,226,0.45)" }}>
                    <i className="ri-book-heart-line"></i> Try The Time-Travelling Tractor
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
