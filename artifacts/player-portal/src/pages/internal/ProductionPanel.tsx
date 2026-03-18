import { useState, useEffect, useRef } from "react";
import { useRoute, useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  Loader2,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  PlusCircle,
  Send,
  Tag,
  RefreshCw,
} from "lucide-react";
import { InternalLayout } from "@/layouts/InternalLayout";
import {
  fetchTracker,
  fetchNotes,
  updateTrackerItem,
  addNote,
  fetchPlayerProfile,
  type DetailTrackerItem,
  type ProductionNote,
  type PlayerProfile,
} from "@/lib/internalApi";

const USAGE_OPTIONS: { value: DetailTrackerItem["usageStatus"]; label: string; color: string }[] = [
  { value: "unused", label: "Not used", color: "#6b7280" },
  { value: "partially_used", label: "Partly used", color: "#f59e0b" },
  { value: "clearly_used", label: "Clearly used", color: "#34d399" },
];

const NOTE_TYPES = [
  { value: "general", label: "General", color: "#a78bfa" },
  { value: "author_note", label: "Author", color: "#60a5fa" },
  { value: "illustrator_note", label: "Illustrator", color: "#f59e0b" },
  { value: "editor_note", label: "Editor", color: "#ec4899" },
  { value: "feedback", label: "Feedback", color: "#34d399" },
  { value: "revision", label: "Revision", color: "#f97316" },
];

