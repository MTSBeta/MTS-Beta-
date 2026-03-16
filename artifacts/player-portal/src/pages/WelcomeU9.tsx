import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { LogOut } from "lucide-react";
import { usePlayerContext } from "@/context/PlayerContext";

function isLight(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 160;
}

// Floating star particle
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

const STARS = Array.from({ length: 18 }, (_, i) => ({
  x: Math.random() * 90 + 5,
  y: Math.random() * 60 + 10,
  size: Math.random() * 4 + 2,
  delay: Math.random() * 2,
}));

const REVEAL_PHASES = ["badge", "name", "number"] as const;
type RevealPhase = typeof REVEAL_PHASES[number];
const PHASE_DURATIONS: Record<RevealPhase, number> = { badge: 2400, name: 2200, number: 2400 };

function PlayerReveal({
  crestUrl, logoText, shortName, playerName, shirtNumber, primaryColor, secondaryColor,
}: {
  crestUrl?: string; logoText?: string; shortName: string;
  playerName: string; shirtNumber: number | string; primaryColor: string; secondaryColor?: string;
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
      {/* Outer glow ring — pulses on phase */}
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
        {/* Corner accent lines */}
        <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 rounded-tl-[28px]" style={{ borderColor: `${primaryColor}60` }} />
        <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 rounded-tr-[28px]" style={{ borderColor: `${primaryColor}60` }} />
        <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 rounded-bl-[28px]" style={{ borderColor: `${primaryColor}60` }} />
        <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 rounded-br-[28px]" style={{ borderColor: `${primaryColor}60` }} />
        {/* Spotlight beam from top */}
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
                  {logoText ?? shortName.slice(0,2)}
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
                style={{ fontSize: "clamp(1.4rem, 8vw, 2rem)", color: `${primaryColor}`, textShadow: `0 0 24px ${primaryColor}60` }}>
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
        {REVEAL_PHASES.map((p, i) => (
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

export default function WelcomeU9() {
  const [_, navigate] = useLocation();
  const { selectedAcademy, playerData, clearContext } = usePlayerContext();
  const [ready, setReady] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setTimeout(() => setReady(true), 200); }, []);

  useEffect(() => {
    // Play theme music at 15% volume for 2 minutes (skip first 12 seconds)
    const audio = new Audio(`${import.meta.env.BASE_URL}audio/love-me-again.mp3`);
    audio.volume = 0.15; // 15% volume - subtle background
    audio.currentTime = 12; // Skip first 12 seconds
    audioRef.current = audio;
    audio.play().catch(() => {});
    timeoutRef.current = setTimeout(() => { 
      audio.pause(); 
      audio.src = ""; 
    }, 120000); // 2 minutes
    return () => { 
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      audio.pause(); 
      audio.src = ""; 
    };
  }, []);

  const handleMute = () => {
    setIsMuted(true);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  if (!selectedAcademy || !playerData) { navigate("/"); return null; }

  const firstName = playerData.playerName.split(" ")[0];
  const primaryColor = selectedAcademy.primaryColor;
  const btnText = isLight(primaryColor) ? "#000" : "#fff";

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col overflow-hidden select-none">

      {/* ── BACKGROUND ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Stadium BG */}
        <img
          src={`${import.meta.env.BASE_URL}images/hero-bg.png`} alt=""
          className="w-full h-full object-cover opacity-20 mix-blend-overlay"
        />
        {/* Club color radial glow */}
        <div className="absolute inset-0"
          style={{ background: `radial-gradient(ellipse at 50% 30%, ${primaryColor}30 0%, transparent 65%)` }} />
        {/* Bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
        {/* Subtle top vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/60 via-transparent to-transparent" />
        {/* Floating stars */}
        {ready && STARS.map((s, i) => (
          <Star key={i} {...s} color={primaryColor} delay={s.delay} />
        ))}
      </div>

      {/* ── TOPBAR ── */}
      <div className="relative z-20 flex items-center justify-between px-5 pt-4 pb-2">
        <div className="flex items-center gap-2">
          {selectedAcademy.crestUrl ? (
            <img src={selectedAcademy.crestUrl} alt={selectedAcademy.shortName}
              className="w-7 h-7 object-contain drop-shadow-md" loading="lazy" />
          ) : (
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-black text-white shadow-md"
              style={{ background: primaryColor }}>
              {selectedAcademy.logoText}
            </div>
          )}
          <span className="text-white/35 text-xs font-bold uppercase tracking-widest">{selectedAcademy.shortName}</span>
        </div>
        <div className="flex items-center gap-3">
          {!isMuted && (
            <button onClick={handleMute}
              className="flex items-center gap-1.5 text-white/40 hover:text-white/70 transition-colors text-xs">
              <span>🔊</span>
              <span>Mute</span>
            </button>
          )}
          <button
            onClick={() => { audioRef.current?.pause(); clearContext(); navigate("/"); }}
            className="flex items-center gap-1.5 text-white/25 hover:text-white/55 text-xs transition-colors"
          >
            <LogOut size={12} /><span>Log out</span>
          </button>
        </div>
      </div>

      {/* ── HERO CONTENT ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center pt-4 pb-40">

        {/* Player Reveal Carousel */}
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
            primaryColor={primaryColor}
            secondaryColor={selectedAcademy.secondaryColor ?? undefined}
          />
        </motion.div>

        {/* Name */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mb-5"
        >
          <h1
            className="font-display font-black uppercase tracking-tight leading-none mb-3"
            style={{ fontSize: "clamp(2.8rem, 12vw, 4rem)", color: "white" }}
          >
            {firstName}
          </h1>
          <div className="flex items-center justify-center gap-2">
            <span
              className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide shadow-md"
              style={{ background: primaryColor, color: btnText }}
            >
              {selectedAcademy.shortName}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/8 text-white/55 border border-white/10">
              #{playerData.shirtNumber}
            </span>
          </div>
        </motion.div>

        {/* Quick info strip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-6 mb-2"
        >
          {[
            { emoji: "🎙️", label: "Talk or type" },
            { emoji: "🧬", label: "Player DNA quiz" },
            { emoji: "📖", label: "Your book" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className="text-2xl">{item.emoji}</span>
              <span className="text-white/30 text-[9px] font-bold uppercase tracking-wide">{item.label}</span>
            </div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="text-white/30 text-xs"
        >
          No wrong answers — just be yourself! 😊
        </motion.p>
      </div>

      {/* ── STICKY CTA ── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-30 px-5 pb-8 pt-6"
        style={{ background: "linear-gradient(to top, #0a0a0a 55%, transparent)" }}
      >
        <div className="max-w-sm mx-auto space-y-3">
          <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.75, type: "spring", stiffness: 200 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/journey-u9")}
            className="relative w-full py-5 rounded-3xl font-black text-xl uppercase tracking-widest font-display overflow-hidden"
            style={{
              background: primaryColor,
              color: btnText,
              boxShadow: `0 12px 48px ${primaryColor}70, 0 4px 16px ${primaryColor}40`,
            }}
          >
            {/* Animated shimmer on button */}
            <motion.div
              className="absolute inset-0 opacity-0"
              animate={{ opacity: [0, 0.15, 0], x: ["-100%", "100%"] }}
              transition={{ delay: 1.2, duration: 1.2, repeat: Infinity, repeatDelay: 3 }}
              style={{ background: "linear-gradient(90deg, transparent, white, transparent)" }}
            />
            <span className="relative z-10">Start My Story ▶</span>
          </motion.button>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-white/20 text-[10px] text-center"
          >
            Your answers are private — only your academy sees them
          </motion.p>
        </div>
      </div>
    </div>
  );
}
