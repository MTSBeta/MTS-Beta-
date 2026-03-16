import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { usePlayerContext } from "@/context/PlayerContext";
import { U9_STAGES } from "@/data/u9Questions";
import { useSaveJourneyResponses, useCompleteJourney } from "@workspace/api-client-react";
import type { AnswerEntry } from "@/context/PlayerContext";

function isLight(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 160;
}

export default function JourneyU9() {
  const [_, navigate] = useLocation();
  const { playerData, selectedAcademy, journeyAnswers, saveJourneyStage } = usePlayerContext();

  const primaryColor = selectedAcademy?.primaryColor ?? "#6d28d9";
  const btnText = isLight(primaryColor) ? "#000" : "#fff";

  // Flat question index across all stages
  const allQuestions = U9_STAGES.flatMap((stage, si) =>
    stage.questions.map((q, qi) => ({ stage, stageIndex: si, question: q, questionIndex: qi }))
  );
  const total = allQuestions.length;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<AnswerEntry[]>(
    Array(total).fill(null).map(() => ({ text: "", audioUrl: null, audioBlob: null, mediaUrls: [] }))
  );
  const [error, setError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [direction, setDirection] = useState(1);

  const saveMutation = useSaveJourneyResponses();
  const completeMutation = useCompleteJourney();

  useEffect(() => { if (!playerData) navigate("/"); }, [playerData]);
  if (!playerData) return null;

  const { stage, stageIndex, question, questionIndex } = allQuestions[currentIdx];
  const stageColor = stage.colour;
  const isLastQuestion = currentIdx === total - 1;

  const updateCurrent = (patch: Partial<AnswerEntry>) => {
    setAnswers(prev => {
      const updated = [...prev];
      updated[currentIdx] = { ...updated[currentIdx], ...patch };
      return updated;
    });
    if (patch.text?.trim() || patch.audioUrl) setError(false);
  };

  const hasAnswer = () => {
    const a = answers[currentIdx];
    return !!(a.text.trim() || a.audioUrl);
  };

  const goNext = async () => {
    if (!hasAnswer()) { setError(true); return; }
    setError(false);

    if (isLastQuestion) {
      setIsSaving(true);
      // Save all answers grouped by stage
      for (let si = 0; si < U9_STAGES.length; si++) {
        const s = U9_STAGES[si];
        const stageAnswers = s.questions.map((_, qi) => {
          const flatIdx = U9_STAGES.slice(0, si).reduce((acc, prev) => acc + prev.questions.length, 0) + qi;
          return answers[flatIdx];
        });
        saveJourneyStage(s.id, stageAnswers);
      }

      const responses = U9_STAGES.flatMap((s, si) =>
        s.questions.map((q, qi) => {
          const flatIdx = U9_STAGES.slice(0, si).reduce((acc, prev) => acc + prev.questions.length, 0) + qi;
          return {
            stage: s.id,
            questionNumber: flatIdx + 1,
            questionText: q.text,
            answerText: answers[flatIdx]?.text ?? "",
            audioUrl: answers[flatIdx]?.audioUrl ?? null,
            mediaUrls: answers[flatIdx]?.mediaUrls ?? [],
          };
        })
      );

      try {
        await saveMutation.mutateAsync({ playerId: playerData.id, data: { responses } });
        await completeMutation.mutateAsync({ playerId: playerData.id });
        navigate("/invite");
      } catch (err) {
        console.error("Save error", err);
      } finally {
        setIsSaving(false);
      }
    } else {
      setDirection(1);
      setCurrentIdx(i => i + 1);
    }
  };

  const goBack = () => {
    if (currentIdx > 0) {
      setDirection(-1);
      setCurrentIdx(i => i - 1);
      setError(false);
    }
  };

  // Overall progress
  const progressPct = ((currentIdx) / total) * 100;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* BG */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img src={`${import.meta.env.BASE_URL}images/hero-bg.png`} alt=""
          className="w-full h-full object-cover opacity-10 mix-blend-overlay" />
        <div className="absolute inset-0" style={{
          background: `radial-gradient(ellipse at 50% 0%, ${stageColor}20 0%, transparent 60%)`
        }} />
      </div>

      {/* ── STICKY HEADER ── */}
      <div className="sticky top-0 z-30 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/6">
        <div className="flex items-center justify-between px-4 h-12">
          <button onClick={goBack} disabled={currentIdx === 0 || isSaving}
            className="flex items-center gap-1 text-white/40 hover:text-white/60 text-sm transition-colors py-2 -ml-1 disabled:opacity-20">
            ← Back
          </button>

          {/* Stage dots */}
          <div className="flex items-center gap-1.5">
            {U9_STAGES.map((s, i) => (
              <div key={i} className="flex gap-0.5">
                {s.questions.map((_, qi) => {
                  const flatIdx = U9_STAGES.slice(0, i).reduce((acc, prev) => acc + prev.questions.length, 0) + qi;
                  return (
                    <div key={qi} className="w-2 h-2 rounded-full transition-all duration-300"
                      style={{
                        background: flatIdx < currentIdx
                          ? stageColor
                          : flatIdx === currentIdx
                          ? "white"
                          : "rgba(255,255,255,0.12)"
                      }} />
                  );
                })}
                {i < U9_STAGES.length - 1 && <div className="w-1.5" />}
              </div>
            ))}
          </div>

          <button onClick={() => navigate("/welcome-u9")} disabled={isSaving}
            className="text-white/30 hover:text-white/60 text-xs transition-colors py-2 -mr-1 disabled:opacity-30">
            Exit
          </button>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-white/8 mx-4 rounded-full mb-2 overflow-hidden">
          <motion.div className="h-full rounded-full"
            style={{ background: stageColor }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* ── QUESTION CARD ── */}
      <div className="relative z-10 flex-1 flex flex-col overflow-hidden pb-32">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIdx}
            custom={direction}
            initial={{ opacity: 0, x: direction * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -60 }}
            transition={{ duration: 0.25 }}
            className="flex-1 flex flex-col max-w-sm mx-auto w-full px-4 pt-6"
          >
            {/* Stage badge */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
                style={{ background: `${stageColor}25` }}>
                {stage.emoji}
              </div>
              <span className="text-xs font-bold uppercase tracking-widest"
                style={{ color: stageColor }}>
                {stage.title} · Question {questionIndex + 1}
              </span>
            </div>

            {/* Question */}
            <div className="flex-1 flex flex-col gap-5">
              {/* Big question emoji */}
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className="text-6xl text-center"
              >
                {question.emoji}
              </motion.div>

              {/* Question text */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <p className="text-xl font-bold text-white text-center leading-relaxed mb-2">
                  {question.text}
                </p>
                <p className="text-white/35 text-sm text-center leading-relaxed">
                  {question.hint}
                </p>
              </motion.div>

              {/* Voice recorder — PRIMARY action */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl p-4"
                style={{ background: `${stageColor}15`, border: `1px solid ${stageColor}30` }}
              >
                <p className="text-xs font-bold uppercase tracking-widest mb-3"
                  style={{ color: stageColor }}>🎙️ Talk it out</p>
                <VoiceRecorder
                  onAudioReady={(blob, url) => updateCurrent({ audioBlob: blob, audioUrl: url })}
                  existingUrl={answers[currentIdx]?.audioUrl}
                />
              </motion.div>

              {/* Or type */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-white/30 text-xs text-center mb-2">or type your answer</p>
                <textarea
                  rows={3}
                  placeholder="Write here if you like…"
                  value={answers[currentIdx]?.text ?? ""}
                  onChange={e => updateCurrent({ text: e.target.value })}
                  className={`w-full bg-white/5 border rounded-2xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none transition-colors resize-none leading-relaxed ${
                    error ? "border-red-500/50" : "border-white/10 focus:border-white/25"
                  }`}
                />
                {error && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-amber-400 text-xs text-center mt-2">
                    Please talk or type something first! 😊
                  </motion.p>
                )}
              </motion.div>

              {/* Answered tick */}
              {hasAnswer() && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-center gap-1.5"
                  style={{ color: stageColor }}
                >
                  <span className="text-sm">✓</span>
                  <span className="text-xs font-bold">Answer saved</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── STICKY NEXT BUTTON ── */}
      <div className="fixed bottom-0 left-0 right-0 z-30 px-4 pb-6 pt-3"
        style={{ background: "linear-gradient(to top, #0a0a0a 70%, transparent)" }}>
        <div className="max-w-sm mx-auto">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={goNext}
            disabled={isSaving}
            className="w-full py-4 rounded-2xl font-black text-lg uppercase tracking-widest transition-all disabled:opacity-50 font-display"
            style={{ background: stageColor, color: isLight(stageColor) ? "#000" : "#fff", boxShadow: `0 8px 32px ${stageColor}55` }}
          >
            {isSaving ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving…
              </span>
            ) : isLastQuestion
              ? "Finish My Story! 🎉"
              : "Next Question →"
            }
          </motion.button>
          <p className="text-white/20 text-[10px] text-center mt-2">
            Question {currentIdx + 1} of {total}
          </p>
        </div>
      </div>
    </div>
  );
}
