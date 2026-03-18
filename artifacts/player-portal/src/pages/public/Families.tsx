import { Link } from "wouter";
import { PublicLayout } from "@/layouts/PublicLayout";
import { publicAssetUrl } from "@/lib/publicAssetUrl";

export default function Families() {
  return (
    <PublicLayout>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ minHeight: "72vh", display: "flex", alignItems: "center" }}>
        <img
          src={publicAssetUrl("images/mom-daughter-sofa.png")}
          alt="Mother and daughter discovering their personalised story book together"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center 25%" }}
        />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(110deg, rgba(12,8,4,0.92) 0%, rgba(20,10,4,0.80) 50%, rgba(30,14,4,0.35) 100%)"
        }} />
        <div className="relative max-w-7xl mx-auto px-4 py-20 w-full">
          <Link href="/" className="inline-flex items-center gap-2 text-sm mb-8 transition-colors" style={{ color: "rgba(254,243,226,0.50)" }}>
            <i className="ri-arrow-left-line"></i> Back to home
          </Link>
          <span className="inline-block bg-amber-400/15 border border-amber-400/25 text-amber-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            🏡 For Families
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold mb-5 leading-tight max-w-2xl" style={{ color: "#fef3e2" }}>
            Bedtime stories that are{" "}
            <span style={{ color: "#fbbf24" }}>all about them.</span>
          </h1>
          <p className="text-lg max-w-xl leading-relaxed mb-10" style={{ color: "rgba(254,243,226,0.65)" }}>
            Imagine opening a book and seeing your child's name on every page — not just stamped in, but woven into an adventure that reflects exactly who they are.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/characters/create"
              className="flex items-center justify-center gap-2 px-8 py-4 font-bold text-lg rounded-xl shadow-xl transition-all hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#1a0800" }}
            >
              ✨ Create Their Character
            </Link>
            <Link
              href="/stories/time-travelling-tractor"
              className="flex items-center justify-center gap-2 px-8 py-4 border font-semibold text-lg rounded-xl transition-all hover:bg-white/10"
              style={{ borderColor: "rgba(254,243,226,0.30)", color: "#fef3e2", background: "rgba(255,255,255,0.08)" }}
            >
              🚜 Try the Free Story
            </Link>
          </div>
        </div>
      </section>

      {/* ── The magic moment ─────────────────────────────────────────── */}
      <section className="py-16 md:py-24" style={{ background: "#fef9f0" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-amber-100 text-amber-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
                ✨ Not just their name
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">
                Every chapter feels like it was written{" "}
                <span style={{ color: "#f97316" }}>just for them.</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                We go far beyond adding a name on the cover. Our stories weave in your child's personality traits, their favourite animal, and their biggest dream — right through the narrative.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  { icon: "🎭", label: "Their personality traits", desc: "Drive the hero's decisions at every turn" },
                  { icon: "🐾", label: "Their favourite animal", desc: "Appears as a character in their adventure" },
                  { icon: "🌟", label: "Their biggest dream",   desc: "Shapes the story's resolution and meaning" },
                  { icon: "🖼️", label: "Their likeness",       desc: "Illustrated so they recognise themselves" },
                ].map(({ icon, label, desc }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-11 h-11 bg-amber-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">{icon}</div>
                    <div>
                      <div className="font-bold text-gray-900 text-sm">{label}</div>
                      <div className="text-gray-500 text-sm">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/characters/create"
                className="inline-flex items-center gap-2 px-7 py-4 font-bold rounded-xl text-amber-900 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)" }}
              >
                Build their character →
              </Link>
            </div>
            <div className="relative">
              <img
                src={publicAssetUrl("images/book-likeness.png")}
                alt="Child pointing at their likeness in the story book saying Look Mum it's me"
                className="w-full rounded-3xl object-cover shadow-2xl"
                style={{ maxHeight: 500 }}
              />
              <div className="absolute -bottom-4 -right-4 bg-white border border-amber-100 rounded-2xl shadow-xl px-5 py-4 max-w-[200px]">
                <p className="text-gray-800 font-bold text-sm italic">"Look, Mum, it really IS me!"</p>
                <p className="text-gray-400 text-xs mt-1">— Lily, age 6</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 relative overflow-hidden" style={{ background: "#0d0a08" }}>
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle, #fbbf24 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        />
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3" style={{ color: "#fef3e2" }}>How it works</h2>
            <p style={{ color: "rgba(254,243,226,0.45)" }}>Start tonight. Read tonight.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-5">
            {[
              { step: "01", icon: "🧒", label: "Tell us about your child", desc: "Name, personality, favourite animal, and their biggest dream. Takes 2 minutes.", color: "#f97316" },
              { step: "02", icon: "✨", label: "We personalise instantly", desc: "Our story engine weaves all those details through every single chapter.", color: "#f59e0b" },
              { step: "03", icon: "📖", label: "Read together tonight", desc: "Digital story ready immediately. Beautifully printed books delivered in days.", color: "#10b981" },
              { step: "04", icon: "💛", label: "Watch the magic happen", desc: "They'll ask for it every night. That moment of 'That's me!' — priceless.", color: "#8b5cf6" },
            ].map(({ step, icon, label, desc, color }) => (
              <div key={step} className="rounded-2xl border p-6" style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(251,191,36,0.12)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xs mb-4" style={{ backgroundColor: color }}>
                  {step}
                </div>
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="font-bold text-sm mb-2" style={{ color: "#fef3e2" }}>{label}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(254,243,226,0.45)" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Story themes ─────────────────────────────────────────────── */}
      <section className="py-16 md:py-20" style={{ background: "#fef9f0" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-5">A story for every child, every moment.</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Whatever your child is going through — a new school, a big dream, a tricky friendship — we have a personalised story that meets them right where they are.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { emoji: "🚀", label: "Adventure & Bravery" },
                  { emoji: "🦁", label: "Confidence Building" },
                  { emoji: "🌈", label: "Friendship & Kindness" },
                  { emoji: "🏫", label: "Starting School" },
                  { emoji: "💤", label: "Bedtime & Calm" },
                  { emoji: "🌊", label: "Nature & Animals" },
                  { emoji: "⚽", label: "Sport & Teamwork" },
                  { emoji: "🧠", label: "Emotional Wellbeing" },
                ].map(({ emoji, label }) => (
                  <div key={label} className="bg-white rounded-xl p-3.5 flex items-center gap-3 border border-amber-100 shadow-sm">
                    <span className="text-xl">{emoji}</span>
                    <span className="text-xs font-semibold text-gray-700">{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <img
                src={publicAssetUrl("images/family-diversity-collage.png")}
                alt="Diverse families reading personalised Me Time Stories books together"
                className="w-full rounded-3xl object-cover shadow-2xl"
                style={{ maxHeight: 440 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonial pull quote ────────────────────────────────────── */}
      <section className="py-14 md:py-20" style={{ background: "white" }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="text-5xl mb-5">💛</div>
          <blockquote className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug mb-6" style={{ fontFamily: "Georgia, serif" }}>
            "She grabbed the book and screamed 'That's ME!' — her curly hair, her frog pyjamas, her name on every page. She cried happy tears. We both did."
          </blockquote>
          <p className="text-gray-400 text-sm">— Amara N., Mum of Zara, 5</p>
          <div className="flex gap-0.5 justify-center mt-3">
            {[1,2,3,4,5].map(s => <span key={s} className="text-amber-400 text-xl">★</span>)}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────── */}
      <section className="relative py-20 overflow-hidden">
        <img
          src={publicAssetUrl("images/family-fireplace.png")}
          alt="Family reading by the fireplace at bedtime"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "rgba(12,8,4,0.85)" }} />
        <div className="relative max-w-2xl mx-auto px-4 text-center">
          <div className="text-5xl mb-5">🌙</div>
          <h2 className="text-3xl font-bold mb-4" style={{ color: "#fef3e2" }}>
            Give them a story that's truly theirs.
          </h2>
          <p className="text-lg mb-10 leading-relaxed" style={{ color: "rgba(254,243,226,0.60)" }}>
            Build their character in 2 minutes. Read tonight for free. The Time-Travelling Tractor is waiting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/characters/create"
              className="flex items-center justify-center gap-2 px-9 py-4 font-bold text-lg rounded-xl shadow-2xl transition-all hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#1a0800" }}
            >
              ✨ Create Their Character — Free
            </Link>
            <Link
              href="/stories/time-travelling-tractor"
              className="flex items-center justify-center gap-2 px-9 py-4 border font-semibold text-lg rounded-xl transition-all hover:bg-white/10"
              style={{ borderColor: "rgba(254,243,226,0.30)", color: "#fef3e2" }}
            >
              🚜 Try Without Building
            </Link>
          </div>
        </div>
      </section>

    </PublicLayout>
  );
}
