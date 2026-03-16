import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/Button";
import { PlayerJersey } from "@/components/PlayerJersey";
import { usePlayerContext } from "@/context/PlayerContext";
import { POSITIONS } from "@/data/positions";
import { JOURNEY_STAGES } from "@/data/questions";

const TIPS = [
  {
    icon: "🎙️",
    title: "Use your voice",
    body: "Every question has a voice note button. Use it. Your actual voice — the pauses, the energy — adds something written words can't."
  },
  {
    icon: "💬",
    title: "These questions go deep",
    body: "Some will feel unusual. That's intentional. The academy wants your real story, not a performance."
  },
  {
    icon: "⏸️",
    title: "Take your time",
    body: "You can pause between stages and come back. There's no timer. Think before you answer."
  },
  {
    icon: "✅",
    title: "No wrong answers",
    body: "There's no right thing to say here. Whatever is true for you is exactly what we're looking for."
  },
];

export default function Welcome() {
  const [_, navigate] = useLocation();
  const { selectedAcademy, playerData } = usePlayerContext();

  if (!selectedAcademy || !playerData) {
    navigate("/");
    return null;
  }

  const posInfo = POSITIONS.find(p => p.id === playerData.position);
  const firstName = playerData.playerName.split(" ")[0];
  const surname = playerData.playerName.split(" ").slice(1).join(" ") || playerData.playerName;

  return (
    <Layout>
      <div className="w-full max-w-2xl mx-auto pb-16">

        {/* ── HERO ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center pt-8 pb-10 relative"
        >
          {/* Ambient glow behind jersey */}
          <div
            className="absolute top-20 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-[80px] opacity-25 pointer-events-none"
            style={{ backgroundColor: selectedAcademy.primaryColor }}
          />

          {/* Club badge */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="w-16 h-16 rounded-2xl flex items-center justify-center font-display font-black text-white text-lg shadow-2xl mb-6 relative z-10"
            style={{
              backgroundColor: selectedAcademy.primaryColor,
              boxShadow: `0 0 40px ${selectedAcademy.primaryColor}80, 0 8px 32px rgba(0,0,0,0.4)`,
            }}
          >
            {selectedAcademy.logoText}
          </motion.div>

          {/* Jersey */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative z-10 mb-5"
          >
            <PlayerJersey
              surname={surname}
              number={playerData.shirtNumber}
              primaryColor={selectedAcademy.primaryColor}
              secondaryColor={selectedAcademy.secondaryColor}
            />
          </motion.div>

          {/* Player name */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="relative z-10"
          >
            <h1 className="text-3xl md:text-4xl font-display font-black text-white uppercase tracking-wide mb-1">
              {playerData.playerName}
            </h1>
            <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: selectedAcademy.primaryColor }}>
              {posInfo?.archetype || "The Player"}
            </p>
            <p className="text-white/50 text-sm mt-0.5">
              {selectedAcademy.name} · {posInfo?.displayName || playerData.position} · #{playerData.shirtNumber}
            </p>
          </motion.div>
        </motion.div>

        {/* ── PERSONAL MESSAGE ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-panel rounded-3xl p-6 md:p-8 mb-6"
        >
          <p className="text-white/50 text-xs uppercase tracking-widest font-bold mb-3">
            A message from {selectedAcademy.name}
          </p>
          <p className="text-xl md:text-2xl text-white font-medium leading-relaxed mb-5">
            This profile was built specifically for you, <span className="font-black">{firstName}</span>.
          </p>
          <blockquote
            className="text-base text-white/80 leading-relaxed italic border-l-4 pl-5"
            style={{ borderColor: selectedAcademy.primaryColor }}
          >
            "{selectedAcademy.welcomeMessage}"
          </blockquote>
        </motion.div>

        {/* ── TIPS ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <p className="text-white/40 text-xs uppercase tracking-widest font-bold mb-3 px-1">
            Before you start
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TIPS.map((tip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 + i * 0.07 }}
                className="glass-panel rounded-2xl p-4 flex gap-3 items-start"
              >
                <span className="text-2xl flex-shrink-0 mt-0.5">{tip.icon}</span>
                <div>
                  <p className="text-white font-bold text-sm mb-0.5">{tip.title}</p>
                  <p className="text-white/55 text-xs leading-relaxed">{tip.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── STAGES PREVIEW ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.72 }}
          className="glass-panel rounded-3xl p-6 md:p-8 mb-8"
        >
          <p className="text-white/40 text-xs uppercase tracking-widest font-bold mb-1">
            Your 6-Stage Journey
          </p>
          <p className="text-white/70 text-sm mb-5">
            Each stage unlocks a different part of your story. Work through them in order.
          </p>

          <div className="space-y-2">
            {JOURNEY_STAGES.map((stage, i) => (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.78 + i * 0.06 }}
                className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/8 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center text-base flex-shrink-0">
                  {stage.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-white/30 font-mono text-xs">{i + 1}</span>
                    <span className="text-white font-bold text-sm">{stage.title}</span>
                  </div>
                  <p className="text-white/45 text-xs truncate">{stage.description}</p>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-white/15 flex-shrink-0" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1 }}
          className="flex flex-col items-center gap-3"
        >
          <Button
            size="lg"
            onClick={() => navigate("/journey")}
            className="w-full sm:w-auto px-16 text-base"
          >
            Begin My Story
          </Button>
          <p className="text-white/30 text-xs text-center max-w-xs">
            Your answers are private and will only be seen by your academy. Take as long as you need.
          </p>
        </motion.div>

      </div>
    </Layout>
  );
}
