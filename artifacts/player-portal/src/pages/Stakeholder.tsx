import { publicAssetUrl } from "@/lib/publicAssetUrl";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRoute } from "wouter";
import { Loader2, CheckCircle2, Mic2 } from "lucide-react";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { MediaUploader } from "@/components/MediaUploader";
import { getStakeholderQuestions } from "@/data/stakeholderQuestions";
import {
  useGetStakeholderByCode,
  useSubmitStakeholderResponses,
} from "@workspace/api-client-react";

interface AnswerEntry {
  text: string;
  audioUrl: string | null;
  audioBlob?: Blob | null;
  mediaUrls: string[];
}

function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${
          i < current ? "bg-white/50 w-3" : i === current ? "bg-white w-4" : "bg-white/15 w-1.5"
        }`} />
      ))}
    </div>
  );
}

export default function Stakeholder() {
  const [match, params] = useRoute("/stakeholder/:code");
  const code = params?.code ?? "";

  const [answers, setAnswers] = useState<AnswerEntry[]>(
    Array(10).fill(null).map(() => ({ text: "", audioUrl: null, mediaUrls: [] }))
  );
  const [errors, setErrors] = useState<boolean[]>(Array(10).fill(false));
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { data: info, isLoading, isError } = useGetStakeholderByCode(code);
  const submitMutation = useSubmitStakeholderResponses();

  /* Loading */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-white/30" />
      </div>
    );
  }

  /* Error */
  if (isError || !info) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6 text-center">
        <span className="text-5xl mb-4">😕</span>
        <h2 className="text-2xl font-display font-black text-white mb-2">Link Not Found</h2>
        <p className="text-white/40 text-sm">This invite link may have expired or been entered incorrectly.</p>
      </div>
    );
  }

  /* Already submitted */
  if (info.submitted || isSubmitted) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
          <div className="w-24 h-24 rounded-3xl bg-green-500/15 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} className="text-green-400" />
          </div>
        </motion.div>
        <h1 className="text-3xl font-display font-black text-white mb-3">Done. Thank you.</h1>
        <p className="text-white/50 text-base leading-relaxed max-w-xs">
          Your perspective on <strong className="text-white">{info.playerName}</strong> has been saved and will shape their story.
        </p>
      </div>
    );
  }

  const qset = getStakeholderQuestions(info.type);

  const updateAnswer = (index: number, patch: Partial<AnswerEntry>) => {
    setAnswers(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...patch };
      return updated;
    });
    if (patch.text?.trim() || patch.audioUrl) {
      setErrors(prev => { const e = [...prev]; e[index] = false; return e; });
    }
  };

  const handleSubmit = async () => {
    const newErrors = answers.map((a, i) => i < qset.questions.length && !a.text.trim() && !a.audioUrl);
    if (newErrors.some(Boolean)) { setErrors(newErrors); return; }

    const responses = qset.questions.map((q, qi) => ({
      questionNumber: qi + 1, questionText: q,
      answerText: answers[qi]?.text ?? "",
      audioUrl: answers[qi]?.audioUrl ?? null,
      mediaUrls: answers[qi]?.mediaUrls ?? [],
    }));

    await submitMutation.mutateAsync({ code, data: { responses } });
    setIsSubmitted(true);
  };

  const answeredCount = answers.slice(0, qset.questions.length).filter(a => a.text.trim() || a.audioUrl).length;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* BG */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img src={publicAssetUrl("images/hero-bg.png")} alt=""
          className="w-full h-full object-cover opacity-15 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0a]" />
      </div>

      {/* Breathing crest watermark */}
      {info.crestUrl && (
        <div className="pointer-events-none fixed inset-0 z-[20] select-none flex items-center justify-center" aria-hidden="true">
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.12, 0.22, 0.12] }}
            transition={{ duration: 7, ease: "easeInOut", repeat: Infinity, repeatType: "loop" }}
            style={{ filter: "blur(2px) brightness(1.4)" }}
          >
            <img src={info.crestUrl} alt="" className="w-[480px] h-[480px] object-contain" />
          </motion.div>
        </div>
      )}

      {/* Sticky header */}
      <div className="sticky top-0 z-30 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/6">
        <div className="flex items-center justify-between px-4 h-12">
          <span className="w-2 h-2 rounded-full bg-white/30" />
          <ProgressDots total={qset.questions.length} current={answeredCount} />
          <span className="text-white/30 text-xs font-mono">{answeredCount}/{qset.questions.length}</span>
        </div>
      </div>

      {/* Body */}
      <div className="relative z-10 flex-1 overflow-y-auto pb-32">
        <div className="max-w-xl mx-auto px-4 pt-6 space-y-5">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center pb-2"
          >
            <h1 className="text-2xl font-display font-black text-white mb-2">{qset.title}</h1>
            <p className="text-white/45 text-sm leading-relaxed mb-4">{qset.intro}</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/6 border border-white/10 text-sm">
              <span className="font-bold text-white">{info.playerName}</span>
              <span className="text-white/25">·</span>
              <span className="text-white/50">{info.academyName}</span>
              <span className="text-white/25">·</span>
              <span className="text-white/50 capitalize">{info.position}</span>
            </div>
          </motion.div>

          {/* Voice nudge */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/4 border border-white/8 text-sm">
            <Mic2 size={18} strokeWidth={1.5} className="text-white/40 shrink-0" />
            <span className="text-white/50">Tap <strong className="text-white/70">Add voice note</strong> on any question — speaking is quicker and often more honest.</span>
          </div>

          {/* Questions */}
          {qset.questions.map((question, qi) => (
            <motion.div
              key={qi}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: qi * 0.06 }}
              className={`rounded-2xl p-5 space-y-3 ${errors[qi] ? "ring-1 ring-red-500/50" : ""}`}
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <p className="text-base font-semibold text-white leading-relaxed">
                <span className="text-white/20 mr-2 font-mono text-xs">{qi + 1}.</span>
                {question}
              </p>

              <textarea
                rows={3}
                placeholder="Share your thoughts..."
                value={answers[qi]?.text ?? ""}
                onChange={e => updateAnswer(qi, { text: e.target.value })}
                className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors resize-none leading-relaxed ${errors[qi] ? "border-red-500/50" : "border-white/10"}`}
              />

              <div className="flex flex-col gap-2">
                <VoiceRecorder
                  onAudioReady={(blob, url) => updateAnswer(qi, { audioBlob: blob, audioUrl: url })}
                  existingUrl={answers[qi]?.audioUrl}
                />
                <MediaUploader
                  onMediaChange={paths => updateAnswer(qi, { mediaUrls: paths })}
                  existingUrls={answers[qi]?.mediaUrls}
                />
              </div>

              {errors[qi] && (
                <p className="text-xs text-red-400">Please write a response or record a voice note.</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Sticky submit */}
      <div className="fixed bottom-0 left-0 right-0 z-20 px-4 pb-6 pt-3"
        style={{ background: "linear-gradient(to top, #0a0a0a 70%, transparent)" }}>
        <div className="max-w-xl mx-auto space-y-2">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSubmit}
            disabled={submitMutation.isPending}
            className="w-full py-4 rounded-2xl font-black text-base uppercase tracking-widest disabled:opacity-50 bg-white text-black font-display"
          >
            {submitMutation.isPending
              ? <span className="flex items-center justify-center gap-2"><Loader2 size={18} className="animate-spin" />Submitting…</span>
              : "Submit My Perspective →"
            }
          </motion.button>
          {submitMutation.isError && (
            <p className="text-red-400 text-xs text-center">Something went wrong. Please try again.</p>
          )}
        </div>
      </div>
    </div>
  );
}
