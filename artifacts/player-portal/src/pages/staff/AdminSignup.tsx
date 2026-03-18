import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { Loader2, ShieldCheck, ArrowLeft, CheckCircle2, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useStaffAuth } from "@/hooks/useStaffAuth";

const API_BASE = `${import.meta.env.BASE_URL}api`.replace(/\/api$/, "/api");

export default function AdminSignup() {
  const [, navigate] = useLocation();
  const { login, staffUser } = useStaffAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [detectedAcademy, setDetectedAcademy] = useState<{ key: string; name: string } | null>(null);
  const [codeChecking, setCodeChecking] = useState(false);
  const [codeError, setCodeError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const lookupTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (staffUser) navigate("/staff-dashboard");
  }, [staffUser]);

  // Auto-detect academy from access code
  useEffect(() => {
    const code = accessCode.trim();
    setDetectedAcademy(null);
    setCodeError("");

    if (lookupTimer.current) clearTimeout(lookupTimer.current);

    if (code.length < 8) return;

    lookupTimer.current = setTimeout(async () => {
      setCodeChecking(true);
      try {
        const res = await fetch(`${API_BASE}/staff/lookup-academy?code=${encodeURIComponent(code)}`);
        if (res.ok) {
          const data = await res.json();
          setDetectedAcademy(data);
          setCodeError("");
        } else {
          setDetectedAcademy(null);
          setCodeError("Code not recognised. Please check and try again.");
        }
      } catch {
        setCodeError("");
      } finally {
        setCodeChecking(false);
      }
    }, 500);

    return () => { if (lookupTimer.current) clearTimeout(lookupTimer.current); };
  }, [accessCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!fullName.trim() || !email.trim() || !password || !accessCode.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    if (!detectedAcademy) {
      setError("Please enter a valid academy access code.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/staff/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          password,
          academyKey: detectedAcademy.key,
          accessCode: accessCode.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      setSuccess(true);
      setTimeout(async () => {
        try {
          await login(email.trim(), password);
          navigate("/staff-dashboard");
        } catch {
          navigate("/staff-login");
        }
      }, 1800);
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-2xl font-display font-black text-white uppercase tracking-wide mb-2">
            Account Created!
          </h2>
          <p className="text-white/50 text-sm">Signing you in now…</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4 py-8 relative">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-white/[0.01]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <button
          onClick={() => navigate("/staff-login")}
          className="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Login
        </button>

        <div className="glass-panel rounded-3xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-display font-black text-white mb-2 uppercase tracking-wide">
              Academy Admin Signup
            </h1>
            <p className="text-white/50 text-sm">
              Create your admin account using your academy's access code.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Access Code — first, so academy auto-fills */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white/60 uppercase tracking-wider ml-1 font-display">
                Academy Access Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                  placeholder="e.g. COACH-MAN-005"
                  autoComplete="off"
                  spellCheck={false}
                  className="w-full h-12 rounded-xl glass-input px-4 pr-10 text-base font-medium uppercase tracking-wider"
                />
                {codeChecking && (
                  <Loader2 size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 animate-spin" />
                )}
                {detectedAcademy && !codeChecking && (
                  <CheckCircle size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-green-400" />
                )}
              </div>

              {/* Academy auto-detection feedback */}
              <AnimatePresence mode="wait">
                {detectedAcademy && (
                  <motion.div
                    key="detected"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 ml-1 mt-1"
                  >
                    <span className="text-green-400 text-xs font-bold">✓</span>
                    <span className="text-green-400 text-xs font-semibold">{detectedAcademy.name}</span>
                  </motion.div>
                )}
                {codeError && !codeChecking && (
                  <motion.p
                    key="code-error"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-red-400 text-xs ml-1 mt-1"
                  >
                    {codeError}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white/60 uppercase tracking-wider ml-1 font-display">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                autoComplete="name"
                className="w-full h-12 rounded-xl glass-input px-4 text-base font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white/60 uppercase tracking-wider ml-1 font-display">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                autoComplete="email"
                className="w-full h-12 rounded-xl glass-input px-4 text-base font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white/60 uppercase tracking-wider ml-1 font-display">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                  className="w-full h-12 rounded-xl glass-input px-4 pr-12 text-base font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white/60 uppercase tracking-wider ml-1 font-display">
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                autoComplete="new-password"
                className="w-full h-12 rounded-xl glass-input px-4 text-base font-medium"
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  key="error"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-red-400 text-sm text-center bg-red-500/10 rounded-xl py-2 px-3 border border-red-500/20"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading || !detectedAcademy}
              className="w-full h-12 rounded-xl bg-white text-black font-display font-black text-sm uppercase tracking-widest hover:bg-white/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Creating Account…
                </>
              ) : (
                "Create Admin Account"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-white/30 text-sm mt-6">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/staff-login")}
            className="text-white/60 hover:text-white underline transition-colors"
          >
            Sign in
          </button>
        </p>
      </motion.div>
    </div>
  );
}
