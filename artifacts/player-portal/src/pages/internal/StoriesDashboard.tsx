import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Users,
  Clock,
  CheckCircle2,
  ArrowRight,
  Loader2,
  BookOpen,
  ChevronDown,
  SortAsc,
  RefreshCw,
} from "lucide-react";
import { InternalLayout } from "@/layouts/InternalLayout";
import {
  fetchProjects,
  getStatusMeta,
  STORY_STATUSES,
  type ProjectRow,
} from "@/lib/internalApi";

const COMPLETENESS_ICONS = {
  intakeComplete: { label: "Intake", color: "#a78bfa" },
  coachInputPresent: { label: "Coach", color: "#34d399" },
  stakeholderPresent: { label: "Stakeholder", color: "#60a5fa" },
};

function CompletenessBar({ score }: { score: number }) {
  const pct = Math.round((score / 3) * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: pct >= 100 ? "#34d399" : pct >= 50 ? "#f59e0b" : "#6b7280" }}
        />
      </div>
      <span className="text-white/30 text-[10px] tabular-nums">{pct}%</span>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const meta = getStatusMeta(status);
  return (
    <span
      className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide"
      style={{ background: `${meta.color}22`, color: meta.color, border: `1px solid ${meta.color}44` }}
    >
      {meta.label}
    </span>
  );
}

type SortKey = "playerName" | "updatedAt" | "storyStatus" | "completenessScore" | "academy";

