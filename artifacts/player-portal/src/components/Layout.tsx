import React from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { LogOut } from "lucide-react";
import { usePlayerContext } from "@/context/PlayerContext";
import { ClubBadge } from "@/components/ClubBadge";

export function Layout({ children, hideLogo = false }: { children: React.ReactNode, hideLogo?: boolean }) {
  const { selectedAcademy, playerData, clearContext } = usePlayerContext();
  const [_, navigate] = useLocation();

  const customStyles = selectedAcademy ? {
    '--academy-primary': selectedAcademy.primaryColor,
    '--academy-secondary': selectedAcademy.secondaryColor,
  } as React.CSSProperties : {};

  const handleLogout = () => {
    clearContext();
    navigate("/");
  };

  return (
    <div
      className="min-h-screen w-full relative flex flex-col overflow-x-hidden bg-background"
      style={customStyles}
    >
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
          alt=""
          className="w-full h-full object-cover opacity-30 mix-blend-overlay"
        />
        <img
          src={`${import.meta.env.BASE_URL}images/abstract-texture.png`}
          alt=""
          className="w-full h-full object-cover opacity-20 mix-blend-color-dodge absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-transparent to-background/90" />
      </div>

      {/* Header */}
      {!hideLogo && (
        <header className="relative z-10 w-full px-4 py-5 md:px-8 flex justify-between items-center">
          {/* Left: back/logout */}
          <div className="w-24 flex justify-start">
            {playerData && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-white/35 hover:text-white/70 text-xs transition-colors"
                title="Save & log out"
              >
                <LogOut size={13} />
                <span className="hidden sm:inline">Log out</span>
              </button>
            )}
          </div>

          {/* Centre: academy identity */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-2"
          >
            {selectedAcademy ? (
              <>
                <ClubBadge academy={selectedAcademy} size={48} selected={!!playerData} />
                <h2 className="text-base md:text-lg font-display font-bold text-white tracking-widest text-center">
                  {selectedAcademy.name}
                </h2>
              </>
            ) : (
              <h2 className="text-xl md:text-2xl font-display font-bold text-white tracking-widest text-center">
                ME TIME STORIES
              </h2>
            )}
          </motion.div>

          {/* Right: player name */}
          <div className="w-24 flex justify-end">
            {playerData && (
              <span className="text-white/35 text-xs text-right truncate max-w-[80px]">
                {playerData.playerName.split(" ")[0]}
              </span>
            )}
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="relative z-10 flex-grow flex flex-col items-center px-4 py-4 md:px-8 w-full max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}
