import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { PublicLayout } from "@/layouts/PublicLayout";
import { publicAssetUrl } from "@/lib/publicAssetUrl";

const BARRIERS = [
  {
    icon: "ri-user-line",
    color: "#7c3aed",
    label: "Mental Barrier #1",
    title: "Social Pressure",
    body: "Performance anxiety and external expectations create mental blocks that limit natural ability. Whether it be family, friends or peers, being strong-minded and disciplined makes the difference.",
  },
  {
    icon: "ri-mental-health-line",
    color: "#f59e0b",
    label: "Mental Barrier #2",
    title: "Mental Gaps",
    body: "Without structured mental training, even talented athletes falter in decisive moments. We provide the framework to build resilience, focus, and composure when it matters most.",
  },
  {
    icon: "ri-line-chart-line",
    color: "#06b6d4",
    label: "Mental Barrier #3",
    title: "Inconsistency",
    body: "Without systematic development, mental strength remains unpredictable. Building systems and infrastructure to maintain acquired skills is key to sustained athletic development.",
  },
];

const PILLARS = [
  { icon: "ri-shield-check-line", color: "#10b981", title: "Mental Resilience", sub: "Bounce back stronger" },
  { icon: "ri-flashlight-line",    color: "#3b82f6", title: "Pressure Performance", sub: "Thrive under pressure" },
  { icon: "ri-line-chart-line",    color: "#8b5cf6", title: "Systematic Growth", sub: "Structured development" },
  { icon: "ri-focus-3-line",       color: "#f59e0b", title: "Position-Specific", sub: "Tailored for every role" },
];

const BOOK_FEATURES = [
  {
    icon: "ri-user-star-line",
    color: "#3b82f6",
    title: "Individual Story Books",
    body: "Each player receives their own personalized mental training book. Marcus the Center Back gets different stories than Emma the Goalkeeper — all targeting their specific psychological challenges and growth areas.",
  },
  {
    icon: "ri-building-4-line",
    color: "#10b981",
    title: "Academy-Branded Books",
    body: "Stories feature your academy's values, training ground settings, and coaching philosophy. Players see themselves in familiar environments, making the mental training feel authentic and connected to their real journey.",
  },
  {
    icon: "ri-football-line",
    color: "#f59e0b",
    title: "Position-Specific Content",
    body: "A striker's story focuses on finishing pressure and goal-scoring mentality. A goalkeeper's story addresses shot-stopping concentration and leadership. Each position gets the mental training it actually needs.",
  },
];

