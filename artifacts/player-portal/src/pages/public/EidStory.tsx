import { useState } from "react";
import { Link } from "wouter";
import { PublicLayout } from "@/layouts/PublicLayout";
import { useChildName } from "@/contexts/ChildNameContext";

const STORY_MOMENTS = [
  {
    label: "The Invitation",
    text: "A letter arrives through Rose's door — handwritten, with a soft pressed flower tucked inside. Mo's family is celebrating Eid, and Rose is invited to the BBQ across the road.",
    icon: "ri-mail-open-line",
    color: "#fbbf24",
  },
  {
    label: "Arriving Across the Road",
    text: "Rose steps through a gate hung with lanterns and paper stars. She smells something wonderful, hears laughter she doesn't recognise yet, and feels the particular magic of being welcomed somewhere new.",
    icon: "ri-map-pin-2-line",
    color: "#f97316",
  },
  {
    label: "What's on the Grill",
    text: "Mo's dad tends skewers over glowing coals. Rose leans in — the smoke carries the scent of spiced lamb, charred peppers, and something sweet she can't name. Mo says, \"That's the good part. You have to try it.\"",
    icon: "ri-fire-line",
    color: "#ef4444",
  },
  {
    label: "Stories by the Firelight",
    text: "As the lanterns dim and the night settles warm around them, Mo's grandmother tells a story — one that has travelled far and still holds its shape. Rose listens. She will carry this evening home with her.",
    icon: "ri-moon-line",
    color: "#a78bfa",
  },
];

const FAMILY_REASONS = [
  { icon: "ri-heart-3-line",      color: "#f97316", title: "Celebrates family and community",           body: "Warm, generous, joyful — the story wraps children in the feeling of belonging to something bigger than themselves." },
  { icon: "ri-door-open-line",    color: "#fbbf24", title: "A window into a special occasion",          body: "Eid is shown with care and warmth — never explained, always felt. Children absorb it the way all the best things are learned." },
  { icon: "ri-seedling-line",     color: "#10b981", title: "Builds curiosity and kindness",             body: "Rose's journey models how to enter a new world with open hands. The story quietly builds the habits of a generous imagination." },
  { icon: "ri-calendar-event-line", color: "#a78bfa", title: "Timely, meaningful, and lasting",        body: "Perfect for Eid week and the evenings that follow. A story families return to year after year, not just one season." },
];

