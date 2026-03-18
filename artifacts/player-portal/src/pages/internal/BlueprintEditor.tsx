import { useState, useEffect, useCallback } from "react";
import { useRoute, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Loader2, Save, ArrowLeft, ChevronRight, Info } from "lucide-react";
import { InternalLayout } from "@/layouts/InternalLayout";
import {
  fetchBlueprint,
  saveBlueprint,
  fetchPlayerProfile,
  type StoryBlueprint,
  type PlayerProfile,
} from "@/lib/internalApi";

interface BlueprintField {
  key: keyof StoryBlueprint;
  label: string;
  description: string;
  sourceHint?: string;
  color?: string;
}

const BLUEPRINT_FIELDS: BlueprintField[] = [
  { key: "coreIdentity", label: "Core Identity", description: "Who is this player at their core? How do they see themselves?", color: "#a78bfa" },
  { key: "emotionalChallenge", label: "Emotional Challenge", description: "What is the primary emotional struggle or pressure they face?", color: "#ec4899" },
  { key: "falseBelief", label: "False Belief / Inner Tension", description: "What wrong idea do they hold about themselves that the story will challenge?", color: "#f87171" },
  { key: "hiddenStrength", label: "Hidden Strength", description: "What quality do they have that they haven't fully recognised yet?", color: "#34d399" },
  { key: "supportFigure", label: "Support Figure", description: "Who is the most important person in their support network?", color: "#60a5fa" },
  { key: "academyValues", label: "Academy Value(s) to Embed", description: "Which academy values should run through this story?", color: "#fbbf24" },
  { key: "keyFootballTest", label: "Key Football Test", description: "What is the crucial football moment or challenge in this story?", color: "#4ade80" },
  { key: "turningPoint", label: "Turning Point", description: "The moment where something shifts — in mindset, belief, or action.", color: "#fb923c" },
  { key: "lessonTheme", label: "Lesson / Theme", description: "The core truth or wisdom this story teaches.", color: "#c084fc" },
  { key: "endingTransformation", label: "Ending Transformation", description: "How has the player changed by the end of the story?", color: "#38bdf8" },
  { key: "symbolicObject", label: "Symbolic Object / Detail", description: "A meaningful object, image, or recurring motif that carries emotional weight.", color: "#f9a8d4" },
  { key: "parentResonanceNote", label: "Parent Resonance Note", description: "What in this story will land most powerfully for parents reading it?", color: "#86efac" },
  { key: "coachResonanceNote", label: "Coach Resonance Note", description: "What in this story will resonate with their coach's view of the player?", color: "#93c5fd" },
];

function SourceHints({ journeyResponses }: { journeyResponses: any[] }) {
  return (
    <div className="text-white/30 text-[11px] leading-relaxed">
      {journeyResponses.slice(0, 2).map((r) => (
        <div key={r.id} className="flex gap-2 mt-1">
          <span className="text-violet-500/60 flex-shrink-0">›</span>
          <span className="italic">"{r.answerText.slice(0, 80)}{r.answerText.length > 80 ? "…" : ""}"</span>
        </div>
      ))}
    </div>
  );
}

