import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { ChevronLeft, Search } from "lucide-react";
import { PREMIER_LEAGUE, CHAMPIONSHIP, type AcademyConfig } from "@/data/academies";
import { usePlayerContext } from "@/context/PlayerContext";
import { Layout } from "@/components/Layout";
import { ClubBadge } from "@/components/ClubBadge";

type Tier = "premier-league" | "championship" | null;

const PL_LION_SVG = (
  <svg width="36" height="36" viewBox="0 0 80 80" fill="none">
    <circle cx="40" cy="40" r="38" fill="#3D0059" stroke="#9B1BCC" strokeWidth="2" />
    <text x="40" y="50" textAnchor="middle" fontSize="32" fontWeight="900"
      fontFamily="Arial Black, sans-serif" fill="#FFFFFF">PL</text>
  </svg>
);

const CHAMP_SVG = (
  <svg width="36" height="36" viewBox="0 0 80 80" fill="none">
    <circle cx="40" cy="40" r="38" fill="#0033A0" stroke="#C8102E" strokeWidth="2" />
    <text x="40" y="50" textAnchor="middle" fontSize="20" fontWeight="900"
      fontFamily="Arial Black, sans-serif" fill="#FFFFFF">CH</text>
  </svg>
);

export default function Home() {
  const [_, navigate] = useLocation();
  const { selectedAcademy, setSelectedAcademy } = usePlayerContext();
  const [selectedTier, setSelectedTier] = useState<Tier>(
    selectedAcademy ? selectedAcademy.tier : null
  );
  const [search, setSearch] = useState("");

  const clubs = selectedTier === "premier-league" ? PREMIER_LEAGUE : CHAMPIONSHIP;
  const filtered = clubs.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.shortName.toLowerCase().includes(search.toLowerCase())
  );

  const handleTierSelect = (tier: Tier) => {
    setSelectedTier(tier);
    setSearch("");
    if (selectedAcademy?.tier !== tier) setSelectedAcademy(null);
  };

  const handleClubSelect = (academy: AcademyConfig) => {
    setSelectedAcademy(academy);
  };

  const handleStart = () => {
    if (selectedAcademy) navigate("/auth");
  };

  return (
    <Layout hideLogo>
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center pt-8 pb-16 px-4">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 space-y-3"
        >
          <img
            src={`${import.meta.env.BASE_URL}images/metime-logo.png`}
            alt="Me Time Stories"
            className="h-20 w-auto mx-auto object-contain mb-2"
            style={{ mixBlendMode: "screen" }}
          />
          <h1 className="text-4xl md:text-6xl font-display font-black text-white tracking-tight uppercase">
            Player <span className="text-transparent bg-clip-text bg-gradient-to-r from-white/90 to-white/40">Portal</span>
          </h1>
          <p className="text-base md:text-lg text-white/50 max-w-xl mx-auto">
            Select your league, then choose your academy to begin your story.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">

          {/* ── STEP 1: League selection ── */}
          {!selectedTier && (
            <motion.div
              key="tier-select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl"
            >
              {/* Premier League card */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleTierSelect("premier-league")}
                className="relative overflow-hidden group flex flex-col items-center justify-center gap-5 p-8 md:p-10 rounded-3xl border border-white/10 bg-white/5 hover:border-purple-500/50 hover:bg-purple-900/10 transition-all duration-300"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-purple-900/20 to-transparent" />
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <img 
                    src={`${import.meta.env.BASE_URL}logos/premier-league-logo.png`}
                    alt="Premier League"
                    className="h-12 w-auto object-contain drop-shadow-lg"
                    style={{ maxWidth: "120px" }}
                  />
                  <div className="text-center">
                    <div className="text-white font-black text-xl md:text-2xl uppercase tracking-wider font-display">Premier League</div>
                    <div className="text-white/40 text-sm mt-1">20 academies</div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-1.5 mt-1">
                    {["Arsenal", "Chelsea", "Liverpool", "Man City", "Man United"].map(n => (
                      <span key={n} className="text-[10px] text-purple-300/60 bg-purple-900/30 px-2 py-0.5 rounded-full border border-purple-500/20">{n}</span>
                    ))}
                    <span className="text-[10px] text-white/30 px-1">+15 more</span>
                  </div>
                </div>
              </motion.button>

              {/* Championship card */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleTierSelect("championship")}
                className="relative overflow-hidden group flex flex-col items-center justify-center gap-5 p-8 md:p-10 rounded-3xl border border-white/10 bg-white/5 hover:border-sky-500/50 hover:bg-sky-900/10 transition-all duration-300"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-sky-900/20 to-transparent" />
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <svg width="48" height="48" viewBox="0 0 120 120" fill="none" className="drop-shadow-lg">
                    <rect width="120" height="120" rx="12" fill="#0033A0" />
                    <text x="60" y="70" textAnchor="middle" fontSize="36" fontWeight="900" fontFamily="Arial Black, sans-serif" fill="#C8102E">EFL</text>
                  </svg>
                  <div className="text-center">
                    <div className="text-white font-black text-xl md:text-2xl uppercase tracking-wider font-display">Championship</div>
                    <div className="text-white/40 text-sm mt-1">22 academies</div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-1.5 mt-1">
                    {["Leeds", "West Brom", "Sunderland", "Birmingham", "Leeds"].map((n, i) => (
                      i < 4 && <span key={i} className="text-[10px] text-sky-300/60 bg-sky-900/30 px-2 py-0.5 rounded-full border border-sky-500/20">{n}</span>
                    ))}
                    <span className="text-[10px] text-white/30 px-1">+18 more</span>
                  </div>
                </div>
              </motion.button>
            </motion.div>
          )}

          {/* ── STEP 2: Club selection ── */}
          {selectedTier && (
            <motion.div
              key="club-select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full flex flex-col items-center gap-6"
            >
              {/* Back + tier label */}
              <div className="w-full flex items-center gap-3">
                <button
                  onClick={() => { setSelectedTier(null); setSelectedAcademy(null); setSearch(""); }}
                  className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors text-sm"
                >
                  <ChevronLeft size={16} />
                  Back
                </button>
                <div className="flex items-center gap-2">
                  <div
                    className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border"
                    style={selectedTier === "premier-league"
                      ? { background: "rgba(109,28,204,0.2)", borderColor: "rgba(109,28,204,0.5)", color: "#c084fc" }
                      : { background: "rgba(14,116,144,0.2)", borderColor: "rgba(14,116,144,0.5)", color: "#67e8f9" }
                    }
                  >
                    {selectedTier === "premier-league" ? "Premier League" : "EFL Championship"}
                  </div>
                </div>
              </div>

              {/* Search */}
              <div className="w-full max-w-sm relative">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  placeholder="Search your club…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>

              {/* Club grid */}
              <div className="w-full grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 md:gap-4">
                {filtered.map((academy, idx) => {
                  const isSelected = selectedAcademy?.id === academy.id;
                  return (
                    <motion.button
                      key={academy.id}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.03, type: "spring", stiffness: 300, damping: 24 }}
                      onClick={() => handleClubSelect(academy)}
                      className={`
                        relative flex flex-col items-center gap-2 p-3 pt-4 rounded-2xl border transition-all duration-300
                        ${isSelected
                          ? "border-white/50 bg-white/10 scale-105 shadow-lg"
                          : "border-white/8 bg-white/3 hover:bg-white/8 hover:border-white/20"
                        }
                      `}
                      style={isSelected ? {
                        boxShadow: `0 0 24px ${academy.primaryColor}55`,
                        borderColor: `${academy.primaryColor}80`
                      } : {}}
                    >
                      {/* Glow layer when selected */}
                      {isSelected && (
                        <div
                          className="absolute inset-0 rounded-2xl opacity-20 blur-lg"
                          style={{ background: academy.primaryColor }}
                        />
                      )}

                      <div className="relative z-10">
                        <ClubBadge academy={academy} size={52} selected={isSelected} />
                      </div>

                      <span className="relative z-10 text-[11px] font-bold text-white/80 text-center leading-tight max-w-[80px]">
                        {academy.shortName}
                      </span>

                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
                          style={{ background: academy.primaryColor }}
                        >
                          <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5L4.5 7.5L8.5 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {filtered.length === 0 && (
                <p className="text-white/30 text-sm py-8">No clubs found for "{search}"</p>
              )}

              {/* CTA */}
              <AnimatePresence>
                {selectedAcademy && selectedAcademy.tier === selectedTier && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="w-full flex flex-col items-center gap-3 pt-2"
                  >
                    <div className="flex items-center gap-3">
                      <ClubBadge academy={selectedAcademy} size={32} selected />
                      <span className="text-white/70 text-sm font-medium">{selectedAcademy.name}</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleStart}
                      className="px-10 py-3.5 rounded-2xl font-black text-base uppercase tracking-widest transition-all shadow-xl font-display"
                      style={{
                        background: selectedAcademy.primaryColor,
                        color: (() => {
                          const r = parseInt(selectedAcademy.primaryColor.slice(1,3), 16);
                          const g = parseInt(selectedAcademy.primaryColor.slice(3,5), 16);
                          const b = parseInt(selectedAcademy.primaryColor.slice(5,7), 16);
                          return (r*299+g*587+b*114)/1000 > 160 ? "#000000" : "#FFFFFF";
                        })(),
                        boxShadow: `0 8px 32px ${selectedAcademy.primaryColor}60`
                      }}
                    >
                      Start My Journey
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          )}

        </AnimatePresence>
        {/* Login entries */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 pt-8 border-t border-white/8 w-full max-w-2xl flex flex-col items-center gap-3"
        >
          {/* Demo credentials */}
          <div className="text-center mb-2">
            <div className="text-white/40 text-xs font-mono mb-2">Demo Credentials:</div>
            <div className="space-y-1 text-white/50 text-xs font-mono">
              <div>Staff: <span className="text-white/70">coach@arsenal.co.uk</span> / <span className="text-white/70">test123</span></div>
              <div>Admin: <span className="text-white/70">admin@arsenal.co.uk</span> / <span className="text-white/70">admin123</span></div>
            </div>
          </div>

          {/* Staff Login Button */}
          <button
            onClick={() => navigate("/staff-login")}
            className="group flex items-center gap-3 px-6 py-3 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300"
          >
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/15 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/60">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div className="text-left">
              <div className="text-white text-sm font-bold font-display uppercase tracking-wider">
                Academy Staff Login
              </div>
              <div className="text-white/35 text-xs">
                Access the staff portal
              </div>
            </div>
          </button>

          {/* Admin Login Button */}
          <button
            onClick={() => navigate("/admin-login")}
            className="group flex items-center gap-3 px-6 py-3 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300"
          >
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/15 transition-colors">
              <span className="text-base">⚙️</span>
            </div>
            <div className="text-left">
              <div className="text-white text-sm font-bold font-display uppercase tracking-wider">
                Website Admin
              </div>
              <div className="text-white/35 text-xs">
                Manage academy settings
              </div>
            </div>
          </button>
        </motion.div>

      </div>
    </Layout>
  );
}
