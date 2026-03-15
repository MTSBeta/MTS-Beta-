import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRoute, useLocation } from "wouter";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { MediaUploader } from "@/components/MediaUploader";
import { getStakeholderQuestions } from "@/data/stakeholderQuestions";
import {
  useGetStakeholderByCode,
  useSubmitStakeholderResponses,
} from "@workspace/api-client-react";

interface AnswerEntry {
  text: string;
  audioUrl: string | null;
  audioBlob?: Blob | null;
  mediaUrls: string[];
}

export default function Stakeholder() {
  const [match, params] = useRoute("/stakeholder/:code");
  const code = params?.code ?? "";
  const [_, navigate] = useLocation();

  const [answers, setAnswers] = useState<AnswerEntry[]>(
    Array(5).fill(null).map(() => ({ text: "", audioUrl: null, mediaUrls: [] }))
  );
  const [errors, setErrors] = useState<boolean[]>(Array(5).fill(false));
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { data: info, isLoading, isError } = useGetStakeholderByCode(code);
  const submitMutation = useSubmitStakeholderResponses();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 size={32} className="animate-spin text-white/40" />
        </div>
      </Layout>
    );
  }

  if (isError || !info) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <h2 className="text-2xl font-display font-bold text-white mb-3">Link Not Found</h2>
          <p className="text-white/50">This invite link may have expired or been entered incorrectly.</p>
        </div>
      </Layout>
    );
  }

  if (info.submitted || isSubmitted) {
    return (
      <Layout>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
        >
          <div className="w-20 h-20 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-3xl font-display font-black text-white mb-3">
            Thanks for your contribution!
          </h1>
          <p className="text-white/60 max-w-sm">
            Your perspective on <strong className="text-white">{info.playerName}</strong>'s journey has been saved and will be part of their story.
          </p>
        </motion.div>
      </Layout>
    );
  }

  const qset = getStakeholderQuestions(info.type);

  const updateAnswer = (index: number, patch: Partial<AnswerEntry>) => {
    setAnswers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...patch };
      return updated;
    });
    if (patch.text?.trim() || patch.audioUrl) {
      setErrors((prev) => { const e = [...prev]; e[index] = false; return e; });
    }
  };

  const handleSubmit = async () => {
    const newErrors = answers.map((a) => !a.text.trim() && !a.audioUrl);
    if (newErrors.some(Boolean)) {
      setErrors(newErrors);
      return;
    }

    const responses = qset.questions.map((q, qi) => ({
      questionNumber: qi + 1,
      questionText: q,
      answerText: answers[qi]?.text ?? "",
      audioUrl: answers[qi]?.audioUrl ?? null,
      mediaUrls: answers[qi]?.mediaUrls ?? [],
    }));

    await submitMutation.mutateAsync({
      pathParams: { code },
      body: { responses },
    });

    setIsSubmitted(true);
  };

  return (
    <Layout>
      <div className="w-full max-w-3xl mx-auto py-8 px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <span className="text-4xl mb-3 block">{qset.emoji}</span>
          <h1 className="text-2xl md:text-3xl font-display font-black text-white mb-2">
            {qset.title}
          </h1>
          <p className="text-white/50 text-sm mb-4">{qset.intro}</p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/8 border border-white/10 text-white/70 text-sm">
            <span className="font-semibold text-white">{info.playerName}</span>
            <span className="text-white/30">·</span>
            <span>{info.academyName}</span>
            <span className="text-white/30">·</span>
            <span className="capitalize">{info.position}</span>
          </div>
        </motion.div>

        {/* Questions */}
        <div className="space-y-5">
          {qset.questions.map((question, qi) => (
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
                placeholder="Share your thoughts..."
                value={answers[qi]?.text ?? ""}
                onChange={(e) => updateAnswer(qi, { text: e.target.value })}
                rows={3}
                className={`resize-none ${errors[qi] ? "border-red-500/50" : ""}`}
              />

              <div className="flex flex-col gap-2 pt-1">
                <VoiceRecorder
                  onAudioReady={(blob, url) => updateAnswer(qi, { audioBlob: blob, audioUrl: url })}
                  existingUrl={answers[qi]?.audioUrl}
                />
                <MediaUploader
                  onMediaChange={(paths) => updateAnswer(qi, { mediaUrls: paths })}
                  existingUrls={answers[qi]?.mediaUrls}
                />
              </div>

              {errors[qi] && (
                <p className="text-xs text-red-400">
                  Please write a response or record a voice note.
                </p>
              )}
            </motion.div>
          ))}
        </div>

        {/* Submit */}
        <div className="mt-8 pb-8">
          <Button
            onClick={handleSubmit}
            disabled={submitMutation.isPending}
            className="w-full py-4 text-base"
          >
            {submitMutation.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={18} className="animate-spin" />
                Submitting...
              </span>
            ) : (
              "Submit My Perspective →"
            )}
          </Button>
          {submitMutation.isError && (
            <p className="text-red-400 text-xs text-center mt-3">
              Something went wrong. Please try again.
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
}
