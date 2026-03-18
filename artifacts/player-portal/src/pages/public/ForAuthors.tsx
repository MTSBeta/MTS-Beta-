import { Link } from "wouter";
import { PublicLayout } from "@/layouts/PublicLayout";
import { publicAssetUrl } from "@/lib/publicAssetUrl";

export default function ForAuthors() {
  return (
    <PublicLayout>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ minHeight: "65vh", display: "flex", alignItems: "center" }}>
        <img
          src={publicAssetUrl("images/illustrator.png")}
          alt="Illustrator creating characters for a Me Time Stories book"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center 30%" }}
        />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(110deg, rgba(12,8,4,0.93) 0%, rgba(20,10,4,0.82) 55%, rgba(30,14,4,0.40) 100%)"
        }} />
        <div className="relative max-w-7xl mx-auto px-4 py-20 w-full">
          <Link href="/" className="inline-flex items-center gap-2 text-sm mb-8 transition-colors" style={{ color: "rgba(254,243,226,0.50)" }}>
            <i className="ri-arrow-left-line"></i> Back to home
          </Link>
          <span className="inline-block bg-amber-400/15 border border-amber-400/25 text-amber-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            ✍️ For Authors & Illustrators
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight max-w-2xl" style={{ color: "#fef3e2" }}>
            Your stories.{" "}
            <span style={{ color: "#fbbf24" }}>Their hero.</span>
          </h1>
          <p className="text-lg max-w-xl leading-relaxed mb-10" style={{ color: "rgba(254,243,226,0.65)" }}>
            Partner with Me Time Stories to bring your narrative talent to thousands of families. We provide the personalisation engine — you bring the magic of storytelling.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="mailto:authors@metimestories.com"
              className="flex items-center justify-center gap-2 px-8 py-4 font-bold text-lg rounded-xl shadow-xl transition-all hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#1a0800" }}
            >
              Apply to Partner →
            </a>
            <a
              href="#how-it-works"
              className="flex items-center justify-center gap-2 px-8 py-4 border font-semibold text-lg rounded-xl transition-all hover:bg-white/10"
              style={{ borderColor: "rgba(254,243,226,0.30)", color: "#fef3e2" }}
            >
              How it works
            </a>
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-16 md:py-24" style={{ background: "#fef9f0" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How the Author Partnership Works</h2>
            <p className="text-gray-500">Three steps from story idea to thousands of happy families.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                icon: "📝",
                title: "Submit Your Story Framework",
                desc: "Provide your story structure — characters, plot arc, themes, and key moments. We integrate it with our personalisation engine so every child becomes the hero.",
                bg: "#fff7ed",
                border: "#fed7aa",
                stepColor: "#f97316",
              },
              {
                step: "02",
                icon: "✨",
                title: "We Handle the Personalisation",
                desc: "Our Dynamic Personalisation Framework (DPF) weaves each child's name, personality, favourite animal, and biggest dream seamlessly into your story world.",
                bg: "#fefce8",
                border: "#fde68a",
                stepColor: "#f59e0b",
              },
              {
                step: "03",
                icon: "💰",
                title: "Earn From Every Story",
                desc: "Every time a family purchases a personalised version of your story, you receive a royalty. Your creative work scales across thousands of children.",
                bg: "#f0fdf4",
                border: "#bbf7d0",
                stepColor: "#10b981",
              },
            ].map(({ step, icon, title, desc, bg, border, stepColor }) => (
              <div key={step} className="rounded-3xl p-8 border" style={{ background: bg, borderColor: border }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-sm mb-5 shadow-md" style={{ backgroundColor: stepColor }}>
                  {step}
                </div>
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What we look for + Benefits ──────────────────────────────── */}
      <section className="py-16 md:py-20" style={{ background: "white" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">

            {/* What we look for */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What We Look For in Authors</h2>
              <ul className="space-y-4">
                {[
                  { icon: "❤️", text: "A genuine love of children's storytelling and child development" },
                  { icon: "🌍", text: "Diverse voices and authentic representations of childhood experiences" },
                  { icon: "🧩", text: "Flexible, modular narrative structures that work across different personalisation parameters" },
                  { icon: "🛡️", text: "Age-appropriate content meeting our editorial and safeguarding standards" },
                  { icon: "🌈", text: "Stories that celebrate the real diversity of British and international families" },
                ].map(({ icon, text }) => (
                  <li key={text} className="flex items-start gap-4">
                    <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0 mt-0.5">{icon}</div>
                    <p className="text-gray-700 text-sm leading-relaxed pt-1.5">{text}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Author Benefits */}
            <div className="rounded-3xl p-8 border border-amber-100" style={{ background: "#fef9f0" }}>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Author Benefits</h3>
              <div className="space-y-4">
                {[
                  { icon: "💰", label: "Royalties on every story sold", color: "#f97316" },
                  { icon: "🏆", label: "National reach through Premier League academy partnerships", color: "#f59e0b" },
                  { icon: "🔧", label: "Our tech team handles all personalisation — you just write", color: "#10b981" },
                  { icon: "📚", label: "Your work in thousands of homes, read every night", color: "#8b5cf6" },
                  { icon: "🎨", label: "Author profile and full credit on every story", color: "#f43f5e" },
                ].map(({ icon, label, color }) => (
                  <div key={label} className="flex items-center gap-4 bg-white rounded-xl p-4 border border-amber-50 shadow-sm">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: `${color}18` }}>{icon}</div>
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── The books families read ───────────────────────────────────── */}
      <section className="py-14 md:py-20" style={{ background: "#0d0a08" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src={publicAssetUrl("images/book-likeness.png")}
                alt="Child pointing at their illustrated likeness in the story, saying Look Mum it's me"
                className="w-full rounded-3xl object-cover shadow-2xl"
                style={{ maxHeight: 420 }}
              />
            </div>
            <div>
              <span className="inline-block bg-amber-400/15 border border-amber-400/25 text-amber-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
                ✨ The moment your work creates
              </span>
              <h2 className="text-3xl font-bold mb-5 leading-tight" style={{ color: "#fef3e2" }}>
                "Look, Mum — it really IS me!"
              </h2>
              <p className="text-lg leading-relaxed mb-5" style={{ color: "rgba(254,243,226,0.60)" }}>
                That moment — when a child points at the illustration and recognises themselves — is what your storytelling creates for thousands of families.
              </p>
              <p className="leading-relaxed mb-8" style={{ color: "rgba(254,243,226,0.45)", fontSize: 15 }}>
                Your narrative framework is the foundation. We personalise the hero's name, appearance, personality, favourite animal, and biggest dream — so every copy feels like it was written specifically for that child.
              </p>
              <a
                href="mailto:authors@metimestories.com"
                className="inline-flex items-center gap-2 px-7 py-4 font-bold rounded-xl text-amber-900 hover:scale-[1.02] transition-all shadow-lg"
                style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)" }}
              >
                Apply to become a partner →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20" style={{ background: "#fef3e2" }}>
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="text-5xl mb-5">✍️</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Partner?</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            We're currently onboarding our founding cohort of author partners. Apply now and help shape the future of personalised children's books.
          </p>
          <a
            href="mailto:authors@metimestories.com"
            className="inline-flex items-center justify-center gap-2 px-10 py-4 font-bold text-lg rounded-xl shadow-xl transition-all hover:scale-[1.02] text-amber-900"
            style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)" }}
          >
            Apply to Become an Author Partner
          </a>
          <p className="mt-4 text-sm text-gray-400">We review all applications within 5 business days.</p>
        </div>
      </section>

    </PublicLayout>
  );
}
