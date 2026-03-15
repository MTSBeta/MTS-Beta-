import { useState, useRef, useEffect } from "react";
import { Mic, Square, Play, Pause, Trash2, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VoiceRecorderProps {
  onAudioReady: (blob: Blob | null, url: string | null) => void;
  existingUrl?: string | null;
}

type RecordState = "idle" | "recording" | "recorded" | "playing";

export function VoiceRecorder({ onAudioReady, existingUrl }: VoiceRecorderProps) {
  const [state, setState] = useState<RecordState>(existingUrl ? "recorded" : "idle");
  const [duration, setDuration] = useState(0);
  const [playProgress, setPlayProgress] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(existingUrl ?? null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl && !existingUrl) URL.revokeObjectURL(audioUrl);
    };
  }, []);

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/mp4";
      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        setState("recorded");
        onAudioReady(blob, url);
        stream.getTracks().forEach((t) => t.stop());
      };

      recorder.start(100);
      setState("recording");
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration((d) => d + 1);
      }, 1000);
    } catch (err) {
      setError("Microphone access denied. Please allow microphone in your browser settings.");
      setState("idle");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const playAudio = () => {
    if (!audioUrl) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => {
        setState("recorded");
        setPlayProgress(0);
      };
      audioRef.current.ontimeupdate = () => {
        if (audioRef.current) {
          const pct = (audioRef.current.currentTime / (audioRef.current.duration || 1)) * 100;
          setPlayProgress(pct);
        }
      };
    }
    audioRef.current.play();
    setState("playing");
  };

  const pauseAudio = () => {
    audioRef.current?.pause();
    setState("recorded");
  };

  const deleteRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (audioUrl && !existingUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setAudioBlob(null);
    setState("idle");
    setDuration(0);
    setPlayProgress(0);
    onAudioReady(null, null);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="flex flex-col gap-2">
      <AnimatePresence mode="wait">
        {state === "idle" && (
          <motion.button
            key="record-btn"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            type="button"
            onClick={startRecording}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all text-white/60 hover:text-white text-sm font-medium"
          >
            <Mic size={16} className="text-red-400" />
            Add voice note
          </motion.button>
        )}

        {state === "recording" && (
          <motion.div
            key="recording"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30"
          >
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="w-3 h-3 rounded-full bg-red-500"
            />
            <span className="text-red-400 text-sm font-mono font-bold">{formatTime(duration)}</span>
            <span className="text-red-300/60 text-xs flex-1">Recording...</span>
            <button
              type="button"
              onClick={stopRecording}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-300 text-xs font-semibold transition-all"
            >
              <Square size={12} />
              Stop
            </button>
          </motion.div>
        )}

        {(state === "recorded" || state === "playing") && (
          <motion.div
            key="playback"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-2 p-3 rounded-xl bg-white/5 border border-white/10"
          >
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={state === "playing" ? pauseAudio : playAudio}
                className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-all shrink-0"
              >
                {state === "playing" ? <Pause size={14} /> : <Play size={14} />}
              </button>
              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-green-400 rounded-full"
                  animate={{ width: `${playProgress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              <span className="text-white/40 text-xs font-mono shrink-0">
                {formatTime(duration)}
              </span>
              <button
                type="button"
                onClick={deleteRecording}
                className="text-white/30 hover:text-red-400 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <p className="text-xs text-green-400/80 flex items-center gap-1">
              <span>✓</span> Voice note saved
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
