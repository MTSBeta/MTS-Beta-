import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { PublicLayout } from "@/layouts/PublicLayout";
import { publicAssetUrl } from "@/lib/publicAssetUrl";

// ── Testimonials data ────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    quote: "She grabbed the book and screamed 'That's ME!' — her curly hair, her frog pyjamas, her name on every page. She cried happy tears. We both did.",
    name: "Amara N.",
    role: "Mum of Zara, 5",
    photo: "family-diversity-collage.png",
  },
  {
    quote: "The academy story had our son's position, his personality, his biggest dream — all woven in. He carries it to training. His coach cried reading it.",
    name: "James & Priya K.",
    role: "Parents of a U12 academy player",
    photo: "family-reading-1.png",
  },
  {
    quote: "My daughter pointed at the illustration and said 'Look, Mummy — it's me having an adventure!' She's asked for it every single night since.",
    name: "Claire T.",
    role: "Mum of Freya, 6",
    photo: "mom-daughter-sofa.png",
  },
  {
    quote: "Bedtime used to be a battle. Now he runs to get the book. His favourite animal is actually in the story. He's read it 14 times.",
    name: "Marcus D.",
    role: "Dad of Noah, 7",
    photo: "family-collage.png",
  },
];

// ── Photo strip ──────────────────────────────────────────────────────────
const READING_PHOTOS = [
  { src: "images/book-likeness.png",           caption: "\"Look, Mum, it really IS me!\"" },
  { src: "images/family-diversity-collage.png", caption: "Every family. Every child." },
  { src: "images/mom-daughter-sofa.png",        caption: "Their likeness — right on the page." },
  { src: "images/family-collage.png",           caption: "1,200+ families already reading." },
  { src: "images/family-fireplace.png",         caption: "Cozy evenings that last a lifetime." },
];

