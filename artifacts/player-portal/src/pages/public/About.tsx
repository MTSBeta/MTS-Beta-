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
      <section className="py-16 md:py-20 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #fff8f0 0%, #fffbf5 100%)" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-sm font-medium px-4 py-1.5 rounded-full mb-6"
                style={{ background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.25)", color: "#c2410c" }}>
                ✨ Why we do it
              </span>
              <h2 className="text-3xl font-bold mb-5 leading-tight" style={{ color: "#1c0a00" }}>
                The moment a child points at the page and says — "That's me!"
              </h2>
              <p className="text-lg leading-relaxed mb-5" style={{ color: "#374151" }}>
                We started because a dad noticed his daughter would skip past books where none of the characters looked like her. So he set out to change that — not just for representation, but for deep, whole-child personalisation.
              </p>
              <p className="leading-relaxed mb-8" style={{ color: "#6b7280", fontSize: 15 }}>
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

      {/* ── Meet the Founders ────────────────────────────────────────── */}
      <section className="py-16 md:py-20" style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 100%)" }}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="inline-block text-sm font-medium px-4 py-1.5 rounded-full mb-4"
              style={{ background: "rgba(99,102,241,0.10)", border: "1px solid rgba(99,102,241,0.22)", color: "#4338ca" }}>
              The Team
            </span>
            <h2 className="text-3xl font-bold mb-3" style={{ color: "#1e1b4b" }}>Meet the Founders</h2>
            <p className="text-base max-w-lg mx-auto" style={{ color: "#64748b" }}>
              We share our journey in real time on LinkedIn — follow us for the latest news, partnerships, and behind-the-scenes updates.
            </p>
          </div>

          {/* Founders */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {[
              {
                name: "Taku Chiweshe",
                role: "CEO & Co-Founder",
                tags: ["Innovation", "Product Vision", "Strategic Management", "Partnerships", "Business Development", "Platform Direction"],
                bio: "Passionate about using storytelling and technology to put every child at the centre of their own world. Leads academy partnerships, platform direction, and the overall vision behind Me Time Stories.",
                email: "taku@metimestories.co.uk",
                linkedin: "https://www.linkedin.com/in/taku-chiweshe-a342a1324/",
                initials: "TC",
                photo: "images/team-taku.jpg",
                color: "#f97316",
              },
              {
                name: "Michael McDermott",
                role: "Creative Director, Author & Co-Founder",
                tags: ["Creative Development", "Story Library", "Content Management", "Story Architecture", "Editorial Direction"],
                bio: "Creates the stories that make children point at the page and say 'That's me!' — building the narrative frameworks, story architecture, and editorial direction behind every Me Time Story.",
                email: "michael@metimestories.co.uk",
                linkedin: "https://www.linkedin.com/in/michael-mcdermott-477a83230/",
                initials: "MM",
                photo: "images/team-michael.jpeg",
                color: "#fbbf24",
              },
            ].map(({ name, role, bio, email, linkedin, initials, color, tags, photo }) => (
              <div key={name} className="rounded-3xl p-7 flex flex-col gap-5" style={{ background: "white", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
                <div className="flex items-center gap-4">
                  {photo ? (
                    <img src={publicAssetUrl(photo)} alt={name}
                      className="w-16 h-16 rounded-2xl object-cover flex-shrink-0"
                      style={{ border: `1.5px solid ${color}50` }} />
                  ) : (
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${color}25, ${color}10)`, border: `1.5px solid ${color}40`, color }}>
                    {initials}
                  </div>
                  )}
                  <div>
                    <h3 className="text-lg font-bold" style={{ color: "#1e1b4b" }}>{name}</h3>
                    <p className="text-sm font-semibold" style={{ color }}>{role}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map(t => (
                    <span key={t} className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: `${color}14`, color, border: `1px solid ${color}28` }}>{t}</span>
                  ))}
                </div>
                <p className="text-sm leading-relaxed flex-1" style={{ color: "#4b5563" }}>{bio}</p>
                <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
                  <a href={`mailto:${email}`} className="flex items-center gap-2 text-sm transition-colors hover:opacity-80" style={{ color: "#6b7280" }}>
                    <i className="ri-mail-line" style={{ color }}></i> {email}
                  </a>
                  <a href={linkedin} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-[1.02] self-start"
                    style={{ background: "rgba(10,102,194,0.10)", border: "1px solid rgba(10,102,194,0.25)", color: "#1d4ed8" }}>
                    <i className="ri-linkedin-fill"></i> Follow on LinkedIn
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Technical / Development Support */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px flex-1" style={{ background: "rgba(0,0,0,0.08)" }} />
              <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                style={{ background: "rgba(139,92,246,0.10)", border: "1px solid rgba(139,92,246,0.22)", color: "#6d28d9" }}>
                Technical &amp; Development Support
              </span>
              <div className="h-px flex-1" style={{ background: "rgba(0,0,0,0.08)" }} />
            </div>

            {/* Academic Lead */}
            <div className="rounded-2xl p-6 mb-4" style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.15)" }}>
              <div className="flex items-start gap-4">
                <img src={publicAssetUrl("images/team-hussain.png")} alt="Dr Ambreen Hussain"
                  className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                  style={{ border: "1px solid rgba(139,92,246,0.35)" }} />
                <div className="flex-1">
                  <div className="flex flex-wrap items-baseline gap-2 mb-1">
                    <h4 className="font-bold" style={{ color: "#1e1b4b" }}>Dr Ambreen Hussain</h4>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(139,92,246,0.12)", color: "#6d28d9" }}>Academic Lead</span>
                  </div>
                  <p className="text-xs mb-2" style={{ color: "#6b7280" }}>Lecturer in Computing, Birmingham City University</p>
                  <div className="flex flex-wrap gap-1.5">
                    {["Technical Advisor", "Academic Lead", "Overseeing Development Team"].map(t => (
                      <span key={t} className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(139,92,246,0.07)", color: "#7c3aed", border: "1px solid rgba(139,92,246,0.15)" }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Dev students */}
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { initials: "HA", name: "Hafeez Abdul", focus: "Cyber Security" },
                { initials: "MM", name: "Mohsin Mirza",  focus: "Database" },
              ].map(({ initials, name, focus }) => (
                <div key={name} className="rounded-2xl p-5 flex items-center gap-4"
                  style={{ background: "white", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
                    style={{ background: "rgba(99,102,241,0.10)", border: "1px solid rgba(99,102,241,0.22)", color: "#4338ca" }}>
                    {initials}
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: "#1e1b4b" }}>{name}</p>
                    <p className="text-xs" style={{ color: "#6b7280" }}>Platform Development · {focus}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Advisors */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px flex-1" style={{ background: "rgba(0,0,0,0.08)" }} />
              <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                style={{ background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.30)", color: "#92400e" }}>
                Advisors
              </span>
              <div className="h-px flex-1" style={{ background: "rgba(0,0,0,0.08)" }} />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              {[
                {
                  initials: "LC",
                  name: "Louise Campton",
                  org: "CEO, Primary Goal",
                  tags: ["Business Advisory", "Leadership Support"],
                  color: "#059669",
                },
                {
                  initials: "RH",
                  name: "Ryan Howard",
                  org: "U9s Coach, Nottingham Forest FC · formerly Wolves U14s",
                  tags: ["Football Academy Insight", "Player Development", "Positional Understanding", "Academy Relevance"],
                  color: "#d97706",
                },
                {
                  initials: "SZ",
                  name: "Syneus Zidner",
                  org: "CEO, Solute Tech Ltd",
                  tags: ["Technology Advisory", "Business Advisory"],
                  color: "#2563eb",
                },
              ].map(({ initials, name, org, tags, color }) => (
                <div key={name} className="rounded-2xl p-5 flex flex-col gap-3"
                  style={{ background: "white", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
                      style={{ background: `${color}14`, border: `1px solid ${color}30`, color }}>
                      {initials}
                    </div>
                    <div>
                      <p className="font-bold text-sm" style={{ color: "#1e1b4b" }}>{name}</p>
                      <p className="text-[11px] leading-tight" style={{ color: "#6b7280" }}>{org}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {tags.map(t => (
                      <span key={t} className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                        style={{ background: `${color}10`, color, border: `1px solid ${color}22` }}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact strip */}
          <div className="rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-5"
            style={{ background: "linear-gradient(135deg, #fff7ed 0%, #fef3e2 100%)", border: "1px solid rgba(249,115,22,0.20)" }}>
            <div>
              <p className="font-bold mb-1" style={{ color: "#1c0a00" }}>Get in touch directly</p>
              <p className="text-sm" style={{ color: "#92400e" }}>We reply within 2 business days and love hearing from families, academies, and partners.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <a href="tel:+447402256217"
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
                style={{ background: "white", border: "1px solid rgba(249,115,22,0.25)", color: "#374151" }}>
                <i className="ri-phone-line" style={{ color: "#f97316" }}></i> 07402 256 217
              </a>
              <a href="mailto:taku@metimestories.co.uk"
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg,#f97316,#fbbf24)", color: "#1a0800" }}>
                <i className="ri-mail-send-line"></i> Email Us
              </a>
            </div>
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

      {/* ── Lily Pad Nursery Partnership ─────────────────────────────── */}
      <section className="py-16 md:py-20" style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #f0fdfa 100%)" }}>
        <div className="max-w-6xl mx-auto px-4">

          {/* Heading */}
          <div className="text-center mb-12">
            <span className="inline-block text-sm font-medium px-4 py-1.5 rounded-full mb-4"
              style={{ background: "rgba(5,150,105,0.10)", border: "1px solid rgba(5,150,105,0.22)", color: "#047857" }}>
              Community Partnership
            </span>
            <h2 className="text-3xl font-bold mb-3" style={{ color: "#064e3b" }}>
              Lily Pad Nursery — our feedback home
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: "#374151" }}>
              We visit regularly to read with the children, test new stories, meet parents face to face, and gather the honest feedback that shapes every book we make.
            </p>
          </div>

          {/* Photo + description */}
          <div className="grid md:grid-cols-2 gap-10 items-center mb-14">
            <div className="rounded-3xl overflow-hidden shadow-xl">
              <img
                src={publicAssetUrl("images/lily-pad-nursery.png")}
                alt="Taku and Michael reading with children at Lily Pad Nursery"
                className="w-full h-full object-cover"
                style={{ maxHeight: 480 }}
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: "#064e3b" }}>
                Stories tested where it matters most — with real children
              </h3>
              <p className="leading-relaxed mb-4" style={{ color: "#374151" }}>
                Lily Pad Nursery has become a true creative partner. From our very first reading sessions, the children's reactions shaped how we write, what characters look like, and how personalisation actually feels to a three-year-old pointing at their own name on the page.
              </p>
              <p className="leading-relaxed mb-4" style={{ color: "#374151" }}>
                We're there often — for storytime, for parent feedback sessions, and for honest conversations with the nursery team about what genuinely engages young minds. It's our most important feedback loop, and we're proud to call it our community home.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Real child feedback", "Parent conversations", "Nursery teacher insights", "Story testing", "Ongoing partnership"].map(t => (
                  <span key={t} className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={{ background: "rgba(5,150,105,0.10)", border: "1px solid rgba(5,150,105,0.20)", color: "#047857" }}>{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              {
                quote: "My daughter was absolutely spellbound. She kept pointing at the page saying 'Mum, that's MY name!' It was the most engaged I've ever seen her with a book — she wanted us to read it three times in a row.",
                name: "Priya S.",
                role: "Parent, Lily Pad Nursery",
                color: "#f97316",
              },
              {
                quote: "The children were captivated from the very first page. Having their own names and little details woven into the story made storytime feel genuinely special. The whole class was buzzing for the rest of the morning.",
                name: "Miss Carter",
                role: "Nursery Teacher, Lily Pad",
                color: "#6d28d9",
              },
              {
                quote: "He's never sat still for a whole story — but he did for this one. He even brought it in to show his friends the next day and asked if he could have another one about football.",
                name: "James O.",
                role: "Parent, Lily Pad Nursery",
                color: "#2563eb",
              },
              {
                quote: "What Me Time Stories is doing is genuinely different. It's not just a name swap — the children actually feel like the hero. That depth of personalisation is rare, and I've seen first-hand the confidence it gives them.",
                name: "Ms Ahmed",
                role: "Early Years Lead, Lily Pad Nursery",
                color: "#059669",
              },
            ].map(({ quote, name, role, color }) => (
              <div key={name} className="rounded-2xl p-6 flex flex-col gap-4"
                style={{ background: "white", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                <i className="ri-double-quotes-l text-3xl" style={{ color, opacity: 0.5 }}></i>
                <p className="text-sm leading-relaxed italic flex-1" style={{ color: "#374151" }}>"{quote}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                    style={{ background: `${color}14`, color, border: `1px solid ${color}28` }}>
                    {name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: "#1e1b4b" }}>{name}</p>
                    <p className="text-xs" style={{ color: "#6b7280" }}>{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #fff7ed 0%, #fef3e2 100%)" }}>
        <div className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "radial-gradient(circle, #f97316 1px, transparent 1px)", backgroundSize: "30px 30px" }}
        />
        <div className="max-w-2xl mx-auto px-4 text-center relative">
          <div className="text-5xl mb-5">🌙</div>
          <h2 className="text-3xl font-bold mb-4" style={{ color: "#1c0a00" }}>Be part of our story.</h2>
          <p className="text-lg mb-8 leading-relaxed" style={{ color: "#92400e" }}>
            Whether you're a parent, a football academy, or a corporate partner — we'd love to work with you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/characters/create" className="flex items-center justify-center gap-2 px-8 py-4 font-bold rounded-xl hover:scale-[1.02] transition-all shadow-lg" style={{ background: "linear-gradient(135deg,#f97316,#fbbf24)", color: "#1a0800" }}>
              ✨ Build a character
            </Link>
            <Link href="/for-academies" className="flex items-center justify-center gap-2 px-8 py-4 border font-semibold rounded-xl transition-colors hover:bg-orange-50" style={{ borderColor: "rgba(249,115,22,0.35)", color: "#c2410c" }}>
              Academy partnerships
            </Link>
          </div>
        </div>
      </section>

    </PublicLayout>
  );
}
