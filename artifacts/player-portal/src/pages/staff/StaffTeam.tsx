import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, UserPlus, ToggleLeft, ToggleRight, Pencil, X, Eye, EyeOff, Trash2 } from "lucide-react";
import { StaffLayout } from "@/layouts/StaffLayout";
import { useStaffAuth } from "@/hooks/useStaffAuth";
import {
  fetchStaffTeam,
  createStaffMember,
  type StaffMember,
} from "@/lib/staffApi";

const MAX_STAFF = 8;

const QUESTION_ROLES = [
  { value: "football_coaching", label: "Football Coaching",  description: "Technical, tactical & physical performance observations" },
  { value: "psychology",        label: "Psychology",          description: "Mental wellbeing, resilience & motivation" },
  { value: "education",         label: "Education",           description: "Academic performance & life balance" },
  { value: "player_care",       label: "Player Care",         description: "Welfare, relationships & safeguarding" },
];

const SYSTEM_ROLES = [
  { value: "staff",         label: "Staff",         description: "View players and submit their assigned observations" },
  { value: "academy_admin", label: "Academy Admin", description: "Full access — manages team, players and settings" },
];

function qRoleLabel(r: string | null) {
  return QUESTION_ROLES.find(q => q.value === r)?.label ?? "Not assigned";
}
function qRoleBadge(r: string | null) {
  const map: Record<string, string> = {
    football_coaching: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    psychology:        "bg-purple-500/15 text-purple-400 border-purple-500/20",
    education:         "bg-amber-500/15 text-amber-400 border-amber-500/20",
    player_care:       "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  };
  return r ? (map[r] ?? "bg-white/8 text-white/40 border-white/10") : "bg-white/5 text-white/25 border-white/8";
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-white/50 uppercase tracking-widest ml-1">{label}</label>
      {children}
      {error && <p className="text-red-400 text-xs px-1">{error}</p>}
    </div>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full h-11 rounded-xl bg-white/5 border border-white/10 px-4 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-white/30 transition-all"
    />
  );
}

