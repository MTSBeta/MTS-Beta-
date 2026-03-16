import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, UserPlus, ToggleLeft, ToggleRight } from "lucide-react";
import { StaffLayout } from "@/layouts/StaffLayout";
import { useStaffAuth } from "@/hooks/useStaffAuth";
import {
  fetchStaffTeam,
  createStaffMember,
  toggleStaffActive,
  type StaffMember,
} from "@/lib/staffApi";
import { STAFF_ROLES, ROLE_LABELS } from "@/data/staffQuestions";

const MAX_STAFF = 8;

export default function StaffTeam() {
  const { staffUser } = useStaffAuth();
  const [team, setTeam] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "football_coaching",
    jobTitle: "",
  });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [toggling, setToggling] = useState<number | null>(null);

  const primaryColor = staffUser?.academyPrimaryColor || "#3b82f6";

  useEffect(() => {
    fetchStaffTeam()
      .then(setTeam)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setFormError("Name, email, and password are required.");
      return;
    }
    setFormError("");
    setFormLoading(true);
    try {
      const newMember = await createStaffMember(formData);
      setTeam((prev) => [...prev, newMember]);
      setFormData({ name: "", email: "", password: "", role: "football_coaching", jobTitle: "" });
      setShowForm(false);
    } catch (err: any) {
      setFormError(err.message || "Failed to create staff member.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggle = async (member: StaffMember) => {
    setToggling(member.id);
    try {
      await toggleStaffActive(member.id, !member.isActive);
      setTeam((prev) =>
        prev.map((m) => (m.id === member.id ? { ...m, isActive: !m.isActive } : m))
      );
    } catch (err: any) {
      alert(err.message || "Failed to update status.");
    } finally {
      setToggling(null);
    }
  };

  const remainingSlots = MAX_STAFF - team.length;

  return (
    <StaffLayout>
      <div className="space-y-6 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-display font-black text-white uppercase tracking-wide">
            Team Management
          </h1>
          <p className="text-white/40 text-sm mt-1">
            {team.length} of {MAX_STAFF} staff accounts used &middot;{" "}
            {remainingSlots > 0 ? `${remainingSlots} slots remaining` : "No slots remaining"}
          </p>
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
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel rounded-2xl overflow-hidden"
            >
              <div className="divide-y divide-white/6">
                {team.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
                        style={{ background: member.isActive ? `${primaryColor}25` : "rgba(255,255,255,0.05)" }}
                      >
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className={`text-sm font-medium ${member.isActive ? "text-white" : "text-white/40"}`}>
                          {member.name}
                          {!member.isActive && (
                            <span className="ml-2 text-[10px] font-bold bg-red-500/15 text-red-400 px-1.5 py-0.5 rounded">
                              Inactive
                            </span>
                          )}
                        </div>
                        <div className="text-white/40 text-xs">
                          {member.email} &middot; {ROLE_LABELS[member.role] || member.role}
                          {member.jobTitle && ` &middot; ${member.jobTitle}`}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggle(member)}
                      disabled={toggling === member.id}
                      className="text-white/40 hover:text-white transition-colors disabled:opacity-50 p-1"
                      title={member.isActive ? "Deactivate" : "Activate"}
                    >
                      {toggling === member.id ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : member.isActive ? (
                        <ToggleRight size={24} style={{ color: "#22c55e" }} />
                      ) : (
                        <ToggleLeft size={24} />
                      )}
                    </button>
                  </div>
                ))}
                {team.length === 0 && (
                  <div className="p-8 text-center text-white/30 text-sm">
                    No staff accounts created yet.
                  </div>
                )}
              </div>
            </motion.div>

            {remainingSlots > 0 && !showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white transition-all hover:brightness-110"
                style={{ background: primaryColor }}
              >
                <UserPlus size={16} />
                Add Staff Member
              </button>
            )}

            {showForm && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel rounded-2xl p-6"
              >
                <h2 className="text-lg font-display font-bold text-white uppercase tracking-wide mb-4">
                  New Staff Account
                </h2>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-white/60 uppercase tracking-wider ml-1 font-display">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full h-10 rounded-xl glass-input px-4 text-sm"
                        placeholder="John Smith"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-white/60 uppercase tracking-wider ml-1 font-display">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full h-10 rounded-xl glass-input px-4 text-sm"
                        placeholder="john@academy.com"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-white/60 uppercase tracking-wider ml-1 font-display">
                        Password
                      </label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full h-10 rounded-xl glass-input px-4 text-sm"
                        placeholder="Secure password"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-white/60 uppercase tracking-wider ml-1 font-display">
                        Role
                      </label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full h-10 rounded-xl glass-input px-4 text-sm appearance-none cursor-pointer"
                      >
                        {STAFF_ROLES.map((r) => (
                          <option key={r.value} value={r.value}>
                            {r.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-white/60 uppercase tracking-wider ml-1 font-display">
                        Job Title (optional)
                      </label>
                      <input
                        type="text"
                        value={formData.jobTitle}
                        onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                        className="w-full h-10 rounded-xl glass-input px-4 text-sm"
                        placeholder="e.g. Head of Psychology"
                      />
                    </div>
                  </div>

                  {formError && (
                    <p className="text-red-400 text-sm bg-red-500/10 rounded-xl py-2 px-3 border border-red-500/20">
                      {formError}
                    </p>
                  )}

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      disabled={formLoading}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50"
                      style={{ background: primaryColor }}
                    >
                      {formLoading ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
                      {formLoading ? "Creating..." : "Create Account"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-5 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white/80 bg-white/5 hover:bg-white/10 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </>
        )}
      </div>
    </StaffLayout>
  );
}