export default function EidStory() {
  const { childName, setChildName } = useChildName();
  const [nameInput, setNameInput] = useState("");
  const [nameSaved, setNameSaved] = useState(false);

  const child = childName || null;

  const handleSaveName = () => {
    const trimmed = nameInput.trim();
    if (trimmed) {
      setChildName(trimmed.charAt(0).toUpperCase() + trimmed.slice(1));
      setNameSaved(true);
    }
  };

  return (
    <PublicLayout>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ minHeight: "90vh", display: "flex", alignItems: "center" }}>

        {/* Background — deep warm evening sky */}
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(160deg, #0a0f1e 0%, #12091a 35%, #1a0c08 65%, #0a0f1e 100%)" }} />

        {/* Lantern-glow orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div style={{ position: "absolute", top: "-10%", right: "10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(251,191,36,0.08) 0%, transparent 70%)" }} />
          <div style={{ position: "absolute", bottom: "0%", left: "5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(249,115,22,0.06) 0%, transparent 70%)" }} />
          <div style={{ position: "absolute", top: "20%", left: "30%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(167,139,250,0.05) 0%, transparent 70%)" }} />
        </div>

        {/* Stars */}
        <div className="absolute inset-0 pointer-events-none">
          {[
            { top: "8%",  left: "12%",  size: 2, opacity: 0.55 },
            { top: "15%", left: "72%",  size: 1.5, opacity: 0.45 },
            { top: "6%",  left: "55%",  size: 1, opacity: 0.35 },
            { top: "28%", left: "88%",  size: 2, opacity: 0.50 },
            { top: "18%", left: "38%",  size: 1, opacity: 0.30 },
            { top: "45%", left: "5%",   size: 1.5, opacity: 0.40 },
            { top: "10%", left: "92%",  size: 1, opacity: 0.25 },
          ].map((s, i) => (
            <div key={i} className="absolute rounded-full"
              style={{ top: s.top, left: s.left, width: s.size * 4, height: s.size * 4, background: `rgba(251,191,36,${s.opacity})`, boxShadow: `0 0 ${s.size * 6}px rgba(251,191,36,${s.opacity * 0.6})` }} />
          ))}
        </div>

        {/* Crescent — top right, tasteful SVG */}
        <div className="absolute top-8 right-8 md:top-14 md:right-20 pointer-events-none select-none"
          style={{ opacity: 0.22 }}>
          <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
            <path d="M60 10 A35 35 0 1 0 60 80 A25 25 0 1 1 60 10Z" fill="#fbbf24" />
          </svg>
        </div>

        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-40 pointer-events-none"
          style={{ background: "linear-gradient(to top, #0a0f1e 0%, transparent 100%)" }} />

        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-28 w-full grid md:grid-cols-2 gap-12 items-center">

          {/* Left: copy */}
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-7"
              style={{ background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.28)", color: "#fbbf24" }}>
              🌙 Eid 2025 — Featured Story
            </span>

            <h1 className="font-black leading-[1.06] mb-5" style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)", color: "#fef3e2" }}>
              {child ? (
                <>Happy Eid, <span style={{ background: "linear-gradient(135deg,#fbbf24,#f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{child}</span> 🌙</>
              ) : (
                <>Celebrate Eid with a Story Full of <span style={{ background: "linear-gradient(135deg,#fbbf24,#f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Warmth, Friendship &amp; Family</span></>
              )}
            </h1>

            <p className="text-lg leading-relaxed mb-8" style={{ color: "rgba(254,243,226,0.68)", maxWidth: 500 }}>
              Discover <em>Rose Goes to Mo's BBQ</em> — a gentle story about curiosity, kindness, sharing food, and experiencing a special family celebration.{child ? ` See how a story like this could feel for ${child}.` : ""}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/characters/create"
                className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg,#fbbf24,#f97316)", color: "#1a0800", boxShadow: "0 4px 24px rgba(251,191,36,0.28)" }}>
                <i className="ri-quill-pen-line"></i>
                {child ? `Start ${child}'s Story` : "Join the Eid Beta"}
              </Link>
              <a href="#preview"
                className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all"
                style={{ background: "rgba(254,243,226,0.06)", border: "1.5px solid rgba(254,243,226,0.22)", color: "rgba(254,243,226,0.80)" }}>
                <i className="ri-book-open-line"></i>
                Preview the Story
              </a>
            </div>
          </div>

          {/* Right: real book cover + animation */}
          <div className="flex justify-center">
            <div style={{ perspective: "1000px" }}>
              <div className="flex items-stretch gap-0 rounded-r-2xl overflow-hidden"
                style={{
                  transform: "rotateY(-8deg) rotateX(2deg)",
                  filter: "drop-shadow(0 32px 56px rgba(0,0,0,0.72)) drop-shadow(0 8px 20px rgba(251,191,36,0.12))",
                  transformStyle: "preserve-3d",
                }}>
                {/* Spine */}
                <div className="w-7 flex flex-col items-center justify-center py-6 flex-shrink-0"
                  style={{ background: "linear-gradient(to right, #2a1505, #3d1f08)", borderLeft: "2px solid rgba(251,191,36,0.30)" }}>
                  <span className="text-[7px] font-black uppercase tracking-[0.22em] whitespace-nowrap"
                    style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", color: "rgba(251,191,36,0.50)" }}>
                    Me Time Stories
                  </span>
                </div>
                {/* Cover face — video with image poster */}
                <div className="relative overflow-hidden" style={{ width: 240 }}>
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster={`${import.meta.env.BASE_URL}images/rose-bbq-cover.png`}
                    style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}>
                    <source src={`${import.meta.env.BASE_URL}images/rose-bbq-animation.mp4`} type="video/mp4" />
                  </video>
                  {/* Subtle vignette overlay */}
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: "linear-gradient(to top, rgba(10,5,0,0.28) 0%, transparent 40%)" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── NAME CAPTURE (if no name yet) ────────────────────────────────── */}
      {!child && !nameSaved && (
        <section className="py-14" style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #12091a 100%)" }}>
          <div className="max-w-lg mx-auto px-4 text-center">
            <div className="rounded-2xl p-7"
              style={{ background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.18)", backdropFilter: "blur(16px)" }}>
              <p className="text-base font-bold mb-1" style={{ color: "#fbbf24" }}>🌙 Let's make the magic feel more personal</p>
              <p className="text-sm mb-6" style={{ color: "rgba(254,243,226,0.55)" }}>What should we call your little hero?</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Child's first name"
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSaveName()}
                  className="flex-1 px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all"
                  style={{ background: "rgba(254,243,226,0.07)", border: "1px solid rgba(254,243,226,0.18)", color: "#fef3e2" }}
                />
                <button onClick={handleSaveName}
                  className="px-5 py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] whitespace-nowrap"
                  style={{ background: "linear-gradient(135deg,#fbbf24,#f97316)", color: "#1a0800" }}>
                  Show me their story
                </button>
              </div>
              <button className="mt-3 text-xs underline-offset-2 hover:underline"
                style={{ color: "rgba(254,243,226,0.30)" }}
                onClick={() => setNameSaved(true)}>
                Skip for now
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── STORY SUMMARY ────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: "#0a0f1e" }}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#f97316" }}>About the story</p>
              <h2 className="font-black text-white mb-6" style={{ fontSize: "clamp(1.7rem, 3.5vw, 2.5rem)", lineHeight: 1.2 }}>
                Rose Goes to Mo's BBQ
              </h2>
              <p className="text-base leading-relaxed mb-5" style={{ color: "rgba(254,243,226,0.65)" }}>
                Rose is invited to a neighbour's Eid barbecue and steps into a world of warm food, new traditions, generous hospitality, and gentle understanding. What begins as uncertainty becomes a beautiful memory of friendship, welcome, and togetherness.
              </p>
              <p className="text-sm leading-relaxed italic" style={{ color: "rgba(251,191,36,0.70)" }}>
                "The lanterns glowed like tiny suns. Rose could smell something wonderful drifting across the garden, and Mo's grandmother was already waving her over."
              </p>
              {child && (
                <p className="mt-5 text-sm font-semibold" style={{ color: "rgba(254,243,226,0.50)" }}>
                  See how stories like this could feel for <span style={{ color: "#fbbf24" }}>{child}</span>.
                </p>
              )}
            </div>

            {/* Story details card */}
            <div className="rounded-2xl overflow-hidden"
              style={{ background: "rgba(251,191,36,0.04)", border: "1px solid rgba(251,191,36,0.14)" }}>
              {/* Cover image strip */}
              <div className="relative overflow-hidden" style={{ height: 220 }}>
                <img
                  src={`${import.meta.env.BASE_URL}images/rose-bbq-cover.png`}
                  alt="Rose Goes to Mo's BBQ book cover"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
                />
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: "linear-gradient(to top, rgba(10,15,30,0.80) 0%, transparent 55%)" }} />
              </div>
              <div className="p-6">
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "rgba(254,243,226,0.30)" }}>Story details</p>
              <div className="space-y-3.5">
                {[
                  { icon: "ri-book-2-line",           label: "Story type",       value: "Personalised picture book" },
                  { icon: "ri-group-line",             label: "Ages",             value: "3 – 10 years" },
                  { icon: "ri-calendar-event-line",    label: "Season",           value: "Eid al-Fitr 2025" },
                  { icon: "ri-heart-3-line",           label: "Themes",           value: "Friendship, curiosity, cultural warmth" },
                  { icon: "ri-user-star-line",         label: "Personalised with", value: "Your child's name, personality & likeness" },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.22)" }}>
                      <i className={`${icon} text-sm`} style={{ color: "#fbbf24" }}></i>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(254,243,226,0.30)" }}>{label}</p>
                      <p className="text-sm font-medium" style={{ color: "rgba(254,243,226,0.80)" }}>{value}</p>
                    </div>
                  </div>
                ))}
              </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STORY MOMENTS ────────────────────────────────────────────────── */}
      <section id="preview" className="py-20" style={{ background: "linear-gradient(135deg, #0c1020 0%, #120a1a 100%)" }}>
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-xs font-bold uppercase tracking-widest mb-2 text-center" style={{ color: "#f97316" }}>Four moments from the story</p>
          <h2 className="font-black text-white text-center mb-12" style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)" }}>The Evening Unfolds</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {STORY_MOMENTS.map(({ label, text, icon, color }, i) => (
              <div key={label} className="rounded-2xl p-6 relative overflow-hidden"
                style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${color}1a` }}>
                <div className="absolute top-0 left-0 w-full h-px"
                  style={{ background: `linear-gradient(to right, transparent, ${color}40, transparent)` }} />
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${color}14`, border: `1px solid ${color}30` }}>
                    <i className={`${icon} text-base`} style={{ color }}></i>
                  </div>
                  <div>
                    <div className="text-[9px] font-black uppercase tracking-[0.16em] mb-1" style={{ color: "rgba(254,243,226,0.28)" }}>
                      Moment {i + 1}
                    </div>
                    <h3 className="font-bold text-white text-sm mb-2">{label}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: "rgba(254,243,226,0.55)" }}>{text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY FAMILIES WILL LOVE IT ────────────────────────────────────── */}
      <section className="py-20" style={{ background: "#0a0f1e" }}>
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-xs font-bold uppercase tracking-widest mb-2 text-center" style={{ color: "#f97316" }}>Why families choose this story</p>
          <h2 className="font-black text-white text-center mb-12" style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)" }}>
            Warm, Timely &amp; Made to Last
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {FAMILY_REASONS.map(({ icon, color, title, body }) => (
              <div key={title} className="flex gap-4 rounded-2xl p-5"
                style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${color}1a` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}14`, border: `1px solid ${color}30` }}>
                  <i className={`${icon} text-base`} style={{ color }}></i>
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm mb-1.5">{title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(254,243,226,0.52)" }}>{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BETA CONVERSION ──────────────────────────────────────────────── */}
      <section className="py-24" style={{ background: "linear-gradient(160deg, #12091a 0%, #0a0f1e 100%)" }}>
        <div className="max-w-2xl mx-auto px-4 text-center">

          {/* Crescent decoration */}
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: "rgba(251,191,36,0.10)", border: "1px solid rgba(251,191,36,0.22)" }}>
              <i className="ri-moon-clear-line text-xl" style={{ color: "#fbbf24" }}></i>
            </div>
          </div>

          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#f97316" }}>
            Join the Eid Beta
          </p>
          <h2 className="font-black text-white mb-5" style={{ fontSize: "clamp(1.7rem, 3.5vw, 2.6rem)", lineHeight: 1.15 }}>
            {child ? (
              <>Give <span style={{ background:"linear-gradient(135deg,#fbbf24,#f97316)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>{child}</span> a story<br/>they'll never forget</>
            ) : (
              <>Give your child a story<br/><span style={{ background:"linear-gradient(135deg,#fbbf24,#f97316)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>they'll never forget</span></>
            )}
          </h2>
          <p className="text-base leading-relaxed mb-10" style={{ color: "rgba(254,243,226,0.58)", maxWidth: 480, margin: "0 auto 2.5rem" }}>
            We're inviting families to explore personalised story experiences with us. Enter your child's details, try sample story journeys, and help shape Me Time Stories as we grow.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/characters/create"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-base transition-all hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg,#fbbf24,#f97316)", color: "#1a0800", boxShadow: "0 6px 30px rgba(251,191,36,0.30)" }}>
              <i className="ri-quill-pen-line"></i>
              {child ? `Start ${child}'s Story` : "Join the Eid Beta"}
            </Link>
            <Link href="/stories/time-travelling-tractor"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-base transition-all"
              style={{ background: "rgba(254,243,226,0.06)", border: "1.5px solid rgba(254,243,226,0.20)", color: "rgba(254,243,226,0.75)" }}>
              <i className="ri-book-open-line"></i>
              Start Your Child's Story
            </Link>
          </div>

          <p className="mt-8 text-xs" style={{ color: "rgba(254,243,226,0.25)" }}>
            Free to try · No credit card · Stories personalised in minutes
          </p>
        </div>
      </section>

    </PublicLayout>
  );
}
