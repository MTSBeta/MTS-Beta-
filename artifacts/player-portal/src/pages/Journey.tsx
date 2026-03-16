import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { ChevronLeft, SkipForward, Mic } from "lucide-react";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { MediaUploader } from "@/components/MediaUploader";
import { usePlayerContext } from "@/context/PlayerContext";
import { useSoundEnabled } from "@/context/SoundContext";
import { useSoundSystem } from "@/hooks/useSoundSystem";
import { PLAYER_STAGES, computeCharacterProfile } from "@/data/questions";
import type { JourneyQuestion } from "@/data/questions";
import { POSITIONS } from "@/data/positions";
import { selectPositionQuestions } from "@/utils/questionSelector";
import { useSaveJourneyResponses, useCompleteJourney } from "@workspace/api-client-react";
import type { AnswerEntry } from "@/context/PlayerContext";

// ── Helpers ──────────────────────────────────────────────────────────────────

function isLight(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 160;
}

function toggleOption(current: string, option: string, isMulti: boolean): string {
  if (!isMulti) return option;
  const opts = current ? current.split("|||") : [];
  const idx = opts.indexOf(option);
  if (idx === -1) return [...opts, option].join("|||");
  return opts.filter((_, i) => i !== idx).join("|||");
}

function selectedOptions(text: string): string[] {
  return text ? text.split("|||") : [];
}

type ReviewEntry = { text: string; audioUrl: string | null; audioBlob: Blob | null };

// ── Prompt chips ─────────────────────────────────────────────────────────────

function PromptChips({ prompts, color }: { prompts: string[]; color: string }) {
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {prompts.map((p, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border"
          style={{
            background: `${color}1c`,
            borderColor: `${color}50`,
            color: "rgba(255,255,255,0.80)",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: color, opacity: 0.8 }} />
          {p}
        </span>
      ))}
    </div>
  );
}

// ── Select chip ──────────────────────────────────────────────────────────────

function SelectChip({ label, selected, onClick, color, isCoaching }: {
  label: string; selected: boolean; onClick: () => void; color: string; isCoaching?: boolean;
}) {
  const soundCtx = useSoundEnabled();
  const sound = useSoundSystem({ enabled: soundCtx.enabled });
  const accent = isCoaching ? "#0d9488" : color;

  const handleClick = () => {
    try { if (soundCtx.enabled) sound.play(selected ? "click" : "select"); } catch {}
    onClick();
  };

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.94 }}
      onClick={handleClick}
      className="px-4 py-3.5 rounded-2xl text-sm font-semibold border transition-all text-left min-h-[52px] flex items-center gap-2 backdrop-blur-sm"
      style={
        selected
          ? { background: accent, borderColor: accent, color: isLight(accent) ? "#000" : "#fff" }
          : { background: "rgba(0,0,0,0.50)", borderColor: "rgba(255,255,255,0.20)", color: "rgba(255,255,255,0.92)" }
      }
    >
      {selected && (
        <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(0,0,0,0.2)" }}>
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      )}
      {label}
    </motion.button>
  );
}

// ── Stage intro card ─────────────────────────────────────────────────────────

