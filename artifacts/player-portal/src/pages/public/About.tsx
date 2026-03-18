import { Link } from "wouter";
import { PublicLayout } from "@/layouts/PublicLayout";
import { publicAssetUrl } from "@/lib/publicAssetUrl";

export default function About() {
  return (
    <PublicLayout>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ minHeight: "60vh", display: "flex", alignItems: "center" }}>
        <img
          src={publicAssetUrl("images/family-reading-1.png")}
          alt="Family reading together"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center 30%" }}
        />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(110deg, rgba(12,8,4,0.90) 0%, rgba(20,10,4,0.75) 50%, rgba(30,14,4,0.40) 100%)"
        }} />
        <div className="relative max-w-7xl mx-auto px-4 py-20 w-full">
          {/* Back link */}
          <Link href="/" className="inline-flex items-center gap-2 text-sm mb-8 transition-colors" style={{ color: "rgba(254,243,226,0.50)" }}>
            <i className="ri-arrow-left-line"></i> Back to home
          </Link>
          <span className="inline-block bg-amber-400/15 border border-amber-400/25 text-amber-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            Our Story
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight max-w-2xl" style={{ color: "#fef3e2" }}>
            We exist to put every child{" "}
            <span style={{ color: "#fbbf24" }}>at the heart of their story.</span>
          </h1>
          <p className="text-lg max-w-xl leading-relaxed mb-8" style={{ color: "rgba(254,243,226,0.65)" }}>
            We're on a mission to revolutionise children's literature through personalised storytelling — so every child hears "That's me on the page!" at bedtime.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#mission" className="px-6 py-3 font-semibold rounded-xl transition-all hover:scale-[1.02] text-sm" style={{ background: "linear-gradient(135deg,#f97316,#fbbf24)", color: "#1a0800" }}>
              Our Mission
            </a>
            <a href="#journey" className="px-6 py-3 border font-semibold rounded-xl text-sm transition-colors hover:bg-white/10" style={{ borderColor: "rgba(254,243,226,0.30)", color: "#fef3e2" }}>
              Our Journey
            </a>
          </div>
        </div>
      </section>

      {/* ── Mission & Values ─────────────────────────────────────────── */}
      <section id="mission" className="py-16 md:py-20" style={{ background: "#fef9f0" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission & Values</h2>
            <p className="text-gray-600 leading-relaxed">
              At Me Time Stories, we believe in the power of personalised storytelling to create meaningful connections between children and their families while fostering a lifelong love for reading.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "❤️",
                title: "Truly Personalised",
                desc: "Not just a name swap — their personality, favourite animal, and biggest dream are woven through every chapter.",
                bg: "#fff7ed",
                border: "#fed7aa",
              },
              {
                icon: "📚",
                title: "Reading for Life",
                desc: "When children see themselves as the hero, reading stops being a chore and becomes the best part of the day.",
                bg: "#f0fdf4",
                border: "#bbf7d0",
              },
              {
                icon: "👨‍👩‍👧",
                title: "Family Moments",
                desc: "Our books become shared rituals — the story they ask for again and again. Bedtime, sorted.",
                bg: "#eff6ff",
                border: "#bfdbfe",
              },
            ].map(({ icon, title, desc, bg, border }) => (
              <div key={title} className="p-8 rounded-2xl border" style={{ background: bg, borderColor: border }}>
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The magic of seeing yourself ─────────────────────────────── */}
      <section className="py-16 md:py-20 relative overflow-hidden" style={{ background: "#0d0a08" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-amber-400/15 border border-amber-400/25 text-amber-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
                ✨ Why we do it
              </span>
              <h2 className="text-3xl font-bold mb-5 leading-tight" style={{ color: "#fef3e2" }}>
                The moment a child points at the page and says — "That's me!"
              </h2>
              <p className="text-lg leading-relaxed mb-5" style={{ color: "rgba(254,243,226,0.60)" }}>
                We started because a dad noticed his daughter would skip past books where none of the characters looked like her. So he set out to change that — not just for representation, but for deep, whole-child personalisation.
              </p>
              <p className="leading-relaxed mb-8" style={{ color: "rgba(254,243,226,0.45)", fontSize: 15 }}>
                We pair professional children's book authors and illustrators with our personalisation technology. The result: a story that is truly theirs — their name, their face, their personality, their dream — every single night.
              </p>
              <Link
                href="/characters/create"
                className="inline-flex items-center gap-2 px-7 py-4 font-bold rounded-xl text-amber-900 hover:scale-[1.02] transition-all shadow-lg"
                style={{ background: "linear-gradient(135deg,#f97316,#fbbf24)" }}
              >
                Build your child's character →
              </Link>
            </div>
            <div>
              <img
                src={publicAssetUrl("images/book-likeness.png")}
                alt="Child pointing at their likeness in the personalised story book"
                className="w-full rounded-3xl shadow-2xl object-cover"
                style={{ maxHeight: 450 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Company Timeline ─────────────────────────────────────────── */}
      <section id="journey" className="py-16 md:py-20" style={{ background: "#fef9f0" }}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-gray-600">From a spark of an idea to partnering with Premier League academies.</p>
          </div>
          <div className="space-y-6">
            {[
              {
                year: "2022",
                title: "Early Development",
                desc: "Started building the technology foundation in stealth mode, designing our modular personalisation architecture.",
                items: ["Technology foundation", "Stealth mode development", "Modular architecture design"],
                current: false,
                color: "#e5e7eb",
              },
              {
                year: "2023–2024",
                title: "Core Development",
                desc: "Built our Dynamic Personalisation Framework — narrative logic meets character adaptation.",
                items: ["DPF (Dynamic Personalisation Framework)", "Parent & child dashboards", "IP security & print token system"],
                current: false,
                color: "#ddd6fe",
              },
              {
                year: "January 2025",
                title: "Official Launch",
                desc: "Registered the company and exited stealth mode with a library of personalised stories ready for families.",
                items: ["Company registration", "100+ story library", "First family reading moments"],
                current: false,
                color: "#bfdbfe",
              },
              {
                year: "Now",
                title: "Growing Together",
                desc: "42+ football academies onboarded. Platform ready. Seeking investment to scale nationally and internationally.",
                items: ["Football Academy partnerships live", "The Time-Travelling Tractor flagship story", "Printer partnership established"],
                current: true,
                color: "#fbbf24",
              },
            ].map(({ year, title, desc, items, current, color }) => (
              <div
                key={year}
                className="flex gap-5 p-6 rounded-2xl border"
                style={{
                  background: current ? "#fff7ed" : "white",
                  borderColor: current ? "#fed7aa" : "#f3f4f6",
                }}
              >
                <div className="flex-shrink-0 pt-0.5">
                  <span
                    className="inline-block px-3 py-1 text-xs font-bold rounded-full"
                    style={{ backgroundColor: color, color: current ? "#1a0800" : "#374151" }}
                  >
                    {year}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">{title}</h3>
                  <p className="text-gray-500 text-sm mb-3 leading-relaxed">{desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {items.map((item) => (
                      <span key={item} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{item}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Diversity section ─────────────────────────────────────────── */}
      <section className="py-14 md:py-20" style={{ background: "white" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src={publicAssetUrl("images/family-diversity-collage.png")}
                alt="Diverse families reading Me Time Stories together"
                className="w-full rounded-3xl shadow-xl object-cover"
                style={{ maxHeight: 400 }}
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-5 leading-tight">
                Built for every child. Every family. Every bedtime.
              </h2>
              <p className="text-gray-600 leading-relaxed mb-5">
                Whether it's bedtime under fairy lights in a fort, an afternoon read in the garden with grandad, or storytime on the sofa after school — our books belong everywhere and celebrate everyone.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  "Diverse characters, authentically illustrated",
                  "Stories for ages 3–16",
                  "Cultural sensitivity at the core of every story",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-gray-700 text-sm">
                    <span className="w-5 h-5 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 text-xs flex-shrink-0">✓</span>
                    {item}
                  </div>
                ))}
              </div>
              <Link href="/families" className="inline-flex items-center gap-2 px-7 py-3.5 font-bold rounded-xl text-white transition-all hover:scale-[1.02] shadow-md" style={{ background: "linear-gradient(135deg,#f97316,#fbbf24)", color: "#1a0800" }}>
                Stories for families →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 relative overflow-hidden" style={{ background: "#0d0a08" }}>
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle, #fbbf24 1px, transparent 1px)", backgroundSize: "30px 30px" }}
        />
        <div className="max-w-2xl mx-auto px-4 text-center relative">
          <div className="text-5xl mb-5">🌙</div>
          <h2 className="text-3xl font-bold mb-4" style={{ color: "#fef3e2" }}>Be part of our story.</h2>
          <p className="text-lg mb-8 leading-relaxed" style={{ color: "rgba(254,243,226,0.55)" }}>
            Whether you're a parent, a football academy, or a corporate partner — we'd love to work with you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/characters/create" className="flex items-center justify-center gap-2 px-8 py-4 font-bold rounded-xl hover:scale-[1.02] transition-all shadow-lg" style={{ background: "linear-gradient(135deg,#f97316,#fbbf24)", color: "#1a0800" }}>
              ✨ Build a character
            </Link>
            <Link href="/for-academies" className="flex items-center justify-center gap-2 px-8 py-4 border font-semibold rounded-xl transition-colors hover:bg-white/10" style={{ borderColor: "rgba(254,243,226,0.25)", color: "#fef3e2" }}>
              Academy partnerships
            </Link>
          </div>
        </div>
      </section>

    </PublicLayout>
  );
}
