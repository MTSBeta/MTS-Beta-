import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { usePlayerContext } from "@/context/PlayerContext";
import { JOURNEY_STAGES } from "@/data/questions";
import { useSaveJourneyResponses, useCompleteJourney } from "@workspace/api-client-react";

export default function Journey() {
  const [_, navigate] = useLocation();
  const { playerData, journeyAnswers, saveJourneyStage, setCompletionData } = usePlayerContext();
  const [currentStep, setCurrentStep] = useState(0);
  const [localAnswers, setLocalAnswers] = useState<string[]>(Array(5).fill(""));
  const [errors, setErrors] = useState<boolean[]>(Array(5).fill(false));

  const stage = JOURNEY_STAGES[currentStep];

  const saveMutation = useSaveJourneyResponses();
  const completeMutation = useCompleteJourney();

  useEffect(() => {
    if (!playerData) {
      navigate("/");
    }
  }, [playerData, navigate]);

  // Load answers when step changes
  useEffect(() => {
    const saved = journeyAnswers[stage.id];
    if (saved) {
      setLocalAnswers(saved);
    } else {
      setLocalAnswers(Array(5).fill(""));
    }
    setErrors(Array(5).fill(false));
  }, [currentStep, stage.id, journeyAnswers]);

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...localAnswers];
    newAnswers[index] = value;
    setLocalAnswers(newAnswers);
    if (value.trim()) {
      const newErrors = [...errors];
      newErrors[index] = false;
      setErrors(newErrors);
    }
  };

  const validateStep = () => {
    const newErrors = localAnswers.map(a => !a.trim());
    setErrors(newErrors);
    return !newErrors.some(e => e);
  };

  const handleNext = async () => {
    if (!validateStep()) return;

    saveJourneyStage(stage.id, localAnswers);

    if (currentStep < JOURNEY_STAGES.length - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Final submit
      if (!playerData) return;

      const formattedResponses = JOURNEY_STAGES.flatMap(st => {
        const answers = st.id === stage.id ? localAnswers : journeyAnswers[st.id] || Array(5).fill("");
        return st.questions.map((q, idx) => ({
          stage: st.id,
          questionNumber: idx + 1,
          questionText: q,
          answerText: answers[idx]
        }));
      });

      try {
        await saveMutation.mutateAsync({
          playerId: playerData.id,
          data: { responses: formattedResponses }
        });
        
        const completeResult = await completeMutation.mutateAsync({
          playerId: playerData.id
        });

        setCompletionData({
          parentCode: completeResult.parentCode,
          coachCode: completeResult.coachCode
        });

        navigate("/invite");
      } catch (err) {
        console.error("Failed to save journey", err);
        alert("Failed to save. Please try again.");
      }
    }
  };

  const handleBack = () => {
    saveJourneyStage(stage.id, localAnswers);
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isSubmitting = saveMutation.isPending || completeMutation.isPending;
  const progress = ((currentStep) / JOURNEY_STAGES.length) * 100;

  return (
    <Layout>
      <div className="w-full max-w-3xl mx-auto flex flex-col pt-4 pb-12">
        {/* Progress Bar */}
        <div className="w-full mb-8">
          <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-white/50 mb-3">
            <span>Stage {currentStep + 1} of 6</span>
            <span className="text-[var(--academy-primary)]">{stage.title}</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[var(--academy-primary)]"
              initial={{ width: `${((currentStep - 1) / JOURNEY_STAGES.length) * 100}%` }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="glass-panel p-6 md:p-10 rounded-3xl"
          >
            <h2 className="text-3xl md:text-4xl font-display font-black text-white mb-8">
              {stage.title}
            </h2>

            <div className="space-y-8">
              {stage.questions.map((question, idx) => (
                <Textarea
                  key={idx}
                  label={`Q${idx + 1}. ${question}`}
                  placeholder="Share your thoughts..."
                  value={localAnswers[idx]}
                  onChange={(e) => handleAnswerChange(idx, e.target.value)}
                  error={errors[idx] ? "Please provide an answer" : undefined}
                />
              ))}
            </div>

            <div className="flex items-center justify-between mt-12 pt-6 border-t border-white/10">
              <Button 
                variant="ghost" 
                onClick={handleBack}
                disabled={currentStep === 0 || isSubmitting}
              >
                Back
              </Button>
              <Button 
                onClick={handleNext}
                isLoading={isSubmitting}
                className="px-8"
              >
                {currentStep === JOURNEY_STAGES.length - 1 ? "Complete Journey" : "Next Stage"}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </Layout>
  );
}
