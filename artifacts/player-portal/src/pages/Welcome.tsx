import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { PlayerJersey } from "@/components/PlayerJersey";
import { LikenessUploader } from "@/components/LikenessUploader";
import { usePlayerContext } from "@/context/PlayerContext";
import { POSITIONS } from "@/data/positions";
import { JOURNEY_STAGES } from "@/data/questions";

const TIPS = [
  { emoji: "🎙️", title: "Talk, don't type", body: "Every question has a voice note. Use it — your actual voice tells more of the story." },
  { emoji: "💬", title: "Go deep", body: "Some questions feel unusual. That's on purpose. Real answers, not a performance." },
  { emoji: "⏸️", title: "No timer", body: "Pause between stages, come back later. There's no rush and no deadline." },
  { emoji: "✅", title: "No wrong answers", body: "Whatever's true for you is exactly what we're looking for." },
];

const KIT_IMAGES: Record<string, string> = {
  "arsenal":           "https://cdn.footballkitarchive.com/2025/11/18/Z5U71ocitVEydDn.jpg",
  "aston-villa":       "https://cdn.footballkitarchive.com/2025/07/19/oHl9m2AVpKx9AcP.jpg",
  "bournemouth":       "https://cdn.footballkitarchive.com/2025/07/15/cqZWpPeYuqhb0S1.jpg",
  "brentford":         "https://cdn.footballkitarchive.com/2025/07/04/Ss8OoroRbWUUZBo.jpg",
  "brighton":          "https://cdn.footballkitarchive.com/2025/07/01/JlDs4PKkAbkYe7h.jpg",
  "chelsea":           "https://cdn.footballkitarchive.com/2025/09/22/Wj8ki6qeOusGzIo.jpg",
  "ipswich":           "https://cdn.footballkitarchive.com/2025/07/05/jZf2VTTHMOc2fBS.jpg",
  "leicester":         "https://cdn.footballkitarchive.com/2025/10/19/arMY5zWmi8mta4g.jpg",
  "manchester-city":   "https://cdn.footballkitarchive.com/2025/05/13/gewy1MN5rMVUaTX.jpg",
  "manchester-united": "https://cdn.footballkitarchive.com/2025/11/18/RdjHzn4ULniPu0Z.jpg",
  "newcastle":         "https://cdn.footballkitarchive.com/2025/06/12/iuRDJNGMm7vZyUg.jpg",
  "nottingham-forest": "https://cdn.footballkitarchive.com/2025/08/05/du0Arc2gsNuIftL.jpg",
  "southampton":       "https://cdn.footballkitarchive.com/2025/07/14/YcJdtamVgX4L7ny.jpg",
  "tottenham":         "https://cdn.footballkitarchive.com/2025/06/03/AjKuLXeetr2zHNt.jpg",
  "west-ham":          "https://cdn.footballkitarchive.com/2025/09/17/yqkFgKPTnE2kHpY.jpg",
  "wolves":            "https://cdn.footballkitarchive.com/2025/06/27/wKi1rTZkD8iNPcV.jpg",
};

function isLightColor(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 155;
}

// ── Floating star particle ──
function Star({ x, y, size, delay, color }: { x: number; y: number; size: number; delay: number; color: string }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, background: color }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], y: [0, -40, -80] }}
      transition={{ delay, duration: 2, repeat: Infinity, repeatDelay: Math.random() * 3 + 1 }}
    />
  );
}

const STARS = Array.from({ length: 18 }, () => ({
  x: Math.random() * 90 + 5,
  y: Math.random() * 60 + 10,
  size: Math.random() * 4 + 2,
  delay: Math.random() * 2,
}));

// ── Player Reveal Card (cycling badge → name → number with flash) ──
const REVEAL_PHASES = ["badge", "name", "number"] as const;
type RevealPhase = typeof REVEAL_PHASES[number];
const PHASE_DURATIONS: Record<RevealPhase, number> = { badge: 2400, name: 2200, number: 2400 };

