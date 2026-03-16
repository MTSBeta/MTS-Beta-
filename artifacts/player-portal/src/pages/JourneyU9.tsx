import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { SkipForward, CheckCircle2 } from "lucide-react";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { MediaUploader } from "@/components/MediaUploader";
import { usePlayerContext } from "@/context/PlayerContext";
import { U9_STAGES, computeCharacterProfile } from "@/data/u9Questions";
import type { U9Question, U9Stage } from "@/data/u9Questions";
import { useSaveJourneyResponses, useCompleteJourney } from "@workspace/api-client-react";
import type { AnswerEntry } from "@/context/PlayerContext";

function isLight(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 160;
}

interface FlatQuestion {
  stage: U9Stage;
  stageIndex: number;
  question: U9Question;
  questionIndex: number;
}

const ALL_QUESTIONS: FlatQuestion[] = U9_STAGES.flatMap((stage, si) =>
  stage.questions.map((q, qi) => ({ stage, stageIndex: si, question: q, questionIndex: qi }))
);
const TOTAL = ALL_QUESTIONS.length;

const PLAYER_QUESTIONS = ALL_QUESTIONS.filter(q => !q.stage.isCoaching);
const COACHING_START_IDX = PLAYER_QUESTIONS.length;

// ── Select option chip ──────────────────────────────────────────────────
function SelectChip({
  label, selected, onToggle, color, multi,
}: {
  label: string; selected: boolean; onToggle: () => void; color: string; multi?: boolean;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.95 }}
      onClick={onToggle}
      className="px-3 py-2.5 rounded-xl text-sm font-semibold text-left transition-all border"
      style={{
        background: selected ? `${color}25` : "rgba(255,255,255,0.04)",
        borderColor: selected ? color : "rgba(255,255,255,0.1)",
        color: selected ? "white" : "rgba(255,255,255,0.55)",
        boxShadow: selected ? `0 0 12px ${color}30` : "none",
      }}
    >
      <span className="flex items-center gap-2">
        {multi && (
          <span className="w-4 h-4 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors"
            style={{ borderColor: selected ? color : "rgba(255,255,255,0.2)", background: selected ? color : "transparent" }}>
            {selected && <svg width="9" height="9" viewBox="0 0 9 9"><path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          </span>
        )}
        {!multi && (
          <span className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors"
            style={{ borderColor: selected ? color : "rgba(255,255,255,0.2)" }}>
            {selected && <span className="w-2 h-2 rounded-full" style={{ background: color }} />}
          </span>
        )}
        {label}
      </span>
    </motion.button>
  );
}

