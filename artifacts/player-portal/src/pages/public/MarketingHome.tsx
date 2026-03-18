import { Link } from "wouter";
import { PublicLayout } from "@/layouts/PublicLayout";
import { publicAssetUrl } from "@/lib/publicAssetUrl";

export default function MarketingHome() {
  return (
    <PublicLayout>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ minHeight: "92vh", display: "flex", alignItems: "center" }}>
        {/* Background image */}
        <img
          src={publicAssetUrl("images/family-reading-2.png")}
          alt="Family reading a Me Time Stories book together"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center top" }}
        />
        {/* Gradient overlay — warm dark left, transparent right */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(105deg, rgba(15,15,30,0.92) 0%, rgba(15,15,30,0.82) 45%, rgba(15,15,30,0.30) 100%)",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24 w-full grid md:grid-cols-2 items-center gap-10">
          {/* Left column — text */}
          <div>
            <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white/90 text-sm font-medium px-4 py-2 rounded-full mb-8 border border-white/20">
              📖 The Time-Travelling Tractor — Try it free today
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1]">
              Every child deserves{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #fbbf24, #f97316)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                to be the hero
              </span>{" "}
              of their own story.
            </h1>

            <p className="text-lg md:text-xl text-white/75 mb-10 leading-relaxed max-w-lg">
              Me Time Stories creates fully personalised books where your child's
              name, personality, and biggest dreams are woven into every single page —
              not just stamped on the cover.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/stories/time-travelling-tractor"
                className="flex items-center justify-center gap-2 px-8 py-4 text-white font-bold text-lg rounded-xl shadow-xl transition-all hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#1a1a1a" }}
              >
                🚜 Try the Free Story
              </Link>
              <Link
                href="/characters/create"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-white/15 backdrop-blur-sm border border-white/30 text-white font-semibold text-lg rounded-xl hover:bg-white/25 transition-all"
              >
                ✨ Build Your Character
              </Link>
            </div>

            <div className="flex flex-wrap gap-5 mt-8 text-sm text-white/55">
              <span className="flex items-center gap-1.5"><span className="text-green-400">✓</span> Personalised in minutes</span>
              <span className="flex items-center gap-1.5"><span className="text-green-400">✓</span> Ages 3–16</span>
              <span className="flex items-center gap-1.5"><span className="text-green-400">✓</span> 42+ football academies</span>
            </div>
          </div>

          {/* Right column — decorative (visible on md+) */}
          <div className="hidden md:flex flex-col items-end gap-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 max-w-xs shadow-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-orange-400 rounded-xl flex items-center justify-center text-white text-lg font-bold">M</div>
                <div>
                  <div className="text-white font-semibold text-sm">Mia's Story is Ready!</div>
                  <div className="text-white/50 text-xs">The Time-Travelling Tractor</div>
                </div>
              </div>
              <p className="text-white/70 text-sm italic leading-relaxed">
                "The morning mist lay low when <strong className="text-white">Mia</strong> found it — brave as ever, she reached out and touched the golden wheel…"
              </p>
              <div className="flex gap-1 mt-3">
                {["Brave","Creative","Kind"].map(t => (
                  <span key={t} className="text-xs bg-orange-400/20 text-orange-300 px-2 py-0.5 rounded-full">{t}</span>
                ))}
              </div>
            </div>
            <div className="text-white/30 text-xs text-right pr-2">Updated instantly when you build your character</div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ─────────────────────────────────────────────── */}
      <section className="py-5 bg-gray-900 border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-3 text-sm text-gray-400 text-center">
            <span>🏆 Premier League & Championship academies</span>
            <span>📚 Hyper-personalised — not just name-stamped</span>
            <span>👨‍👩‍👧 Loved by 1,200+ families</span>
            <span>🔒 Safeguarding compliant</span>
          </div>
        </div>
      </section>

      {/* ── WHAT WE DO ────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="relative">
              <img
                src={publicAssetUrl("images/family-reading-1.png")}
                alt="Mother and child reading a Me Time Stories book"
                className="w-full rounded-3xl object-cover shadow-2xl"
                style={{ maxHeight: 480 }}
              />
              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                <div className="text-2xl font-bold text-orange-500 leading-none">100%</div>
                <div className="text-xs text-gray-500 mt-0.5">Personalised to your child</div>
              </div>
            </div>

            <div>
              <span className="inline-block bg-orange-50 text-orange-600 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
                Not just their name
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                We build every story around who your child truly is.
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Most "personalised" books just swap in a name. We go much deeper — your child's personality traits, favourite animals, biggest dreams, and real life context are woven into every scene, every challenge, and every triumph.
              </p>
              <div className="space-y-4">
                {[
                  { icon: "🎭", title: "Their personality in the plot", desc: "Brave, creative, curious — their traits drive the story's decisions." },
                  { icon: "🌟", title: "Their dreams in the resolution", desc: "The story's ending reflects what they're really aiming for in life." },
                  { icon: "🐾", title: "Their world on every page", desc: "Favourite animals, places, and things appear naturally throughout." },
                ].map(({ icon, title, desc }) => (
                  <div key={title} className="flex gap-4">
                    <div className="w-11 h-11 bg-orange-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">{icon}</div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{title}</div>
                      <div className="text-gray-500 text-sm leading-relaxed">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/characters/create"
                className="inline-flex items-center gap-2 mt-8 px-7 py-3.5 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-[1.02] text-base"
                style={{ backgroundColor: "#f97316" }}
              >
                Build your character →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE STORY ─────────────────────────────────────────────── */}
      <section
        className="py-16 md:py-20 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0c2340 100%)" }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {["top-10 left-[8%]","top-20 right-[12%]","top-40 left-[35%]","bottom-16 right-[18%]"].map((pos, i) => (
            <div key={i} className={`absolute ${pos} text-yellow-300 opacity-20 text-xl`} style={{ animation: `bounce ${2 + i * 0.4}s ease-in-out infinite alternate` }}>✦</div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <span className="inline-block bg-yellow-400/20 text-yellow-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-yellow-400/30">
            🚜 Our Flagship Story — Free to Try
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            The Time-Travelling Tractor
          </h2>
          <p className="text-blue-200 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Build your child's character in 2 minutes, then watch as their name, personality, and biggest dream appear throughout a magical 6-chapter adventure. No images yet — pure story magic.
          </p>

          {/* Story preview card */}
          <div className="bg-white/8 border border-white/15 rounded-3xl p-6 md:p-8 mb-8 text-left max-w-xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Chapter 1: The Discovery</span>
            </div>
            <p className="text-white text-base md:text-lg leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>
              "The morning mist lay low over the fields when{" "}
              <strong className="text-yellow-300">[your child's name]</strong>{" "}
              found it — half-hidden beneath an old oak tree, covered in rust and wonder: the Time-Travelling Tractor. Something{" "}
              <em className="text-orange-300">[brave / curious / kind]</em>{" "}
              stirred inside{" "}
              <em className="text-blue-300">[their]</em>{" "}
              chest as{" "}
              <em className="text-blue-300">[they]</em>{" "}
              reached out…"
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/stories/time-travelling-tractor"
              className="flex items-center justify-center gap-2 px-8 py-4 font-bold text-lg rounded-xl shadow-xl transition-all hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#1a1a1a" }}
            >
              🚜 Read the Story Now
            </Link>
            <Link
              href="/characters/create"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold text-lg rounded-xl hover:bg-white/20 transition-all"
            >
              ✨ Build Character First
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How it works</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">From a 2-minute character build to a story they'll ask for every bedtime.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", icon: "🧒", color: "#6366f1", title: "Tell us who they are", desc: "Name, age, personality traits, favourite animal, and biggest dream. Takes about 2 minutes." },
              { step: "02", icon: "✍️", color: "#f97316", title: "The story is personalised", desc: "Every chapter adapts to their unique profile — their traits drive decisions, their dream shapes the ending." },
              { step: "03", icon: "📖", color: "#10b981", title: "Read together and watch them glow", desc: "Hear them gasp when they see their own name, their own traits, their own world — on every page." },
            ].map(({ step, icon, color, title, desc }) => (
              <div key={step} className="relative">
                <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow h-full">
                  <div className="text-4xl font-black mb-3 leading-none" style={{ color: `${color}25` }}>{step}</div>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-4" style={{ backgroundColor: `${color}15` }}>
                    {icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTBALL ACADEMY BANNER ───────────────────────────────── */}
      <section
        className="py-16 md:py-20 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 60%, #0ea5e9 100%)" }}
      >
        <div className="absolute inset-0 opacity-8"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }}
        />
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-flex items-center gap-2 bg-white/20 text-white text-sm font-medium px-4 py-2 rounded-full mb-6 border border-white/30">
                ⚽ Football Academy Programme
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-5 leading-tight">
                We partner with{" "}
                <span className="text-yellow-300">elite football academies</span>{" "}
                across England.
              </h2>
              <p className="text-blue-100 text-lg leading-relaxed mb-4">
                Once your academy is onboarded, you get a dedicated staff portal to add players and collect their profiles. We then craft a personalised story for each player — building mental resilience, identity, and belonging.
              </p>
              <p className="text-blue-200 text-sm leading-relaxed mb-8">
                Only 0.5% of academy players reach professional football. The difference is increasingly mental. Our stories address that — in a format young players actually love.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/for-academies"
                  className="px-7 py-3.5 bg-white text-blue-900 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all text-base"
                >
                  Learn about the Academy Programme →
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { num: "42+", label: "Partner academies" },
                { num: "0.5%", label: "Only reach pro football" },
                { num: "5–16", label: "Player age range" },
                { num: "100%", label: "Stories personalised" },
              ].map(({ num, label }) => (
                <div key={label} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 text-center">
                  <div className="text-3xl md:text-4xl font-black text-yellow-300 mb-1">{num}</div>
                  <div className="text-blue-200 text-xs font-medium">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS WITH IMAGE ───────────────────────────────── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">What families say</h2>
            <p className="text-gray-500 text-lg">Real moments from real bedtimes.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                quote: "My daughter screamed when she heard her name — then her favourite animal appeared. She's asked for it every night since. Pure magic.",
                name: "Sarah M.",
                role: "Mum of a 6-year-old",
              },
              {
                quote: "The academy story gave our son something to hold onto during a really tough season — it knew him. He carries it everywhere.",
                name: "James & Priya K.",
                role: "Parents of a U12 academy player",
              },
              {
                quote: "He saw his biggest dream written in the story and actually cried. A seven-year-old crying happy tears at bedtime. I'll never forget it.",
                name: "Claire T.",
                role: "Mum of two",
              },
            ].map(({ quote, name, role }) => (
              <div key={name} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex gap-0.5 mb-4">
                  {[1,2,3,4,5].map(i => <span key={i} className="text-amber-400 text-sm">★</span>)}
                </div>
                <p className="text-gray-700 leading-relaxed mb-5 italic text-sm">"{quote}"</p>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{name}</div>
                  <div className="text-gray-400 text-xs">{role}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Image bar */}
          <div className="rounded-3xl overflow-hidden shadow-2xl relative" style={{ maxHeight: 320 }}>
            <img
              src={publicAssetUrl("images/family-collage.png")}
              alt="Families reading Me Time Stories books"
              className="w-full object-cover"
              style={{ objectPosition: "center 30%" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent flex items-end p-8">
              <p className="text-white text-lg md:text-2xl font-bold max-w-lg leading-snug">
                "Every family deserves a story where their child is the hero."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── ILLUSTRATORS ──────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-amber-100 text-amber-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
                ✍️ For Authors & Illustrators
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mb-5">
                Talented storytellers create our worlds. You bring the magic.
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                We partner with professional children's book authors and illustrators who craft the stories and artwork. Our platform personalises their work for every individual child — combining craft with technology.
              </p>
              <Link
                href="/for-authors"
                className="inline-flex items-center gap-2 px-7 py-3.5 font-semibold rounded-xl transition-all text-white text-base hover:scale-[1.02]"
                style={{ backgroundColor: "#d97706" }}
              >
                Partner with us →
              </Link>
            </div>
            <div>
              <img
                src={publicAssetUrl("images/illustrator.png")}
                alt="Illustrator creating a Me Time Stories character"
                className="w-full rounded-3xl object-cover shadow-xl"
                style={{ maxHeight: 380 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────── */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <img
          src={publicAssetUrl("images/family-fireplace.png")}
          alt="Family reading by fireplace"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center 20%" }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.65) 100%)" }} />
        <div className="relative max-w-2xl mx-auto px-4 text-center">
          <div className="text-5xl mb-5">🚜</div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-5 leading-tight">
            Start the adventure tonight.
          </h2>
          <p className="text-white/70 text-lg mb-10 leading-relaxed">
            Build your child's character in 2 minutes and read their personalised version of The Time-Travelling Tractor — completely free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/characters/create"
              className="flex items-center justify-center gap-2 px-9 py-4 font-bold text-lg rounded-xl shadow-2xl transition-all hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#1a1a1a" }}
            >
              ✨ Build Your Character
            </Link>
            <Link
              href="/stories/time-travelling-tractor"
              className="flex items-center justify-center gap-2 px-9 py-4 bg-white/15 backdrop-blur-sm border border-white/30 text-white font-semibold text-lg rounded-xl hover:bg-white/25 transition-all"
            >
              🚜 Try the Story First
            </Link>
          </div>
        </div>
      </section>

    </PublicLayout>
  );
}
