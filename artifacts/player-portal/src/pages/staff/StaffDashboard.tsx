import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  Loader2,
  BookOpen,
  Palette,
  AlertCircle,
  Star,
} from "lucide-react";
import { StaffLayout } from "@/layouts/StaffLayout";
import { useStaffAuth } from "@/hooks/useStaffAuth";
import { fetchStaffPlayers, fetchStaffStoryPipeline, type StaffPlayer, type StaffStoryEntry } from "@/lib/staffApi";
import { RoleBadge, StatusBadge } from "@/components/BadgeSystem";

const STORY_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  draft_in_progress:   { label: "Writing",            color: "#a78bfa" },
  internal_review:     { label: "Under Review",       color: "#60a5fa" },
  academy_preview:     { label: "Academy Preview",    color: "#f59e0b" },
  revisions_in_progress:{ label: "Revisions",         color: "#fb923c" },
  approved:            { label: "Approved",            color: "#34d399" },
  ready_for_illustration:{ label: "Ready to Illustrate", color: "#22d3ee" },
  illustration_in_progress:{ label: "Being Illustrated", color: "#818cf8" },
  final_ready:         { label: "Final Ready",        color: "#4ade80" },
};

function PipelineStage({ label, count, color, icon }: { label: string; count: number; color: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border p-4 flex items-center gap-3" style={{ background: `${color}08`, borderColor: `${color}25` }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${color}20`, color }}>
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-white text-lg font-bold">{count}</div>
        <div className="text-white/40 text-xs truncate">{label}</div>
      </div>
    </div>
  );
}