function PlayerReveal({
  crestUrl, logoText, shortName, playerName, shirtNumber, primaryColor,
}: {
  crestUrl?: string; logoText?: string; shortName: string;
  playerName: string; shirtNumber: number | string; primaryColor: string;
}) {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [flashing, setFlashing] = useState(false);
  const phase = REVEAL_PHASES[phaseIdx];
  const firstName = playerName.split(" ")[0];
  const surname = playerName.split(" ").slice(1).join(" ") || firstName;

  useEffect(() => {
    const t = setTimeout(() => {
      setFlashing(true);
      setTimeout(() => {
        setPhaseIdx(i => (i + 1) % REVEAL_PHASES.length);
        setFlashing(false);
      }, 180);
    }, PHASE_DURATIONS[phase]);
    return () => clearTimeout(t);
  }, [phaseIdx]);

  return (
    <div className="relative w-72 h-72 flex items-center justify-center select-none">
      {/* Outer glow ring */}
      <motion.div
        key={`ring-${phaseIdx}`}
        className="absolute inset-0 rounded-full"
        style={{ boxShadow: `0 0 0 2px ${primaryColor}40, 0 0 80px ${primaryColor}35` }}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
      />
      {/* Card background */}
      <div
        className="absolute inset-0 rounded-[32px] overflow-hidden"
        style={{ background: `radial-gradient(circle at 50% 40%, ${primaryColor}22 0%, #0f0f0f 70%)`, border: `1.5px solid ${primaryColor}30` }}
      >
        <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 rounded-tl-[28px]" style={{ borderColor: `${primaryColor}60` }} />
        <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 rounded-tr-[28px]" style={{ borderColor: `${primaryColor}60` }} />
        <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 rounded-bl-[28px]" style={{ borderColor: `${primaryColor}60` }} />
        <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 rounded-br-[28px]" style={{ borderColor: `${primaryColor}60` }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-full pointer-events-none"
          style={{ background: `linear-gradient(to bottom, ${primaryColor}18 0%, transparent 60%)` }} />
      </div>
      {/* Flash overlay */}
      <AnimatePresence>
        {flashing && (
          <motion.div
            className="absolute inset-0 rounded-[32px] z-40 pointer-events-none"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.09 }}
            style={{ background: "white" }}
          />
        )}
      </AnimatePresence>
      {/* Phase content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4">
        <AnimatePresence mode="wait">
          {phase === "badge" && (
            <motion.div key="badge"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.3, filter: "blur(4px)" }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
              className="flex flex-col items-center gap-3"
            >
              <p className="text-[9px] font-black uppercase tracking-[0.25em]" style={{ color: `${primaryColor}90` }}>ACADEMY</p>
              {crestUrl ? (
                <img src={crestUrl} alt={shortName} className="w-28 h-28 object-contain drop-shadow-2xl" />
              ) : (
                <div className="w-28 h-28 rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow-2xl"
                  style={{ background: primaryColor }}>
                  {logoText ?? shortName.slice(0, 2)}
                </div>
              )}
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">{shortName}</p>
            </motion.div>
          )}
          {phase === "name" && (
            <motion.div key="name"
              initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -30, filter: "blur(4px)" }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="flex flex-col items-center gap-1 text-center"
            >
              <p className="text-[9px] font-black uppercase tracking-[0.25em]" style={{ color: `${primaryColor}90` }}>PLAYER</p>
              <h2 className="font-display font-black uppercase leading-none text-white tracking-tight"
                style={{ fontSize: "clamp(2.4rem, 14vw, 3.4rem)", textShadow: `0 0 40px ${primaryColor}80` }}>
                {firstName}
              </h2>
              <h3 className="font-display font-black uppercase leading-none tracking-tight"
                style={{ fontSize: "clamp(1.4rem, 8vw, 2rem)", color: primaryColor, textShadow: `0 0 24px ${primaryColor}60` }}>
                {surname}
              </h3>
            </motion.div>
          )}
          {phase === "number" && (
            <motion.div key="number"
              initial={{ opacity: 0, scale: 2, filter: "blur(12px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.4, filter: "blur(8px)" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex flex-col items-center gap-0"
            >
              <p className="text-[9px] font-black uppercase tracking-[0.25em] mb-1" style={{ color: `${primaryColor}90` }}>SHIRT NUMBER</p>
              <span
                className="font-display font-black leading-none select-none"
                style={{
                  fontSize: "clamp(5rem, 28vw, 7rem)",
                  color: primaryColor,
                  textShadow: `0 0 60px ${primaryColor}90, 0 0 20px ${primaryColor}60`,
                  WebkitTextStroke: `2px ${primaryColor}`,
                }}
              >
                {shirtNumber}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Phase dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {REVEAL_PHASES.map((_, i) => (
          <motion.div
            key={i}
            animate={{ width: i === phaseIdx ? 20 : 6, opacity: i === phaseIdx ? 1 : 0.3 }}
            transition={{ duration: 0.25 }}
            className="h-1.5 rounded-full"
            style={{ background: i === phaseIdx ? primaryColor : "rgba(255,255,255,0.4)" }}
          />
        ))}
      </div>
    </div>
  );
}

export default function Welcome() {
  const [_, navigate] = useLocation();
  const { selectedAcademy, playerData, clearContext } = usePlayerContext();
  const tipsRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [ready, setReady] = useState(false);
  const [revealPhase, setRevealPhase] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [kitImageFailed, setKitImageFailed] = useState(false);
  const [activeChapter, setActiveChapter] = useState(0);
  const [chapterDir, setChapterDir] = useState(1);
  const carouselTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => { setTimeout(() => setReady(true), 200); }, []);

  useEffect(() => {
    const t0 = setTimeout(() => setRevealPhase(1), 200);
    const t1 = setTimeout(() => setRevealPhase(2), 1500);
    const t2 = setTimeout(() => setRevealPhase(3), 2300);
    const t3 = setTimeout(() => setRevealPhase(4), 3400);
    return () => [t0, t1, t2, t3].forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (revealPhase < 4) return;
    carouselTimer.current = setInterval(() => {
      setChapterDir(1);
      setActiveChapter(prev => (prev + 1) % JOURNEY_STAGES.length);
    }, 4000);
    return () => { if (carouselTimer.current) clearInterval(carouselTimer.current); };
  }, [revealPhase]);

  useEffect(() => {
    const audio = new Audio(`${import.meta.env.BASE_URL}audio/love-me-again.mp3`);
    audio.volume = 0.15;
    audio.currentTime = 12;
    audioRef.current = audio;
    audio.play().catch(() => {});
    timeoutRef.current = setTimeout(() => {
      audio.pause();
      audio.src = "";
    }, 120000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      audio.pause();
      audio.src = "";
    };
  }, []);

  const handleMute = () => {
    setIsMuted(true);
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ""; }
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const goChapter = useCallback((dir: 1 | -1) => {
    if (carouselTimer.current) clearInterval(carouselTimer.current);
    setChapterDir(dir);
    setActiveChapter(prev => (prev + dir + JOURNEY_STAGES.length) % JOURNEY_STAGES.length);
    carouselTimer.current = setInterval(() => {
      setChapterDir(1);
      setActiveChapter(p => (p + 1) % JOURNEY_STAGES.length);
    }, 4000);
  }, []);

  if (!selectedAcademy || !playerData) {
    navigate("/");
    return null;
  }

  const posInfo = POSITIONS.find(p => p.id === playerData.position);
  const firstName = playerData.playerName.split(" ")[0];
  const surname = playerData.playerName.split(" ").slice(1).join(" ") || playerData.playerName;
  const btnText = isLightColor(selectedAcademy.primaryColor) ? "#000000" : "#FFFFFF";
  const kitUrl = KIT_IMAGES[selectedAcademy.key];

  const handleLogout = () => {
    audioRef.current?.pause();
    clearContext();
    navigate("/");
  };

  const activeStage = JOURNEY_STAGES[activeChapter];

  return (
    <div className="min-h-screen bg-[#0a0a0a] overflow-x-hidden">

      {/* ── FIFA CARD REVEAL OVERLAY ── */}
      <AnimatePresence>
        {revealPhase < 4 && (
          <motion.div
            key="reveal"
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden"
            style={{ background: "#000" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            {/* Ambient background gradient */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: revealPhase >= 1 ? 1 : 0 }}
              transition={{ duration: 0.6 }}
              style={{
                background: `radial-gradient(ellipse 80% 60% at 50% 60%, ${selectedAcademy.primaryColor}30 0%, transparent 70%)`
              }}
            />

            {/* Scan lines */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px)",
                opacity: revealPhase >= 1 ? 1 : 0
              }}
            />

            {/* WHITE FLASH on phase 2 */}
            <AnimatePresence>
              {revealPhase === 2 && (
                <motion.div
                  key="flash"
                  className="absolute inset-0 bg-white z-10"
                  initial={{ opacity: 0.9 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </AnimatePresence>

            {/* ── JERSEY ── */}
            <AnimatePresence>
              {revealPhase >= 1 && (
                <motion.div
                  key="jersey"
                  className="relative z-20 flex flex-col items-center"
                  initial={{ opacity: 0, y: 80, scale: 0.7 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20, duration: 0.8 }}
                >
                  {/* Glow ring below kit */}
                  <motion.div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full blur-2xl"
                    style={{ backgroundColor: selectedAcademy.primaryColor, width: 200, height: 40, opacity: 0.6 }}
                    animate={{ opacity: [0.4, 0.8, 0.4], scaleX: [1, 1.15, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />

                  {kitUrl && !kitImageFailed ? (
                    <motion.img
                      src={kitUrl}
                      alt={`${selectedAcademy.name} kit`}
                      className="w-56 h-auto object-contain drop-shadow-2xl relative z-10"
                      onError={() => setKitImageFailed(true)}
                      animate={revealPhase >= 2 ? { filter: ["brightness(1)", "brightness(2.5)", "brightness(1)"] } : {}}
                      transition={{ duration: 0.5 }}
                    />
                  ) : (
                    <div className="relative z-10 scale-125">
                      <PlayerJersey
                        surname={surname}
                        number={playerData.shirtNumber}
                        primaryColor={selectedAcademy.primaryColor}
                        secondaryColor={selectedAcademy.secondaryColor}
                      />
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── PLAYER NAME REVEAL ── */}
            <AnimatePresence>
              {revealPhase >= 2 && (
                <motion.div
                  key="name"
                  className="absolute bottom-[30%] left-0 right-0 z-30 text-center px-4"
                  initial={{ opacity: 0, y: 30, letterSpacing: "0.3em" }}
                  animate={{ opacity: 1, y: 0, letterSpacing: "0.08em" }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <motion.p
                    className="text-[10px] uppercase tracking-[0.4em] font-bold mb-2"
                    style={{ color: selectedAcademy.primaryColor }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {selectedAcademy.shortName} Academy
                  </motion.p>
                  <h1
                    className="font-display font-black text-white uppercase leading-none"
                    style={{ fontSize: "clamp(2rem, 10vw, 3.5rem)", textShadow: `0 0 40px ${selectedAcademy.primaryColor}80` }}
                  >
                    {playerData.playerName}
                  </h1>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── SHIRT NUMBER POP ── */}
            <AnimatePresence>
              {revealPhase >= 3 && (
                <motion.div
                  key="number"
                  className="absolute bottom-[14%] left-0 right-0 z-30 flex flex-col items-center gap-1"
                  initial={{ scale: 3.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                >
                  <span
                    className="font-display font-black leading-none"
                    style={{ fontSize: "5rem", color: selectedAcademy.primaryColor, textShadow: `0 0 60px ${selectedAcademy.primaryColor}` }}
                  >
                    #{playerData.shirtNumber}
                  </span>
                  <motion.p
                    className="text-white/60 text-sm font-bold uppercase tracking-widest"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25 }}
                  >
                    {posInfo?.archetype || "The Player"}
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom bar branding */}
            <AnimatePresence>
              {revealPhase >= 3 && (
                <motion.div
                  key="brand"
                  className="absolute bottom-6 left-0 right-0 flex justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div
                    className="text-[9px] uppercase tracking-[0.4em] font-bold px-4 py-1.5 rounded-full"
                    style={{ color: selectedAcademy.primaryColor, border: `1px solid ${selectedAcademy.primaryColor}40`, background: `${selectedAcademy.primaryColor}12` }}
                  >
                    MeTime Stories · Player Portal
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── BG texture ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img src={`${import.meta.env.BASE_URL}images/hero-bg.png`} alt=""
          className="w-full h-full object-cover opacity-20 mix-blend-overlay" />
        <div className="absolute inset-0"
          style={{ background: `radial-gradient(ellipse at 50% 30%, ${selectedAcademy.primaryColor}30 0%, transparent 65%)` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/60 via-transparent to-transparent" />
        {ready && STARS.map((s, i) => (
          <Star key={i} {...s} color={selectedAcademy.primaryColor} />
        ))}
      </div>

      {/* ── HERO CARD ── */}
      <div className="relative z-10">
        <div
          className="absolute inset-0 opacity-30"
          style={{ background: `linear-gradient(160deg, ${selectedAcademy.primaryColor}CC 0%, transparent 65%)` }}
        />

        {/* Top bar */}
        <div className="relative flex items-center justify-between px-5 pt-5 pb-2">
          <button onClick={handleLogout}
            className="flex items-center gap-1.5 text-white/40 hover:text-white/70 transition-colors text-sm min-h-[44px] px-1">
            <LogOut size={15} />
            <span>Log out</span>
          </button>

          <div
            className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase"
            style={{ background: `${selectedAcademy.primaryColor}30`, color: selectedAcademy.primaryColor, border: `1px solid ${selectedAcademy.primaryColor}50` }}
          >
            {selectedAcademy.crestUrl ? (
              <img src={selectedAcademy.crestUrl} alt={selectedAcademy.shortName}
                className="w-4 h-4 object-contain" loading="lazy" />
            ) : null}
            {selectedAcademy.logoText}
          </div>

          {!isMuted && (
            <button onClick={handleMute}
              className="flex items-center gap-1.5 text-white/40 hover:text-white/70 transition-colors text-sm min-h-[44px] px-1">
              <span>🔊</span>
              <span>Mute</span>
            </button>
          )}
        </div>

        {/* PlayerReveal card + identity */}
        <div className="relative flex flex-col items-center px-5 pb-8 pt-2">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 160, damping: 18, delay: 0.15 }}
            className="mb-4"
          >
            <PlayerReveal
              crestUrl={selectedAcademy.crestUrl ?? undefined}
              logoText={selectedAcademy.logoText ?? undefined}
              shortName={selectedAcademy.shortName}
              playerName={playerData.playerName}
              shirtNumber={playerData.shirtNumber}
              primaryColor={selectedAcademy.primaryColor}
            />
          </motion.div>

          {/* Player identity */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="relative z-10 text-center"
          >
            <h1 className="font-display font-black uppercase tracking-tight leading-none mb-1"
              style={{ fontSize: "clamp(2rem, 10vw, 3rem)", color: "white" }}>
              {firstName}
            </h1>
            <p className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: selectedAcademy.primaryColor }}>
              {posInfo?.archetype || "The Player"}
            </p>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/8 text-white/70 border border-white/10">
                {selectedAcademy.name}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/8 text-white/70 border border-white/10">
                {posInfo?.displayName || playerData.position}
              </span>
              <span
                className="px-3 py-1 rounded-full text-xs font-black"
                style={{ background: selectedAcademy.primaryColor, color: btnText }}
              >
                #{playerData.shirtNumber}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── SCROLLABLE CONTENT ── */}
      <div className="relative z-10 px-4 pb-36 space-y-5 max-w-lg mx-auto">

        {/* ── CLUB MESSAGE ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-3xl overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${selectedAcademy.primaryColor}22, ${selectedAcademy.primaryColor}08)`, border: `1px solid ${selectedAcademy.primaryColor}30` }}
        >
          <div className="h-1 w-full" style={{ background: selectedAcademy.primaryColor }} />
          <div className="p-5">
            <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-2">
              {selectedAcademy.name} · Academy
            </p>
            <p className="text-white text-lg font-bold leading-snug mb-2">
              This profile was built<br />for you, <span style={{ color: selectedAcademy.primaryColor }}>{firstName}.</span>
            </p>
            <p className="text-white/55 text-sm leading-relaxed">
              "{selectedAcademy.welcomeMessage}"
            </p>
          </div>
        </motion.div>

        {/* ── PHOTOS ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="rounded-3xl bg-white/4 border border-white/8 p-5"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🎨</span>
            <div>
              <p className="text-white font-bold text-base">Get illustrated</p>
              <p className="text-white/40 text-xs">Your story becomes a book. Give us your likeness.</p>
            </div>
          </div>
          <p className="text-white/50 text-sm leading-relaxed mt-3 mb-4">
            Add up to 3 photos — face, kit, anything that looks like you — so the illustrator can bring you to life on the page.
          </p>
          <LikenessUploader primaryColor={selectedAcademy.primaryColor} />
        </motion.div>

        {/* ── TIPS: horizontal scroll ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-3 px-1">
            Before you start
          </p>
          <div
            ref={tipsRef}
            className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none -mx-4 px-4"
            style={{ scrollbarWidth: "none" }}
          >
            {TIPS.map((tip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.08 }}
                className="snap-start shrink-0 w-52 rounded-2xl p-4 flex flex-col gap-3"
                style={{
                  background: i === 0
                    ? `linear-gradient(135deg, ${selectedAcademy.primaryColor}30, ${selectedAcademy.primaryColor}10)`
                    : "rgba(255,255,255,0.04)",
                  border: i === 0
                    ? `1px solid ${selectedAcademy.primaryColor}40`
                    : "1px solid rgba(255,255,255,0.07)"
                }}
              >
                <span className="text-3xl">{tip.emoji}</span>
                <div>
                  <p className="text-white font-bold text-sm mb-1">{tip.title}</p>
                  <p className="text-white/50 text-xs leading-relaxed">{tip.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <p className="text-white/20 text-[10px] text-right pr-1 mt-1">swipe →</p>
        </motion.div>

        {/* ── CHAPTER CAROUSEL ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center justify-between mb-4 px-1">
            <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">
              Your 6 chapters
            </p>
            <span className="text-xs text-white/25 font-mono">do them in order</span>
          </div>

          {/* Carousel card */}
          <div className="relative overflow-hidden rounded-3xl" style={{ minHeight: 220 }}>
            <AnimatePresence mode="wait" initial={false} custom={chapterDir}>
              <motion.div
                key={activeChapter}
                custom={chapterDir}
                variants={{
                  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
                  center: { x: 0, opacity: 1 },
                  exit:  (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full rounded-3xl p-6 flex flex-col justify-between"
                style={{
                  background: activeChapter === 0
                    ? `linear-gradient(135deg, ${selectedAcademy.primaryColor}35, ${selectedAcademy.primaryColor}10)`
                    : "rgba(255,255,255,0.04)",
                  border: activeChapter === 0
                    ? `1.5px solid ${selectedAcademy.primaryColor}50`
                    : "1px solid rgba(255,255,255,0.08)",
                  boxShadow: activeChapter === 0 ? `0 12px 40px ${selectedAcademy.primaryColor}20` : "none",
                  minHeight: 220,
                }}
              >
                {/* Chapter number + lock */}
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full"
                    style={{
                      background: activeChapter === 0 ? selectedAcademy.primaryColor : "rgba(255,255,255,0.08)",
                      color: activeChapter === 0 ? btnText : "rgba(255,255,255,0.4)"
                    }}
                  >
                    Chapter {activeChapter + 1} of {JOURNEY_STAGES.length}
                  </div>
                  {activeChapter > 0 && (
                    <span className="text-white/20 text-lg">🔒</span>
                  )}
                  {activeChapter === 0 && (
                    <span
                      className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full"
                      style={{ background: `${selectedAcademy.primaryColor}25`, color: selectedAcademy.primaryColor }}
                    >
                      START HERE
                    </span>
                  )}
                </div>

                {/* Emoji + title */}
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-5xl">{activeStage.emoji}</span>
                  <div>
                    <h3 className={`font-black text-xl leading-tight ${activeChapter > 0 ? "text-white/50" : "text-white"}`}>
                      {activeStage.title}
                    </h3>
                    <p className={`text-xs mt-1 leading-relaxed ${activeChapter > 0 ? "text-white/25" : "text-white/55"}`}>
                      {activeStage.description}
                    </p>
                  </div>
                </div>

                {/* Unlocks message */}
                {activeChapter > 0 && (
                  <p className="text-white/20 text-[11px] font-medium italic">
                    Unlocks after completing chapter {activeChapter}
                  </p>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Prev / Next arrows */}
            <button
              onClick={() => goChapter(-1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-white/15"
              style={{ background: "rgba(255,255,255,0.08)" }}
            >
              <ChevronLeft size={16} className="text-white/60" />
            </button>
            <button
              onClick={() => goChapter(1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-white/15"
              style={{ background: "rgba(255,255,255,0.08)" }}
            >
              <ChevronRight size={16} className="text-white/60" />
            </button>
          </div>

          {/* Dot indicators */}
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {JOURNEY_STAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => { setChapterDir(i > activeChapter ? 1 : -1); setActiveChapter(i); }}
                className="rounded-full transition-all"
                style={{
                  width: i === activeChapter ? 20 : 6,
                  height: 6,
                  background: i === activeChapter ? selectedAcademy.primaryColor : "rgba(255,255,255,0.18)",
                }}
              />
            ))}
          </div>
        </motion.div>

      </div>

      {/* ── STICKY CTA ── */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, type: "spring", stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 z-50 px-4 pt-4"
        style={{ background: "linear-gradient(to top, #0a0a0a 60%, transparent)", paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
      >
        <div className="max-w-lg mx-auto">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate("/journey")}
            className="w-full py-4 rounded-2xl font-black text-base uppercase tracking-widest transition-all shadow-2xl font-display"
            style={{
              background: selectedAcademy.primaryColor,
              color: btnText,
              boxShadow: `0 8px 32px ${selectedAcademy.primaryColor}60`
            }}
          >
            Begin My Story →
          </motion.button>
          <p className="text-white/25 text-[10px] text-center mt-2">
            Private · Only your academy sees your answers
          </p>
        </div>
      </motion.div>

    </div>
  );
}
