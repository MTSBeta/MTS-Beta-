import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { X } from "lucide-react";

const PLAYER_PATHS = ["/welcome", "/welcome-u9", "/journey", "/journey-u9", "/complete", "/invite"];

interface PageGuide {
  title: string;
  body: string;
}

function getGuide(path: string): PageGuide {
  if (path === "/welcome" || path === "/welcome-u9") {
    return {
      title: "Welcome to your story",
      body: "Browse through the chapters below to see what's coming. When you're ready, tap Begin My Story. You've got 20–30 minutes, but you can always save and come back.",
    };
  }
  if (path === "/journey" || path === "/journey-u9") {
    return {
      title: "You're inside the story",
      body: "Answer each question honestly — there are no wrong answers. Use the mic if talking is easier than typing. You can skip a question and revisit it at the end.",
    };
  }
  if (path === "/complete") {
    return {
      title: "You've done your part",
      body: "Your story is being put together. Check with your coach or academy to find out when it'll be ready. Well done for making it through.",
    };
  }
  if (path === "/invite") {
    return {
      title: "Bring your people in",
      body: "Invite the people who know you best — parents, coaches, teammates. Their perspective adds a completely different dimension to your story.",
    };
  }
  return {
    title: "I'm Mety",
    body: "Short for MeTime Stories. I'm here to guide you through building your player profile. Tap me on any page for help or context.",
  };
}

export default function MetyButton() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  const isPlayerPage = PLAYER_PATHS.some(p => location === p || location.startsWith(p + "/"));
  if (!isPlayerPage) return null;

  const guide = getGuide(location);

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[900]"
              onClick={() => setOpen(false)}
            />
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className="fixed z-[910] right-4 max-w-[280px]"
              style={{ bottom: "calc(max(env(safe-area-inset-bottom), 16px) + 68px)" }}
            >
              <div
                className="rounded-2xl overflow-hidden px-5 py-4 relative"
                style={{
                  background: "rgba(12,12,12,0.96)",
                  border: "1px solid rgba(234,179,8,0.22)",
                  backdropFilter: "blur(20px)",
                  boxShadow: "0 0 40px rgba(234,179,8,0.12), 0 20px 60px rgba(0,0,0,0.8)",
                }}
              >
                <div
                  className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl"
                  style={{ background: "linear-gradient(90deg, transparent, #EAB308, transparent)" }}
                />

                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-black"
                    style={{ background: "rgba(234,179,8,0.15)", border: "1px solid rgba(234,179,8,0.3)", color: "#EAB308" }}
                  >
                    M
                  </div>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-widest leading-none" style={{ color: "#EAB308" }}>
                      Mety
                    </p>
                    <p className="text-[9px] text-white/35 tracking-wider uppercase leading-none mt-0.5">
                      me-thai
                    </p>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="ml-auto text-white/30 hover:text-white/60 transition-colors"
                  >
                    <X size={13} />
                  </button>
                </div>

                <p className="text-white font-bold text-[13px] leading-snug mb-1">{guide.title}</p>
                <p className="text-white/55 text-[12px] leading-relaxed">{guide.body}</p>
              </div>

              <div
                className="absolute right-[18px] -bottom-[6px] w-3 h-3 rotate-45"
                style={{ background: "rgba(12,12,12,0.96)", borderRight: "1px solid rgba(234,179,8,0.22)", borderBottom: "1px solid rgba(234,179,8,0.22)" }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen(o => !o)}
        whileTap={{ scale: 0.92 }}
        className="fixed z-[800] right-4 flex items-center justify-center"
        style={{
          bottom: "calc(max(env(safe-area-inset-bottom), 16px) + 8px)",
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: "rgba(10,10,10,0.92)",
          border: "1.5px solid rgba(234,179,8,0.35)",
          boxShadow: open
            ? "0 0 0 3px rgba(234,179,8,0.18), 0 8px 32px rgba(0,0,0,0.6)"
            : "0 4px 24px rgba(0,0,0,0.5)",
          backdropFilter: "blur(12px)",
        }}
        aria-label="Mety — tap for guidance"
      >
        {!open && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ border: "1.5px solid rgba(234,179,8,0.25)" }}
            animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut" }}
          />
        )}
        <span className="text-base font-black" style={{ color: "#EAB308", fontFamily: "system-ui, sans-serif" }}>
          M
        </span>
      </motion.button>
    </>
  );
}
