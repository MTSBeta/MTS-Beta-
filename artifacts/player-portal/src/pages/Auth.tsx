import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { ChevronLeft } from "lucide-react";
import { ClubBadge } from "@/components/ClubBadge";
import { usePlayerContext } from "@/context/PlayerContext";
import { ACADEMIES } from "@/data/academies";

type Mode = "choose" | "login";

function isLight(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 160;
}

export default function Auth() {
  const [_, navigate] = useLocation();
  const { selectedAcademy, setPlayerData, setSelectedAcademy } = usePlayerContext();
  const [mode, setMode] = useState<Mode>("choose");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!selectedAcademy) { navigate("/"); return null; }

  const btnText = isLight(selectedAcademy.primaryColor) ? "#000" : "#fff";

  const handleLogin = async () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) { setError("Please enter your access code."); return; }
    setError(null);
    setIsLoading(true);
    try {
      const base = import.meta.env.BASE_URL.replace(/\/$/, "");
      const res = await fetch(`${base}/api/players/by-code/${encodeURIComponent(trimmed)}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? "Access code not found. Check your code and try again.");
        return;
      }
      const player = await res.json();
      setPlayerData(player);
      const academy = ACADEMIES.find(a => a.key === player.academyKey);
      if (academy) setSelectedAcademy(academy);
      if (player.status === "journey_complete" || player.status === "links_generated") navigate("/invite");
      else navigate("/welcome");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* BG */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img src={`${import.meta.env.BASE_URL}images/hero-bg.png`} alt=""
          className="w-full h-full object-cover opacity-15 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0a]" />
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 0%, ${selectedAcademy.primaryColor}18 0%, transparent 60%)` }} />
      </div>

      {/* Topbar */}
      <div className="relative z-10 flex items-center px-4 h-12 border-b border-white/5">
        <button onClick={() => navigate("/")} className="flex items-center gap-1 text-white/40 hover:text-white/70 text-xs transition-colors py-2 -ml-1">
          <ChevronLeft size={15} />
          Back
        </button>
      </div>

      {/* Body */}
      <div className="relative z-10 flex-1 flex flex-col items-center px-4 pt-10 pb-8 max-w-sm mx-auto w-full">

        {/* Club identity */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="flex flex-col items-center gap-3 mb-8"
        >
          <ClubBadge academy={selectedAcademy} size={80} selected />
          <div className="text-center">
            <h1 className="text-2xl font-display font-black text-white uppercase tracking-wider">
              {selectedAcademy.shortName}
            </h1>
            <p className="text-white/35 text-xs mt-0.5">
              {selectedAcademy.tier === "premier-league" ? "Premier League" : "EFL Championship"}
            </p>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">

          {/* ── CHOOSE ── */}
          {mode === "choose" && (
            <motion.div key="choose"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              className="w-full flex flex-col gap-3"
            >
              <p className="text-white/45 text-sm text-center mb-2">Are you new here, or coming back?</p>

              {/* New player */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/register")}
                className="w-full flex items-center gap-4 p-5 rounded-2xl text-left border transition-all active:scale-97"
                style={{ background: `${selectedAcademy.primaryColor}18`, borderColor: `${selectedAcademy.primaryColor}50` }}
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 font-black"
                  style={{ background: selectedAcademy.primaryColor, color: btnText }}>✦</div>
                <div>
                  <p className="text-white font-bold text-base">Create my profile</p>
                  <p className="text-white/40 text-xs mt-0.5">New player — register and start</p>
                </div>
              </motion.button>

              {/* Returning player */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setMode("login")}
                className="w-full flex items-center gap-4 p-5 rounded-2xl text-left border border-white/8 bg-white/4 transition-all"
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl bg-white/8 shrink-0">🔑</div>
                <div>
                  <p className="text-white font-bold text-base">Log back in</p>
                  <p className="text-white/40 text-xs mt-0.5">Use your access code to continue</p>
                </div>
              </motion.button>
            </motion.div>
          )}

          {/* ── LOGIN ── */}
          {mode === "login" && (
            <motion.div key="login"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              className="w-full flex flex-col gap-4"
            >
              <div className="text-center mb-2">
                <h2 className="text-xl font-display font-black text-white uppercase tracking-wider">Enter Your Code</h2>
                <p className="text-white/40 text-sm mt-1">
                  Your code looks like <span className="font-mono text-white/60">PLY-XXXXXXXX</span>
                </p>
              </div>

              <input
                type="text"
                inputMode="text"
                placeholder="PLY-XXXXXXXX"
                value={code}
                onChange={e => { setCode(e.target.value); setError(null); }}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                className="w-full bg-white/6 border border-white/15 rounded-2xl px-4 py-4 text-white text-lg font-mono placeholder:text-white/20 focus:outline-none focus:border-white/40 transition-colors text-center tracking-widest uppercase"
                spellCheck={false}
                autoComplete="off"
                autoCapitalize="characters"
              />

              {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-red-400 text-sm text-center bg-red-500/10 rounded-xl px-3 py-2">
                  {error}
                </motion.p>
              )}

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleLogin}
                disabled={isLoading || !code.trim()}
                className="w-full py-4 rounded-2xl font-black text-base uppercase tracking-widest transition-all disabled:opacity-40 font-display"
                style={{ background: selectedAcademy.primaryColor, color: btnText, boxShadow: `0 6px 24px ${selectedAcademy.primaryColor}50` }}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in…
                  </span>
                ) : "Sign In →"}
              </motion.button>

              <button onClick={() => { setMode("choose"); setError(null); setCode(""); }}
                className="text-white/30 hover:text-white/60 text-sm text-center py-2 transition-colors">
                ← Back
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
