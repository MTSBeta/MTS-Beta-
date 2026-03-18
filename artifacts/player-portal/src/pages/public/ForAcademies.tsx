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
      {/* Hero */}
      <section
        className="relative overflow-hidden py-20 md:py-32"
        style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #0ea5e9 100%)" }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "60px 60px" }}
        />
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 bg-white/20 text-white text-sm font-medium px-4 py-2 rounded-full mb-6">
              <i className="ri-school-line"></i>
              Football Academy Programme
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Mental Training for{" "}
              <span className="text-yellow-300">Elite Young Athletes</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed max-w-2xl">
              Personalised stories that build mental resilience, identity, and emotional intelligence in academy players aged 5–16. Used across Premier League and Championship academies.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setEnquiryOpen(true)}
                className="px-8 py-4 bg-white text-blue-900 font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Request Academy Demo
              </button>
              <Link
                href="/football-matrix"
                className="px-8 py-4 border-2 border-white/60 text-white font-semibold text-lg rounded-xl hover:bg-white/10 transition-colors"
              >
                View Football Matrix
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { num: "42+", label: "Partner Academies" },
              { num: "0.5%", label: "Mental Performance Wall*" },
              { num: "5–16", label: "Player Age Range" },
              { num: "100+", label: "Football Story Themes" },
            ].map(({ num, label }) => (
              <div key={label}>
                <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-1">{num}</div>
                <p className="text-blue-200 text-sm">{label}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-blue-300 text-xs mt-4">*Only 0.5% of academy players make it to professional football. Mental resilience starts here.</p>
        </div>
      </section>

      {/* The Mental Performance Wall */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-blue-50 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
                The Challenge
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                The Mental Performance Wall
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Only 0.5% of academy players reach professional football. The difference between those who make it and those who don't is increasingly mental — identity, resilience, emotional regulation, and belonging.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Me Time Stories delivers this mental training in a format that young players actually want to engage with: their own story, where they are the hero navigating real footballing challenges.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: "ri-mental-health-line", label: "Emotional Resilience" },
                  { icon: "ri-user-heart-line", label: "Identity & Belonging" },
                  { icon: "ri-team-line", label: "Team & Culture Fit" },
                  { icon: "ri-focus-3-line", label: "Focus & Concentration" },
                ].map(({ icon, label }) => (
                  <div key={label} className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl">
                    <i className={`${icon} text-blue-600`}></i>
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-3xl p-8 text-white">
                <div className="text-6xl font-black text-yellow-300 mb-2">0.5%</div>
                <p className="text-blue-200 text-sm mb-6">of academy players reach professional football</p>
                <div className="space-y-3">
                  {[
                    { label: "Technical Skills", pct: 85 },
                    { label: "Physical Ability", pct: 78 },
                    { label: "Mental Performance", pct: 23 },
                  ].map(({ label, pct }) => (
                    <div key={label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-blue-200">{label}</span>
                        <span className="text-white font-medium">{pct}%</span>
                      </div>
                      <div className="h-2 bg-white/20 rounded-full">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: label === "Mental Performance" ? "#fbbf24" : "#3b82f6",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-yellow-300 text-sm mt-4 font-medium">
                  We're here to close the mental performance gap.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section id="solution" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How Me Time Stories Works for Academies
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              A complete personalised story programme that fits within your existing pastoral care and wellbeing frameworks.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                icon: "ri-file-user-line",
                title: "Player Profile & Onboarding",
                desc: "Players complete a short profile — their position, personality traits, favourite parts of football, and personal goals. Parents add family context.",
                color: "#1e3a8a",
              },
              {
                step: "02",
                icon: "ri-book-2-line",
                title: "Personalised Story Delivery",
                desc: "We craft individual stories where each player is the hero navigating real footballing situations — selection, setbacks, teamwork, performance anxiety.",
                color: "#2563eb",
              },
              {
                step: "03",
                icon: "ri-bar-chart-line",
                title: "Wellbeing Tracking",
                desc: "Academy staff see engagement reports and wellbeing indicators. Stories reinforce your coaching values and club culture from within the home.",
                color: "#0ea5e9",
              },
            ].map(({ step, icon, title, desc, color }) => (
              <div key={step} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="text-3xl font-black mb-3" style={{ color: `${color}40` }}>{step}</div>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl mb-4"
                  style={{ backgroundColor: color }}
                >
                  <i className={icon}></i>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Academy Ecosystem */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">The Academy Ecosystem Approach</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Me Time Stories integrates with all key stakeholders in a player's development journey.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: "ri-football-line", label: "The Player", color: "#1e3a8a" },
              { icon: "ri-parent-line", label: "Family & Parents", color: "#2563eb" },
              { icon: "ri-group-line", label: "Academy Coaches", color: "#0ea5e9" },
              { icon: "ri-hospital-line", label: "Welfare Officers", color: "#10b981" },
              { icon: "ri-psychology-line", label: "Sports Psychologists", color: "#8b5cf6" },
              { icon: "ri-building-line", label: "Club Management", color: "#f97316" },
            ].map(({ icon, label, color }) => (
              <div key={label} className="text-center p-4 rounded-2xl border border-gray-100 bg-gray-50">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl mx-auto mb-3"
                  style={{ backgroundColor: color }}
                >
                  <i className={icon}></i>
                </div>
                <p className="text-xs font-medium text-gray-700">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Academies Get</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "ri-book-open-line", title: "Personalised player stories", desc: "Each player receives their own story — a genuine differentiation in your pastoral programme." },
              { icon: "ri-dashboard-line", title: "Staff dashboard", desc: "Monitor engagement, wellbeing indicators, and story delivery across your entire squad." },
              { icon: "ri-parent-line", title: "Parent engagement portal", desc: "Parents read alongside their children, deepening the family-club relationship." },
              { icon: "ri-trophy-line", title: "Position-specific content", desc: "Stories aligned to each player's position, role, and developmental challenges." },
              { icon: "ri-calendar-line", title: "Season-aligned delivery", desc: "Stories timed around key moments — selection, cup runs, winter breaks, tournaments." },
              { icon: "ri-shield-star-line", title: "Safeguarding compliant", desc: "All content reviewed by child safeguarding professionals and welfare-approved." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="w-10 h-10 bg-yellow-400/20 rounded-xl flex items-center justify-center text-yellow-300 text-lg mb-4">
                  <i className={icon}></i>
                </div>
                <h3 className="font-bold text-white mb-2">{title}</h3>
                <p className="text-blue-200 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Talk?</h2>
          <p className="text-gray-600 mb-8">
            Book a 20-minute call with our academy partnerships team and see a live demo with your club's branding.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setEnquiryOpen(true)}
              className="px-8 py-4 text-white font-semibold text-lg rounded-xl shadow-lg"
              style={{ backgroundColor: "#1e3a8a" }}
            >
              Request a Demo
            </button>
            <Link
              href="/football-matrix"
              className="px-8 py-4 border-2 text-blue-900 font-semibold text-lg rounded-xl hover:bg-blue-50 transition-colors"
              style={{ borderColor: "#1e3a8a" }}
            >
              Explore Football Matrix
            </Link>
          </div>
        </div>
      </section>

      {/* Enquiry modal */}
      {enquiryOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setEnquiryOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200"
            >
              <i className="ri-close-line"></i>
            </button>
            {formSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-3xl mx-auto mb-4">
                  <i className="ri-check-line"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Enquiry Sent!</h3>
                <p className="text-gray-600">We'll be in touch within 2 business days.</p>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Academy Enquiry</h3>
                <p className="text-gray-500 text-sm mb-6">Tell us about your academy and we'll get back to you within 2 business days.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input required className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Your name" />
                  <input required type="email" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Work email address" />
                  <input required className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Academy / Club name" />
                  <select required className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option value="">Select your league</option>
                    <option>Premier League</option>
                    <option>EFL Championship</option>
                    <option>League One</option>
                    <option>League Two</option>
                    <option>National League</option>
                    <option>Other / Non-League</option>
                  </select>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Tell us about your academy's needs..."
                  />
                  <button
                    type="submit"
                    className="w-full py-3 text-white font-semibold rounded-xl transition-colors"
                    style={{ backgroundColor: "#1e3a8a" }}
                  >
                    Send Enquiry
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
