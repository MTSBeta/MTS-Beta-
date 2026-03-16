import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { ClubBadge } from "@/components/ClubBadge";
import { usePlayerContext } from "@/context/PlayerContext";
import { ACADEMIES } from "@/data/academies";

type Mode = "choose" | "login";

export default function Auth() {
  const [_, navigate] = useLocation();
  const { selectedAcademy, setPlayerData, setSelectedAcademy } = usePlayerContext();
  const [mode, setMode] = useState<Mode>("choose");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!selectedAcademy) {
    navigate("/");
    return null;
  }

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

      if (player.status === "registered") navigate("/welcome");
      else if (player.status === "journey_complete") navigate("/invite");
      else if (player.status === "links_generated") navigate("/invite");
      else navigate("/welcome");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isLight = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 160;
  };
  const btnTextColor = isLight(selectedAcademy.primaryColor) ? "#000000" : "#FFFFFF";

  return (
    <Layout>
      <div className="w-full max-w-md mx-auto flex flex-col items-center gap-8 pt-4">

        {/* Club badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-3"
        >
          <ClubBadge academy={selectedAcademy} size={72} selected />
          <p className="text-white/50 text-sm">
            {selectedAcademy.tier === "premier-league" ? "Premier League" : "EFL Championship"}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">

          {/* ── CHOOSE MODE ── */}
          {mode === "choose" && (
            <motion.div
              key="choose"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="w-full flex flex-col gap-4"
            >
              <div className="text-center mb-2">
                <h2 className="text-2xl font-display font-black text-white uppercase tracking-wider">
                  Welcome to<br />{selectedAcademy.shortName}
                </h2>
                <p className="text-white/45 text-sm mt-2">Are you new, or coming back?</p>
              </div>

              {/* New player */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/register")}
                className="w-full flex flex-col gap-1 p-5 rounded-2xl text-left transition-all border border-white/10 bg-white/5 hover:bg-white/8 hover:border-white/25"
                style={{ boxShadow: `0 0 0 0 ${selectedAcademy.primaryColor}` }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                    style={{ background: selectedAcademy.primaryColor, color: btnTextColor }}
                  >
                    ✦
                  </div>
                  <div>
                    <div className="text-white font-bold text-base">Create your profile</div>
                    <div className="text-white/45 text-xs">New to the portal — register and start your story</div>
                  </div>
                </div>
              </motion.button>

              {/* Returning player */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setMode("login")}
                className="w-full flex flex-col gap-1 p-5 rounded-2xl text-left transition-all border border-white/10 bg-white/5 hover:bg-white/8 hover:border-white/25"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg bg-white/8 shrink-0">
                    🔑
                  </div>
                  <div>
                    <div className="text-white font-bold text-base">Log back in</div>
                    <div className="text-white/45 text-xs">Already registered — use your access code to continue</div>
                  </div>
                </div>
              </motion.button>

              <button
                onClick={() => navigate("/")}
                className="text-white/30 hover:text-white/60 text-xs text-center mt-1 transition-colors"
              >
                ← Choose a different academy
              </button>
            </motion.div>
          )}

          {/* ── LOGIN MODE ── */}
          {mode === "login" && (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="w-full flex flex-col gap-5"
            >
              <div className="text-center">
                <h2 className="text-2xl font-display font-black text-white uppercase tracking-wider">
                  Enter Your Code
                </h2>
                <p className="text-white/45 text-sm mt-2">
                  Enter the access code from your registration — it looks like <span className="font-mono text-white/70">PLY-XXXXXXXX</span>
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="PLY-XXXXXXXX"
                  value={code}
                  onChange={e => { setCode(e.target.value); setError(null); }}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3.5 text-white text-base font-mono placeholder:text-white/25 focus:outline-none focus:border-white/40 transition-colors text-center tracking-widest uppercase"
                  spellCheck={false}
                  autoComplete="off"
                />

                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-400 text-sm text-center"
                  >
                    {error}
                  </motion.p>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleLogin}
                  disabled={isLoading || !code.trim()}
                  className="w-full py-3.5 rounded-xl font-black text-base uppercase tracking-widest transition-all disabled:opacity-50 disabled:pointer-events-none font-display"
                  style={{ background: selectedAcademy.primaryColor, color: btnTextColor, boxShadow: `0 6px 24px ${selectedAcademy.primaryColor}50` }}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Signing in…
                    </span>
                  ) : "Sign In →"}
                </motion.button>
              </div>

              <button
                onClick={() => { setMode("choose"); setError(null); setCode(""); }}
                className="text-white/30 hover:text-white/60 text-xs text-center transition-colors"
              >
                ← Back
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </Layout>
  );
}
