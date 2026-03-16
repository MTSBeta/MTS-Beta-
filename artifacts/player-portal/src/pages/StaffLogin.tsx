import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";

export default function StaffLogin() {
  const [_, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) { setError("Please enter your email and password."); return; }
    setError(null);
    setIsLoading(true);
    try {
      const base = import.meta.env.BASE_URL.replace(/\/$/, "");
      const res = await fetch(`${base}/api/staff/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Login failed. Please check your credentials."); return; }
      localStorage.setItem("staff_token", data.token);
      localStorage.setItem("staff_user", JSON.stringify(data.staff));
      navigate("/staff");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4">

      {/* BG */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 via-transparent to-transparent" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] opacity-8 bg-emerald-800 pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-sm">

        {/* Logo + heading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <img
            src={`${import.meta.env.BASE_URL}images/metime-logo.png`}
            alt="Me Time Stories"
            className="h-14 w-auto mx-auto object-contain mb-5"
            style={{ mixBlendMode: "screen" }}
          />
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-900/30 border border-emerald-500/25 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4">
            <ShieldCheck size={12} />
            Staff Access
          </div>
          <h1 className="text-3xl font-display font-black text-white tracking-tight">
            Academy Login
          </h1>
          <p className="text-white/40 text-sm mt-2">
            Log in with the credentials provided by your academy administrator.
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleLogin}
          className="space-y-4"
        >
          {/* Email */}
          <div>
            <label className="block text-white/50 text-xs font-semibold uppercase tracking-widest mb-1.5 px-1">
              Email address
            </label>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@academy.co.uk"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-emerald-500/50 focus:bg-white/8 transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-white/50 text-xs font-semibold uppercase tracking-widest mb-1.5 px-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pr-12 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-emerald-500/50 focus:bg-white/8 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm px-1"
            >
              {error}
            </motion.p>
          )}

          {/* Submit */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl mt-2 disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, #059669, #047857)",
              color: "#ffffff",
              boxShadow: "0 8px 32px rgba(5,150,105,0.35)",
            }}
          >
            {isLoading ? "Logging in…" : "Log In →"}
          </motion.button>
        </motion.form>

        {/* Back to player portal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-6"
        >
          <button
            onClick={() => navigate("/")}
            className="text-white/25 text-xs hover:text-white/50 transition-colors"
          >
            ← Back to Player Portal
          </button>
        </motion.div>

        {/* Note for new staff */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 p-4 rounded-2xl bg-white/3 border border-white/6 text-center"
        >
          <p className="text-white/30 text-xs leading-relaxed">
            New to the platform? Your academy administrator will create your account and send you your login credentials.
          </p>
        </motion.div>

      </div>
    </div>
  );
}
