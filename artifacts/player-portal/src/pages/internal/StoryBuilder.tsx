import { useState, useEffect, useCallback, useRef } from "react";
import { useRoute, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Save,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Zap,
  AlertCircle,
  TrendingUp,
  Lightbulb,
  Flag,
  CheckCircle2,
  Lock,
  Layout,
  Image,
  Type,
  AlignLeft,
  PanelLeftOpen,
  PanelRightOpen,
  Settings,
  BookMarked,
  Columns,
  SplitSquareHorizontal,
  SplitSquareVertical,
  Maximize2,
  LayoutGrid,
  Info,
  ChevronsRight,
} from "lucide-react";
import { InternalLayout } from "@/layouts/InternalLayout";
import {
  fetchScenes,
  saveScene,
  fetchBlueprint,
  fetchPlayerProfile,
  fetchProject,
  updateProject,
  getStatusMeta,
  type StoryScene,
  type StoryBlueprint,
  type PlayerProfile,
} from "@/lib/internalApi";
import { Send } from "lucide-react";

const ACCENT = "#a78bfa";
const BG_CANVAS = "#f8f5f0";
const BG_PAGE = "#fdfcf9";

const SCENE_DEFS = [
  {
    number: 1,
    title: "The Vision",
    icon: Flag,
    color: "#a78bfa",
    purpose: "Introduce the player's dream, identity, world, and what they want.",
    emotionalBeat: "Hope · Ambition · Belonging",
    prompts: [
      "What position do they play and why does it suit them?",
      "What does their best game feel like?",
      "What do they picture when they close their eyes and dream?",
    ],
  },
  {
    number: 2,
    title: "The Storm",
    icon: AlertCircle,
    color: "#f97316",
    purpose: "Introduce challenge, pressure, disappointment, or conflict.",
    emotionalBeat: "Tension · Doubt · Frustration",
    prompts: [
      "What is their recurring pressure point?",
      "What has gone wrong this season?",
      "Who or what feels like an obstacle?",
    ],
  },
  {
    number: 3,
    title: "Rock Bottom",
    icon: AlertCircle,
    color: "#ef4444",
    purpose: "Show the lowest point, fracture, doubt, or hardest test.",
    emotionalBeat: "Vulnerability · Isolation · Inner conflict",
    prompts: [
      "What is the moment of hardest self-doubt?",
      "What did they nearly give up?",
      "What feels most unfair or invisible about their situation?",
    ],
  },
  {
    number: 4,
    title: "The Rise",
    icon: TrendingUp,
    color: "#34d399",
    purpose: "Show support, change, action, or new belief beginning to form.",
    emotionalBeat: "Connection · Shift · Quiet momentum",
    prompts: [
      "Who helped them or believed in them?",
      "What changed — even slightly?",
      "What small action did they take?",
    ],
  },
  {
    number: 5,
    title: "The Breakthrough",
    icon: Zap,
    color: "#fbbf24",
    purpose: "The moment everything shifts. The test is passed. The new belief is proven.",
    emotionalBeat: "Catharsis · Clarity · Power",
    prompts: [
      "What is the moment that proves they've grown?",
      "What do they say, do, or realise?",
      "What does it feel like in the body?",
    ],
  },
  {
    number: 6,
    title: "A New Chapter",
    icon: Lightbulb,
    color: "#38bdf8",
    purpose: "Close the story with identity confirmed, future open, legacy beginning.",
    emotionalBeat: "Gratitude · Pride · Legacy",
    prompts: [
      "What does the future look like now?",
      "What would they say to a younger player?",
      "What has this journey proved about who they are?",
    ],
  },
];

type PageLayout = "text-only" | "image-top" | "image-bottom" | "image-left" | "image-right" | "full-image";
type BookFormat = "a5" | "square" | "a4";

const BOOK_FORMATS: { key: BookFormat; label: string; desc: string; w: number; h: number }[] = [
  { key: "a5", label: "A5", desc: "U13+ standard", w: 148, h: 210 },
  { key: "square", label: "Square", desc: "U9 picture book", w: 210, h: 210 },
  { key: "a4", label: "A4", desc: "Premium large", w: 210, h: 297 },
];

