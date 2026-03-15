import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { usePlayerContext } from "@/context/PlayerContext";
import { Button } from "@/components/ui/Button";

export default function Complete() {
  const [_, navigate] = useLocation();
  const { playerData, selectedAcademy } = usePlayerContext();

  if (!playerData) {
    navigate("/");
    return null;
  }

  return (
    <Layout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl mx-auto flex flex-col items-center mt-12 text-center"
      >
        <h1 className="text-4xl md:text-6xl font-display font-black text-white mb-6 uppercase tracking-tight">
          Your Story Is Taking Shape
        </h1>
        
        <div className="glass-panel p-8 md:p-12 rounded-3xl w-full mb-8 relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-[var(--academy-primary)] flex items-center justify-center text-white font-display text-3xl font-black mb-6 shadow-2xl">
              {selectedAcademy?.logoText || "FB"}
            </div>
            
            <h2 className="text-2xl text-white font-bold mb-2">{playerData.playerName}</h2>
            <div className="flex gap-4 text-white/60 font-medium mb-8">
              <span>{playerData.academyName}</span>
              <span>•</span>
              <span>{playerData.position}</span>
            </div>

            <div className="w-full max-w-md bg-black/40 rounded-2xl p-6 border border-white/10 mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/80 font-medium">Player Journey</span>
                <span className="text-green-400 font-bold flex items-center gap-2">✓ Complete</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/80 font-medium">Parent &amp; Friend Perspectives</span>
                <span className="text-white/40 font-bold">Awaiting responses...</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/80 font-medium">Academy Staff Perspectives</span>
                <span className="text-white/40 font-bold">Awaiting responses...</span>
              </div>
            </div>

            <p className="text-lg text-white/80 italic font-medium">
              We are compiling your responses to build your unique football development profile.
            </p>
          </div>
        </div>

        <Button variant="outline" onClick={() => navigate("/")}>
          Return to Home
        </Button>
      </motion.div>
    </Layout>
  );
}
