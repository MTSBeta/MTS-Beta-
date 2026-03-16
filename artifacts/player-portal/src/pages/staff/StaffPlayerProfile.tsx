import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRoute, useLocation, Link } from "wouter";
import {
  ArrowLeft,
  Loader2,
  User,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Circle,
  Edit3,
  Save,
  X,
} from "lucide-react";
import { StaffLayout } from "@/layouts/StaffLayout";
import { useStaffAuth } from "@/hooks/useStaffAuth";
import {
  fetchStaffPlayerProfile,
  createStaffSubmission,
  updateStaffSubmission,
  type StaffPlayerProfile as ProfileType,
} from "@/lib/staffApi";
import { STAFF_QUESTIONS, ROLE_LABELS } from "@/data/staffQuestions";

const SUBMISSION_ROLES = ["football_coaching", "psychology", "education", "player_care"];

export default function StaffPlayerProfile() {
  const [, params] = useRoute("/staff/players/:id");
  const [, navigate] = useLocation();
  const { staffUser } = useStaffAuth();
  const playerId = params?.id || "";

  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ journey: true });
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [formAnswers, setFormAnswers] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [editingSubmissionId, setEditingSubmissionId] = useState<number | null>(null);

  const primaryColor = staffUser?.academyPrimaryColor || "#3b82f6";

  useEffect(() => {
    if (!playerId) return;
    setLoading(true);
    fetchStaffPlayerProfile(playerId)
      .then(setProfile)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [playerId]);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const startEditing = (role: string) => {
    const questions = STAFF_QUESTIONS[role]?.questions || [];
    const existingSub = profile?.staffSubmissions.find(
      (s) => s.role === role && s.staffId === staffUser?.id
    );
    if (existingSub) {
      setEditingSubmissionId(existingSub.id);
      const answers = questions.map((_, qi) => {
        const resp = existingSub.responses.find((r) => r.questionNumber === qi + 1);
        return resp?.answerText || "";
      });
      setFormAnswers(answers);
    } else {
      setEditingSubmissionId(null);
      setFormAnswers(questions.map(() => ""));
    }
    setEditingRole(role);
  };

  const cancelEditing = () => {
    setEditingRole(null);
    setFormAnswers([]);
    setEditingSubmissionId(null);
  };

  const saveSubmission = async () => {
    if (!editingRole || !playerId) return;
    const questions = STAFF_QUESTIONS[editingRole]?.questions || [];
    const responses = questions.map((q, qi) => ({
      questionNumber: qi + 1,
      questionText: q,
      answerText: formAnswers[qi] || "",
    }));

    setSaving(true);
    try {
      if (editingSubmissionId) {
        await updateStaffSubmission(editingSubmissionId, { playerId, responses });
      } else {
        await createStaffSubmission({ playerId, responses });
      }
      const updated = await fetchStaffPlayerProfile(playerId);
      setProfile(updated);
      cancelEditing();
    } catch (err: any) {
      alert(err.message || "Failed to save submission.");
    } finally {
      setSaving(false);
    }
  };

  const canEditRole = (role: string) => {
    if (!staffUser) return false;
    if (staffUser.role === "academy_admin") return true;
    return staffUser.role === role;
  };

  if (loading) {
    return (
      <StaffLayout>
        <div className="flex justify-center py-20">
          <Loader2 size={32} className="animate-spin text-white/30" />
        </div>
      </StaffLayout>
    );
  }

  if (error || !profile) {
    return (
      <StaffLayout>
        <div className="glass-panel rounded-2xl p-8 text-center">
          <p className="text-red-400 text-sm">{error || "Player not found."}</p>
          <button
            onClick={() => navigate("/staff/players")}
            className="text-white/50 hover:text-white text-sm mt-4 transition-colors"
          >
            Back to Players
          </button>
        </div>
      </StaffLayout>
    );
  }

  const { player, journeyResponses, parentSubmission, staffSubmissions, completionStatus } = profile;

  const completionItems = [
    { label: "Player Journey", done: completionStatus.journey },
    { label: "Parent Submission", done: completionStatus.parent },
    { label: "Football Coaching", done: completionStatus.footballCoaching },
    { label: "Psychology", done: completionStatus.psychology },
    { label: "Education", done: completionStatus.education },
    { label: "Player Care", done: completionStatus.playerCare },
  ];
  const completedCount = completionItems.filter((c) => c.done).length;

  return (
    <StaffLayout>
      <div className="space-y-6 max-w-4xl">
        <button
          onClick={() => navigate("/staff/players")}
          className="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-sm transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Players
        </button>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-2xl p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-black font-display shrink-0"
              style={{ background: `${primaryColor}30` }}
            >
              <User size={28} />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-display font-black text-white uppercase tracking-wide">
                {player.playerName}
              </h1>
              <div className="flex flex-wrap gap-2 mt-1">
                {[
                  player.academyName,
                  player.position,
                  player.ageGroup || `Age ${player.age}`,
                  `#${player.shirtNumber}`,
                ].map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-white/50 bg-white/5 px-2.5 py-0.5 rounded-md border border-white/8"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-sm font-display font-bold text-white">
                {completedCount}/{completionItems.length}
              </div>
              <div className="text-xs text-white/40">Sections Complete</div>
            </div>
          </div>
        </motion.div>

        <div className="glass-panel rounded-2xl p-4">
          <h3 className="text-xs font-display font-bold text-white/50 uppercase tracking-wider mb-3 px-1">
            Completion Tracker
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {completionItems.map((item) => (
              <div
                key={item.label}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium ${
                  item.done
                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : "bg-white/5 text-white/30 border border-white/5"
                }`}
              >
                {item.done ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                {item.label}
              </div>
            ))}
          </div>
        </div>

        <SectionAccordion
          title="Player Journey Responses"
          sectionKey="journey"
          open={!!openSections.journey}
          onToggle={() => toggleSection("journey")}
          primaryColor={primaryColor}
        >
          {journeyResponses.length > 0 ? (
            <div className="space-y-6">
              {Array.from(new Set(journeyResponses.map((r) => r.stage))).map((stage) => (
                <div key={stage} className="space-y-3">
                  <h4
                    className="text-sm font-display font-bold uppercase tracking-wider capitalize"
                    style={{ color: primaryColor }}
                  >
                    {stage.replace(/-/g, " ")}
                  </h4>
                  {journeyResponses
                    .filter((r) => r.stage === stage)
                    .map((r) => (
                      <div key={r.questionNumber} className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
                        <p className="text-xs font-semibold text-white/60 mb-1">
                          Q{r.questionNumber}. {r.questionText}
                        </p>
                        <p className="text-white/90 text-sm italic pl-3 border-l-2 border-white/10">
                          {r.answerText}
                        </p>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/30 text-sm italic">No journey responses recorded yet.</p>
          )}
        </SectionAccordion>

        <SectionAccordion
          title="Parent Submission"
          sectionKey="parent"
          open={!!openSections.parent}
          onToggle={() => toggleSection("parent")}
          primaryColor={primaryColor}
          badge={parentSubmission?.submitted ? "Submitted" : "Pending"}
          badgeColor={parentSubmission?.submitted ? "green" : "yellow"}
        >
          {parentSubmission?.submitted && parentSubmission.responses ? (
            <div className="space-y-3">
              {parentSubmission.responses.map((r) => (
                <div key={r.questionNumber} className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
                  <p className="text-xs font-semibold text-white/60 mb-1">
                    Q{r.questionNumber}. {r.questionText}
                  </p>
                  <p className="text-white/90 text-sm italic pl-3 border-l-2 border-white/10">
                    {r.answerText}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/30 text-sm italic">Parent has not submitted yet.</p>
          )}
        </SectionAccordion>

        {SUBMISSION_ROLES.map((role) => {
          const roleSubmissions = staffSubmissions.filter((s) => s.role === role);
          const questions = STAFF_QUESTIONS[role];
          const isEditing = editingRole === role;
          const mySubmission = roleSubmissions.find((s) => s.staffId === staffUser?.id);

          return (
            <SectionAccordion
              key={role}
              title={`${questions?.emoji || ""} ${ROLE_LABELS[role] || role}`}
              sectionKey={role}
              open={!!openSections[role]}
              onToggle={() => toggleSection(role)}
              primaryColor={primaryColor}
              badge={roleSubmissions.length > 0 ? `${roleSubmissions.length} submitted` : "Pending"}
              badgeColor={roleSubmissions.length > 0 ? "green" : "yellow"}
            >
              {roleSubmissions.map((sub) => (
                <div key={sub.id} className="mb-4 last:mb-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/50 font-medium">
                      By {sub.staffName}
                    </span>
                    {sub.staffId === staffUser?.id && canEditRole(role) && !isEditing && (
                      <button
                        onClick={() => startEditing(role)}
                        className="flex items-center gap-1 text-xs hover:text-white transition-colors"
                        style={{ color: primaryColor }}
                      >
                        <Edit3 size={12} /> Edit
                      </button>
                    )}
                  </div>
                  {!(isEditing && sub.staffId === staffUser?.id) && (
                    <div className="space-y-3">
                      {sub.responses.map((r) => (
                        <div key={r.questionNumber} className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
                          <p className="text-xs font-semibold text-white/60 mb-1">
                            Q{r.questionNumber}. {r.questionText}
                          </p>
                          <p className="text-white/90 text-sm italic pl-3 border-l-2 border-white/10">
                            {r.answerText}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isEditing && questions && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 mt-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white/60 uppercase tracking-wider font-display">
                      {editingSubmissionId ? "Edit Your Observations" : "Add Your Observations"}
                    </span>
                    <button
                      onClick={cancelEditing}
                      className="text-white/40 hover:text-white/70 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  {questions.questions.map((q, qi) => (
                    <div key={qi} className="space-y-1.5">
                      <label className="text-xs text-white/70 font-medium">
                        {qi + 1}. {q}
                      </label>
                      <textarea
                        rows={3}
                        value={formAnswers[qi] || ""}
                        onChange={(e) => {
                          const updated = [...formAnswers];
                          updated[qi] = e.target.value;
                          setFormAnswers(updated);
                        }}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors resize-none"
                        placeholder="Share your observations..."
                      />
                    </div>
                  ))}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={saveSubmission}
                      disabled={saving}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50"
                      style={{ background: primaryColor }}
                    >
                      {saving ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Save size={16} />
                      )}
                      {saving ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="px-5 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white/80 bg-white/5 hover:bg-white/10 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}

              {!isEditing && canEditRole(role) && !mySubmission && (
                <button
                  onClick={() => startEditing(role)}
                  className="mt-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors hover:brightness-125"
                  style={{ color: primaryColor }}
                >
                  <Edit3 size={14} /> Add Observations
                </button>
              )}
            </SectionAccordion>
          );
        })}
      </div>
    </StaffLayout>
  );
}

function SectionAccordion({
  title,
  sectionKey,
  open,
  onToggle,
  primaryColor,
  badge,
  badgeColor,
  children,
}: {
  title: string;
  sectionKey: string;
  open: boolean;
  onToggle: () => void;
  primaryColor: string;
  badge?: string;
  badgeColor?: "green" | "yellow" | "blue";
  children: React.ReactNode;
}) {
  const badgeStyles: Record<string, string> = {
    green: "bg-green-500/15 text-green-400",
    yellow: "bg-yellow-500/15 text-yellow-400",
    blue: "bg-blue-500/15 text-blue-400",
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <h2 className="text-base font-display font-bold text-white uppercase tracking-wide">
            {title}
          </h2>
          {badge && (
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                badgeStyles[badgeColor || "blue"] || badgeStyles.blue
              }`}
            >
              {badge}
            </span>
          )}
        </div>
        {open ? (
          <ChevronUp size={18} className="text-white/30" />
        ) : (
          <ChevronDown size={18} className="text-white/30" />
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
