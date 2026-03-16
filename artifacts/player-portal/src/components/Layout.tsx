import { publicAssetUrl } from "@/lib/publicAssetUrl";
import React from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { LogOut } from "lucide-react";
import { usePlayerContext } from "@/context/PlayerContext";

export function Layout({ children, hideLogo = false }: { children: React.ReactNode; hideLogo?: boolean }) {
  const { selectedAcademy, playerData, clearContext } = usePlayerContext();
  const [_, navigate] = useLocation();

  const customStyles = selectedAcademy ? {
    "--academy-primary": selectedAcademy.primaryColor,
    "--academy-secondary": selectedAcademy.secondaryColor,
  } as React.CSSProperties : {};

  const handleLogout = () => { clearContext(); navigate("/"); };

  return (
    <div className="w-full relative flex flex-col overflow-x-hidden bg-[#0a0a0a]"
      style={{ ...customStyles, minHeight: "100dvh" }}>
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img src={publicAssetUrl("images/hero-bg.png")} alt=""
          className="w-full h-full object-cover opacity-20 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent" />
      </div>

      {/* Slim topbar — with safe area top for notched devices */}
      {!hideLogo && (
        <header
          className="relative z-20 w-full flex items-center justify-between px-4 border-b border-white/5"
          style={{ paddingTop: "env(safe-area-inset-top)", minHeight: "calc(env(safe-area-inset-top) + 48px)" }}
        >
          <div className="flex items-center gap-2">
            {selectedAcademy ? (
              <>
                {selectedAcademy.crestUrl ? (
                  <img
                    src={selectedAcademy.crestUrl}
                    alt={selectedAcademy.shortName}
                    className="w-6 h-6 object-contain shrink-0"
                    loading="lazy"
                  />
                ) : (
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-black text-white shrink-0"
                    style={{ background: selectedAcademy.primaryColor }}
                  >
                    {selectedAcademy.logoText}
                  </div>
                )}
                <span className="text-white/50 text-xs font-bold uppercase tracking-widest">{selectedAcademy.shortName}</span>
              </>
            ) : (
              <img
                src={publicAssetUrl("images/metime-logo.png")}
                alt="Me Time Stories"
                className="h-7 w-auto object-contain"
                style={{ mixBlendMode: "screen" }}
              />
            )}
          </div>

          {playerData && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-white/40 active:text-white/70 text-xs transition-colors min-h-[44px] px-3 -mr-3"
            >
              <LogOut size={14} />
              <span>Log out</span>
            </motion.button>
          )}
        </header>
      )}

      {/* Content */}
      <main className="relative z-10 flex-grow flex flex-col items-center px-4 py-4 w-full max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}
