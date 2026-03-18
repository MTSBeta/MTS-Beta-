import { Link } from "wouter";
import { PublicLayout } from "@/layouts/PublicLayout";

export default function MarketingHome() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/80 via-white/60 to-orange-50/50" />
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32 text-center w-full">
          {/* Badge */}
          <a
            href="/stories/time-travelling-tractor"
            className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full text-sm font-medium mb-8 hover:bg-indigo-100 transition-colors animate-bounce"
          >
            <i className="ri-fire-line"></i>
            Now Live: Beta Story Engine Available!
          </a>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 leading-tight">
            Your Child's Name in{" "}
            <span
              className="inline-block"
              style={{
                background: "linear-gradient(45deg, #6366f1, #f97316)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Every Story
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-500 mb-4 italic font-medium">
            Where imagination meets the heart
          </p>

          <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed">
            Stories crafted around your child's unique world – where their personality, dreams, and favourite things become the heart of every adventure, not just their name on a page.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/stories/time-travelling-tractor"
              className="flex items-center justify-center gap-2 px-8 py-4 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
              style={{ backgroundColor: "#6366f1" }}
            >
              <i className="ri-play-circle-line text-xl"></i>
              See the Magic
            </Link>
            <Link
              href="/characters/create"
              className="flex items-center justify-center gap-2 px-8 py-4 border-2 text-indigo-600 font-semibold text-lg rounded-xl hover:bg-indigo-600 hover:text-white transition-all"
              style={{ borderColor: "#6366f1" }}
            >
              <i className="ri-heart-line text-xl"></i>
              Begin Their Journey
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <i className="ri-check-line text-green-500"></i>
              1,200+ families
            </span>
            <span className="flex items-center gap-1.5">
              <i className="ri-check-line text-green-500"></i>
              100+ unique stories
            </span>
            <span className="flex items-center gap-1.5">
              <i className="ri-check-line text-green-500"></i>
              Football academies across England
            </span>
          </div>
        </div>
      </section>

      {/* Welcome / Platform intro */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block bg-indigo-50 text-indigo-600 text-sm font-medium px-4 py-2 rounded-full mb-6">
              ✨ Welcome to Me Time Stories!
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See how it works in just 2 minutes, then watch as bedtime becomes their favourite time of day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                step: 1,
                color: "#6366f1",
                icon: "ri-user-heart-line",
                title: "Share Your Child's Magic",
                desc: "Tell us what makes them smile, what they dream about, and who they are – we weave these precious details into every tale.",
              },
              {
                step: 2,
                color: "#f97316",
                icon: "ri-quill-pen-line",
                title: "We Craft Their Story",
                desc: "Each adventure is lovingly created around your child's world, making them not just a character, but the beating heart of every magical moment.",
              },
              {
                step: 3,
                color: "#10b981",
                icon: "ri-emotion-happy-line",
                title: "Watch Them Light Up",
                desc: "Experience the pure joy as your child discovers they're the hero of their own story, creating precious moments that bring you closer together.",
              },
            ].map(({ step, color, icon, title, desc }) => (
              <div key={step} className="text-center group">
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div
                    className="w-24 h-24 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: color }}
                  >
                    <i className={icon}></i>
                  </div>
                  <div
                    className="absolute -top-2 -right-2 w-8 h-8 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg"
                    style={{ backgroundColor: color }}
                  >
                    {step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features / Why MeTime */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Me Time Stories?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We don't just put your child's name in a story. We build every adventure around who they truly are.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "ri-fingerprint-line",
                color: "#6366f1",
                title: "Deeply Personalised",
                desc: "Personality, favourite animals, dreams, and hobbies woven into every page — not just their name.",
              },
              {
                icon: "ri-book-heart-line",
                color: "#f97316",
                title: "Builds Reading Love",
                desc: "Children who see themselves in stories develop a lifelong love of reading and stronger literacy skills.",
              },
              {
                icon: "ri-mental-health-line",
                color: "#8b5cf6",
                title: "Emotional Growth",
                desc: "Stories that address real childhood moments — new schools, friendships, anxiety — with warmth and care.",
              },
              {
                icon: "ri-team-line",
                color: "#10b981",
                title: "Family Connection",
                desc: "Shared reading moments that spark conversations and create memories that last a lifetime.",
              },
              {
                icon: "ri-shield-star-line",
                color: "#0ea5e9",
                title: "Football Academy Ready",
                desc: "Purpose-built for football academies — mental performance stories for young athletes.",
              },
              {
                icon: "ri-global-line",
                color: "#f43f5e",
                title: "Diverse & Inclusive",
                desc: "Stories that celebrate every child's background, culture, and identity with authenticity and joy.",
              },
            ].map(({ icon, color, title, desc }) => (
              <div
                key={title}
                className="bg-white p-6 rounded-2xl shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl mb-4"
                  style={{ backgroundColor: color }}
                >
                  <i className={icon}></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: "1,200+", label: "Families Reading" },
              { num: "100+", label: "Unique Stories" },
              { num: "42+", label: "Football Academies" },
              { num: "8+", label: "Story Themes" },
            ].map(({ num, label }) => (
              <div key={label}>
                <div
                  className="text-4xl md:text-5xl font-bold mb-2"
                  style={{ color: "#6366f1" }}
                >
                  {num}
                </div>
                <p className="text-gray-500 text-sm font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions teaser */}
      <section className="py-20 bg-gradient-to-br from-indigo-900 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Stories for Every Setting
            </h2>
            <p className="text-indigo-200 text-lg max-w-2xl mx-auto">
              From family bedtime to elite football academies — personalised stories that meet children where they are.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "ri-home-heart-line",
                title: "For Families",
                desc: "Bedtime stories with your child as the hero. Build reading habits and lifelong memories.",
                link: "/families",
                linkLabel: "Explore for Families",
                bg: "bg-indigo-700/50",
              },
              {
                icon: "ri-school-line",
                title: "Football Academies",
                desc: "Mental performance stories for young elite athletes. Used across Premier League and Championship academies.",
                link: "/for-academies",
                linkLabel: "Explore for Academies",
                bg: "bg-blue-700/50",
              },
              {
                icon: "ri-building-line",
                title: "Corporate CSR",
                desc: "Partner with us to bring personalised stories to underserved children in your community.",
                link: "/csr",
                linkLabel: "Explore CSR",
                bg: "bg-emerald-700/50",
              },
            ].map(({ icon, title, desc, link, linkLabel, bg }) => (
              <div key={title} className={`${bg} rounded-2xl p-6 border border-white/10`}>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl mb-4">
                  <i className={icon}></i>
                </div>
                <h3 className="text-xl font-bold mb-2">{title}</h3>
                <p className="text-indigo-200 text-sm leading-relaxed mb-4">{desc}</p>
                <Link
                  href={link}
                  className="inline-flex items-center gap-1 text-sm font-medium text-white/80 hover:text-white transition-colors"
                >
                  {linkLabel} <i className="ri-arrow-right-line"></i>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Families Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "My daughter screamed when she heard her name in the story. She's asked for it every single night since.",
                name: "Sarah M.",
                role: "Mum of a 6-year-old",
                stars: 5,
              },
              {
                quote: "The football academy stories gave our son something to hold onto during a really tough season. He carries it everywhere.",
                name: "James & Priya K.",
                role: "Parents of a U12 academy player",
                stars: 5,
              },
              {
                quote: "We've tried so many apps, but nothing made him actually want to sit and read until this. It's magical.",
                name: "Claire T.",
                role: "Mum of two",
                stars: 5,
              },
            ].map(({ quote, name, role, stars }) => (
              <div key={name} className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: stars }).map((_, i) => (
                    <i key={i} className="ri-star-fill text-amber-400 text-sm"></i>
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4 italic">"{quote}"</p>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{name}</div>
                  <div className="text-gray-400 text-xs">{role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-br from-indigo-50 to-orange-50 rounded-3xl p-10 border border-indigo-100">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-3xl text-white mx-auto mb-6"
              style={{ backgroundColor: "#6366f1" }}
            >
              <i className="ri-gift-line"></i>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Story Awaits</h2>
            <p className="text-lg text-gray-600 mb-8">
              Join 1,200+ families creating magical memories together. Your child's first personalised adventure is our gift to you.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/characters/create"
                className="px-8 py-4 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
                style={{ backgroundColor: "#6366f1" }}
              >
                Create Your Character
              </Link>
              <Link
                href="/stories/time-travelling-tractor"
                className="px-8 py-4 border-2 text-indigo-600 font-semibold text-lg rounded-xl hover:bg-indigo-50 transition-colors"
                style={{ borderColor: "#6366f1" }}
              >
                Try the Story Engine
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