function TrackerRow({ item, onUpdate }: { item: DetailTrackerItem; onUpdate: (key: string, updates: any) => void }) {
  const [value, setValue] = useState(item.itemValue ?? "");
  const [editing, setEditing] = useState(false);
  const saveTimeout = useRef<ReturnType<typeof setTimeout>>();

  const usageMeta = USAGE_OPTIONS.find((u) => u.value === item.usageStatus) ?? USAGE_OPTIONS[0];

  const handleValueChange = (v: string) => {
    setValue(v);
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      onUpdate(item.itemKey, { itemValue: v });
    }, 1500);
  };

  return (
    <div className="flex items-start gap-3 py-3 border-b border-white/[0.04] last:border-0 group">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-1 rounded-full" style={{ background: usageMeta.color }} />
          <span className="text-white/60 text-sm font-medium">{item.itemLabel}</span>
        </div>
        {editing ? (
          <textarea
            value={value}
            onChange={(e) => handleValueChange(e.target.value)}
            onBlur={() => setEditing(false)}
            autoFocus
            rows={2}
            placeholder="Enter detail value…"
            className="w-full bg-transparent text-white/50 text-xs placeholder-white/20 resize-none focus:outline-none border border-white/[0.08] rounded-lg p-2"
          />
        ) : (
          <div
            onClick={() => setEditing(true)}
            className="text-white/30 text-xs cursor-text hover:text-white/50 transition-colors min-h-[18px]"
          >
            {value || <span className="italic">Click to add value…</span>}
          </div>
        )}
      </div>
      <div className="flex gap-1 flex-shrink-0 mt-0.5">
        {USAGE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onUpdate(item.itemKey, { usageStatus: opt.value })}
            className="px-2 py-0.5 rounded-full text-[10px] border transition-all"
            style={{
              background: item.usageStatus === opt.value ? `${opt.color}22` : "transparent",
              color: item.usageStatus === opt.value ? opt.color : "rgba(255,255,255,0.2)",
              borderColor: item.usageStatus === opt.value ? `${opt.color}44` : "rgba(255,255,255,0.06)",
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function NoteCard({ note }: { note: ProductionNote }) {
  const typeMeta = NOTE_TYPES.find((t) => t.value === note.noteType) ?? NOTE_TYPES[0];
  return (
    <div className="rounded-xl border border-white/[0.06] p-4" style={{ background: "rgba(255,255,255,0.02)" }}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <span
          className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide"
          style={{ background: `${typeMeta.color}18`, color: typeMeta.color, border: `1px solid ${typeMeta.color}30` }}
        >
          {typeMeta.label}
        </span>
        <div className="text-white/25 text-[10px]">
          {new Date(note.createdAt).toLocaleString("en-GB", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
      <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">{note.content}</p>
      {note.createdBy && (
        <div className="text-white/25 text-[10px] mt-2">— {note.createdBy}</div>
      )}
    </div>
  );
}

export default function ProductionPanel() {
  const [, params] = useRoute("/internal/stories/:playerId/notes");
  const playerId = params?.playerId ?? "";
  const [, navigate] = useLocation();

  const [trackerItems, setTrackerItems] = useState<DetailTrackerItem[]>([]);
  const [notes, setNotes] = useState<ProductionNote[]>([]);
  const [player, setPlayer] = useState<PlayerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [noteType, setNoteType] = useState("general");
  const [posting, setPosting] = useState(false);
  const [activeTab, setActiveTab] = useState<"tracker" | "notes">("notes");

  const load = () => {
    setLoading(true);
    Promise.all([
      fetchTracker(playerId),
      fetchNotes(playerId),
      fetchPlayerProfile(playerId),
    ])
      .then(([trackerData, notesData, profileData]) => {
        setTrackerItems(trackerData.items);
        setNotes(notesData.notes);
        setPlayer(profileData.player);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!playerId) return;
    load();
  }, [playerId]);

  const handleTrackerUpdate = async (key: string, updates: any) => {
    const result = await updateTrackerItem(playerId, key, updates);
    setTrackerItems((prev) => prev.map((item) => (item.itemKey === key ? result.item : item)));
  };

  const handlePostNote = async () => {
    if (!newNote.trim()) return;
    setPosting(true);
    try {
      const result = await addNote(playerId, newNote.trim(), noteType);
      setNotes((prev) => [result.note, ...prev]);
      setNewNote("");
    } finally {
      setPosting(false);
    }
  };

  const trackerStats = {
    total: trackerItems.length,
    used: trackerItems.filter((i) => i.usageStatus === "clearly_used").length,
    partial: trackerItems.filter((i) => i.usageStatus === "partially_used").length,
  };

  if (loading) return (
    <InternalLayout>
      <div className="flex items-center justify-center py-32">
        <Loader2 size={24} className="text-violet-400 animate-spin" />
      </div>
    </InternalLayout>
  );

  return (
    <InternalLayout playerId={playerId} playerName={player?.playerName}>
      <div className="space-y-5 max-w-4xl">
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
              <h1 className="text-2xl font-bold text-white">Production Panel</h1>
              <p className="text-white/40 text-sm mt-1">
                {player?.playerName} · Detail tracker & production notes
              </p>
            </div>
            <button onClick={load} className="flex items-center gap-1.5 text-white/30 hover:text-white/60 text-xs transition-colors p-2 rounded-lg hover:bg-white/5">
              <RefreshCw size={13} />
            </button>
          </div>

          <div className="flex gap-1 mt-5 p-1 rounded-xl border border-white/[0.06] w-fit" style={{ background: "rgba(255,255,255,0.02)" }}>
            {[
              { key: "notes", label: "Production Notes", icon: <MessageSquare size={13} />, count: notes.length },
              { key: "tracker", label: "Detail Tracker", icon: <Tag size={13} />, count: trackerItems.length },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.key ? "text-white" : "text-white/40 hover:text-white/70"
                }`}
                style={activeTab === tab.key ? { background: "rgba(167,139,250,0.15)", color: "#a78bfa" } : {}}
              >
                {tab.icon}
                {tab.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? "bg-violet-500/20 text-violet-300" : "bg-white/5 text-white/30"}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {activeTab === "notes" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="rounded-xl border border-white/[0.06] p-4 space-y-3" style={{ background: "rgba(255,255,255,0.02)" }}>
              <div className="flex items-center gap-2 mb-1">
                <PlusCircle size={14} className="text-violet-400" />
                <span className="text-white/60 text-sm font-semibold">Add Note</span>
              </div>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a production note, revision instruction, or feedback…"
                rows={3}
                className="w-full bg-transparent text-white/70 text-sm placeholder-white/25 resize-none focus:outline-none border border-white/[0.06] rounded-lg p-3"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handlePostNote();
                }}
              />
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex gap-1.5 flex-wrap">
                  {NOTE_TYPES.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setNoteType(t.value)}
                      className="px-2.5 py-1 rounded-full text-[11px] border transition-all"
                      style={{
                        background: noteType === t.value ? `${t.color}18` : "transparent",
                        color: noteType === t.value ? t.color : "rgba(255,255,255,0.25)",
                        borderColor: noteType === t.value ? `${t.color}44` : "rgba(255,255,255,0.06)",
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handlePostNote}
                  disabled={posting || !newNote.trim()}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-violet-300 border border-violet-500/30 hover:bg-violet-500/10 transition-all disabled:opacity-40 ml-auto"
                >
                  {posting ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                  Post Note
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {notes.length === 0 ? (
                <div className="text-center py-12 text-white/20 text-sm">No notes yet. Add the first one above.</div>
              ) : (
                notes.map((note, i) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <NoteCard note={note} />
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}

        {activeTab === "tracker" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Total Details", value: trackerStats.total, color: "#a78bfa" },
                { label: "Clearly Used", value: trackerStats.used, color: "#34d399" },
                { label: "Partially Used", value: trackerStats.partial, color: "#f59e0b" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl p-4 border border-white/[0.06]"
                  style={{ background: "rgba(255,255,255,0.02)" }}
                >
                  <div className="text-2xl font-bold text-white">{s.value}</div>
                  <div className="text-white/40 text-xs mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-white/[0.06] p-4" style={{ background: "rgba(255,255,255,0.02)" }}>
              <div className="text-white/30 text-[10px] uppercase tracking-widest mb-3">
                Track how much of each captured detail has been woven into the story
              </div>
              <div>
                {trackerItems.length === 0 ? (
                  <div className="text-center py-10 text-white/20 text-sm">
                    Tracker items will populate once the story project is initialised
                  </div>
                ) : (
                  trackerItems.map((item) => (
                    <TrackerRow key={item.itemKey} item={item} onUpdate={handleTrackerUpdate} />
                  ))
                )}
              </div>
            </div>

            <div className="rounded-xl border border-amber-500/15 p-4 text-white/40 text-xs leading-relaxed" style={{ background: "rgba(245,158,11,0.03)" }}>
              <div className="flex items-start gap-2">
                <AlertCircle size={13} className="text-amber-400/60 mt-0.5 flex-shrink-0" />
                <div>
                  The detail tracker helps you avoid leaving player details unused. As you write, mark each item as it appears naturally in the story. Don't force all details in — quality over completeness.
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </InternalLayout>
  );
}
