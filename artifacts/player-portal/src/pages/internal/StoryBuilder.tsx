import { useState, useEffect, useCallback, useRef } from "react";
import { useRoute, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Save,
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Zap,
  AlertCircle,
  TrendingUp,
  Lightbulb,
  Flag,
  CheckCircle2,
} from "lucide-react";
import { InternalLayout } from "@/layouts/InternalLayout";
import {
  fetchScenes,
  saveScene,
  fetchBlueprint,
  fetchPlayerProfile,
  type StoryScene,
  type StoryBlueprint,
  type PlayerProfile,
} from "@/lib/internalApi";

const SCENE_DEFS = [
  {
    number: 1,
    title: "The Vision",
    icon: <Flag size={16} />,
    color: "#a78bfa",
    purpose: "Introduce the player's dream, identity, world, and what they want.",
    emotionalBeat: "Hope · Ambition · Belonging",
    prompts: [
      "What position do they play and why does it suit them?",
      "What does their best game feel like?",
      "What do they picture when they close their eyes and dream?",
    ],
    avoid: ["Generic football clichés", "Starting with a match description"],
  },
  {
    number: 2,
    title: "The Storm",
    icon: <AlertCircle size={16} />,
    color: "#f97316",
    purpose: "Introduce challenge, pressure, disappointment, or conflict.",
    emotionalBeat: "Tension · Doubt · Frustration",
    prompts: [
      "What is their recurring pressure point?",
      "What has gone wrong this season?",
      "Who or what feels like an obstacle?",
    ],
    avoid: ["Making the challenge too dramatic or physical", "Simplifying the emotion"],
  },
  {
    number: 3,
    title: "Rock Bottom",
    icon: <AlertCircle size={16} />,
    color: "#ef4444",
    purpose: "Show the lowest point, fracture, doubt, or hardest test.",
    emotionalBeat: "Vulnerability · Isolation · Inner conflict",
    prompts: [
      "What is the moment of hardest self-doubt?",
      "What did they nearly give up?",
      "What feels most unfair or invisible about their situation?",
    ],
    avoid: ["Physical injury as the main crisis if avoidable", "Over-dramatising"],
  },
  {
    number: 4,
    title: "The Rise",
    icon: <TrendingUp size={16} />,
    color: "#34d399",
    purpose: "Show support, change, action, or new belief beginning to form.",
    emotionalBeat: "Connection · Shift · Quiet momentum",
    prompts: [
      "Who helped them or believed in them?",
      "What small moment changed something?",
      "What did they decide to do differently?",
    ],
    avoid: ["Sudden miracle moments", "Preachy lessons"],
  },
  {
    number: 5,
    title: "Elite Wisdom",
    icon: <Lightbulb size={16} />,
    color: "#fbbf24",
    purpose: "Show the deeper lesson, truth, or wisdom gained through the journey.",
    emotionalBeat: "Clarity · Self-knowledge · Quiet confidence",
    prompts: [
      "What do they understand about themselves now?",
      "What would they tell a younger version of themselves?",
      "What is their new football truth?",
    ],
    avoid: ["Sounding like a self-help book", "Motivational poster clichés"],
  },
  {
    number: 6,
    title: "Next Level",
    icon: <CheckCircle2 size={16} />,
    color: "#60a5fa",
    purpose: "End with transformation, momentum, and future promise.",
    emotionalBeat: "Determination · Possibility · Earned optimism",
    prompts: [
      "What are they moving toward?",
      "What is their next challenge or goal?",
      "How have they changed?",
    ],
    avoid: ["Unrealistic promises", "Tying everything up too neatly"],
  },
];

interface SceneCardProps {
  def: typeof SCENE_DEFS[0];
  scene: StoryScene;
  blueprint: Partial<StoryBlueprint> | null;
  onSave: (sceneNumber: number, fields: Partial<StoryScene>) => Promise<void>;
}