export default function MarketingHome() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activePhoto, setActivePhoto] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Parallax scroll tracker
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Auto-advance testimonials
  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial((p) => (p + 1) % TESTIMONIALS.length), 6000);
    return () => clearInterval(t);
  }, []);

  // Auto-advance photo strip
  useEffect(() => {
    const t = setInterval(() => setActivePhoto((p) => (p + 1) % READING_PHOTOS.length), 4500);
    return () => clearInterval(t);
  }, []);

  const prevTestimonial = () => setActiveTestimonial((p) => (p - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const nextTestimonial = () => setActiveTestimonial((p) => (p + 1) % TESTIMONIALS.length);

  return (
    <PublicLayout>

      {/* ══ 1. HERO ══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ minHeight: "95vh", display: "flex", alignItems: "center" }}>
        {/* Looping video background with parallax — girl reading, characters coming to life */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            objectPosition: "center center",
            transform: `translateY(${scrollY * 0.38}px)`,
            willChange: "transform",
          }}
        >
          <source src={publicAssetUrl("images/girl-reading-book.mp4")} type="video/mp4" />
        </video>
        {/* Glassmorphic overlay — left dark, right lets video breathe */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(110deg, rgba(12,8,4,0.92) 0%, rgba(12,8,4,0.78) 40%, rgba(12,8,4,0.28) 100%)"
        }} />
        {/* Subtle warm vignette at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-56" style={{
          background: "linear-gradient(to top, rgba(12,8,4,0.95) 0%, transparent 100%)"
        }} />

        {/* Hero content moves at a gentle parallax offset */}
        <div
          className="relative max-w-7xl mx-auto px-4 py-16 md:py-24 w-full grid md:grid-cols-2 items-center gap-12"
          style={{ transform: `translateY(${scrollY * -0.10}px)`, willChange: "transform" }}
        >
          <div>
            {/* Eyebrow */}
            <span className="inline-flex items-center gap-2 bg-amber-400/15 border border-amber-400/30 text-amber-300 text-sm font-medium px-4 py-2 rounded-full mb-8">
              <i className="ri-moon-line"></i> The Time-Travelling Tractor — free to try tonight
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-bold leading-[1.08] mb-6" style={{ color: "#fef3e2" }}>
              Every child deserves{" "}
              <span style={{
                background: "linear-gradient(135deg, #fbbf24, #f97316)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                to be the hero
              </span>{" "}
              of their own bedtime story.
            </h1>

            <p className="text-lg md:text-xl mb-10 leading-relaxed max-w-lg" style={{ color: "rgba(254,243,226,0.70)" }}>
              Me Time Stories creates fully personalised children's books where your child's name, face, personality, and biggest dreams live on every single page — not just stamped on the cover.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/characters/create"
                className="flex items-center justify-center gap-2 px-8 py-4 font-bold text-lg rounded-xl shadow-xl transition-all hover:scale-[1.02] hover:shadow-2xl"
                style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#1a0800" }}
              >
                <i className="ri-user-smile-line"></i> Build Your Character
              </Link>
              <Link
                href="/stories/time-travelling-tractor"
                className="flex items-center justify-center gap-2 px-8 py-4 font-semibold text-lg rounded-xl transition-all hover:bg-white/15"
                style={{ borderColor: "rgba(254,243,226,0.55)", color: "#fef3e2", backdropFilter: "blur(8px)", background: "rgba(255,255,255,0.10)", border: "1.5px solid rgba(254,243,226,0.55)" }}
              >
                <i className="ri-play-circle-fill"></i> Try the Free Story
              </Link>
            </div>

            <div className="flex flex-wrap gap-5 mt-8 text-sm" style={{ color: "rgba(254,243,226,0.45)" }}>
              <span className="flex items-center gap-1.5"><span className="text-amber-400">✓</span> Personalised in minutes</span>
              <span className="flex items-center gap-1.5"><span className="text-amber-400">✓</span> Ages 3–16</span>
              <span className="flex items-center gap-1.5"><span className="text-amber-400">✓</span> 42+ football academies</span>
            </div>
          </div>

          {/* Story preview card — desktop only */}
          <div className="hidden md:flex flex-col gap-4 ml-auto max-w-sm w-full">
            {/* Book cover card */}
            <div className="rounded-3xl overflow-hidden shadow-2xl" style={{ border: "1px solid rgba(251,191,36,0.18)", backdropFilter: "blur(24px)", background: "rgba(10,6,2,0.60)" }}>
              <div className="relative overflow-hidden" style={{ height: 180 }}>
                <img
                  src={publicAssetUrl("images/family-reading-1.png")}
                  alt="Family reading a Me Time Stories book"
                  className="w-full h-full object-cover"
                  style={{ objectPosition: "center 20%", filter: "saturate(0.7) brightness(0.65)" }}
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 30%, rgba(10,6,2,0.95) 100%)" }} />
                <div className="absolute bottom-0 left-0 right-0 px-5 py-4">
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] mb-1" style={{ color: "#f97316" }}>
                    Our Flagship Story
                  </div>
                  <p className="text-base font-black leading-tight" style={{ color: "#fef3e2" }}>
                    Ty & the Time<br/>Travelling Tractor
                  </p>
                </div>
              </div>
              <div className="px-5 py-4">
                <p className="text-sm leading-relaxed mb-4" style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: "rgba(254,243,226,0.75)" }}>
                  "The morning mist lay low when <span style={{ color: "#fbbf24", fontStyle: "normal", fontWeight: 700 }}>your child</span> found it — the golden wheel gleaming in the field…"
                </p>
                <div className="flex gap-2 flex-wrap mb-4">
                  {["Their name", "Their personality", "Their favourite animal"].map((t) => (
                    <span key={t} className="text-[10px] font-semibold text-amber-300 border border-amber-400/22 px-2.5 py-1 rounded-full" style={{ background: "rgba(251,191,36,0.10)" }}>{t}</span>
                  ))}
                </div>
                <Link
                  href="/stories/ty-tractor"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-[1.01]"
                  style={{ background: "linear-gradient(135deg,#f97316,#fbbf24)", color: "#1a0800" }}
                >
                  <i className="ri-play-circle-fill"></i> Read a Preview Free
                </Link>
              </div>
            </div>

            {/* Trust strip */}
            <div className="flex items-center justify-between px-5 py-3 rounded-2xl" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(254,243,226,0.10)", backdropFilter: "blur(12px)" }}>
              <div className="text-center">
                <div className="text-lg font-black" style={{ color: "#fbbf24" }}>1,200+</div>
                <div className="text-[10px]" style={{ color: "rgba(254,243,226,0.38)" }}>Families reading</div>
              </div>
              <div className="w-px h-8" style={{ background: "rgba(255,255,255,0.10)" }} />
              <div className="text-center">
                <div className="text-lg font-black" style={{ color: "#fbbf24" }}>42+</div>
                <div className="text-[10px]" style={{ color: "rgba(254,243,226,0.38)" }}>Academies</div>
              </div>
              <div className="w-px h-8" style={{ background: "rgba(255,255,255,0.10)" }} />
              <div className="text-center">
                <div className="text-lg font-black" style={{ color: "#fbbf24" }}>14</div>
                <div className="text-[10px]" style={{ color: "rgba(254,243,226,0.38)" }}>Pages, personal</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1" style={{ color: "rgba(254,243,226,0.30)" }}>
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-0.5 h-8 rounded-full" style={{ background: "rgba(254,243,226,0.20)" }} />
        </div>
      </section>

      {/* ══ 2. TRUST BAR ═════════════════════════════════════════════════ */}
      <section className="py-4 border-b" style={{ background: "#1a0c04", borderColor: "rgba(251,191,36,0.12)" }}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-3 text-sm" style={{ color: "rgba(254,243,226,0.40)" }}>
            <span><i className="ri-shield-star-line"></i> Premier League & Championship academies</span>
            <span><i className="ri-book-heart-line"></i> Truly personalised — not just name-stamped</span>
            <span><i className="ri-group-line"></i> 1,200+ families reading tonight</span>
            <span><i className="ri-shield-check-line"></i> Safeguarding compliant</span>
          </div>
        </div>
      </section>

      {/* ══ 3. "LOOK MUM — IT'S ME!" ═══════════════════════════════════ */}
      <section className="py-16 md:py-24 overflow-hidden" style={{ background: "#fef9f0" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Image with the magic moment */}
            <div className="relative order-2 md:order-1">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={publicAssetUrl("images/book-likeness.png")}
                  alt="Child pointing at their illustrated likeness in the book saying Look Mum it's really me"
                  className="w-full object-cover"
                />
              </div>
              {/* Floating quote bubble */}
              <div
                className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 bg-white rounded-2xl shadow-xl px-5 py-4 max-w-[220px] border border-amber-100"
              >
                <p className="text-gray-800 font-bold text-sm leading-snug italic">"Look, Mum, it really IS me!"</p>
                <p className="text-gray-400 text-xs mt-1">— Lily, age 6, pointing at the page</p>
              </div>
            </div>

            {/* Text */}
            <div className="order-1 md:order-2">
              <span className="inline-block bg-amber-100 text-amber-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
                ✨ The magic moment
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                Their face, their dream, their personality —{" "}
                <span style={{ color: "#f97316" }}>right there on the page.</span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Other personalised books just swap in a name. We go so much deeper. Our illustrators draw characters that look like your child. Our authors weave in their personality traits, their favourite animal, and their biggest dream — so every page feels like it was written just for them.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                The moment a child points at the page and says <em>"That's me!"</em> — that's the moment we work for. It happens. Every time.
              </p>
              <div className="space-y-3">
                {[
                  { icon: "🎭", text: "Their personality traits drive the story's choices" },
                  { icon: "🐾", text: "Their favourite animal appears in the adventure" },
                  { icon: "🌟", text: "Their biggest dream shapes the story's ending" },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-3 text-gray-700 text-sm font-medium">
                    <span className="text-xl">{icon}</span>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/characters/create"
                className="inline-flex items-center gap-2 mt-8 px-7 py-4 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] text-base"
                style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#1a0800" }}
              >
                Create their character →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 4. VIDEO SECTION ═════════════════════════════════════════════ */}
      <section className="py-16 md:py-20 relative overflow-hidden" style={{ background: "#0d0a08" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(251,191,36,0.06) 0%, transparent 70%)" }} />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <span className="inline-block bg-amber-400/15 border border-amber-400/25 text-amber-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            🎬 See the magic in action
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#fef3e2" }}>
            Watch a mum and daughter discover their story.
          </h2>
          <p className="mb-10 text-lg leading-relaxed max-w-xl mx-auto" style={{ color: "rgba(254,243,226,0.55)" }}>
            Real reactions. Real magic. This is what bedtime looks like with Me Time Stories.
          </p>
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border" style={{ borderColor: "rgba(251,191,36,0.20)" }}>
            <video
              ref={videoRef}
              src={publicAssetUrl("images/family-reading-video.mp4")}
              autoPlay
              muted
              loop
              playsInline
              className="w-full object-cover"
              style={{ maxHeight: 500 }}
            />
            {/* Bottom caption */}
            <div className="absolute inset-x-0 bottom-0 px-6 py-4" style={{ background: "linear-gradient(to top, rgba(12,8,4,0.85) 0%, transparent 100%)" }}>
              <p className="text-sm font-medium" style={{ color: "rgba(254,243,226,0.70)" }}>
                🌙 Bedtime magic, delivered to your door
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 5. HOW PERSONALISATION WORKS ════════════════════════════════ */}
      <section className="py-16 md:py-24" style={{ background: "#fef9f0" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <span className="inline-block bg-orange-100 text-orange-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
                Not just their name
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                We build every story around who your child truly is.
              </h2>

              <div className="space-y-5 mb-8">
                {[
                  {
                    step: "01",
                    icon: "ri-user-heart-line",
                    title: "Tell us who they are",
                    desc: "Name, age, pronouns, personality traits, favourite animal, and their biggest dream. Takes 2 minutes.",
                    color: "#f97316",
                  },
                  {
                    step: "02",
                    icon: "ri-quill-pen-line",
                    title: "Every chapter is personalised",
                    desc: "Their traits drive the hero's decisions. Their animal appears in the story. Their dream shapes the ending.",
                    color: "#f59e0b",
                  },
                  {
                    step: "03",
                    icon: "ri-book-open-line",
                    title: "They see themselves on every page",
                    desc: "Our illustrators bring their likeness to life. They'll point at the page and say \"That's me!\"",
                    color: "#10b981",
                  },
                ].map(({ step, icon, title, desc, color }) => (
                  <div key={step} className="flex gap-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-sm flex-shrink-0 shadow-md"
                      style={{ backgroundColor: color }}
                    >
                      {step}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 mb-0.5"><i className={icon} style={{ color }}></i> {title}</div>
                      <div className="text-gray-500 text-sm leading-relaxed">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/characters/create"
                className="inline-flex items-center gap-2 px-7 py-4 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#1a0800" }}
              >
                Build their character →
              </Link>
            </div>

            <div className="relative">
              <img
                src={publicAssetUrl("images/mom-daughter-sofa.png")}
                alt="Mother and daughter discovering the child's illustrated likeness in the book"
                className="w-full rounded-3xl object-cover shadow-2xl"
                style={{ maxHeight: 500 }}
              />
              <div className="absolute -bottom-4 -right-4 bg-amber-400 rounded-2xl shadow-xl p-4 text-center">
                <div className="text-2xl font-black text-amber-900 leading-none">100%</div>
                <div className="text-xs text-amber-800 mt-0.5 font-semibold">Personalised</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 6. THE STORY — TTT ═══════════════════════════════════════════ */}
      <section
        className="py-16 md:py-20 relative overflow-hidden"
        style={{ background: "#060402" }}
      >
        {/* Real background image — blurred, darkened */}
        <img
          src={publicAssetUrl("images/family-fireplace.png")}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center 30%", filter: "blur(3px) saturate(0.7)", transform: "scale(1.05)" }}
        />
        {/* Dark glass overlay */}
        <div className="absolute inset-0" style={{ background: "rgba(6,4,2,0.82)" }} />
        {/* Warm amber glow from top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(249,115,22,0.12) 0%, transparent 70%)", filter: "blur(30px)" }} />

        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <div className="text-6xl mb-5">🚜</div>
          <span className="inline-block bg-amber-400/15 border border-amber-400/25 text-amber-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            Our Flagship Story — Free Tonight
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#fef3e2" }}>
            The Time-Travelling Tractor
          </h2>
          <p className="text-lg mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: "rgba(254,243,226,0.60)" }}>
            A 6-chapter adventure where your child's name, personality, and biggest dream are woven through every page. Build their character in 2 minutes — then watch the magic begin.
          </p>

          {/* Story page preview — glassmorphic panel */}
          <div
            className="rounded-3xl p-6 md:p-8 mb-8 text-left max-w-xl mx-auto"
            style={{
              backdropFilter: "blur(20px)",
              background: "rgba(255,248,225,0.06)",
              border: "1px solid rgba(251,191,36,0.22)",
              boxShadow: "0 8px 40px rgba(0,0,0,0.40), inset 0 1px 0 rgba(251,191,36,0.08)",
            }}
          >
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "rgba(254,243,226,0.35)" }}>
              📖 Chapter 1: The Discovery
            </p>
            <p className="text-base md:text-lg leading-relaxed" style={{ fontFamily: "Georgia, serif", color: "rgba(254,243,226,0.88)" }}>
              "The morning mist lay low over the fields when{" "}
              <strong style={{ color: "#fbbf24" }}>[your child's name]</strong>{" "}
              found it — half-hidden beneath an old oak tree. Something{" "}
              <em style={{ color: "#fb923c" }}>[brave / curious / kind]</em>{" "}
              stirred inside{" "}
              <em style={{ color: "#a5f3fc" }}>[their]</em>{" "}
              chest. In the hedgerow, a{" "}
              <em style={{ color: "#86efac" }}>[fox / lion / dragon]</em>{" "}
              watched with knowing eyes…"
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/characters/create"
              className="flex items-center justify-center gap-2 px-8 py-4 font-bold text-lg rounded-xl shadow-xl transition-all hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#1a0800" }}
            >
              ✨ Build Character First
            </Link>
            <Link
              href="/stories/time-travelling-tractor"
              className="flex items-center justify-center gap-2 px-8 py-4 border font-semibold text-lg rounded-xl transition-all"
              style={{ borderColor: "rgba(254,243,226,0.25)", color: "#fef3e2", background: "rgba(255,255,255,0.06)" }}
            >
              🚜 Try Without Building
            </Link>
          </div>
        </div>
      </section>

      {/* ══ 7. PHOTO SLIDER ══════════════════════════════════════════════ */}
      <section className="py-14 md:py-20 relative overflow-hidden" style={{ background: "#1a0c04" }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: "#fef3e2" }}>
              Reading moments that last forever.
            </h2>
            <p className="text-sm" style={{ color: "rgba(254,243,226,0.40)" }}>Every family. Every child. Every night.</p>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-2xl border" style={{ borderColor: "rgba(251,191,36,0.15)" }}>
            {/* Slides */}
            <div className="relative" style={{ paddingBottom: "56.25%" }}>
              {READING_PHOTOS.map((photo, i) => (
                <div
                  key={photo.src}
                  className="absolute inset-0 transition-opacity duration-1000"
                  style={{ opacity: activePhoto === i ? 1 : 0 }}
                >
                  <img
                    src={publicAssetUrl(photo.src)}
                    alt={photo.caption}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(12,8,4,0.75) 0%, transparent 50%)" }} />
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-white font-bold text-lg md:text-2xl" style={{ fontFamily: "Georgia, serif" }}>
                      {photo.caption}
                    </p>
                  </div>
                </div>
              ))}

              {/* Nav arrows */}
              <button
                onClick={() => setActivePhoto((p) => (p - 1 + READING_PHOTOS.length) % READING_PHOTOS.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-black/70 transition-colors z-10"
              >
                ‹
              </button>
              <button
                onClick={() => setActivePhoto((p) => (p + 1) % READING_PHOTOS.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-black/70 transition-colors z-10"
              >
                ›
              </button>
            </div>

            {/* Dot indicators */}
            <div className="flex justify-center gap-2 py-4" style={{ background: "#1a0c04" }}>
              {READING_PHOTOS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActivePhoto(i)}
                  className="rounded-full transition-all"
                  style={{
                    width: activePhoto === i ? 24 : 8,
                    height: 8,
                    backgroundColor: activePhoto === i ? "#f97316" : "rgba(254,243,226,0.20)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ 8. TESTIMONIALS SLIDER ═══════════════════════════════════════ */}
      <section className="py-16 md:py-24 relative overflow-hidden" style={{ background: "#fef9f0" }}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">What families say</h2>
            <p className="text-gray-500">Real reactions. Real bedtimes. Real magic.</p>
          </div>

          <div className="relative">
            {/* Testimonial card */}
            <div className="rounded-3xl overflow-hidden shadow-xl border border-amber-100" style={{ minHeight: 340 }}>
              {TESTIMONIALS.map((t, i) => (
                <div
                  key={i}
                  className="absolute inset-0 transition-opacity duration-700 flex flex-col md:flex-row"
                  style={{ opacity: activeTestimonial === i ? 1 : 0, position: activeTestimonial === i ? "relative" : "absolute" }}
                >
                  {/* Image */}
                  <div className="md:w-2/5 relative overflow-hidden" style={{ minHeight: 200 }}>
                    <img
                      src={publicAssetUrl(`images/${t.photo}`)}
                      alt={t.name}
                      className="w-full h-full object-cover"
                      style={{ minHeight: 200 }}
                    />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to right, transparent 60%, #fef9f0 100%)" }} />
                  </div>
                  {/* Quote */}
                  <div className="md:w-3/5 p-8 md:p-10 flex flex-col justify-center bg-white">
                    <div className="flex gap-0.5 mb-4">
                      {[1,2,3,4,5].map((s) => <span key={s} className="text-amber-400 text-lg">★</span>)}
                    </div>
                    <p className="text-gray-800 text-lg leading-relaxed mb-6 italic" style={{ fontFamily: "Georgia, serif" }}>
                      "{t.quote}"
                    </p>
                    <div>
                      <div className="font-bold text-gray-900">{t.name}</div>
                      <div className="text-gray-400 text-sm">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={prevTestimonial}
                className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors text-sm font-semibold"
              >
                ← Previous
              </button>

              {/* Dots */}
              <div className="flex gap-2">
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTestimonial(i)}
                    className="rounded-full transition-all"
                    style={{
                      width: activeTestimonial === i ? 24 : 8,
                      height: 8,
                      backgroundColor: activeTestimonial === i ? "#f97316" : "#e5e7eb",
                    }}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors text-sm font-semibold"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 9. FOOTBALL ACADEMY BAND ═════════════════════════════════════ */}
      <section
        className="py-16 md:py-20 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 60%, #0ea5e9 100%)" }}
      >
        <div className="absolute inset-0 opacity-10"
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
                to tell every player's story.
              </h2>
              <p className="text-blue-100 text-lg leading-relaxed mb-4">
                Once your academy is signed, we set up a staff portal. Coaches register players, players complete their journey questionnaire, and our team crafts a personalised story for each one.
              </p>
              <p className="text-blue-200 text-sm leading-relaxed mb-8">
                Only 0.5% of academy players reach professional football. The gap is mental. Our stories close it — in a format young players actually love.
              </p>
              <Link
                href="/for-academies"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-blue-900 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all text-base"
              >
                Learn about the Academy Programme →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { num: "42+", label: "Partner academies" },
                { num: "0.5%", label: "Reach professional football" },
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

      {/* ══ 10. DIVERSITY MOMENTS ════════════════════════════════════════ */}
      <section className="py-14 md:py-20" style={{ background: "#fef9f0" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src={publicAssetUrl("images/family-diversity-collage.png")}
                alt="Diverse families reading Me Time Stories books together"
                className="w-full rounded-3xl shadow-2xl object-cover"
                style={{ maxHeight: 420 }}
              />
            </div>
            <div>
              <span className="inline-block bg-purple-100 text-purple-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
                Every family. Every child.
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mb-5 leading-tight">
                Stories that celebrate every child's world — whoever they are.
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                Whether it's bedtime in a tent under fairy lights, an afternoon in the garden, or storytime on the sofa — our books belong in every home and celebrate every family.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  "Diverse representation, authentically illustrated",
                  "Stories in multiple languages available",
                  "Cultural traditions celebrated, not tokenised",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-gray-700 text-sm">
                    <span className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-xs flex-shrink-0">✓</span>
                    {item}
                  </div>
                ))}
              </div>
              <Link
                href="/characters/create"
                className="inline-flex items-center gap-2 px-7 py-4 font-bold rounded-xl text-white shadow-md hover:shadow-lg transition-all hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
              >
                Start your child's story →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 11. ILLUSTRATORS ═════════════════════════════════════════════ */}
      <section className="py-14 md:py-20" style={{ background: "#fef3e2" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-amber-200 text-amber-800 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
                <i className="ri-pen-nib-line"></i> For Authors & Illustrators
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mb-5 leading-tight">
                Talented storytellers create the worlds. We personalise them for every child.
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6 text-base">
                We partner with professional children's book authors and illustrators. They craft the stories and artwork — we then personalise them deeply for every individual child.
              </p>
              <Link
                href="/for-authors"
                className="inline-flex items-center gap-2 px-7 py-3.5 font-bold rounded-xl text-white shadow-md hover:shadow-lg transition-all hover:scale-[1.02]"
                style={{ backgroundColor: "#d97706" }}
              >
                Partner with us →
              </Link>
            </div>
            <div>
              <img
                src={publicAssetUrl("images/illustrator.png")}
                alt="Illustrator creating a character for a Me Time Stories book"
                className="w-full rounded-3xl object-cover shadow-xl"
                style={{ maxHeight: 380 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══ 12. FINAL CTA ════════════════════════════════════════════════ */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <img
          src={publicAssetUrl("images/family-fireplace.png")}
          alt="Family reading by fireplace at bedtime"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center 20%" }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(12,8,4,0.90) 0%, rgba(12,8,4,0.72) 100%)" }} />
        <div className="relative max-w-2xl mx-auto px-4 text-center">
          <div className="text-6xl mb-5">🌙</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-5 leading-tight" style={{ color: "#fef3e2" }}>
            Start the adventure tonight.
          </h2>
          <p className="text-lg mb-10 leading-relaxed" style={{ color: "rgba(254,243,226,0.65)" }}>
            Build your child's character in 2 minutes. Read their personalised version of The Time-Travelling Tractor — free — and discover the magic of hearing "Look Mum, that's me!"
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/characters/create"
              className="flex items-center justify-center gap-2 px-9 py-4 font-bold text-lg rounded-xl shadow-2xl transition-all hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#1a0800" }}
            >
              ✨ Build Their Character
            </Link>
            <Link
              href="/stories/time-travelling-tractor"
              className="flex items-center justify-center gap-2 px-9 py-4 border font-semibold text-lg rounded-xl transition-all hover:bg-white/10"
              style={{ borderColor: "rgba(254,243,226,0.30)", color: "#fef3e2", background: "rgba(255,255,255,0.08)" }}
            >
              🚜 Try the Free Story
            </Link>
          </div>
        </div>
      </section>

    </PublicLayout>
  );
}
