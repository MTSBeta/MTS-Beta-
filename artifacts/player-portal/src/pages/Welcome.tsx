import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/Button";
import { usePlayerContext } from "@/context/PlayerContext";
import { POSITIONS } from "@/data/positions";
import { JOURNEY_STAGES } from "@/data/questions";

export default function Welcome() {
  const [_, navigate] = useLocation();
  const { selectedAcademy, playerData } = usePlayerContext();

  if (!selectedAcademy || !playerData) {
    navigate("/");
    return null;
  }

  const posInfo = POSITIONS.find(p => p.id === playerData.position);

  return (
    <Layout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl mx-auto flex flex-col items-center text-center mt-8 md:mt-12"
      >
        <h1 className="text-4xl md:text-5xl font-display font-black text-white mb-6 uppercase">
          Welcome, {playerData.playerName}
        </h1>
        
        <div className="glass-panel p-8 rounded-3xl w-full mb-8 relative overflow-hidden">
          {/* Subtle academy colored glow inside card */}
          <div 
            className="absolute top-0 right-0 w-64 h-64 opacity-20 blur-[80px] -translate-y-1/2 translate-x-1/3"
            style={{ backgroundColor: selectedAcademy.primaryColor }}
          />

          <div className="flex flex-col items-center mb-6 relative z-10">
            <div className="text-sm uppercase tracking-widest text-[var(--academy-secondary)] font-bold mb-1">
              {posInfo?.archetype || "The Player"}
            </div>
            <div className="text-xl text-white font-medium">
              Number {playerData.shirtNumber} • {posInfo?.displayName || playerData.position}
            </div>
          </div>

          <p className="text-lg text-white/80 leading-relaxed italic mb-8 relative z-10 border-l-4 border-[var(--academy-primary)] pl-6 text-left">
            "{selectedAcademy.welcomeMessage}"
          </p>

          <div className="space-y-4 text-left relative z-10 border-t border-white/10 pt-8">
            <h3 className="font-display text-xl font-bold text-white uppercase tracking-wide mb-4">
              Your 6-Stage Journey
            </h3>
            <p className="text-white/70">
              To build your unique football story, you will answer questions across six stages of your development:
            </p>
            <div className="grid grid-cols-2 gap-3 mt-4 text-white/90 font-medium">
              {JOURNEY_STAGES.map((stage, i) => (
                <div key={stage.id} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-white/50 flex-shrink-0" />
                  {i + 1}. {stage.title}
                </div>
              ))}
            </div>
          </div>
        </div>

        <Button size="lg" onClick={() => navigate("/journey")} className="w-full sm:w-auto px-12">
          Begin Reflection
        </Button>
      </motion.div>
    </Layout>
  );
}
