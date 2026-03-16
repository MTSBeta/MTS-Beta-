import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { LogOut, Users, ChevronRight, ShieldCheck, Search } from "lucide-react";
import { ACADEMIES } from "@/data/academies";

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
  id: number;
  playerCode: string;
  playerName: string;
  age: number;
  position: string;
  status: string;
  createdAt: string;
}

function statusLabel(status: string) {
  const map: Record<string, { label: string; color: string }> = {
    pending:           { label: "Not started",    color: "text-white/30" },
    journey_started:   { label: "In progress",    color: "text-amber-400" },
    journey_complete:  { label: "Journey done",   color: "text-blue-400" },
    links_generated:   { label: "Invites sent",   color: "text-emerald-400" },
    story_complete:    { label: "Story complete",  color: "text-purple-400" },
  };
  return map[status] ?? { label: status, color: "text-white/30" };
}

function roleLabel(role: string) {
  const map: Record<string, string> = {
    academy_admin: "Academy Admin",
    staff: "Staff",
  };
  return map[role] ?? role;
}

export default function StaffDashboard() {
  const [_, navigate] = useLocation();
  const [staff, setStaff] = useState<StaffUser | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("staff_token") : null;
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");

  useEffect(() => {
    if (!token) { navigate("/staff-login"); return; }
    const stored = localStorage.getItem("staff_user");
    if (stored) setStaff(JSON.parse(stored));

    (async () => {
      try {
        const [meRes, playersRes] = await Promise.all([
          fetch(`${base}/api/staff/me`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${base}/api/staff/players`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        if (!meRes.ok) { localStorage.removeItem("staff_token"); navigate("/staff-login"); return; }
        const meData = await meRes.json();
        setStaff(meData.staff);
        localStorage.setItem("staff_user", JSON.stringify(meData.staff));
        if (playersRes.ok) {
          const pd = await playersRes.json();
          setPlayers(Array.isArray(pd) ? pd : pd.players ?? []);
        }
      } catch {
        setError("Failed to load dashboard. Please try again.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("staff_token");
    localStorage.removeItem("staff_user");
    navigate("/staff-login");
  };

  const academy = staff ? ACADEMIES.find(a => a.id === staff.academyId) : null;
  const filtered = players.filter(p =>
    p.playerName.toLowerCase().includes(search.toLowerCase()) ||
    p.playerCode.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <p className="text-white/50">{error}</p>
          <button onClick={() => window.location.reload()} className="text-emerald-400 text-sm underline">Try again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">

      {/* BG */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {academy && (
          <div className="absolute inset-0 opacity-5"
            style={{ background: `radial-gradient(ellipse at 50% 0%, ${academy.primaryColor} 0%, transparent 60%)` }} />
        )}
      </div>

      {/* ── HEADER ── */}
      <div className="relative z-10 border-b border-white/6 bg-black/40 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {academy?.crestUrl ? (
              <img src={academy.crestUrl} alt={academy.shortName} className="w-8 h-8 object-contain" />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-emerald-900/40 flex items-center justify-center">
                <ShieldCheck size={14} className="text-emerald-400" />
              </div>
            )}
            <div>
              <p className="text-white font-bold text-sm leading-none">{staff?.fullName}</p>
              <p className="text-white/35 text-[11px] mt-0.5">
                {staff?.jobTitle ?? roleLabel(staff?.systemRole ?? "")} · {academy?.shortName ?? "Academy"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-white/30 hover:text-white/60 text-xs transition-colors"
          >
            <LogOut size={13} />
            <span>Log out</span>
          </button>
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-6 space-y-6">

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {[
            { label: "Total players",  value: players.length },
            { label: "In progress",    value: players.filter(p => p.status === "journey_started").length },
            { label: "Journey done",   value: players.filter(p => ["journey_complete","links_generated","story_complete"].includes(p.status)).length },
            { label: "Stories ready",  value: players.filter(p => p.status === "story_complete").length },
          ].map((stat, i) => (
            <div key={i} className="rounded-2xl bg-white/4 border border-white/7 p-4">
              <p className="text-2xl font-black text-white font-display">{stat.value}</p>
              <p className="text-white/35 text-xs mt-0.5">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Players list */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users size={15} className="text-white/40" />
              <span className="text-white/50 text-xs font-bold uppercase tracking-widest">Players</span>
            </div>
            <div className="relative">
              <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search…"
                className="bg-white/5 border border-white/8 rounded-xl pl-8 pr-3 py-2 text-white text-xs placeholder:text-white/25 focus:outline-none focus:border-white/20 transition-colors w-40"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl bg-white/3 border border-white/6 p-8 text-center">
              <p className="text-white/30 text-sm">
                {players.length === 0 ? "No players registered yet for this academy." : `No players match "${search}".`}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((player, i) => {
                const { label, color } = statusLabel(player.status);
                return (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center gap-4 rounded-2xl bg-white/4 border border-white/7 px-4 py-3.5 hover:bg-white/6 transition-colors"
                  >
                    {/* Avatar initial */}
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black shrink-0 text-white"
                      style={{ background: academy ? `${academy.primaryColor}40` : "rgba(255,255,255,0.1)" }}>
                      {player.playerName.charAt(0)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm leading-none truncate">{player.playerName}</p>
                      <p className="text-white/35 text-xs mt-1">
                        Age {player.age} · {player.position} · <span className="font-mono">{player.playerCode}</span>
                      </p>
                    </div>

                    <span className={`text-xs font-semibold shrink-0 ${color}`}>{label}</span>
                    <ChevronRight size={14} className="text-white/15 shrink-0" />
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Admin note */}
        {staff?.systemRole === "academy_admin" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl bg-emerald-900/15 border border-emerald-500/20 p-4"
          >
            <p className="text-emerald-300/70 text-xs leading-relaxed">
              <span className="font-bold text-emerald-300/90">Admin account.</span> You can add up to 8 staff members for your academy. Staff management tools are coming soon.
            </p>
          </motion.div>
        )}

      </div>
    </div>
  );
}