export default function StaffDashboard() {
  const { staffUser } = useStaffAuth();
  const [players, setPlayers] = useState<StaffPlayer[]>([]);
  const [storyPipeline, setStoryPipeline] = useState<StaffStoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetchStaffPlayers(),
      fetchStaffStoryPipeline(),
    ])
      .then(([pl, sp]) => {
        setPlayers(pl);
        setStoryPipeline(sp);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const totalPlayers = players.length;
  const completedPlayers = players.filter((p) =>
    ["journey_complete", "links_generated", "story_complete"].includes(p.status)
  ).length;
  const inProgress = players.filter((p) => p.status === "journey_started").length;

  const storiesActive = storyPipeline.filter((e) => e.hasProject && e.storyStatus && e.storyStatus !== "final_ready").length;
  const storiesFinal = storyPipeline.filter((e) => e.storyStatus === "final_ready").length;
  const awaitingPreview = storyPipeline.filter((e) => e.storyStatus === "academy_preview");

  const recentPlayers = [...players]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const primaryColor = staffUser?.academyPrimaryColor || "#3b82f6";

  return (
    <StaffLayout>
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-display font-black text-white uppercase tracking-wide">
            Academy Hub
          </h1>
          <div className="flex flex-wrap items-center gap-3 mt-3">
            {staffUser && (
              <RoleBadge
                role={
                  staffUser.role === "academy_admin"
                    ? "academy_admin"
                    : (staffUser.questionRole || staffUser.role)
                }
              />
            )}
            <span className="text-white/30">•</span>
            <span className="text-white/60 text-sm">{staffUser?.academyName}</span>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={32} className="animate-spin text-white/30" />
          </div>
        ) : error ? (
          <div className="glass-panel rounded-2xl p-8 text-center">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        ) : (
          <>
            {/* Player Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "Total Players",    value: totalPlayers,       icon: <Users size={20} />,        color: primaryColor },
                { label: "Journey Complete", value: completedPlayers,   icon: <CheckCircle2 size={20} />, color: "#22c55e" },
                { label: "In Progress",      value: inProgress,         icon: <Clock size={20} />,        color: "#eab308" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-panel rounded-2xl p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white/40 text-xs font-bold uppercase tracking-wider font-display">
                      {stat.label}
                    </span>
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: `${stat.color}20`, color: stat.color }}
                    >
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-3xl font-display font-black text-white">{stat.value}</div>
                </motion.div>
              ))}
            </div>

            {/* ── Story Pipeline Section ── */}
            {storyPipeline.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="glass-panel rounded-2xl overflow-hidden"
              >
                <div className="flex items-center justify-between p-5 border-b border-white/8">
                  <div className="flex items-center gap-2.5">
                    <BookOpen size={18} style={{ color: "#a78bfa" }} />
                    <h2 className="text-lg font-display font-bold text-white uppercase tracking-wide">
                      Story Pipeline
                    </h2>
                  </div>
                  <span className="text-xs text-white/30">{storiesActive} active · {storiesFinal} complete</span>
                </div>

                {/* Pipeline overview pills */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5 border-b border-white/5">
                  <PipelineStage label="In Production"    count={storiesActive}                                  color="#a78bfa" icon={<BookOpen size={14} />} />
                  <PipelineStage label="Under Review"     count={storyPipeline.filter(e => e.storyStatus === "internal_review").length} color="#60a5fa" icon={<Clock size={14} />} />
                  <PipelineStage label="Illustrating"     count={storyPipeline.filter(e => ["ready_for_illustration","illustration_in_progress"].includes(e.storyStatus ?? "")).length} color="#22d3ee" icon={<Palette size={14} />} />
                  <PipelineStage label="Final Ready"      count={storiesFinal}                                   color="#4ade80" icon={<CheckCircle2 size={14} />} />
                </div>

                {/* Academy Preview alert */}
                {awaitingPreview.length > 0 && (
                  <div className="mx-5 mt-4 rounded-xl border p-4 flex items-start gap-3" style={{ background: "rgba(245,158,11,0.07)", borderColor: "rgba(245,158,11,0.3)" }}>
                    <AlertCircle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-amber-300 font-semibold text-sm mb-1">
                        {awaitingPreview.length} {awaitingPreview.length === 1 ? "story" : "stories"} ready for academy preview
                      </div>
                      <p className="text-amber-200/50 text-xs">
                        {awaitingPreview.map(e => e.playerName).join(", ")} — Stories are approved and awaiting your final preview before illustration begins.
                      </p>
                    </div>
                  </div>
                )}

                {/* Per-player story status list */}
                <div className="divide-y divide-white/5 mt-4">
                  {storyPipeline
                    .filter((e) => e.hasProject)
                    .map((entry) => {
                      const meta = entry.storyStatus ? STORY_STATUS_LABELS[entry.storyStatus] : null;
                      return (
                        <div key={entry.id} className="flex items-center gap-3 px-5 py-3.5">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                            style={{ background: `${primaryColor}22` }}
                          >
                            {entry.playerName.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-white text-sm font-medium truncate">{entry.playerName}</div>
                            <div className="text-white/30 text-xs">{entry.position} · {entry.ageGroup}</div>
                          </div>
                          {meta ? (
                            <span
                              className="text-[10px] font-bold rounded-full px-2.5 py-1 uppercase tracking-wider flex-shrink-0"
                              style={{ background: `${meta.color}18`, color: meta.color, border: `1px solid ${meta.color}30` }}
                            >
                              {meta.label}
                            </span>
                          ) : (
                            <span className="text-[10px] text-white/20 rounded-full px-2.5 py-1 border border-white/10">Not started</span>
                          )}
                          {entry.storyStatus === "final_ready" && (
                            <Star size={14} className="text-yellow-400 flex-shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  {storyPipeline.filter((e) => !e.hasProject).length > 0 && (
                    <div className="px-5 py-3 text-xs text-white/25 italic">
                      {storyPipeline.filter((e) => !e.hasProject).length} player(s) not yet in story production
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Recent Players */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="glass-panel rounded-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-white/8">
                <h2 className="text-lg font-display font-bold text-white uppercase tracking-wide">
                  Recent Players
                </h2>
                <Link href="/staff/players">
                  <span
                    className="text-xs font-bold uppercase tracking-wider hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                    style={{ color: primaryColor }}
                  >
                    View All <ArrowRight size={14} />
                  </span>
                </Link>
              </div>
              {recentPlayers.length > 0 ? (
                <div className="divide-y divide-white/6">
                  {recentPlayers.map((player) => (
                    <Link key={player.id} href={`/staff/players/${player.id}`}>
                      <div className="flex items-center justify-between px-5 py-3.5 hover:bg-white/5 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                            style={{ background: `${primaryColor}25` }}
                          >
                            {player.playerName.charAt(0)}
                          </div>
                          <div>
                            <div className="text-white text-sm font-medium">{player.playerName}</div>
                            <div className="text-white/40 text-xs">
                              {player.position} &middot; {player.ageGroup || `Age ${player.age}`}
                            </div>
                          </div>
                        </div>
                        <StatusBadge status={player.status} />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-white/30 text-sm">
                  No players registered yet.
                </div>
              )}
            </motion.div>
          </>
        )}
      </div>
    </StaffLayout>
  );
}
