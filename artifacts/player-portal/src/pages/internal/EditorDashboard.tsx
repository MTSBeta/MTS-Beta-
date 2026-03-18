import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crown,
  Users,
  BookOpen,
  CheckCircle2,
  Clock,
  Plus,
  Pencil,
  X,
  AlertCircle,
  RefreshCw,
  Shield,
  UserPlus,
  ToggleLeft,
  ToggleRight,
  Loader2,
  ChevronRight,
  Zap,
} from "lucide-react";
import { InternalLayout } from "@/layouts/InternalLayout";
import {
  fetchEditorStats,
  fetchProjects,
  fetchStaff,
  approveBlueprint,
  revokeBlueprint,
  createStaffMember,
  updateStaffMember,
  deactivateStaffMember,
  assignProject,
  type EditorStats,
  type MeTimeStaffMember,
  type ProjectRow,
} from "@/lib/internalApi";
import { useInternalAuth } from "@/context/InternalAuthContext";

const ACCENT = "#a78bfa";
const BG_CARD = "rgba(255,255,255,0.04)";
const BORDER = "rgba(255,255,255,0.08)";

const ROLES = ["author", "illustrator", "editor"];

function StatCard({ icon, label, value, color = ACCENT }: { icon: React.ReactNode; label: string; value: number; color?: string }) {
  return (
    <div className="rounded-2xl p-5 border flex items-center gap-4" style={{ background: BG_CARD, borderColor: BORDER }}>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}18` }}>
        <div style={{ color }}>{icon}</div>
      </div>
      <div>
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="text-white/40 text-xs mt-0.5">{label}</div>
      </div>
    </div>
  );
}

interface AddStaffModalProps {
  onClose: () => void;
  onCreated: (s: MeTimeStaffMember) => void;
}

function AddStaffModal({ onClose, onCreated }: AddStaffModalProps) {
  const [form, setForm] = useState({ email: "", fullName: "", role: "author", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.fullName || !form.password) {
      setError("All fields are required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { staff } = await createStaffMember(form);
      onCreated(staff);
    } catch (err: any) {
      setError(err.message || "Failed to create staff member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-2xl border p-6"
        style={{ background: "#0e0e1e", borderColor: BORDER }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <UserPlus size={18} className="text-violet-400" />
            <h2 className="text-white font-bold text-base">Add Staff Member</h2>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white/70">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { key: "fullName", label: "Full Name", type: "text", placeholder: "Jane Smith" },
            { key: "email", label: "Email Address", type: "email", placeholder: "jane@metimestories.com" },
            { key: "password", label: "Password", type: "password", placeholder: "Minimum 8 characters" },
          ].map(({ key, label, type, placeholder }) => (
            <div key={key}>
              <label className="block text-white/50 text-xs mb-1.5">{label}</label>
              <input
                type={type}
                placeholder={placeholder}
                value={(form as any)[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                className="w-full rounded-xl px-3 py-2.5 text-sm text-white border outline-none focus:border-violet-500 transition-colors"
                style={{ background: "rgba(255,255,255,0.05)", borderColor: BORDER }}
              />
            </div>
          ))}

          <div>
            <label className="block text-white/50 text-xs mb-1.5">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              className="w-full rounded-xl px-3 py-2.5 text-sm text-white border outline-none focus:border-violet-500 transition-colors"
              style={{ background: "#0e0e1e", borderColor: BORDER }}
            >
              {ROLES.map((r) => (
                <option key={r} value={r} style={{ background: "#0e0e1e" }}>
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl py-2.5 text-sm text-white/50 border border-white/10 hover:text-white/80 hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all"
              style={{ background: ACCENT }}
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              {loading ? "Creating…" : "Add Member"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function EditorDashboard() {
  const { internalUser } = useInternalAuth();
  const [, navigate] = useLocation();
  const [stats, setStats] = useState<EditorStats | null>(null);
  const [staff, setStaff] = useState<MeTimeStaffMember[]>([]);
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [editorData, projectsData] = await Promise.all([
        fetchEditorStats(),
        fetchProjects({ status: "blueprint_in_progress" }),
      ]);
      setStats(editorData.stats);
      setStaff(editorData.staff);
      setProjects(projectsData.projects);
    } catch (err: any) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveBlueprint = async (playerId: string) => {
    setActionLoading((prev) => ({ ...prev, [`approve-${playerId}`]: true }));
    try {
      await approveBlueprint(playerId);
      setProjects((prev) => prev.filter((p) => p.playerId !== playerId));
      setStats((s) => s ? { ...s, blueprintsPendingApproval: s.blueprintsPendingApproval - 1, blueprintsApproved: s.blueprintsApproved + 1 } : s);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading((prev) => ({ ...prev, [`approve-${playerId}`]: false }));
    }
  };

  const handleToggleActive = async (member: MeTimeStaffMember) => {
    const key = `toggle-${member.id}`;
    setActionLoading((prev) => ({ ...prev, [key]: true }));
    try {
      if (member.isActive) {
        const { staff: updated } = await deactivateStaffMember(member.id);
        setStaff((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      } else {
        const { staff: updated } = await updateStaffMember(member.id, { isActive: true });
        setStaff((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  const roleColor: Record<string, string> = {
    author: "#a78bfa",
    illustrator: "#60a5fa",
    editor: "#f59e0b",
    admin: "#f43f5e",
  };

  if (loading) {
    return (
      <InternalLayout>
        <div className="flex items-center justify-center h-96 gap-3 text-white/40">
          <Loader2 size={20} className="animate-spin" />
          Loading editor dashboard…
        </div>
      </InternalLayout>
    );
  }

  if (error) {
    return (
      <InternalLayout>
        <div className="flex flex-col items-center justify-center h-96 gap-4 text-center">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <AlertCircle size={20} className="text-red-400" />
          </div>
          <div>
            <p className="text-white/70 font-medium">Failed to load</p>
            <p className="text-white/30 text-sm mt-1">{error}</p>
          </div>
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-violet-300 border border-violet-500/30 hover:bg-violet-500/10 transition-all"
          >
            <RefreshCw size={14} />
            Try again
          </button>
        </div>
      </InternalLayout>
    );
  }

  return (
    <InternalLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <Crown size={20} style={{ color: ACCENT }} />
              <h1 className="text-white text-2xl font-bold">Editor Dashboard</h1>
            </div>
            <p className="text-white/40 text-sm">
              Welcome back, {internalUser?.fullName?.split(" ")[0]}. Here's your production overview.
            </p>
          </div>
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm text-white/40 border border-white/10 hover:text-white/70 hover:bg-white/5 transition-all"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={<BookOpen size={20} />} label="Total Projects" value={stats.totalProjects} />
            <StatCard icon={<Users size={20} />} label="Active Authors" value={stats.activeAuthors} color="#60a5fa" />
            <StatCard icon={<Clock size={20} />} label="Awaiting Approval" value={stats.blueprintsPendingApproval} color="#f59e0b" />
            <StatCard icon={<CheckCircle2 size={20} />} label="Stories in Draft" value={stats.storiesInDraft} color="#34d399" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Blueprint Approvals */}
          <div className="rounded-2xl border overflow-hidden" style={{ background: BG_CARD, borderColor: BORDER }}>
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: BORDER }}>
              <div className="flex items-center gap-2">
                <Zap size={15} className="text-amber-400" />
                <span className="text-white font-semibold text-sm">Blueprint Approvals</span>
              </div>
              <span className="text-xs text-white/30 bg-amber-500/10 border border-amber-500/20 rounded-full px-2.5 py-0.5">
                {projects.length} pending
              </span>
            </div>

            <div className="divide-y" style={{ divideColor: BORDER }}>
              {projects.length === 0 ? (
                <div className="px-5 py-10 text-center">
                  <CheckCircle2 size={24} className="text-green-400 mx-auto mb-2" />
                  <p className="text-white/40 text-sm">No blueprints awaiting approval</p>
                </div>
              ) : (
                projects.map((p) => (
                  <div key={p.playerId} className="flex items-center gap-3 px-5 py-3.5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: `${ACCENT}20` }}>
                      {p.playerName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium truncate">{p.playerName}</div>
                      <div className="text-white/30 text-xs truncate">{p.academy} · {p.ageGroup}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/internal/stories/${p.playerId}/blueprint`)}
                        className="text-xs text-white/40 hover:text-white/70 px-2 py-1 rounded-lg border border-white/10 hover:bg-white/5 transition-all"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleApproveBlueprint(p.playerId)}
                        disabled={actionLoading[`approve-${p.playerId}`]}
                        className="text-xs font-semibold rounded-lg px-3 py-1.5 flex items-center gap-1.5 transition-all"
                        style={{ background: `${ACCENT}22`, color: ACCENT, border: `1px solid ${ACCENT}30` }}
                      >
                        {actionLoading[`approve-${p.playerId}`] ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                        Approve
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="px-5 py-3 border-t" style={{ borderColor: BORDER }}>
              <button
                onClick={() => navigate("/internal/stories")}
                className="text-xs text-white/40 hover:text-violet-400 flex items-center gap-1.5 transition-colors"
              >
                View all stories
                <ChevronRight size={12} />
              </button>
            </div>
          </div>

          {/* Staff Management */}
          <div className="rounded-2xl border overflow-hidden" style={{ background: BG_CARD, borderColor: BORDER }}>
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: BORDER }}>
              <div className="flex items-center gap-2">
                <Shield size={15} style={{ color: ACCENT }} />
                <span className="text-white font-semibold text-sm">Staff Management</span>
              </div>
              <button
                onClick={() => setShowAddStaff(true)}
                className="flex items-center gap-1.5 text-xs font-semibold rounded-xl px-3 py-1.5 transition-all"
                style={{ background: `${ACCENT}18`, color: ACCENT, border: `1px solid ${ACCENT}30` }}
              >
                <Plus size={12} />
                Add Member
              </button>
            </div>

            <div className="divide-y" style={{ divideColor: BORDER }}>
              {staff.map((member) => (
                <div key={member.id} className="flex items-center gap-3 px-5 py-3.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: `${roleColor[member.role] || ACCENT}20` }}
                  >
                    {member.fullName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm font-medium truncate">{member.fullName}</span>
                      {!member.isActive && (
                        <span className="text-[10px] text-red-400 bg-red-500/10 border border-red-500/20 rounded-full px-1.5 py-0.5">Inactive</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className="text-[10px] rounded-full px-2 py-0.5 capitalize font-medium"
                        style={{ background: `${roleColor[member.role] || ACCENT}15`, color: roleColor[member.role] || ACCENT }}
                      >
                        {member.role}
                      </span>
                      <span className="text-white/25 text-xs truncate">{member.email}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleActive(member)}
                    disabled={actionLoading[`toggle-${member.id}`] || member.id === internalUser?.id}
                    className="text-white/30 hover:text-white/70 transition-colors flex-shrink-0 disabled:opacity-30"
                    title={member.isActive ? "Deactivate" : "Activate"}
                  >
                    {actionLoading[`toggle-${member.id}`] ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : member.isActive ? (
                      <ToggleRight size={18} style={{ color: "#34d399" }} />
                    ) : (
                      <ToggleLeft size={18} className="text-white/30" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Projects with author assignments */}
        <ProjectAssignmentTable />
      </div>

      <AnimatePresence>
        {showAddStaff && (
          <AddStaffModal
            onClose={() => setShowAddStaff(false)}
            onCreated={(s) => {
              setStaff((prev) => [...prev, s]);
              setShowAddStaff(false);
            }}
          />
        )}
      </AnimatePresence>
    </InternalLayout>
  );
}

function ProjectAssignmentTable() {
  const [, navigate] = useLocation();
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [staff, setStaff] = useState<MeTimeStaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  useEffect(() => {
    Promise.all([fetchProjects(), fetchStaff()]).then(([pd, sd]) => {
      setProjects(pd.projects);
      setStaff(sd.staff.filter((s) => s.isActive));
      setLoading(false);
    });
  }, []);

  const authors = staff.filter((s) => s.role === "author");

  const handleAssign = async (playerId: string, field: "assignedAuthor", value: string) => {
    setSaving((prev) => ({ ...prev, [playerId]: true }));
    try {
      await assignProject(playerId, { [field]: value || undefined });
      setProjects((prev) =>
        prev.map((p) => (p.playerId === playerId ? { ...p, [field]: value || null } : p))
      );
    } finally {
      setSaving((prev) => ({ ...prev, [playerId]: false }));
    }
  };

  if (loading) return null;

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ background: BG_CARD, borderColor: BORDER }}>
      <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: BORDER }}>
        <div className="flex items-center gap-2">
          <Users size={15} className="text-blue-400" />
          <span className="text-white font-semibold text-sm">Author Assignments</span>
        </div>
        <span className="text-xs text-white/30">{projects.length} projects</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b" style={{ borderColor: BORDER }}>
              {["Player", "Academy", "Status", "Author", ""].map((h) => (
                <th key={h} className="text-left text-white/30 text-xs font-medium px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ divideColor: BORDER }}>
            {projects.slice(0, 15).map((p) => (
              <tr key={p.playerId} className="hover:bg-white/2 transition-colors">
                <td className="px-5 py-3">
                  <div className="text-white font-medium text-sm">{p.playerName}</div>
                  <div className="text-white/30 text-xs">{p.ageGroup}</div>
                </td>
                <td className="px-5 py-3 text-white/50 text-xs whitespace-nowrap">{p.academy}</td>
                <td className="px-5 py-3">
                  <span className="text-xs rounded-full px-2.5 py-1 bg-white/5 text-white/40 capitalize whitespace-nowrap">
                    {p.storyStatus?.replace(/_/g, " ")}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="relative">
                    <select
                      value={p.assignedAuthor || ""}
                      onChange={(e) => handleAssign(p.playerId, "assignedAuthor", e.target.value)}
                      className="text-xs rounded-xl px-2.5 py-1.5 text-white border outline-none focus:border-violet-500 transition-colors w-full max-w-[180px]"
                      style={{ background: "#0e0e1e", borderColor: BORDER }}
                    >
                      <option value="" style={{ background: "#0e0e1e" }}>— Unassigned —</option>
                      {authors.map((a) => (
                        <option key={a.id} value={a.fullName} style={{ background: "#0e0e1e" }}>
                          {a.fullName}
                        </option>
                      ))}
                    </select>
                    {saving[p.playerId] && (
                      <Loader2 size={10} className="animate-spin text-violet-400 absolute right-2 top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                </td>
                <td className="px-5 py-3">
                  <button
                    onClick={() => navigate(`/internal/stories/${p.playerId}/profile`)}
                    className="text-xs text-white/30 hover:text-violet-400 flex items-center gap-1 transition-colors"
                  >
                    Open <ChevronRight size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
