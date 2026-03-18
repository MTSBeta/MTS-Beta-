import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  ChevronDown,
  ChevronRight,
  User,
  Heart,
  Zap,
  Globe,
  Users,
  Star,
  Lightbulb,
  FileText,
  Volume2,
  Image as ImageIcon,
  ExternalLink,
  ArrowLeft,
  Edit3,
  CheckCircle2,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { InternalLayout } from "@/layouts/InternalLayout";
import { fetchPlayerProfile, updateProject, fetchBlueprint, approveBlueprint, revokeBlueprint, getStatusMeta, STORY_STATUSES, type JourneyResponse, type StoryBlueprint } from "@/lib/internalApi";
import { useInternalAuth } from "@/context/InternalAuthContext";

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  color?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function Section({ title, icon, color = "#a78bfa", children, defaultOpen = true }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-white/[0.06] overflow-hidden" style={{ background: "rgba(255,255,255,0.02)" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 transition-colors hover:bg-white/[0.02]"
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${color}18` }}>
            <div style={{ color }}>{icon}</div>
          </div>
          <span className="text-white font-semibold text-sm">{title}</span>
        </div>
        {open ? <ChevronDown size={15} className="text-white/30" /> : <ChevronRight size={15} className="text-white/30" />}
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
            <div className="px-5 pb-5 border-t border-white/[0.05]">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ResponseCard({ q, r }: { q: JourneyResponse; r?: JourneyResponse }) {
  const item = r ?? q;
  const hasMedia = (item.mediaUrls?.length ?? 0) > 0;
  const hasAudio = !!item.audioUrl;
  return (
    <div className="py-3 border-b border-white/[0.05] last:border-0">
      <div className="text-white/40 text-[11px] mb-1.5">{item.questionText}</div>
      <div className="text-white/80 text-sm leading-relaxed">{item.answerText || <span className="text-white/20 italic">No response</span>}</div>
      {(hasAudio || hasMedia) && (
        <div className="flex gap-2 mt-2">
          {hasAudio && (
            <a href={item.audioUrl!} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-violet-400 hover:text-violet-300 text-xs">
              <Volume2 size={11} />
              Voice note
            </a>
          )}
          {hasMedia && (
            <span className="flex items-center gap-1 text-blue-400 text-xs">
              <ImageIcon size={11} />
              {item.mediaUrls.length} image{item.mediaUrls.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function RawDrawer({ journeyResponses }: { journeyResponses: JourneyResponse[] }) {
  const [open, setOpen] = useState(false);
  const byStage = journeyResponses.reduce<Record<string, JourneyResponse[]>>((acc, r) => {
    acc[r.stage] = acc[r.stage] ?? [];
    acc[r.stage].push(r);
    return acc;
  }, {});
  return (
    <div className="mt-4 border border-white/[0.06] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-white/40 hover:text-white/60 text-xs transition-colors"
        style={{ background: "rgba(255,255,255,0.02)" }}
      >
        <span>Raw Source Drawer — all journey responses</span>
        {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
            <div className="px-4 pb-4 pt-2 space-y-4">
              {Object.entries(byStage).map(([stage, items]) => (
                <div key={stage}>
                  <div className="text-white/30 text-[10px] uppercase tracking-widest mb-2">{stage}</div>
                  {items.map((r) => <ResponseCard key={r.id} q={r} />)}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function StoryProfile() {
  const [, params] = useRoute("/internal/stories/:playerId/profile");
  const playerId = params?.playerId ?? "";
  const [, navigate] = useLocation();
  const { internalUser } = useInternalAuth();

  const [data, setData] = useState<Awaited<ReturnType<typeof fetchPlayerProfile>> | null>(null);
  const [blueprint, setBlueprint] = useState<StoryBlueprint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingStatus, setEditingStatus] = useState(false);
  const [saving, setSaving] = useState(false);
  const [blueprintActing, setBlueprintActing] = useState(false);

  useEffect(() => {
    if (!playerId) return;
    Promise.all([
      fetchPlayerProfile(playerId),
      fetchBlueprint(playerId).catch(() => null),
    ])
      .then(([d, bp]) => {
        setData(d);
        if (bp) setBlueprint(bp.blueprint);
        setError("");
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [playerId]);

  const handleBlueprintApprove = async () => {
    if (blueprintActing) return;
    setBlueprintActing(true);
    try {
      const { blueprint: updated } = await approveBlueprint(playerId);
      setBlueprint(updated);
      setData((prev) => prev ? { ...prev, project: { ...prev.project, status: "draft_in_progress" } } : prev);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setBlueprintActing(false);
    }
  };

  const handleBlueprintRevoke = async () => {
    if (blueprintActing) return;
    setBlueprintActing(true);
    try {
      const { blueprint: updated } = await revokeBlueprint(playerId);
      setBlueprint(updated);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setBlueprintActing(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!data) return;
    setSaving(true);
    try {
      await updateProject(playerId, { status: newStatus } as any);
      setData((prev) => prev ? { ...prev, project: { ...prev.project, status: newStatus } } : prev);
      setEditingStatus(false);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <InternalLayout>
      <div className="flex items-center justify-center py-32">
        <Loader2 size={24} className="text-violet-400 animate-spin" />
      </div>
    </InternalLayout>
  );

  if (error || !data) return (
    <InternalLayout>
      <div className="text-red-400 text-sm py-10">{error || "Player not found"}</div>
    </InternalLayout>
  );

  const { player, project, journeyResponses, journeyByStage, staffByRole, stakeholderResponses, media } = data;

  const allAnswers = (stage: string) => journeyByStage[stage] ?? [];
  const dnaSummary = allAnswers("dna");
  const onboarding = allAnswers("onboarding");
  const allJourney = journeyResponses;

  const coachSubs = staffByRole["football_coaching"] ?? staffByRole["coach"] ?? [];
  const psychSubs = staffByRole["psychology"] ?? [];
  const parentLink = stakeholderResponses.find((l: any) => l.type === "parent" || l.type === "parent_guardian");

  const statusMeta = getStatusMeta(project.status ?? "intake_in_progress");

  return (
    <InternalLayout playerId={playerId} playerName={player.playerName}>
      <div className="space-y-5 max-w-4xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          <button
            onClick={() => navigate("/internal/stories")}
            className="flex items-center gap-1.5 text-white/30 hover:text-white/60 text-xs mb-4 transition-colors"
          >
            <ArrowLeft size={12} />
            All Projects
          </button>

          <div className="rounded-2xl border border-white/[0.08] p-6" style={{ background: "linear-gradient(135deg, rgba(167,139,250,0.05) 0%, rgba(255,255,255,0.02) 100%)" }}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white">{player.playerName}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span className="text-white/50 text-sm">{player.academyName}</span>
                  <span className="text-white/20">·</span>
                  <span className="text-white/50 text-sm">{player.ageGroup}</span>
                  <span className="text-white/20">·</span>
                  <span className="text-white/50 text-sm">{player.position}</span>
                  {player.secondPosition && <><span className="text-white/20">·</span><span className="text-white/30 text-sm">{player.secondPosition}</span></>}
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  {editingStatus ? (
                    <div className="flex items-center gap-2 flex-wrap">
                      {STORY_STATUSES.map((s) => (
                        <button
                          key={s.value}
                          onClick={() => handleStatusChange(s.value)}
                          disabled={saving}
                          className="px-2 py-0.5 rounded-full text-[10px] font-semibold border transition-all"
                          style={{
                            background: project.status === s.value ? `${s.color}22` : "transparent",
                            color: s.color,
                            borderColor: `${s.color}44`,
                          }}
                        >
                          {s.label}
                        </button>
                      ))}
                      <button onClick={() => setEditingStatus(false)} className="text-white/30 text-xs ml-1">Cancel</button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{ background: `${statusMeta.color}22`, color: statusMeta.color, border: `1px solid ${statusMeta.color}44` }}
                      >
                        {statusMeta.label}
                      </span>
                      <button onClick={() => setEditingStatus(true)} className="text-white/30 hover:text-violet-400 transition-colors">
                        <Edit3 size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="text-white/30 text-xs font-mono">{player.accessCode}</div>
                <div className="flex gap-2 text-xs text-white/30">
                  {project.assignedAuthor ? (
                    <span className="px-2 py-0.5 rounded bg-white/5 text-white/50">Author: {project.assignedAuthor}</span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-white/5 text-white/20">No author assigned</span>
                  )}
                </div>
                {/* Blueprint approval status */}
                {blueprint && (
                  <div className="flex items-center gap-2 mt-1">
                    {blueprint.blueprintApproved ? (
                      <span className="flex items-center gap-1.5 text-xs text-green-400 bg-green-500/10 border border-green-500/20 rounded-full px-2.5 py-0.5">
                        <CheckCircle2 size={11} />
                        Blueprint approved by {blueprint.blueprintApprovedBy}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-2.5 py-0.5">
                        <Lock size={11} />
                        Blueprint pending approval
                      </span>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mt-2">
                  <button
                    onClick={() => navigate(`/internal/stories/${playerId}/blueprint`)}
                    className="px-4 py-2 rounded-lg text-sm font-semibold text-violet-300 border border-violet-500/30 hover:bg-violet-500/10 transition-all"
                  >
                    Open Blueprint →
                  </button>
                  <button
                    onClick={() => navigate(`/internal/stories/${playerId}/builder`)}
                    className="px-4 py-2 rounded-lg text-sm font-semibold text-white border border-white/10 hover:bg-white/5 transition-all"
                  >
                    Story Builder →
                  </button>
                  {blueprint && (internalUser?.role === "editor" || internalUser?.role === "admin") && (
                    <>
                      {!blueprint.blueprintApproved ? (
                        <button
                          onClick={handleBlueprintApprove}
                          disabled={blueprintActing}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-green-300 border border-green-500/30 hover:bg-green-500/10 transition-all disabled:opacity-50"
                        >
                          {blueprintActing ? <Loader2 size={12} className="animate-spin" /> : <ShieldCheck size={12} />}
                          Approve Blueprint
                        </button>
                      ) : (
                        <button
                          onClick={handleBlueprintRevoke}
                          disabled={blueprintActing}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-white/30 border border-white/10 hover:bg-white/5 hover:text-white/60 transition-all disabled:opacity-50"
                        >
                          {blueprintActing ? <Loader2 size={11} className="animate-spin" /> : <Lock size={11} />}
                          Revoke Approval
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* A. At a Glance */}
        <Section title="At a Glance" icon={<User size={14} />} color="#a78bfa">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            {[
              { label: "Age", value: `${player.age} years old` },
              { label: "Age Group", value: player.ageGroup ?? "—" },
              { label: "Position", value: player.position },
              { label: "Shirt Number", value: player.shirtNumber ? `#${player.shirtNumber}` : "—" },
            ].map((item) => (
              <div key={item.label} className="rounded-lg p-3 border border-white/[0.05]" style={{ background: "rgba(255,255,255,0.02)" }}>
                <div className="text-white/30 text-[10px] uppercase tracking-wide mb-1">{item.label}</div>
                <div className="text-white text-sm font-medium">{item.value}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-lg p-3 border border-white/[0.05]" style={{ background: "rgba(255,255,255,0.02)" }}>
            <div className="text-white/30 text-[10px] uppercase tracking-wide mb-1">Journey Responses</div>
            <div className="flex gap-4 text-sm text-white/60">
              <span>{journeyResponses.length} total responses</span>
              <span>{media.voiceNotes.length} voice notes</span>
              <span>{media.images.length} images</span>
              <span>{stakeholderResponses.filter((s: any) => s.submitted).length} stakeholder submissions</span>
            </div>
          </div>
        </Section>

        {/* B. Identity Summary */}
        <Section title="Identity Summary" icon={<Star size={14} />} color="#f59e0b">
          <div className="mt-4 space-y-0">
            {(dnaSummary.length > 0 ? dnaSummary : onboarding.slice(0, 4)).map((r) => (
              <ResponseCard key={r.id} q={r} />
            ))}
            {allJourney.filter((r) => r.stage === "identity" || r.questionText.toLowerCase().includes("describe yourself")).map((r) => (
              <ResponseCard key={r.id} q={r} />
            ))}
            {allJourney.length === 0 && <div className="text-white/20 text-sm py-3 italic">No journey responses recorded yet</div>}
          </div>
        </Section>

        {/* C. Emotional Profile */}
        <Section title="Emotional Profile" icon={<Heart size={14} />} color="#ec4899" defaultOpen={false}>
          <div className="mt-4 space-y-0">
            {allJourney
              .filter((r) =>
                r.questionText.toLowerCase().includes("feel") ||
                r.questionText.toLowerCase().includes("emotion") ||
                r.questionText.toLowerCase().includes("pressure") ||
                r.questionText.toLowerCase().includes("hard") ||
                r.questionText.toLowerCase().includes("setback") ||
                r.questionText.toLowerCase().includes("challenge") ||
                r.stage === "mindset"
              )
              .map((r) => <ResponseCard key={r.id} q={r} />)}
            {psychSubs.length > 0 && (
              <div className="mt-3 pt-3 border-t border-white/[0.05]">
                <div className="text-white/30 text-[10px] uppercase tracking-widest mb-2">Staff — Psychology</div>
                {psychSubs.map((s: any) => (
                  <div key={s.id} className="py-2 text-white/70 text-sm">{s.content}</div>
                ))}
              </div>
            )}
            {allJourney.filter((r) =>
              r.questionText.toLowerCase().includes("feel") || r.questionText.toLowerCase().includes("pressure")
            ).length === 0 && psychSubs.length === 0 && (
              <div className="text-white/20 text-sm py-3 italic">No emotional data captured yet</div>
            )}
          </div>
        </Section>

        {/* D. Football Narrative */}
        <Section title="Football Narrative" icon={<Zap size={14} />} color="#34d399" defaultOpen={false}>
          <div className="mt-4 space-y-0">
            {allJourney
              .filter((r) =>
                r.stage === "football" ||
                r.questionText.toLowerCase().includes("proud") ||
                r.questionText.toLowerCase().includes("dream") ||
                r.questionText.toLowerCase().includes("goal") ||
                r.questionText.toLowerCase().includes("moment") ||
                r.questionText.toLowerCase().includes("football") ||
                r.questionText.toLowerCase().includes("match") ||
                r.questionText.toLowerCase().includes("performance")
              )
              .map((r) => <ResponseCard key={r.id} q={r} />)}
            {coachSubs.length > 0 && (
              <div className="mt-3 pt-3 border-t border-white/[0.05]">
                <div className="text-white/30 text-[10px] uppercase tracking-widest mb-2">Coach Observations</div>
                {coachSubs.map((s: any) => (
                  <div key={s.id} className="py-2 text-white/70 text-sm">{s.content}</div>
                ))}
              </div>
            )}
          </div>
        </Section>

        {/* E. Support Network */}
        <Section title="Support Network" icon={<Users size={14} />} color="#60a5fa" defaultOpen={false}>
          <div className="mt-4 space-y-0">
            {allJourney
              .filter((r) =>
                r.questionText.toLowerCase().includes("family") ||
                r.questionText.toLowerCase().includes("support") ||
                r.questionText.toLowerCase().includes("tell") ||
                r.questionText.toLowerCase().includes("mum") ||
                r.questionText.toLowerCase().includes("dad") ||
                r.questionText.toLowerCase().includes("friend") ||
                r.questionText.toLowerCase().includes("who")
              )
              .map((r) => <ResponseCard key={r.id} q={r} />)}
            {stakeholderResponses
              .filter((l: any) => l.submitted)
              .map((link: any) => (
                <div key={link.id} className="mt-3 pt-3 border-t border-white/[0.05]">
                  <div className="text-white/30 text-[10px] uppercase tracking-widest mb-2">
                    {link.type?.replace("_", " ")} Response
                  </div>
                  {link.responses?.map((r: any) => (
                    <div key={r.id} className="py-2 border-b border-white/[0.04] last:border-0">
                      <div className="text-white/40 text-[11px] mb-1">{r.question_text}</div>
                      <div className="text-white/70 text-sm">{r.answer_text}</div>
                    </div>
                  ))}
                </div>
              ))}
          </div>
        </Section>

        {/* F. Signature Details */}
        <Section title="Signature Details" icon={<Globe size={14} />} color="#fb923c" defaultOpen={false}>
          <div className="mt-4 space-y-0">
            {allJourney
              .filter((r) =>
                r.questionText.toLowerCase().includes("object") ||
                r.questionText.toLowerCase().includes("ritual") ||
                r.questionText.toLowerCase().includes("routine") ||
                r.questionText.toLowerCase().includes("superstition") ||
                r.questionText.toLowerCase().includes("symbol") ||
                r.questionText.toLowerCase().includes("value") ||
                r.questionText.toLowerCase().includes("mean")
              )
              .map((r) => <ResponseCard key={r.id} q={r} />)}
          </div>
        </Section>

        {/* G. Creator Guidance */}
        <Section title="Creator Guidance" icon={<Lightbulb size={14} />} color="#f0abfc" defaultOpen={false}>
          <div className="mt-4 p-4 rounded-lg border border-violet-500/20 text-white/60 text-sm leading-relaxed" style={{ background: "rgba(167,139,250,0.05)" }}>
            <p className="text-white/40 text-xs mb-3 uppercase tracking-widest">Tone Guidance — Me Time Stories</p>
            <ul className="space-y-1.5 list-disc list-inside text-white/50 text-sm">
              <li>Emotionally intelligent, age-appropriate</li>
              <li>Football-specific and realistic</li>
              <li>Warm but not cheesy — inspiring without sounding fake</li>
              <li>Truthful, not generic — avoid motivational poster clichés</li>
              <li>Trust the player's own words where possible</li>
              <li>Dialogue should feel real, not scripted</li>
            </ul>
          </div>
          <div className="mt-3">
            <button
              onClick={() => navigate(`/internal/stories/${playerId}/blueprint`)}
              className="flex items-center gap-2 text-violet-400 hover:text-violet-300 text-sm transition-colors"
            >
              <FileText size={14} />
              Open Story Blueprint to begin building
              <ChevronRight size={12} />
            </button>
          </div>
        </Section>

        {/* H. Source Materials */}
        <Section title="Source Materials" icon={<FileText size={14} />} color="#94a3b8" defaultOpen={false}>
          <div className="mt-4 space-y-4">
            {media.images.length > 0 && (
              <div>
                <div className="text-white/30 text-[10px] uppercase tracking-widest mb-2">Uploaded Images ({media.images.length})</div>
                <div className="flex flex-wrap gap-2">
                  {media.images.slice(0, 6).map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noreferrer" className="w-16 h-16 rounded-lg overflow-hidden border border-white/10 hover:border-violet-500/40 transition-colors">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </a>
                  ))}
                  {media.images.length > 6 && (
                    <div className="w-16 h-16 rounded-lg border border-white/10 flex items-center justify-center text-white/30 text-xs">
                      +{media.images.length - 6}
                    </div>
                  )}
                </div>
              </div>
            )}

            {media.voiceNotes.length > 0 && (
              <div>
                <div className="text-white/30 text-[10px] uppercase tracking-widest mb-2">Voice Notes ({media.voiceNotes.length})</div>
                <div className="space-y-2">
                  {media.voiceNotes.map((vn: any, i) => (
                    <a
                      key={i}
                      href={vn.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg border border-white/[0.06] hover:border-violet-500/30 transition-colors text-sm"
                      style={{ background: "rgba(255,255,255,0.02)" }}
                    >
                      <Volume2 size={14} className="text-violet-400 flex-shrink-0" />
                      <span className="text-white/60 flex-1 truncate">{vn.questionText}</span>
                      <ExternalLink size={12} className="text-white/20" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {media.images.length === 0 && media.voiceNotes.length === 0 && (
              <div className="text-white/20 text-sm italic">No media uploaded yet</div>
            )}
          </div>
          <RawDrawer journeyResponses={journeyResponses} />
        </Section>
      </div>
    </InternalLayout>
  );
}
