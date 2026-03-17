import { Trophy, Star, Link2, BookOpen, Clock, Circle } from "lucide-react";

export type BadgeType = "default" | "secondary" | "destructive" | "outline" | "role" | "status" | "achievement" | "league";

interface BadgeSystemProps {
  label: string;
  variant?: BadgeType;
  icon?: string;
  className?: string;
}

export function RoleBadge({ role }: { role: string }) {
  const roleConfig: Record<string, { label: string; color: string }> = {
    academy_admin:     { label: "Education Lead / Super Admin", color: "bg-amber-900/30 border-amber-600 text-amber-200" },
    staff:             { label: "Staff",                        color: "bg-blue-900/30 border-blue-600 text-blue-200" },
    football_coaching: { label: "Football Development Lead",    color: "bg-green-900/30 border-green-600 text-green-200" },
    psychology:        { label: "Psychology Lead",              color: "bg-purple-900/30 border-purple-600 text-purple-200" },
    education:         { label: "Education Lead",               color: "bg-amber-900/30 border-amber-600 text-amber-200" },
    player_care:       { label: "Player Care & Welfare Lead",   color: "bg-pink-900/30 border-pink-600 text-pink-200" },
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
  const statusConfig: Record<string, { label: string; dot: string; color: string }> = {
    registered:       { label: "Registered",    dot: "bg-gray-400",    color: "bg-gray-900/30 border-gray-700 text-gray-300" },
    journey_started:  { label: "In Progress",   dot: "bg-blue-400",    color: "bg-blue-900/30 border-blue-700 text-blue-200" },
    journey_complete: { label: "Journey Done",  dot: "bg-green-400",   color: "bg-green-900/30 border-green-700 text-green-200" },
    links_generated:  { label: "Links Ready",   dot: "bg-cyan-400",    color: "bg-cyan-900/30 border-cyan-700 text-cyan-200" },
    story_complete:   { label: "Story Complete", dot: "bg-emerald-400", color: "bg-emerald-900/30 border-emerald-700 text-emerald-200" },
    not_started:      { label: "Not Started",   dot: "bg-gray-500",    color: "bg-gray-900/30 border-gray-700 text-gray-300" },
  };

  const config = statusConfig[status] || { label: status, dot: "bg-gray-400", color: "bg-gray-900/30 border-gray-700 text-gray-200" };

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${config.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </div>
  );
}

export function AchievementBadge({ title, description }: { title: string; description?: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border bg-amber-900/30 border-amber-700 text-amber-200 text-xs font-semibold">
      <Star size={11} strokeWidth={2} className="shrink-0" />
      {title}
    </div>
  );
}

export function LeagueBadge({ league }: { league: "premier-league" | "championship" }) {
  const config = league === "premier-league"
    ? { label: "Premier League", color: "bg-purple-900/40 border-purple-700 text-purple-200", Icon: Trophy }
    : { label: "EFL Championship", color: "bg-blue-900/40 border-blue-700 text-blue-200", Icon: Star };

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold ${config.color}`}>
      <config.Icon size={11} strokeWidth={2} className="shrink-0" />
      {config.label}
    </div>
  );
}

export function JourneyPillarBadge({ pillar }: { pillar: string }) {
  const pillarConfig: Record<string, { label: string; dot: string; color: string }> = {
    football_coaching: { label: "Football",    dot: "bg-green-400",  color: "bg-green-900/30 border-green-700 text-green-200" },
    psychology:        { label: "Psychology",  dot: "bg-purple-400", color: "bg-purple-900/30 border-purple-700 text-purple-200" },
    education:         { label: "Education",   dot: "bg-orange-400", color: "bg-orange-900/30 border-orange-700 text-orange-200" },
    player_care:       { label: "Player Care", dot: "bg-pink-400",   color: "bg-pink-900/30 border-pink-700 text-pink-200" },
  };

  const config = pillarConfig[pillar] || { label: pillar, dot: "bg-gray-400", color: "bg-gray-900/30 border-gray-700 text-gray-200" };

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${config.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </div>
  );
}

export function StageBadge({ stage, number }: { stage: string; number?: number }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border bg-indigo-900/30 border-indigo-700 text-indigo-200 text-xs font-semibold">
      <span className="w-5 h-5 rounded-full bg-current/20 flex items-center justify-center text-[10px] font-bold">{number || "•"}</span>
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
