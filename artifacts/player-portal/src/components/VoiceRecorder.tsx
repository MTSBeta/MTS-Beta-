import { useState, useRef, useEffect } from "react";
import { Mic, Square, Play, Pause, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VoiceRecorderProps {
  onAudioReady: (blob: Blob | null, url: string | null) => void;
  onTranscript?: (text: string) => void;
  existingUrl?: string | null;
}

type RecordState = "idle" | "recording" | "paused" | "recorded" | "playing";

const SpeechRecognitionAPI: typeof window.SpeechRecognition | undefined =
  (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;

export function VoiceRecorder({ onAudioReady, onTranscript, existingUrl }: VoiceRecorderProps) {
  const [state, setState] = useState<RecordState>(existingUrl ? "recorded" : "idle");
  const [duration, setDuration] = useState(0);
  const [playProgress, setPlayProgress] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(existingUrl ?? null);
  const [error, setError] = useState<string | null>(null);
  const [transcriptCaptured, setTranscriptCaptured] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recognitionRef = useRef<InstanceType<typeof window.SpeechRecognition> | null>(null);
  const transcriptRef = useRef<string>("");

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl && !existingUrl) URL.revokeObjectURL(audioUrl);
      recognitionRef.current?.stop();
    };
  }, []);

  const startTimer = () => {
    timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  };

  const startRecognition = () => {
    if (!SpeechRecognitionAPI || !onTranscript) return;
    try {
      transcriptRef.current = "";
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = "en-GB";
      recognition.onresult = (e) => {
        for (let i = e.resultIndex; i < e.results.length; i++) {
          if (e.results[i].isFinal) {
            transcriptRef.current += e.results[i][0].transcript + " ";
          }
        }
      };
      recognition.onerror = () => {};
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.start();
      recognitionRef.current = recognition;
    } catch {
    }
  };

  const stopRecognition = () => {
    try { recognitionRef.current?.stop(); } catch {}
    recognitionRef.current = null;
  };

  const startRecording = async () => {
    setError(null);
    setTranscriptCaptured(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
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
        setAudioUrl(url);
        setState("recorded");
        onAudioReady(blob, url);
        streamRef.current?.getTracks().forEach((t) => t.stop());

        if (onTranscript) {
          setTimeout(() => {
            const transcript = transcriptRef.current.trim();
            if (transcript) {
              onTranscript(transcript);
              setTranscriptCaptured(true);
            }
            transcriptRef.current = "";
          }, 350);
        }
      };

      recorder.start(100);
      setState("recording");
      setDuration(0);
      startTimer();
      startRecognition();
    } catch {
      setError("Microphone access denied. Please allow microphone in your browser settings.");
      setState("idle");
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.pause();
      stopTimer();
      setState("paused");
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current?.state === "paused") {
      mediaRecorderRef.current.resume();
      startTimer();
      setState("recording");
    }
  };

  const stopRecording = () => {
    stopRecognition();
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    stopTimer();
  };

  const playAudio = () => {
    if (!audioUrl) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => { setState("recorded"); setPlayProgress(0); };
      audioRef.current.ontimeupdate = () => {
        if (audioRef.current) {
          setPlayProgress((audioRef.current.currentTime / (audioRef.current.duration || 1)) * 100);
        }
      };
    }
    audioRef.current.play();
    setState("playing");
  };

  const pauseAudio = () => { audioRef.current?.pause(); setState("recorded"); };

  const deleteRecording = () => {
    audioRef.current?.pause();
    audioRef.current = null;
    if (audioUrl && !existingUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setState("idle");
    setDuration(0);
    setPlayProgress(0);
    setTranscriptCaptured(false);
    transcriptRef.current = "";
    onAudioReady(null, null);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="flex flex-col gap-2">
      <AnimatePresence mode="wait">

        {/* ── IDLE ── */}
        {state === "idle" && (
          <motion.button
            key="idle"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            type="button"
            onClick={startRecording}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all text-white/60 hover:text-white text-sm font-medium w-fit"
          >
            <Mic size={16} className="text-red-400" />
            Add voice note
          </motion.button>
        )}

        {/* ── RECORDING ── */}
        {state === "recording" && (
          <motion.div
            key="recording"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30"
          >
            <motion.div
              animate={{ scale: [1, 1.35, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0"
            />
            <span className="text-red-400 text-sm font-mono font-bold w-10 shrink-0">{formatTime(duration)}</span>
            <span className="text-red-300/60 text-xs flex-1">
              {isListening ? "Recording + transcribing…" : "Recording…"}
            </span>
            <button
              type="button"
              onClick={pauseRecording}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 text-xs font-semibold transition-all"
              title="Pause recording"
            >
              <Pause size={11} />
              Pause
            </button>
            <button
              type="button"
              onClick={stopRecording}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-300 text-xs font-semibold transition-all"
              title="Stop and save"
            >
              <Square size={11} />
              Stop
            </button>
          </motion.div>
        )}

        {/* ── PAUSED ── */}
        {state === "paused" && (
          <motion.div
            key="paused"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
            <span className="text-amber-400 text-sm font-mono font-bold w-10 shrink-0">{formatTime(duration)}</span>
            <span className="text-amber-300/60 text-xs flex-1">Paused</span>
            <button
              type="button"
              onClick={resumeRecording}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 text-xs font-semibold transition-all"
              title="Resume recording"
            >
              <Mic size={11} />
              Resume
            </button>
            <button
              type="button"
              onClick={stopRecording}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-300 text-xs font-semibold transition-all"
              title="Stop and save"
            >
              <Square size={11} />
              Save
            </button>
          </motion.div>
        )}

        {/* ── RECORDED / PLAYING ── */}
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
              <span className="text-white/40 text-xs font-mono shrink-0">{formatTime(duration)}</span>
              <button
                type="button"
                onClick={deleteRecording}
                className="text-white/30 hover:text-red-400 transition-colors"
                title="Delete and re-record"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <p className="text-xs text-green-400/80 flex items-center gap-1">
              <span>✓</span>
              {transcriptCaptured ? "Voice note saved — transcript added to text box" : "Voice note saved"}
            </p>
          </motion.div>
        )}

      </AnimatePresence>

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
