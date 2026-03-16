import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRoute } from "wouter";
import { Loader2, CheckCircle2, Heart } from "lucide-react";
import { fetchParentView, submitParentResponses } from "@/lib/staffApi";

interface ParentData {
  playerName: string;
  academyName: string;
  position: string;
  age: number;
  questions: Array<{ questionNumber: number; questionText: string }>;
  submitted: boolean;
}

export default function ParentView() {
  const [, params] = useRoute("/parent/:code");
  const code = params?.code || "";

  const [data, setData] = useState<ParentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [errors, setErrors] = useState<boolean[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!code) return;
    fetchParentView(code)
      .then((d) => {
        setData(d);
        if (d.submitted) setSubmitted(true);
        else setAnswers(d.questions.map(() => ""));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [code]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-white/30" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6 text-center">
        <span className="text-5xl mb-4">🔗</span>
        <h2 className="text-2xl font-display font-black text-white mb-2">Link Not Found</h2>
        <p className="text-white/40 text-sm">
          This parent link may be invalid or expired. Please check with the academy.
        </p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
          <div className="w-24 h-24 rounded-3xl bg-green-500/15 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} className="text-green-400" />
          </div>
        </motion.div>
        <h1 className="text-3xl font-display font-black text-white mb-3">Thank You</h1>
        <p className="text-white/50 text-base leading-relaxed max-w-xs">
          Your perspective on <strong className="text-white">{data.playerName}</strong> has been saved
          and will contribute to their development story.
        </p>
      </div>
    );
  }

  const handleSubmit = async () => {
    const newErrors = answers.map((a) => !a.trim());
    if (newErrors.some(Boolean)) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      await submitParentResponses(
        code,
        data.questions.map((q, i) => ({
          questionNumber: q.questionNumber,
          questionText: q.questionText,
          answerText: answers[i],
        }))
      );
      setSubmitted(true);
    } catch (err: any) {
      alert(err.message || "Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-white/[0.01]" />
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto pb-32">
        <div className="max-w-xl mx-auto px-4 pt-8 space-y-5">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center pb-2"
          >
            <div className="w-14 h-14 rounded-2xl bg-pink-500/15 flex items-center justify-center mx-auto mb-4">
              <Heart size={28} className="text-pink-400" />
            </div>
            <h1 className="text-2xl font-display font-black text-white mb-2">
              Parent Perspective
            </h1>
            <p className="text-white/45 text-sm leading-relaxed mb-4">
              Share your unique perspective on your child's journey. Your insights help paint
              the complete picture.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/6 border border-white/10 text-sm">
              <span className="font-bold text-white">{data.playerName}</span>
              <span className="text-white/25">&middot;</span>
              <span className="text-white/50">{data.academyName}</span>
            </div>
          </motion.div>

          {data.questions.map((q, qi) => (
            <motion.div
              key={q.questionNumber}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: qi * 0.06 }}
              className={`rounded-2xl p-5 space-y-3 ${errors[qi] ? "ring-1 ring-red-500/50" : ""}`}
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <p className="text-base font-semibold text-white leading-relaxed">
                <span className="text-white/20 mr-2 font-mono text-xs">{q.questionNumber}.</span>
                {q.questionText}
              </p>
              <textarea
                rows={3}
                placeholder="Share your thoughts..."
                value={answers[qi] || ""}
                onChange={(e) => {
                  const updated = [...answers];
                  updated[qi] = e.target.value;
                  setAnswers(updated);
                  if (e.target.value.trim()) {
                    const newErr = [...errors];
                    newErr[qi] = false;
                    setErrors(newErr);
                  }
                }}
                className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors resize-none leading-relaxed ${
                  errors[qi] ? "border-red-500/50" : "border-white/10"
                }`}
              />
              {errors[qi] && (
                <p className="text-xs text-red-400">Please share your thoughts on this question.</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <div
        className="fixed bottom-0 left-0 right-0 z-20 px-4 pb-6 pt-3"
        style={{ background: "linear-gradient(to top, #0a0a0a 70%, transparent)" }}
      >
        <div className="max-w-xl mx-auto">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full py-4 rounded-2xl font-black text-base uppercase tracking-widest disabled:opacity-50 bg-white text-black font-display"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={18} className="animate-spin" />
                Submitting...
              </span>
            ) : (
              "Submit My Perspective"
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
