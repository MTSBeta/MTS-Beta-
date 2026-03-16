import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Search, Loader2, ChevronRight, Plus, X, Copy, Check, UserPlus } from "lucide-react";
import { StaffLayout } from "@/layouts/StaffLayout";
import { useStaffAuth } from "@/hooks/useStaffAuth";
import { fetchStaffPlayers, createPlayer, type StaffPlayer, type CreatedPlayer } from "@/lib/staffApi";
import { StatusBadge } from "@/components/BadgeSystem";

const STATUS_STYLES: Record<string, string> = {
  completed: "bg-green-500/20 text-green-400",
  registered: "bg-blue-500/20 text-blue-400",
  in_progress: "bg-yellow-500/20 text-yellow-400",
};

const POSITIONS = [
  "Goalkeeper",
  "Right Back",
  "Centre Back",
  "Left Back",
  "Defensive Midfielder",
  "Central Midfielder",
  "Attacking Midfielder",
  "Right Winger",
  "Left Winger",
  "Striker",
];

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={handleCopy}
      className="ml-2 p-1 rounded-md hover:bg-white/10 transition-colors text-white/40 hover:text-white/80"
      title="Copy"
    >
      {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
    </button>
  );
}

function AddPlayerModal({ onClose, onCreated, primaryColor }: {
  onClose: () => void;
  onCreated: (p: CreatedPlayer) => void;
  primaryColor: string;
}) {
  const [playerName, setPlayerName] = useState("");
  const [age, setAge] = useState("");
  const [shirtNumber, setShirtNumber] = useState("");
  const [position, setPosition] = useState("");
  const [secondPosition, setSecondPosition] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState<CreatedPlayer | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!playerName.trim() || !age || !position) {
      setError("Name, age, and position are required.");
      return;
    }
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 6 || ageNum > 21) {
      setError("Age must be between 6 and 21.");
      return;
    }
    setLoading(true);
    try {
      const player = await createPlayer({
        playerName: playerName.trim(),
        age: ageNum,
        shirtNumber: shirtNumber ? parseInt(shirtNumber) : 0,
        position,
        secondPosition: secondPosition || undefined,
      });
      setCreated(player);
      onCreated(player);
    } catch (err: any) {
      setError(err.message || "Failed to create player.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        className="w-full max-w-md glass-panel rounded-3xl p-7 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>

        {!created ? (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${primaryColor}25` }}
              >
                <UserPlus size={18} style={{ color: primaryColor }} />
              </div>
              <div>
                <h2 className="text-lg font-display font-black text-white uppercase tracking-wide">
                  Add Player
                </h2>
                <p className="text-white/40 text-xs">Generate an access code for a new player</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/50 uppercase tracking-wider font-display">
                  Player Name
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Full name"
                  className="w-full h-11 rounded-xl bg-white/5 border border-white/10 px-4 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/50 uppercase tracking-wider font-display">
                    Age
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g. 12"
                    min={6}
                    max={21}
                    className="w-full h-11 rounded-xl bg-white/5 border border-white/10 px-4 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/50 uppercase tracking-wider font-display">
                    Shirt # (optional)
                  </label>
                  <input
                    type="number"
                    value={shirtNumber}
                    onChange={(e) => setShirtNumber(e.target.value)}
                    placeholder="e.g. 9"
                    min={1}
                    max={99}
                    className="w-full h-11 rounded-xl bg-white/5 border border-white/10 px-4 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/50 uppercase tracking-wider font-display">
                    Primary Position
                  </label>
                  <select
                    value={position}
                    onChange={(e) => { setPosition(e.target.value); if (secondPosition === e.target.value) setSecondPosition(""); }}
                    className="w-full h-11 rounded-xl bg-white/5 border border-white/10 px-4 text-white text-sm focus:outline-none focus:border-white/30 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="">Select…</option>
                    {POSITIONS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/50 uppercase tracking-wider font-display">
                    Second <span className="text-white/30 normal-case font-normal">(opt.)</span>
                  </label>
                  <select
                    value={secondPosition}
                    onChange={(e) => setSecondPosition(e.target.value)}
                    className="w-full h-11 rounded-xl bg-white/5 border border-white/10 px-4 text-white text-sm focus:outline-none focus:border-white/30 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="">None</option>
                    {POSITIONS.filter((p) => p !== position).map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.p
                    key="err"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-red-400 text-sm bg-red-500/10 rounded-xl py-2 px-3 border border-red-500/20"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl text-black font-display font-black text-sm uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ background: loading ? "#ffffff60" : "#ffffff" }}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Creating…
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    Generate Code
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-center mb-6">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-display font-black text-white"
                style={{ background: `${primaryColor}30`, border: `1px solid ${primaryColor}40` }}
              >
                {created.playerName.charAt(0)}
              </div>
              <h2 className="text-xl font-display font-black text-white uppercase tracking-wide">
                {created.playerName}
              </h2>
              <p className="text-white/40 text-sm mt-1">
                {created.position} · {created.ageGroup} · #{created.shirtNumber || "–"}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="text-xs font-bold text-white/40 uppercase tracking-wider font-display mb-2">
                  Player Access Code
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white font-mono font-bold text-lg tracking-widest">
                    {created.accessCode}
                  </span>
                  <CopyButton value={created.accessCode} />
                </div>
                <p className="text-white/30 text-xs mt-1.5">Give this code to the player to start their journey</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="text-xs font-bold text-white/40 uppercase tracking-wider font-display mb-2">
                  Parent / Guardian Code
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white font-mono font-bold text-lg tracking-widest">
                    {created.parentCode}
                  </span>
                  <CopyButton value={created.parentCode} />
                </div>
                <p className="text-white/30 text-xs mt-1.5">Share this with the parent or guardian</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full h-11 rounded-xl bg-white/10 hover:bg-white/15 text-white font-display font-bold text-sm uppercase tracking-wider transition-colors"
            >
              Done
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default function StaffPlayers() {
  const { staffUser } = useStaffAuth();
  const [players, setPlayers] = useState<StaffPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [ageFilter, setAgeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const loadPlayers = () => {
    fetchStaffPlayers()
      .then(setPlayers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadPlayers(); }, []);

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
  const isAdmin = staffUser?.role === "academy_admin";

  return (
    <StaffLayout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-display font-black text-white uppercase tracking-wide">
              Players
            </h1>
            <p className="text-white/40 text-sm mt-1">
              {players.length} player{players.length !== 1 ? "s" : ""} in your academy
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 h-10 rounded-xl text-sm font-display font-bold uppercase tracking-wide transition-all shrink-0"
              style={{ background: primaryColor, color: "#fff" }}
            >
              <Plus size={16} />
              Add Player
            </button>
          )}
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
                <option key={ag} value={ag}>{ag}</option>
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
                    <th className="p-4 text-xs font-bold text-white/50 uppercase tracking-wider font-display">Player</th>
                    <th className="p-4 text-xs font-bold text-white/50 uppercase tracking-wider font-display">Position</th>
                    <th className="p-4 text-xs font-bold text-white/50 uppercase tracking-wider font-display">Age Group</th>
                    <th className="p-4 text-xs font-bold text-white/50 uppercase tracking-wider font-display">Status</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/6">
                  {filtered.map((player) => (
                    <tr key={player.id} className="hover:bg-white/5 transition-colors group cursor-pointer">
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
                              <div className="text-white text-sm font-medium">{player.playerName}</div>
                              <div className="text-white/40 text-xs">#{player.shirtNumber}</div>
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td className="p-4 text-white/70 text-sm">{player.position}</td>
                      <td className="p-4 text-white/70 text-sm">{player.ageGroup || `U${player.age}`}</td>
                      <td className="p-4"><StatusBadge status={player.status} /></td>
                      <td className="p-4 text-right">
                        <Link href={`/staff/players/${player.id}`}>
                          <ChevronRight size={18} className="text-white/20 group-hover:text-white/60 inline-block cursor-pointer" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-10 text-center text-white/30 text-sm">
                        {players.length === 0
                          ? isAdmin
                            ? 'No players yet. Click "Add Player" to get started.'
                            : "No players registered yet."
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
                          {player.position} &middot; {player.ageGroup || `U${player.age}`} &middot; #{player.shirtNumber}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${STATUS_STYLES[player.status] || "bg-white/10 text-white/50"}`}>
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
                    ? isAdmin
                      ? 'No players yet. Tap "Add Player" to get started.'
                      : "No players registered yet."
                    : "No players match your filters."}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showAddModal && (
          <AddPlayerModal
            primaryColor={primaryColor}
            onClose={() => setShowAddModal(false)}
            onCreated={() => {
              setLoading(true);
              loadPlayers();
            }}
          />
        )}
      </AnimatePresence>
    </StaffLayout>
  );
}
