import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { X, Send } from "lucide-react";
import { usePlayerContext } from "@/context/PlayerContext";
import { useAssistant } from "@/context/AssistantContext";
import { getAcademyMascot } from "@/data/mascots";
import { duckMusic, restoreMusic } from "@/lib/globalAudio";

// Assistant appears on journey pages and beyond — NOT on the welcome/home screen
// (music is playing there and the button would clash with the sound toggle)
const PLAYER_PATHS = ["/journey", "/journey-u9", "/complete", "/invite"];

// Pages where the assistant auto-opens on first visit with an intro
const AUTO_OPEN_PATHS = ["/journey", "/journey-u9"];

const AUTO_INTRO_MESSAGE =
  "Welcome to your story. I'm here if you need me — just ask. " +
  "Answer each question as honestly as you can, there are no wrong answers. " +
  "You can type or record a voice note, whichever feels easier. " +
  "Tap anywhere outside to close me, then let's get started.";

const PAGE_HINTS: Record<string, string> = {
  "/welcome":    "Browse the chapters below, then tap Begin My Story when you're ready. Got a question? Ask me anything.",
  "/welcome-u9": "Have a look around, then tap Begin My Story when you're ready. Ask me anything!",
  "/journey":    "Answer honestly — there are no wrong answers. Use the mic if it's easier. Ask me anything about any question.",
  "/journey-u9": "Take your time with each picture question. Ask me if you need help!",
  "/complete":   "You're done — well played! Your story is being put together. Ask me if you have any questions.",
  "/invite":     "Send links to the people who know you best. Ask me who to invite or how it works.",
};

interface Message {
  role: "assistant" | "user";
  text: string;
}

const base = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function MetyButton() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { selectedAcademy } = usePlayerContext();
  const { activeQuestion } = useAssistant();

  const isPlayerPage = PLAYER_PATHS.some(p => location === p || location.startsWith(p + "/"));
  const hasAutoOpened = useRef(false);

  const mascotName = getAcademyMascot(selectedAcademy?.key ?? "");
  const initial = mascotName.charAt(0).toUpperCase();
  const accentColor = selectedAcademy?.primaryColor ?? "#EAB308";

  const openingMessage = activeQuestion
    ? `I can see you're on: "${activeQuestion.text}"${activeQuestion.hint ? ` — ${activeQuestion.hint}` : ""}. What do you need help with?`
    : (PAGE_HINTS[location] ?? "Ask me anything about your journey.");

  // Helper — open with a specific message (used for auto-intro)
  const openWithMessage = useCallback((msg: string) => {
    setMessages([{ role: "assistant", text: msg }]);
    setOpen(true);
  }, []);

  // Auto-open with intro message the first time a player hits a journey page
  useEffect(() => {
    const isJourneyPage = AUTO_OPEN_PATHS.some(p => location === p || location.startsWith(p + "/"));
    if (!isJourneyPage || hasAutoOpened.current) return;
    hasAutoOpened.current = true;
    const timer = setTimeout(() => openWithMessage(AUTO_INTRO_MESSAGE), 1500);
    return () => clearTimeout(timer);
  }, [location, openWithMessage]);

  // Duck/restore music and populate opening hint when manually toggled
  useEffect(() => {
    if (!isPlayerPage) return;
    if (open) {
      // Only set the hint message if there's no existing conversation
      if (messages.length === 0) {
        setMessages([{ role: "assistant", text: openingMessage }]);
      }
      setTimeout(() => inputRef.current?.focus(), 150);
      duckMusic();
    } else {
      restoreMusic();
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (!isPlayerPage) return null;

  async function sendMessage() {
    const q = input.trim();
    if (!q || loading) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: q }]);
    setLoading(true);
    try {
      const res = await fetch(`${base}/api/assistant/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, page: location, mascotName, activeQuestion }),
      });
      const data = await res.json();
      const answer = data.answer ?? "I'm not sure — check with your coach!";
      setMessages(prev => [...prev, { role: "assistant", text: answer }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", text: "Couldn't connect — try again in a second." }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

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
              className="fixed z-[910] right-4 w-[300px]"
              style={{ bottom: "calc(max(env(safe-area-inset-bottom), 16px) + 68px)" }}
              onClick={e => e.stopPropagation()}
            >
              <div
                className="rounded-2xl overflow-hidden relative flex flex-col"
                style={{
                  background: "rgba(12,12,12,0.97)",
                  border: `1px solid ${accentColor}35`,
                  backdropFilter: "blur(20px)",
                  boxShadow: `0 0 40px ${accentColor}15, 0 20px 60px rgba(0,0,0,0.8)`,
                  maxHeight: 380,
                }}
              >
                <div
                  className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl"
                  style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
                />

                <div className="flex items-center gap-2 px-4 pt-4 pb-2 flex-shrink-0">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-black"
                    style={{ background: `${accentColor}18`, border: `1px solid ${accentColor}35`, color: accentColor }}
                  >
                    {initial}
                  </div>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-widest leading-none" style={{ color: accentColor }}>
                      {mascotName}
                    </p>
                    {selectedAcademy?.shortName && (
                      <p className="text-[9px] text-white/35 tracking-wider leading-none mt-0.5">
                        {selectedAcademy.shortName}
                      </p>
                    )}
                  </div>
                  <button onClick={() => setOpen(false)} className="ml-auto text-white/30 hover:text-white/60 transition-colors">
                    <X size={13} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 pb-2 space-y-2" style={{ minHeight: 80 }}>
                  {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className="text-[12px] leading-relaxed rounded-xl px-3 py-2 max-w-[85%]"
                        style={
                          m.role === "user"
                            ? { background: `${accentColor}22`, color: "rgba(255,255,255,0.9)", border: `1px solid ${accentColor}30` }
                            : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.7)" }
                        }
                      >
                        {m.text}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="text-[12px] rounded-xl px-3 py-2" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" }}>
                        <span className="animate-pulse">...</span>
                      </div>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>

                <div className="px-3 pb-3 flex-shrink-0">
                  <div
                    className="flex items-center gap-2 rounded-xl px-3 py-2"
                    style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${accentColor}20` }}
                  >
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={handleKey}
                      placeholder="Ask me anything..."
                      className="flex-1 bg-transparent text-white outline-none placeholder-white/25"
                      style={{ fontSize: "16px" }}
                      disabled={loading}
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck={false}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!input.trim() || loading}
                      className="transition-opacity"
                      style={{ color: accentColor, opacity: input.trim() && !loading ? 1 : 0.3 }}
                    >
                      <Send size={14} />
                    </button>
                  </div>
                </div>
              </div>

              <div
                className="absolute right-[18px] -bottom-[6px] w-3 h-3 rotate-45"
                style={{
                  background: "rgba(12,12,12,0.97)",
                  borderRight: `1px solid ${accentColor}35`,
                  borderBottom: `1px solid ${accentColor}35`,
                }}
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
          border: `1.5px solid ${accentColor}45`,
          boxShadow: open
            ? `0 0 0 3px ${accentColor}20, 0 8px 32px rgba(0,0,0,0.6)`
            : "0 4px 24px rgba(0,0,0,0.5)",
          backdropFilter: "blur(12px)",
        }}
        aria-label={`${mascotName} — tap for help`}
      >
        {!open && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ border: `1.5px solid ${accentColor}30` }}
            animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut" }}
          />
        )}
        <span className="text-base font-black" style={{ color: accentColor, fontFamily: "system-ui, sans-serif" }}>
          {initial}
        </span>
      </motion.button>
    </>
  );
}
