import { Link } from "wouter";
import { PublicLayout } from "@/layouts/PublicLayout";

export default function ForAuthors() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section
        className="py-24 md:py-32 text-center relative"
        style={{ background: "linear-gradient(135deg, #fefce8 0%, #fef9c3 50%, #ecfdf5 100%)" }}
      >
        <div className="max-w-4xl mx-auto px-4">
          <span className="inline-block bg-amber-100 text-amber-700 text-sm font-medium px-4 py-2 rounded-full mb-6">
            ✍️ For Authors & Illustrators
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Your Stories. <span style={{ color: "#d97706" }}>Their Hero.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Partner with Me Time Stories to bring your narrative talent to thousands of families. We provide the personalisation engine — you bring the magic of storytelling.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:authors@metimestories.com"
              className="px-8 py-4 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
              style={{ backgroundColor: "#d97706" }}
            >
              Apply to Partner
            </a>
            <a
              href="#how-it-works"
              className="px-8 py-4 border-2 text-amber-600 font-semibold text-lg rounded-xl hover:bg-amber-50 transition-colors"
              style={{ borderColor: "#d97706" }}
            >
              Learn How It Works
            </a>
          </div>
        </div>
      </section>

      {/* How it works for authors */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How the Author Partnership Works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: "ri-file-text-line",
                title: "Submit Your Story Framework",
                desc: "Provide your story structure — characters, plot arc, themes, and key moments. We integrate it with our personalisation engine.",
              },
              {
                step: "02",
                icon: "ri-settings-3-line",
                title: "We Handle the Personalisation",
                desc: "Our DPF (Dynamic Personalisation Framework) weaves each child's name, traits, and personality into your story framework.",
              },
              {
                step: "03",
                icon: "ri-money-pound-circle-line",
                title: "Earn from Every Story",
                desc: "Every time a family purchases a story based on your framework, you receive a royalty. Scale your income through our growing platform.",
              },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} className="text-center p-8 rounded-2xl bg-amber-50 border border-amber-100">
                <div className="text-4xl font-black text-amber-200 mb-4">{step}</div>
                <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-2xl text-amber-600 mx-auto mb-4">
                  <i className={icon}></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we look for */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">What We Look For in Authors</h2>
              <ul className="space-y-4">
                {[
                  { icon: "ri-heart-line", text: "A genuine love of children's storytelling and child development" },
                  { icon: "ri-user-star-line", text: "Diverse voices and authentic representations of childhood experiences" },
                  { icon: "ri-puzzle-line", text: "Flexible, modular narrative structures that work across different personalisation parameters" },
                  { icon: "ri-shield-check-line", text: "Age-appropriate content that meets our editorial and safeguarding standards" },
                  { icon: "ri-global-line", text: "Stories that work across cultural backgrounds and represent the real diversity of British children" },
                ].map(({ icon, text }) => (
                  <li key={text} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <i className={`${icon} text-amber-600 text-sm`}></i>
                    </div>
                    <p className="text-gray-700">{text}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Author Benefits</h3>
              <div className="space-y-4">
                {[
                  { icon: "ri-coins-line", label: "Royalties on every story sold", color: "#d97706" },
                  { icon: "ri-global-line", label: "National reach through academy partnerships", color: "#10b981" },
                  { icon: "ri-tools-line", label: "Our team handles all personalisation tech", color: "#6366f1" },
                  { icon: "ri-book-mark-line", label: "Your work in thousands of homes", color: "#f43f5e" },
                  { icon: "ri-award-line", label: "Author profile and credit on every story", color: "#8b5cf6" },
                ].map(({ icon, label, color }) => (
                  <div key={label} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}20` }}>
                      <i className={`${icon} text-sm`} style={{ color }}></i>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white text-center">
        <div className="max-w-xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Partner?</h2>
          <p className="text-gray-600 mb-8">
            We're currently onboarding our founding cohort of author partners. Apply now and help shape the future of personalised children's books.
          </p>
          <a
            href="mailto:authors@metimestories.com"
            className="inline-block px-10 py-4 text-white font-semibold text-lg rounded-xl shadow-lg"
            style={{ backgroundColor: "#d97706" }}
          >
            Apply to Become an Author Partner
          </a>
          <p className="mt-4 text-sm text-gray-400">We review all applications within 5 business days.</p>
        </div>
      </section>
    </PublicLayout>
  );
}
