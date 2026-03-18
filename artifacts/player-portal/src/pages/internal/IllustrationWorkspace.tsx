import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  Loader2,
  Plus,
  CheckCircle2,
  Clock,
  ExternalLink,
  ArrowLeft,
  ChevronRight,
  Image,
  Pencil,
  X,
  Lock,
} from "lucide-react";
import { InternalLayout } from "@/layouts/InternalLayout";
import {
  fetchIllustrations,
  addIllustrationAsset,
  updateIllustrationAsset,
  fetchPlayerProfile,
  fetchProject,
  getStatusMeta,
  type IllustrationAsset,
  type PlayerProfile,
} from "@/lib/internalApi";

const ASSET_TYPES = [
  { value: "player_portrait", label: "Player Portrait", color: "#a78bfa" },
  { value: "kit_reference", label: "Kit Reference", color: "#f59e0b" },
  { value: "family_home", label: "Family / Home", color: "#34d399" },
  { value: "scene_illustration", label: "Scene Illustration", color: "#60a5fa" },
  { value: "reference_image", label: "Reference Image", color: "#94a3b8" },
  { value: "voice_note", label: "Voice Note", color: "#ec4899" },
];

const SCENES = [
  { number: 1, title: "The Vision" },
  { number: 2, title: "The Storm" },
  { number: 3, title: "Rock Bottom" },
  { number: 4, title: "The Rise" },
  { number: 5, title: "Elite Wisdom" },
  { number: 6, title: "Next Level" },
];

