import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { SkipForward } from "lucide-react";
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

  const allQuestions = U9_STAGES.flatMap((stage, si) =>
    stage.questions.map((q, qi) => ({ stage, stageIndex: si, question: q, questionIndex: qi }))
  );
  const total = allQuestions.length;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<AnswerEntry[]>(
    Array(total).fill(null).map(() => ({ text: "", audioUrl: null, audioBlob: null, mediaUrls: [] }))
  );
  const [skipped, setSkipped] = useState<Set<number>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [direction, setDirection] = useState(1);
  // "review" mode: after all questions, show skipped ones
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewIdx, setReviewIdx] = useState(0);

  const saveMutation = useSaveJourneyResponses();
  const completeMutation = useCompleteJourney();

  useEffect(() => { if (!playerData) navigate("/"); }, [playerData]);
  if (!playerData) return null;

  const { stage, stageIndex, question, questionIndex } = allQuestions[currentIdx];
  const stageColor = stage.colour;
  const isLastMain = currentIdx === total - 1;

  const updateCurrent = (patch: Partial<AnswerEntry>) => {
    setAnswers(prev => {
      const updated = [...prev];
      updated[currentIdx] = { ...updated[currentIdx], ...patch };
      return updated;
    });
  };

  const hasAnswer = (idx: number) => {
    const a = answers[idx];
    return !!(a?.text.trim() || a?.audioUrl);
  };

  const skipCurrent = () => {
    setSkipped(prev => new Set([...prev, currentIdx]));
    if (!isLastMain) {
      setDirection(1);
      setCurrentIdx(i => i + 1);
    } else {
      // Last question skipped — go to review if any skipped, else complete
      enterReviewOrComplete();
    }
  };

  const getSkippedList = () => allQuestions
    .map((q, idx) => ({ ...q, idx }))
    .filter(({ idx }) => skipped.has(idx));

  const enterReviewOrComplete = () => {
    const skippedList = getSkippedList();
    if (skippedList.length > 0) {
      setReviewMode(true);
      setReviewIdx(0);
    } else {
      finishJourney();
    }
  };

  const goNext = () => {
    if (!hasAnswer(currentIdx) && !skipped.has(currentIdx)) {
      // No answer and not skipped — prompt to skip or answer
      return;
    }
    if (isLastMain) {
      enterReviewOrComplete();
    } else {
      setDirection(1);
      setCurrentIdx(i => i + 1);
    }
  };

  const goBack = () => {
    if (reviewMode) {
      if (reviewIdx > 0) setReviewIdx(i => i - 1);
      else { setReviewMode(false); }
      return;
    }
    if (currentIdx > 0) {
      setDirection(-1);
      setCurrentIdx(i => i - 1);
    }
  };

  const finishJourney = async () => {
    setIsSaving(true);
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
    } catch (err) { console.error("Save error", err); }
    finally { setIsSaving(false); }
  };

  const skippedList = getSkippedList();
  const progressPct = ((currentIdx) / total) * 100;

  // ── REVIEW MODE: go through skipped questions one by one ──
  if (reviewMode) {
    const currentReview = skippedList[reviewIdx];
    if (!currentReview) {
      finishJourney();
      return null;
    }
    const rStageColor = currentReview.stage.colour;
    const isLastReview = reviewIdx === skippedList.length - 1;

    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <img src={`${import.meta.env.BASE_URL}images/hero-bg.png`} alt=""
            className="w-full h-full object-cover opacity-10 mix-blend-overlay" />
        </div>

        {/* Header */}
        <div className="sticky top-0 z-30 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/6">
          <div className="flex items-center justify-between px-4 h-12">
            <button onClick={goBack} className="flex items-center gap-1 text-white/40 text-xs py-2 -ml-1">← Back</button>
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">
              {reviewIdx + 1} of {skippedList.length} left
            </span>
            <button onClick={finishJourney} className="text-white/25 text-xs py-2 -mr-1">Skip all</button>
          </div>
        </div>

        <div className="relative z-10 flex-1 flex flex-col pb-32">
          <AnimatePresence mode="wait">
            <motion.div
              key={`review-${reviewIdx}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
              className="flex-1 flex flex-col max-w-sm mx-auto w-full px-4 pt-6 gap-5"
            >
              {/* Header */}
              <div className="text-center">
                <div className="text-4xl mb-2">⏭️</div>
                <h2 className="text-xl font-display font-black text-white">One you skipped!</h2>
                <p className="text-white/40 text-sm mt-1">Have a go now if you can 😊</p>
              </div>

              {/* Stage badge */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
                  style={{ background: `${rStageColor}25` }}>
                  {currentReview.stage.emoji}
                </div>
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: rStageColor }}>
                  {currentReview.stage.title}
                </span>
              </div>

              <div>
                <p className="text-xl font-bold text-white text-center leading-relaxed mb-2">
                  {currentReview.question.text}
                </p>
                <p className="text-white/35 text-sm text-center">{currentReview.question.hint}</p>
              </div>

              {/* Voice recorder */}
              <div className="rounded-2xl p-4"
                style={{ background: `${rStageColor}15`, border: `1px solid ${rStageColor}30` }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: rStageColor }}>
                  🎙️ Talk it out
                </p>
                <VoiceRecorder
                  onAudioReady={(blob, url) => setAnswers(prev => {
                    const updated = [...prev];
                    updated[currentReview.idx] = { ...updated[currentReview.idx], audioBlob: blob, audioUrl: url };
                    return updated;
                  })}
                  existingUrl={answers[currentReview.idx]?.audioUrl}
                />
              </div>

              <div>
                <p className="text-white/30 text-xs text-center mb-2">or type your answer</p>
                <textarea
                  rows={3}
                  placeholder="Write here if you like…"
                  value={answers[currentReview.idx]?.text ?? ""}
                  onChange={e => setAnswers(prev => {
                    const updated = [...prev];
                    updated[currentReview.idx] = { ...updated[currentReview.idx], text: e.target.value };
                    return updated;
                  })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors resize-none"
                />
              </div>

              {hasAnswer(currentReview.idx) && (
                <div className="flex items-center justify-center gap-1.5" style={{ color: rStageColor }}>
                  <span className="text-sm">✓</span><span className="text-xs font-bold">Answer saved</span>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Review CTA */}
        <div className="fixed bottom-0 left-0 right-0 z-30 px-4 pb-6 pt-3"
          style={{ background: "linear-gradient(to top, #0a0a0a 70%, transparent)" }}>
          <div className="max-w-sm mx-auto space-y-2">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                if (isLastReview) finishJourney();
                else setReviewIdx(i => i + 1);
              }}
              disabled={isSaving}
              className="w-full py-4 rounded-2xl font-black text-lg uppercase tracking-widest disabled:opacity-50 font-display"
              style={{ background: rStageColor, color: isLight(rStageColor) ? "#000" : "#fff", boxShadow: `0 8px 32px ${rStageColor}55` }}
            >
              {isSaving
                ? "Saving…"
                : isLastReview ? "Finish My Story! 🎉" : "Next →"
              }
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  // ── MAIN QUESTION FLOW ──
  const hasCurrentAnswer = hasAnswer(currentIdx);
  const isCurrentSkipped = skipped.has(currentIdx);
  const needsAnswer = !hasCurrentAnswer && !isCurrentSkipped;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img src={`${import.meta.env.BASE_URL}images/hero-bg.png`} alt=""
          className="w-full h-full object-cover opacity-10 mix-blend-overlay" />
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 0%, ${stageColor}20 0%, transparent 60%)` }} />
      </div>

      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/6">
        <div className="flex items-center justify-between px-4 h-12">
          <button onClick={goBack} disabled={currentIdx === 0 || isSaving}
            className="flex items-center gap-1 text-white/40 hover:text-white/60 text-sm transition-colors py-2 -ml-1 disabled:opacity-20">
            ← Back
          </button>

          {/* Progress dots */}
          <div className="flex items-center gap-1.5">
            {U9_STAGES.map((s, i) => (
              <div key={i} className="flex gap-0.5">
                {s.questions.map((_, qi) => {
                  const flatIdx = U9_STAGES.slice(0, i).reduce((acc, prev) => acc + prev.questions.length, 0) + qi;
                  const isSkippedDot = skipped.has(flatIdx);
                  const isAnswered = hasAnswer(flatIdx);
                  return (
                    <div key={qi} className="w-2 h-2 rounded-full transition-all duration-300"
                      style={{
                        background: isSkippedDot
                          ? "#f59e0b"
                          : isAnswered
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
        <div className="h-1 bg-white/8 mx-4 rounded-full mb-2 overflow-hidden">
          <motion.div className="h-full rounded-full" style={{ background: stageColor }}
            animate={{ width: `${progressPct}%` }} transition={{ duration: 0.4, ease: "easeOut" }} />
        </div>
      </div>

      {/* Question */}
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
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
                style={{ background: `${stageColor}25` }}>{stage.emoji}</div>
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: stageColor }}>
                {stage.title} · Question {questionIndex + 1}
              </span>
            </div>

            <div className="flex-1 flex flex-col gap-5">
              <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }} className="text-6xl text-center">
                {question.emoji}
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <p className="text-xl font-bold text-white text-center leading-relaxed mb-2">{question.text}</p>
                <p className="text-white/35 text-sm text-center leading-relaxed">{question.hint}</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="rounded-2xl p-4" style={{ background: `${stageColor}15`, border: `1px solid ${stageColor}30` }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: stageColor }}>🎙️ Talk it out</p>
                <VoiceRecorder
                  onAudioReady={(blob, url) => updateCurrent({ audioBlob: blob, audioUrl: url })}
                  existingUrl={answers[currentIdx]?.audioUrl}
                />
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <p className="text-white/30 text-xs text-center mb-2">or type your answer</p>
                <textarea
                  rows={3}
                  placeholder="Write here if you like…"
                  value={answers[currentIdx]?.text ?? ""}
                  onChange={e => updateCurrent({ text: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors resize-none leading-relaxed"
                />
              </motion.div>

              {hasCurrentAnswer && (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-center gap-1.5" style={{ color: stageColor }}>
                  <span className="text-sm">✓</span><span className="text-xs font-bold">Answer saved</span>
                </motion.div>
              )}

              {/* Skip link */}
              {!hasCurrentAnswer && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  type="button"
                  onClick={skipCurrent}
                  className="flex items-center justify-center gap-1.5 text-white/25 hover:text-amber-400/70 text-xs transition-colors mx-auto group"
                >
                  <SkipForward size={12} className="group-hover:text-amber-400/70" />
                  <span>Skip for now — answer later</span>
                </motion.button>
              )}

              {skipped.size > 0 && (
                <p className="text-amber-400/40 text-[10px] text-center">
                  {skipped.size} skipped — you'll get a chance to answer before finishing
                </p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 z-30 px-4 pb-6 pt-3"
        style={{ background: "linear-gradient(to top, #0a0a0a 70%, transparent)" }}>
        <div className="max-w-sm mx-auto">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={goNext}
            disabled={isSaving || needsAnswer}
            className="w-full py-4 rounded-2xl font-black text-lg uppercase tracking-widest transition-all disabled:opacity-35 font-display"
            style={{ background: stageColor, color: isLight(stageColor) ? "#000" : "#fff", boxShadow: `0 8px 32px ${stageColor}55` }}
          >
            {isSaving ? "Saving…" : isLastMain ? "Finish My Story! 🎉" : "Next Question →"}
          </motion.button>
          {needsAnswer && (
            <p className="text-white/30 text-[10px] text-center mt-2">
              Answer first, or tap "Skip for now" below
            </p>
          )}
          {!needsAnswer && (
            <p className="text-white/20 text-[10px] text-center mt-2">
              Question {currentIdx + 1} of {total}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
