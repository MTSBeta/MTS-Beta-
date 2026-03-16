import { useState } from "react";
import { motion } from "framer-motion";
import { useRoute, useLocation } from "wouter";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { COACH_QUESTIONS } from "@/data/questions";
import { useGetPlayerByCoachCode, useSubmitCoachResponses } from "@workspace/api-client-react";

export default function CoachForm() {
  const [match, params] = useRoute("/coach/:code");
  const code = params?.code || "";
  const [_, navigate] = useLocation();

  const [answers, setAnswers] = useState<string[]>(Array(5).fill(""));
  const [errors, setErrors] = useState<boolean[]>(Array(5).fill(false));
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { data: player, isLoading, isError } = useGetPlayerByCoachCode(code, {
    query: { retry: false }
  });

  const submitMutation = useSubmitCoachResponses();

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
    if (value.trim()) {
      const newErrors = [...errors];
      newErrors[index] = false;
      setErrors(newErrors);
    }
  };

  const handleSubmit = async () => {
    const newErrors = answers.map(a => !a.trim());
    setErrors(newErrors);
    if (newErrors.some(e => e)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const formattedResponses = COACH_QUESTIONS.map((q, idx) => ({
      questionNumber: idx + 1,
      questionText: q,
      answerText: answers[idx]
    }));

    try {
      await submitMutation.mutateAsync({
        coachCode: code,
        data: { responses: formattedResponses }
      });
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error("Submission failed", err);
      alert("Failed to submit. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <Layout hideLogo>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 text-white/50 animate-spin" />
        </div>
      </Layout>
    );
  }

  if (isError || !player) {
    return (
      <Layout hideLogo>
        <div className="glass-panel p-10 rounded-3xl max-w-md mx-auto text-center mt-20">
          <h2 className="text-2xl font-bold text-white mb-4">Invalid Link</h2>
          <p className="text-white/60 mb-8">This invitation link appears to be invalid or has expired.</p>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </Layout>
    );
  }

  if (isSubmitted) {
    return (
      <Layout hideLogo>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-10 rounded-3xl max-w-xl mx-auto text-center mt-20"
        >
          <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-display font-bold text-white mb-4">Thank You, Staff Member</h2>
          <p className="text-white/70 text-lg">
            Your observation has been successfully added to {player.playerName}'s development profile.
          </p>
        </motion.div>
      </Layout>
    );
  }

  return (
    <Layout hideLogo>
      <div className="w-full max-w-3xl mx-auto flex flex-col pt-8 pb-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-display font-black text-white mb-4 uppercase">
            Staff Assessment
          </h1>
          <p className="text-lg text-white/70 font-medium">
            Football Coaching Pillar Assessment for <span className="text-white font-bold">{player.playerName}</span> • {player.position}
          </p>
        </div>

        <div className="glass-panel p-6 md:p-10 rounded-3xl space-y-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-8 border-l-4 border-[var(--academy-primary,white)]">
            <p className="text-white/80 italic text-sm md:text-base leading-relaxed">
              Provide your expert observations on this player's development across the four pillars: Football Coaching, Psychology, Education, and Player Care.
            </p>
          </div>

          {COACH_QUESTIONS.map((question, idx) => (
            <Textarea
              key={idx}
              label={`Q${idx + 1}. ${question}`}
              placeholder="Your observations..."
              value={answers[idx]}
              onChange={(e) => handleAnswerChange(idx, e.target.value)}
              error={errors[idx] ? "Please provide an answer" : undefined}
            />
          ))}

          <Button 
            className="w-full mt-8" 
            size="lg"
            onClick={handleSubmit}
            isLoading={submitMutation.isPending}
          >
            Submit Assessment
          </Button>
        </div>
      </div>
    </Layout>
  );
}
