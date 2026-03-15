import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { MediaUploader } from "@/components/MediaUploader";
import { usePlayerContext } from "@/context/PlayerContext";
import { JOURNEY_STAGES } from "@/data/questions";
import { useSaveJourneyResponses, useCompleteJourney } from "@workspace/api-client-react";
import type { AnswerEntry } from "@/context/PlayerContext";

function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex gap-1.5 justify-center">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i < current ? "bg-white/60 w-4" : i === current ? "bg-white w-5" : "bg-white/20 w-1.5"
          }`}
        />
      ))}
    </div>
  );
}

export default function Journey() {
  const [_, navigate] = useLocation();
  const { playerData, journeyAnswers, saveJourneyStage } = usePlayerContext();
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

  useEffect(() => {
    if (!playerData) navigate("/");
  }, [playerData, navigate]);

  // Load answers when step changes
  useEffect(() => {
    const saved = journeyAnswers[stage.id];
    if (saved) {
      setLocalAnswers(saved as AnswerEntry[]);
    } else {
      setLocalAnswers(
        Array(5).fill(null).map(() => ({ text: "", audioUrl: null, audioBlob: null, mediaUrls: [] }))
      );
    }
    setErrors(Array(5).fill(false));
  }, [currentStep, stage.id]);

  const updateAnswer = (index: number, patch: Partial<AnswerEntry>) => {
    setLocalAnswers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...patch };
      return updated;
    });
    // Clear error if something answered
    if (patch.text?.trim() || patch.audioUrl) {
      setErrors((prev) => { const e = [...prev]; e[index] = false; return e; });
    }
  };

  const validateAndAdvance = async () => {
    // Require at least a text answer OR voice note for each question
    const newErrors = localAnswers.map(
      (a) => !a.text.trim() && !a.audioUrl
    );
    if (newErrors.some(Boolean)) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);
    saveJourneyStage(stage.id, localAnswers);

    // Build all responses so far (collect from context + current)
    const allAnswers = { ...journeyAnswers, [stage.id]: localAnswers };

    const responses = JOURNEY_STAGES.slice(0, currentStep + 1).flatMap((s, si) => {
      const stageAnswers = allAnswers[s.id] ?? [];
      return s.questions.map((q, qi) => ({
        stage: s.id,
        questionNumber: si * 5 + qi + 1,
        questionText: q,
        answerText: (stageAnswers[qi] as AnswerEntry)?.text ?? "",
        audioUrl: (stageAnswers[qi] as AnswerEntry)?.audioUrl ?? null,
        mediaUrls: (stageAnswers[qi] as AnswerEntry)?.mediaUrls ?? [],
      }));
    });

    try {
      if (currentStep < totalStages - 1) {
        await saveMutation.mutateAsync({
          pathParams: { playerId: playerData!.id },
          body: { responses },
        });
        setCurrentStep((s) => s + 1);
      } else {
        // Final stage — save + complete
        await saveMutation.mutateAsync({
          pathParams: { playerId: playerData!.id },
          body: { responses },
        });
        await completeMutation.mutateAsync({
          pathParams: { playerId: playerData!.id },
        });
        navigate("/invite");
      }
    } catch (err) {
      console.error("Save error", err);
    } finally {
      setIsSaving(false);
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      saveJourneyStage(stage.id, localAnswers);
      setCurrentStep((s) => s - 1);
    }
  };

  if (!playerData) return null;

  return (
    <Layout>
      <div className="w-full max-w-3xl mx-auto py-8 px-4">
        {/* Stage progress */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">
              Stage {currentStep + 1} of {totalStages}
            </span>
            <span className="text-xs text-white/40">{playerData.playerName}</span>
          </div>
          <ProgressDots total={totalStages} current={currentStep} />
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Stage header */}
            <div className="text-center mb-6">
              <span className="text-5xl mb-3 block">{stage.emoji}</span>
              <h1 className="text-3xl md:text-4xl font-display font-black text-white mb-2">
                {stage.title}
              </h1>
              <p className="text-white/60 text-sm max-w-md mx-auto">{stage.subtitle}</p>
            </div>

            {/* Questions */}
            <div className="space-y-6">
              {stage.questions.map((question, qi) => (
                <motion.div
                  key={qi}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: qi * 0.07 }}
                  className={`glass-panel rounded-2xl p-5 space-y-3 ${
                    errors[qi] ? "border border-red-500/40" : ""
                  }`}
                >
                  <p className="text-sm font-medium text-white/90 leading-relaxed">
                    <span className="text-white/30 mr-2 font-mono text-xs">{qi + 1}.</span>
                    {question}
                  </p>

                  <Textarea
                    placeholder="Type your answer here..."
                    value={localAnswers[qi]?.text ?? ""}
                    onChange={(e) => updateAnswer(qi, { text: e.target.value })}
                    rows={3}
                    className={`resize-none ${errors[qi] ? "border-red-500/50" : ""}`}
                  />

                  <div className="flex flex-col gap-2 pt-1">
                    <VoiceRecorder
                      onAudioReady={(blob, url) => updateAnswer(qi, { audioBlob: blob, audioUrl: url })}
                      existingUrl={localAnswers[qi]?.audioUrl}
                    />
                    <MediaUploader
                      onMediaChange={(paths) => updateAnswer(qi, { mediaUrls: paths })}
                      existingUrls={localAnswers[qi]?.mediaUrls}
                    />
                  </div>

                  {errors[qi] && (
                    <p className="text-xs text-red-400">Please write a response or record a voice note.</p>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-4 pb-8">
              <Button
                variant="ghost"
                onClick={goBack}
                disabled={currentStep === 0 || isSaving}
              >
                ← Back
              </Button>
              <Button
                onClick={validateAndAdvance}
                disabled={isSaving}
                className="px-8"
              >
                {isSaving ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Saving...
                  </span>
                ) : currentStep === totalStages - 1 ? (
                  "Complete Journey →"
                ) : (
                  "Next Stage →"
                )}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </Layout>
  );
}
