import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { LogOut } from "lucide-react";
import { PlayerJersey } from "@/components/PlayerJersey";
import { LikenessUploader } from "@/components/LikenessUploader";
import { usePlayerContext } from "@/context/PlayerContext";
import { POSITIONS } from "@/data/positions";
import { U9_STAGES } from "@/data/u9Questions";

function isLight(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 160;
}

export default function WelcomeU9() {
  const [_, navigate] = useLocation();
  const { selectedAcademy, playerData, clearContext } = usePlayerContext();

  if (!selectedAcademy || !playerData) { navigate("/"); return null; }

  const posInfo = POSITIONS.find(p => p.id === playerData.position);
  const firstName = playerData.playerName.split(" ")[0];
  const surname = playerData.playerName.split(" ").slice(1).join(" ") || playerData.playerName;
  const primaryColor = selectedAcademy.primaryColor;
  const btnText = isLight(primaryColor) ? "#000" : "#fff";

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col overflow-x-hidden">
      {/* BG */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img src={`${import.meta.env.BASE_URL}images/hero-bg.png`} alt=""
          className="w-full h-full object-cover opacity-15 mix-blend-overlay" />
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 0%, ${primaryColor}25 0%, transparent 65%)` }} />
      </div>

      {/* Topbar */}
      <div className="relative z-10 flex items-center justify-between px-4 h-12 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md flex items-center justify-center text-[9px] font-black text-white"
            style={{ background: primaryColor }}>{selectedAcademy.logoText}</div>
          <span className="text-white/40 text-xs font-bold uppercase tracking-widest">{selectedAcademy.shortName}</span>
        </div>
        <button onClick={() => { clearContext(); navigate("/"); }}
          className="flex items-center gap-1.5 text-white/30 hover:text-white/60 text-xs transition-colors">
          <LogOut size={13} /><span>Log out</span>
        </button>
      </div>

      {/* Scrollable content */}
      <div className="relative z-10 flex-1 overflow-y-auto pb-32">
        <div className="max-w-sm mx-auto px-4">

          {/* ── HERO ── */}
          <div className="flex flex-col items-center text-center pt-8 pb-6 relative">
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-[70px] opacity-20 pointer-events-none"
              style={{ backgroundColor: primaryColor }} />

            {/* Big star badge */}
            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              className="text-6xl mb-4 relative z-10"
            >🌟</motion.div>

            {/* Jersey */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative z-10 mb-4"
            >
              <PlayerJersey
                surname={surname}
                number={playerData.shirtNumber}
                primaryColor={primaryColor}
                secondaryColor={selectedAcademy.secondaryColor}
              />
            </motion.div>

            {/* Name */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="relative z-10">
              <h1 className="text-4xl font-display font-black text-white uppercase tracking-tight mb-1">{firstName}</h1>
              <div className="flex items-center justify-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold"
                  style={{ background: primaryColor, color: btnText }}>{selectedAcademy.shortName}</span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/8 text-white/60 border border-white/10">
                  #{playerData.shirtNumber}
                </span>
              </div>
            </motion.div>
          </div>

          {/* ── WELCOME MESSAGE ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-3xl p-5 mb-4 text-center"
            style={{ background: `${primaryColor}18`, border: `1px solid ${primaryColor}40` }}
          >
            <p className="text-2xl font-black text-white mb-2">
              Welcome to the Academy, {firstName}! 🎉
            </p>
            <p className="text-white/60 text-sm leading-relaxed">
              You've made it! Now we're going to make <span className="text-white font-bold">your very own book</span> — all about you, your football, and your big dreams.
            </p>
          </motion.div>

          {/* ── HOW IT WORKS ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-4"
          >
            <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-3 px-1">Your story — 5 chapters</p>
            <div className="space-y-2">
              {U9_STAGES.filter(s => !s.isCoaching).map((stage, i) => (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55 + i * 0.08 }}
                  className="flex items-center gap-4 p-4 rounded-2xl"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                    style={{ background: `${stage.colour}25` }}>
                    {stage.emoji}
                  </div>
                  <div>
                    <p className="text-white font-bold text-base">{stage.title}</p>
                    <p className="text-white/40 text-xs">{stage.intro}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Coach note */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.95 }}
              className="flex items-center gap-4 p-4 rounded-2xl mt-2"
              style={{ background: "rgba(13,148,136,0.08)", border: "1px dashed rgba(13,148,136,0.25)" }}
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                style={{ background: "rgba(13,148,136,0.15)" }}>
                👨‍🏫
              </div>
              <div>
                <p className="text-[#0d9488] font-bold text-base">Coach Notes</p>
                <p className="text-white/30 text-xs">Your coach fills this in — adds special messages to your book</p>
              </div>
            </motion.div>
          </motion.div>

          {/* ── TIPS ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.72 }}
            className="rounded-2xl p-4 mb-4"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-3">Top tips</p>
            <div className="space-y-2">
              {[
                { emoji: "🎙️", tip: "Use the big voice button to talk — it's easier than typing!" },
                { emoji: "😊", tip: "There are NO wrong answers. Just say what you really think." },
                { emoji: "⏸️", tip: "You can stop and come back anytime. No rush at all." },
              ].map((t, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-xl shrink-0">{t.emoji}</span>
                  <p className="text-white/55 text-sm leading-relaxed">{t.tip}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── LIKENESS PHOTOS ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.82 }}
            className="rounded-2xl p-4 mb-4"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-1">Optional — add your photos now</p>
            <p className="text-white/30 text-xs mb-4 leading-relaxed">
              We'll ask for these inside the journey too — but you can add them here first if you like!
            </p>
            <LikenessUploader primaryColor={primaryColor} />
          </motion.div>

        </div>
      </div>

      {/* ── STICKY CTA ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, type: "spring", stiffness: 180 }}
        className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-4"
        style={{ background: "linear-gradient(to top, #0a0a0a 60%, transparent)" }}
      >
        <div className="max-w-sm mx-auto">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate("/journey-u9")}
            className="w-full py-4 rounded-2xl font-black text-lg uppercase tracking-widest font-display"
            style={{ background: primaryColor, color: btnText, boxShadow: `0 8px 32px ${primaryColor}60` }}
          >
            Let's Make My Book! 📖
          </motion.button>
          <p className="text-white/25 text-[10px] text-center mt-2">
            Only the academy will see your answers
          </p>
        </div>
      </motion.div>
    </div>
  );
}