function SceneCard({ def, scene, blueprint, onSave }: SceneCardProps) {
  const [open, setOpen] = useState(false);
  const [manuscript, setManuscript] = useState(scene.manuscript ?? "");
  const [notes, setNotes] = useState(scene.sceneNotes ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const saveTimeout = useRef<ReturnType<typeof setTimeout>>();

  const wordCount = manuscript.trim().split(/\s+/).filter(Boolean).length;
  const hasContent = manuscript.trim().length > 0;

  const doSave = useCallback(async () => {
    setSaving(true);
    setSaved(false);
    try {
      await onSave(def.number, { manuscript, sceneNotes: notes });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }, [def.number, manuscript, notes, onSave]);

  const handleChange = (val: string, type: "manuscript" | "notes") => {
    if (type === "manuscript") setManuscript(val);
    else setNotes(val);
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(doSave, 2000);
  };

  return (
    <div
      className="rounded-2xl border overflow-hidden transition-all"
      style={{
        borderColor: open ? `${def.color}40` : "rgba(255,255,255,0.06)",
        background: open ? `linear-gradient(135deg, ${def.color}06 0%, rgba(255,255,255,0.02) 100%)` : "rgba(255,255,255,0.02)",
      }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between p-5 transition-colors hover:bg-white/[0.02]"
      >
        <div className="flex items-center gap-4">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${def.color}18`, color: def.color }}
          >
            {def.icon}
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-white/30 text-[11px] font-semibold uppercase tracking-widest">Scene {def.number}</span>
              {hasContent && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/70" />}
            </div>
            <div className="text-white font-bold text-base">{def.title}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {hasContent && <span className="text-white/30 text-xs">{wordCount}w</span>}
          {saved && <span className="text-emerald-400 text-xs">Saved ✓</span>}
          {saving && <Loader2 size={12} className="text-violet-400 animate-spin" />}
          {open ? <ChevronDown size={16} className="text-white/30" /> : <ChevronRight size={16} className="text-white/30" />}
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/[0.05]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                {/* Left: Guidance panel */}
                <div className="md:col-span-1 p-5 border-r border-white/[0.05] space-y-4">
                  <div>
                    <div className="text-white/30 text-[10px] uppercase tracking-widest mb-1">Section Purpose</div>
                    <p className="text-white/60 text-xs leading-relaxed">{def.purpose}</p>
                  </div>
                  <div>
                    <div className="text-white/30 text-[10px] uppercase tracking-widest mb-1">Emotional Beat</div>
                    <p className="text-xs" style={{ color: def.color }}>{def.emotionalBeat}</p>
                  </div>
                  <div>
                    <div className="text-white/30 text-[10px] uppercase tracking-widest mb-2">Prompts</div>
                    <ul className="space-y-1.5">
                      {def.prompts.map((p) => (
                        <li key={p} className="text-white/50 text-xs flex gap-1.5">
                          <span style={{ color: def.color }}>›</span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-white/30 text-[10px] uppercase tracking-widest mb-2">Avoid</div>
                    <ul className="space-y-1">
                      {def.avoid.map((a) => (
                        <li key={a} className="text-white/30 text-xs flex gap-1.5">
                          <span className="text-red-400/50">✗</span>
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {blueprint && (
                    <div className="rounded-lg p-3 border border-white/[0.06]" style={{ background: "rgba(255,255,255,0.02)" }}>
                      <div className="text-white/25 text-[10px] uppercase tracking-widest mb-2">From Blueprint</div>
                      {blueprint.coreIdentity && (
                        <div className="text-white/40 text-xs mb-1">
                          <span className="text-white/25">Identity: </span>{blueprint.coreIdentity.slice(0, 60)}…
                        </div>
                      )}
                      {blueprint.emotionalChallenge && (
                        <div className="text-white/40 text-xs">
                          <span className="text-white/25">Challenge: </span>{blueprint.emotionalChallenge.slice(0, 60)}…
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Right: Writing area */}
                <div className="md:col-span-2 p-5 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-white/50 text-xs font-semibold uppercase tracking-widest">Manuscript</label>
                      <div className="flex items-center gap-2 text-white/25 text-xs">
                        <BookOpen size={11} />
                        {wordCount} words
                      </div>
                    </div>
                    <textarea
                      value={manuscript}
                      onChange={(e) => handleChange(e.target.value, "manuscript")}
                      placeholder={`Begin writing ${def.title}…\n\nThe author writes. The system supports structure — not story.`}
                      className="w-full bg-transparent text-white/80 text-sm placeholder-white/15 resize-none focus:outline-none leading-relaxed font-serif"
                      style={{ minHeight: 280 }}
                    />
                  </div>

                  <div className="border-t border-white/[0.05] pt-4">
                    <label className="text-white/30 text-xs uppercase tracking-widest mb-2 block">Scene Notes (internal)</label>
                    <textarea
                      value={notes}
                      onChange={(e) => handleChange(e.target.value, "notes")}
                      placeholder="Private notes, reminders, illustration cues…"
                      className="w-full bg-transparent text-white/50 text-xs placeholder-white/15 resize-none focus:outline-none leading-relaxed"
                      style={{ minHeight: 60 }}
                    />
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={doSave}
                      disabled={saving}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-violet-300 border border-violet-500/30 hover:bg-violet-500/10 transition-all disabled:opacity-50"
                    >
                      {saving ? <Loader2 size={11} className="animate-spin" /> : <Save size={11} />}
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function StoryBuilder() {
  const [, params] = useRoute("/internal/stories/:playerId/builder");
  const playerId = params?.playerId ?? "";
  const [, navigate] = useLocation();

  const [scenes, setScenes] = useState<StoryScene[]>([]);
  const [blueprint, setBlueprint] = useState<Partial<StoryBlueprint> | null>(null);
  const [player, setPlayer] = useState<PlayerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!playerId) return;
    Promise.all([
      fetchScenes(playerId),
      fetchBlueprint(playerId),
      fetchPlayerProfile(playerId),
    ])
      .then(([scenesData, bpData, profileData]) => {
        setScenes(scenesData.scenes);
        setBlueprint(bpData.blueprint);
        setPlayer(profileData.player);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [playerId]);

  const handleSaveScene = async (sceneNumber: number, fields: Partial<StoryScene>) => {
    const result = await saveScene(playerId, sceneNumber, fields);
    setScenes((prev) => prev.map((s) => (s.sceneNumber === sceneNumber ? result.scene : s)));
  };

  const totalWords = scenes.reduce((acc, s) => {
    return acc + (s.manuscript?.trim().split(/\s+/).filter(Boolean).length ?? 0);
  }, 0);

  const completedScenes = scenes.filter((s) => s.manuscript && s.manuscript.trim().length > 50).length;

  if (loading) return (
    <InternalLayout>
      <div className="flex items-center justify-center py-32">
        <Loader2 size={24} className="text-violet-400 animate-spin" />
      </div>
    </InternalLayout>
  );

  return (
    <InternalLayout playerId={playerId} playerName={player?.playerName}>
      <div className="space-y-5 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          <button
            onClick={() => navigate(`/internal/stories/${playerId}/blueprint`)}
            className="flex items-center gap-1.5 text-white/30 hover:text-white/60 text-xs mb-4 transition-colors"
          >
            <ArrowLeft size={12} />
            Blueprint
          </button>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Story Builder</h1>
              <p className="text-white/40 text-sm mt-1">
                {player?.playerName} · {player?.academyName}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-3">
                <div className="text-center">
                  <div className="text-white font-bold text-lg">{completedScenes}/6</div>
                  <div className="text-white/30 text-[10px] uppercase tracking-wide">Scenes</div>
                </div>
                <div className="text-center">
                  <div className="text-white font-bold text-lg">{totalWords.toLocaleString()}</div>
                  <div className="text-white/30 text-[10px] uppercase tracking-wide">Words</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            {SCENE_DEFS.map((def) => {
              const scene = scenes.find((s) => s.sceneNumber === def.number);
              const hasContent = scene?.manuscript && scene.manuscript.trim().length > 50;
              return (
                <div key={def.number} className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: hasContent ? "100%" : "0%", background: def.color }}
                  />
                </div>
              );
            })}
          </div>
        </motion.div>

        {error && (
          <div className="rounded-xl p-3 text-red-400 text-sm border border-red-500/20" style={{ background: "rgba(239,68,68,0.06)" }}>
            {error}
          </div>
        )}

        <div className="rounded-xl border border-violet-500/20 p-4 text-white/40 text-sm" style={{ background: "rgba(167,139,250,0.03)" }}>
          <div className="flex items-start gap-2">
            <Zap size={14} className="text-violet-400 mt-0.5 flex-shrink-0" />
            <p>The author writes the story. This structure is a guide — not a constraint. Work in any order. Each scene auto-saves after two seconds of inactivity.</p>
          </div>
        </div>

        <div className="space-y-3">
          {SCENE_DEFS.map((def) => {
            const scene = scenes.find((s) => s.sceneNumber === def.number);
            if (!scene) return null;
            return (
              <motion.div
                key={def.number}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: def.number * 0.05 }}
              >
                <SceneCard
                  def={def}
                  scene={scene}
                  blueprint={blueprint}
                  onSave={handleSaveScene}
                />
              </motion.div>
            );
          })}
        </div>

        <div className="flex justify-between items-center pt-2 pb-8">
          <button
            onClick={() => navigate(`/internal/stories/${playerId}/blueprint`)}
            className="flex items-center gap-1.5 text-white/30 hover:text-white/60 text-sm transition-colors"
          >
            <ArrowLeft size={13} />
            Back to Blueprint
          </button>
          <button
            onClick={() => navigate(`/internal/stories/${playerId}/illustrations`)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white border border-white/10 hover:bg-white/5 transition-all"
          >
            Illustrations
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </InternalLayout>
  );
}
