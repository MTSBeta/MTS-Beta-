import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { ChevronLeft, Search, Copy, Check } from "lucide-react";
import { PREMIER_LEAGUE, CHAMPIONSHIP, type AcademyConfig } from "@/data/academies";
import { usePlayerContext } from "@/context/PlayerContext";
import { Layout } from "@/components/Layout";
import { ClubBadge } from "@/components/ClubBadge";
import { LeagueBadge } from "@/components/BadgeSystem";

type Tier = "premier-league" | "championship" | null;

const PL_LION_SVG = (
  <svg width="36" height="36" viewBox="0 0 80 80" fill="none">
    <circle cx="40" cy="40" r="38" fill="#3D0059" stroke="#9B1BCC" strokeWidth="2" />
    <text x="40" y="50" textAnchor="middle" fontSize="32" fontWeight="900"
      fontFamily="Arial Black, sans-serif" fill="#FFFFFF">PL</text>
  </svg>
);

// EFL Championship logo will be rendered as an img tag below

function DemoPlayerCard({
  label,
  age,
  code,
  badge,
  color,
  onTry,
}: {
  label: string;
  age: string;
  code: string;
  badge: string;
  color: string;
  onTry: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center gap-2.5">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-[10px] font-black text-white font-display shrink-0"
          style={{ background: `${color}25`, border: `1px solid ${color}40` }}
        >
          {badge}
        </div>
        <div>
          <div className="text-white text-sm font-bold font-display uppercase tracking-wide leading-tight">
            {label}
          </div>
          <div className="text-white/40 text-xs">{age} · Arsenal</div>
        </div>
      </div>

      <div className="flex items-center justify-between bg-black/30 rounded-xl px-3 py-2 border border-white/8">
        <span className="text-white font-mono font-bold text-sm tracking-widest">{code}</span>
        <button
          onClick={handleCopy}
          className="ml-2 p-1 rounded-lg hover:bg-white/10 transition-colors text-white/30 hover:text-white/70"
          title="Copy code"
        >
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
        </button>
      </div>

      <button
        onClick={onTry}
        className="w-full h-9 rounded-xl text-xs font-display font-black uppercase tracking-widest transition-all hover:opacity-90 active:scale-95"
        style={{ background: color, color: "#fff" }}
      >
        Try This Demo →
      </button>
    </div>
  );
}

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
                  <motion.img 
                    src={`${import.meta.env.BASE_URL}logos/premier-league-logo.png`}
                    alt="Premier League"
                    className="h-12 w-auto object-contain drop-shadow-lg"
                    style={{ maxWidth: "120px" }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
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
                  <img 
                    src={`${import.meta.env.BASE_URL}logos/efl-championship-logo.png`}
                    alt="EFL Championship"
                    className="h-16 w-auto object-contain drop-shadow-lg"
                  />
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
                  {selectedTier && <LeagueBadge league={selectedTier as "premier-league" | "championship"} />}
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
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-white text-base placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
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
        {/* Demo + Login section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 pt-8 border-t border-white/8 w-full max-w-2xl flex flex-col items-center gap-5"
        >
          {/* Try a demo heading */}
          <div className="text-center">
            <div className="text-xs font-bold text-white/30 uppercase tracking-widest font-display mb-1">
              Try a Demo
            </div>
            <p className="text-white/40 text-xs max-w-xs mx-auto">
              Select Arsenal, then enter one of these codes to experience the player journey first-hand.
            </p>
          </div>

          {/* Demo player cards */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                label: "U9 Player Journey",
                age: "Age 8 · Right Winger",
                code: "PLY-DEMOU9",
                badge: "U9",
                color: "#EF0107",
              },
              {
                label: "U13 Player Journey",
                age: "Age 13 · Att. Midfielder",
                code: "PLY-DEMU13",
                badge: "U13",
                color: "#EF0107",
              },
            ].map((demo) => (
              <DemoPlayerCard
                key={demo.code}
                {...demo}
                onTry={() => {
                  const arsenal = PREMIER_LEAGUE.find(a => a.key === "arsenal");
                  if (arsenal) {
                    setSelectedAcademy(arsenal);
                    navigate("/auth");
                  }
                }}
              />
            ))}
          </div>

          {/* Staff credentials */}
          <div className="w-full rounded-2xl border border-white/8 bg-white/[0.02] px-5 py-4">
            <div className="text-xs font-bold text-white/30 uppercase tracking-widest font-display mb-3">
              Staff Portal Demo
            </div>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between gap-4">
                <span className="text-white/40">Coach login</span>
                <span className="text-white/60">coach@arsenal.co.uk / test123</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-white/40">Admin login</span>
                <span className="text-white/60">admin@arsenal.co.uk / admin123</span>
              </div>
            </div>
          </div>

          {/* Login buttons */}
          <div className="w-full flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => navigate("/staff-login")}
              className="flex-1 group flex items-center gap-3 px-5 py-3 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300"
            >
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/15 transition-colors shrink-0">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/60">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-white text-sm font-bold font-display uppercase tracking-wider">Staff Login</div>
                <div className="text-white/35 text-xs">Academy staff portal</div>
              </div>
            </button>

            <button
              onClick={() => navigate("/admin-login")}
              className="flex-1 group flex items-center gap-3 px-5 py-3 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300"
            >
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/15 transition-colors shrink-0">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/60">
                  <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
                </svg>
              </div>
              <div className="text-left">
                <div className="text-white text-sm font-bold font-display uppercase tracking-wider">Website Admin</div>
                <div className="text-white/35 text-xs">Academy settings</div>
              </div>
            </button>
          </div>
        </motion.div>

      </div>
    </Layout>
  );
}
