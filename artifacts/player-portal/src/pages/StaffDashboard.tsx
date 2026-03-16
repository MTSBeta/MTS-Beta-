import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  LogOut, Users, ShieldCheck, Search, Plus, Copy, Check,
  UserPlus, Pencil, ToggleLeft, ToggleRight, Trash2, X,
  ChevronDown, Eye, EyeOff,
} from "lucide-react";
import { ACADEMIES } from "@/data/academies";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StaffUser {
  id: number;
  academyId: number;
  email: string;
  fullName: string;
  systemRole: string;
  jobTitle: string | null;
  teamName: string | null;
  ageGroup: string | null;
}

interface Player {
  id: string;
  accessCode: string;
  parentCode?: string;
  playerName: string;
  age: number;
  shirtNumber: number;
  position: string;
  ageGroup: string | null;
  status: string;
  createdAt: string;
}

interface TeamMember {
  id: number;
  email: string;
  fullName: string;
  systemRole: string;
  jobTitle: string | null;
  teamName: string | null;
  ageGroup: string | null;
  isActive: boolean;
  createdAt: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const POSITIONS = ["GK", "RB", "CB", "LB", "CDM", "CM", "CAM", "RM", "LM", "RW", "LW", "ST", "CF"];

const STATUS_MAP: Record<string, { label: string; dot: string }> = {
  registered:        { label: "Registered",    dot: "bg-white/20" },
  pending:           { label: "Not started",   dot: "bg-white/20" },
  journey_started:   { label: "In progress",   dot: "bg-amber-400" },
  journey_complete:  { label: "Journey done",  dot: "bg-blue-400" },
  links_generated:   { label: "Invites sent",  dot: "bg-emerald-400" },
  story_complete:    { label: "Story ready",   dot: "bg-purple-400" },
};

// ─── Small helpers ────────────────────────────────────────────────────────────

function StatusPill({ status }: { status: string }) {
  const { label, dot } = STATUS_MAP[status] ?? { label: status, dot: "bg-white/20" };
  return (
    <span className="flex items-center gap-1.5 shrink-0">
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      <span className="text-white/50 text-xs">{label}</span>
    </span>
  );
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <button onClick={copy} className="text-white/30 hover:text-white/70 transition-colors ml-1">
      {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
    </button>
  );
}

function Select({
  value, onChange, options, placeholder, className = "",
}: {
  value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string; className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-all pr-9"
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map(o => <option key={o.value} value={o.value} className="bg-[#1a1a1a]">{o.label}</option>)}
      </select>
      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
    </div>
  );
}

function Field({
  label, error, children,
}: { label: string; error?: string | null; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-white/50 text-xs font-semibold uppercase tracking-widest px-1">{label}</label>
      {children}
      {error && <p className="text-red-400 text-xs px-1">{error}</p>}
    </div>
  );
}

function Input({
  type = "text", value, onChange, placeholder, ...rest
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-emerald-500/50 transition-all"
      {...rest}
    />
  );
}

// ─── Sheet (bottom modal) ─────────────────────────────────────────────────────

