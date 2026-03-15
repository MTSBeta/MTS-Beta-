import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Copy, CheckCircle2 } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/Button";
import { usePlayerContext } from "@/context/PlayerContext";

export default function Invite() {
  const [_, navigate] = useLocation();
  const { completionData, playerData } = usePlayerContext();
  const [copiedParent, setCopiedParent] = useState(false);
  const [copiedCoach, setCopiedCoach] = useState(false);

  if (!completionData || !playerData) {
    navigate("/");
    return null;
  }

  const parentUrl = `${window.location.origin}/parent/${completionData.parentCode}`;
  const coachUrl = `${window.location.origin}/coach/${completionData.coachCode}`;

  const copyToClipboard = async (text: string, isParent: boolean) => {
    try {
      await navigator.clipboard.writeText(text);
      if (isParent) {
        setCopiedParent(true);
        setTimeout(() => setCopiedParent(false), 2000);
      } else {
        setCopiedCoach(true);
        setTimeout(() => setCopiedCoach(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <Layout>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl mx-auto flex flex-col items-center mt-12"
      >
        <div className="w-20 h-20 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mb-6">
          <CheckCircle2 size={40} />
        </div>
        
        <h1 className="text-3xl md:text-5xl font-display font-black text-white mb-4 text-center">
          Journey Complete
        </h1>
        <p className="text-white/70 text-center mb-10 text-lg max-w-md">
          Your personal reflection is saved. Now, invite your parent and coach to add their unique perspectives to your story.
        </p>

        <div className="w-full space-y-6">
          {/* Parent Invite */}
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-xl font-display font-bold text-white mb-2">Parent Perspective</h3>
            <p className="text-sm text-white/60 mb-4">Send this link to your parent or guardian.</p>
            <div className="flex gap-2">
              <input 
                readOnly 
                value={parentUrl} 
                className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 text-white/80 font-mono text-sm focus:outline-none"
              />
              <Button 
                variant="secondary" 
                onClick={() => copyToClipboard(parentUrl, true)}
                className="gap-2 shrink-0"
              >
                {copiedParent ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                {copiedParent ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>

          {/* Coach Invite */}
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-xl font-display font-bold text-white mb-2">Coach Perspective</h3>
            <p className="text-sm text-white/60 mb-4">Send this link to your academy coach.</p>
            <div className="flex gap-2">
              <input 
                readOnly 
                value={coachUrl} 
                className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 text-white/80 font-mono text-sm focus:outline-none"
              />
              <Button 
                variant="secondary" 
                onClick={() => copyToClipboard(coachUrl, false)}
                className="gap-2 shrink-0"
              >
                {copiedCoach ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                {copiedCoach ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>
        </div>

        <Button 
          onClick={() => navigate("/complete")}
          className="mt-12 px-10 w-full sm:w-auto"
        >
          View Summary
        </Button>
      </motion.div>
    </Layout>
  );
}
