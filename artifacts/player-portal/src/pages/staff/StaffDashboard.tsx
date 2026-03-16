import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Users, CheckCircle2, Clock, ArrowRight, Loader2 } from "lucide-react";
import { StaffLayout } from "@/layouts/StaffLayout";
import { useStaffAuth } from "@/hooks/useStaffAuth";
import { fetchStaffPlayers, type StaffPlayer } from "@/lib/staffApi";
import { ROLE_LABELS } from "@/data/staffQuestions";
import { RoleBadge, StatusBadge } from "@/components/BadgeSystem";

export default function StaffDashboard() {
  const { staffUser } = useStaffAuth();
  const [players, setPlayers] = useState<StaffPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStaffPlayers()
      .then(setPlayers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const totalPlayers = players.length;
  const completedPlayers = players.filter((p) =>
    ["journey_complete", "links_generated", "story_complete"].includes(p.status)
  ).length;
  const inProgress = players.filter((p) => p.status === "journey_started").length;

  const recentPlayers = [...players]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const primaryColor = staffUser?.academyPrimaryColor || "#3b82f6";

  return (
    <StaffLayout>
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-display font-black text-white uppercase tracking-wide">
            Welcome back, {staffUser?.name?.split(" ")[0]}
          </h1>
          <div className="flex flex-wrap items-center gap-3 mt-3">
            {staffUser?.role && <RoleBadge role={staffUser.role} />}
            <span className="text-white/30">•</span>
            <span className="text-white/60 text-sm">{staffUser?.academyName}</span>
          </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  label: "Total Players",
                  value: totalPlayers,
                  icon: <Users size={20} />,
                  color: primaryColor,
                },
                {
                  label: "Completed",
                  value: completedPlayers,
                  icon: <CheckCircle2 size={20} />,
                  color: "#22c55e",
                },
                {
                  label: "In Progress",
                  value: inProgress,
                  icon: <Clock size={20} />,
                  color: "#eab308",
                },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-panel rounded-2xl p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white/40 text-xs font-bold uppercase tracking-wider font-display">
                      {stat.label}
                    </span>
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: `${stat.color}20`, color: stat.color }}
                    >
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-3xl font-display font-black text-white">{stat.value}</div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-panel rounded-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-white/8">
                <h2 className="text-lg font-display font-bold text-white uppercase tracking-wide">
                  Recent Players
                </h2>
                <Link href="/staff/players">
                  <span className="text-xs font-bold uppercase tracking-wider hover:text-white transition-colors cursor-pointer flex items-center gap-1" style={{ color: primaryColor }}>
                    View All <ArrowRight size={14} />
                  </span>
                </Link>
              </div>
              {recentPlayers.length > 0 ? (
                <div className="divide-y divide-white/6">
                  {recentPlayers.map((player) => (
                    <Link key={player.id} href={`/staff/players/${player.id}`}>
                      <div className="flex items-center justify-between px-5 py-3.5 hover:bg-white/5 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                            style={{ background: `${primaryColor}25` }}
                          >
                            {player.playerName.charAt(0)}
                          </div>
                          <div>
                            <div className="text-white text-sm font-medium">{player.playerName}</div>
                            <div className="text-white/40 text-xs">
                              {player.position} &middot; {player.ageGroup || `Age ${player.age}`}
                            </div>
                          </div>
                        </div>
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded-md ${
                            player.status === "completed"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {player.status}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-white/30 text-sm">
                  No players registered yet.
                </div>
              )}
            </motion.div>
          </>
        )}
      </div>
    </StaffLayout>
  );
}