function RoleCards({
  label, options, value, onChange,
}: {
  label: string;
  options: { value: string; label: string; description: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-white/50 uppercase tracking-widest ml-1">{label}</label>
      <div className="space-y-2">
        {options.map(opt => (
          <button
            key={opt.value} type="button" onClick={() => onChange(opt.value)}
            className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
              value === opt.value ? "border-white/30 bg-white/10" : "border-white/8 bg-white/3 hover:bg-white/6"
            }`}
          >
            <div className={`w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center transition-all ${
              value === opt.value ? "border-white bg-white" : "border-white/25"
            }`}>
              {value === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
            </div>
            <div>
              <p className="text-white text-sm font-semibold leading-snug">{opt.label}</p>
              <p className="text-white/35 text-xs mt-0.5">{opt.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Add Staff Sheet ──────────────────────────────────────────────────────────

function AddStaffSheet({
  open, onClose, onCreated, primaryColor,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (m: StaffMember) => void;
  primaryColor: string;
}) {
  const [form, setForm] = useState({
    name: "", email: "", password: "",
    systemRole: "staff", questionRole: "football_coaching",
    jobTitle: "", ageGroup: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const set = (k: string) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  const reset = () => {
    setForm({ name: "", email: "", password: "", systemRole: "staff", questionRole: "football_coaching", jobTitle: "", ageGroup: "" });
    setErrors({});
    setShowPass(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    if (!form.password || form.password.length < 8) errs.password = "Minimum 8 characters";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true); setErrors({});
    try {
      const member = await createStaffMember({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        systemRole: form.systemRole,
        questionRole: form.systemRole === "academy_admin" ? null : form.questionRole,
        jobTitle: form.jobTitle.trim(),
        ageGroup: form.ageGroup.trim() || undefined,
      });
      onCreated(member);
      onClose();
      reset();
    } catch (err: any) {
      setErrors({ general: err.message || "Failed to create staff member." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => { onClose(); reset(); }} />
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#111] border-t border-white/8 rounded-t-3xl max-h-[92vh] overflow-y-auto"
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="px-5 pt-5 pb-4 flex items-center justify-between sticky top-0 bg-[#111] z-10 border-b border-white/5">
              <div>
                <h2 className="text-white font-bold text-base">Add Staff Member</h2>
                <p className="text-white/35 text-xs mt-0.5">Assign their access level and question set</p>
              </div>
              <button onClick={() => { onClose(); reset(); }} className="text-white/30 hover:text-white/60 p-1 transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={submit} className="px-5 py-5 pb-12 space-y-5">
              {errors.general && (
                <p className="text-red-400 text-sm bg-red-950/30 border border-red-500/20 rounded-xl px-4 py-3">{errors.general}</p>
              )}

              <Field label="Full name" error={errors.name}>
                <TextInput value={form.name} onChange={e => set("name")(e.target.value)} placeholder="e.g. Tom Bradley" />
              </Field>
              <Field label="Email address" error={errors.email}>
                <TextInput type="email" value={form.email} onChange={e => set("email")(e.target.value)} placeholder="tom@academy.co.uk" />
              </Field>
              <Field label="Temporary password" error={errors.password}>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={form.password}
                    onChange={e => set("password")(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="w-full h-11 rounded-xl bg-white/5 border border-white/10 px-4 pr-11 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-white/30 transition-all"
                  />
                  <button type="button" onClick={() => setShowPass(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </Field>

              <RoleCards label="System access" value={form.systemRole} onChange={set("systemRole")} options={SYSTEM_ROLES} />

              {form.systemRole === "staff" && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                  <RoleCards
                    label="Question set — which section is this person responsible for?"
                    value={form.questionRole}
                    onChange={set("questionRole")}
                    options={QUESTION_ROLES}
                  />
                </motion.div>
              )}

              {form.systemRole === "academy_admin" && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 px-4 py-3">
                  <p className="text-emerald-400/80 text-xs">Academy Admins have access to all sections and player data — no question set required.</p>
                </motion.div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <Field label="Job title (optional)">
                  <TextInput value={form.jobTitle} onChange={e => set("jobTitle")(e.target.value)} placeholder="e.g. Head Coach" />
                </Field>
                <Field label="Age group (optional)">
                  <TextInput value={form.ageGroup} onChange={e => set("ageGroup")(e.target.value)} placeholder="e.g. U15" />
                </Field>
              </div>

              <button type="submit" disabled={saving}
                className="w-full py-4 rounded-2xl font-black text-sm text-white disabled:opacity-50 transition-all active:scale-[0.98]"
                style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`, boxShadow: `0 8px 32px ${primaryColor}40` }}>
                {saving ? <><Loader2 size={16} className="animate-spin inline mr-2" />Creating…</> : "Add Staff Member →"}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Edit Staff Sheet ─────────────────────────────────────────────────────────

function EditStaffSheet({
  member, open, onClose, onUpdated, onDeleted, primaryColor, currentUserId,
}: {
  member: StaffMember | null;
  open: boolean;
  onClose: () => void;
  onUpdated: (m: StaffMember) => void;
  onDeleted: (id: number) => void;
  primaryColor: string;
  currentUserId: number;
}) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const token = localStorage.getItem("staff_token") ?? "";

  const [form, setForm] = useState({ fullName: "", systemRole: "staff", questionRole: "football_coaching", jobTitle: "", ageGroup: "" });
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState("");
  const set = (k: string) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    if (member) setForm({
      fullName: member.fullName ?? member.name ?? "",
      systemRole: member.systemRole ?? member.role ?? "staff",
      questionRole: member.questionRole ?? "football_coaching",
      jobTitle: member.jobTitle ?? "",
      ageGroup: member.ageGroup ?? "",
    });
    setConfirmDelete(false);
    setError("");
  }, [member]);

  const save = async () => {
    if (!member) return;
    setSaving(true); setError("");
    try {
      const res = await fetch(`${base}/api/staff/team/${member.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          fullName: form.fullName,
          systemRole: form.systemRole,
          questionRole: form.systemRole === "academy_admin" ? null : form.questionRole,
          jobTitle: form.jobTitle || null,
          ageGroup: form.ageGroup || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Update failed"); return; }
      onUpdated({ ...member, ...data, name: data.fullName ?? data.name });
      onClose();
    } catch { setError("Something went wrong."); }
    finally { setSaving(false); }
  };

  const toggleActive = async () => {
    if (!member) return;
    setSaving(true);
    try {
      const res = await fetch(`${base}/api/staff/team/${member.id}/toggle`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ isActive: !member.isActive }),
      });
      if (res.ok) { onUpdated({ ...member, isActive: !member.isActive }); onClose(); }
    } finally { setSaving(false); }
  };

  const deleteMember = async () => {
    if (!member) return;
    setSaving(true);
    try {
      const res = await fetch(`${base}/api/staff/team/${member.id}`, {
        method: "DELETE", headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) { onDeleted(member.id); onClose(); }
    } finally { setSaving(false); setConfirmDelete(false); }
  };

  if (!member) return null;
  const isSelf = member.id === currentUserId;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} />
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#111] border-t border-white/8 rounded-t-3xl max-h-[92vh] overflow-y-auto"
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="px-5 pt-5 pb-4 flex items-center justify-between sticky top-0 bg-[#111] z-10 border-b border-white/5">
              <div>
                <h2 className="text-white font-bold text-base">{member.name ?? member.fullName}</h2>
                <p className="text-white/35 text-xs mt-0.5">{member.email}</p>
              </div>
              <button onClick={onClose} className="text-white/30 hover:text-white/60 p-1 transition-colors"><X size={18} /></button>
            </div>
            <div className="px-5 py-5 pb-12 space-y-5">
              {error && <p className="text-red-400 text-sm bg-red-950/30 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>}

              <Field label="Full name">
                <TextInput value={form.fullName} onChange={e => set("fullName")(e.target.value)} placeholder="Full name" />
              </Field>

              <RoleCards label="System access" value={form.systemRole} onChange={set("systemRole")} options={SYSTEM_ROLES} />

              {form.systemRole === "staff" && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                  <RoleCards label="Question set" value={form.questionRole} onChange={set("questionRole")} options={QUESTION_ROLES} />
                </motion.div>
              )}
              {form.systemRole === "academy_admin" && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 px-4 py-3">
                  <p className="text-emerald-400/80 text-xs">Academy Admins have full access to all sections.</p>
                </motion.div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <Field label="Job title">
                  <TextInput value={form.jobTitle} onChange={e => set("jobTitle")(e.target.value)} placeholder="e.g. Coach" />
                </Field>
                <Field label="Age group">
                  <TextInput value={form.ageGroup} onChange={e => set("ageGroup")(e.target.value)} placeholder="e.g. U16" />
                </Field>
              </div>

              <button onClick={save} disabled={saving}
                className="w-full py-3.5 rounded-2xl font-black text-sm text-white disabled:opacity-50 active:scale-[0.98] transition-all"
                style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)` }}>
                {saving ? "Saving…" : "Save Changes"}
              </button>

              {!isSelf && (
                <button onClick={toggleActive} disabled={saving}
                  className="w-full py-3.5 rounded-2xl font-semibold text-sm border border-white/10 bg-white/4 hover:bg-white/8 flex items-center justify-center gap-2 text-white/60 transition-all">
                  {member.isActive
                    ? <><ToggleRight size={16} className="text-emerald-400" /> Deactivate account</>
                    : <><ToggleLeft size={16} className="text-white/30" /> Reactivate account</>}
                </button>
              )}

              {!isSelf && (
                confirmDelete ? (
                  <div className="rounded-2xl border border-red-500/30 bg-red-950/20 p-4 space-y-3">
                    <p className="text-white/70 text-sm text-center">Remove {member.name} permanently?</p>
                    <div className="flex gap-2">
                      <button onClick={() => setConfirmDelete(false)} className="flex-1 py-2.5 rounded-xl bg-white/6 text-white/50 text-sm font-semibold">Cancel</button>
                      <button onClick={deleteMember} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-red-600/80 text-white text-sm font-bold">
                        {saving ? "Removing…" : "Yes, remove"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setConfirmDelete(true)} className="w-full py-3 text-red-400/60 hover:text-red-400 text-sm flex items-center justify-center gap-2 transition-colors">
                    <Trash2 size={14} /> Remove staff member
                  </button>
                )
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function StaffTeam() {
  const { staffUser } = useStaffAuth();
  const [team, setTeam] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<StaffMember | null>(null);

  const primaryColor = staffUser?.academyPrimaryColor ?? "#059669";

  useEffect(() => {
    fetchStaffTeam()
      .then(setTeam)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const activeCount = team.filter(m => m.isActive).length;

  return (
    <StaffLayout>
      <div className="space-y-6 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-display font-black text-white uppercase tracking-wide">Team</h1>
          <p className="text-white/40 text-sm mt-1">
            {activeCount} of {MAX_STAFF} staff slots · {MAX_STAFF - activeCount} remaining
          </p>
        </motion.div>

        {/* Slot bar */}
        <div className="flex gap-1">
          {Array.from({ length: MAX_STAFF }).map((_, i) => (
            <div key={i} className={`flex-1 h-1.5 rounded-full transition-all ${i < activeCount ? "" : "bg-white/10"}`}
              style={i < activeCount ? { background: primaryColor } : {}} />
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 size={28} className="animate-spin text-white/30" /></div>
        ) : error ? (
          <div className="glass-panel rounded-2xl p-8 text-center"><p className="text-red-400 text-sm">{error}</p></div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
            {team.map((member, i) => (
              <motion.div key={member.id}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`glass-panel rounded-2xl px-5 py-4 flex items-center gap-4 ${!member.isActive ? "opacity-50" : ""}`}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-sm shrink-0"
                  style={{ background: `${primaryColor}25` }}>
                  {(member.name ?? member.fullName ?? "?").charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-white font-semibold text-sm">{member.name ?? member.fullName}</p>
                    {!member.isActive && (
                      <span className="text-[10px] bg-white/8 text-white/30 px-1.5 py-0.5 rounded-full">inactive</span>
                    )}
                    {(member.systemRole === "academy_admin" || member.role === "academy_admin") && (
                      <span className="text-[10px] bg-emerald-900/40 text-emerald-400/80 border border-emerald-500/20 px-1.5 py-0.5 rounded-full">Admin</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${qRoleBadge(
                      (member.systemRole === "academy_admin" || member.role === "academy_admin") ? null : member.questionRole
                    )}`}>
                      {(member.systemRole === "academy_admin" || member.role === "academy_admin")
                        ? "All sections"
                        : qRoleLabel(member.questionRole)}
                    </span>
                    {member.jobTitle && <span className="text-white/30 text-xs">{member.jobTitle}</span>}
                    {member.ageGroup && <span className="text-white/25 text-xs">{member.ageGroup}</span>}
                  </div>
                  <p className="text-white/25 text-xs mt-1 truncate">{member.email}</p>
                </div>
                <button onClick={() => setEditing(member)} className="text-white/25 hover:text-white/55 transition-colors p-1 shrink-0">
                  <Pencil size={15} />
                </button>
              </motion.div>
            ))}

            {team.length === 0 && (
              <div className="glass-panel rounded-2xl p-10 text-center">
                <p className="text-white/30 text-sm">No team members yet.</p>
              </div>
            )}

            {activeCount < MAX_STAFF && (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowAdd(true)}
                className="w-full py-3.5 rounded-2xl border border-dashed border-white/15 text-white/40 hover:text-white/70 hover:border-white/25 text-sm font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <UserPlus size={15} /> Add Staff Member
              </motion.button>
            )}
          </motion.div>
        )}
      </div>

      <AddStaffSheet
        open={showAdd}
        onClose={() => setShowAdd(false)}
        primaryColor={primaryColor}
        onCreated={m => setTeam(prev => [...prev, m])}
      />
      <EditStaffSheet
        member={editing}
        open={!!editing}
        onClose={() => setEditing(null)}
        primaryColor={primaryColor}
        currentUserId={staffUser?.id ?? 0}
        onUpdated={updated => setTeam(prev => prev.map(m => m.id === updated.id ? updated : m))}
        onDeleted={id => setTeam(prev => prev.filter(m => m.id !== id))}
      />
    </StaffLayout>
  );
}
