import { useState } from "react";
import { Link } from "wouter";

interface Credential {
  label: string;
  email: string;
  password: string;
  role: string;
  icon: string;
  color: string;
}

const CREDENTIALS: Credential[] = [
  {
    label: "Internal Admin",
    email: "michael@metimestories.com",
    password: "MichaelEditor2024!",
    role: "Internal Editor",
    icon: "ri-lock-2-line",
    color: "#8b5cf6",
  },
  {
    label: "Arsenal Academy",
    email: "admin@arsenal.co.uk",
    password: "COACH-ARS-003",
    role: "Academy Admin",
    icon: "ri-football-line",
    color: "#EF0107",
  },
  {
    label: "Chelsea Academy",
    email: "admin@chelsea.co.uk",
    password: "COACH-CHE-002",
    role: "Academy Admin",
    icon: "ri-football-line",
    color: "#034694",
  },
  {
    label: "Liverpool Academy",
    email: "admin@liverpool.co.uk",
    password: "COACH-LIV-004",
    role: "Academy Admin",
    icon: "ri-football-line",
    color: "#C8102E",
  },
  {
    label: "Man City Academy",
    email: "admin@manchester-city.co.uk",
    password: "COACH-MAN-005",
    role: "Academy Admin",
    icon: "ri-football-line",
    color: "#6CABDD",
  },
  {
    label: "Man United Academy",
    email: "admin@manchester-united.co.uk",
    password: "COACH-MAN-006",
    role: "Academy Admin",
    icon: "ri-football-line",
    color: "#DA291C",
  },
  {
    label: "Tottenham Academy",
    email: "admin@tottenham.co.uk",
    password: "COACH-TOT-007",
    role: "Academy Admin",
    icon: "ri-football-line",
    color: "#132257",
  },
];

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  return (
    <button
      onClick={copy}
      className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all text-xs font-bold"
      style={{
        background: copied ? "rgba(16,185,129,0.20)" : "rgba(255,255,255,0.08)",
        border: copied ? "1px solid rgba(16,185,129,0.40)" : "1px solid rgba(255,255,255,0.12)",
        color: copied ? "#34d399" : "rgba(255,255,255,0.50)",
      }}
      title="Copy to clipboard"
    >
      {copied ? "✓" : <i className="ri-clipboard-line"></i>}
    </button>
  );
}

function CredField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: "rgba(255,255,255,0.28)" }}>
          {label}
        </p>
        <p className="text-sm font-mono text-white truncate">{value}</p>
      </div>
      <CopyButton value={value} />
    </div>
  );
}

export default function Demo() {
  const [copiedAll, setCopiedAll] = useState<string | null>(null);

  const copyCard = (cred: Credential) => {
    const text = `Email: ${cred.email}\nPassword: ${cred.password}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedAll(cred.email);
      setTimeout(() => setCopiedAll(null), 2000);
    });
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: "radial-gradient(ellipse at 50% 0%, #1a1030 0%, #0a0810 60%, #050308 100%)" }}
    >
      {/* Header */}
      <div className="border-b" style={{ borderColor: "rgba(255,255,255,0.08)", backdropFilter: "blur(16px)", background: "rgba(5,3,8,0.80)" }}>
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
              style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.30)", color: "#a78bfa" }}
            >
              <i className="ri-key-2-line"></i>
            </div>
            <div>
              <p className="text-sm font-bold text-white">Me Time Stories</p>
              <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>Demo Credentials</p>
            </div>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-medium transition-colors"
            style={{ color: "rgba(255,255,255,0.40)" }}
          >
            <i className="ri-arrow-left-line"></i> Back to site
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Demo Access</h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.38)" }}>
            Use these credentials to demo the staff portal. Staff login at{" "}
            <Link href="/staff-login" className="text-violet-400 hover:text-violet-300 underline underline-offset-2">
              /staff-login
            </Link>
            , internal admin at{" "}
            <Link href="/admin-login" className="text-violet-400 hover:text-violet-300 underline underline-offset-2">
              /admin-login
            </Link>
            .
          </p>
        </div>

        {/* Credential cards */}
        <div className="grid sm:grid-cols-2 gap-4">
          {CREDENTIALS.map((cred) => (
            <div
              key={cred.email}
              className="rounded-2xl p-5"
              style={{
                backdropFilter: "blur(20px)",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.09)",
                boxShadow: `0 0 24px ${cred.color}18, 0 8px 24px rgba(0,0,0,0.30)`,
              }}
            >
              {/* Card header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
                    style={{ background: `${cred.color}20`, border: `1px solid ${cred.color}40`, color: cred.color }}
                  >
                    <i className={cred.icon}></i>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white leading-none">{cred.label}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{cred.role}</p>
                  </div>
                </div>
                {/* Copy all button */}
                <button
                  onClick={() => copyCard(cred)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    background: copiedAll === cred.email ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.06)",
                    border: copiedAll === cred.email ? "1px solid rgba(16,185,129,0.35)" : "1px solid rgba(255,255,255,0.10)",
                    color: copiedAll === cred.email ? "#34d399" : "rgba(255,255,255,0.50)",
                  }}
                >
                  {copiedAll === cred.email ? "✓ Copied!" : "Copy all"}
                </button>
              </div>

              {/* Fields */}
              <div className="space-y-3">
                <CredField label="Email" value={cred.email} />
                <div className="border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }} />
                <CredField label="Password / Access Code" value={cred.password} />
              </div>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div
          className="mt-8 rounded-2xl p-5"
          style={{ backdropFilter: "blur(20px)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.28)" }}>
            Quick Links
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              { href: "/staff-login",                     label: "Staff Portal Login",   icon: "ri-football-line" },
              { href: "/admin-login",                     label: "Internal Admin Login",  icon: "ri-lock-2-line" },
              { href: "/characters/create",               label: "Character Creator",     icon: "ri-user-smile-line" },
              { href: "/stories/time-travelling-tractor", label: "Story Engine",          icon: "ri-play-circle-line" },
              { href: "/football-matrix",                 label: "Football Matrix",       icon: "ri-bar-chart-2-line" },
              { href: "/for-academies",                   label: "Academy Page",          icon: "ri-building-4-line" },
            ].map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-[1.02]"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  color: "rgba(255,255,255,0.60)",
                }}
              >
                <i className={icon}></i> {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