function StageIntro({ stage, color, onBegin, stageNum, totalStages }: {
  stage: { emoji: string; title: string; subtitle: string };
  color: string;
  onBegin: () => void;
  stageNum: number;
  totalStages: number;
}) {
  const btnText = isLight(color) ? "#000" : "#fff";
  return (
    <motion.div
      key="stage-intro"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center min-h-screen px-8 text-center"
    >
      {/* Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 100%, ${color}25 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6 max-w-sm">
        <p className="text-white/30 text-xs font-bold uppercase tracking-widest font-display">
          Chapter {stageNum} of {totalStages}
        </p>

        <div
          className="w-24 h-24 rounded-3xl flex flex-col items-center justify-center shadow-2xl gap-0.5"
          style={{ background: `${color}15`, border: `1px solid ${color}30` }}
        >
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em]" style={{ color: `${color}80` }}>CH</span>
          <span className="text-4xl font-display font-black text-white leading-none">{String(stageNum).padStart(2, "0")}</span>
        </div>

        <div>
          <h1 className="text-4xl font-display font-black text-white uppercase tracking-tight mb-3 leading-none">
            {stage.title}
          </h1>
          <p className="text-white/50 text-base leading-relaxed">{stage.subtitle}</p>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onBegin}
          className="w-full py-4 rounded-2xl font-display font-black text-sm uppercase tracking-widest mt-2"
          style={{ background: color, color: btnText, boxShadow: `0 8px 40px ${color}50` }}
        >
          Begin →
        </motion.button>
      </div>
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function Journey() {
  const [_, navigate] = useLocation();
  const { playerData, selectedAcademy, journeyAnswers, saveJourneyStage } = usePlayerContext();
  const { enabled: soundEnabled } = useSoundEnabled();
  const sound = useSoundSystem({ enabled: soundEnabled });

  const [currentStep, setCurrentStep] = useState(0);
  const [currentQI, setCurrentQI] = useState(0);
  const [showStageIntro, setShowStageIntro] = useState(true);
  const [qDir, setQDir] = useState(1); // 1=forward, -1=backward

  const playerPosition = playerData?.position ?? "";
  const playerSecondPosition = playerData?.secondPosition ?? null;

  // Resolve human-readable position labels for display
  const primaryPosLabel =
    POSITIONS.find(p => p.id === playerPosition)?.displayName ?? playerPosition;
  const secondaryPosLabel = playerSecondPosition
    ? (POSITIONS.find(p => p.id === playerSecondPosition)?.displayName ?? playerSecondPosition)
    : undefined;

  const activeStages = PLAYER_STAGES.map(s => {
    // ── "Your Football Mind" uses the full blending selector ──────────────
    if (s.id === "Your Football Mind") {
      const blendedQs = selectPositionQuestions(s.questions, {
        primaryPosition: playerPosition,
        secondaryPosition: playerSecondPosition,
        primaryLabel: primaryPosLabel,
        secondaryLabel: secondaryPosLabel,
      });
      return { ...s, questions: blendedQs };
    }

    // ── All other stages: standard filtering ──────────────────────────────
    return {
      ...s,
      questions: s.questions.filter(q => {
        if (q.requiresSecondPosition && !playerData?.secondPosition) return false;
        if (q.positionIds && !q.positionIds.includes(playerPosition)) return false;
        return true;
      }),
    };
  });

  const stage = activeStages[currentStep];
  const qCount = stage.questions.length;
  const totalStages = activeStages.length;
  const primaryColor = selectedAcademy?.primaryColor ?? "#6d28d9";
  const btnText = isLight(primaryColor) ? "#000" : "#fff";

  // Global question counters
  const totalQ = activeStages.reduce((acc, s) => acc + s.questions.length, 0);
  const doneQ = activeStages.slice(0, currentStep).reduce((acc, s) => acc + s.questions.length, 0) + currentQI + 1;

  const [localAnswers, setLocalAnswers] = useState<AnswerEntry[]>(
    Array(qCount).fill(null).map(() => ({ text: "", audioUrl: null, audioBlob: null, mediaUrls: [] }))
  );
  const [qError, setQError] = useState(false);
  const [followUpAnswer, setFollowUpAnswer] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [reviewAnswers, setReviewAnswers] = useState<Record<string, ReviewEntry>>({});
  const [skippedSet, setSkippedSet] = useState<Set<string>>(new Set());
  const reviewScrollRef = useRef<HTMLDivElement>(null);

  // Reset follow-up answer whenever the question changes
  useEffect(() => { setFollowUpAnswer(""); }, [currentQI, currentStep]);

  const saveMutation = useSaveJourneyResponses();
  const completeMutation = useCompleteJourney();

  useEffect(() => { if (!playerData) navigate("/"); }, [playerData]);

  // Load saved answers when stage changes
  useEffect(() => {
    if (showReview) return;
    const saved = journeyAnswers[stage.id];
    setLocalAnswers(
      saved
        ? (saved as AnswerEntry[])
        : Array(stage.questions.length).fill(null).map(() => ({ text: "", audioUrl: null, audioBlob: null, mediaUrls: [] }))
    );
    setQError(false);
  }, [currentStep, showReview]);

  const skipKey = (stageId: string, qi: number) => `${stageId}__${qi}`;
  const isSkipped = (stageId: string, qi: number) => skippedSet.has(skipKey(stageId, qi));
  const totalSkippedCount = skippedSet.size;

  const currentQuestion = stage.questions[currentQI];
  const currentAnswer = localAnswers[currentQI] ?? { text: "", audioUrl: null, audioBlob: null, mediaUrls: [] };
  const isSkippedCurrent = isSkipped(stage.id, currentQI);

  const updateCurrentAnswer = (patch: Partial<AnswerEntry>) => {
    setLocalAnswers(prev => {
      const updated = [...prev];
      updated[currentQI] = { ...updated[currentQI], ...patch };
      return updated;
    });
    setQError(false);
  };

  const markCurrentSkipped = () => {
    setSkippedSet(prev => new Set([...prev, skipKey(stage.id, currentQI)]));
    setLocalAnswers(prev => {
      const updated = [...prev];
      updated[currentQI] = { text: "", audioUrl: null, audioBlob: null, mediaUrls: [] };
      return updated;
    });
    setQError(false);
  };

  const unmarkSkipped = (stageId: string, qi: number) => {
    setSkippedSet(prev => { const s = new Set(prev); s.delete(skipKey(stageId, qi)); return s; });
  };

  const buildResponses = (overrides: Record<string, ReviewEntry> = {}) => {
    const all = { ...journeyAnswers, [stage.id]: localAnswers };
    let runningNum = 0;
    const responses: {
      stage: string; questionNumber: number; questionText: string;
      answerText: string; audioUrl: string | null; mediaUrls: string[];
    }[] = [];
    for (const s of activeStages) {
      const stageAnswers = all[s.id] ?? [];
      for (let qi = 0; qi < s.questions.length; qi++) {
        runningNum++;
        const q = s.questions[qi];
        const key = skipKey(s.id, qi);
        const override = overrides[key];
        const base = (stageAnswers[qi] as AnswerEntry) ?? { text: "", audioUrl: null, mediaUrls: [] };
        responses.push({
          stage: s.id,
          questionNumber: runningNum,
          questionText: q.text,
          answerText: override?.text ?? base.text,
          audioUrl: override?.audioUrl ?? base.audioUrl ?? null,
          mediaUrls: base.mediaUrls ?? [],
        });
      }
    }
    return responses;
  };

  const completeJourney = async (overrides: Record<string, ReviewEntry>) => {
    setIsSaving(true);
    try {
      const responses = buildResponses(overrides);
      const allAnswersByStage = { ...journeyAnswers, [stage.id]: localAnswers };
      const profileSummation = computeCharacterProfile(allAnswersByStage as Record<string, { text: string }[]>);
      if (profileSummation) {
        responses.push({
          stage: "Character Profile",
          questionNumber: responses.length + 1,
          questionText: "Auto-generated character profile summation",
          answerText: profileSummation,
          audioUrl: null,
          mediaUrls: [],
        });
      }
      await saveMutation.mutateAsync({ playerId: playerData!.id, data: { responses } });
      await completeMutation.mutateAsync({ playerId: playerData!.id });
      navigate("/invite");
    } catch (err) { console.error("Complete error", err); }
    finally { setIsSaving(false); }
  };

  const goForward = async () => {
    const q = currentQuestion;
    const qType = q.type ?? "voice-text";

    // Build effective answers array — merge follow-up text into current answer if present
    const activeFollowUpBranch = q.followUps?.find(f => f.triggerOption === currentAnswer.text);
    let effectiveAnswers = localAnswers;
    if (activeFollowUpBranch && followUpAnswer.trim()) {
      const merged = `${currentAnswer.text}\n---\n${activeFollowUpBranch.question}\n${followUpAnswer.trim()}`;
      effectiveAnswers = [...localAnswers];
      effectiveAnswers[currentQI] = { ...currentAnswer, text: merged };
      setLocalAnswers(effectiveAnswers);
    }
    const answer = effectiveAnswers[currentQI] ?? { text: "", audioUrl: null, audioBlob: null, mediaUrls: [] };

    if (!isSkippedCurrent) {
      const isSelectType = qType === "select" || qType === "multiselect";
      const isEmpty = isSelectType
        ? !answer.text.trim()
        : !answer.text.trim() && !answer.audioUrl;
      if (isEmpty) { setQError(true); return; }
    }
    setQError(false);

    const isLastQ = currentQI === qCount - 1;
    const isLastS = currentStep === totalStages - 1;

    if (!isLastQ) {
      setQDir(1);
      setCurrentQI(qi => qi + 1);
    } else {
      saveJourneyStage(stage.id, effectiveAnswers);
      if (!isLastS) {
        setIsSaving(true);
        const allAnswers = { ...journeyAnswers, [stage.id]: effectiveAnswers };
        let runningNum = 0;
        const responses: { stage: string; questionNumber: number; questionText: string; answerText: string; audioUrl: string | null; mediaUrls: string[] }[] = [];
        for (let si = 0; si <= currentStep; si++) {
          const s = activeStages[si];
          const stageAnswers = allAnswers[s.id] ?? [];
          for (let qi2 = 0; qi2 < s.questions.length; qi2++) {
            runningNum++;
            responses.push({
              stage: s.id, questionNumber: runningNum, questionText: s.questions[qi2].text,
              answerText: (stageAnswers[qi2] as AnswerEntry)?.text ?? "",
              audioUrl: (stageAnswers[qi2] as AnswerEntry)?.audioUrl ?? null,
              mediaUrls: (stageAnswers[qi2] as AnswerEntry)?.mediaUrls ?? [],
            });
          }
        }
        try {
          await saveMutation.mutateAsync({ playerId: playerData!.id, data: { responses } });
          setQDir(1);
          setCurrentStep(s => s + 1);
          setCurrentQI(0);
          setShowStageIntro(true);
        } catch (err) { console.error("Save error", err); }
        finally { setIsSaving(false); }
      } else {
        if (totalSkippedCount > 0) {
          setShowReview(true);
        } else {
          await completeJourney({});
        }
      }
    }
  };

  const goBack = () => {
    if (showReview) { setShowReview(false); return; }
    if (showStageIntro) {
      if (currentStep > 0) {
        const prevQCount = activeStages[currentStep - 1].questions.length;
        saveJourneyStage(stage.id, localAnswers);
        setQDir(-1);
        setCurrentStep(s => s - 1);
        setCurrentQI(prevQCount - 1);
        setShowStageIntro(false);
      } else {
        saveAndExit();
      }
      return;
    }
    if (currentQI > 0) {
      setQDir(-1);
      setCurrentQI(qi => qi - 1);
      setQError(false);
    } else if (currentStep > 0) {
      setShowStageIntro(true);
      setQError(false);
    } else {
      saveAndExit();
    }
  };

  const saveAndExit = async () => {
    saveJourneyStage(stage.id, localAnswers);
    if (playerData && (currentStep > 0 || currentQI > 0)) {
      const allAnswers = { ...journeyAnswers, [stage.id]: localAnswers };
      let runningNum = 0;
      const responses: any[] = [];
      for (let si = 0; si < currentStep; si++) {
        const s = activeStages[si];
        const stageAnswers = allAnswers[s.id] ?? [];
        for (let qi = 0; qi < s.questions.length; qi++) {
          runningNum++;
          responses.push({
            stage: s.id, questionNumber: runningNum, questionText: s.questions[qi].text,
            answerText: (stageAnswers[qi] as AnswerEntry)?.text ?? "",
            audioUrl: (stageAnswers[qi] as AnswerEntry)?.audioUrl ?? null,
            mediaUrls: (stageAnswers[qi] as AnswerEntry)?.mediaUrls ?? [],
          });
        }
      }
      try { await saveMutation.mutateAsync({ playerId: playerData.id, data: { responses } }); } catch {}
    }
    navigate("/welcome");
  };

  if (!playerData) return null;

  const allSkipped = activeStages.flatMap((s, si) =>
    s.questions.map((q, qi) => ({ s, si, q, qi, key: skipKey(s.id, qi) }))
      .filter(({ key }) => skippedSet.has(key))
  );

  // ══ REVIEW SCREEN ══════════════════════════════════════════════════════════
  if (showReview) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          {selectedAcademy?.stadiumImage ? (
            <img
              src={`${import.meta.env.BASE_URL}${selectedAcademy.stadiumImage}`}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ opacity: 0.65, filter: "brightness(0.6) saturate(0.75)" }}
            />
          ) : (
            <img src={`${import.meta.env.BASE_URL}images/hero-bg.png`} alt=""
              className="w-full h-full object-cover opacity-10 mix-blend-overlay" />
          )}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, rgba(10,10,10,0.22) 0%, rgba(10,10,10,0.45) 50%, rgba(10,10,10,0.80) 100%)" }}
          />
          <div
            className="absolute inset-0"
            style={{ background: `radial-gradient(ellipse 70% 50% at 50% 100%, ${primaryColor}22 0%, transparent 70%)` }}
          />
        </div>
        <div className="sticky top-0 z-30 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/6">
          <div className="flex items-center justify-between px-4 h-12">
            <button onClick={() => setShowReview(false)}
              className="flex items-center gap-1 text-white/40 hover:text-white/70 text-sm transition-colors min-h-[44px] px-1 -ml-1">
              <ChevronLeft size={18} />Back
            </button>
            <span className="text-white/40 text-xs font-bold uppercase tracking-widest">
              {allSkipped.length} skipped
            </span>
            <div className="w-14" />
          </div>
        </div>
        <div ref={reviewScrollRef} className="relative z-10 flex-1 overflow-y-auto pb-36">
          <div className="max-w-xl mx-auto px-4 pt-8 space-y-6">
            <div className="text-center">
              <div className="mb-4 flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 border border-white/10 mx-auto">
                <SkipForward size={26} className="text-white/50" />
              </div>
              <h1 className="text-2xl font-display font-black text-white mb-2">Almost there!</h1>
              <p className="text-white/50 text-sm leading-relaxed max-w-xs mx-auto">
                You skipped {allSkipped.length} question{allSkipped.length !== 1 ? "s" : ""}. Answer them now, or finish and we'll build your story from everything you've shared.
              </p>
            </div>
            {allSkipped.map(({ s, si, q, qi, key }) => {
              const ra = reviewAnswers[key] ?? { text: "", audioUrl: null, audioBlob: null };
              const hasReviewAnswer = !!(ra.text.trim() || ra.audioUrl);
              return (
                <motion.div key={key} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl p-5 space-y-4"
                  style={{
                    background: hasReviewAnswer ? `${primaryColor}12` : "rgba(255,255,255,0.04)",
                    border: hasReviewAnswer ? `1px solid ${primaryColor}35` : "1px solid rgba(255,255,255,0.08)"
                  }}>
                  <div className="flex items-center gap-2">
                    <span className="text-white/35 text-xs font-bold uppercase tracking-widest">{s.title}</span>
                    {hasReviewAnswer && (
                      <span className="ml-auto text-xs font-bold" style={{ color: primaryColor }}>✓ Answered</span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-white leading-relaxed">{q.text}</p>
                  {q.prompts && q.prompts.length > 0 && <PromptChips prompts={q.prompts} color={primaryColor} />}
                  <textarea
                    rows={3}
                    placeholder="Write your answer here…"
                    value={ra.text}
                    onChange={e => setReviewAnswers(prev => ({ ...prev, [key]: { ...ra, text: e.target.value } }))}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-base placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors resize-none"
                  />
                  <VoiceRecorder
                    onAudioReady={(blob, url) => setReviewAnswers(prev => ({ ...prev, [key]: { ...ra, audioBlob: blob ?? null, audioUrl: url } }))}
                    onTranscript={(text) => setReviewAnswers(prev => {
                      const cur = (prev[key]?.text ?? "").trim();
                      return { ...prev, [key]: { ...prev[key], text: cur ? `${cur}\n${text}` : text } };
                    })}
                    existingUrl={ra.audioUrl}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 z-30 px-4 pt-3"
          style={{ background: "linear-gradient(to top, #0a0a0a 70%, transparent)", paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}>
          <div className="max-w-xl mx-auto">
            <motion.button whileTap={{ scale: 0.97 }}
              onClick={() => completeJourney(reviewAnswers)}
              disabled={isSaving}
              className="w-full py-4 rounded-2xl font-black text-base uppercase tracking-widest disabled:opacity-50 font-display"
              style={{ background: primaryColor, color: btnText, boxShadow: `0 8px 32px ${primaryColor}55` }}>
              {isSaving ? "Saving…" : "Complete My Journey →"}
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  // ══ STAGE INTRO ════════════════════════════════════════════════════════════
  if (showStageIntro) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          {selectedAcademy?.stadiumImage ? (
            <img
              src={`${import.meta.env.BASE_URL}${selectedAcademy.stadiumImage}`}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ opacity: 0.65, filter: "brightness(0.6) saturate(0.75)" }}
            />
          ) : (
            <img src={`${import.meta.env.BASE_URL}images/hero-bg.png`} alt=""
              className="w-full h-full object-cover opacity-10 mix-blend-overlay" />
          )}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, rgba(10,10,10,0.22) 0%, rgba(10,10,10,0.45) 50%, rgba(10,10,10,0.80) 100%)" }}
          />
          <div
            className="absolute inset-0"
            style={{ background: `radial-gradient(ellipse 80% 55% at 50% 100%, ${primaryColor}22 0%, transparent 70%)` }}
          />
        </div>

        {/* back button */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center px-4 h-14">
          <button
            onClick={goBack}
            className="flex items-center gap-1 text-white/40 hover:text-white/70 text-sm transition-colors min-h-[44px]"
          >
            <ChevronLeft size={18} />
            {currentStep === 0 ? "Exit" : "Back"}
          </button>
        </div>

        <StageIntro
          stage={stage}
          color={primaryColor}
          stageNum={currentStep + 1}
          totalStages={totalStages}
          onBegin={() => setShowStageIntro(false)}
        />
      </div>
    );
  }

  // ══ SINGLE QUESTION VIEW ═══════════════════════════════════════════════════

  const qType = currentQuestion.type ?? "voice-text";
  const isCoachingQ = qType === "staff-text" || qType === "staff-multiselect";
  const isSelect = qType === "select";
  const isMultiselect = qType === "multiselect" || qType === "staff-multiselect";
  const isSelectType = isSelect || isMultiselect;
  const isVoiceText = qType === "voice-text" || qType === "staff-text";
  const accentColor = isCoachingQ ? "#0d9488" : primaryColor;
  const selected = selectedOptions(currentAnswer.text);
  const answered = isSelectType
    ? currentAnswer.text.trim() !== ""
    : !!(currentAnswer.text.trim() || currentAnswer.audioUrl);

  // Active follow-up branch for single-select questions
  const activeFollowUp = isSelect
    ? (currentQuestion.followUps?.find(f => f.triggerOption === currentAnswer.text) ?? null)
    : null;

  // Global progress %
  const progressPct = ((doneQ - 1) / totalQ) * 100;

  const isLastQ = currentQI === qCount - 1;
  const isLastS = currentStep === totalStages - 1;
  const isVeryLast = isLastQ && isLastS;

  const slideVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Stadium image */}
        {selectedAcademy?.stadiumImage ? (
          <img
            src={`${import.meta.env.BASE_URL}${selectedAcademy.stadiumImage}`}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: 0.65, filter: "brightness(0.6) saturate(0.75)" }}
          />
        ) : (
          <img
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
            alt=""
            className="w-full h-full object-cover opacity-10 mix-blend-overlay"
          />
        )}

        {/* Dark vignette — keeps text legible over the stadium */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(10,10,10,0.22) 0%, rgba(10,10,10,0.45) 50%, rgba(10,10,10,0.80) 100%)",
          }}
        />

        {/* Club colour ambient glow */}
        <div
          className="absolute inset-0 transition-all duration-700"
          style={{
            background: `radial-gradient(ellipse 80% 55% at 50% 100%, ${accentColor}22 0%, transparent 70%)`,
          }}
        />
      </div>

      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 h-12">
          <button
            onClick={goBack}
            disabled={isSaving}
            className="flex items-center gap-1 text-white/40 hover:text-white/70 text-sm transition-colors min-h-[44px] px-1 -ml-1 disabled:opacity-30"
          >
            <ChevronLeft size={18} />
            Back
          </button>

          <div className="flex items-center gap-2">
            <span className="text-white/25 text-xs font-mono tabular-nums">
              {doneQ}
            </span>
            <span className="text-white/15 text-xs">/</span>
            <span className="text-white/20 text-xs font-mono tabular-nums">{totalQ}</span>
          </div>

          <button
            onClick={saveAndExit}
            disabled={isSaving}
            className="text-white/30 hover:text-white/60 text-sm transition-colors min-h-[44px] px-1 -mr-1 disabled:opacity-30"
          >
            Exit
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-[3px] bg-white/6 mx-0">
          <motion.div
            className="h-full rounded-full"
            style={{ background: accentColor }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Question body */}
      <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
        <AnimatePresence mode="wait" custom={qDir}>
          <motion.div
            key={`${currentStep}-${currentQI}`}
            custom={qDir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex-1 flex flex-col px-5 pt-6 pb-4 max-w-xl mx-auto w-full"
          >
            {/* Stage + question badge */}
            <div className="flex items-center flex-wrap gap-2 mb-5">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
                style={{ background: `${accentColor}20`, color: accentColor }}
              >
                {stage.title}
              </span>
              {/* Position label — shown on Football Mind questions */}
              {currentQuestion.positionLabel && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide bg-white/8 text-white/55 border border-white/10">
                  {currentQuestion.positionLabel}
                </span>
              )}
              {isCoachingQ && (
                <span className="px-2 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-teal-500/15 text-teal-400">
                  Coach section
                </span>
              )}
              {isSkippedCurrent && (
                <span className="px-2 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-amber-500/15 text-amber-400">
                  Skipped
                </span>
              )}
            </div>

            {/* Question indicator */}
            <div className="mb-5 flex items-center gap-3">
              {/* Pulsing circular level badge */}
              <div className="relative flex items-center justify-center shrink-0 w-12 h-12">
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ border: `1.5px solid ${accentColor}` }}
                  animate={{ scale: [1, 1.25, 1], opacity: [0.45, 0, 0.45] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                />
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: `${accentColor}20`, border: `1.5px solid ${accentColor}50` }}
                >
                  <span className="font-display font-black text-white text-base leading-none">{currentQI + 1}</span>
                </div>
              </div>
              {/* Progress bar + labels */}
              <div className="flex-1 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: accentColor }}>
                    Question {currentQI + 1} of {qCount}
                  </span>
                  {currentQI > 0 && (
                    <span className="text-[10px] font-mono text-white/28">
                      {Math.round((currentQI / qCount) * 100)}% done
                    </span>
                  )}
                </div>
                <div className="h-[3px] rounded-full bg-white/8 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${((currentQI + 1) / qCount) * 100}%`, background: accentColor }}
                  />
                </div>
              </div>
            </div>

            {/* Question text */}
            <div className="mb-5">
              {/* Gamification micro-label */}
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/35">◆ Your challenge</span>
              </div>
              <p className="text-[1.52rem] font-display font-bold text-white leading-[1.32] mb-3">
                {currentQuestion.text}
              </p>
              {currentQuestion.hint && (
                <p className="text-white/65 text-sm leading-relaxed">{currentQuestion.hint}</p>
              )}
              {currentQuestion.prompts && currentQuestion.prompts.length > 0 && !isSelectType && (
                <PromptChips prompts={currentQuestion.prompts} color={accentColor} />
              )}
            </div>

            {/* Answer area */}
            {!isSkippedCurrent && (
              <div className="flex-1 flex flex-col gap-3">
                {/* Select / multiselect */}
                {isSelectType && currentQuestion.options && (
                  <div className="flex flex-col gap-2">
                    {currentQuestion.options.map(opt => (
                      <SelectChip
                        key={opt}
                        label={opt}
                        selected={selected.includes(opt)}
                        isCoaching={isCoachingQ}
                        color={accentColor}
                        onClick={() => {
                          updateCurrentAnswer({ text: toggleOption(currentAnswer.text, opt, isMultiselect) });
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Follow-up question (triggered by single-select option) */}
                <AnimatePresence mode="wait">
                  {activeFollowUp && (
                    <motion.div
                      key={activeFollowUp.question}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.22 }}
                      className="mt-2 flex flex-col gap-2"
                    >
                      <p className="text-sm font-semibold text-white/60 leading-snug">
                        {activeFollowUp.question}
                      </p>
                      <textarea
                        rows={3}
                        placeholder="Tell us more…"
                        value={followUpAnswer}
                        onChange={e => setFollowUpAnswer(e.target.value)}
                        className="w-full border border-white/22 focus:border-white/40 bg-black/50 backdrop-blur-sm rounded-2xl px-4 py-3 text-white text-base placeholder:text-white/45 focus:outline-none transition-all resize-none leading-relaxed"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Voice-text */}
                {isVoiceText && (
                  <>
                    <textarea
                      rows={4}
                      placeholder={
                        isCoachingQ
                          ? "Type your observations here…"
                          : "Write your answer here, or record a voice note below…"
                      }
                      value={currentAnswer.text}
                      onChange={e => updateCurrentAnswer({ text: e.target.value })}
                      className={`w-full border rounded-2xl px-4 py-4 text-white text-base placeholder:text-white/45 focus:outline-none transition-all resize-none leading-relaxed backdrop-blur-sm ${
                        qError
                          ? "border-red-500/55 bg-black/55"
                          : isCoachingQ
                          ? "border-teal-500/30 focus:border-teal-500/55 bg-black/55"
                          : answered
                          ? `border-white/28 focus:border-white/48 bg-black/55`
                          : "border-white/22 focus:border-white/40 bg-black/50"
                      }`}
                    />
                    {!isCoachingQ && (
                      <div className="space-y-2">
                        <VoiceRecorder
                          onAudioReady={(blob, url) => updateCurrentAnswer({ audioBlob: blob ?? null, audioUrl: url })}
                          onTranscript={(text) => {
                            const current = currentAnswer.text.trim();
                            updateCurrentAnswer({ text: current ? `${current}\n${text}` : text });
                          }}
                          existingUrl={currentAnswer.audioUrl}
                        />
                        <MediaUploader
                          onMediaChange={paths => updateCurrentAnswer({ mediaUrls: paths })}
                          existingUrls={currentAnswer.mediaUrls}
                        />
                      </div>
                    )}
                  </>
                )}

                {qError && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm font-medium"
                  >
                    {isSelectType ? "Pick at least one option to continue." : "Record a voice note or write something to continue."}
                  </motion.p>
                )}
              </div>
            )}

            {/* Skipped state */}
            {isSkippedCurrent && (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 py-8">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <SkipForward size={22} className="text-amber-400/60" />
                </div>
                <p className="text-white/40 text-sm text-center">
                  You skipped this one — it'll appear at the end if you want to come back to it.
                </p>
                <button
                  onClick={() => unmarkSkipped(stage.id, currentQI)}
                  className="px-4 py-2 rounded-xl border border-amber-500/30 text-amber-400 text-sm font-semibold hover:bg-amber-500/10 transition-colors"
                >
                  Answer this now
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom action area */}
      <div
        className="sticky bottom-0 z-30 px-5 pt-2"
        style={{
          background: "linear-gradient(to top, #0a0a0a 65%, transparent)",
          paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))",
        }}
      >
        <div className="max-w-xl mx-auto space-y-2">
          {/* Skip button (only for non-coaching, non-skipped, unanswered) */}
          {!isCoachingQ && !isSkippedCurrent && !answered && (
            <button
              type="button"
              onClick={markCurrentSkipped}
              className="w-full flex items-center justify-center gap-2 text-white/25 hover:text-white/50 text-sm transition-colors py-2 min-h-[44px]"
            >
              <SkipForward size={14} />
              Skip for now
            </button>
          )}

          {/* Next / Complete button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={goForward}
            disabled={isSaving}
            className="w-full py-4 rounded-2xl font-display font-black text-sm uppercase tracking-widest transition-all disabled:opacity-50"
            style={{
              background: accentColor,
              color: btnText,
              boxShadow: `0 6px 30px ${accentColor}45`,
            }}
          >
            {isSaving ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving…
              </span>
            ) : isVeryLast ? (
              "Complete My Story →"
            ) : isLastQ ? (
              "Next Chapter →"
            ) : (
              "Next →"
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
