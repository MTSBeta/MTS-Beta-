import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { ChevronLeft, Search } from "lucide-react";
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
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center pt-12 pb-20 px-4">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 space-y-4"
        >
          <img
            src={`${import.meta.env.BASE_URL}images/metime-logo.png`}
            alt="Me Time Stories"
            className="h-24 w-auto mx-auto object-contain mb-2"
          />
          <div>
            <h1 className="text-5xl md:text-7xl font-display font-black bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent tracking-tight uppercase">
              Player Portal
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto mt-4">
              Join your academy and start your incredible journey with us. Select your league and academy below.
            </p>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">

          {/* ── STEP 1: League selection ── */}
          {!selectedTier && (
            <motion.div
              key="tier-select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl"
            >
              {/* Premier League card */}
              <motion.button
                whileHover={{ scale: 1.05, y: -8 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleTierSelect("premier-league")}
                className="relative overflow-hidden group flex flex-col items-center justify-start gap-6 p-8 md:p-10 rounded-4xl bg-gradient-to-br from-purple-100 to-blue-100 border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 shadow-lg hover:shadow-2xl"
              >
                {/* Step number badge */}
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-white font-black flex items-center justify-center text-lg shadow-lg">
                  1
                </div>
                
                <div className="relative z-10 flex flex-col items-center gap-4 pt-2">
                  <motion.img 
                    src={`${import.meta.env.BASE_URL}logos/premier-league-logo.png`}
                    alt="Premier League"
                    className="h-16 w-auto object-contain drop-shadow-lg"
                    style={{ maxWidth: "140px" }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <div className="text-center">
                    <div className="text-purple-900 font-black text-2xl md:text-3xl uppercase tracking-wider font-display">Premier League</div>
                    <div className="text-purple-600 text-sm mt-2 font-semibold">20 academies</div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 mt-3">
                    {["Arsenal", "Chelsea", "Liverpool", "Man City", "Man United"].map(n => (
                      <span key={n} className="text-xs text-purple-700 bg-purple-200/60 px-3 py-1 rounded-full font-semibold border border-purple-300">{n}</span>
                    ))}
                    <span className="text-xs text-purple-600 px-1">+15 more</span>
                  </div>
                </div>
              </motion.button>

              {/* Championship card */}
              <motion.button
                whileHover={{ scale: 1.05, y: -8 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleTierSelect("championship")}
                className="relative overflow-hidden group flex flex-col items-center justify-start gap-6 p-8 md:p-10 rounded-4xl bg-gradient-to-br from-blue-100 to-cyan-100 border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 shadow-lg hover:shadow-2xl"
              >
                {/* Step number badge */}
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 text-white font-black flex items-center justify-center text-lg shadow-lg">
                  2
                </div>

                <div className="relative z-10 flex flex-col items-center gap-4 pt-2">
                  <img 
                    src={`${import.meta.env.BASE_URL}logos/efl-championship-logo.png`}
                    alt="EFL Championship"
                    className="h-20 w-auto object-contain drop-shadow-lg"
                  />
                  <div className="text-center">
                    <div className="text-blue-900 font-black text-2xl md:text-3xl uppercase tracking-wider font-display">Championship</div>
                    <div className="text-blue-600 text-sm mt-2 font-semibold">22 academies</div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 mt-3">
                    {["Leeds", "West Brom", "Sunderland", "Birmingham"].map((n, i) => (
                      <span key={i} className="text-xs text-blue-700 bg-blue-200/60 px-3 py-1 rounded-full font-semibold border border-blue-300">{n}</span>
                    ))}
                    <span className="text-xs text-blue-600 px-1">+18 more</span>
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
                  className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition-colors text-sm font-semibold"
                >
                  <ChevronLeft size={18} />
                  Back
                </button>
                <div className="flex items-center gap-2">
                  {selectedTier && <LeagueBadge league={selectedTier as "premier-league" | "championship"} />}
                </div>
              </div>

              {/* Search */}
              <div className="w-full max-w-sm relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search your club…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-white border-2 border-blue-200 rounded-2xl pl-10 pr-4 py-3 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors shadow-md"
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
                        relative flex flex-col items-center gap-2 p-4 rounded-3xl border-2 transition-all duration-300
                        ${isSelected
                          ? "bg-white shadow-xl scale-110"
                          : "bg-white/70 hover:bg-white border-gray-200 hover:border-blue-400 hover:shadow-lg"
                        }
                      `}
                      style={isSelected ? {
                        borderColor: academy.primaryColor,
                        boxShadow: `0 8px 24px ${academy.primaryColor}30`
                      } : {}}
                    >
                      {/* Glow layer when selected */}
                      {isSelected && (
                        <div
                          className="absolute inset-0 rounded-3xl opacity-10 blur-lg"
                          style={{ background: academy.primaryColor }}
                        />
                      )}

                      <div className="relative z-10">
                        <ClubBadge academy={academy} size={56} selected={isSelected} />
                      </div>

                      <span className={`relative z-10 text-[12px] font-black text-center leading-tight max-w-[90px] ${
                        isSelected ? "text-gray-900" : "text-gray-700"
                      }`}>
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
          className="mt-14 pt-8 border-t-2 border-blue-200 w-full max-w-2xl flex flex-col items-center gap-4"
        >
          {/* Demo credentials */}
          <div className="text-center mb-3">
            <div className="text-gray-700 text-xs font-semibold mb-2 uppercase tracking-wider">Demo Credentials:</div>
            <div className="space-y-1.5 text-gray-600 text-xs font-mono">
              <div>Staff: <span className="text-blue-600 font-semibold">coach@arsenal.co.uk</span> / <span className="text-blue-600 font-semibold">test123</span></div>
              <div>Admin: <span className="text-blue-600 font-semibold">admin@arsenal.co.uk</span> / <span className="text-blue-600 font-semibold">admin123</span></div>
            </div>
          </div>

          {/* Staff Login Button */}
          <button
            onClick={() => navigate("/staff-login")}
            className="group w-full max-w-xs flex items-center gap-3 px-6 py-4 rounded-3xl border-2 border-blue-300 bg-gradient-to-r from-blue-100 to-blue-50 hover:from-blue-200 hover:to-blue-100 hover:border-blue-400 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div className="text-left">
              <div className="text-blue-900 text-sm font-black font-display uppercase tracking-wider">
                Academy Staff Login
              </div>
              <div className="text-blue-700 text-xs">
                Access the staff portal
              </div>
            </div>
          </button>

          {/* Admin Login Button */}
          <button
            onClick={() => navigate("/admin-login")}
            className="group w-full max-w-xs flex items-center gap-3 px-6 py-4 rounded-3xl border-2 border-purple-300 bg-gradient-to-r from-purple-100 to-purple-50 hover:from-purple-200 hover:to-purple-100 hover:border-purple-400 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform text-lg">
              ⚙️
            </div>
            <div className="text-left">
              <div className="text-purple-900 text-sm font-black font-display uppercase tracking-wider">
                Website Admin
              </div>
              <div className="text-purple-700 text-xs">
                Manage academy settings
              </div>
            </div>
          </button>
        </motion.div>

      </div>
    </Layout>
  );
}