export default function ForAcademies() {
  const [formData, setFormData] = useState({ name: "", email: "", org: "", role: "", type: "", info: "" });
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const revealControls = useCallback(() => {
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowControls(false), 3000);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => setCurrentTime(v.currentTime);
    const onMeta = () => setDuration(v.duration);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onMeta);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onMeta);
    };
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
    revealControls();
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    const next = !muted;
    v.muted = next;
    setMuted(next);
    revealControls();
  };

  const changeVolume = (val: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.volume = val;
    v.muted = val === 0;
    setVolume(val);
    setMuted(val === 0);
    revealControls();
  };

  const seek = (val: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = val;
    setCurrentTime(val);
    revealControls();
  };

  const shareVideo = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: "MeTime Stories Football Academy Promo", url });
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    setShowShare(false);
  };

  const toggleFullscreen = () => {
    const el = playerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) el.requestFullscreen();
    else document.exitFullscreen();
    revealControls();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <PublicLayout>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #e8f0fe 0%, #f0f4ff 40%, #e8eef8 100%)" }}>

        {/* Subtle pitch lines in background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity: 0.04 }}>
          <div style={{ position: "absolute", top: "20%", right: "-5%", width: 600, height: 600, borderRadius: "50%", border: "2px solid #1e3a8a" }} />
          <div style={{ position: "absolute", bottom: "-10%", left: "-10%", width: 400, height: 400, borderRadius: "50%", border: "2px solid #1e3a8a" }} />
        </div>

        {/* Snowflake/glare orbs (top right) */}
        <div className="absolute top-0 right-0 pointer-events-none" style={{ width: 420, height: 420, background: "radial-gradient(ellipse, rgba(255,255,255,0.70) 0%, transparent 70%)", opacity: 0.6 }} />

        <div className="relative max-w-6xl mx-auto px-4 pt-20 pb-16 md:pt-28 md:pb-24 w-full">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
              style={{ background: "rgba(30,58,138,0.08)", border: "1px solid rgba(30,58,138,0.18)", color: "#1e3a8a" }}>
              <i className="ri-focus-3-line text-xs"></i>
              Elite Mental Performance Training
            </span>
            <h1 className="font-black leading-[1.08] mb-5" style={{ fontSize: "clamp(2.4rem, 5.5vw, 3.8rem)", color: "#0f172a" }}>
              Mental Training for{" "}
              <span style={{ color: "#2563eb" }}>Elite Athletes</span>
            </h1>
            <p className="text-lg leading-relaxed mb-8" style={{ color: "#374151", maxWidth: 580, margin: "0 auto 2rem" }}>
              Your story, your journey: hyper-personalised experiences that strengthen resilience, sharpen focus, and ignite a champion's mindset in Academy Players
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/football-matrix"
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg, #1e3a8a, #2563eb)", color: "#fff", boxShadow: "0 4px 20px rgba(37,99,235,0.30)" }}>
                <i className="ri-football-line"></i>
                Story Matrix (Soccer)
              </Link>
              <a href={publicAssetUrl("holding-the-line-sample.pdf")} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg, #1e40af, #3b82f6)", color: "#fff" }}>
                <i className="ri-book-open-line"></i>
                Read Sample Story
              </a>
              <button onClick={scrollToForm}
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg, #1d4ed8, #60a5fa)", color: "#fff" }}>
                Get Started Today →
              </button>
            </div>
          </div>

          {/* Device mockup */}
          <div className="relative max-w-2xl mx-auto">
            <div className="rounded-2xl overflow-hidden shadow-2xl"
              style={{ background: "#1a1a2e", border: "8px solid #2a2a4a", boxShadow: "0 32px 80px rgba(0,0,0,0.28)" }}>
              {/* Mockup top bar */}
              <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: "#111127", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: "#ef4444" }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: "#f59e0b" }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: "#10b981" }} />
                </div>
                <span className="text-xs font-medium mx-auto" style={{ color: "rgba(255,255,255,0.45)" }}>MTS Football Story Matrix by Awwa Stories</span>
              </div>
              {/* Mockup content — custom video player */}
              <div
                ref={playerRef}
                className="relative"
                style={{ height: 260, background: "#000", overflow: "hidden", cursor: "pointer" }}
                onMouseMove={revealControls}
                onMouseEnter={revealControls}
                onTouchStart={revealControls}
                onClick={togglePlay}
              >
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                  poster={publicAssetUrl("images/book-likeness.png")}>
                  <source src={publicAssetUrl("images/academy-promo.mp4")} type="video/mp4" />
                </video>

                {/* Gradient overlay at bottom for readability */}
                <div className="absolute inset-x-0 bottom-0 pointer-events-none"
                  style={{ height: 100, background: "linear-gradient(to top, rgba(0,0,0,0.80) 0%, transparent 100%)" }} />

                {/* Big play/pause flash icon in centre */}
                {!playing && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="flex items-center justify-center rounded-full"
                      style={{ width: 56, height: 56, background: "rgba(255,255,255,0.18)", backdropFilter: "blur(6px)" }}>
                      <i className="ri-play-fill text-white text-3xl ml-1"></i>
                    </div>
                  </div>
                )}

                {/* Controls bar — visible on hover / touch */}
                <div
                  className="absolute inset-x-0 bottom-0 px-3 pb-2 pt-3 transition-opacity duration-300"
                  style={{ opacity: showControls ? 1 : 0, pointerEvents: showControls ? "auto" : "none" }}
                  onClick={e => e.stopPropagation()}
                >
                  {/* Progress scrubber */}
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    step={0.1}
                    value={currentTime}
                    onChange={e => seek(Number(e.target.value))}
                    className="w-full mb-2"
                    style={{ accentColor: "#2563eb", height: 3, cursor: "pointer" }}
                  />

                  {/* Controls row */}
                  <div className="flex items-center gap-2">
                    {/* Play/Pause */}
                    <button onClick={togglePlay}
                      className="flex items-center justify-center rounded-full transition-colors"
                      style={{ width: 30, height: 30, background: "rgba(255,255,255,0.15)", color: "#fff", border: "none", cursor: "pointer", flexShrink: 0 }}>
                      <i className={playing ? "ri-pause-fill text-sm" : "ri-play-fill text-sm ml-0.5"}></i>
                    </button>

                    {/* Time */}
                    <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.75)", flexShrink: 0 }}>
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>

                    {/* Spacer */}
                    <div style={{ flex: 1 }} />

                    {/* Volume / Mute */}
                    <button onClick={toggleMute}
                      className="flex items-center justify-center rounded-full transition-colors"
                      style={{ width: 28, height: 28, background: "rgba(255,255,255,0.12)", color: "#fff", border: "none", cursor: "pointer", flexShrink: 0 }}>
                      <i className={muted || volume === 0 ? "ri-volume-mute-fill text-sm" : "ri-volume-up-fill text-sm"}></i>
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={muted ? 0 : volume}
                      onChange={e => changeVolume(Number(e.target.value))}
                      style={{ width: 56, accentColor: "#2563eb", height: 3, cursor: "pointer", flexShrink: 0 }}
                    />

                    {/* Share */}
                    <div className="relative" style={{ flexShrink: 0 }}>
                      <button onClick={() => { setShowShare(s => !s); revealControls(); }}
                        className="flex items-center justify-center rounded-full transition-colors"
                        style={{ width: 28, height: 28, background: "rgba(255,255,255,0.12)", color: "#fff", border: "none", cursor: "pointer" }}>
                        <i className="ri-share-forward-fill text-sm"></i>
                      </button>
                      {showShare && (
                        <div className="absolute bottom-9 right-0 rounded-lg px-3 py-2 text-xs font-semibold whitespace-nowrap"
                          style={{ background: "rgba(15,23,42,0.95)", color: "#fff", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}>
                          <button onClick={shareVideo} style={{ background: "none", border: "none", color: "#93c5fd", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                            <i className="ri-links-line"></i>
                            {copied ? "Link copied!" : "Copy page link"}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Fullscreen */}
                    <button onClick={toggleFullscreen}
                      className="flex items-center justify-center rounded-full transition-colors"
                      style={{ width: 28, height: 28, background: "rgba(255,255,255,0.12)", color: "#fff", border: "none", cursor: "pointer", flexShrink: 0 }}>
                      <i className="ri-fullscreen-line text-sm"></i>
                    </button>
                  </div>
                </div>

                {/* Top-left badge — always visible */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ background: "rgba(239,68,68,0.90)", color: "#fff" }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-white inline-block" style={{ animation: "pulse 1.5s infinite" }}></span>
                    LIVE
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: "rgba(0,0,0,0.55)", color: "rgba(255,255,255,0.80)" }}>
                    HD
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ACADEMY GALLERY ──────────────────────────────────────────────── */}
      <section className="py-14 overflow-hidden" style={{ background: "linear-gradient(180deg, #e8eef8 0%, #0f172a 100%)" }}>
        <div className="max-w-6xl mx-auto px-4 mb-8 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] mb-2" style={{ color: "#2563eb" }}>Every Story, Every Club</p>
          <h2 className="text-2xl md:text-3xl font-black" style={{ color: "#0f172a" }}>
            Their academy. Their badge. Their book.
          </h2>
        </div>

        {/* Horizontal scroll gallery */}
        <div className="flex gap-4 px-4 md:px-8 overflow-x-auto pb-2"
          style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
          {[
            { src: "images/academy-coventry-day.png",   club: "Coventry City",  label: "Daytime edition" },
            { src: "images/academy-coventry-night.png", club: "Coventry City",  label: "Floodlight edition" },
            { src: "images/academy-chelsea.png",        club: "Chelsea FC",     label: "Floodlight edition" },
            { src: "images/academy-wolves.png",         club: "Wolves",         label: "Floodlight edition" },
          ].map(({ src, club, label }) => (
            <div key={src}
              className="relative flex-shrink-0 rounded-2xl overflow-hidden"
              style={{ width: "clamp(220px, 42vw, 300px)", aspectRatio: "2/3", scrollSnapAlign: "start", boxShadow: "0 20px 60px rgba(0,0,0,0.45)" }}>
              <img
                src={publicAssetUrl(src)}
                alt={`${club} academy story illustration`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {/* Gradient + label */}
              <div className="absolute inset-x-0 bottom-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.80) 0%, transparent 60%)", padding: "1.5rem 1rem 0.75rem" }}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: "rgba(255,255,255,0.50)" }}>{label}</p>
                <p className="text-sm font-black" style={{ color: "#fff" }}>{club}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── THE MENTAL PERFORMANCE WALL ──────────────────────────────────── */}
      <section className="relative py-20 overflow-hidden" style={{ background: "linear-gradient(160deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)" }}>
        {/* Subtle football pitch markings */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity: 0.06 }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 400, height: 400, borderRadius: "50%", border: "2px solid #fff" }} />
          <div style={{ position: "absolute", top: 0, bottom: 0, left: "50%", width: 2, background: "#fff" }} />
        </div>

        <div className="relative max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-5"
              style={{ background: "rgba(239,68,68,0.14)", border: "1px solid rgba(239,68,68,0.30)", color: "#f87171" }}>
              <i className="ri-alarm-warning-line text-xs"></i>
              The Reality Check
            </span>
            <h2 className="font-black text-white mb-3" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}>
              The Mental Performance Wall
            </h2>
            <p className="text-base" style={{ color: "rgba(255,255,255,0.50)" }}>Three critical barriers blocking athletic potential</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 mb-10">
            {BARRIERS.map(({ icon, color, label, title, body }) => (
              <div key={title} className="rounded-2xl p-6"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", backdropFilter: "blur(12px)" }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${color}20`, border: `1px solid ${color}35` }}>
                  <i className={`${icon} text-xl`} style={{ color }}></i>
                </div>
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: `${color}99` }}>{label}</p>
                <h3 className="text-white font-bold text-base mb-3">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.52)" }}>{body}</p>
              </div>
            ))}
          </div>

          {/* 0.5% stat card */}
          <div className="max-w-md mx-auto rounded-2xl p-8 text-center"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(249,115,22,0.25)", backdropFilter: "blur(16px)" }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-4"
              style={{ background: "rgba(249,115,22,0.14)", border: "1px solid rgba(249,115,22,0.28)", color: "#fb923c" }}>
              <i className="ri-information-line"></i> Industry Reality Check
            </span>
            <div className="text-5xl font-black mb-1" style={{ color: "#fb923c" }}>0.5%</div>
            <p className="font-bold text-sm mb-3" style={{ color: "#fb923c" }}>Academy Success Rate</p>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.50)" }}>
              Only 0.5% of Academy players ever sign a Professional contract. Every increase means more dreams realised and better ROI margins.
            </p>
          </div>
        </div>
      </section>

      {/* ── FOUR PILLARS ─────────────────────────────────────────────────── */}
      <section className="relative py-20 overflow-hidden" style={{ background: "linear-gradient(160deg, #0f172a 0%, #1e1b4b 60%, #0f172a 100%)" }}>
        {/* Aerial pitch background (faint) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity: 0.07 }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,0.15) 0px, rgba(255,255,255,0.15) 1px, transparent 1px, transparent 80px), repeating-linear-gradient(0deg, rgba(255,255,255,0.15) 0px, rgba(255,255,255,0.15) 1px, transparent 1px, transparent 60px)" }} />
        </div>

        <div className="relative max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-black text-white mb-3" style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)" }}>
              Mental Training Transforms Everything
            </h2>
            <p className="text-base" style={{ color: "rgba(255,255,255,0.48)" }}>Four pillars of systematic mental development</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {PILLARS.map(({ icon, color, title, sub }) => (
              <div key={title} className="text-center py-8 px-4 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4"
                  style={{ background: `${color}18`, border: `1px solid ${color}30`, color }}>
                  <i className={icon}></i>
                </div>
                <h3 className="font-bold text-white text-sm mb-1">{title}</h3>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.42)" }}>{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EACH PLAYER GETS THEIR OWN BOOK ──────────────────────────────── */}
      <section className="py-20" style={{ background: "#f8faff" }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-5"
              style={{ background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.18)", color: "#2563eb" }}>
              <i className="ri-book-2-line text-xs"></i>
              Personalized Story Books for Every Player
            </span>
            <h2 className="font-black mb-4" style={{ fontSize: "clamp(1.7rem, 3.5vw, 2.6rem)", color: "#0f172a" }}>
              Each Player Gets Their Own Mental Training Book
            </h2>
            <p className="text-base leading-relaxed max-w-2xl mx-auto" style={{ color: "#475569" }}>
              Every academy player receives a custom-written story book tailored to their position, challenges, and development stage. From goalkeeper to striker, each book is uniquely crafted to build the mental skills they need most.
            </p>
          </div>

          {/* Feature tabs strip */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {[
              { icon: "ri-user-line",       label: "Individual Stories",   sub: "Custom book per player" },
              { icon: "ri-football-line",   label: "Position-Specific",    sub: "GK, CB, ST focused content" },
              { icon: "ri-building-4-line", label: "Academy Branded",      sub: "Your club's identity" },
              { icon: "ri-refresh-line",    label: "Evolving Content",     sub: "Updates with growth" },
            ].map(({ icon, label, sub }) => (
              <div key={label} className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl"
                style={{ background: "#fff", border: "1px solid #e2e8f0", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                <i className={`${icon} text-blue-600`}></i>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "#0f172a" }}>{label}</p>
                  <p className="text-xs" style={{ color: "#64748b" }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-start">
            {/* Book image */}
            <div className="rounded-2xl overflow-hidden shadow-xl" style={{ border: "1px solid #e2e8f0" }}>
              <div className="p-3" style={{ background: "#1e293b" }}>
                <div className="flex items-center gap-2 mb-2">
                  <i className="ri-image-line text-xs" style={{ color: "rgba(255,255,255,0.40)" }}></i>
                  <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.50)" }}>Book Pages Gallery</span>
                  <span className="text-xs ml-auto" style={{ color: "rgba(255,255,255,0.30)" }}>Upload multiple images to customize your slideshow</span>
                </div>
              </div>
              <img
                src={publicAssetUrl("images/book-likeness.png")}
                alt="Holding the Line — book pages"
                className="w-full object-cover"
                style={{ maxHeight: 340 }}
              />
            </div>

            {/* Features list */}
            <div className="space-y-7">
              {BOOK_FEATURES.map(({ icon, color, title, body }) => (
                <div key={title} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${color}14`, border: `1px solid ${color}25`, color }}>
                    <i className={`${icon} text-base`}></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-base mb-1.5" style={{ color: "#0f172a" }}>{title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>{body}</p>
                  </div>
                </div>
              ))}

              <button onClick={scrollToForm}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg, #1e3a8a, #2563eb)", color: "#fff", boxShadow: "0 4px 20px rgba(37,99,235,0.28)" }}>
                Book a Demo →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── READY TO START — FORM ────────────────────────────────────────── */}
      <section ref={formRef} className="py-20" style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 100%)" }}>
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-black mb-3" style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", color: "#0f172a" }}>Ready to Start?</h2>
            <p className="text-base mb-1" style={{ color: "#374151" }}>Transform mental training at your academy</p>
            <p className="text-sm" style={{ color: "#6b7280" }}>Fill out this form and we'll get back to you within 24 hours</p>
          </div>

          {submitted ? (
            <div className="rounded-2xl p-10 text-center" style={{ background: "#fff", border: "1px solid #e2e8f0", boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto mb-4"
                style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}>
                <i className="ri-check-line"></i>
              </div>
              <h3 className="font-bold text-xl mb-2" style={{ color: "#0f172a" }}>Message sent!</h3>
              <p className="text-sm" style={{ color: "#6b7280" }}>We'll be in touch within 24 hours. Look out for an email from taku@metimestories.co.uk</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-2xl p-8 space-y-5"
              style={{ background: "#fff", border: "1px solid #e2e8f0", boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: "#374151" }}>
                    Full Name <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input required type="text" placeholder="Enter your full name"
                    value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#0f172a" }} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: "#374151" }}>
                    Email Address <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input required type="email" placeholder="your.email@example.com"
                    value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#0f172a" }} />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: "#374151" }}>
                    Organisation / Club / Academy Name <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input required type="text" placeholder="Your academy or club name"
                    value={formData.org} onChange={e => setFormData(p => ({ ...p, org: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#0f172a" }} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: "#374151" }}>
                    Your Role <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input required type="text" placeholder="e.g. Academy Director, Coach, Manager, Parent, etc."
                    value={formData.role} onChange={e => setFormData(p => ({ ...p, role: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#0f172a" }} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "#374151" }}>
                  Enquiry Type <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input required type="text" placeholder="e.g. Partnership, Demo Request, Pilot Programme, General Enquiry"
                  value={formData.type} onChange={e => setFormData(p => ({ ...p, type: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#0f172a" }} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "#374151" }}>Additional Information</label>
                <textarea rows={4} placeholder="Tell us more about your academy, specific challenges, or what you'd like to achieve..."
                  value={formData.info} onChange={e => setFormData(p => ({ ...p, info: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all resize-none"
                  style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#0f172a" }} />
                <p className="text-xs mt-1" style={{ color: "#9ca3af" }}>Optional - help us understand your needs better</p>
              </div>
              <button type="submit"
                className="w-full py-4 rounded-xl font-bold text-base transition-all hover:scale-[1.01]"
                style={{ background: "linear-gradient(135deg, #1e3a8a, #2563eb)", color: "#fff", boxShadow: "0 4px 20px rgba(37,99,235,0.30)" }}>
                Send Enquiry →
              </button>
            </form>
          )}

          <p className="text-center text-xs mt-5" style={{ color: "#9ca3af" }}>
            Or email us directly:{" "}
            <a href="mailto:taku@metimestories.co.uk" className="underline" style={{ color: "#2563eb" }}>taku@metimestories.co.uk</a>
            {" · "}
            <a href="mailto:michael@metimestories.co.uk" className="underline" style={{ color: "#2563eb" }}>michael@metimestories.co.uk</a>
            {" · "}
            <a href="tel:07402256217" className="underline" style={{ color: "#2563eb" }}>07402 256 217</a>
          </p>
        </div>
      </section>

    </PublicLayout>
  );
}