const PAGE_LAYOUTS: { key: PageLayout; label: string; icon: React.ReactNode }[] = [
  { key: "text-only", label: "Text only", icon: <Type size={14} /> },
  { key: "image-top", label: "Image top", icon: <AlignLeft size={14} style={{ transform: "rotate(180deg)" }} /> },
  { key: "image-bottom", label: "Image bottom", icon: <AlignLeft size={14} /> },
  { key: "image-left", label: "Image left", icon: <SplitSquareHorizontal size={14} /> },
  { key: "image-right", label: "Image right", icon: <Columns size={14} /> },
  { key: "full-image", label: "Full image", icon: <Maximize2 size={14} /> },
];

function wordCount(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

interface PageCanvasProps {
  scene: StoryScene;
  layout: PageLayout;
  format: BookFormat;
  onTextChange: (t: string) => void;
  saving: boolean;
}

function PageCanvas({ scene, layout, format, onTextChange, saving }: PageCanvasProps) {
  const fmt = BOOK_FORMATS.find((f) => f.key === format) ?? BOOK_FORMATS[0];
  const aspectRatio = fmt.w / fmt.h;

  const MARGIN = 16;
  const BLEED = 8;

  const text = scene.manuscript || "";
  const wc = wordCount(text);

  const PageContent = () => {
    const textArea = (
      <textarea
        className="w-full resize-none outline-none text-[#1a1a2a] leading-relaxed placeholder:text-gray-300"
        style={{
          fontFamily: "'Georgia', 'Times New Roman', serif",
          fontSize: 14,
          lineHeight: 1.75,
          background: "transparent",
          flex: 1,
          minHeight: 80,
        }}
        placeholder="Begin writing here…"
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
      />
    );

    const imageArea = (
      <div
        className="flex items-center justify-center rounded-xl border-2 border-dashed flex-shrink-0"
        style={{ borderColor: "rgba(0,0,0,0.1)", background: "rgba(0,0,0,0.025)", minHeight: 120 }}
      >
        <div className="flex flex-col items-center gap-2 text-gray-300 select-none">
          <Image size={24} />
          <span className="text-xs">Illustration placeholder</span>
          {scene.imageUrl && (
            <img src={scene.imageUrl} alt="scene" className="max-w-full max-h-48 rounded-lg mt-2" />
          )}
        </div>
      </div>
    );

    if (layout === "text-only") {
      return <div className="flex-1 flex flex-col overflow-auto">{textArea}</div>;
    }
    if (layout === "image-top") {
      return (
        <div className="flex-1 flex flex-col gap-3 overflow-auto">
          {imageArea}
          {textArea}
        </div>
      );
    }
    if (layout === "image-bottom") {
      return (
        <div className="flex-1 flex flex-col gap-3 overflow-auto">
          {textArea}
          {imageArea}
        </div>
      );
    }
    if (layout === "image-left") {
      return (
        <div className="flex-1 flex flex-row gap-3 overflow-auto">
          <div className="w-1/2">{imageArea}</div>
          <div className="w-1/2 flex flex-col">{textArea}</div>
        </div>
      );
    }
    if (layout === "image-right") {
      return (
        <div className="flex-1 flex flex-row gap-3 overflow-auto">
          <div className="w-1/2 flex flex-col">{textArea}</div>
          <div className="w-1/2">{imageArea}</div>
        </div>
      );
    }
    if (layout === "full-image") {
      return <div className="flex-1">{imageArea}</div>;
    }
    return null;
  };

  return (
    <div
      className="relative mx-auto"
      style={{
        maxWidth: 480,
        aspectRatio: aspectRatio,
      }}
    >
      {/* Bleed guides (dashed outer border) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          outline: "1.5px dashed rgba(167,139,250,0.3)",
          outlineOffset: BLEED,
          borderRadius: 4,
          zIndex: 0,
        }}
      />

      {/* Book page */}
      <div
        className="absolute inset-0 shadow-2xl flex flex-col"
        style={{
          background: BG_PAGE,
          borderRadius: 4,
          boxShadow: "0 8px 40px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.10)",
          overflow: "hidden",
        }}
      >
        {/* Page header bar */}
        <div
          className="flex-shrink-0 flex items-center justify-between px-5 py-2.5 border-b"
          style={{ borderColor: "rgba(0,0,0,0.07)" }}
        >
          <div className="flex items-center gap-2">
            <BookMarked size={13} className="text-gray-300" />
            <span className="text-xs text-gray-300 font-medium" style={{ fontFamily: "'Georgia', serif" }}>
              Chapter {scene.sceneNumber}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {saving && <Loader2 size={10} className="animate-spin text-violet-400" />}
            <span className="text-[10px] text-gray-300">{wc} words</span>
          </div>
        </div>

        {/* Printable area */}
        <div className="flex-1 flex flex-col overflow-hidden" style={{ padding: MARGIN }}>
          {/* Scene title */}
          {scene.title && (
            <div
              className="text-center font-bold text-gray-600 mb-3 flex-shrink-0"
              style={{ fontFamily: "'Georgia', serif", fontSize: 15 }}
            >
              {scene.title}
            </div>
          )}

          <div className="flex-1 flex flex-col overflow-hidden">
            <PageContent />
          </div>
        </div>

        {/* Page footer */}
        <div
          className="flex-shrink-0 flex items-center justify-center px-5 py-2 border-t"
          style={{ borderColor: "rgba(0,0,0,0.05)" }}
        >
          <span className="text-[9px] text-gray-300 tracking-widest uppercase" style={{ fontFamily: "'Georgia', serif" }}>
            {scene.sceneNumber}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function StoryBuilder() {
  const [, params] = useRoute("/internal/stories/:playerId/builder");
  const [, navigate] = useLocation();
  const playerId = params?.playerId ?? "";

  const [scenes, setScenes] = useState<StoryScene[]>([]);
  const [blueprint, setBlueprint] = useState<StoryBlueprint | null>(null);
  const [player, setPlayer] = useState<PlayerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [blueprintLocked, setBlueprintLocked] = useState(false);
  const [storyStatus, setStoryStatus] = useState<string>("draft_in_progress");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const [activeScene, setActiveScene] = useState(1);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);

  const [bookFormat, setBookFormat] = useState<BookFormat>("a5");
  const [pageLayouts, setPageLayouts] = useState<Record<number, PageLayout>>({});

  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!playerId) return;
    Promise.all([fetchScenes(playerId), fetchBlueprint(playerId), fetchProject(playerId), fetchPlayerProfile(playerId)]).then(
      ([scenesData, blueprintData, projectData, profileData]) => {
        setScenes(scenesData.scenes);
        setBlueprint(blueprintData.blueprint);
        setPlayer((profileData as any).player ?? null);
        setBlueprintLocked(!(blueprintData.blueprint?.blueprintApproved ?? false));
        const proj = projectData.project as any;
        if (proj.bookFormat) setBookFormat(proj.bookFormat as BookFormat);
        if (proj.status) {
          setStoryStatus(proj.status);
          if (["internal_review", "academy_preview", "approved", "ready_for_illustration", "illustration_in_progress", "final_ready"].includes(proj.status)) {
            setReviewSubmitted(true);
          }
        }
        const layouts: Record<number, PageLayout> = {};
        scenesData.scenes.forEach((s) => {
          if ((s as any).pageLayout) layouts[s.sceneNumber] = (s as any).pageLayout as PageLayout;
        });
        setPageLayouts(layouts);
        setLoading(false);
      }
    ).catch((err) => {
      setError(err.message || "Failed to load story");
      setLoading(false);
    });
  }, [playerId]);

  const currentScene = scenes.find((s) => s.sceneNumber === activeScene);
  const currentDef = SCENE_DEFS.find((d) => d.number === activeScene);
  const currentLayout: PageLayout = pageLayouts[activeScene] ?? "text-only";

  const handleTextChange = useCallback((text: string) => {
    setScenes((prev) =>
      prev.map((s) => (s.sceneNumber === activeScene ? { ...s, manuscript: text } : s))
    );
    setDirty(true);
    setSaved(false);

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      if (!playerId) return;
      setSaving(true);
      try {
        await saveScene(playerId, activeScene, { manuscript: text });
        setSaved(true);
        setDirty(false);
      } catch {
        // silently fail — will retry on next keystroke
      } finally {
        setSaving(false);
      }
    }, 1200);
  }, [activeScene, playerId]);

  const handleLayoutChange = async (layout: PageLayout) => {
    setPageLayouts((prev) => ({ ...prev, [activeScene]: layout }));
    try {
      await saveScene(playerId, activeScene, { pageLayout: layout } as any);
    } catch {
      // ignore
    }
  };

  const handleManualSave = async () => {
    if (!currentScene || !dirty) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    setSaving(true);
    try {
      await saveScene(playerId, activeScene, {
        manuscript: currentScene.manuscript ?? "",
        pageLayout: currentLayout,
      } as any);
      setSaved(true);
      setDirty(false);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitForReview = async () => {
    setSubmittingReview(true);
    try {
      await updateProject(playerId, { status: "internal_review" } as any);
      setStoryStatus("internal_review");
      setReviewSubmitted(true);
    } catch (err: any) {
      alert(err.message || "Failed to submit for review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const statusMeta = getStatusMeta(storyStatus);
  const chaptersWithContent = scenes.filter((s) => (s.manuscript?.trim().length ?? 0) > 100).length;
  const allChaptersWritten = chaptersWithContent >= 6;
  const canSubmitReview = allChaptersWritten && !blueprintLocked && storyStatus === "draft_in_progress" && !reviewSubmitted;

  if (loading) {
    return (
      <InternalLayout playerId={playerId}>
        <div className="flex items-center justify-center h-96 gap-3 text-white/40">
          <Loader2 size={20} className="animate-spin" />
          Loading writing room…
        </div>
      </InternalLayout>
    );
  }

  if (error) {
    return (
      <InternalLayout playerId={playerId}>
        <div className="flex flex-col items-center justify-center h-96 gap-3 text-center">
          <AlertCircle size={24} className="text-red-400" />
          <p className="text-white/60">{error}</p>
          <button onClick={() => navigate(`/internal/stories/${playerId}/blueprint`)} className="text-violet-400 text-sm underline">
            Go to Blueprint
          </button>
        </div>
      </InternalLayout>
    );
  }

  return (
    <InternalLayout playerId={playerId} playerName={player?.playerName}>
      <div className="flex flex-col h-[calc(100vh-64px)] lg:h-[calc(100vh-0px)] -m-4 md:-m-6 lg:-m-8" style={{ background: "#0a0a16" }}>

        {/* Top toolbar */}
        <div
          className="flex-shrink-0 flex items-center justify-between px-4 py-2.5 border-b gap-3"
          style={{ background: "rgba(10,10,22,0.95)", borderColor: "rgba(255,255,255,0.08)", height: 50 }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/internal/stories/${playerId}/blueprint`)}
              className="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-xs transition-colors"
            >
              <ArrowLeft size={14} />
              Blueprint
            </button>
            <span className="text-white/20 text-xs">›</span>
            <span className="text-white/60 text-xs font-medium">Writing Room</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Book format selector */}
            <div className="hidden md:flex items-center gap-1 rounded-lg p-1" style={{ background: "rgba(255,255,255,0.05)" }}>
              {BOOK_FORMATS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setBookFormat(f.key)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    bookFormat === f.key ? "text-white" : "text-white/30 hover:text-white/60"
                  }`}
                  style={bookFormat === f.key ? { background: ACCENT } : {}}
                  title={`${f.label} — ${f.desc}`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setLeftOpen((v) => !v)}
              className={`p-1.5 rounded-lg transition-all ${leftOpen ? "text-violet-300" : "text-white/30 hover:text-white/60"}`}
              style={leftOpen ? { background: `${ACCENT}18` } : {}}
              title="Toggle chapter navigator"
            >
              <PanelLeftOpen size={15} />
            </button>
            <button
              onClick={() => setRightOpen((v) => !v)}
              className={`p-1.5 rounded-lg transition-all ${rightOpen ? "text-violet-300" : "text-white/30 hover:text-white/60"}`}
              style={rightOpen ? { background: `${ACCENT}18` } : {}}
              title="Toggle reference panel"
            >
              <PanelRightOpen size={15} />
            </button>

            <div className="w-px h-4 bg-white/10 mx-1" />

            {/* Story status badge */}
            <div
              className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border"
              style={{ background: `${statusMeta.color}15`, color: statusMeta.color, borderColor: `${statusMeta.color}35` }}
            >
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: statusMeta.color }} />
              <span className="hidden md:inline">{statusMeta.label}</span>
            </div>

            <div className="w-px h-4 bg-white/10 mx-1" />

            <button
              onClick={handleManualSave}
              disabled={saving || !dirty}
              className={`flex items-center gap-1.5 text-xs font-semibold rounded-xl px-3 py-1.5 transition-all ${
                saved ? "text-green-400" : dirty ? "text-white" : "text-white/30"
              }`}
              style={dirty ? { background: `${ACCENT}20`, border: `1px solid ${ACCENT}40` } : { border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {saving ? <Loader2 size={12} className="animate-spin" /> : saved ? <CheckCircle2 size={12} /> : <Save size={12} />}
              {saving ? "Saving…" : saved ? "Saved" : "Save"}
            </button>
          </div>
        </div>

        {/* Blueprint locked banner */}
        {blueprintLocked && (
          <div className="flex-shrink-0 flex items-center justify-center gap-2.5 px-4 py-2.5 text-sm"
            style={{ background: "rgba(234,179,8,0.08)", borderBottom: "1px solid rgba(234,179,8,0.15)" }}>
            <Lock size={14} className="text-amber-400" />
            <span className="text-amber-300/80">Blueprint not yet approved — an editor must approve it before writing is unlocked</span>
            <button
              onClick={() => navigate(`/internal/stories/${playerId}/blueprint`)}
              className="flex items-center gap-1 text-amber-400 hover:text-amber-300 text-xs underline transition-colors"
            >
              View Blueprint <ChevronsRight size={12} />
            </button>
          </div>
        )}

        {/* Main 3-column area */}
        <div className="flex-1 flex overflow-hidden">

          {/* Left: Chapter Navigator */}
          <AnimatePresence initial={false}>
            {leftOpen && (
              <motion.aside
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 220, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ type: "spring", damping: 28, stiffness: 280 }}
                className="flex-shrink-0 flex flex-col border-r overflow-hidden"
                style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(8,8,16,0.8)" }}
              >
                <div className="px-3 pt-4 pb-2 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                  <div className="flex items-center gap-2">
                    <LayoutGrid size={13} className="text-violet-400" />
                    <span className="text-white/60 text-xs font-semibold uppercase tracking-widest">Chapters</span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
                  {SCENE_DEFS.map((def) => {
                    const scene = scenes.find((s) => s.sceneNumber === def.number);
                    const wc = wordCount(scene?.manuscript || "");
                    const isActive = activeScene === def.number;
                    const Icon = def.icon;

                    return (
                      <button
                        key={def.number}
                        onClick={() => setActiveScene(def.number)}
                        className={`w-full text-left rounded-xl px-3 py-2.5 transition-all group ${
                          isActive ? "" : "hover:bg-white/4"
                        }`}
                        style={isActive ? { background: `${ACCENT}12`, border: `1px solid ${ACCENT}25` } : { border: "1px solid transparent" }}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: `${def.color}20` }}
                          >
                            <Icon size={11} style={{ color: def.color }} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className={`text-xs font-semibold truncate ${isActive ? "text-violet-300" : "text-white/60"}`}>
                              {def.title}
                            </div>
                            <div className="text-[10px] text-white/25 mt-0.5">
                              {wc > 0 ? `${wc} words` : "Empty"}
                            </div>
                          </div>
                          {wc > 0 && (
                            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: def.color }} />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex-shrink-0 border-t p-3 space-y-2" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                  <div className="text-[10px] text-white/20 text-center">
                    {scenes.reduce((a, s) => a + wordCount(s.manuscript || ""), 0).toLocaleString()} total words
                  </div>
                  {/* Chapter completion indicator */}
                  <div className="flex gap-0.5 justify-center">
                    {[1, 2, 3, 4, 5, 6].map((n) => {
                      const sc = scenes.find((s) => s.sceneNumber === n);
                      const hasContent = (sc?.manuscript?.trim().length ?? 0) > 100;
                      return (
                        <div
                          key={n}
                          className="h-1 flex-1 rounded-full transition-colors"
                          style={{ backgroundColor: hasContent ? ACCENT : "rgba(255,255,255,0.1)" }}
                        />
                      );
                    })}
                  </div>
                  <div className="text-[10px] text-white/20 text-center">{chaptersWithContent}/6 chapters written</div>
                  {/* Submit for Review CTA */}
                  {canSubmitReview && (
                    <button
                      onClick={handleSubmitForReview}
                      disabled={submittingReview}
                      className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-white transition-all"
                      style={{ background: `${ACCENT}30`, border: `1px solid ${ACCENT}50` }}
                    >
                      {submittingReview ? <Loader2 size={11} className="animate-spin" /> : <Send size={11} />}
                      Submit for Review
                    </button>
                  )}
                  {reviewSubmitted && storyStatus !== "draft_in_progress" && (
                    <div
                      className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold"
                      style={{ background: `${statusMeta.color}20`, color: statusMeta.color, border: `1px solid ${statusMeta.color}35` }}
                    >
                      <CheckCircle2 size={11} />
                      {statusMeta.label}
                    </div>
                  )}
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Center: Writing Canvas */}
          <div className="flex-1 flex flex-col overflow-hidden" style={{ background: BG_CANVAS }}>
            {/* Layout selector bar */}
            <div
              className="flex-shrink-0 flex items-center gap-1 px-4 py-2.5 border-b"
              style={{ background: "rgba(248,245,240,0.95)", borderColor: "rgba(0,0,0,0.08)" }}
            >
              <span className="text-xs text-gray-400 mr-1.5 font-medium">Layout:</span>
              {PAGE_LAYOUTS.map((pl) => (
                <button
                  key={pl.key}
                  onClick={() => handleLayoutChange(pl.key)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    currentLayout === pl.key
                      ? "text-white"
                      : "text-gray-400 hover:text-gray-700 hover:bg-black/5"
                  }`}
                  style={currentLayout === pl.key ? { background: ACCENT } : {}}
                  title={pl.label}
                >
                  {pl.icon}
                  <span className="hidden sm:inline">{pl.label}</span>
                </button>
              ))}

              {/* Chapter nav arrows */}
              <div className="ml-auto flex items-center gap-1">
                <button
                  onClick={() => setActiveScene((v) => Math.max(1, v - 1))}
                  disabled={activeScene === 1}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-black/5 disabled:opacity-30 transition-all"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="text-gray-400 text-xs px-1">
                  {activeScene} / {SCENE_DEFS.length}
                </span>
                <button
                  onClick={() => setActiveScene((v) => Math.min(SCENE_DEFS.length, v + 1))}
                  disabled={activeScene === SCENE_DEFS.length}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-black/5 disabled:opacity-30 transition-all"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* Book page canvas */}
            <div className="flex-1 overflow-auto flex items-center justify-center p-8 md:p-12">
              {currentScene ? (
                <div className="w-full" style={{ maxWidth: 560 }}>
                  {/* Scene label above page */}
                  <div className="flex items-center justify-center gap-2.5 mb-6">
                    {currentDef && (
                      <>
                        <div
                          className="w-6 h-6 rounded-lg flex items-center justify-center"
                          style={{ background: `${currentDef.color}20` }}
                        >
                          {(() => { const Icon = currentDef.icon; return <Icon size={12} style={{ color: currentDef.color }} />; })()}
                        </div>
                        <span className="text-sm font-semibold" style={{ color: currentDef.color }}>
                          Chapter {currentScene.sceneNumber}: {currentDef.title}
                        </span>
                        <span className="text-xs text-gray-400 italic">{currentDef.emotionalBeat}</span>
                      </>
                    )}
                  </div>

                  <PageCanvas
                    scene={currentScene}
                    layout={currentLayout}
                    format={bookFormat}
                    onTextChange={handleTextChange}
                    saving={saving}
                  />

                  {/* Word count and format info below */}
                  <div className="flex items-center justify-center gap-4 mt-5 text-xs text-gray-400">
                    <span>{wordCount(currentScene.manuscript || "")} words</span>
                    <span>·</span>
                    <span>{BOOK_FORMATS.find((f) => f.key === bookFormat)?.label} format</span>
                    <span>·</span>
                    <span className="capitalize">{currentLayout.replace(/-/g, " ")} layout</span>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400 space-y-2">
                  <BookOpen size={32} className="mx-auto opacity-30" />
                  <p className="text-sm">Select a chapter to start writing</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Reference Panel */}
          <AnimatePresence initial={false}>
            {rightOpen && (
              <motion.aside
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 280, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ type: "spring", damping: 28, stiffness: 280 }}
                className="flex-shrink-0 border-l overflow-hidden flex flex-col"
                style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(8,8,16,0.8)" }}
              >
                <div className="px-4 pt-4 pb-3 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                  <div className="flex items-center gap-2">
                    <Info size={13} className="text-violet-400" />
                    <span className="text-white/60 text-xs font-semibold uppercase tracking-widest">Scene Guide</span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
                  {currentDef && (
                    <>
                      {/* Scene purpose */}
                      <div>
                        <div className="text-[10px] text-white/25 uppercase tracking-widest mb-2 font-medium">Purpose</div>
                        <p className="text-white/60 text-xs leading-relaxed">{currentDef.purpose}</p>
                      </div>

                      {/* Writing prompts */}
                      <div>
                        <div className="text-[10px] text-white/25 uppercase tracking-widest mb-2 font-medium">Writing Prompts</div>
                        <div className="space-y-2">
                          {currentDef.prompts.map((p, i) => (
                            <div key={i} className="flex gap-2">
                              <span className="text-violet-500 text-xs mt-0.5 flex-shrink-0">›</span>
                              <p className="text-white/50 text-xs leading-relaxed">{p}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="h-px bg-white/8" />
                    </>
                  )}

                  {/* Blueprint snippets */}
                  {blueprint && (
                    <div>
                      <div className="text-[10px] text-white/25 uppercase tracking-widest mb-2.5 font-medium">Blueprint Reference</div>
                      <div className="space-y-3">
                        {[
                          { label: "Core Identity", value: blueprint.coreIdentity },
                          { label: "Emotional Challenge", value: blueprint.emotionalChallenge },
                          { label: "Hidden Strength", value: blueprint.hiddenStrength },
                          { label: "Support Figure", value: blueprint.supportFigure },
                          { label: "Turning Point", value: blueprint.turningPoint },
                          { label: "Lesson Theme", value: blueprint.lessonTheme },
                          { label: "Ending", value: blueprint.endingTransformation },
                          { label: "Symbolic Object", value: blueprint.symbolicObject },
                        ]
                          .filter((item) => item.value)
                          .map(({ label, value }) => (
                            <div key={label} className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.04)" }}>
                              <div className="text-[9px] text-white/25 uppercase tracking-wider font-semibold mb-1">{label}</div>
                              <p className="text-white/60 text-xs leading-relaxed">{value}</p>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {!blueprint && (
                    <div className="rounded-xl p-4 border text-center" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                      <BookOpen size={18} className="text-white/20 mx-auto mb-2" />
                      <p className="text-white/30 text-xs">No blueprint saved yet</p>
                      <button
                        onClick={() => navigate(`/internal/stories/${playerId}/blueprint`)}
                        className="text-violet-400 text-xs mt-2 hover:text-violet-300 transition-colors"
                      >
                        Open Blueprint Editor →
                      </button>
                    </div>
                  )}
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
        </div>
      </div>
    </InternalLayout>
  );
}