export default function JourneyU9() {
  const [_, navigate] = useLocation();
  const { playerData, selectedAcademy, saveJourneyStage } = usePlayerContext();

  const primaryColor = selectedAcademy?.primaryColor ?? "#6d28d9";

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<AnswerEntry[]>(
    Array(TOTAL).fill(null).map(() => ({ text: "", audioUrl: null, audioBlob: null, mediaUrls: [] }))
  );
  const [skipped, setSkipped] = useState<Set<number>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [direction, setDirection] = useState(1);
  const [showHandover, setShowHandover] = useState(false);

  // Review mode (skipped questions)
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewIdx, setReviewIdx] = useState(0);

  const saveMutation = useSaveJourneyResponses();
  const completeMutation = useCompleteJourney();

  useEffect(() => { if (!playerData) navigate("/"); }, [playerData]);
  if (!playerData) return null;

  const { stage, question, questionIndex } = ALL_QUESTIONS[currentIdx];
  const stageColor = stage.colour;
  const isCoachingQ = !!stage.isCoaching;
  const isLastMain = currentIdx === TOTAL - 1;
  const isPlayerToCoachingTransition = currentIdx === COACHING_START_IDX - 1;

  // ── Answer helpers ─────────────────────────────────────────────────
  const getSelected = (idx: number): string[] => {
    const t = answers[idx]?.text ?? "";
    return t ? t.split("|||").filter(Boolean) : [];
  };

  const setSelected = (idx: number, vals: string[]) => {
    setAnswers(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], text: vals.join("|||") };
      return updated;
    });
  };

  const toggleOption = (idx: number, option: string, multi: boolean) => {
    const current = getSelected(idx);
    if (multi) {
      const next = current.includes(option)
        ? current.filter(o => o !== option)
        : [...current, option];
      setSelected(idx, next);
    } else {
      setSelected(idx, [option]);
    }
  };

  const updateCurrent = (patch: Partial<AnswerEntry>) => {
    setAnswers(prev => {
      const updated = [...prev];
      updated[currentIdx] = { ...updated[currentIdx], ...patch };
      return updated;
    });
  };

  const hasAnswer = (idx: number) => {
    const a = answers[idx];
    const q = ALL_QUESTIONS[idx]?.question;
    if (!q) return false;
    if (q.type === "photo") return (a?.mediaUrls?.length ?? 0) > 0;
    if (q.type === "select" || q.type === "multiselect" || q.type === "coaching-multiselect")
      return getSelected(idx).length > 0;
    return !!(a?.text?.trim() || a?.audioUrl);
  };

  const canAdvance = () => {
    const q = ALL_QUESTIONS[currentIdx]?.question;
    if (!q) return true;
    if (q.type === "photo") return true; // photo is optional
    if (q.type === "coaching-text") return true; // coach can leave blank
    return hasAnswer(currentIdx) || skipped.has(currentIdx);
  };

  // ── Navigation ─────────────────────────────────────────────────────
  const skipCurrent = () => {
    setSkipped(prev => new Set([...prev, currentIdx]));
    if (isPlayerToCoachingTransition) { setShowHandover(true); return; }
    if (isLastMain) { enterReviewOrComplete(); return; }
    setDirection(1);
    setCurrentIdx(i => i + 1);
  };

  const goNext = () => {
    if (!canAdvance()) return;
    if (isPlayerToCoachingTransition && !stage.isCoaching) {
      setShowHandover(true);
      return;
    }
    if (isLastMain) { enterReviewOrComplete(); return; }
    setDirection(1);
    setCurrentIdx(i => i + 1);
  };

  const goBack = () => {
    if (reviewMode) {
      if (reviewIdx > 0) setReviewIdx(i => i - 1);
      else setReviewMode(false);
      return;
    }
    if (showHandover) { setShowHandover(false); return; }
    if (currentIdx > 0) {
      setDirection(-1);
      setCurrentIdx(i => i - 1);
    }
  };

  const getSkippedList = () => ALL_QUESTIONS
    .map((q, idx) => ({ ...q, idx }))
    .filter(({ idx }) => skipped.has(idx));

  const enterReviewOrComplete = () => {
    const skippedList = getSkippedList().filter(q => !q.stage.isCoaching);
    if (skippedList.length > 0) {
      setReviewMode(true);
      setReviewIdx(0);
    } else {
      finishJourney();
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

    // Character profile summation
    const profileText = computeCharacterProfile(
      answers.map(a => ({ text: a?.text ?? "" })),
      ALL_QUESTIONS.map((fq, idx) => ({ stage: fq.stage, question: fq.question, idx }))
    );

    const responses = [
      ...U9_STAGES.flatMap((s, si) =>
        s.questions.map((q, qi) => {
          const flatIdx = U9_STAGES.slice(0, si).reduce((acc, prev) => acc + prev.questions.length, 0) + qi;
          const a = answers[flatIdx];
          const rawText = a?.text ?? "";
          // Convert ||| separator to readable comma list
          const answerText = rawText.includes("|||") ? rawText.split("|||").join(", ") : rawText;
          return {
            stage: s.id,
            questionNumber: flatIdx + 1,
            questionText: q.text,
            answerText,
            audioUrl: a?.audioUrl ?? null,
            mediaUrls: a?.mediaUrls ?? [],
          };
        })
      ),
      // Append summation as a meta response
      {
        stage: "Character Profile",
        questionNumber: TOTAL + 1,
        questionText: "Automated Character Profile Summation",
        answerText: profileText,
        audioUrl: null,
        mediaUrls: [],
      },
    ];

    try {
      await saveMutation.mutateAsync({ playerId: playerData.id, data: { responses } });
      await completeMutation.mutateAsync({ playerId: playerData.id });
      navigate("/invite");
    } catch (err) { console.error("Save error", err); }
    finally { setIsSaving(false); }
  };

  // ── HANDOVER SCREEN ────────────────────────────────────────────────
  if (showHandover) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <img src={`${import.meta.env.BASE_URL}images/hero-bg.png`} alt=""
            className="w-full h-full object-cover opacity-10 mix-blend-overlay" />
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 0%, #0d948820 0%, transparent 60%)` }} />
        </div>

        <div className="sticky top-0 z-30 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/6">
          <div className="flex items-center justify-between px-4 h-12">
            <button onClick={goBack} className="flex items-center gap-1 text-white/40 text-xs py-2 -ml-1">← Back</button>
            <span className="text-[#0d9488] text-xs font-bold uppercase tracking-widest">Coach Section</span>
            <div className="w-14" />
          </div>
        </div>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-8xl mb-6"
          >👨‍🏫</motion.div>

          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-3xl font-display font-black text-white mb-3 leading-tight">
            Amazing job, {playerData.playerName.split(" ")[0]}! 🎉
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="text-white/55 text-base leading-relaxed mb-8 max-w-sm">
            You've answered all your questions! Now it's time to hand the phone to your <strong className="text-white">coach</strong> so they can add their special notes to your book.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="rounded-2xl p-5 mb-8 w-full max-w-sm text-left space-y-3"
            style={{ background: "#0d948818", border: "1px solid #0d948840" }}>
            <p className="text-[#0d9488] text-xs font-bold uppercase tracking-widest">For the coach</p>
            <p className="text-white/65 text-sm leading-relaxed">
              We have a few questions for you about <strong className="text-white">{playerData.playerName.split(" ")[0]}'s</strong> development, club values, and what you'd like their story to reflect. It only takes 5 minutes.
            </p>
          </motion.div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-30 px-4 pb-6 pt-3"
          style={{ background: "linear-gradient(to top, #0a0a0a 70%, transparent)" }}>
          <div className="max-w-sm mx-auto">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => { setShowHandover(false); setCurrentIdx(COACHING_START_IDX); }}
              className="w-full py-4 rounded-2xl font-black text-lg uppercase tracking-widest font-display"
              style={{ background: "#0d9488", color: "#fff", boxShadow: "0 8px 32px #0d948855" }}
            >
              Start Coach Section →
            </motion.button>
            <button
              onClick={finishJourney}
              disabled={isSaving}
              className="w-full mt-2 py-2.5 text-white/30 hover:text-white/60 text-xs font-semibold transition-colors"
            >
              {isSaving ? "Saving…" : "Skip coach section & finish →"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── REVIEW MODE ────────────────────────────────────────────────────
  if (reviewMode) {
    const skippedList = getSkippedList().filter(q => !q.stage.isCoaching);
    const currentReview = skippedList[reviewIdx];
    if (!currentReview) { finishJourney(); return null; }
    const rStageColor = currentReview.stage.colour;
    const isLastReview = reviewIdx === skippedList.length - 1;

    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <img src={`${import.meta.env.BASE_URL}images/hero-bg.png`} alt=""
            className="w-full h-full object-cover opacity-10 mix-blend-overlay" />
        </div>
        <div className="sticky top-0 z-30 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/6">
          <div className="flex items-center justify-between px-4 h-12">
            <button onClick={goBack} className="flex items-center gap-1 text-white/40 text-xs py-2 -ml-1">← Back</button>
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">
              {reviewIdx + 1} of {skippedList.length} left
            </span>
            <button onClick={finishJourney} disabled={isSaving}
              className="text-white/25 text-xs py-2 -mr-1">Skip all</button>
          </div>
        </div>

        <div className="relative z-10 flex-1 flex flex-col pb-32">
          <AnimatePresence mode="wait">
            <motion.div key={`review-${reviewIdx}`}
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.25 }}
              className="flex-1 flex flex-col max-w-sm mx-auto w-full px-4 pt-6 gap-5">
              <div className="text-center">
                <div className="text-4xl mb-2">⏭️</div>
                <h2 className="text-xl font-display font-black text-white">One you skipped!</h2>
                <p className="text-white/40 text-sm mt-1">Have a go now if you can 😊</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
                  style={{ background: `${rStageColor}25` }}>{currentReview.stage.emoji}</div>
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: rStageColor }}>
                  {currentReview.stage.title}
                </span>
              </div>
              <div>
                <p className="text-xl font-bold text-white text-center leading-relaxed mb-2">
                  {currentReview.question.emoji} {currentReview.question.text}
                </p>
                <p className="text-white/35 text-sm text-center">{currentReview.question.hint}</p>
              </div>
              {/* Render appropriate input for review */}
              {(currentReview.question.type === "select" || currentReview.question.type === "multiselect") && currentReview.question.options && (
                <div className="flex flex-wrap gap-2">
                  {currentReview.question.options.map(opt => (
                    <SelectChip key={opt} label={opt}
                      selected={getSelected(currentReview.idx).includes(opt)}
                      onToggle={() => toggleOption(currentReview.idx, opt, currentReview.question.type === "multiselect")}
                      color={rStageColor}
                      multi={currentReview.question.type === "multiselect"}
                    />
                  ))}
                </div>
              )}
              {currentReview.question.type === "voice-text" && (
                <>
                  <div className="rounded-2xl p-4" style={{ background: `${rStageColor}15`, border: `1px solid ${rStageColor}30` }}>
                    <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: rStageColor }}>🎙️ Talk it out</p>
                    <VoiceRecorder
                      onAudioReady={(blob, url) => setAnswers(prev => {
                        const updated = [...prev];
                        updated[currentReview.idx] = { ...updated[currentReview.idx], audioBlob: blob, audioUrl: url };
                        return updated;
                      })}
                      existingUrl={answers[currentReview.idx]?.audioUrl}
                    />
                  </div>
                  <textarea rows={2} placeholder="Write here if you like…"
                    value={answers[currentReview.idx]?.text ?? ""}
                    onChange={e => setAnswers(prev => {
                      const updated = [...prev];
                      updated[currentReview.idx] = { ...updated[currentReview.idx], text: e.target.value };
                      return updated;
                    })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors resize-none"
                  />
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-30 px-4 pb-6 pt-3"
          style={{ background: "linear-gradient(to top, #0a0a0a 70%, transparent)" }}>
          <div className="max-w-sm mx-auto">
            <motion.button whileTap={{ scale: 0.96 }}
              onClick={() => { if (isLastReview) finishJourney(); else setReviewIdx(i => i + 1); }}
              disabled={isSaving}
              className="w-full py-4 rounded-2xl font-black text-lg uppercase tracking-widest disabled:opacity-50 font-display"
              style={{ background: rStageColor, color: isLight(rStageColor) ? "#000" : "#fff", boxShadow: `0 8px 32px ${rStageColor}55` }}>
              {isSaving ? "Saving…" : isLastReview ? "Finish My Story! 🎉" : "Next →"}
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  // ── MAIN QUESTION FLOW ─────────────────────────────────────────────
  const hasCurrentAnswer = hasAnswer(currentIdx);
  const isCurrentSkipped = skipped.has(currentIdx);
  const isPhotoQ = question.type === "photo";
  const isCoachTextQ = question.type === "coaching-text";
  const isSelectType = question.type === "select" || question.type === "multiselect" || question.type === "coaching-multiselect";
  const isMulti = question.type === "multiselect" || question.type === "coaching-multiselect";
  const selectedOpts = getSelected(currentIdx);
  const nextDisabled = !canAdvance() || isSaving;
  const progressPct = (currentIdx / TOTAL) * 100;
  const playerProgressPct = Math.min((currentIdx / COACHING_START_IDX) * 100, 100);
  const coachProgressPct = currentIdx >= COACHING_START_IDX
    ? ((currentIdx - COACHING_START_IDX) / (TOTAL - COACHING_START_IDX)) * 100
    : 0;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img src={`${import.meta.env.BASE_URL}images/hero-bg.png`} alt=""
          className="w-full h-full object-cover opacity-10 mix-blend-overlay" />
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 0%, ${stageColor}20 0%, transparent 60%)` }} />
      </div>

      {/* ── Header ── */}
      <div className="sticky top-0 z-30 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/6">
        <div className="flex items-center justify-between px-4 h-12">
          <button onClick={goBack} disabled={currentIdx === 0 || isSaving}
            className="flex items-center gap-1 text-white/40 hover:text-white/60 text-sm transition-colors py-2 -ml-1 disabled:opacity-20">
            ← Back
          </button>

          {/* Progress dots */}
          <div className="flex items-center gap-1">
            {ALL_QUESTIONS.map((fq, i) => {
              const isSkippedDot = skipped.has(i);
              const isAnswered = hasAnswer(i);
              const isCurrent = i === currentIdx;
              const isCoach = !!fq.stage.isCoaching;
              return (
                <div key={i}>
                  {/* Separator before coaching section */}
                  {i === COACHING_START_IDX && <div className="w-2 border-t border-white/20 mx-1" />}
                  <div className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                    style={{
                      background: isSkippedDot ? "#f59e0b"
                        : isAnswered ? (isCoach ? "#0d9488" : stageColor)
                        : isCurrent ? "white"
                        : "rgba(255,255,255,0.12)"
                    }} />
                </div>
              );
            })}
          </div>

          <button onClick={() => navigate("/welcome-u9")} disabled={isSaving}
            className="text-white/30 hover:text-white/60 text-xs transition-colors py-2 -mr-1 disabled:opacity-30">
            Exit
          </button>
        </div>

        {/* Dual progress bars: player | coach */}
        <div className="flex gap-1 px-4 pb-2">
          <div className="flex-1 h-1 bg-white/8 rounded-full overflow-hidden">
            <motion.div className="h-full rounded-full" style={{ background: stageColor }}
              animate={{ width: isCoachingQ ? "100%" : `${playerProgressPct}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }} />
          </div>
          <div className="w-1" />
          <div className="flex-none w-16 h-1 bg-white/8 rounded-full overflow-hidden">
            <motion.div className="h-full rounded-full" style={{ background: "#0d9488" }}
              animate={{ width: `${coachProgressPct}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }} />
          </div>
        </div>
      </div>

      {/* ── Question body ── */}
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
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
                style={{ background: `${stageColor}25` }}>{stage.emoji}</div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest block" style={{ color: stageColor }}>
                  {stage.title}
                  {isCoachingQ && <span className="ml-2 px-1.5 py-0.5 rounded-md text-[9px] bg-[#0d9488]/20 text-[#0d9488] align-middle">COACH</span>}
                </span>
                {isCoachingQ && (
                  <span className="text-white/30 text-[10px]">Question {questionIndex + 1} of {stage.questions.length}</span>
                )}
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-4">
              {/* Question emoji + text */}
              {!isPhotoQ && (
                <>
                  <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }} className="text-5xl text-center">
                    {question.emoji}
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                    <p className="text-lg font-bold text-white text-center leading-relaxed mb-1">{question.text}</p>
                    <p className="text-white/35 text-sm text-center leading-relaxed">{question.hint}</p>
                  </motion.div>
                </>
              )}

              {/* ── PHOTO question ── */}
              {isPhotoQ && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className="flex flex-col gap-4">
                  <div className="text-center">
                    <div className="text-5xl mb-3">📸</div>
                    <p className="text-xl font-bold text-white mb-1">{question.text}</p>
                    <p className="text-white/40 text-sm leading-relaxed">{question.hint}</p>
                  </div>
                  <div className="rounded-2xl p-4" style={{ background: `${stageColor}15`, border: `1px solid ${stageColor}30` }}>
                    <MediaUploader
                      onMediaChange={paths => updateCurrent({ mediaUrls: paths })}
                      existingUrls={answers[currentIdx]?.mediaUrls}
                    />
                  </div>
                  {(answers[currentIdx]?.mediaUrls?.length ?? 0) > 0 && (
                    <div className="flex items-center justify-center gap-1.5" style={{ color: stageColor }}>
                      <CheckCircle2 size={14} />
                      <span className="text-xs font-bold">
                        {answers[currentIdx].mediaUrls!.length} photo{answers[currentIdx].mediaUrls!.length !== 1 ? "s" : ""} added ✓
                      </span>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ── SELECT / MULTISELECT ── */}
              {isSelectType && question.options && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                  {isMulti && (
                    <p className="text-white/30 text-xs text-center mb-3">
                      {selectedOpts.length > 0 ? `${selectedOpts.length} selected` : "Tap to select — choose as many as you like"}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {question.options.map(opt => (
                      <SelectChip key={opt} label={opt}
                        selected={selectedOpts.includes(opt)}
                        onToggle={() => toggleOption(currentIdx, opt, isMulti)}
                        color={stageColor}
                        multi={isMulti}
                      />
                    ))}
                  </div>
                  {selectedOpts.length > 0 && (
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center justify-center gap-1.5 mt-3" style={{ color: stageColor }}>
                      <CheckCircle2 size={14} /><span className="text-xs font-bold">Saved</span>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* ── VOICE-TEXT ── */}
              {question.type === "voice-text" && (
                <>
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
                    <textarea rows={3} placeholder="Write here if you like…"
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
                </>
              )}

              {/* ── COACHING-TEXT ── */}
              {question.type === "coaching-text" && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <textarea rows={4} placeholder="Type your notes here…"
                    value={answers[currentIdx]?.text ?? ""}
                    onChange={e => updateCurrent({ text: e.target.value })}
                    className="w-full bg-white/5 border border-[#0d9488]/30 focus:border-[#0d9488]/60 rounded-2xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none transition-colors resize-none leading-relaxed"
                  />
                  {answers[currentIdx]?.text?.trim() && (
                    <div className="flex items-center justify-center gap-1.5 mt-2" style={{ color: "#0d9488" }}>
                      <CheckCircle2 size={13} /><span className="text-xs font-bold">Saved</span>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Skip link — player questions only */}
              {!isCoachingQ && !isPhotoQ && !hasCurrentAnswer && !isCurrentSkipped && (
                <motion.button
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                  type="button" onClick={skipCurrent}
                  className="flex items-center justify-center gap-1.5 text-white/25 hover:text-amber-400/70 text-xs transition-colors mx-auto group"
                >
                  <SkipForward size={12} className="group-hover:text-amber-400/70" />
                  <span>Skip for now — answer later</span>
                </motion.button>
              )}

              {skipped.size > 0 && !isCoachingQ && (
                <p className="text-amber-400/40 text-[10px] text-center">
                  {skipped.size} skipped — you'll get a chance to answer before finishing
                </p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Next button ── */}
      <div className="fixed bottom-0 left-0 right-0 z-30 px-4 pb-6 pt-3"
        style={{ background: "linear-gradient(to top, #0a0a0a 70%, transparent)" }}>
        <div className="max-w-sm mx-auto">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={goNext}
            disabled={nextDisabled}
            className="w-full py-4 rounded-2xl font-black text-lg uppercase tracking-widest transition-all disabled:opacity-35 font-display"
            style={{ background: stageColor, color: isLight(stageColor) ? "#000" : "#fff", boxShadow: `0 8px 32px ${stageColor}55` }}
          >
            {isSaving ? "Saving…"
              : isLastMain ? (isCoachingQ ? "Finish Notes →" : "Finish My Story! 🎉")
              : isPlayerToCoachingTransition ? "Next: Coach Notes →"
              : "Next Question →"
            }
          </motion.button>
          {nextDisabled && !isSaving && !isPhotoQ && !isCoachTextQ && (
            <p className="text-white/30 text-[10px] text-center mt-2">
              {isSelectType ? "Pick at least one option" : "Answer or tap Skip below"}
            </p>
          )}
          {!nextDisabled && (
            <p className="text-white/20 text-[10px] text-center mt-2">
              Question {currentIdx + 1} of {TOTAL}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
