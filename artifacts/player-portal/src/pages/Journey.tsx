import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { ChevronLeft } from "lucide-react";
import { Textarea } from "@/components/ui/Textarea";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { MediaUploader } from "@/components/MediaUploader";
import { usePlayerContext } from "@/context/PlayerContext";
import { JOURNEY_STAGES } from "@/data/questions";
import { useSaveJourneyResponses, useCompleteJourney } from "@workspace/api-client-react";
import type { AnswerEntry } from "@/context/PlayerContext";

function PromptChips({ prompts }: { prompts: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {prompts.map((p, i) => (
        <span key={i} className="inline-block px-2.5 py-1 rounded-full text-xs font-medium text-white/45 bg-white/6 border border-white/10">{p}</span>
      ))}
    </div>
  );
}

export default function Journey() {
  const [_, navigate] = useLocation();
  const { playerData, selectedAcademy, journeyAnswers, saveJourneyStage } = usePlayerContext();
  const [currentStep, setCurrentStep] = useState(0);
  const [localAnswers, setLocalAnswers] = useState<AnswerEntry[]>(
    Array(5).fill(null).map(() => ({ text: "", audioUrl: null, audioBlob: null, mediaUrls: [] }))
  );
  const [errors, setErrors] = useState<boolean[]>(Array(5).fill(false));
  const [isSaving, setIsSaving] = useState(false);

  const stage = JOURNEY_STAGES[currentStep];
  const totalStages = JOURNEY_STAGES.length;
  const saveMutation = useSaveJourneyResponses();
  const completeMutation = useCompleteJourney();

  const primaryColor = selectedAcademy?.primaryColor ?? "#6d28d9";
  const isLight = (() => {
    const r = parseInt(primaryColor.slice(1, 3), 16);
    const g = parseInt(primaryColor.slice(3, 5), 16);
    const b = parseInt(primaryColor.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 160;
  })();
  const btnText = isLight ? "#000" : "#fff";

  useEffect(() => { if (!playerData) navigate("/"); }, [playerData]);

  useEffect(() => {
    const saved = journeyAnswers[stage.id];
    setLocalAnswers(
      saved
        ? (saved as AnswerEntry[])
        : Array(5).fill(null).map(() => ({ text: "", audioUrl: null, audioBlob: null, mediaUrls: [] }))
    );
    setErrors(Array(5).fill(false));
  }, [currentStep, stage.id]);

  const updateAnswer = (index: number, patch: Partial<AnswerEntry>) => {
    setLocalAnswers(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...patch };
      return updated;
    });
    if (patch.text?.trim() || patch.audioUrl) {
      setErrors(prev => { const e = [...prev]; e[index] = false; return e; });
    }
  };

  const validateAndAdvance = async () => {
    const newErrors = localAnswers.map(a => !a.text.trim() && !a.audioUrl);
    if (newErrors.some(Boolean)) { setErrors(newErrors); return; }

    setIsSaving(true);
    saveJourneyStage(stage.id, localAnswers);
    const allAnswers = { ...journeyAnswers, [stage.id]: localAnswers };

    const responses = JOURNEY_STAGES.slice(0, currentStep + 1).flatMap((s, si) => {
      const stageAnswers = allAnswers[s.id] ?? [];
      return s.questions.map((q, qi) => ({
        stage: s.id,
        questionNumber: si * 5 + qi + 1,
        questionText: q.text,
        answerText: (stageAnswers[qi] as AnswerEntry)?.text ?? "",
        audioUrl: (stageAnswers[qi] as AnswerEntry)?.audioUrl ?? null,
        mediaUrls: (stageAnswers[qi] as AnswerEntry)?.mediaUrls ?? [],
      }));
    });

    try {
      await saveMutation.mutateAsync({ playerId: playerData!.id, data: { responses } });
      if (currentStep < totalStages - 1) {
        setCurrentStep(s => s + 1);
      } else {
        await completeMutation.mutateAsync({ playerId: playerData!.id });
        navigate("/invite");
      }
    } catch (err) {
      console.error("Save error", err);
    } finally {
      setIsSaving(false);
    }
  };

  const goBack = () => {
    if (currentStep > 0) { saveJourneyStage(stage.id, localAnswers); setCurrentStep(s => s - 1); }
  };

  const saveAndExit = async () => {
    saveJourneyStage(stage.id, localAnswers);
    if (playerData && currentStep > 0) {
      const allAnswers = { ...journeyAnswers, [stage.id]: localAnswers };
      const responses = JOURNEY_STAGES.slice(0, currentStep).flatMap((s, si) => {
        const stageAnswers = allAnswers[s.id] ?? [];
        return s.questions.map((q, qi) => ({
          stage: s.id, questionNumber: si * 5 + qi + 1, questionText: q.text,
          answerText: (stageAnswers[qi] as AnswerEntry)?.text ?? "",
          audioUrl: (stageAnswers[qi] as AnswerEntry)?.audioUrl ?? null,
          mediaUrls: (stageAnswers[qi] as AnswerEntry)?.mediaUrls ?? [],
        }));
      });
      if (responses.length > 0) {
        try { await saveMutation.mutateAsync({ playerId: playerData.id, data: { responses } }); } catch {}
      }
    }
    navigate("/welcome");
  };

  if (!playerData) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* BG */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img src={`${import.meta.env.BASE_URL}images/hero-bg.png`} alt=""
          className="w-full h-full object-cover opacity-15 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0a]" />
      </div>

      {/* ── STICKY HEADER ── */}
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
          </div>

          <button
            onClick={saveAndExit}
            disabled={isSaving}
            className="text-white/30 hover:text-white/60 text-xs transition-colors py-2 -mr-1 disabled:opacity-30"
          >
            Save & Exit
          </button>
        </div>

        {/* Progress strip */}
        <div className="flex gap-0.5 px-4 pb-2">
          {JOURNEY_STAGES.map((_, i) => (
            <div
              key={i}
              className="h-1 flex-1 rounded-full transition-all duration-500"
              style={{
                background: i < currentStep
                  ? `${primaryColor}90`
                  : i === currentStep
                  ? primaryColor
                  : "rgba(255,255,255,0.08)"
              }}
            />
          ))}
        </div>
      </div>

      {/* ── SCROLLABLE BODY ── */}
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
              <p className="text-white/50 text-sm leading-relaxed">{stage.subtitle}</p>
            </div>

            {/* Voice nudge */}
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-2xl border text-sm"
              style={{ background: `${primaryColor}12`, borderColor: `${primaryColor}30` }}
            >
              <span className="text-xl shrink-0">🎙️</span>
              <span className="text-white/55">Tap <strong className="text-white/80">Add voice note</strong> — talking tells more of your story than typing.</span>
            </div>

            {/* Questions */}
            <div className="space-y-4">
              {stage.questions.map((question, qi) => (
                <motion.div
                  key={qi}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: qi * 0.06 }}
                  className={`rounded-2xl p-5 space-y-3 ${errors[qi] ? "ring-1 ring-red-500/50" : ""}`}
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <div>
                    <p className="text-base font-semibold text-white leading-relaxed">
                      <span className="text-white/20 mr-2 font-mono text-xs">{qi + 1}.</span>
                      {question.text}
                    </p>
                    {question.prompts && question.prompts.length > 0 && <PromptChips prompts={question.prompts} />}
                  </div>

                  <textarea
                    rows={3}
                    placeholder="Write your answer here, or use the voice note below..."
                    value={localAnswers[qi]?.text ?? ""}
                    onChange={e => updateAnswer(qi, { text: e.target.value })}
                    className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors resize-none leading-relaxed ${errors[qi] ? "border-red-500/50" : "border-white/10"}`}
                  />

                  <div className="flex flex-col gap-2">
                    <VoiceRecorder
                      onAudioReady={(blob, url) => updateAnswer(qi, { audioBlob: blob, audioUrl: url })}
                      existingUrl={localAnswers[qi]?.audioUrl}
                    />
                    <MediaUploader
                      onMediaChange={paths => updateAnswer(qi, { mediaUrls: paths })}
                      existingUrls={localAnswers[qi]?.mediaUrls}
                    />
                  </div>

                  {errors[qi] && (
                    <p className="text-xs text-red-400">Please write a response or record a voice note.</p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── STICKY BOTTOM NAV ── */}
      <div className="fixed bottom-0 left-0 right-0 z-30 px-4 pb-6 pt-3"
        style={{ background: "linear-gradient(to top, #0a0a0a 70%, transparent)" }}>
        <div className="max-w-xl mx-auto">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={validateAndAdvance}
            disabled={isSaving}
            className="w-full py-4 rounded-2xl font-black text-base uppercase tracking-widest transition-all disabled:opacity-50 font-display"
            style={{ background: primaryColor, color: btnText, boxShadow: `0 8px 32px ${primaryColor}55` }}
          >
            {isSaving ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving…
              </span>
            ) : currentStep === totalStages - 1
              ? "Complete My Journey →"
              : `Next: ${JOURNEY_STAGES[currentStep + 1]?.title ?? "Next Stage"} →`
            }
          </motion.button>
        </div>
      </div>
    </div>
  );
}
