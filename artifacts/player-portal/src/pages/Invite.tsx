import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { Copy, CheckCircle2, Users, ChevronUp, ChevronDown, Loader2, UserCheck, Star, BookOpen, Brain, Shield } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/Button";
import { usePlayerContext } from "@/context/PlayerContext";
import { useCreateStakeholderLinks } from "@workspace/api-client-react";
import type { StakeholderLink } from "@workspace/api-client-react";

const STAKEHOLDER_ICONS: Record<string, React.ReactNode> = {
  parent: <Users size={16} />,
  friend: <UserCheck size={16} />,
  football_coach: <Star size={16} />,
  education: <BookOpen size={16} />,
  psychology: <Brain size={16} />,
  player_care: <Shield size={16} />,
};

const STAKEHOLDER_COLORS: Record<string, string> = {
  parent: "text-yellow-400",
  friend: "text-blue-400",
  football_coach: "text-green-400",
  education: "text-purple-400",
  psychology: "text-pink-400",
  player_care: "text-orange-400",
};

function CopyLink({ link }: { link: StakeholderLink }) {
  const [copied, setCopied] = useState(false);
  const url = `${window.location.origin}/stakeholder/${link.code}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  return (
    <div className="flex items-center gap-2 p-3 rounded-xl bg-black/30 border border-white/10">
      <div className={`shrink-0 ${STAKEHOLDER_COLORS[link.type] ?? "text-white/60"}`}>
        {STAKEHOLDER_ICONS[link.type] ?? <Users size={16} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-white/80 mb-0.5">{link.label}</p>
        <p className="text-xs text-white/30 font-mono truncate">{url}</p>
      </div>
      <button
        onClick={copy}
        className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/8 hover:bg-white/15 text-white/60 hover:text-white text-xs font-semibold transition-all"
      >
        {copied ? <CheckCircle2 size={13} className="text-green-400" /> : <Copy size={13} />}
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}

export default function Invite() {
  const [_, navigate] = useLocation();
  const { playerData, stakeholderLinks, setStakeholderLinks } = usePlayerContext();
  const [parentCount, setParentCount] = useState(1);
  const [friendCount, setFriendCount] = useState(2);
  const [step, setStep] = useState<"setup" | "links">(
    stakeholderLinks.length > 0 ? "links" : "setup"
  );

  const createMutation = useCreateStakeholderLinks();

  if (!playerData) {
    navigate("/");
    return null;
  }

  const generateLinks = async () => {
    try {
      const result = await createMutation.mutateAsync({
        pathParams: { playerId: playerData.id },
        body: { parentCount, friendCount },
      });
      setStakeholderLinks(result);
      setStep("links");
    } catch (err) {
      console.error("Failed to create links", err);
    }
  };

  const grouped: Record<string, StakeholderLink[]> = {
    parent: [],
    friend: [],
    staff: [],
  };

  for (const link of stakeholderLinks) {
    if (link.type === "parent") grouped.parent.push(link);
    else if (link.type === "friend") grouped.friend.push(link);
    else grouped.staff.push(link);
  }

  const Counter = ({
    value,
    onChange,
    min,
    max,
    label,
  }: {
    value: number;
    onChange: (v: number) => void;
    min: number;
    max: number;
    label: string;
  }) => (
    <div className="glass-panel rounded-2xl p-5 flex items-center justify-between">
      <div>
        <p className="text-white font-semibold text-base">{label}</p>
        <p className="text-white/40 text-xs mt-0.5">
          {value === 0 ? "None" : `${value} link${value > 1 ? "s" : ""}`}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all disabled:opacity-30"
          disabled={value <= min}
        >
          <ChevronDown size={18} />
        </button>
        <span className="text-3xl font-display font-black text-white w-8 text-center">
          {value}
        </span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all disabled:opacity-30"
          disabled={value >= max}
        >
          <ChevronUp size={18} />
        </button>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="w-full max-w-2xl mx-auto py-8 px-4">
        <AnimatePresence mode="wait">
          {step === "setup" && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <h1 className="text-3xl md:text-4xl font-display font-black text-white mb-3">
                  Your Story Is Saved
                </h1>
                <p className="text-white/60 max-w-md mx-auto">
                  Now it's time to get the people in your corner to add their perspective. Choose how many to invite.
                </p>
              </div>

              <div className="space-y-3">
                <Counter
                  label="Parents / Guardians"
                  value={parentCount}
                  onChange={setParentCount}
                  min={1}
                  max={4}
                />
                <Counter
                  label="Friends"
                  value={friendCount}
                  onChange={setFriendCount}
                  min={0}
                  max={6}
                />
              </div>

              <div className="glass-panel rounded-2xl p-4">
                <p className="text-xs text-white/40 font-semibold uppercase tracking-wide mb-2">
                  Also included automatically
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Football Coach", "Education", "Psychology", "Player Care"].map((s) => (
                    <span
                      key={s}
                      className="text-xs px-2.5 py-1 rounded-full bg-white/8 text-white/50 border border-white/10"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <Button
                onClick={generateLinks}
                disabled={createMutation.isPending}
                className="w-full py-4 text-base"
              >
                {createMutation.isPending ? (
                  <span className="flex items-center gap-2 justify-center">
                    <Loader2 size={18} className="animate-spin" />
                    Generating links...
                  </span>
                ) : (
                  `Generate ${parentCount + friendCount + 4} Invite Links →`
                )}
              </Button>
            </motion.div>
          )}

          {step === "links" && (
            <motion.div
              key="links"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h1 className="text-2xl md:text-3xl font-display font-black text-white mb-2">
                  Share These Links
                </h1>
                <p className="text-white/50 text-sm">
                  Each person gets their own unique link. Copy and share individually.
                </p>
              </div>

              {grouped.parent.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-white/30 uppercase tracking-widest">Parents</p>
                  {grouped.parent.map((l) => <CopyLink key={l.id} link={l} />)}
                </div>
              )}

              {grouped.friend.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-white/30 uppercase tracking-widest">Friends</p>
                  {grouped.friend.map((l) => <CopyLink key={l.id} link={l} />)}
                </div>
              )}

              {grouped.staff.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-white/30 uppercase tracking-widest">Academy Staff</p>
                  {grouped.staff.map((l) => <CopyLink key={l.id} link={l} />)}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  variant="secondary"
                  onClick={() => setStep("setup")}
                  className="flex-1"
                >
                  ← Adjust
                </Button>
                <Button
                  onClick={() => navigate("/complete")}
                  className="flex-1"
                >
                  Done →
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
