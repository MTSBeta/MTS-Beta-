import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { LogOut } from "lucide-react";
import { PlayerJersey } from "@/components/PlayerJersey";
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

export default function WelcomeU9() {
  const [_, navigate] = useLocation();
  const { selectedAcademy, playerData, clearContext } = usePlayerContext();
  const [ready, setReady] = useState(false);

  useEffect(() => { setTimeout(() => setReady(true), 200); }, []);

  if (!selectedAcademy || !playerData) { navigate("/"); return null; }

  const firstName = playerData.playerName.split(" ")[0];
  const surname = playerData.playerName.split(" ").slice(1).join(" ") || playerData.playerName;
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
        <button
          onClick={() => { clearContext(); navigate("/"); }}
          className="flex items-center gap-1.5 text-white/25 hover:text-white/55 text-xs transition-colors"
        >
          <LogOut size={12} /><span>Log out</span>
        </button>
      </div>

      {/* ── HERO CONTENT ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center pt-4 pb-40">

        {/* Jersey — the hero */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 160, damping: 18, delay: 0.15 }}
          className="relative mb-4"
        >
          {/* Glow behind jersey */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full blur-[60px] opacity-35 pointer-events-none"
            style={{ backgroundColor: primaryColor }}
          />
          <div className="relative z-10 scale-125">
            <PlayerJersey
              surname={surname}
              number={playerData.shirtNumber}
              primaryColor={primaryColor}
              secondaryColor={selectedAcademy.secondaryColor}
            />
          </div>
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
