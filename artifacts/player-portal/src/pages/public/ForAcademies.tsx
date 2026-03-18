import { useState } from "react";
import { Link } from "wouter";
import { PublicLayout } from "@/layouts/PublicLayout";

export default function ForAcademies() {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => { setEnquiryOpen(false); setFormSubmitted(false); }, 2500);
  };

  return (
    <PublicLayout>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
          background: "radial-gradient(ellipse at 60% 0%, #0d1f3a 0%, #0a1018 50%, #060810 100%)",
        }}
      >
        {/* Floodlight atmosphere */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-1/4 left-1/3 w-[600px] h-[80vh] opacity-[0.06]"
            style={{ background: "linear-gradient(180deg, #fbbf24 0%, transparent 100%)", transform: "rotate(-10deg)", filter: "blur(60px)" }} />
          <div className="absolute -top-1/4 right-1/4 w-[400px] h-[60vh] opacity-[0.04]"
            style={{ background: "linear-gradient(180deg, #60a5fa 0%, transparent 100%)", transform: "rotate(12deg)", filter: "blur(60px)" }} />
        </div>

        {/* Faint dot grid */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28 w-full grid md:grid-cols-2 gap-12 items-center">
          <div>
            {/* Back link */}
            <Link href="/" className="inline-flex items-center gap-1.5 text-sm mb-6 transition-colors" style={{ color: "rgba(255,255,255,0.38)" }}>
              <i className="ri-arrow-left-line"></i> Back to home
            </Link>

            <span
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6"
              style={{ background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.25)", color: "#fbbf24" }}
            >
              🏟️ Football Academy Programme
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.05] mb-6" style={{ color: "#fef3e2" }}>
              Mental training for{" "}
              <span style={{
                background: "linear-gradient(135deg, #fbbf24, #f97316)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                elite young athletes
              </span>
            </h1>

            <p className="text-lg leading-relaxed mb-8 max-w-xl" style={{ color: "rgba(254,243,226,0.65)" }}>
              Personalised stories that build mental resilience, identity, and emotional intelligence in academy players aged 5–16. Used across Premier League and Championship academies.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setEnquiryOpen(true)}
                className="flex items-center gap-2 px-7 py-4 font-bold text-base rounded-xl shadow-xl transition-all hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#1a0800" }}
              >
                Request Academy Demo →
              </button>
              <Link
                href="/football-matrix"
                className="flex items-center gap-2 px-7 py-4 font-semibold text-base rounded-xl transition-all hover:bg-white/10"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "#fef3e2" }}
              >
                ⚽ View Football Matrix
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-5 mt-8 text-sm" style={{ color: "rgba(254,243,226,0.40)" }}>
              <span className="flex items-center gap-1.5"><span className="text-amber-400">✓</span> 42+ partner academies</span>
              <span className="flex items-center gap-1.5"><span className="text-amber-400">✓</span> Ages 5–16</span>
              <span className="flex items-center gap-1.5"><span className="text-amber-400">✓</span> Safeguarding compliant</span>
            </div>
          </div>

          {/* Stats panel */}
          <div className="hidden md:block">
            <div
              className="rounded-3xl p-8"
              style={{ backdropFilter: "blur(24px)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", boxShadow: "0 8px 40px rgba(0,0,0,0.40)" }}
            >
              <div className="text-[10px] font-bold uppercase tracking-widest mb-6" style={{ color: "rgba(255,255,255,0.28)" }}>
                The Mental Performance Gap
              </div>
              <div className="text-7xl font-black mb-2" style={{ color: "#fbbf24", textShadow: "0 0 30px rgba(251,191,36,0.35)" }}>
                0.5%
              </div>
              <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.40)" }}>of academy players reach professional football</p>
              <div className="space-y-4">
                {[
                  { label: "Technical Skills",    pct: 85, color: "#60a5fa" },
                  { label: "Physical Ability",    pct: 78, color: "#60a5fa" },
                  { label: "Mental Performance",  pct: 23, color: "#fbbf24" },
                ].map(({ label, pct, color }) => (
                  <div key={label}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span style={{ color: label === "Mental Performance" ? "#fbbf24" : "rgba(255,255,255,0.55)" }}>{label}</span>
                      <span className="font-bold" style={{ color }}>{pct}%</span>
                    </div>
                    <div className="h-2 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                      <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}99)`, boxShadow: label === "Mental Performance" ? `0 0 8px ${color}` : "none" }} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-6 font-semibold" style={{ color: "#fbbf24" }}>
                We're here to close the mental performance gap.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ──────────────────────────────────────────────── */}
      <section style={{ background: "#0a0c12", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: "42+",  label: "Partner Academies",       glow: "#fbbf24" },
              { num: "0.5%", label: "Reach Professional Level", glow: "#f87171" },
              { num: "5–16", label: "Player Age Range",         glow: "#60a5fa" },
              { num: "100+", label: "Football Story Themes",    glow: "#a78bfa" },
            ].map(({ num, label, glow }) => (
              <div key={label}>
                <div className="text-3xl md:text-4xl font-black mb-1" style={{ color: glow, textShadow: `0 0 20px ${glow}60` }}>{num}</div>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.38)" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE MENTAL PERFORMANCE WALL ──────────────────────────────── */}
      <section className="py-20" style={{ background: "#fef9f0" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5"
                style={{ background: "rgba(249,115,22,0.10)", color: "#f97316", border: "1px solid rgba(249,115,22,0.20)" }}>
                The Challenge
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-5 leading-tight">
                The Mental Performance Wall
              </h2>
              <p className="text-gray-600 text-base leading-relaxed mb-4">
                Only 0.5% of academy players reach professional football. The difference between those who make it and those who don't is increasingly mental — identity, resilience, emotional regulation, and belonging.
              </p>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Me Time Stories delivers this mental training in a format that young players actually want to engage with: their own story, where they are the hero navigating real footballing challenges.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { emoji: "🧠", label: "Emotional Resilience" },
                  { emoji: "🙋", label: "Identity & Belonging" },
                  { emoji: "🤝", label: "Team & Culture Fit" },
                  { emoji: "🎯", label: "Focus & Concentration" },
                ].map(({ emoji, label }) => (
                  <div key={label} className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.12)" }}>
                    <span className="text-lg">{emoji}</span>
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              {/* Mobile stats panel */}
              <div
                className="rounded-3xl p-8"
                style={{ background: "linear-gradient(135deg, #0d1825, #111827)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}
              >
                <div className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.28)" }}>
                  Academy data snapshot
                </div>
                <div className="text-6xl font-black mb-2" style={{ color: "#fbbf24" }}>0.5%</div>
                <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.40)" }}>reach professional football</p>
                <div className="space-y-4">
                  {[
                    { label: "Technical Skills",   pct: 85, color: "#60a5fa" },
                    { label: "Physical Ability",   pct: 78, color: "#60a5fa" },
                    { label: "Mental Performance", pct: 23, color: "#fbbf24" },
                  ].map(({ label, pct, color }) => (
                    <div key={label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span style={{ color: label === "Mental Performance" ? "#fbbf24" : "rgba(255,255,255,0.55)" }}>{label}</span>
                        <span className="font-bold" style={{ color }}>{pct}%</span>
                      </div>
                      <div className="h-2 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                        <div className="h-2 rounded-full" style={{ width: `${pct}%`, background: color, boxShadow: label === "Mental Performance" ? `0 0 8px ${color}` : "none" }} />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs mt-5 font-semibold" style={{ color: "#fbbf24" }}>We're here to close the mental performance gap.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: "#0d0a08" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5"
              style={{ background: "rgba(251,191,36,0.10)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.20)" }}>
              The Process
            </span>
            <h2 className="text-3xl md:text-4xl font-black mb-4" style={{ color: "#fef3e2" }}>
              How the Academy Programme Works
            </h2>
            <p className="text-base max-w-2xl mx-auto" style={{ color: "rgba(254,243,226,0.45)" }}>
              From signing your academy to a personalised story in every player's home.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {[
              { step: "01", icon: "🤝", title: "Academy Onboarding",           desc: "We set up your dedicated staff portal, branded to your club. Your coaching and welfare team get secure logins and access to the player dashboard.", color: "#fbbf24" },
              { step: "02", icon: "📱", title: "Players Complete Their Journey", desc: "Each player receives a unique access code and completes an immersive digital questionnaire — sharing their story, personality, position, and dreams.", color: "#60a5fa" },
              { step: "03", icon: "✍️", title: "We Write & Illustrate",         desc: "Our editorial team crafts a bespoke story where the player is the hero facing real footballing challenges. Reviewed by your welfare team before delivery.", color: "#a78bfa" },
              { step: "04", icon: "📚", title: "Delivered to the Family",       desc: "The finished story arrives as a premium printed book and digitally via the parent portal. Families read it together. The club's values live in the home.", color: "#34d399" },
            ].map(({ step, icon, title, desc, color }) => (
              <div
                key={step}
                className="rounded-2xl p-6 relative overflow-hidden"
                style={{ backdropFilter: "blur(16px)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}
              >
                <div className="text-4xl font-black mb-4 opacity-10" style={{ color }}>{step}</div>
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="font-bold mb-2 text-sm" style={{ color: "#fef3e2" }}>{title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(254,243,226,0.45)" }}>{desc}</p>
                <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl" style={{ background: color }} />
              </div>
            ))}
          </div>

          {/* Portal callout */}
          <div className="mt-8 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6"
            style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.18)" }}>
            <div className="text-4xl flex-shrink-0">🖥️</div>
            <div className="flex-1">
              <h3 className="font-bold text-base mb-1" style={{ color: "#fef3e2" }}>The Staff Portal is where it all begins</h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(254,243,226,0.50)" }}>
                Once your academy is signed, you receive a secure, branded staff portal. Coaches can register players, monitor journey progress, and review stories before delivery — all in one place.
              </p>
            </div>
            <button
              onClick={() => setEnquiryOpen(true)}
              className="flex-shrink-0 px-6 py-3 font-bold rounded-xl text-sm transition-all hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#1a0800" }}
            >
              Request Access →
            </button>
          </div>
        </div>
      </section>

      {/* ── ECOSYSTEM ────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: "#fef9f0" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-3">The Academy Ecosystem Approach</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
              Me Time Stories integrates with all key stakeholders in a player's development journey.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: "⚽", label: "The Player",           color: "#f97316" },
              { icon: "👨‍👩‍👧", label: "Family & Parents",    color: "#fbbf24" },
              { icon: "🎯", label: "Academy Coaches",      color: "#60a5fa" },
              { icon: "🛡️", label: "Welfare Officers",     color: "#34d399" },
              { icon: "🧠", label: "Sports Psychologists", color: "#a78bfa" },
              { icon: "🏟️", label: "Club Management",      color: "#f87171" },
            ].map(({ icon, label, color }) => (
              <div key={label} className="text-center p-5 rounded-2xl transition-all hover:-translate-y-0.5"
                style={{ background: "white", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mx-auto mb-3"
                  style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                  {icon}
                </div>
                <p className="text-xs font-semibold text-gray-700">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT ACADEMIES GET ───────────────────────────────────────── */}
      <section className="py-20" style={{ background: "#0d0a08" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5"
              style={{ background: "rgba(251,191,36,0.10)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.20)" }}>
              What You Get
            </span>
            <h2 className="text-3xl font-black mb-2" style={{ color: "#fef3e2" }}>Everything your academy needs</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: "📚", title: "Personalised player stories",   desc: "Each player receives their own story — a genuine differentiation in your pastoral programme.", color: "#fbbf24" },
              { icon: "📊", title: "Staff dashboard",               desc: "Monitor engagement, wellbeing indicators, and story delivery across your entire squad.", color: "#60a5fa" },
              { icon: "👨‍👩‍👧", title: "Parent engagement portal",     desc: "Parents read alongside their children, deepening the family-club relationship.", color: "#34d399" },
              { icon: "⚽", title: "Position-specific content",     desc: "Stories aligned to each player's position, role, and developmental challenges.", color: "#f97316" },
              { icon: "📅", title: "Season-aligned delivery",       desc: "Stories timed around key moments — selection, cup runs, winter breaks, tournaments.", color: "#a78bfa" },
              { icon: "🛡️", title: "Safeguarding compliant",        desc: "All content reviewed by child safeguarding professionals and welfare-approved.", color: "#34d399" },
            ].map(({ icon, title, desc, color }) => (
              <div
                key={title}
                className="rounded-2xl p-6 transition-all hover:-translate-y-0.5"
                style={{ backdropFilter: "blur(16px)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", boxShadow: `0 0 20px ${color}10` }}
              >
                <div className="text-3xl mb-4">{icon}</div>
                <h3 className="font-bold mb-2 text-sm" style={{ color: "#fef3e2" }}>{title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(254,243,226,0.45)" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────── */}
      <section className="py-24 text-center" style={{ background: "linear-gradient(180deg, #fef9f0 0%, #fef3e2 100%)" }}>
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-5xl mb-5">🏟️</div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Ready to Talk?</h2>
          <p className="text-gray-500 text-base mb-8 leading-relaxed">
            Book a 20-minute call with our academy partnerships team and see a live demo with your club's branding.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setEnquiryOpen(true)}
              className="flex items-center justify-center gap-2 px-8 py-4 font-bold text-base rounded-xl shadow-xl transition-all hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#1a0800" }}
            >
              Request a Demo →
            </button>
            <Link
              href="/football-matrix"
              className="flex items-center justify-center gap-2 px-8 py-4 font-semibold text-base rounded-xl transition-all hover:bg-amber-50"
              style={{ background: "white", border: "2px solid #f97316", color: "#f97316" }}
            >
              ⚽ Explore Football Matrix
            </Link>
          </div>
        </div>
      </section>

      {/* ── Enquiry modal ───────────────────────────────────────────── */}
      {enquiryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backdropFilter: "blur(12px)", background: "rgba(0,0,0,0.65)" }}>
          <div
            className="w-full max-w-md rounded-3xl p-8 shadow-2xl relative"
            style={{ backdropFilter: "blur(24px)", background: "rgba(15,20,35,0.95)", border: "1px solid rgba(255,255,255,0.12)" }}
          >
            <button
              onClick={() => { setEnquiryOpen(false); setFormSubmitted(false); }}
              className="absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            >
              <i className="ri-close-line"></i>
            </button>
            {formSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
                  style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.30)" }}>✓</div>
                <h3 className="text-xl font-bold text-white mb-2">Enquiry Sent!</h3>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.40)" }}>We'll be in touch within 2 business days.</p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-white mb-1">Academy Enquiry</h3>
                <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.40)" }}>Tell us about your academy and we'll be in touch within 2 business days.</p>
                <form onSubmit={handleSubmit} className="space-y-3">
                  {[
                    { placeholder: "Your name",           type: "text" },
                    { placeholder: "Work email address",  type: "email" },
                    { placeholder: "Academy / Club name", type: "text" },
                  ].map(({ placeholder, type }) => (
                    <input key={placeholder} required type={type} placeholder={placeholder}
                      className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:ring-1 focus:ring-amber-400/50"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }} />
                  ))}
                  <select required
                    className="w-full px-4 py-3 rounded-xl text-sm text-white/60 focus:outline-none focus:ring-1 focus:ring-amber-400/50"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}>
                    <option value="">Select your league</option>
                    <option>Premier League</option>
                    <option>EFL Championship</option>
                    <option>League One</option>
                    <option>League Two</option>
                    <option>National League</option>
                    <option>Other / Non-League</option>
                  </select>
                  <textarea rows={3} placeholder="Tell us about your academy's needs..."
                    className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:ring-1 focus:ring-amber-400/50 resize-none"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }} />
                  <button type="submit"
                    className="w-full py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]"
                    style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#1a0800" }}>
                    Send Enquiry →
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </PublicLayout>
  );
}
