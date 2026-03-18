import { useState } from "react";
import { Link } from "wouter";
import { PublicLayout } from "@/layouts/PublicLayout";

export default function RoseStory() {
  const [formOpen, setFormOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <PublicLayout>
      {/* Hero */}
      <section
        className="relative py-24 md:py-36 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1a2744 0%, #0f4c2a 50%, #1a2744 100%)",
        }}
      >
        {/* Decorative crescent & stars */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-8 right-8 md:right-24 text-yellow-300 text-8xl opacity-60">☪</div>
          <div className="absolute top-16 left-12 text-yellow-200 text-2xl opacity-40">✦</div>
          <div className="absolute bottom-20 left-8 text-yellow-300 text-4xl opacity-30">✦</div>
          <div className="absolute top-32 right-32 text-amber-200 text-xl opacity-50">⭐</div>
          <div className="absolute bottom-12 right-16 text-yellow-300 text-3xl opacity-40">✦</div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 bg-yellow-400/20 text-yellow-300 text-sm font-medium px-4 py-2 rounded-full mb-6 border border-yellow-400/30">
              🌙 Ramadan 2025 Campaign
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Rose Goes to{" "}
              <span
                className="inline-block"
                style={{ fontFamily: "Pacifico, cursive", color: "#fbbf24" }}
              >
                Mo's
              </span>
            </h1>
            <p className="text-xl text-green-100 mb-8 leading-relaxed max-w-2xl">
              A personalised Iftar story where your child joins their friend Rose on an unforgettable evening — sharing food, family, and the warmth of Ramadan.
            </p>
            <p className="text-lg text-yellow-200/80 mb-10 italic">
              "The lanterns glowed like tiny suns, and Rose could smell something wonderful drifting from Mo's kitchen..."
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setFormOpen(true)}
                className="px-8 py-4 text-gray-900 font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
                style={{ backgroundColor: "#fbbf24" }}
              >
                Get Your Child's Story
              </button>
              <Link
                href="/characters/create"
                className="px-8 py-4 border-2 border-white/40 text-white font-semibold text-lg rounded-xl hover:bg-white/10 transition-colors"
              >
                Build Your Character
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What is the story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-amber-50 text-amber-700 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
                About This Story
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                A Story About Belonging, Sharing & Friendship
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                <strong>Rose Goes to Mo's</strong> is a personalised Ramadan story where your child visits their friend Mo's home for Iftar. The table is set with dates and warm bread, lanterns twinkle in the courtyard, and Mo's whole family is ready to welcome them.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Your child's name, appearance, and personality are woven throughout — making them the heart of a story about kindness, curiosity, and the joy of sharing something sacred with a friend.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: "ri-user-line", label: "Ages 4–10" },
                  { icon: "ri-file-text-line", label: "24 personalised pages" },
                  { icon: "ri-palette-line", label: "Beautiful illustrations" },
                  { icon: "ri-printer-line", label: "Print or digital" },
                  { icon: "ri-translate-line", label: "English & Arabic available" },
                  { icon: "ri-heart-line", label: "Gifting options" },
                ].map(({ icon, label }) => (
                  <div key={label} className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl">
                    <i className={`${icon} text-amber-600 text-sm`}></i>
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Story preview card */}
            <div
              className="rounded-3xl p-8 text-white relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, #1a2744 0%, #0f4c2a 100%)" }}
            >
              <div className="absolute top-4 right-4 text-yellow-300 text-4xl opacity-50">☪</div>
              <div className="absolute bottom-4 left-4 text-yellow-200 text-2xl opacity-30">✦</div>

              <div className="mb-6">
                <p className="text-yellow-300 text-xs font-semibold uppercase tracking-wider mb-2">Story Preview</p>
                <h3 className="text-2xl font-bold text-white mb-1">Rose Goes to Mo's</h3>
                <p className="text-green-200 text-sm">Personalised Ramadan Story · 2025</p>
              </div>

              <div className="bg-white/10 rounded-2xl p-4 mb-6 border border-white/20">
                <p className="text-green-100 text-sm leading-relaxed italic">
                  "As <strong className="text-yellow-300">[Your Child]</strong> walked through Mo's gate, the sound of laughter and the scent of rosewater filled the evening air. 'You came!' Mo called out, waving from the courtyard where lanterns cast a warm golden glow on everyone's faces..."
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {["Friendship", "Ramadan", "Inclusion", "Family", "Food & Culture"].map((tag) => (
                  <span key={tag} className="text-xs bg-white/20 text-green-100 px-3 py-1 rounded-full border border-white/20">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why this story matters */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why This Story Matters</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Children develop empathy and inclusion through stories. Seeing friends of different faiths and cultures as heroes builds a more compassionate generation.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "ri-heart-3-line",
                color: "#f97316",
                title: "For Muslim Families",
                desc: "Give your child a story where their culture and traditions are celebrated with joy and pride — not explained or othered.",
              },
              {
                icon: "ri-group-line",
                color: "#2563eb",
                title: "For All Families",
                desc: "A beautiful way for non-Muslim children to learn about Ramadan through the warmth of friendship and shared experience.",
              },
              {
                icon: "ri-building-line",
                color: "#10b981",
                title: "For Corporate Partners",
                desc: "Sponsor a bulk donation of Rose Goes to Mo's stories to schools and community groups in your area as part of your CSR programme.",
              },
            ].map(({ icon, color, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
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

      {/* CTA */}
      <section
        className="py-20 text-white text-center"
        style={{ background: "linear-gradient(135deg, #1a2744 0%, #0f4c2a 100%)" }}
      >
        <div className="max-w-xl mx-auto px-4">
          <div className="text-5xl mb-4">🌙</div>
          <h2 className="text-3xl font-bold mb-4">Give the Gift of Their Story This Ramadan</h2>
          <p className="text-green-200 mb-8">
            Personalised, printed, and ready to become a treasured keepsake. Limited Ramadan edition.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setFormOpen(true)}
              className="px-8 py-4 text-gray-900 font-semibold text-lg rounded-xl shadow-lg"
              style={{ backgroundColor: "#fbbf24" }}
            >
              Order Your Story
            </button>
            <Link
              href="/csr"
              className="px-8 py-4 border-2 border-white/40 text-white font-semibold text-lg rounded-xl hover:bg-white/10 transition-colors"
            >
              Corporate Gifting
            </Link>
          </div>
        </div>
      </section>

      {/* Order form modal */}
      {formOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => { setFormOpen(false); setSubmitted(false); }}
              className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200"
            >
              <i className="ri-close-line"></i>
            </button>
            {submitted ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">🌙</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Order Received!</h3>
                <p className="text-gray-600">We'll be in touch within 1 business day to personalise your story and arrange delivery.</p>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Order Your Story</h3>
                <p className="text-gray-500 text-sm mb-6">Tell us about your child and we'll personalise every page just for them.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input required className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="Child's name" />
                  <input required type="number" min="4" max="10" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="Child's age (4–10)" />
                  <select required className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white">
                    <option value="">Pronouns</option>
                    <option>She/Her</option>
                    <option>He/Him</option>
                    <option>They/Them</option>
                  </select>
                  <input required type="email" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="Your email address" />
                  <select required className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white">
                    <option value="">Format preference</option>
                    <option>Digital PDF — free</option>
                    <option>Printed softcover — £12.99</option>
                    <option>Printed hardcover — £18.99</option>
                  </select>
                  <textarea rows={2} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none" placeholder="Any personalisation notes (favourite colour, best friend's name, etc.)..." />
                  <button type="submit" className="w-full py-3 text-gray-900 font-semibold rounded-xl" style={{ backgroundColor: "#fbbf24" }}>
                    Place Order
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