function AssetCard({ asset, onUpdate }: { asset: IllustrationAsset; onUpdate: (id: number, updates: any) => void }) {
  const [editing, setEditing] = useState(false);
  const [notes, setNotes] = useState(asset.illustratorNotes ?? "");
  const typeMeta = ASSET_TYPES.find((t) => t.value === asset.assetType) ?? { label: asset.assetType, color: "#94a3b8" };
  const sceneMeta = asset.sceneNumber ? SCENES.find((s) => s.number === asset.sceneNumber) : null;

  return (
    <div
      className="rounded-xl border p-4 space-y-3 transition-all"
      style={{
        borderColor: asset.approved ? "rgba(52,211,153,0.3)" : "rgba(255,255,255,0.06)",
        background: asset.approved ? "rgba(52,211,153,0.03)" : "rgba(255,255,255,0.02)",
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${typeMeta.color}18`, color: typeMeta.color }}>
            <Image size={16} />
          </div>
          <div className="min-w-0">
            <div className="text-white font-semibold text-sm truncate">{asset.fileName || "Untitled Asset"}</div>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: `${typeMeta.color}18`, color: typeMeta.color }}>
                {typeMeta.label}
              </span>
              {sceneMeta && (
                <span className="text-[10px] px-1.5 py-0.5 rounded text-blue-300" style={{ background: "rgba(96,165,250,0.12)" }}>
                  Scene {sceneMeta.number}: {sceneMeta.title}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => onUpdate(asset.id, { approved: !asset.approved })}
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg border transition-all ${
              asset.approved
                ? "text-emerald-300 border-emerald-500/30"
                : "text-white/30 border-white/10 hover:text-emerald-300 hover:border-emerald-500/30"
            }`}
          >
            <CheckCircle2 size={11} />
            {asset.approved ? "Approved" : "Approve"}
          </button>
          <button
            onClick={() => setEditing((v) => !v)}
            className="text-white/30 hover:text-white/60 transition-colors p-1"
          >
            {editing ? <X size={13} /> : <Pencil size={13} />}
          </button>
        </div>
      </div>

      {asset.driveLink && (
        <a
          href={asset.driveLink}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 transition-colors"
        >
          <ExternalLink size={11} />
          Open in Google Drive
        </a>
      )}

      {editing && (
        <div className="space-y-2 pt-1 border-t border-white/[0.05]">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Illustrator notes…"
            rows={2}
            className="w-full bg-transparent text-white/60 text-xs placeholder-white/20 resize-none focus:outline-none border border-white/[0.06] rounded-lg p-2.5"
          />
          <div className="flex gap-2">
            <select
              value={asset.assetType}
              onChange={(e) => onUpdate(asset.id, { assetType: e.target.value })}
              className="flex-1 text-xs text-white/60 bg-transparent border border-white/[0.06] rounded-lg px-2 py-1.5 focus:outline-none"
            >
              {ASSET_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <select
              value={asset.sceneNumber ?? ""}
              onChange={(e) => onUpdate(asset.id, { sceneNumber: e.target.value ? parseInt(e.target.value) : null })}
              className="flex-1 text-xs text-white/60 bg-transparent border border-white/[0.06] rounded-lg px-2 py-1.5 focus:outline-none"
            >
              <option value="">No scene</option>
              {SCENES.map((s) => <option key={s.number} value={s.number}>Scene {s.number}: {s.title}</option>)}
            </select>
            <button
              onClick={() => { onUpdate(asset.id, { illustratorNotes: notes }); setEditing(false); }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-violet-300 border border-violet-500/30 hover:bg-violet-500/10 transition-all"
            >
              Save
            </button>
          </div>
        </div>
      )}

      <div className="text-white/20 text-[10px]">
        Added {new Date(asset.createdAt).toLocaleDateString("en-GB")}
      </div>
    </div>
  );
}

export default function IllustrationWorkspace() {
  const [, params] = useRoute("/internal/stories/:playerId/illustrations");
  const playerId = params?.playerId ?? "";
  const [, navigate] = useLocation();

  const [assets, setAssets] = useState<IllustrationAsset[]>([]);
  const [player, setPlayer] = useState<PlayerProfile | null>(null);
  const [media, setMedia] = useState<{ images: string[]; voiceNotes: any[] }>({ images: [], voiceNotes: [] });
  const [storyStatus, setStoryStatus] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newAsset, setNewAsset] = useState({ fileName: "", driveLink: "", assetType: "reference_image", sceneNumber: "", illustratorNotes: "" });
  const [adding, setAdding] = useState(false);

  const ILLUSTRATION_STATUSES = ["ready_for_illustration", "illustration_in_progress", "final_ready"];

  useEffect(() => {
    if (!playerId) return;
    Promise.all([
      fetchIllustrations(playerId),
      fetchPlayerProfile(playerId),
      fetchProject(playerId),
    ])
      .then(([illData, profileData, projectData]) => {
        setAssets(illData.assets);
        setPlayer(profileData.player);
        setMedia(profileData.media);
        setStoryStatus((projectData.project as any).status ?? "");
      })
      .finally(() => setLoading(false));
  }, [playerId]);

  const handleUpdate = async (id: number, updates: any) => {
    const result = await updateIllustrationAsset(playerId, id, updates);
    setAssets((prev) => prev.map((a) => (a.id === id ? result.asset : a)));
  };

  const handleAdd = async () => {
    if (!newAsset.fileName && !newAsset.driveLink) return;
    setAdding(true);
    try {
      const result = await addIllustrationAsset(playerId, {
        ...newAsset,
        sceneNumber: newAsset.sceneNumber ? parseInt(newAsset.sceneNumber) : undefined,
      });
      setAssets((prev) => [...prev, result.asset]);
      setNewAsset({ fileName: "", driveLink: "", assetType: "reference_image", sceneNumber: "", illustratorNotes: "" });
      setShowAdd(false);
    } finally {
      setAdding(false);
    }
  };

  const byType = ASSET_TYPES.reduce<Record<string, IllustrationAsset[]>>((acc, t) => {
    acc[t.value] = assets.filter((a) => a.assetType === t.value);
    return acc;
  }, {});

  if (loading) return (
    <InternalLayout>
      <div className="flex items-center justify-center py-32">
        <Loader2 size={24} className="text-violet-400 animate-spin" />
      </div>
    </InternalLayout>
  );

  const isIllustrationReady = !storyStatus || ILLUSTRATION_STATUSES.includes(storyStatus);
  const statusMeta = getStatusMeta(storyStatus);

  return (
    <InternalLayout playerId={playerId} playerName={player?.playerName}>
      <div className="space-y-5 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          <button
            onClick={() => navigate(`/internal/stories/${playerId}/builder`)}
            className="flex items-center gap-1.5 text-white/30 hover:text-white/60 text-xs mb-4 transition-colors"
          >
            <ArrowLeft size={12} />
            Story Builder
          </button>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold text-white">Illustration Workspace</h1>
              <p className="text-white/40 text-sm mt-1">
                {player?.playerName} · {player?.academyName}
              </p>
            </div>
            {isIllustrationReady && (
              <button
                onClick={() => setShowAdd((v) => !v)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-violet-300 border border-violet-500/30 hover:bg-violet-500/10 transition-all"
              >
                <Plus size={14} />
                Add Asset
              </button>
            )}
          </div>
        </motion.div>

        {showAdd && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-violet-500/20 p-5 space-y-3"
            style={{ background: "rgba(167,139,250,0.04)" }}
          >
            <div className="text-white font-semibold text-sm">Add Illustration Asset</div>
            <div className="grid grid-cols-2 gap-3">
              <input
                value={newAsset.fileName}
                onChange={(e) => setNewAsset((p) => ({ ...p, fileName: e.target.value }))}
                placeholder="File name"
                className="px-3 py-2 rounded-lg text-sm text-white placeholder-white/30 border border-white/10 focus:outline-none focus:border-violet-500/50 bg-transparent"
              />
              <input
                value={newAsset.driveLink}
                onChange={(e) => setNewAsset((p) => ({ ...p, driveLink: e.target.value }))}
                placeholder="Google Drive link"
                className="px-3 py-2 rounded-lg text-sm text-white placeholder-white/30 border border-white/10 focus:outline-none focus:border-violet-500/50 bg-transparent"
              />
              <select
                value={newAsset.assetType}
                onChange={(e) => setNewAsset((p) => ({ ...p, assetType: e.target.value }))}
                className="px-3 py-2 rounded-lg text-sm text-white/70 border border-white/10 focus:outline-none focus:border-violet-500/50 bg-transparent"
              >
                {ASSET_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              <select
                value={newAsset.sceneNumber}
                onChange={(e) => setNewAsset((p) => ({ ...p, sceneNumber: e.target.value }))}
                className="px-3 py-2 rounded-lg text-sm text-white/70 border border-white/10 focus:outline-none focus:border-violet-500/50 bg-transparent"
              >
                <option value="">No specific scene</option>
                {SCENES.map((s) => <option key={s.number} value={s.number}>Scene {s.number}: {s.title}</option>)}
              </select>
            </div>
            <textarea
              value={newAsset.illustratorNotes}
              onChange={(e) => setNewAsset((p) => ({ ...p, illustratorNotes: e.target.value }))}
              placeholder="Illustrator notes…"
              rows={2}
              className="w-full px-3 py-2 rounded-lg text-sm text-white/70 placeholder-white/30 border border-white/10 focus:outline-none focus:border-violet-500/50 bg-transparent resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                disabled={adding || (!newAsset.fileName && !newAsset.driveLink)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-violet-300 border border-violet-500/30 hover:bg-violet-500/10 transition-all disabled:opacity-40"
              >
                {adding ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
                Add
              </button>
              <button onClick={() => setShowAdd(false)} className="text-white/30 hover:text-white/60 text-sm px-3 transition-colors">
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Story Status Gate ── */}
        {!isIllustrationReady && (
          <div
            className="rounded-2xl border p-5 flex items-start gap-4"
            style={{ background: "rgba(245,158,11,0.06)", borderColor: "rgba(245,158,11,0.25)" }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(245,158,11,0.15)" }}>
              <Lock size={18} className="text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-amber-300 font-semibold text-sm mb-1">
                Illustration workspace not yet unlocked
              </div>
              <p className="text-amber-200/60 text-xs leading-relaxed">
                This story is currently <span className="font-semibold" style={{ color: statusMeta.color }}>{statusMeta.label}</span>. The illustration workspace unlocks once an editor advances the story to <strong className="text-white/50">Ready for Illustration</strong>.
              </p>
              <button
                onClick={() => navigate(`/internal/stories/${playerId}/builder`)}
                className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 text-xs mt-3 transition-colors"
              >
                <ArrowLeft size={11} />
                Go to Story Builder
              </button>
            </div>
          </div>
        )}

        {/* Player intake images from Drive */}
        {media.images.length > 0 && (
          <div>
            <div className="text-white/30 text-[10px] uppercase tracking-widest mb-3">Player Uploaded Images ({media.images.length})</div>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
              {media.images.map((url, i) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="aspect-square rounded-lg overflow-hidden border border-white/10 hover:border-violet-500/40 transition-colors group"
                >
                  <img src={url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Appearance Notes Panel */}
        <div className="rounded-xl border border-white/[0.06] p-5" style={{ background: "rgba(255,255,255,0.02)" }}>
          <div className="text-white/50 text-xs uppercase tracking-widest mb-3">Appearance / Style Reference</div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Player Portrait", icon: "🧑", status: assets.filter((a) => a.assetType === "player_portrait").length },
              { label: "Kit Reference", icon: "👕", status: assets.filter((a) => a.assetType === "kit_reference").length },
              { label: "Scene Illustrations", icon: "🎨", status: assets.filter((a) => a.assetType === "scene_illustration").length },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg p-3 text-center border border-dashed border-white/[0.08] hover:border-white/20 transition-colors"
              >
                <div className="text-2xl mb-1">{item.icon}</div>
                <div className="text-white/50 text-xs">{item.label}</div>
                {item.status > 0 ? (
                  <div className="text-emerald-400 text-[10px] mt-1">{item.status} asset{item.status !== 1 ? "s" : ""}</div>
                ) : (
                  <div className="text-white/20 text-[10px] mt-1">None added</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Assets by type */}
        {assets.length === 0 ? (
          <div className="text-center py-16 text-white/20 text-sm">
            No illustration assets added yet. Use the "Add Asset" button to start.
          </div>
        ) : (
          <div className="space-y-4">
            {ASSET_TYPES.filter((t) => byType[t.value]?.length > 0).map((t) => (
              <div key={t.value}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: t.color }} />
                  <span className="text-white/50 text-xs uppercase tracking-widest">{t.label}</span>
                  <span className="text-white/25 text-xs">({byType[t.value].length})</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {byType[t.value].map((asset) => (
                    <AssetCard key={asset.id} asset={asset} onUpdate={handleUpdate} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center pt-2 pb-8">
          <button
            onClick={() => navigate(`/internal/stories/${playerId}/builder`)}
            className="flex items-center gap-1.5 text-white/30 hover:text-white/60 text-sm transition-colors"
          >
            <ArrowLeft size={13} />
            Back to Story Builder
          </button>
          <button
            onClick={() => navigate(`/internal/stories/${playerId}/profile`)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white border border-white/10 hover:bg-white/5 transition-all"
          >
            Back to Profile
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </InternalLayout>
  );
}
