import { publicAssetUrl } from "@/lib/publicAssetUrl";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { CheckCircle2, Clock, Sparkles, Trophy } from "lucide-react";
import { usePlayerContext } from "@/context/PlayerContext";

const STAR_POSITIONS = [
  { x: "10%", y: "15%", delay: 0.3, size: 3 },
  { x: "88%", y: "10%", delay: 0.5, size: 2 },
  { x: "75%", y: "30%", delay: 0.7, size: 4 },
  { x: "20%", y: "45%", delay: 0.4, size: 2 },
  { x: "92%", y: "55%", delay: 0.9, size: 3 },
  { x: "5%", y: "70%", delay: 0.6, size: 2 },
  { x: "60%", y: "80%", delay: 0.8, size: 3 },
  { x: "35%", y: "88%", delay: 1.0, size: 2 },
];

function isLight(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 160;
}

export default function Complete() {
  const [_, navigate] = useLocation();
  const { playerData, selectedAcademy } = usePlayerContext();
  const [show, setShow] = useState(false);

  useEffect(() => { setTimeout(() => setShow(true), 100); }, []);

  if (!playerData) { navigate("/"); return null; }

  const primaryColor = selectedAcademy?.primaryColor ?? "#6d28d9";
  const btnText = isLight(primaryColor) ? "#000" : "#fff";
  const firstName = playerData.playerName.split(" ")[0];

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col overflow-hidden">
      {/* BG */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img src={publicAssetUrl("images/hero-bg.png")} alt=""
          className="w-full h-full object-cover opacity-15 mix-blend-overlay" />
        {/* Club color radial burst */}
        <div className="absolute inset-0" style={{
          background: `radial-gradient(ellipse at 50% 30%, ${primaryColor}25 0%, transparent 65%)`
        }} />
      </div>

      {/* Floating star particles */}
      {STAR_POSITIONS.map((s, i) => (
        <motion.div
          key={i}
          className="fixed z-10 rounded-full pointer-events-none"
          style={{ left: s.x, top: s.y, width: s.size * 2, height: s.size * 2, background: primaryColor }}
          initial={{ opacity: 0, scale: 0 }}
          animate={show ? { opacity: [0, 0.7, 0], scale: [0, 1, 0], y: [0, -40] } : {}}
          transition={{ delay: s.delay, duration: 2, ease: "easeOut" }}
        />
      ))}

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-5 py-12 max-w-sm mx-auto w-full text-center">

        {/* Trophy icon */}
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
          className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl mb-6 shadow-2xl"
          style={{
            background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}80)`,
            boxShadow: `0 20px 60px ${primaryColor}50`
          }}
        >
          <Trophy size={36} strokeWidth={1.5} className="text-white" />
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-4xl font-display font-black text-white uppercase tracking-tight leading-none mb-2">
            That's a wrap,
          </h1>
          <h1 className="text-4xl font-display font-black uppercase tracking-tight leading-none mb-4"
            style={{ color: primaryColor }}>
            {firstName}.
          </h1>
          <p className="text-white/50 text-base leading-relaxed mb-8">
            Your story is building. We'll compile everything — your journey, your crew's perspective, your academy's view — into something special.
          </p>
        </motion.div>

        {/* Status card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full rounded-2xl overflow-hidden mb-8"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          {[
            { label: "Your journey", status: "done", icon: <CheckCircle2 size={15} className="text-green-400" /> },
            { label: "Family & friends", status: "pending", icon: <Clock size={15} className="text-white/30" /> },
            { label: "Academy staff", status: "pending", icon: <Clock size={15} className="text-white/30" /> },
          ].map((item, i) => (
            <div key={i} className={`flex items-center justify-between px-5 py-4 ${i < 2 ? "border-b border-white/6" : ""}`}>
              <span className={`text-sm font-medium ${item.status === "done" ? "text-white" : "text-white/50"}`}>
                {item.label}
              </span>
              <div className="flex items-center gap-1.5 text-xs">
                {item.icon}
                <span className={item.status === "done" ? "text-green-400" : "text-white/25"}>
                  {item.status === "done" ? "Complete" : "Waiting…"}
                </span>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Player access code */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="w-full rounded-2xl p-4 mb-8 text-center"
          style={{ background: `${primaryColor}15`, border: `1px solid ${primaryColor}30` }}
        >
          <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-1">Your access code</p>
          <p className="text-white font-mono font-black text-lg tracking-widest">{playerData.accessCode}</p>
          <p className="text-white/30 text-xs mt-1">Keep this safe to log back in</p>
        </motion.div>

        {/* Home button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/")}
          className="w-full py-4 rounded-2xl font-black text-base uppercase tracking-widest font-display"
          style={{ background: primaryColor, color: btnText, boxShadow: `0 8px 32px ${primaryColor}55` }}
        >
          Back to Home
        </motion.button>

        {/* MeTime Stories brand stamp */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="flex flex-col items-center gap-1 mt-8"
        >
          <img
            src={publicAssetUrl("images/metime-logo.png")}
            alt="Me Time Stories"
            className="h-10 w-auto object-contain"
            style={{ mixBlendMode: "screen" }}
          />
          <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Me Time Stories</p>
        </motion.div>
      </div>
    </div>
  );
}
