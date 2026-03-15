import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { ACADEMIES } from "@/data/academies";
import { usePlayerContext } from "@/context/PlayerContext";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/Button";

export default function Home() {
  const [_, navigate] = useLocation();
  const { selectedAcademy, setSelectedAcademy } = usePlayerContext();

  const handleStart = () => {
    if (selectedAcademy) {
      navigate("/register");
    }
  };

  return (
    <Layout hideLogo>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl mx-auto flex flex-col items-center mt-8 md:mt-16"
      >
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl md:text-6xl font-display font-black text-white tracking-tight uppercase">
            Player <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">Portal</span>
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto font-medium">
            Begin your developmental journey. Reflect on your path, build your profile, and shape your football story.
          </p>
        </div>

        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
          {ACADEMIES.map((academy, idx) => {
            const isSelected = selectedAcademy?.id === academy.id;
            
            return (
              <motion.button
                key={academy.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setSelectedAcademy(academy)}
                className={`
                  relative overflow-hidden group flex flex-col items-center justify-center p-6 md:p-8 rounded-2xl
                  transition-all duration-500 ease-out border
                  ${isSelected 
                    ? 'border-white bg-white/10 shadow-[0_0_40px_rgba(255,255,255,0.1)] scale-105' 
                    : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/30'
                  }
                `}
              >
                {/* Dynamic colored glow effect on hover/select */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-2xl"
                  style={{ backgroundColor: academy.primaryColor }}
                />
                {isSelected && (
                  <div 
                    className="absolute inset-0 opacity-30 blur-2xl"
                    style={{ backgroundColor: academy.primaryColor }}
                  />
                )}

                <div 
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-white font-display text-xl md:text-2xl font-black mb-4 relative z-10 shadow-xl"
                  style={{ 
                    backgroundColor: academy.primaryColor,
                    boxShadow: isSelected ? `0 10px 30px ${academy.primaryColor}80` : 'none'
                  }}
                >
                  {academy.logoText}
                </div>
                <span className="font-display font-bold text-white text-sm md:text-base uppercase tracking-wider relative z-10">
                  {academy.name}
                </span>
              </motion.button>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button 
            size="lg" 
            disabled={!selectedAcademy}
            onClick={handleStart}
            className="w-full md:w-auto min-w-[280px]"
          >
            {selectedAcademy ? `Start Journey as ${selectedAcademy.name}` : 'Select an Academy'}
          </Button>
        </motion.div>
      </motion.div>
    </Layout>
  );
}
