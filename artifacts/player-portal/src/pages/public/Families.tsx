import { Link } from "wouter";
import { PublicLayout } from "@/layouts/PublicLayout";

export default function Families() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section
        className="py-24 md:py-32 text-center relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #fdf4ff 0%, #fce7f3 50%, #ede9fe 100%)" }}
      >
        <div className="max-w-4xl mx-auto px-4">
          <span className="inline-block bg-pink-100 text-pink-600 text-sm font-medium px-4 py-2 rounded-full mb-6">
            🏡 For Families
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Bedtime Stories That Are{" "}
            <span style={{ color: "#a855f7" }}>All About Them</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Imagine opening a book and seeing your child's name on every page — not just stamped in, but woven into an adventure that reflects exactly who they are.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/characters/create"
              className="px-8 py-4 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
              style={{ backgroundColor: "#a855f7" }}
            >
              Create Your Child's Character
            </Link>
            <Link
              href="/stories/time-travelling-tractor"
              className="px-8 py-4 border-2 text-purple-600 font-semibold text-lg rounded-xl hover:bg-purple-50 transition-colors"
              style={{ borderColor: "#a855f7" }}
            >
              Try a Sample Story
            </Link>
          </div>
        </div>
      </section>

      {/* How it works for families */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Made for Families Like Yours</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "ri-pencil-ruler-line", label: "Tell us about your child", desc: "Name, age, favourite things, personality, and dreams." },
              { icon: "ri-magic-line", label: "We craft the story", desc: "Our team weaves all those details into a unique adventure." },
              { icon: "ri-book-open-line", label: "Read together", desc: "Digital or beautifully printed — yours to keep forever." },
              { icon: "ri-heart-pulse-line", label: "Watch them grow", desc: "Stories that build confidence, empathy, and a love of reading." },
            ].map(({ icon, label, desc }) => (
              <div key={label} className="text-center p-6 rounded-2xl bg-purple-50 border border-purple-100">
                <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-2xl text-purple-600 mx-auto mb-4">
                  <i className={icon}></i>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{label}</h3>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story themes */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Story Themes For Every Child</h2>
            <p className="text-gray-600 max-w-xl mx-auto">Whatever your child is going through, we have a story that meets them there.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { emoji: "🚀", label: "Adventure & Bravery" },
              { emoji: "🦁", label: "Confidence Building" },
              { emoji: "🌈", label: "Friendship" },
              { emoji: "🏫", label: "Starting School" },
              { emoji: "💤", label: "Bedtime & Calm" },
              { emoji: "🌊", label: "Nature & Animals" },
              { emoji: "⚽", label: "Sport & Teamwork" },
              { emoji: "🧠", label: "Emotional Wellbeing" },
            ].map(({ emoji, label }) => (
              <div key={label} className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-gray-100 shadow-sm">
                <span className="text-2xl">{emoji}</span>
                <span className="text-sm font-medium text-gray-700">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white text-center">
        <div className="max-w-xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Give Them a Story That's Truly Theirs</h2>
          <p className="text-gray-600 mb-8">Start with your child's character and we'll do the rest.</p>
          <Link
            href="/characters/create"
            className="inline-block px-10 py-4 text-white font-semibold text-lg rounded-xl shadow-lg"
            style={{ backgroundColor: "#a855f7" }}
          >
            Create Their Character — Free
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
