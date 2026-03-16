import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Search, Loader2, ChevronRight, Filter } from "lucide-react";
import { StaffLayout } from "@/layouts/StaffLayout";
import { useStaffAuth } from "@/hooks/useStaffAuth";
import { fetchStaffPlayers, type StaffPlayer } from "@/lib/staffApi";
import { StatusBadge } from "@/components/BadgeSystem";

const STATUS_STYLES: Record<string, string> = {
  completed: "bg-green-500/20 text-green-400",
  registered: "bg-blue-500/20 text-blue-400",
  in_progress: "bg-yellow-500/20 text-yellow-400",
};

export default function StaffPlayers() {
  const { staffUser } = useStaffAuth();
  const [players, setPlayers] = useState<StaffPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [ageFilter, setAgeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchStaffPlayers()
      .then(setPlayers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const ageGroups = useMemo(
    () => [...new Set(players.map((p) => p.ageGroup || `U${p.age}`).filter(Boolean))].sort(),
    [players]
  );
  const statuses = useMemo(
    () => [...new Set(players.map((p) => p.status).filter(Boolean))].sort(),
    [players]
  );

  const filtered = useMemo(() => {
    return players.filter((p) => {
      const matchesSearch =
        !search ||
        p.playerName.toLowerCase().includes(search.toLowerCase()) ||
        p.position.toLowerCase().includes(search.toLowerCase());
      const matchesAge = !ageFilter || (p.ageGroup || `U${p.age}`) === ageFilter;
      const matchesStatus = !statusFilter || p.status === statusFilter;
      return matchesSearch && matchesAge && matchesStatus;
    });
  }, [players, search, ageFilter, statusFilter]);

  const primaryColor = staffUser?.academyPrimaryColor || "#3b82f6";

  return (
    <StaffLayout>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-display font-black text-white uppercase tracking-wide">
            Players
          </h1>
          <p className="text-white/40 text-sm mt-1">
            {players.length} player{players.length !== 1 ? "s" : ""} in your academy
          </p>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search by name or position..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={ageFilter}
              onChange={(e) => setAgeFilter(e.target.value)}
              className="h-10 bg-white/5 border border-white/10 rounded-xl px-3 text-white text-sm focus:outline-none focus:border-white/30 transition-colors appearance-none cursor-pointer min-w-[120px]"
            >
              <option value="">All Ages</option>
              {ageGroups.map((ag) => (
                <option key={ag} value={ag}>
                  {ag}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 bg-white/5 border border-white/10 rounded-xl px-3 text-white text-sm focus:outline-none focus:border-white/30 transition-colors appearance-none cursor-pointer min-w-[130px]"
            >
              <option value="">All Status</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1).replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={32} className="animate-spin text-white/30" />
          </div>
        ) : error ? (
          <div className="glass-panel rounded-2xl p-8 text-center">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-2xl overflow-hidden"
          >
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/8 bg-white/[0.03]">
                    <th className="p-4 text-xs font-bold text-white/50 uppercase tracking-wider font-display">
                      Player
                    </th>
                    <th className="p-4 text-xs font-bold text-white/50 uppercase tracking-wider font-display">
                      Position
                    </th>
                    <th className="p-4 text-xs font-bold text-white/50 uppercase tracking-wider font-display">
                      Age Group
                    </th>
                    <th className="p-4 text-xs font-bold text-white/50 uppercase tracking-wider font-display">
                      Status
                    </th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/6">
                  {filtered.map((player) => (
                    <tr
                      key={player.id}
                      className="hover:bg-white/5 transition-colors group cursor-pointer"
                    >
                      <td className="p-4">
                        <Link href={`/staff/players/${player.id}`}>
                          <div className="flex items-center gap-3 cursor-pointer">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                              style={{ background: `${primaryColor}25` }}
                            >
                              {player.playerName.charAt(0)}
                            </div>
                            <div>
                              <div className="text-white text-sm font-medium">
                                {player.playerName}
                              </div>
                              <div className="text-white/40 text-xs">
                                #{player.shirtNumber}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td className="p-4 text-white/70 text-sm">{player.position}</td>
                      <td className="p-4 text-white/70 text-sm">
                        {player.ageGroup || `U${player.age}`}
                      </td>
                      <td className="p-4">
                        <StatusBadge status={player.status} />
                      </td>
                      <td className="p-4 text-right">
                        <Link href={`/staff/players/${player.id}`}>
                          <ChevronRight
                            size={18}
                            className="text-white/20 group-hover:text-white/60 inline-block cursor-pointer"
                          />
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-10 text-center text-white/30 text-sm">
                        {players.length === 0
                          ? "No players registered yet."
                          : "No players match your filters."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="md:hidden divide-y divide-white/6">
              {filtered.map((player) => (
                <Link key={player.id} href={`/staff/players/${player.id}`}>
                  <div className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
                        style={{ background: `${primaryColor}25` }}
                      >
                        {player.playerName.charAt(0)}
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium">{player.playerName}</div>
                        <div className="text-white/40 text-xs">
                          {player.position} &middot; {player.ageGroup || `U${player.age}`} &middot;
                          #{player.shirtNumber}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          STATUS_STYLES[player.status] || "bg-white/10 text-white/50"
                        }`}
                      >
                        {player.status.replace("_", " ")}
                      </span>
                      <ChevronRight size={16} className="text-white/20" />
                    </div>
                  </div>
                </Link>
              ))}
              {filtered.length === 0 && (
                <div className="p-8 text-center text-white/30 text-sm">
                  {players.length === 0
                    ? "No players registered yet."
                    : "No players match your filters."}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </StaffLayout>
  );
}
