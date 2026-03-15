import React from "react";
import { motion } from "framer-motion";
import { usePlayerContext } from "@/context/PlayerContext";

export function Layout({ children, hideLogo = false }: { children: React.ReactNode, hideLogo?: boolean }) {
  const { selectedAcademy } = usePlayerContext();

  // Dynamic CSS variables based on academy
  const customStyles = selectedAcademy ? {
    '--academy-primary': selectedAcademy.primaryColor,
    '--academy-secondary': selectedAcademy.secondaryColor,
  } as React.CSSProperties : {};

  return (
    <div 
      className="min-h-screen w-full relative flex flex-col overflow-x-hidden bg-background"
      style={customStyles}
    >
      {/* Background Images with Overlay */}
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

      {/* Header/Logo area */}
      {!hideLogo && (
        <header className="relative z-10 w-full p-6 md:p-8 flex justify-center items-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-2"
          >
            {selectedAcademy ? (
              <>
                <div 
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-white font-display text-2xl font-black shadow-[0_0_30px_var(--academy-primary)]"
                  style={{ backgroundColor: 'var(--academy-primary)' }}
                >
                  {selectedAcademy.logoText}
                </div>
                <h2 className="text-xl md:text-2xl font-display font-bold text-white tracking-widest text-center mt-2">
                  {selectedAcademy.name}
                </h2>
              </>
            ) : (
              <h2 className="text-xl md:text-2xl font-display font-bold text-white tracking-widest text-center">
                ME TIME STORIES
              </h2>
            )}
          </motion.div>
        </header>
      )}

      {/* Main Content */}
      <main className="relative z-10 flex-grow flex flex-col items-center px-4 py-8 md:px-8 w-full max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}
