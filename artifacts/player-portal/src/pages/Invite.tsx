import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { Copy, CheckCircle2, Share2, Users, UserCheck, Star, BookOpen, Brain, Shield, ChevronLeft, Loader2 } from "lucide-react";
import { usePlayerContext } from "@/context/PlayerContext";
import { useCreateStakeholderLinks } from "@workspace/api-client-react";
import type { StakeholderLink } from "@workspace/api-client-react";

const ICONS: Record<string, React.ReactNode> = {
  parent: <Users size={16} />,
  friend: <UserCheck size={16} />,
  football_coach: <Star size={16} />,
  education: <BookOpen size={16} />,
  psychology: <Brain size={16} />,
  player_care: <Shield size={16} />,
};
const COLORS: Record<string, string> = {
  parent: "#fbbf24",
  friend: "#60a5fa",
  football_coach: "#34d399",
  education: "#a78bfa",
  psychology: "#f472b6",
  player_care: "#fb923c",
};

function isLight(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 160;
}

function ShareCard({ link }: { link: StakeholderLink }) {
  const [copied, setCopied] = useState(false);
  const url = `${window.location.origin}/stakeholder/${link.code}`;
  const color = COLORS[link.type] ?? "#9ca3af";

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: link.label, text: `Please fill in this form for me — ${link.label}`, url });
        return;
      } catch {}
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  return (
    <div className="flex items-center gap-3 p-4 rounded-2xl"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${color}20`, color }}>
        {ICONS[link.type] ?? <Users size={16} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-semibold">{link.label}</p>
        <p className="text-white/25 text-xs font-mono truncate">{link.code}</p>
      </div>
      <motion.button
        whileTap={{ scale: 0.93 }}
        onClick={handleShare}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0"
        style={{
          background: copied ? "rgba(52,211,153,0.15)" : "rgba(255,255,255,0.08)",
          color: copied ? "#34d399" : "rgba(255,255,255,0.7)"
        }}
      >
        {copied
          ? <><CheckCircle2 size={13} />Copied!</>
          : navigator.share
          ? <><Share2 size={13} />Share</>
          : <><Copy size={13} />Copy</>
        }
      </motion.button>
    </div>
  );
}

function Counter({ label, sub, value, onChange, min, max, color }: {
  label: string; sub: string; value: number; onChange: (v: number) => void;
  min: number; max: number; color: string;
}) {
  return (
    <div className="flex items-center justify-between p-5 rounded-2xl"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div>
        <p className="text-white font-bold text-base">{label}</p>
        <p className="text-white/35 text-xs mt-0.5">{sub}</p>
      </div>
      <div className="flex items-center gap-4">
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-11 h-11 rounded-full bg-white/8 hover:bg-white/15 flex items-center justify-center text-white text-xl font-black transition-all disabled:opacity-25"
        >−</motion.button>
        <span className="text-3xl font-display font-black text-white w-8 text-center tabular-nums">{value}</span>
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="w-11 h-11 rounded-full flex items-center justify-center text-xl font-black transition-all disabled:opacity-25"
          style={{ background: color, color: isLight(color) ? "#000" : "#fff" }}
        >+</motion.button>
      </div>
    </div>
  );
}

export default function Invite() {
  const [_, navigate] = useLocation();
  const { playerData, selectedAcademy, stakeholderLinks, setStakeholderLinks } = usePlayerContext();
  const isU9 = (playerData?.age ?? 99) <= 8;
  const [parentCount, setParentCount] = useState(isU9 ? 2 : 1);
  const [friendCount, setFriendCount] = useState(isU9 ? 0 : 2);
  const [step, setStep] = useState<"setup" | "links">(stakeholderLinks.length > 0 ? "links" : "setup");
  const createMutation = useCreateStakeholderLinks();

  if (!playerData) { navigate("/"); return null; }

  const primaryColor = selectedAcademy?.primaryColor ?? "#6d28d9";
  const btnText = isLight(primaryColor) ? "#000" : "#fff";
  const totalLinks = parentCount + friendCount + 4;

  const grouped: Record<string, StakeholderLink[]> = { parent: [], friend: [], staff: [] };
  for (const link of stakeholderLinks) {
    if (link.type === "parent") grouped.parent.push(link);
    else if (link.type === "friend") grouped.friend.push(link);
    else grouped.staff.push(link);
  }

  const generateLinks = async () => {
    try {
      const result = await createMutation.mutateAsync({ playerId: playerData.id, data: { parentCount, friendCount } });
      setStakeholderLinks(result);
      setStep("links");
    } catch (err) { console.error("Failed to create links", err); }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* BG */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img src={`${import.meta.env.BASE_URL}images/hero-bg.png`} alt=""
          className="w-full h-full object-cover opacity-15 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0a]" />
      </div>

      {/* Topbar */}
      <div className="relative z-10 flex items-center px-4 h-12 border-b border-white/5">
        {step === "links" && (
          <button onClick={() => setStep("setup")} className="flex items-center gap-1 text-white/40 hover:text-white/70 text-xs transition-colors py-2 -ml-1">
            <ChevronLeft size={15} />Adjust
          </button>
        )}
        <div className="flex-1 flex justify-center">
          <span className="text-white/40 text-xs font-bold uppercase tracking-widest">
            {step === "setup" ? "Invite People" : "Share Links"}
          </span>
        </div>
        {step === "links" && <div className="w-14" />}
      </div>

      {/* Body */}
      <div className="relative z-10 flex-1 overflow-y-auto pb-32">
        <AnimatePresence mode="wait">

          {/* ── SETUP ── */}
          {step === "setup" && (
            <motion.div key="setup"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="max-w-sm mx-auto px-4 pt-8 space-y-5"
            >
              {/* Hero */}
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-green-500/15 text-green-400 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <h1 className="text-3xl font-display font-black text-white leading-tight">
                  {isU9 ? <>Story saved! 🎉<br /><span style={{ color: primaryColor }}>Share with the grown-ups.</span></> : <>Story saved.<br /><span style={{ color: primaryColor }}>Now get your crew.</span></>}
                </h1>
                <p className="text-white/45 text-sm mt-3 leading-relaxed">
                  {isU9
                    ? "Send links to your parents and coaches. They add their thoughts to make the story even more special."
                    : "The people who know you best add their view. Choose how many links to generate."
                  }
                </p>
              </div>

              {/* Counters */}
              <Counter
                label="Parents / Guardians"
                sub={isU9 ? "Mum, dad, carer, grandparent…" : "Mum, dad, carer…"}
                value={parentCount}
                onChange={setParentCount}
                min={1} max={4}
                color={primaryColor}
              />
              {!isU9 && (
                <Counter label="Friends" sub="Mates who really know you" value={friendCount} onChange={setFriendCount} min={0} max={6} color={primaryColor} />
              )}
              {isU9 && (
                <Counter
                  label="Other Adults"
                  sub="Older sibling, aunt/uncle, family friend…"
                  value={friendCount}
                  onChange={setFriendCount}
                  min={0} max={4}
                  color={primaryColor}
                />
              )}

              {/* Auto-included */}
              <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <p className="text-white/35 text-xs font-bold uppercase tracking-widest mb-3">Also included automatically</p>
                <div className="flex flex-wrap gap-2">
                  {["Football Coach", "Education", "Psychology", "Player Care"].map(s => (
                    <span key={s} className="text-xs px-3 py-1.5 rounded-full bg-white/6 text-white/50 border border-white/8">{s}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── LINKS ── */}
          {step === "links" && (
            <motion.div key="links"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="max-w-sm mx-auto px-4 pt-6 pb-4 space-y-5"
            >
              <div className="text-center">
                <h1 className="text-2xl font-display font-black text-white mb-1">Send these links 📤</h1>
                <p className="text-white/40 text-sm">Each person gets their own. Share them one at a time.</p>
              </div>

              {grouped.parent.length > 0 && (
                <div className="space-y-2">
                  <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Parents</p>
                  {grouped.parent.map(l => <ShareCard key={l.id} link={l} />)}
                </div>
              )}
              {grouped.friend.length > 0 && (
                <div className="space-y-2">
                  <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Friends</p>
                  {grouped.friend.map(l => <ShareCard key={l.id} link={l} />)}
                </div>
              )}
              {grouped.staff.length > 0 && (
                <div className="space-y-2">
                  <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Academy Staff</p>
                  {grouped.staff.map(l => <ShareCard key={l.id} link={l} />)}
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-20 px-4 pb-6 pt-3"
        style={{ background: "linear-gradient(to top, #0a0a0a 70%, transparent)" }}>
        <div className="max-w-sm mx-auto">
          {step === "setup" ? (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={generateLinks}
              disabled={createMutation.isPending}
              className="w-full py-4 rounded-2xl font-black text-base uppercase tracking-widest disabled:opacity-50 font-display"
              style={{ background: primaryColor, color: btnText, boxShadow: `0 8px 32px ${primaryColor}55` }}
            >
              {createMutation.isPending
                ? <span className="flex items-center justify-center gap-2"><Loader2 size={18} className="animate-spin" />Generating…</span>
                : `Generate ${totalLinks} Links →`
              }
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/complete")}
              className="w-full py-4 rounded-2xl font-black text-base uppercase tracking-widest font-display"
              style={{ background: primaryColor, color: btnText, boxShadow: `0 8px 32px ${primaryColor}55` }}
            >
              All Done →
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
