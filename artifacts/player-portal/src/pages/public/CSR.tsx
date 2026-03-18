import { useState } from "react";
import { PublicLayout } from "@/layouts/PublicLayout";

export default function CSR() {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <PublicLayout>
      {/* Hero */}
      <section
        className="relative py-24 md:py-32 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)" }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 text-sm font-medium px-4 py-2 rounded-full mb-6">
              <i className="ri-building-line"></i>
              Corporate Social Responsibility
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Make a Lasting Impact Through{" "}
              <span style={{ color: "#2563eb" }}>The Gift of Story</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Partner with Me Time Stories to bring personalised books to underserved children in your community. A meaningful CSR programme that changes lives — one story at a time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#enquire"
                className="px-8 py-4 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
                style={{ backgroundColor: "#2563eb" }}
              >
                Become a Partner
              </a>
              <a
                href="#impact"
                className="px-8 py-4 border-2 text-blue-700 font-semibold text-lg rounded-xl hover:bg-blue-50 transition-colors"
                style={{ borderColor: "#2563eb" }}
              >
                See Our Impact
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section id="impact" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { num: "2,500+", label: "Stories donated to date", color: "#2563eb" },
              { num: "18+", label: "Corporate partners", color: "#10b981" },
              { num: "40+", label: "Schools & community groups", color: "#8b5cf6" },
              { num: "£0", label: "Cost to children in need", color: "#f97316" },
            ].map(({ num, label, color }) => (
              <div key={label} className="p-6 rounded-2xl bg-gray-50">
                <div className="text-3xl md:text-4xl font-bold mb-2" style={{ color }}>
                  {num}
                </div>
                <p className="text-gray-600 text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why partner with us */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Partner With Us?</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              CSR partnerships that deliver genuine, measurable impact — not just a logo on a page.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "ri-heart-3-line",
                title: "Genuine Impact",
                desc: "Every donated story goes to a named child who would otherwise have no access to personalised books. Your contribution directly shapes a child's relationship with reading.",
                color: "#ef4444",
              },
              {
                icon: "ri-eye-line",
                title: "Full Transparency",
                desc: "You receive an impact report with every partnership cycle — how many stories were delivered, to which communities, and the wellbeing outcomes reported.",
                color: "#2563eb",
              },
              {
                icon: "ri-global-line",
                title: "Diverse & Inclusive",
                desc: "Stories celebrate every child's background and culture. Your brand stands for inclusion when you partner with us — visibly and authentically.",
                color: "#10b981",
              },
              {
                icon: "ri-trophy-line",
                title: "Award-Worthy Programme",
                desc: "Our partnerships have been recognised at regional CSR awards. We'll help you tell your impact story for internal and external communications.",
                color: "#d97706",
              },
              {
                icon: "ri-team-line",
                title: "Employee Engagement",
                desc: "Involve your team in selecting story themes and communities. Our programmes generate powerful internal engagement and pride.",
                color: "#8b5cf6",
              },
              {
                icon: "ri-bar-chart-2-line",
                title: "ESG-Ready Reporting",
                desc: "Receive documentation and data in ESG-ready formats for annual reports, B Corp assessments, and regulatory disclosures.",
                color: "#0ea5e9",
              },
            ].map(({ icon, title, desc, color }) => (
              <div key={title} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:-translate-y-1 hover:shadow-md transition-all duration-200">
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

      {/* Partnership models */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Partnership Models</h2>
            <p className="text-gray-600 max-w-xl mx-auto">Choose the level of impact that fits your organisation's goals and budget.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                tier: "Starter",
                price: "from £2,500",
                color: "#0ea5e9",
                features: [
                  "50 personalised stories donated",
                  "1 community / school placement",
                  "Impact report included",
                  "Partner logo on website",
                ],
              },
              {
                tier: "Growth",
                price: "from £7,500",
                color: "#2563eb",
                popular: true,
                features: [
                  "200 personalised stories donated",
                  "3 communities / schools",
                  "Detailed impact report & case study",
                  "Co-branded press release",
                  "Employee engagement webinar",
                ],
              },
              {
                tier: "Enterprise",
                price: "Bespoke",
                color: "#1e3a8a",
                features: [
                  "Unlimited stories across programme",
                  "National community reach",
                  "ESG-ready full reporting suite",
                  "Joint award nominations",
                  "Dedicated partnership manager",
                  "Custom integration options",
                ],
              },
            ].map(({ tier, price, color, popular, features }) => (
              <div
                key={tier}
                className={`rounded-2xl p-6 border-2 ${popular ? "shadow-xl" : "border-gray-100 bg-gray-50"}`}
                style={{ borderColor: popular ? color : undefined }}
              >
                {popular && (
                  <div className="text-xs font-semibold text-white px-3 py-1 rounded-full inline-block mb-3" style={{ backgroundColor: color }}>
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{tier}</h3>
                <p className="text-lg font-semibold mb-4" style={{ color }}>{price}</p>
                <ul className="space-y-2.5">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                      <i className="ri-check-line flex-shrink-0 mt-0.5" style={{ color }}></i>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#enquire"
                  className="block mt-6 py-3 text-center font-semibold rounded-xl transition-colors text-sm"
                  style={{
                    backgroundColor: popular ? color : "transparent",
                    color: popular ? "white" : color,
                    border: popular ? "none" : `2px solid ${color}`,
                  }}
                >
                  Get Started
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ramadan campaign teaser */}
      <section className="py-16 bg-gradient-to-r from-emerald-900 to-teal-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <span className="inline-block bg-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-3">
                🌙 Featured Campaign
              </span>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Rose Goes to Mo's</h2>
              <p className="text-emerald-200 max-w-xl">
                Our Ramadan community campaign — bringing personalised Iftar stories to Muslim families and celebrating diversity in children's literature.
              </p>
            </div>
            <a
              href="/stories/rose-goes-to-mos"
              className="flex-shrink-0 px-6 py-3 bg-white text-emerald-900 font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              View Campaign
            </a>
          </div>
        </div>
      </section>

      {/* Enquiry form */}
      <section id="enquire" className="py-20 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Start Your Partnership</h2>
            <p className="text-gray-600">Tell us about your organisation and what you're hoping to achieve. We'll be in touch within 2 business days.</p>
          </div>
          {formSubmitted ? (
            <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-3xl mx-auto mb-4">
                <i className="ri-check-line"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank you!</h3>
              <p className="text-gray-600">We've received your enquiry and will be in touch within 2 business days.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input required className="col-span-2 sm:col-span-1 w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Your name" />
                <input required type="email" className="col-span-2 sm:col-span-1 w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Work email" />
              </div>
              <input required className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Organisation name" />
              <select required className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="">Partnership tier of interest</option>
                <option>Starter — from £2,500</option>
                <option>Growth — from £7,500</option>
                <option>Enterprise — Bespoke</option>
              </select>
              <textarea
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Tell us about your CSR goals and the communities you'd like to reach..."
              />
              <button
                type="submit"
                className="w-full py-4 text-white font-semibold rounded-xl transition-colors text-lg"
                style={{ backgroundColor: "#2563eb" }}
              >
                Send Enquiry
              </button>
            </form>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
