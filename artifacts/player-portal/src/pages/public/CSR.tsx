import { useState } from "react";
import { Link } from "wouter";
import { PublicLayout } from "@/layouts/PublicLayout";
import { publicAssetUrl } from "@/lib/publicAssetUrl";
import { useChildName } from "@/contexts/ChildNameContext";

export default function CSR() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const { childName } = useChildName();
  const childLabel = childName || "Rose";
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <PublicLayout>

      {/* ══ HERO ════════════════════════════════════════════════════════════ */}
      <section className="relative py-28 md:py-36 overflow-hidden" style={{ background: "linear-gradient(135deg, #100a04 0%, #1a0c04 60%, #0e0702 100%)" }}>

        {/* Partial-image background — right side, full image, no cuts */}
        <div className="absolute inset-y-0 right-0 pointer-events-none select-none hidden md:block" style={{ width: "44%" }}>
          <img src={publicAssetUrl("images/family-diversity-collage.png")} alt="" aria-hidden="true"
            className="h-full w-full" style={{ objectFit: "cover", objectPosition: "center top", opacity: 0.35 }} />
        </div>
        <div className="absolute inset-y-0 right-0 pointer-events-none hidden md:block"
          style={{ width: "44%", background: "linear-gradient(to right, #100a04 0%, rgba(16,10,4,0.5) 50%, transparent 100%)" }} />
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/3 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(249,115,22,0.08) 0%, transparent 70%)", transform: "translate(-50%,-50%)" }} />

        <div className="max-w-6xl mx-auto px-4 relative">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-8"
              style={{ background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.25)", color: "#fb923c" }}>
              <i className="ri-building-2-line"></i> Community &amp; Corporate Partnerships
            </span>
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-[1.05]" style={{ color: "#fef3e2" }}>
              Story is how a child first understands{" "}
              <span style={{ color: "#fbbf24" }}>who they are in the world.</span>
            </h1>
            <p className="text-lg md:text-xl leading-relaxed mb-4" style={{ color: "rgba(254,243,226,0.72)" }}>
              Too many children have never opened a book and seen themselves on the page — their name, their family, their community, their culture — reflected back at them with pride.
            </p>
            <p className="text-base leading-relaxed mb-10" style={{ color: "rgba(254,243,226,0.50)" }}>
              Me Time Stories creates deeply personalised, identity-affirming story experiences where a named child becomes the hero. Our CSR partnerships deliver these into schools, community organisations, and underserved groups — in ways that are meaningful, visible, and genuinely measurable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#enquire"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 font-bold rounded-xl text-base hover:scale-[1.02] transition-all shadow-lg"
                style={{ background: "linear-gradient(135deg,#f97316,#fbbf24)", color: "#1a0800" }}>
                Begin a partnership conversation
              </a>
              <a href="#why-partner"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border font-semibold rounded-xl text-base transition-colors hover:bg-white/05"
                style={{ borderColor: "rgba(254,243,226,0.20)", color: "#fef3e2" }}>
                Why partner with us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══ THE HUMAN TRUTH ═════════════════════════════════════════════════ */}
      <section className="py-16 md:py-20" style={{ background: "#fef9f0" }}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6"
                style={{ background: "rgba(249,115,22,0.10)", border: "1px solid rgba(249,115,22,0.22)", color: "#c2410c" }}>
                The problem we're solving
              </span>
              <h2 className="text-3xl font-bold leading-tight mb-5" style={{ color: "#1c0a00" }}>
                Millions of children still do not see themselves in story.
              </h2>
              <p className="leading-relaxed mb-4" style={{ color: "#374151" }}>
                Representation in children's publishing has improved — but it remains shallow. A character with a similar skin tone is not the same as a story built around your child's name, their personality, their family, and their world.
              </p>
              <p className="leading-relaxed" style={{ color: "#6b7280" }}>
                For children in underserved communities — where books are scarce and personalised experiences are rare — the gap is even wider. Your partnership can close it.
              </p>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-xl">
              <img src={publicAssetUrl("images/book-likeness.png")}
                alt="A child seeing themselves in a personalised Me Time Stories book"
                className="w-full h-full object-cover" style={{ maxHeight: 380 }} />
            </div>
          </div>
        </div>
      </section>

      {/* ══ THE MTS DIFFERENCE ══════════════════════════════════════════════ */}
      <section className="py-16 md:py-20 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #fff8f0 0%, #fffbf5 100%)" }}>
        <div className="max-w-5xl mx-auto px-4 text-center mb-12">
          <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5"
            style={{ background: "rgba(249,115,22,0.10)", border: "1px solid rgba(249,115,22,0.22)", color: "#c2410c" }}>
            What makes this different
          </span>
          <h2 className="text-3xl font-bold mb-4" style={{ color: "#1c0a00" }}>
            A named child. Not an anonymous impression.
          </h2>
          <p className="text-base max-w-2xl mx-auto" style={{ color: "#374151" }}>
            When a child opens a Me Time Stories book and sees their own name woven through every page — not just printed on a label — something shifts. Reading becomes personal. Confidence grows. Story becomes theirs.
          </p>
        </div>
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: "ri-user-heart-line",
                title: "Their name. Their story.",
                body: "We don't stamp a name on a cover. The child's name is woven meaningfully through the narrative — they are the character, the hero, the one the story is about.",
                color: "#f97316",
              },
              {
                icon: "ri-community-line",
                title: "Culturally rooted.",
                body: "Our stories reflect real communities, real traditions, and real family life. We work with authors and illustrators who understand the cultures they represent.",
                color: "#8b5cf6",
              },
              {
                icon: "ri-file-chart-line",
                title: "Measurably delivered.",
                body: "Every partnership comes with an impact report — who received stories, in which communities, and what outcomes were reported by schools and families.",
                color: "#059669",
              },
            ].map(({ icon, title, body, color }) => (
              <div key={title} className="rounded-2xl p-7 bg-white shadow-sm hover:-translate-y-1 hover:shadow-md transition-all"
                style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-5"
                  style={{ background: `${color}14`, border: `1px solid ${color}28`, color }}>
                  <i className={icon}></i>
                </div>
                <h3 className="font-bold text-base mb-2" style={{ color: "#1c0a00" }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#4b5563" }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ WHY PARTNER ══════════════════════════════════════════════════════ */}
      <section id="why-partner" className="py-16 md:py-24" style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 100%)" }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5"
              style={{ background: "rgba(99,102,241,0.10)", border: "1px solid rgba(99,102,241,0.22)", color: "#4338ca" }}>
              Why partner with us
            </span>
            <h2 className="text-3xl font-bold mb-3" style={{ color: "#1e1b4b" }}>
              Five reasons this partnership is different.
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: "#4b5563" }}>
              Not just a logo on a page. Not just a donation receipt. A partnership with real meaning, real visibility, and real outcomes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5 mb-5">
            {[
              {
                icon: "ri-user-smile-line",
                title: "A named child, not an anonymous impression",
                body: "Your investment reaches real, named children — not a faceless headcount. Every story delivered is a personalised experience belonging to one specific child. That is a different kind of impact.",
                color: "#f97316",
              },
              {
                icon: "ri-heart-add-line",
                title: "Belonging through story",
                body: "When a child sees their own name, their family structure, their cultural heritage reflected in a story — they feel like they belong in literature, and that belonging extends outward. Your partnership funds that moment.",
                color: "#e11d48",
              },
            ].map(({ icon, title, body, color }) => (
              <div key={title} className="rounded-2xl p-7 bg-white shadow-sm hover:shadow-md transition-all"
                style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: `${color}12`, border: `1px solid ${color}25`, color }}>
                    <i className={icon}></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-base mb-2" style={{ color: "#1e1b4b" }}>{title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#4b5563" }}>{body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: "ri-earth-line",
                title: "Culturally relevant and community-rooted",
                body: "We design campaigns that reflect the actual communities they reach. Not a universal template. Not parachuted in. Stories that belong where they land.",
                color: "#059669",
              },
              {
                icon: "ri-bar-chart-grouped-line",
                title: "Built for measurable delivery",
                body: "Schools, councils, and corporate teams receive full impact documentation — suitable for ESG reporting, B Corp assessments, and internal stakeholder communications.",
                color: "#2563eb",
              },
              {
                icon: "ri-megaphone-line",
                title: "A partner story worth telling",
                body: "We help you articulate what your organisation stood for — through case studies, press, and co-branded content that resonates with employees and stakeholders alike.",
                color: "#7c3aed",
              },
            ].map(({ icon, title, body, color }) => (
              <div key={title} className="rounded-2xl p-7 bg-white shadow-sm hover:shadow-md transition-all"
                style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-lg mb-4"
                  style={{ background: `${color}12`, border: `1px solid ${color}25`, color }}>
                  <i className={icon}></i>
                </div>
                <h3 className="font-bold text-base mb-2" style={{ color: "#1e1b4b" }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#4b5563" }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ ROSE GOES TO MO'S BBQ — FEATURED CAMPAIGN ═══════════════════════ */}
      <section className="py-20 md:py-32 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1c0800 0%, #2d1000 50%, #1a0600 100%)" }}>

        {/* ── Cover image — right side, full bleed, partial-image pattern ─── */}
        <img
          src={publicAssetUrl("images/rose-goes-cover.png")}
          alt="Families gathering and celebrating — the spirit of Rose Goes to Mo's BBQ"
          aria-hidden="true"
          className="hidden md:block absolute top-0 right-0 h-full pointer-events-none select-none"
          style={{ width: "50%", objectFit: "cover", objectPosition: "left center" }}
        />
        {/* Gradient fade: dark background fades right over the image */}
        <div className="hidden md:block absolute top-0 right-0 h-full pointer-events-none"
          style={{ width: "55%", background: "linear-gradient(to right, #1c0800 0%, #1c0800 18%, rgba(28,8,0,0.88) 40%, rgba(28,8,0,0.30) 72%, transparent 100%)" }} />

        {/* Warm ambient glows */}
        <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(249,115,22,0.07) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(251,191,36,0.05) 0%, transparent 70%)" }} />

        <div className="max-w-6xl mx-auto px-4 relative">
          <div className="md:max-w-[52%]">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-8"
              style={{ background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.25)", color: "#fbbf24" }}>
              <i className="ri-star-smile-line"></i> Featured Campaign
            </span>
            <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight" style={{ color: "#fef3e2" }}>
              Rose Goes to<br />
              <span style={{ color: "#fbbf24" }}>Mo's BBQ</span>
            </h2>
            <p className="text-lg leading-relaxed mb-5" style={{ color: "rgba(254,243,226,0.85)" }}>
              Our Eid community campaign — a story about family gathering, cultural pride, generosity, and the joy of celebration, told through a child who shares a name and a heritage with the reader.
            </p>
            <p className="leading-relaxed mb-5" style={{ color: "rgba(254,243,226,0.60)" }}>
              When {childLabel} arrives at Mo's BBQ, the courtyard is full of cousins, the smell of spiced lamb fills the air, and the whole community has gathered to celebrate. The story captures what Eid really feels like from a child's perspective — not a description of a holiday, but a memory waiting to be made.
            </p>
            <p className="leading-relaxed mb-8" style={{ color: "rgba(254,243,226,0.60)" }}>
              Councils, housing associations, schools, and community organisations have partnered with us to bring this campaign to Muslim families who rarely see their celebrations reflected in children's literature. The child's own name replaces "Rose" — making the story truly theirs.
            </p>

            {/* Story excerpt pull-quote */}
            <div className="mb-8 p-5 rounded-2xl" style={{ background: "rgba(0,0,0,0.35)", borderLeft: "3px solid #fbbf24" }}>
              <p className="text-sm italic leading-relaxed mb-2" style={{ color: "rgba(254,243,226,0.85)", fontFamily: "Georgia, serif" }}>
                "The smell of cumin and charcoal drifted across the yard.{" "}
                <span style={{ color: "#fbbf24" }}>{childLabel}</span>{" "}
                squeezed through the gate and felt the warmth before she even reached the fire…"
              </p>
              <p className="text-xs font-semibold" style={{ color: "rgba(254,243,226,0.35)" }}>
                From Rose Goes to Mo's BBQ — replace "Rose" with any child's name
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {["Eid celebration", "Family & belonging", "Cultural representation", "Community delivery", "Named-child personalisation"].map(t => (
                <span key={t} className="text-xs font-medium px-3 py-1 rounded-full"
                  style={{ background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.22)", color: "#fbbf24" }}>{t}</span>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/eid-story"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 font-bold rounded-xl text-sm hover:scale-[1.02] transition-all"
                style={{ background: "linear-gradient(135deg,#f97316,#fbbf24)", color: "#1a0800" }}>
                <i className="ri-book-open-line"></i> Read the story
              </Link>
              <a href="#enquire"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border font-semibold rounded-xl text-sm transition-colors"
                style={{ borderColor: "rgba(254,243,226,0.25)", color: "#fef3e2" }}>
                Sponsor this campaign
              </a>
            </div>
          </div>
        </div>

        {/* Eid Campaign badge — mobile, shown below content */}
        <div className="md:hidden flex justify-center mt-10">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-center shadow-xl"
            style={{ background: "linear-gradient(135deg,#f97316,#fbbf24)" }}>
            <div>
              <div className="text-xs font-black text-amber-900 leading-tight">Eid</div>
              <div className="text-[10px] font-bold text-amber-900 leading-tight">Campaign</div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ WHAT YOUR PARTNERSHIP ENABLES ═══════════════════════════════════ */}
      <section className="py-16 md:py-24" style={{ background: "#fef9f0" }}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5"
              style={{ background: "rgba(249,115,22,0.10)", border: "1px solid rgba(249,115,22,0.22)", color: "#c2410c" }}>
              Outcomes
            </span>
            <h2 className="text-3xl font-bold mb-3" style={{ color: "#1c0a00" }}>What your partnership enables.</h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: "#6b7280" }}>
              Beyond the book. The outcomes that matter to children, families, schools, and communities.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: "ri-shield-star-line", label: "Belonging", body: "Children who see their name, family, and culture in story feel a sense of belonging in the world of books — and beyond it.", color: "#e11d48" },
              { icon: "ri-seedling-line", label: "Confidence", body: "Being the hero of your own story builds self-worth. We hear this from teachers and parents consistently — the child carries the book with pride.", color: "#059669" },
              { icon: "ri-book-open-line", label: "Literacy motivation", body: "Personalised engagement dramatically increases reading motivation. Children re-read their story. They ask for it at bedtime. That habit builds.", color: "#2563eb" },
              { icon: "ri-globe-line", label: "Inclusion", body: "We reach communities invisible in mainstream publishing. Stories that reflect who you actually are — not a token character in someone else's narrative.", color: "#7c3aed" },
              { icon: "ri-parent-line", label: "Family engagement", body: "When a story speaks directly to a child's name and culture, parents engage more deeply with reading at home. The impact reaches the whole family.", color: "#d97706" },
              { icon: "ri-award-line", label: "Culturally meaningful storytelling", body: "We work with authors and illustrators who understand cultural nuance. These are not generic stories with diverse cover art — they are rooted in real communities.", color: "#f97316" },
            ].map(({ icon, label, body, color }) => (
              <div key={label} className="rounded-2xl p-6 bg-white hover:shadow-md transition-all"
                style={{ border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base mb-4"
                  style={{ background: `${color}12`, border: `1px solid ${color}25`, color }}>
                  <i className={icon}></i>
                </div>
                <h3 className="font-bold text-sm mb-2" style={{ color: "#1c0a00" }}>{label}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "#4b5563" }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PARTNERSHIP TIERS ════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24" style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 100%)" }}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5"
              style={{ background: "rgba(99,102,241,0.10)", border: "1px solid rgba(99,102,241,0.22)", color: "#4338ca" }}>
              Partnership levels
            </span>
            <h2 className="text-3xl font-bold mb-3" style={{ color: "#1e1b4b" }}>Three ways to partner.</h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: "#4b5563" }}>
              Each level is designed to deliver genuine, visible, and meaningful impact — not just a transaction.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                tier: "Community Spark",
                price: "from £2,500",
                tagline: "Seed a story experience in one community.",
                color: "#059669",
                features: [
                  "50 named-child personalised stories",
                  "Placed into one school or community group",
                  "Impact report on delivery and reach",
                  "Partner credit on our website and comms",
                  "Suitable for: local businesses, foundations, community-minded brands",
                ],
              },
              {
                tier: "Partnership Reach",
                price: "from £7,500",
                tagline: "A co-branded campaign across multiple communities.",
                color: "#4338ca",
                popular: true,
                features: [
                  "200 personalised stories across 3 placements",
                  "Co-branded community campaign materials",
                  "Detailed impact case study and photography",
                  "Co-branded press release and social content",
                  "Employee engagement session with your team",
                  "Suitable for: corporate CSR teams, councils, housing associations",
                ],
              },
              {
                tier: "Strategic Alliance",
                price: "Bespoke",
                tagline: "A long-term, nationally-scaled partnership.",
                color: "#1e1b4b",
                features: [
                  "Unlimited stories across a programme period",
                  "Dedicated partnership manager",
                  "Custom campaign design and story development",
                  "ESG-ready full reporting suite",
                  "Joint award nomination strategy",
                  "Suitable for: national brands, foundations, government-backed initiatives",
                ],
              },
            ].map(({ tier, price, tagline, color, popular, features }) => (
              <div key={tier} className="rounded-3xl p-7 flex flex-col"
                style={{
                  background: popular ? `linear-gradient(135deg, ${color}08 0%, white 100%)` : "white",
                  border: popular ? `2px solid ${color}` : "1px solid rgba(0,0,0,0.08)",
                  boxShadow: popular ? `0 8px 40px ${color}18` : "0 2px 12px rgba(0,0,0,0.04)",
                }}>
                {popular && (
                  <span className="text-xs font-bold text-white px-3 py-1 rounded-full self-start mb-4"
                    style={{ background: color }}>
                    Most requested
                  </span>
                )}
                <h3 className="text-xl font-black mb-1" style={{ color: "#1e1b4b" }}>{tier}</h3>
                <p className="text-lg font-bold mb-2" style={{ color }}>{price}</p>
                <p className="text-xs italic mb-5 pb-5 border-b border-gray-100" style={{ color: "#6b7280" }}>{tagline}</p>
                <ul className="space-y-3 flex-1">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm" style={{ color: "#374151" }}>
                      <i className="ri-check-line flex-shrink-0 mt-0.5 font-bold" style={{ color }}></i>
                      {f}
                    </li>
                  ))}
                </ul>
                <a href="#enquire"
                  className="mt-6 block text-center py-3.5 font-bold rounded-xl text-sm transition-all hover:scale-[1.02]"
                  style={popular
                    ? { background: `linear-gradient(135deg, ${color}, #6d28d9)`, color: "white" }
                    : { background: `${color}0e`, color, border: `1.5px solid ${color}30` }}>
                  Start a conversation
                </a>
              </div>
            ))}
          </div>

          <p className="text-center text-xs mt-8" style={{ color: "#9ca3af" }}>
            All tiers are tailored to your organisation's goals and the communities you want to reach. Prices are indicative — final proposals are bespoke.
          </p>
        </div>
      </section>

      {/* ══ NURSERY PROOF MOMENT ════════════════════════════════════════════ */}
      <section className="py-16 md:py-20 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #100a04 0%, #1a0c04 100%)" }}>
        {/* Partial nursery photo — right side */}
        <div className="absolute inset-y-0 right-0 pointer-events-none select-none hidden md:block" style={{ width: "40%" }}>
          <img src={publicAssetUrl("images/lily-pad-nursery.png")} alt="" aria-hidden="true"
            className="h-full w-full" style={{ objectFit: "contain", objectPosition: "right center" }} />
        </div>
        <div className="absolute inset-y-0 right-0 pointer-events-none hidden md:block"
          style={{ width: "40%", background: "linear-gradient(to right, #100a04 0%, rgba(16,10,4,0.4) 45%, transparent 100%)" }} />

        <div className="max-w-5xl mx-auto px-4 relative">
          <div className="max-w-2xl">
            <div className="text-4xl mb-6" style={{ color: "rgba(251,191,36,0.4)" }}>"</div>
            <blockquote className="text-xl md:text-2xl font-medium leading-relaxed mb-6 italic"
              style={{ color: "#fef3e2", fontFamily: "Georgia, serif" }}>
              My daughter kept pointing at the page saying 'Mum, that's MY name!' It was the most engaged I've ever seen her with a book. She asked for it three times in a row.
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0"
                style={{ background: "rgba(249,115,22,0.20)", border: "1px solid rgba(249,115,22,0.30)", color: "#fb923c" }}>
                P
              </div>
              <div>
                <p className="font-bold text-sm" style={{ color: "#fef3e2" }}>Priya S.</p>
                <p className="text-xs" style={{ color: "rgba(254,243,226,0.45)" }}>Parent, Lily Pad Nursery — community story session</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ ENQUIRY FORM ════════════════════════════════════════════════════ */}
      <section id="enquire" className="py-16 md:py-24" style={{ background: "#fef9f0" }}>
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5"
              style={{ background: "rgba(249,115,22,0.10)", border: "1px solid rgba(249,115,22,0.22)", color: "#c2410c" }}>
              Let's begin
            </span>
            <h2 className="text-3xl font-bold mb-4" style={{ color: "#1c0a00" }}>Let's begin a conversation.</h2>
            <p className="leading-relaxed" style={{ color: "#4b5563" }}>
              Great partnerships start with curiosity, not a sales pitch. Tell us about your organisation, the communities you want to reach, and what meaningful impact looks like for you. We'll respond within 2 business days.
            </p>
          </div>

          {formSubmitted ? (
            <div className="bg-white rounded-3xl p-12 text-center shadow-sm" style={{ border: "1px solid rgba(0,0,0,0.07)" }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-5"
                style={{ background: "rgba(5,150,105,0.10)", border: "1px solid rgba(5,150,105,0.22)", color: "#059669" }}>
                <i className="ri-check-line"></i>
              </div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: "#1c0a00" }}>Thank you — we'll be in touch.</h3>
              <p style={{ color: "#4b5563" }}>We've received your enquiry and look forward to beginning this conversation. Expect to hear from us within 2 business days.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-sm space-y-4"
              style={{ border: "1px solid rgba(0,0,0,0.07)" }}>
              <div className="grid grid-cols-2 gap-4">
                <input required
                  className="col-span-2 sm:col-span-1 w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all"
                  style={{ border: "1px solid #e5e7eb", background: "#fafafa" }}
                  placeholder="Your name" />
                <input required type="email"
                  className="col-span-2 sm:col-span-1 w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all"
                  style={{ border: "1px solid #e5e7eb", background: "#fafafa" }}
                  placeholder="Work email" />
              </div>
              <input required
                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all"
                style={{ border: "1px solid #e5e7eb", background: "#fafafa" }}
                placeholder="Organisation name" />
              <select required
                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all bg-white"
                style={{ border: "1px solid #e5e7eb", background: "#fafafa" }}>
                <option value="">What type of organisation are you?</option>
                <option>Corporate — CSR / ESG programme</option>
                <option>Local authority or council</option>
                <option>Housing association</option>
                <option>Foundation or charitable trust</option>
                <option>School or academy trust</option>
                <option>Community organisation</option>
                <option>Other</option>
              </select>
              <input
                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all"
                style={{ border: "1px solid #e5e7eb", background: "#fafafa" }}
                placeholder="Communities or areas you'd like to reach (optional)" />
              <select
                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all bg-white"
                style={{ border: "1px solid #e5e7eb", background: "#fafafa" }}>
                <option value="">Partnership level of interest (optional)</option>
                <option>Community Spark — from £2,500</option>
                <option>Partnership Reach — from £7,500</option>
                <option>Strategic Alliance — bespoke</option>
                <option>Not sure yet — happy to discuss</option>
              </select>
              <textarea rows={4}
                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all resize-none"
                style={{ border: "1px solid #e5e7eb", background: "#fafafa" }}
                placeholder="Tell us about your goals and the communities you'd like to reach. What does meaningful impact look like for your organisation?" />
              <button type="submit"
                className="w-full py-4 font-bold rounded-xl text-base hover:scale-[1.01] transition-all shadow-md"
                style={{ background: "linear-gradient(135deg,#f97316,#fbbf24)", color: "#1a0800" }}>
                Begin the conversation
              </button>
              <p className="text-center text-xs" style={{ color: "#9ca3af" }}>
                We reply within 2 business days. No sales pressure, no unsolicited follow-up.
              </p>
            </form>
          )}
        </div>
      </section>

    </PublicLayout>
  );
}
