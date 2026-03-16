import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { LogOut, Music2, VolumeX } from "lucide-react";
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

function isLightColor(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 155;
}

export default function Welcome() {
  const [_, navigate] = useLocation();
  const { selectedAcademy, playerData, clearContext } = usePlayerContext();
  const tipsRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [chantPlaying, setChantPlaying] = useState(false);
  const [chantBlocked, setChantBlocked] = useState(false);

  const chantUrl = selectedAcademy?.chantUrl ?? null;

  const toggleChant = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (chantPlaying) {
      audio.pause();
      setChantPlaying(false);
    } else {
      audio.play().then(() => { setChantPlaying(true); setChantBlocked(false); }).catch(() => setChantPlaying(false));
    }
  }, [chantPlaying]);

  useEffect(() => {
    if (!chantUrl) return;
    const audio = new Audio(chantUrl);
    audio.volume = 0.55;
    audio.loop = true;
    audioRef.current = audio;
    audio.play()
      .then(() => setChantPlaying(true))
      .catch(() => setChantBlocked(true));
    return () => { audio.pause(); audio.src = ""; };
  }, [chantUrl]);

  if (!selectedAcademy || !playerData) {
    navigate("/");
    return null;
  }

  const posInfo = POSITIONS.find(p => p.id === playerData.position);
  const firstName = playerData.playerName.split(" ")[0];
  const surname = playerData.playerName.split(" ").slice(1).join(" ") || playerData.playerName;
  const btnText = isLightColor(selectedAcademy.primaryColor) ? "#000000" : "#FFFFFF";

  const handleLogout = () => {
    audioRef.current?.pause();
    clearContext();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] overflow-x-hidden">

      {/* ── BG texture ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img src={`${import.meta.env.BASE_URL}images/hero-bg.png`} alt=""
          className="w-full h-full object-cover opacity-20 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/60 to-[#0a0a0a]" />
      </div>

      {/* ── HERO CARD ── */}
      <div className="relative z-10">
        {/* Club colour gradient fill */}
        <div
          className="absolute inset-0 opacity-30"
          style={{ background: `linear-gradient(160deg, ${selectedAcademy.primaryColor}CC 0%, transparent 65%)` }}
        />

        {/* Top bar */}
        <div className="relative flex items-center justify-between px-5 pt-5 pb-2">
          <button onClick={handleLogout}
            className="flex items-center gap-1.5 text-white/40 hover:text-white/70 transition-colors text-xs">
            <LogOut size={13} />
            <span>Log out</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Chant button */}
            {selectedAcademy.chantUrl && (
              <AnimatePresence mode="wait">
                <motion.button
                  key={chantPlaying ? "playing" : "stopped"}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  onClick={toggleChant}
                  title={chantPlaying ? "Mute chant" : chantBlocked ? "Tap to play club chant" : "Play club chant"}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all"
                  style={chantPlaying
                    ? { background: `${selectedAcademy.primaryColor}25`, color: selectedAcademy.primaryColor, border: `1px solid ${selectedAcademy.primaryColor}50` }
                    : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.10)" }
                  }
                >
                  {chantPlaying ? (
                    <>
                      <motion.span
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ repeat: Infinity, duration: 0.9 }}
                      >
                        <Music2 size={11} />
                      </motion.span>
                      <span>chant</span>
                    </>
                  ) : (
                    <>
                      <VolumeX size={11} />
                      <span>{chantBlocked ? "play chant" : "chant off"}</span>
                    </>
                  )}
                </motion.button>
              </AnimatePresence>
            )}

            {/* Club badge */}
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
          </div>
        </div>

        {/* Jersey + player card */}
        <div className="relative flex flex-col items-center px-5 pb-8 pt-2">

          {/* Ambient glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-[70px] opacity-20 pointer-events-none"
            style={{ backgroundColor: selectedAcademy.primaryColor }} />

          {/* Jersey */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 18, delay: 0.1 }}
            className="relative z-10 mb-2"
          >
            <PlayerJersey
              surname={surname}
              number={playerData.shirtNumber}
              primaryColor={selectedAcademy.primaryColor}
              secondaryColor={selectedAcademy.secondaryColor}
            />
          </motion.div>

          {/* Player identity */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="relative z-10 text-center"
          >
            <h1 className="text-4xl font-display font-black text-white uppercase tracking-tight leading-none mb-1">
              {playerData.playerName}
            </h1>
            <p className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: selectedAcademy.primaryColor }}>
              {posInfo?.archetype || "The Player"}
            </p>
            {/* Chips */}
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
          <div
            className="h-1 w-full"
            style={{ background: selectedAcademy.primaryColor }}
          />
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

        {/* ── 6 STAGES ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center justify-between mb-3 px-1">
            <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">
              Your 6 chapters
            </p>
            <span className="text-xs text-white/25 font-mono">do them in order</span>
          </div>

          <div className="space-y-2">
            {JOURNEY_STAGES.map((stage, i) => (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.75 + i * 0.07 }}
                className="flex items-center gap-4 rounded-2xl px-4 py-3.5"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)"
                }}
              >
                {/* Step number bubble */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black shrink-0"
                  style={{
                    background: i === 0 ? selectedAcademy.primaryColor : "rgba(255,255,255,0.08)",
                    color: i === 0 ? btnText : "rgba(255,255,255,0.4)"
                  }}
                >
                  {i + 1}
                </div>

                {/* Emoji + text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{stage.emoji}</span>
                    <span className="text-white font-bold text-sm">{stage.title}</span>
                  </div>
                  <p className="text-white/35 text-xs mt-0.5 truncate">{stage.description}</p>
                </div>

                {/* Lock icon for future stages */}
                {i > 0 && (
                  <span className="text-white/15 text-xs shrink-0">🔒</span>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* ── STICKY CTA ── */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, type: "spring", stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-4"
        style={{ background: "linear-gradient(to top, #0a0a0a 60%, transparent)" }}
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
