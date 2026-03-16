import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { ChevronLeft, SkipForward } from "lucide-react";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { MediaUploader } from "@/components/MediaUploader";
import { usePlayerContext } from "@/context/PlayerContext";
import { useSoundEnabled } from "@/context/SoundContext";
import { useSoundSystem } from "@/hooks/useSoundSystem";
import { PLAYER_STAGES, computeCharacterProfile } from "@/data/questions";
import type { JourneyQuestion } from "@/data/questions";
import { useSaveJourneyResponses, useCompleteJourney } from "@workspace/api-client-react";
import type { AnswerEntry } from "@/context/PlayerContext";

// ── Helpers ──────────────────────────────────────────────────────────────────

function isLight(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 160;
}

function PromptChips({ prompts }: { prompts: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {prompts.map((p, i) => (
        <span key={i} className="inline-block px-2.5 py-1 rounded-full text-xs font-medium text-white/45 bg-white/6 border border-white/10">{p}</span>
      ))}
    </div>
  );
}

function SelectChip({
  label, selected, onClick, color, isCoaching
}: {
  label: string; selected: boolean; onClick: () => void; color: string; isCoaching?: boolean;
}) {
  const soundContext = useSoundEnabled();
  const sound = useSoundSystem({ enabled: soundContext.enabled });
  const accentColor = isCoaching ? "#0d9488" : color;
  
  const handleClick = () => {
    try {
      if (soundContext.enabled) {
        sound.play(selected ? "click" : "select");
      }
    } catch (e) {
      console.debug("Sound playback skipped");
    }
    onClick();
  };
  
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className="px-3 py-1.5 rounded-full text-sm font-semibold border transition-all text-left"
      style={
        selected
          ? { background: accentColor, borderColor: accentColor, color: isLight(accentColor) ? "#000" : "#fff" }
          : { background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.65)" }
      }
    >
      {selected ? "✓ " : ""}{label}
    </motion.button>
  );
}

// ── Toggle multi-select stored as ||| delimited string ────────────────────────

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

// ── Question card ─────────────────────────────────────────────────────────────