export default function StoriesDashboard() {
  const [, navigate] = useLocation();
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [academies, setAcademies] = useState<{ key: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterAcademy, setFilterAcademy] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("updatedAt");
  const [sortAsc, setSortAsc] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    fetchProjects({ search, academy: filterAcademy, status: filterStatus })
      .then((d) => {
        setProjects(d.projects);
        setAcademies(d.academies);
        setError("");
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [search, filterAcademy, filterStatus]);

  useEffect(() => {
    const t = setTimeout(load, search ? 300 : 0);
    return () => clearTimeout(t);
  }, [load, search]);

  const sorted = [...projects].sort((a, b) => {
    let va: string | number, vb: string | number;
    if (sortKey === "updatedAt") {
      va = new Date(a.updatedAt).getTime();
      vb = new Date(b.updatedAt).getTime();
    } else if (sortKey === "completenessScore") {
      va = a.completenessScore;
      vb = b.completenessScore;
    } else {
      va = (a[sortKey] ?? "").toString().toLowerCase();
      vb = (b[sortKey] ?? "").toString().toLowerCase();
    }
    if (va < vb) return sortAsc ? -1 : 1;
    if (va > vb) return sortAsc ? 1 : -1;
    return 0;
  });

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc((v) => !v);
    else { setSortKey(key); setSortAsc(true); }
  };

  const stats = {
    total: projects.length,
    inDraft: projects.filter((p) => ["draft_in_progress", "blueprint_in_progress"].includes(p.storyStatus)).length,
    review: projects.filter((p) => ["internal_review", "academy_preview"].includes(p.storyStatus)).length,
    done: projects.filter((p) => ["final_ready", "approved"].includes(p.storyStatus)).length,
  };

  return (
    <InternalLayout>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Story Projects</h1>
              <p className="text-white/40 text-sm mt-0.5">Production workspace for all player stories</p>
            </div>
            <button
              onClick={load}
              className="flex items-center gap-2 text-white/40 hover:text-white/70 text-xs transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
            >
              <RefreshCw size={13} />
              Refresh
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
            {[
              { label: "Total Players", value: stats.total, icon: <Users size={14} />, color: "#a78bfa" },
              { label: "In Draft", value: stats.inDraft, icon: <BookOpen size={14} />, color: "#f59e0b" },
              { label: "In Review", value: stats.review, icon: <Clock size={14} />, color: "#60a5fa" },
              { label: "Completed", value: stats.done, icon: <CheckCircle2 size={14} />, color: "#34d399" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl p-4 border border-white/[0.06]"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <div className="flex items-center gap-2 mb-2" style={{ color: s.color }}>
                  {s.icon}
                  <span className="text-xs text-white/40">{s.label}</span>
                </div>
                <div className="text-2xl font-bold text-white">{s.value}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-3"
        >
          <div className="flex-1 min-w-52 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search player, code, academy…"
              className="w-full pl-9 pr-4 py-2 rounded-lg text-sm text-white placeholder-white/30 border border-white/10 focus:outline-none focus:border-violet-500/50 transition-colors"
              style={{ background: "rgba(255,255,255,0.04)" }}
            />
          </div>

          <div className="relative">
            <Filter size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
            <select
              value={filterAcademy}
              onChange={(e) => setFilterAcademy(e.target.value)}
              className="pl-8 pr-8 py-2 rounded-lg text-sm text-white/70 border border-white/10 focus:outline-none focus:border-violet-500/50 appearance-none cursor-pointer transition-colors"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <option value="">All Academies</option>
              {academies.map((a) => (
                <option key={a.key} value={a.key}>{a.name}</option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-3 pr-8 py-2 rounded-lg text-sm text-white/70 border border-white/10 focus:outline-none focus:border-violet-500/50 appearance-none cursor-pointer transition-colors"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <option value="">All Statuses</option>
              {STORY_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
          </div>
        </motion.div>

        {error && (
          <div className="rounded-xl p-4 text-red-400 text-sm border border-red-500/20" style={{ background: "rgba(239,68,68,0.08)" }}>
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="text-violet-400 animate-spin" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="rounded-xl border border-white/[0.06] overflow-hidden"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {[
                      { key: "playerName", label: "Player" },
                      { key: "academy", label: "Academy" },
                      { key: "storyStatus", label: "Status" },
                      { key: "completenessScore", label: "Inputs" },
                      { key: null, label: "Assigned" },
                      { key: "updatedAt", label: "Updated" },
                      { key: null, label: "" },
                    ].map(({ key, label }) => (
                      <th
                        key={label}
                        onClick={() => key && toggleSort(key as SortKey)}
                        className={`text-left text-[11px] uppercase tracking-widest text-white/30 font-semibold px-4 py-3 ${key ? "cursor-pointer hover:text-white/60" : ""}`}
                      >
                        <div className="flex items-center gap-1">
                          {label}
                          {key && sortKey === key && <SortAsc size={10} className={sortAsc ? "" : "rotate-180"} />}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sorted.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center text-white/30 text-sm py-16">
                        No players found
                      </td>
                    </tr>
                  )}
                  {sorted.map((row, i) => (
                    <motion.tr
                      key={row.playerId}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors cursor-pointer group"
                      onClick={() => navigate(`/internal/stories/${row.playerId}/profile`)}
                    >
                      <td className="px-4 py-3">
                        <div className="font-semibold text-white text-sm">{row.playerName}</div>
                        <div className="text-white/30 text-[11px] mt-0.5 font-mono">{row.accessCode}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-white/60 text-sm">{row.academy}</div>
                        <div className="text-white/30 text-[11px]">
                          {row.ageGroup} · {row.position}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <StatusPill status={row.storyStatus} />
                      </td>
                      <td className="px-4 py-3 w-32">
                        <div className="space-y-1">
                          <CompletenessBar score={row.completenessScore} />
                          <div className="flex gap-1 flex-wrap">
                            {(Object.entries(row.completeness) as [string, boolean | number][]).slice(0, 3).map(([k, v]) => {
                              const meta = COMPLETENESS_ICONS[k as keyof typeof COMPLETENESS_ICONS];
                              if (!meta) return null;
                              return (
                                <span
                                  key={k}
                                  className="text-[9px] px-1.5 py-0.5 rounded"
                                  style={{
                                    background: v ? `${meta.color}18` : "rgba(255,255,255,0.05)",
                                    color: v ? meta.color : "rgba(255,255,255,0.2)",
                                  }}
                                >
                                  {meta.label}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-white/50 text-xs">{row.assignedAuthor || <span className="text-white/20">—</span>}</div>
                        {row.assignedIllustrator && (
                          <div className="text-white/30 text-[11px]">{row.assignedIllustrator}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-white/30 text-xs">
                        {new Date(row.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                      </td>
                      <td className="px-4 py-3">
                        <ArrowRight
                          size={14}
                          className="text-white/20 group-hover:text-violet-400 transition-colors"
                        />
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </InternalLayout>
  );
}
