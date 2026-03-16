import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SkipForward, RotateCcw, Loader2, Volume2 } from "lucide-react";
import { ASSISTANT_PROFILES, type AssistantId } from "@/data/assistantProfiles";

const API_BASE = `${import.meta.env.BASE_URL}api`.replace(/\/api$/, "/api");
const STORAGE_KEY_PREFIX = "metime_intro_played_";

type Phase = "idle" | "preloading" | "preroll" | "speaking" | "done";

interface OnboardingIntroProps {
  assistantId: AssistantId;
  accentColor: string;
  musicAudioRef: React.RefObject<HTMLAudioElement | null>;
  onDone?: () => void;
}

function calcSubtitleTimestamps(
  lines: { text: string }[],
  totalDuration: number
): number[] {
  const weights = lines.map(l => Math.max(l.text.length, 1));
  const totalWeight = weights.reduce((s, w) => s + w, 0);
  const timestamps: number[] = [];
  let accumulated = 0;
  for (const w of weights) {
    timestamps.push((accumulated / totalWeight) * totalDuration);
    accumulated += w;
  }
  return timestamps;
}

export default function OnboardingIntro({
  assistantId,
  accentColor,
  musicAudioRef,
  onDone,
}: OnboardingIntroProps) {
  const profile = ASSISTANT_PROFILES[assistantId];
  const storageKey = STORAGE_KEY_PREFIX + assistantId;

  const [phase, setPhase] = useState<Phase>("idle");
  const [subtitleIdx, setSubtitleIdx] = useState(-1);
  const [showReplay, setShowReplay] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [forcedReplay, setForcedReplay] = useState(false);

  const voiceAudioRef = useRef<HTMLAudioElement | null>(null);
  const subtitleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const originalVolumeRef = useRef<number>(0.15);

  const hasPlayed = !forcedReplay && !!localStorage.getItem(storageKey);

  const stopSubtitleTimers = () => {
    if (subtitleTimerRef.current) clearTimeout(subtitleTimerRef.current);
  };

  const duckMusic = useCallback(() => {
    const music = musicAudioRef.current;
    if (!music) return;
    originalVolumeRef.current = music.volume;
    const duck = () => {
      if (!musicAudioRef.current) return;
      const target = 0.04;
      const current = musicAudioRef.current.volume;
      if (current > target) {
        musicAudioRef.current.volume = Math.max(current - 0.005, target);
        requestAnimationFrame(duck);
      }
    };
    requestAnimationFrame(duck);
  }, [musicAudioRef]);

  const restoreMusic = useCallback(() => {
    const music = musicAudioRef.current;
    if (!music) return;
    const target = originalVolumeRef.current;
    const restore = () => {
      if (!musicAudioRef.current) return;
      const current = musicAudioRef.current.volume;
      if (current < target) {
        musicAudioRef.current.volume = Math.min(current + 0.003, target);
        requestAnimationFrame(restore);
      }
    };
    requestAnimationFrame(restore);
  }, [musicAudioRef]);

  const finishIntro = useCallback(() => {
    stopSubtitleTimers();
    restoreMusic();
    localStorage.setItem(storageKey, "1");
    setPhase("done");
    setShowReplay(true);
    setForcedReplay(false);
    onDone?.();
  }, [restoreMusic, storageKey, onDone]);

  const skipIntro = useCallback(() => {
    voiceAudioRef.current?.pause();
    voiceAudioRef.current && (voiceAudioRef.current.src = "");
    finishIntro();
  }, [finishIntro]);

  const startIntro = useCallback(async () => {
    setAudioError(false);
    setPhase("preloading");
    setSubtitleIdx(-1);

    let audioUrl: string;
    try {
      const res = await fetch(`${API_BASE}/tts/intro/${assistantId}`);
      if (!res.ok) throw new Error("TTS fetch failed");
      const blob = await res.blob();
      audioUrl = URL.createObjectURL(blob);
    } catch {
      setAudioError(true);
      setPhase("done");
      setShowReplay(true);
      localStorage.setItem(storageKey, "1");
      onDone?.();
      return;
    }

    setPhase("preroll");
    await new Promise(r => setTimeout(r, 2200));

    duckMusic();
    await new Promise(r => setTimeout(r, 300));

    const audio = new Audio(audioUrl);
    voiceAudioRef.current = audio;
    audio.volume = 1;

    audio.addEventListener("loadedmetadata", () => {
      const totalDuration = audio.duration;
      const timestamps = calcSubtitleTimestamps(profile.subtitleLines, totalDuration);

      audio.addEventListener("timeupdate", () => {
        const t = audio.currentTime;
        let newIdx = 0;
        for (let i = timestamps.length - 1; i >= 0; i--) {
          if (t >= timestamps[i]) { newIdx = i; break; }
        }
        setSubtitleIdx(newIdx);
      });
    });

    audio.addEventListener("ended", finishIntro);
    audio.addEventListener("error", () => {
      setAudioError(true);
      finishIntro();
    });

    setPhase("speaking");
    try { await audio.play(); } catch { finishIntro(); }
  }, [assistantId, duckMusic, finishIntro, profile.subtitleLines, storageKey, onDone]);

  const replayIntro = useCallback(() => {
    setShowReplay(false);
    setForcedReplay(true);
    setPhase("idle");
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  useEffect(() => {
    if (hasPlayed) {
      setPhase("done");
      setShowReplay(true);
      onDone?.();
      return;
    }
    const timer = setTimeout(() => { startIntro(); }, 400);
    return () => clearTimeout(timer);
  }, [hasPlayed]);

  useEffect(() => {
    if (phase === "idle" && !hasPlayed && forcedReplay) {
      const timer = setTimeout(() => { startIntro(); }, 200);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [phase, hasPlayed, forcedReplay]);

  useEffect(() => {
    return () => {
      stopSubtitleTimers();
      voiceAudioRef.current?.pause();
    };
  }, []);

  const isActive = phase === "preloading" || phase === "preroll" || phase === "speaking";
  const currentSubtitle = profile.subtitleLines[subtitleIdx]?.text ?? "";

  return (
    <div className="relative">
      <AnimatePresence>
        {isActive && (
          <motion.div
            key="intro-panel"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-x-0 bottom-0 z-[300] pb-safe"
            style={{ paddingBottom: "max(env(safe-area-inset-bottom), 16px)" }}
          >
            <div className="mx-auto max-w-sm px-4 pb-4">
              <div
                className="relative rounded-2xl overflow-hidden px-5 pt-4 pb-4"
                style={{
                  background: "rgba(10,10,10,0.92)",
                  border: `1px solid ${accentColor}28`,
                  backdropFilter: "blur(20px)",
                  boxShadow: `0 0 40px ${accentColor}18, 0 16px 40px rgba(0,0,0,0.7)`,
                }}
              >
                <div
                  className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl"
                  style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
                />

                <div className="flex items-start gap-3">
                  <div
                    className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-base"
                    style={{ background: `${accentColor}18`, border: `1px solid ${accentColor}35` }}
                  >
                    {phase === "preloading" ? (
                      <Loader2 size={15} className="animate-spin" style={{ color: accentColor }} />
                    ) : phase === "preroll" ? (
                      <Volume2 size={15} style={{ color: accentColor }} />
                    ) : (
                      <span>{profile.avatarEmoji}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-[10px] font-black uppercase tracking-widest"
                        style={{ color: accentColor }}
                      >
                        {profile.name} · Assistant
                      </span>
                      {phase === "speaking" && (
                        <motion.div className="flex gap-[3px] items-end h-3">
                          {[0, 1, 2].map(i => (
                            <motion.div
                              key={i}
                              className="w-[3px] rounded-full"
                              style={{ background: accentColor }}
                              animate={{ height: ["4px", "10px", "4px"] }}
                              transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                            />
                          ))}
                        </motion.div>
                      )}
                    </div>

                    <AnimatePresence mode="wait">
                      {phase === "preloading" && (
                        <motion.p
                          key="loading"
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="text-white/50 text-[13px] leading-snug"
                        >
                          Getting the intro ready…
                        </motion.p>
                      )}
                      {phase === "preroll" && (
                        <motion.p
                          key="preroll"
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="text-white/50 text-[13px] leading-snug italic"
                        >
                          Setting the mood…
                        </motion.p>
                      )}
                      {phase === "speaking" && currentSubtitle && (
                        <motion.p
                          key={`sub-${subtitleIdx}`}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-white text-[14px] leading-snug font-medium"
                        >
                          {currentSubtitle}
                        </motion.p>
                      )}
                      {phase === "speaking" && !currentSubtitle && (
                        <motion.p
                          key="speaking-wait"
                          className="text-white/30 text-[13px] italic"
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        >
                          …
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <button
                    onClick={skipIntro}
                    className="flex-shrink-0 flex items-center gap-1 text-white/35 hover:text-white/70 transition-colors text-[11px] font-bold uppercase tracking-wider mt-0.5 min-h-[36px] px-1"
                  >
                    <SkipForward size={13} />
                    Skip
                  </button>
                </div>

                {phase === "speaking" && (
                  <div className="mt-3 mx-1">
                    <div className="h-0.5 rounded-full bg-white/8 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${accentColor}80, ${accentColor})` }}
                        animate={{
                          width: `${Math.max(((subtitleIdx + 1) / Math.max(profile.subtitleLines.length, 1)) * 100, 4)}%`,
                        }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showReplay && (
          <motion.button
            key="replay"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.25 }}
            onClick={replayIntro}
            className="flex items-center gap-1.5 text-white/30 hover:text-white/60 transition-colors text-[11px] font-bold uppercase tracking-wider min-h-[36px] px-1"
          >
            <RotateCcw size={11} />
            {audioError ? "Retry intro" : "Replay intro"}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
