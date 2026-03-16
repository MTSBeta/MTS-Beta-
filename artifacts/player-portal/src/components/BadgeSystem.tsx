import { Badge } from "@/components/ui/badge";

export type BadgeType = "default" | "secondary" | "destructive" | "outline" | "role" | "status" | "achievement" | "league";

interface BadgeSystemProps {
  label: string;
  variant?: BadgeType;
  icon?: string;
  className?: string;
}

export function RoleBadge({ role }: { role: string }) {
  const roleConfig: Record<string, { label: string; color: string }> = {
    academy_admin: { label: "Academy Admin", color: "bg-amber-900/30 border-amber-600 text-amber-200" },
    staff: { label: "Staff", color: "bg-blue-900/30 border-blue-600 text-blue-200" },
    football_coaching: { label: "Football Coaching", color: "bg-green-900/30 border-green-600 text-green-200" },
    psychology: { label: "Psychology", color: "bg-purple-900/30 border-purple-600 text-purple-200" },
    education: { label: "Education", color: "bg-orange-900/30 border-orange-600 text-orange-200" },
    player_care: { label: "Player Care", color: "bg-pink-900/30 border-pink-600 text-pink-200" },
  };

  const config = roleConfig[role] || { label: role, color: "bg-gray-900/30 border-gray-600 text-gray-200" };

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${config.color}`}>
      <span className="w-2 h-2 rounded-full bg-current opacity-60" />
      {config.label}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { label: string; icon: string; color: string }> = {
    journey_started: { label: "In Progress", icon: "⏱️", color: "bg-blue-900/30 border-blue-600 text-blue-200" },
    journey_complete: { label: "Journey Complete", icon: "✓", color: "bg-green-900/30 border-green-600 text-green-200" },
    links_generated: { label: "Links Ready", icon: "🔗", color: "bg-cyan-900/30 border-cyan-600 text-cyan-200" },
    story_complete: { label: "Story Complete", icon: "📖", color: "bg-emerald-900/30 border-emerald-600 text-emerald-200" },
    not_started: { label: "Not Started", icon: "○", color: "bg-gray-900/30 border-gray-600 text-gray-200" },
  };

  const config = statusConfig[status] || { label: status, icon: "•", color: "bg-gray-900/30 border-gray-600 text-gray-200" };

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${config.color}`}>
      <span>{config.icon}</span>
      {config.label}
    </div>
  );
}

export function AchievementBadge({ title, description }: { title: string; description?: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border bg-amber-900/30 border-amber-600 text-amber-200 text-xs font-semibold">
      <span>⭐</span>
      {title}
    </div>
  );
}

export function LeagueBadge({ league }: { league: "premier-league" | "championship" }) {
  const config = league === "premier-league"
    ? { label: "Premier League", icon: "🏆", color: "bg-purple-900/40 border-purple-600 text-purple-200" }
    : { label: "EFL Championship", icon: "🥈", color: "bg-blue-900/40 border-blue-600 text-blue-200" };

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold ${config.color}`}>
      <span>{config.icon}</span>
      {config.label}
    </div>
  );
}

export function JourneyPillarBadge({ pillar }: { pillar: string }) {
  const pillarConfig: Record<string, { label: string; emoji: string; color: string }> = {
    football_coaching: { label: "Football", emoji: "⚽", color: "bg-green-900/30 border-green-600 text-green-200" },
    psychology: { label: "Psychology", emoji: "🧠", color: "bg-purple-900/30 border-purple-600 text-purple-200" },
    education: { label: "Education", emoji: "📚", color: "bg-orange-900/30 border-orange-600 text-orange-200" },
    player_care: { label: "Player Care", emoji: "❤️", color: "bg-pink-900/30 border-pink-600 text-pink-200" },
  };

  const config = pillarConfig[pillar] || { label: pillar, emoji: "•", color: "bg-gray-900/30 border-gray-600 text-gray-200" };

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${config.color}`}>
      <span>{config.emoji}</span>
      {config.label}
    </div>
  );
}

export function StageBadge({ stage, number }: { stage: string; number?: number }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border bg-indigo-900/30 border-indigo-600 text-indigo-200 text-xs font-semibold">
      <span className="w-5 h-5 rounded-full bg-current/20 flex items-center justify-center text-[10px]">{number || "•"}</span>
      {stage}
    </div>
  );
}

export function BadgeGroup({ badges }: { badges: { type: string; props: Record<string, any> }[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge, idx) => {
        if (badge.type === "role") return <RoleBadge key={idx} {...badge.props} />;
        if (badge.type === "status") return <StatusBadge key={idx} {...badge.props} />;
        if (badge.type === "achievement") return <AchievementBadge key={idx} {...badge.props} />;
        if (badge.type === "league") return <LeagueBadge key={idx} {...badge.props} />;
        if (badge.type === "pillar") return <JourneyPillarBadge key={idx} {...badge.props} />;
        if (badge.type === "stage") return <StageBadge key={idx} {...badge.props} />;
        return null;
      })}
    </div>
  );
}
