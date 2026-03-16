import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { SkipForward, CheckCircle2, Camera } from "lucide-react";
import { publicAssetUrl } from "@/lib/publicAssetUrl";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { MediaUploader } from "@/components/MediaUploader";
import { usePlayerContext } from "@/context/PlayerContext";
import { useAssistant } from "@/context/AssistantContext";
import { U9_PLAYER_STAGES, computeCharacterProfile } from "@/data/u9Questions";
import type { U9Question, U9Stage } from "@/data/u9Questions";
import { MindsetProfiler } from "@/components/MindsetProfiler";
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

const ALL_QUESTIONS: FlatQuestion[] = U9_PLAYER_STAGES.flatMap((stage, si) =>
  stage.questions.map((q, qi) => ({ stage, stageIndex: si, question: q, questionIndex: qi }))
);
const TOTAL = ALL_QUESTIONS.length;

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
        background: selected ? `${color}25` : "rgba(0,0,0,0.50)",
        borderColor: selected ? color : "rgba(255,255,255,0.20)",
        color: selected ? "white" : "rgba(255,255,255,0.92)",
        boxShadow: selected ? `0 0 12px ${color}30` : "none",
        backdropFilter: "blur(8px)",
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
  const stadiumImage = selectedAcademy?.stadiumImage ?? null;

  const [showProfiler, setShowProfiler] = useState(false);
  const [profilerDone, setProfilerDone] = useState(false);
  const [profilerResult, setProfilerResult] = useState("");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<AnswerEntry[]>(
    Array(TOTAL).fill(null).map(() => ({ text: "", audioUrl: null, audioBlob: null, mediaUrls: [] }))
  );
  const [skipped, setSkipped] = useState<Set<number>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [direction, setDirection] = useState(1);

  // Review mode (skipped questions)
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewIdx, setReviewIdx] = useState(0);

  const saveMutation = useSaveJourneyResponses();
  const completeMutation = useCompleteJourney();
  const { setActiveQuestion } = useAssistant();

  useEffect(() => { if (!playerData) navigate("/"); }, [playerData]);

  useEffect(() => {
    const entry = ALL_QUESTIONS[currentIdx];
    if (entry) {
      setActiveQuestion({
        text: entry.question.text,
        hint: entry.question.hint,
        prompts: entry.question.prompts,
        options: entry.question.options,
        type: entry.question.type,
        stageName: entry.stage.title,
      });
    }
    return () => { setActiveQuestion(null); };
  }, [currentIdx]);
  if (!playerData) return null;

  // ── MINDSET PROFILER ──────────────────────────────────────────────────────
  if (showProfiler) {
    return (
      <MindsetProfiler
        primaryColor={primaryColor}
        playerName={playerData.playerName}
        onComplete={(result) => {
          setProfilerResult(result);
          setProfilerDone(true);
          setShowProfiler(false);
          enterReviewOrComplete();
        }}
      />
    );
  }

  const { stage, stageIndex, question, questionIndex } = ALL_QUESTIONS[currentIdx];
  const stageColor = stage.colour;
  const isLastQuestion = currentIdx === TOTAL - 1;

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
    if (q.type === "select" || q.type === "multiselect")
      return getSelected(idx).length > 0;
    return !!(a?.text?.trim() || a?.audioUrl);
  };

  const canAdvance = () => {
    const q = ALL_QUESTIONS[currentIdx]?.question;
    if (!q) return true;
    if (q.type === "photo") return true;
    return hasAnswer(currentIdx) || skipped.has(currentIdx);
  };

  // ── Navigation ─────────────────────────────────────────────────────
  const skipCurrent = () => {
    setSkipped(prev => new Set([...prev, currentIdx]));
    if (isLastQuestion) {
      if (!profilerDone) { setShowProfiler(true); } else { enterReviewOrComplete(); }
      return;
    }
    setDirection(1);
    setCurrentIdx(i => i + 1);
  };

  const goNext = () => {
    if (!canAdvance()) return;
    if (isLastQuestion) {
      if (!profilerDone) { setShowProfiler(true); } else { enterReviewOrComplete(); }
      return;
    }
    setDirection(1);
    setCurrentIdx(i => i + 1);
  };

  const goBack = () => {
    if (reviewMode) {
      if (reviewIdx > 0) setReviewIdx(i => i - 1);
      else setReviewMode(false);
      return;
    }
    if (currentIdx > 0) {
      setDirection(-1);
      setCurrentIdx(i => i - 1);
    }
  };

  function getSkippedList() {
    return ALL_QUESTIONS
      .map((q, idx) => ({ ...q, idx }))
      .filter(({ idx }) => skipped.has(idx));
  }

  function enterReviewOrComplete() {
    const skippedList = getSkippedList();
    if (skippedList.length > 0) {
      setReviewMode(true);
      setReviewIdx(0);
    } else {
      finishJourney();
    }
  }

  const finishJourney = async () => {
    setIsSaving(true);

    for (let si = 0; si < U9_PLAYER_STAGES.length; si++) {
      const s = U9_PLAYER_STAGES[si];
      const stageAnswers = s.questions.map((_, qi) => {
        const flatIdx = U9_PLAYER_STAGES.slice(0, si).reduce((acc, prev) => acc + prev.questions.length, 0) + qi;
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
      ...U9_PLAYER_STAGES.flatMap((s, si) =>
        s.questions.map((q, qi) => {
          const flatIdx = U9_PLAYER_STAGES.slice(0, si).reduce((acc, prev) => acc + prev.questions.length, 0) + qi;
          const a = answers[flatIdx];
          const rawText = a?.text ?? "";
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
      // Append character profile summation
      {
        stage: "Character Profile",
        questionNumber: TOTAL + 1,
        questionText: "Automated Character Profile Summation",
        answerText: profileText,
        audioUrl: null,
        mediaUrls: [],
      },
      // Append mindset profiler results if present
      ...(profilerResult ? [{
        stage: "Player Mindset DNA",
        questionNumber: TOTAL + 2,
        questionText: "Automated Player Mindset Profiler Results",
        answerText: profilerResult,
        audioUrl: null,
        mediaUrls: [],
      }] : []),
    ];

    try {
      await saveMutation.mutateAsync({ playerId: playerData.id, data: { responses } });
      await completeMutation.mutateAsync({ playerId: playerData.id });
      navigate("/invite");
    } catch (err) { console.error("Save error", err); }
    finally { setIsSaving(false); }
  };

  // ── REVIEW MODE ────────────────────────────────────────────────────
  if (reviewMode) {
    const skippedList = getSkippedList();
    const currentReview = skippedList[reviewIdx];
    if (!currentReview) { finishJourney(); return null; }
    const rStageColor = currentReview.stage.colour;
    const isLastReview = reviewIdx === skippedList.length - 1;

    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <img
            src={stadiumImage ? publicAssetUrl(stadiumImage) : publicAssetUrl("images/hero-bg.png")}
            alt=""
            className="w-full h-full object-cover"
            style={stadiumImage ? { opacity: 0.65, filter: "brightness(0.6) saturate(0.75)" } : { opacity: 0.1 }}
          />
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, rgba(10,10,10,0.22) 0%, rgba(10,10,10,0.45) 50%, rgba(10,10,10,0.80) 100%)" }} />
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
                <div className="mb-3 flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 border border-white/10 mx-auto">
                  <SkipForward size={26} className="text-white/50" />
                </div>
                <h2 className="text-xl font-display font-black text-white">One you skipped!</h2>
                <p className="text-white/40 text-sm mt-1">Have a go now if you can</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs text-white"
                  style={{ background: `${rStageColor}25` }}>{currentReview.stageIndex + 1}</div>
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
                      onTranscript={(text) => setAnswers(prev => {
                        const updated = [...prev];
                        const current = (updated[currentReview.idx]?.text ?? "").trim();
                        updated[currentReview.idx] = { ...updated[currentReview.idx], text: current ? `${current}\n${text}` : text };
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
                    onFocus={e => setTimeout(() => e.target.scrollIntoView({ behavior: "smooth", block: "center" }), 350)}
                    className="w-full bg-black/50 border border-white/22 rounded-2xl px-4 py-3 text-white text-sm placeholder:text-white/45 focus:outline-none focus:border-white/40 backdrop-blur-sm transition-colors resize-none"
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
  const isSelectType = question.type === "select" || question.type === "multiselect";
  const isMulti = question.type === "multiselect";
  const selectedOpts = getSelected(currentIdx);
  const nextDisabled = !canAdvance() || isSaving;
  const progressPct = (currentIdx / TOTAL) * 100;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src={stadiumImage ? publicAssetUrl(stadiumImage) : publicAssetUrl("images/hero-bg.png")}
          alt=""
          className="w-full h-full object-cover"
          style={stadiumImage ? { opacity: 0.65, filter: "brightness(0.6) saturate(0.75)" } : { opacity: 0.1 }}
        />
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(10,10,10,0.22) 0%, rgba(10,10,10,0.45) 50%, rgba(10,10,10,0.80) 100%)" }} />
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
            {ALL_QUESTIONS.map((_, i) => {
              const isSkippedDot = skipped.has(i);
              const isAnswered = hasAnswer(i);
              const isCurrent = i === currentIdx;
              return (
                <div key={i} className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                  style={{
                    background: isSkippedDot ? "#f59e0b"
                      : isAnswered ? stageColor
                      : isCurrent ? "white"
                      : "rgba(255,255,255,0.12)"
                  }} />
              );
            })}
          </div>

          <button onClick={() => navigate("/welcome-u9")} disabled={isSaving}
            className="text-white/30 hover:text-white/60 text-xs transition-colors py-2 -mr-1 disabled:opacity-30">
            Exit
          </button>
        </div>

        {/* Progress bar */}
        <div className="px-4 pb-2">
          <div className="h-1 bg-white/8 rounded-full overflow-hidden">
            <motion.div className="h-full rounded-full" style={{ background: stageColor }}
              animate={{ width: `${progressPct}%` }}
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
              <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs text-white"
                style={{ background: `${stageColor}25` }}>{stageIndex + 1}</div>
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: stageColor }}>
                {stage.title}
              </span>
            </div>

            <div className="flex-1 flex flex-col gap-4">
              {/* Question indicator + text */}
              {!isPhotoQ && (
                <>
                  {/* Pulsing level badge */}
                  <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                    className="flex flex-col items-center gap-1.5">
                    <div className="relative flex items-center justify-center w-12 h-12">
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{ border: `1.5px solid ${stageColor}` }}
                        animate={{ scale: [1, 1.25, 1], opacity: [0.45, 0, 0.45] }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                      />
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ background: `${stageColor}20`, border: `1.5px solid ${stageColor}50` }}
                      >
                        <span className="font-display font-black text-white text-base leading-none">{questionIndex + 1}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: stageColor }}>
                      Q {currentIdx + 1} / {TOTAL}
                    </span>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30 text-center mb-2">◆ Your challenge</p>
                    <p className="text-[1.38rem] font-display font-bold text-white text-center leading-[1.3] mb-2">{question.text}</p>
                    <p className="text-white/65 text-sm text-center leading-relaxed">{question.hint}</p>
                  </motion.div>
                </>
              )}

              {/* ── PHOTO question ── */}
              {isPhotoQ && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className="flex flex-col gap-4">
                  <div className="text-center">
                    <div className="mb-3 flex items-center justify-center w-14 h-14 rounded-2xl mx-auto" style={{ background: `${stageColor}15`, border: `1px solid ${stageColor}30` }}>
                      <Camera size={26} style={{ color: stageColor }} strokeWidth={1.5} />
                    </div>
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
                      onTranscript={(text) => {
                        const current = (answers[currentIdx]?.text ?? "").trim();
                        updateCurrent({ text: current ? `${current}\n${text}` : text });
                      }}
                      existingUrl={answers[currentIdx]?.audioUrl}
                    />
                  </motion.div>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                    <p className="text-white/30 text-xs text-center mb-2">or type your answer</p>
                    <textarea rows={3} placeholder="Write here if you like…"
                      value={answers[currentIdx]?.text ?? ""}
                      onChange={e => updateCurrent({ text: e.target.value })}
                      onFocus={e => setTimeout(() => e.target.scrollIntoView({ behavior: "smooth", block: "center" }), 350)}
                      className="w-full bg-black/50 border border-white/22 rounded-2xl px-4 py-3 text-white text-sm placeholder:text-white/45 focus:outline-none focus:border-white/40 backdrop-blur-sm transition-colors resize-none leading-relaxed"
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

              {/* Skip link */}
              {!isPhotoQ && !hasCurrentAnswer && !isCurrentSkipped && (
                <motion.button
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                  type="button" onClick={skipCurrent}
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
              : isLastQuestion ? "Finish My Story! 🎉"
              : "Next Question →"
            }
          </motion.button>
          {nextDisabled && !isSaving && !isPhotoQ && (
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