function Sheet({
  open, onClose, title, children,
}: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#111] border-t border-white/8 rounded-t-3xl max-h-[90vh] overflow-y-auto"
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="px-5 pt-4 pb-2 flex items-center justify-between sticky top-0 bg-[#111] z-10 border-b border-white/5">
              <h2 className="text-white font-bold text-base">{title}</h2>
              <button onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors p-1">
                <X size={18} />
              </button>
            </div>
            <div className="px-5 py-5 pb-10">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Register Player Sheet ────────────────────────────────────────────────────

function RegisterPlayerSheet({
  open, onClose, token, base, academyPrimaryColor,
  onCreated,
}: {
  open: boolean; onClose: () => void; token: string; base: string;
  academyPrimaryColor?: string; onCreated: (p: Player) => void;
}) {
  const [form, setForm] = useState({ playerName: "", age: "", shirtNumber: "", position: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [created, setCreated] = useState<Player | null>(null);

  const set = (k: string) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.playerName.trim()) e.playerName = "Player name is required";
    const age = parseInt(form.age);
    if (!form.age || isNaN(age) || age < 6 || age > 21) e.age = "Age must be between 6 and 21";
    if (!form.position) e.position = "Position is required";
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    setErrors({});
    try {
      const res = await fetch(`${base}/api/staff/players`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          playerName: form.playerName.trim(),
          age: parseInt(form.age),
          shirtNumber: form.shirtNumber ? parseInt(form.shirtNumber) : 0,
          position: form.position,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setErrors({ general: data.error ?? "Failed to register player" }); return; }
      setCreated(data);
      onCreated(data);
    } catch {
      setErrors({ general: "Something went wrong. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const reset = () => {
    setForm({ playerName: "", age: "", shirtNumber: "", position: "" });
    setErrors({});
    setCreated(null);
  };

  const handleClose = () => { reset(); onClose(); };

  return (
    <Sheet open={open} onClose={handleClose} title="Register New Player">
      {created ? (
        <div className="space-y-5">
          <div className="rounded-2xl bg-emerald-900/20 border border-emerald-500/30 p-5 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
              <Check size={22} className="text-emerald-400" />
            </div>
            <p className="text-white font-bold text-lg">{created.playerName}</p>
            <p className="text-white/40 text-sm">Player registered successfully</p>
          </div>
          <div className="space-y-3">
            <div className="rounded-2xl bg-white/4 border border-white/8 p-4">
              <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-2">Player Access Code</p>
              <div className="flex items-center gap-2">
                <code className="text-white font-mono font-bold text-lg tracking-wider flex-1">{created.accessCode}</code>
                <CopyBtn text={created.accessCode} />
              </div>
              <p className="text-white/30 text-xs mt-2">Share this code with the player — they'll use it to log in.</p>
            </div>
            {created.parentCode && (
              <div className="rounded-2xl bg-white/4 border border-white/8 p-4">
                <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-2">Parent / Guardian Code</p>
                <div className="flex items-center gap-2">
                  <code className="text-white font-mono font-bold text-lg tracking-wider flex-1">{created.parentCode}</code>
                  <CopyBtn text={created.parentCode} />
                </div>
                <p className="text-white/30 text-xs mt-2">Optionally share with a parent or guardian.</p>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={reset}
              className="flex-1 py-3.5 rounded-2xl font-bold text-sm bg-white/6 border border-white/10 text-white/70 hover:bg-white/10 transition-all"
            >
              Register Another
            </button>
            <button
              onClick={handleClose}
              className="flex-1 py-3.5 rounded-2xl font-bold text-sm text-white transition-all"
              style={{ background: "linear-gradient(135deg, #059669, #047857)" }}
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {errors.general && (
            <p className="text-red-400 text-sm bg-red-950/30 border border-red-500/20 rounded-xl px-4 py-3">{errors.general}</p>
          )}
          <Field label="Full name" error={errors.playerName}>
            <Input
              value={form.playerName}
              onChange={e => set("playerName")(e.target.value)}
              placeholder="e.g. Jamie Carter"
              autoComplete="off"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Age" error={errors.age}>
              <Input
                type="number" min={6} max={21}
                value={form.age}
                onChange={e => set("age")(e.target.value)}
                placeholder="e.g. 14"
              />
            </Field>
            <Field label="Shirt no. (optional)">
              <Input
                type="number" min={1} max={99}
                value={form.shirtNumber}
                onChange={e => set("shirtNumber")(e.target.value)}
                placeholder="e.g. 9"
              />
            </Field>
          </div>
          <Field label="Position" error={errors.position}>
            <Select
              value={form.position}
              onChange={set("position")}
              placeholder="Select position"
              options={POSITIONS.map(p => ({ value: p, label: p }))}
            />
          </Field>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={submit}
            disabled={saving}
            className="w-full py-4 rounded-2xl font-black text-sm text-white disabled:opacity-50 mt-2"
            style={{ background: "linear-gradient(135deg, #059669, #047857)", boxShadow: "0 8px 32px rgba(5,150,105,0.3)" }}
          >
            {saving ? "Registering…" : "Register Player & Generate Code →"}
          </motion.button>
        </div>
      )}
    </Sheet>
  );
}

// ─── Add Staff Sheet ──────────────────────────────────────────────────────────

function AddStaffSheet({
  open, onClose, token, base, onCreated,
}: {
  open: boolean; onClose: () => void; token: string; base: string;
  onCreated: (m: TeamMember) => void;
}) {
  const [form, setForm] = useState({
    fullName: "", email: "", password: "", jobTitle: "", teamName: "", ageGroup: "", systemRole: "staff",
  });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const set = (k: string) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    if (!form.password || form.password.length < 8) e.password = "Password must be at least 8 characters";
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true); setErrors({});
    try {
      const res = await fetch(`${base}/api/staff/team`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
          jobTitle: form.jobTitle.trim() || null,
          teamName: form.teamName.trim() || null,
          ageGroup: form.ageGroup.trim() || null,
          systemRole: form.systemRole,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setErrors({ general: data.error ?? "Failed to add staff member" }); return; }
      onCreated(data);
      onClose();
      setForm({ fullName: "", email: "", password: "", jobTitle: "", teamName: "", ageGroup: "", systemRole: "staff" });
    } catch {
      setErrors({ general: "Something went wrong. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet open={open} onClose={onClose} title="Add Staff Member">
      <div className="space-y-4">
        {errors.general && (
          <p className="text-red-400 text-sm bg-red-950/30 border border-red-500/20 rounded-xl px-4 py-3">{errors.general}</p>
        )}
        <Field label="Full name" error={errors.fullName}>
          <Input value={form.fullName} onChange={e => set("fullName")(e.target.value)} placeholder="e.g. Tom Bradley" />
        </Field>
        <Field label="Email address" error={errors.email}>
          <Input type="email" value={form.email} onChange={e => set("email")(e.target.value)} placeholder="tom@academy.co.uk" />
        </Field>
        <Field label="Temporary password" error={errors.password}>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              value={form.password}
              onChange={e => set("password")(e.target.value)}
              placeholder="Min. 8 characters"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-11 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-emerald-500/50 transition-all"
            />
            <button type="button" onClick={() => setShowPass(v => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </Field>
        <Field label="Role">
          <Select
            value={form.systemRole}
            onChange={set("systemRole")}
            options={[
              { value: "staff", label: "Staff (read-only)" },
              { value: "academy_admin", label: "Academy Admin (full access)" },
            ]}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Job title (optional)">
            <Input value={form.jobTitle} onChange={e => set("jobTitle")(e.target.value)} placeholder="e.g. Head Coach" />
          </Field>
          <Field label="Age group (optional)">
            <Input value={form.ageGroup} onChange={e => set("ageGroup")(e.target.value)} placeholder="e.g. U15" />
          </Field>
        </div>
        <Field label="Team name (optional)">
          <Input value={form.teamName} onChange={e => set("teamName")(e.target.value)} placeholder="e.g. Under-15s" />
        </Field>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={submit}
          disabled={saving}
          className="w-full py-4 rounded-2xl font-black text-sm text-white disabled:opacity-50 mt-2"
          style={{ background: "linear-gradient(135deg, #059669, #047857)", boxShadow: "0 8px 32px rgba(5,150,105,0.3)" }}
        >
          {saving ? "Adding…" : "Add Staff Member →"}
        </motion.button>
      </div>
    </Sheet>
  );
}

// ─── Edit Staff Sheet ─────────────────────────────────────────────────────────

function EditStaffSheet({
  member, open, onClose, token, base, currentStaffId, onUpdated, onDeleted,
}: {
  member: TeamMember | null; open: boolean; onClose: () => void;
  token: string; base: string; currentStaffId: number;
  onUpdated: (m: TeamMember) => void; onDeleted: (id: number) => void;
}) {
  const [form, setForm] = useState({ fullName: "", jobTitle: "", teamName: "", ageGroup: "", systemRole: "staff" });
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = (k: string) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    if (member) setForm({
      fullName: member.fullName,
      jobTitle: member.jobTitle ?? "",
      teamName: member.teamName ?? "",
      ageGroup: member.ageGroup ?? "",
      systemRole: member.systemRole,
    });
  }, [member]);

  const save = async () => {
    if (!member) return;
    if (!form.fullName.trim()) { setErrors({ fullName: "Full name is required" }); return; }
    setSaving(true); setErrors({});
    try {
      const res = await fetch(`${base}/api/staff/team/${member.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          jobTitle: form.jobTitle.trim() || null,
          teamName: form.teamName.trim() || null,
          ageGroup: form.ageGroup.trim() || null,
          systemRole: form.systemRole,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setErrors({ general: data.error ?? "Update failed" }); return; }
      onUpdated(data);
      onClose();
    } catch {
      setErrors({ general: "Something went wrong." });
    } finally { setSaving(false); }
  };

  const toggleActive = async () => {
    if (!member) return;
    setSaving(true);
    try {
      const res = await fetch(`${base}/api/staff/team/${member.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ isActive: !member.isActive }),
      });
      const data = await res.json();
      if (res.ok) { onUpdated(data); onClose(); }
    } finally { setSaving(false); }
  };

  const deleteMember = async () => {
    if (!member) return;
    setSaving(true);
    try {
      const res = await fetch(`${base}/api/staff/team/${member.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) { onDeleted(member.id); onClose(); }
    } finally { setSaving(false); setConfirmDelete(false); }
  };

  if (!member) return null;
  const isSelf = member.id === currentStaffId;

  return (
    <Sheet open={open} onClose={onClose} title="Edit Staff Member">
      <div className="space-y-4">
        {errors.general && (
          <p className="text-red-400 text-sm bg-red-950/30 border border-red-500/20 rounded-xl px-4 py-3">{errors.general}</p>
        )}
        <Field label="Full name" error={errors.fullName}>
          <Input value={form.fullName} onChange={e => set("fullName")(e.target.value)} placeholder="Full name" />
        </Field>
        <Field label="Role">
          <Select value={form.systemRole} onChange={set("systemRole")}
            options={[
              { value: "staff", label: "Staff (read-only)" },
              { value: "academy_admin", label: "Academy Admin (full access)" },
            ]}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Job title">
            <Input value={form.jobTitle} onChange={e => set("jobTitle")(e.target.value)} placeholder="e.g. Coach" />
          </Field>
          <Field label="Age group">
            <Input value={form.ageGroup} onChange={e => set("ageGroup")(e.target.value)} placeholder="e.g. U16" />
          </Field>
        </div>
        <Field label="Team name">
          <Input value={form.teamName} onChange={e => set("teamName")(e.target.value)} placeholder="e.g. Under-16s" />
        </Field>

        <motion.button
          whileTap={{ scale: 0.97 }} onClick={save} disabled={saving}
          className="w-full py-3.5 rounded-2xl font-black text-sm text-white disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #059669, #047857)" }}
        >
          {saving ? "Saving…" : "Save Changes"}
        </motion.button>

        {/* Toggle active */}
        {!isSelf && (
          <button
            onClick={toggleActive} disabled={saving}
            className="w-full py-3.5 rounded-2xl font-semibold text-sm border border-white/10 bg-white/4 hover:bg-white/8 transition-all flex items-center justify-center gap-2 text-white/60"
          >
            {member.isActive
              ? <><ToggleRight size={16} className="text-emerald-400" /> Deactivate account</>
              : <><ToggleLeft size={16} className="text-white/30" /> Reactivate account</>}
          </button>
        )}

        {/* Delete */}
        {!isSelf && (
          confirmDelete ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-950/20 p-4 space-y-3">
              <p className="text-white/70 text-sm text-center">Remove {member.fullName} permanently?</p>
              <div className="flex gap-2">
                <button onClick={() => setConfirmDelete(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/6 text-white/50 text-sm font-semibold">Cancel</button>
                <button onClick={deleteMember} disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-red-600/80 text-white text-sm font-bold hover:bg-red-600 transition-colors">
                  {saving ? "Removing…" : "Yes, remove"}
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setConfirmDelete(true)}
              className="w-full py-3 rounded-2xl text-red-400/60 hover:text-red-400 text-sm flex items-center justify-center gap-2 transition-colors">
              <Trash2 size={14} /> Remove staff member
            </button>
          )
        )}
      </div>
    </Sheet>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function StaffDashboard() {
  const [_, navigate] = useLocation();
  const [staff, setStaff] = useState<StaffUser | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [tab, setTab] = useState<"players" | "team">("players");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showRegisterPlayer, setShowRegisterPlayer] = useState(false);
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  const token = localStorage.getItem("staff_token") ?? "";
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const isAdmin = staff?.systemRole === "academy_admin";

  const loadTeam = useCallback(async () => {
    if (!isAdmin) return;
    const res = await fetch(`${base}/api/staff/team`, { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) {
      const data = await res.json();
      setTeam(Array.isArray(data) ? data : []);
    }
  }, [isAdmin, base, token]);

  useEffect(() => {
    if (!token) { navigate("/staff-login"); return; }
    const stored = localStorage.getItem("staff_user");
    if (stored) setStaff(JSON.parse(stored));

    (async () => {
      try {
        const meRes = await fetch(`${base}/api/staff/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!meRes.ok) { localStorage.removeItem("staff_token"); navigate("/staff-login"); return; }
        const { staff: me } = await meRes.json();
        setStaff(me);
        localStorage.setItem("staff_user", JSON.stringify(me));

        const [playersRes] = await Promise.all([
          fetch(`${base}/api/staff/players`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        if (playersRes.ok) {
          const pd = await playersRes.json();
          setPlayers(Array.isArray(pd) ? pd : []);
        }

        if (me.systemRole === "academy_admin") {
          const teamRes = await fetch(`${base}/api/staff/team`, { headers: { Authorization: `Bearer ${token}` } });
          if (teamRes.ok) setTeam(await teamRes.json());
        }
      } catch {
        setError("Failed to load dashboard.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [token]);

  const academy = staff ? ACADEMIES.find(a => a.id === staff.academyId) : null;
  const primaryColor = academy?.primaryColor ?? "#059669";

  const filteredPlayers = players.filter(p =>
    p.playerName.toLowerCase().includes(search.toLowerCase()) ||
    (p.accessCode ?? "").toLowerCase().includes(search.toLowerCase())
  );
  const filteredTeam = team.filter(m =>
    m.fullName.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 animate-spin" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <p className="text-white/50">{error}</p>
        <button onClick={() => window.location.reload()} className="text-emerald-400 text-sm underline">Retry</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a]">

      {/* BG glow */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 opacity-4"
          style={{ background: `radial-gradient(ellipse at 50% 0%, ${primaryColor} 0%, transparent 55%)` }} />
      </div>

      {/* ── HEADER ── */}
      <div className="relative z-10 border-b border-white/6 bg-black/40 backdrop-blur-md sticky top-0">
        <div className="max-w-3xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {academy?.crestUrl
              ? <img src={academy.crestUrl} alt={academy.shortName} className="w-8 h-8 object-contain" />
              : <div className="w-8 h-8 rounded-xl bg-emerald-900/40 flex items-center justify-center"><ShieldCheck size={14} className="text-emerald-400" /></div>
            }
            <div>
              <p className="text-white font-bold text-sm leading-none">{staff?.fullName}</p>
              <p className="text-white/35 text-[11px] mt-0.5">
                {staff?.jobTitle ?? (isAdmin ? "Academy Admin" : "Staff")} · {academy?.shortName ?? "Academy"}
              </p>
            </div>
          </div>
          <button onClick={() => { localStorage.removeItem("staff_token"); localStorage.removeItem("staff_user"); navigate("/staff-login"); }}
            className="flex items-center gap-1.5 text-white/25 hover:text-white/55 text-xs transition-colors">
            <LogOut size={13} /><span>Log out</span>
          </button>
        </div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-5 space-y-5">

        {/* Stats row */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { label: "Players", value: players.length },
            { label: "In progress", value: players.filter(p => p.status === "journey_started").length },
            { label: "Journey done", value: players.filter(p => ["journey_complete", "links_generated", "story_complete"].includes(p.status)).length },
            { label: "Stories ready", value: players.filter(p => p.status === "story_complete").length },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl bg-white/4 border border-white/6 p-4">
              <p className="text-2xl font-black text-white font-display">{s.value}</p>
              <p className="text-white/35 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Tab bar */}
        {isAdmin && (
          <div className="flex gap-1 bg-white/4 border border-white/7 rounded-2xl p-1">
            {(["players", "team"] as const).map(t => (
              <button key={t}
                onClick={() => { setTab(t); setSearch(""); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                  tab === t ? "bg-white/10 text-white" : "text-white/35 hover:text-white/55"
                }`}
              >
                {t === "players" ? <><Users size={13} />Players</> : <><ShieldCheck size={13} />Team</>}
              </button>
            ))}
          </div>
        )}

        {/* ── PLAYERS TAB ── */}
        {tab === "players" && (
          <motion.div key="players" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search players…"
                  className="w-full bg-white/5 border border-white/8 rounded-xl pl-8 pr-3 py-2.5 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-white/20 transition-colors" />
              </div>
              {isAdmin && (
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => setShowRegisterPlayer(true)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-sm text-white shrink-0"
                  style={{ background: "linear-gradient(135deg, #059669, #047857)" }}>
                  <Plus size={14} /> Register
                </motion.button>
              )}
            </div>

            {filteredPlayers.length === 0 ? (
              <div className="rounded-2xl bg-white/3 border border-white/6 p-10 text-center">
                <p className="text-white/30 text-sm">
                  {players.length === 0
                    ? isAdmin ? "No players yet. Register your first player above." : "No players registered for this academy yet."
                    : `No players match "${search}".`}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredPlayers.map((player, i) => (
                  <motion.div key={player.id}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.025 }}
                    className="rounded-2xl bg-white/4 border border-white/7 px-4 py-3.5 hover:bg-white/6 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black shrink-0 text-white"
                        style={{ background: `${primaryColor}35` }}>
                        {player.playerName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm leading-none truncate">{player.playerName}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="text-white/35 text-xs">Age {player.age} · {player.position}{player.ageGroup ? ` · ${player.ageGroup}` : ""}</span>
                        </div>
                      </div>
                      <StatusPill status={player.status} />
                    </div>
                    <div className="mt-2.5 pt-2.5 border-t border-white/5 flex items-center justify-between">
                      <span className="text-white/30 text-xs">Player code</span>
                      <div className="flex items-center gap-1">
                        <code className="text-white/70 font-mono text-xs tracking-wider">{player.accessCode}</code>
                        <CopyBtn text={player.accessCode} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ── TEAM TAB ── */}
        {tab === "team" && isAdmin && (
          <motion.div key="team" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search team…"
                  className="w-full bg-white/5 border border-white/8 rounded-xl pl-8 pr-3 py-2.5 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-white/20 transition-colors" />
              </div>
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => setShowAddStaff(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-sm text-white shrink-0"
                style={{ background: "linear-gradient(135deg, #059669, #047857)" }}>
                <UserPlus size={14} /> Add Staff
              </motion.button>
            </div>

            {/* Slot usage */}
            <div className="flex items-center justify-between px-1">
              <span className="text-white/30 text-xs">{team.filter(m => m.isActive).length} of 8 staff slots used</span>
              <div className="flex gap-0.5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className={`w-4 h-1.5 rounded-full ${i < team.filter(m => m.isActive).length ? "bg-emerald-500" : "bg-white/10"}`} />
                ))}
              </div>
            </div>

            {filteredTeam.length === 0 ? (
              <div className="rounded-2xl bg-white/3 border border-white/6 p-10 text-center">
                <p className="text-white/30 text-sm">
                  {team.length === 0 ? "No team members yet. Add your first staff member above." : `No members match "${search}".`}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredTeam.map((member, i) => (
                  <motion.div key={member.id}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.025 }}
                    className={`rounded-2xl border px-4 py-3.5 transition-colors ${member.isActive ? "bg-white/4 border-white/7 hover:bg-white/6" : "bg-white/2 border-white/4 opacity-60"}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-white/8 flex items-center justify-center text-sm font-black shrink-0 text-white/80">
                        {member.fullName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-white font-semibold text-sm leading-none truncate">{member.fullName}</p>
                          {!member.isActive && <span className="text-[10px] bg-white/8 text-white/30 px-1.5 py-0.5 rounded-full shrink-0">inactive</span>}
                          {member.systemRole === "academy_admin" && (
                            <span className="text-[10px] bg-emerald-900/40 text-emerald-400/80 border border-emerald-500/20 px-1.5 py-0.5 rounded-full shrink-0">Admin</span>
                          )}
                        </div>
                        <p className="text-white/35 text-xs mt-1 truncate">
                          {[member.jobTitle, member.teamName, member.ageGroup].filter(Boolean).join(" · ") || member.email}
                        </p>
                      </div>
                      <button onClick={() => setEditingMember(member)}
                        className="text-white/25 hover:text-white/55 transition-colors p-1 shrink-0">
                        <Pencil size={14} />
                      </button>
                    </div>
                    <div className="mt-2.5 pt-2.5 border-t border-white/5 flex items-center justify-between">
                      <span className="text-white/25 text-xs truncate">{member.email}</span>
                      <CopyBtn text={member.email} />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

      </div>

      {/* ── MODALS ── */}
      <RegisterPlayerSheet
        open={showRegisterPlayer}
        onClose={() => setShowRegisterPlayer(false)}
        token={token} base={base}
        academyPrimaryColor={primaryColor}
        onCreated={p => setPlayers(prev => [p, ...prev])}
      />
      <AddStaffSheet
        open={showAddStaff}
        onClose={() => setShowAddStaff(false)}
        token={token} base={base}
        onCreated={m => setTeam(prev => [...prev, m])}
      />
      <EditStaffSheet
        member={editingMember}
        open={!!editingMember}
        onClose={() => setEditingMember(null)}
        token={token} base={base}
        currentStaffId={staff?.id ?? 0}
        onUpdated={updated => setTeam(prev => prev.map(m => m.id === updated.id ? updated : m))}
        onDeleted={id => setTeam(prev => prev.filter(m => m.id !== id))}
      />
    </div>
  );
}