export default function BlueprintEditor() {
  const [, params] = useRoute("/internal/stories/:playerId/blueprint");
  const playerId = params?.playerId ?? "";
  const [, navigate] = useLocation();

  const [blueprint, setBlueprint] = useState<Partial<StoryBlueprint>>({});
  const [player, setPlayer] = useState<PlayerProfile | null>(null);
  const [journeyResponses, setJourneyResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [showHints, setShowHints] = useState<string | null>(null);

  useEffect(() => {
    if (!playerId) return;
    Promise.all([
      fetchBlueprint(playerId),
      fetchPlayerProfile(playerId),
    ])
      .then(([bpData, profileData]) => {
        setBlueprint(bpData.blueprint ?? {});
        setPlayer(profileData.player);
        setJourneyResponses(profileData.journeyResponses);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [playerId]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setSaved(false);
    try {
      const result = await saveBlueprint(playerId, blueprint);
      setBlueprint(result.blueprint);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }, [playerId, blueprint]);

  const update = (key: keyof StoryBlueprint, value: string) => {
    setBlueprint((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  // Auto-save with debounce
  useEffect(() => {
    if (!player) return;
    const t = setTimeout(() => {
      const hasContent = Object.values(blueprint).some((v) => v && typeof v === "string" && v.trim().length > 0);
      if (hasContent) handleSave();
    }, 2500);
    return () => clearTimeout(t);
  }, [blueprint]);

  if (loading) return (
    <InternalLayout>
      <div className="flex items-center justify-center py-32">
        <Loader2 size={24} className="text-violet-400 animate-spin" />
      </div>
    </InternalLayout>
  );

  return (
    <InternalLayout playerId={playerId} playerName={player?.playerName}>
      <div className="max-w-3xl space-y-5">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          <button
            onClick={() => navigate(`/internal/stories/${playerId}/profile`)}
            className="flex items-center gap-1.5 text-white/30 hover:text-white/60 text-xs mb-4 transition-colors"
          >
            <ArrowLeft size={12} />
            Player Profile
          </button>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold text-white">Story Blueprint</h1>
              <p className="text-white/40 text-sm mt-1">
                {player?.playerName} · {player?.academyName}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {saved && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-emerald-400 text-xs"
                >
                  Saved ✓
                </motion.span>
              )}
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-violet-300 border border-violet-500/30 hover:bg-violet-500/10 transition-all disabled:opacity-50"
              >
                {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                Save Blueprint
              </button>
            </div>
          </div>
        </motion.div>

        <div className="rounded-xl border border-violet-500/20 p-4 text-white/50 text-sm" style={{ background: "rgba(167,139,250,0.04)" }}>
          <p>The blueprint is your creative foundation. Prefill from intake data where helpful, but rewrite everything in your own editorial voice. The author writes the story — this is a guide, not a constraint.</p>
        </div>

        {error && (
          <div className="rounded-xl p-3 text-red-400 text-sm border border-red-500/20" style={{ background: "rgba(239,68,68,0.06)" }}>
            {error}
          </div>
        )}

        <div className="space-y-4">
          {BLUEPRINT_FIELDS.map((field, i) => {
            const relatedResponses = journeyResponses.filter((r) =>
              r.answerText?.trim().length > 5
            ).slice(i * 2, i * 2 + 3);

            return (
              <motion.div
                key={field.key}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="rounded-xl border border-white/[0.06] overflow-hidden"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                <div className="px-4 pt-4 pb-2">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: field.color }} />
                      <label className="text-white font-semibold text-sm">{field.label}</label>
                    </div>
                    <button
                      onClick={() => setShowHints(showHints === field.key ? null : field.key)}
                      className="flex items-center gap-1 text-white/20 hover:text-white/50 transition-colors text-[11px] flex-shrink-0"
                    >
                      <Info size={11} />
                      Source hints
                    </button>
                  </div>
                  <p className="text-white/35 text-xs leading-relaxed ml-3.5">{field.description}</p>
                </div>

                {showHints === field.key && relatedResponses.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mx-4 mb-2 p-3 rounded-lg border border-white/[0.05] overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.02)" }}
                  >
                    <div className="text-white/25 text-[10px] uppercase tracking-widest mb-1.5">Player responses</div>
                    <SourceHints journeyResponses={relatedResponses} />
                  </motion.div>
                )}

                <div className="px-4 pb-4">
                  <textarea
                    value={(blueprint[field.key] as string) ?? ""}
                    onChange={(e) => update(field.key, e.target.value)}
                    placeholder={`Write the ${field.label.toLowerCase()} for this player…`}
                    rows={3}
                    className="w-full bg-transparent text-white/80 text-sm placeholder-white/20 resize-none focus:outline-none leading-relaxed"
                    style={{ minHeight: 72 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="flex justify-between items-center pt-2 pb-6">
          <button
            onClick={() => navigate(`/internal/stories/${playerId}/profile`)}
            className="flex items-center gap-1.5 text-white/30 hover:text-white/60 text-sm transition-colors"
          >
            <ArrowLeft size={13} />
            Back to Profile
          </button>
          <button
            onClick={() => navigate(`/internal/stories/${playerId}/builder`)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white border border-white/10 hover:bg-white/5 transition-all"
          >
            Story Builder
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </InternalLayout>
  );
}
