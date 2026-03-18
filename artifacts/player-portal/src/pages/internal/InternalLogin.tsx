import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Loader2, Feather, ArrowLeft } from "lucide-react";
import { useInternalAuth } from "@/context/InternalAuthContext";

export default function InternalLogin() {
  const [, navigate] = useLocation();
  const { login, internalUser } = useInternalAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (internalUser) navigate("/internal/stories");
  }, [internalUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
      navigate("/internal/stories");
    } catch (err: any) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative" style={{ background: "#080810" }}>
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 30% 0%, rgba(167,139,250,0.06) 0%, transparent 60%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 70% 100%, rgba(167,139,250,0.03) 0%, transparent 50%)" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-sm"
      >
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-white/30 hover:text-white/60 text-sm mb-10 transition-colors"
        >
          <ArrowLeft size={14} />
          Back
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.25)" }}
          >
            <Feather size={20} className="text-violet-400" />
          </div>
          <div>
            <div className="text-white font-bold text-lg leading-tight">MeTime Stories</div>
            <div className="text-white/40 text-xs">Production Workspace</div>
          </div>
        </div>

        <div
          className="rounded-2xl p-7"
          style={{
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.07)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div
            className="absolute inset-x-0 top-0 h-px rounded-t-2xl mx-7"
            style={{ background: "linear-gradient(90deg, transparent, rgba(167,139,250,0.5), transparent)" }}
          />

          <h1 className="text-white font-bold text-xl mb-1">Author login</h1>
          <p className="text-white/40 text-sm mb-7">MeTime Stories authors and illustrators only</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-white/50 text-xs uppercase tracking-widest font-semibold">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@metimestories.com"
                autoComplete="email"
                className="w-full px-4 py-3 rounded-xl text-white placeholder-white/20 text-sm focus:outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(167,139,250,0.5)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-white/50 text-xs uppercase tracking-widest font-semibold">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full px-4 py-3 rounded-xl text-white placeholder-white/20 text-sm focus:outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(167,139,250,0.5)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm py-2 px-3 rounded-lg"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-50 mt-2"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
                color: "#fff",
                boxShadow: "0 4px 24px rgba(124,58,237,0.35)",
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={14} className="animate-spin" />
                  Signing in…
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>

        <div className="mt-6 flex flex-col items-center gap-2">
          <p className="text-white/20 text-xs text-center">
            Not an author or illustrator?{" "}
            <button onClick={() => navigate("/staff-login")} className="text-white/40 hover:text-white/70 underline transition-colors">
              Academy staff login
            </button>
          </p>
          <button
            onClick={() => navigate("/admin-login")}
            className="text-white/15 hover:text-white/40 text-xs underline transition-colors"
          >
            Website admin
          </button>
        </div>
      </motion.div>
    </div>
  );
}