function QuestionCard({
  question, qi, answer, skipped, error, primaryColor, isCoaching: stageCoaching,
  onTextChange, onAudioReady, onMediaChange, onSkip, onUnskip,
}: {
  question: JourneyQuestion;
  qi: number;
  answer: AnswerEntry;
  skipped: boolean;
  error: boolean;
  primaryColor: string;
  isCoaching?: boolean;
  onTextChange: (val: string) => void;
  onAudioReady: (blob: Blob, url: string) => void;
  onMediaChange: (paths: string[]) => void;
  onSkip: () => void;
  onUnskip: () => void;
}) {
  const qType = question.type ?? "voice-text";
  const isCoachingQ = stageCoaching || qType === "staff-text" || qType === "staff-multiselect";
  const isSelect = qType === "select";
  const isMultiselect = qType === "multiselect" || qType === "staff-multiselect";
  const isSelectType = isSelect || isMultiselect;
  const isVoiceText = qType === "voice-text" || qType === "staff-text";
  const accentColor = isCoachingQ ? "#0d9488" : primaryColor;
  const selected = selectedOptions(answer.text);
  const answered = isSelectType ? answer.text.trim() !== "" : !!(answer.text.trim() || answer.audioUrl);

  return (
    <motion.div
      key={qi}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: qi * 0.06 }}
      className={`rounded-2xl p-5 space-y-3 transition-all ${error ? "ring-1 ring-red-500/50" : ""} ${skipped ? "opacity-55" : ""}`}
      style={{
        background: skipped
          ? "rgba(255,255,255,0.02)"
          : isCoachingQ
          ? "rgba(13,148,136,0.07)"
          : answered
          ? `${primaryColor}0A`
          : "rgba(255,255,255,0.04)",
        border: skipped
          ? "1px dashed rgba(255,255,255,0.1)"
          : isCoachingQ
          ? answered ? "1px solid rgba(13,148,136,0.5)" : "1px solid rgba(13,148,136,0.2)"
          : answered
          ? `1px solid ${primaryColor}30`
          : "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Question header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {isCoachingQ && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-black tracking-widest uppercase bg-teal-500/20 text-teal-400">Coach</span>
            )}
            {question.emoji && <span className="text-base">{question.emoji}</span>}
            <span className="text-white/20 font-mono text-xs">{qi + 1}.</span>
          </div>
          <p className={`text-base font-semibold leading-relaxed ${skipped ? "text-white/40 line-through" : "text-white"}`}>
            {question.text}
          </p>
          {question.hint && !skipped && (
            <p className="text-white/35 text-xs mt-1 leading-relaxed">{question.hint}</p>
          )}
          {!skipped && !isSelectType && question.prompts && question.prompts.length > 0 && (
            <PromptChips prompts={question.prompts} />
          )}
        </div>
        {answered && !skipped && (
          <span className="text-xs font-bold shrink-0 mt-0.5" style={{ color: accentColor }}>✓</span>
        )}
        {skipped && (
          <button
            onClick={onUnskip}
            className="text-amber-400/60 hover:text-amber-400 text-[10px] font-bold uppercase tracking-wider shrink-0 mt-0.5 transition-colors"
          >
            Undo
          </button>
        )}
      </div>

      {/* Answer area */}
      {!skipped && (
        <>
          {/* Select / Multiselect chips */}
          {isSelectType && question.options && (
            <div className="flex flex-wrap gap-2 pt-1">
              {question.options.map(opt => (
                <SelectChip
                  key={opt}
                  label={opt}
                  selected={selected.includes(opt)}
                  isCoaching={isCoachingQ}
                  color={primaryColor}
                  onClick={() => onTextChange(toggleOption(answer.text, opt, isMultiselect))}
                />
              ))}
            </div>
          )}

          {/* Text area (voice-text and staff-text) */}
          {isVoiceText && (
            <>
              <textarea
                rows={3}
                placeholder={isCoachingQ
                  ? "Type your observations here…"
                  : "Write your answer here, or use the voice note below..."}
                value={answer.text}
                onChange={e => onTextChange(e.target.value)}
                className={`w-full border rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none transition-colors resize-none leading-relaxed ${error ? "border-red-500/50" : isCoachingQ ? "border-teal-500/20 focus:border-teal-500/40 bg-teal-900/10" : "border-white/10 focus:border-white/30 bg-white/5"}`}
              />
              {!isCoachingQ && (
                <div className="flex flex-col gap-2">
                  <VoiceRecorder
                    onAudioReady={onAudioReady}
                    existingUrl={answer.audioUrl}
                  />
                  <MediaUploader
                    onMediaChange={onMediaChange}
                    existingUrls={answer.mediaUrls}
                  />
                </div>
              )}
            </>
          )}

          {error && (
            <p className="text-xs text-red-400">
              {isSelectType ? "Please select at least one option." : "Please write a response or record a voice note."}
            </p>
          )}
        </>
      )}

      {/* Skip controls — only for non-coaching questions */}
      {!isCoachingQ && (
        skipped ? (
          <div className="flex items-center gap-2 text-amber-400/50 text-xs">
            <SkipForward size={12} />
            <span>Skipped — you can answer this at the end</span>
          </div>
        ) : (
          !answered && (
            <button
              type="button"
              onClick={onSkip}
              className="flex items-center gap-1.5 text-white/25 hover:text-amber-400/70 text-xs transition-colors group"
            >
              <SkipForward size={12} className="group-hover:text-amber-400/70" />
              <span>Skip for now — answer later</span>
            </button>
          )
        )
      )}
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

  const stage = PLAYER_STAGES[currentStep];
  const qCount = stage.questions.length;
  const totalStages = PLAYER_STAGES.length;
  const primaryColor = selectedAcademy?.primaryColor ?? "#6d28d9";
  const btnText = isLight(primaryColor) ? "#000" : "#fff";

  const [localAnswers, setLocalAnswers] = useState<AnswerEntry[]>(
    Array(qCount).fill(null).map(() => ({ text: "", audioUrl: null, audioBlob: null, mediaUrls: [] }))
  );
  const [errors, setErrors] = useState<boolean[]>(Array(qCount).fill(false));
  const [isSaving, setIsSaving] = useState(false);

  const [skippedSet, setSkippedSet] = useState<Set<string>>(new Set());
  const [showReview, setShowReview] = useState(false);
  const [reviewAnswers, setReviewAnswers] = useState<Record<string, ReviewEntry>>({});
  const reviewScrollRef = useRef<HTMLDivElement>(null);

  const saveMutation = useSaveJourneyResponses();
  const completeMutation = useCompleteJourney();

  useEffect(() => { if (!playerData) navigate("/"); }, [playerData]);

  useEffect(() => {
    if (showReview) return;
    const newCount = stage.questions.length;
    const saved = journeyAnswers[stage.id];
    setLocalAnswers(
      saved
        ? (saved as AnswerEntry[])
        : Array(newCount).fill(null).map(() => ({ text: "", audioUrl: null, audioBlob: null, mediaUrls: [] }))
    );
    setErrors(Array(newCount).fill(false));
  }, [currentStep, stage.id, showReview]);

  const skipKey = (stageId: string, qi: number) => `${stageId}__${qi}`;
  const isSkipped = (stageId: string, qi: number) => skippedSet.has(skipKey(stageId, qi));

  const markSkipped = (qi: number) => {
    setSkippedSet(prev => new Set([...prev, skipKey(stage.id, qi)]));
    setLocalAnswers(prev => {
      const updated = [...prev];
      updated[qi] = { text: "", audioUrl: null, audioBlob: null, mediaUrls: [] };
      return updated;
    });
    setErrors(prev => { const e = [...prev]; e[qi] = false; return e; });
  };

  const unmarkSkipped = (stageId: string, qi: number) => {
    setSkippedSet(prev => { const next = new Set(prev); next.delete(skipKey(stageId, qi)); return next; });
  };

  const updateAnswer = (index: number, patch: Partial<AnswerEntry>) => {
    setLocalAnswers(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...patch };
      return updated;
    });
    if (patch.text?.trim() || patch.audioUrl) {
      setErrors(prev => { const e = [...prev]; e[index] = false; return e; });
      unmarkSkipped(stage.id, index);
    }
  };

  // All skipped questions across all stages (for review)
  const allSkipped = PLAYER_STAGES.flatMap((s, si) =>
    s.questions.map((q, qi) => ({ s, si, q, qi, key: skipKey(s.id, qi) }))
      .filter(({ key }) => skippedSet.has(key))
  );
  const totalSkippedCount = skippedSet.size;

  // Build responses payload with correct running question numbers
  const buildResponses = (overrides: Record<string, ReviewEntry> = {}) => {
    const all = { ...journeyAnswers, [stage.id]: localAnswers };
    let runningNum = 0;
    const responses: {
      stage: string; questionNumber: number; questionText: string;
      answerText: string; audioUrl: string | null; mediaUrls: string[];
    }[] = [];

    for (const s of PLAYER_STAGES) {
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

  const validateAndAdvance = async () => {
    // Validate player questions
    const newErrors = localAnswers.map((a, qi) => {
      if (isSkipped(stage.id, qi)) return false;
      const qType = stage.questions[qi]?.type ?? "voice-text";
      const isSelectType = qType === "select" || qType === "multiselect";
      if (isSelectType) return !a.text.trim();
      return !a.text.trim() && !a.audioUrl;
    });
    if (newErrors.some(Boolean)) { setErrors(newErrors); return; }

    saveJourneyStage(stage.id, localAnswers);

    const nextStep = currentStep + 1;

    if (nextStep < totalStages) {
      setIsSaving(true);
      const allAnswers = { ...journeyAnswers, [stage.id]: localAnswers };
      let runningNum = 0;
      const responses: { stage: string; questionNumber: number; questionText: string; answerText: string; audioUrl: string | null; mediaUrls: string[] }[] = [];
      for (let si = 0; si <= currentStep; si++) {
        const s = PLAYER_STAGES[si];
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
      try {
        await saveMutation.mutateAsync({ playerId: playerData!.id, data: { responses } });
        setCurrentStep(nextStep);
      } catch (err) { console.error("Save error", err); }
      finally { setIsSaving(false); }
    } else {
      // Last stage — check for skips
      if (totalSkippedCount > 0) {
        setShowReview(true);
      } else {
        await completeJourney({});
      }
    }
  };

  const completeJourney = async (overrides: Record<string, ReviewEntry>) => {
    setIsSaving(true);
    try {
      const responses = buildResponses(overrides);
      // Add character profile as a final synthetic response
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

  const goBack = () => {
    if (showReview) { setShowReview(false); return; }
    if (currentStep > 0) { saveJourneyStage(stage.id, localAnswers); setCurrentStep(s => s - 1); }
  };

  const saveAndExit = async () => {
    saveJourneyStage(stage.id, localAnswers);
    if (playerData && currentStep > 0) {
      const allAnswers = { ...journeyAnswers, [stage.id]: localAnswers };
      let runningNum = 0;
      const responses: { stage: string; questionNumber: number; questionText: string; answerText: string; audioUrl: string | null; mediaUrls: string[] }[] = [];
      for (let si = 0; si < currentStep; si++) {
        const s = PLAYER_STAGES[si];
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
      if (responses.length > 0) {
        try { await saveMutation.mutateAsync({ playerId: playerData.id, data: { responses } }); } catch {}
      }
    }
    navigate("/welcome");
  };

  if (!playerData) return null;

  // ══ REVIEW SCREEN ══════════════════════════════════════════════════════════
  if (showReview) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <img src={`${import.meta.env.BASE_URL}images/hero-bg.png`} alt=""
            className="w-full h-full object-cover opacity-15 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0a]" />
        </div>
        <div className="sticky top-0 z-30 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/6">
          <div className="flex items-center justify-between px-4 h-12">
            <button onClick={() => setShowReview(false)}
              className="flex items-center gap-1 text-white/40 hover:text-white/70 text-xs transition-colors py-2 -ml-1">
              <ChevronLeft size={15} />Back
            </button>
            <span className="text-white/40 text-xs font-bold uppercase tracking-widest">
              {allSkipped.length} question{allSkipped.length !== 1 ? "s" : ""} left
            </span>
            <div className="w-14" />
          </div>
        </div>
        <div ref={reviewScrollRef} className="relative z-10 flex-1 overflow-y-auto pb-36">
          <div className="max-w-xl mx-auto px-4 pt-6 space-y-6">
            <div className="text-center">
              <div className="text-5xl mb-3">⏭️</div>
              <h1 className="text-2xl font-display font-black text-white mb-2">Almost there!</h1>
              <p className="text-white/50 text-sm leading-relaxed max-w-xs mx-auto">
                You skipped {allSkipped.length} question{allSkipped.length !== 1 ? "s" : ""}. Answer them now, or complete your journey and we'll leave them blank.
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
                    border: hasReviewAnswer ? `1px solid ${primaryColor}40` : "1px solid rgba(255,255,255,0.08)"
                  }}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{s.emoji}</span>
                    <span className="text-white/35 text-xs font-bold uppercase tracking-widest">
                      Stage {si + 1} · {s.title}
                    </span>
                    {hasReviewAnswer && (
                      <span className="ml-auto text-xs font-bold" style={{ color: primaryColor }}>✓ Answered</span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-white leading-relaxed">
                    <span className="text-white/20 mr-2 font-mono text-xs">{qi + 1}.</span>
                    {q.text}
                  </p>
                  {q.prompts && q.prompts.length > 0 && <PromptChips prompts={q.prompts} />}
                  <textarea
                    rows={2}
                    placeholder="Write your answer here…"
                    value={ra.text}
                    onChange={e => setReviewAnswers(prev => ({ ...prev, [key]: { ...ra, text: e.target.value } }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors resize-none"
                  />
                  <VoiceRecorder
                    onAudioReady={(blob, url) => setReviewAnswers(prev => ({ ...prev, [key]: { ...ra, audioBlob: blob, audioUrl: url } }))}
                    existingUrl={ra.audioUrl}
                  />
                </motion.div>
              );
            })}
            <p className="text-white/25 text-xs text-center pb-2">
              You can complete now and leave any blanks — your story will still be built from everything you've shared.
            </p>
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 z-30 px-4 pb-6 pt-3"
          style={{ background: "linear-gradient(to top, #0a0a0a 70%, transparent)" }}>
          <div className="max-w-xl mx-auto space-y-2">
            <motion.button whileTap={{ scale: 0.97 }}
              onClick={() => completeJourney(reviewAnswers)}
              disabled={isSaving}
              className="w-full py-4 rounded-2xl font-black text-base uppercase tracking-widest disabled:opacity-50 font-display"
              style={{ background: primaryColor, color: btnText, boxShadow: `0 8px 32px ${primaryColor}55` }}>
              {isSaving
                ? <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>Saving…
                  </span>
                : "Complete My Journey →"}
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  // ══ MAIN JOURNEY ═══════════════════════════════════════════════════════════

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img src={`${import.meta.env.BASE_URL}images/hero-bg.png`} alt=""
          className="w-full h-full object-cover opacity-15 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0a]" />
      </div>

      {/* Sticky header */}
      <div className="sticky top-0 z-30 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/6">
        <div className="flex items-center justify-between px-4 h-12">
          <button
            onClick={currentStep === 0 ? saveAndExit : goBack}
            disabled={isSaving}
            className="flex items-center gap-1 text-white/40 hover:text-white/70 text-xs transition-colors py-2 -ml-1 disabled:opacity-30"
          >
            <ChevronLeft size={15} />
            {currentStep === 0 ? "Exit" : "Back"}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-white/30 text-xs font-mono">{currentStep + 1}</span>
            <span className="text-white/15 text-xs">/</span>
            <span className="text-white/20 text-xs font-mono">{totalStages}</span>
            <span className="text-lg ml-1">{stage.emoji}</span>
            {totalSkippedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-400">
                {totalSkippedCount} skipped
              </span>
            )}
          </div>

          <button
            onClick={saveAndExit}
            disabled={isSaving}
            className="text-white/30 hover:text-white/60 text-xs transition-colors py-2 -mr-1 disabled:opacity-30"
          >
            Save & Exit
          </button>
        </div>

        <div className="flex gap-0.5 px-4 pb-2">
          {PLAYER_STAGES.map((_, i) => (
            <div key={i} className="h-1 flex-1 rounded-full transition-all duration-500"
              style={{
                background: i < currentStep ? `${primaryColor}90` : i === currentStep ? primaryColor : "rgba(255,255,255,0.08)"
              }} />
          ))}
        </div>
      </div>

      {/* Scrollable body */}
      <div className="relative z-10 flex-1 overflow-y-auto pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="max-w-xl mx-auto px-4 pt-6 space-y-5"
          >
            {/* Stage header */}
            <div className="text-center pb-2">
              <span className="text-5xl mb-3 block">{stage.emoji}</span>
              <h1 className="text-3xl font-display font-black text-white mb-2 leading-tight">{stage.title}</h1>
              <p className="text-sm leading-relaxed text-white/50">{stage.subtitle}</p>
            </div>

            {/* Voice nudge */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border text-sm"
              style={{ background: `${primaryColor}12`, borderColor: `${primaryColor}30` }}>
              <span className="text-xl shrink-0">🎙️</span>
              <span className="text-white/55">Tap <strong className="text-white/80">Add voice note</strong> — talking tells more of your story than typing.</span>
            </div>

            {/* Questions */}
            <div className="space-y-4">
              {stage.questions.map((question, qi) => (
                <QuestionCard
                  key={qi}
                  question={question}
                  qi={qi}
                  answer={localAnswers[qi] ?? { text: "", audioUrl: null, audioBlob: null, mediaUrls: [] }}
                  skipped={isSkipped(stage.id, qi)}
                  error={errors[qi] ?? false}
                  primaryColor={primaryColor}
                  isCoaching={false}
                  onTextChange={val => updateAnswer(qi, { text: val })}
                  onAudioReady={(blob, url) => updateAnswer(qi, { audioBlob: blob, audioUrl: url })}
                  onMediaChange={paths => updateAnswer(qi, { mediaUrls: paths })}
                  onSkip={() => markSkipped(qi)}
                  onUnskip={() => unmarkSkipped(stage.id, qi)}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Sticky bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 z-30 px-4 pb-6 pt-3"
        style={{ background: "linear-gradient(to top, #0a0a0a 70%, transparent)" }}>
        <div className="max-w-xl mx-auto">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={validateAndAdvance}
            disabled={isSaving}
            className="w-full py-4 rounded-2xl font-black text-base uppercase tracking-widest disabled:opacity-50 font-display"
            style={{
              background: primaryColor,
              color: btnText,
              boxShadow: `0 8px 32px ${primaryColor}55`,
            }}
          >
            {isSaving
              ? <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>Saving…
                </span>
              : currentStep < totalStages - 1
              ? "Next Chapter →"
              : "Complete My Journey →"}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
