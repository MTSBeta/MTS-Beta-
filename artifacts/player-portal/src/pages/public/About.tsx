import { Link } from "wouter";
import { PublicLayout } from "@/layouts/PublicLayout";

export default function About() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="w-full h-[400px] md:h-[500px] bg-cover bg-center relative flex items-center"
          style={{
            background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #0ea5e9 100%)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 to-white/30" />
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Story</h1>
              <p className="text-xl text-gray-700 mb-8">
                We're on a mission to revolutionise children's literature through personalised storytelling technology that connects families and inspires imagination.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#mission"
                  className="px-6 py-3 text-white font-medium rounded-xl transition-colors"
                  style={{ backgroundColor: "#4f46e5" }}
                >
                  Our Mission
                </a>
                <a
                  href="#journey"
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Our Journey
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section id="mission" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission & Values</h2>
            <p className="text-lg text-gray-600">
              At Me Time Stories, we believe in the power of personalised storytelling to create meaningful connections between children and their families while fostering a love for reading.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "ri-heart-3-line",
                title: "Personalised Experience",
                desc: "We create stories that adapt to each child, making them the hero of their own adventure and creating a deeper emotional connection to reading.",
              },
              {
                icon: "ri-book-open-line",
                title: "Educational Growth",
                desc: "Our stories are designed to support developmental milestones, encourage imagination, and build essential literacy skills in an engaging way.",
              },
              {
                icon: "ri-community-line",
                title: "Family Connection",
                desc: "We strengthen bonds between parents and children through shared reading experiences that create lasting memories and meaningful conversations.",
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-white p-8 rounded-2xl shadow-sm">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: "#ede9fe" }}>
                  <i className={`${icon} text-2xl`} style={{ color: "#4f46e5" }}></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section id="journey" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-lg text-gray-600">
              From concept to reality, follow the evolution of Me Time Stories as we've grown from a simple idea to a revolutionary platform for personalised children's literature.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-8">
            {[
              {
                year: "2022",
                title: "Early Development",
                desc: "Started building the technology foundation in stealth mode, designing our modular, open-source architecture for future scalability.",
                items: ["Technology foundation initiation", "Beginning of stealth mode development", "Start of modular architecture design"],
                current: false,
              },
              {
                year: "2023–2024",
                title: "Core Development",
                desc: "Focused on building our Dynamic Personalization Framework (DPF), integrating narrative logic with character adaptation systems.",
                items: ["DPF (Dynamic Personalisation Framework) creation", "Dashboard development for parents and children", "Print token system implementation", "IP security establishment"],
                current: false,
              },
              {
                year: "January 2025",
                title: "Official Launch",
                desc: "Registered the company and officially exited stealth mode with a library of over 100 personalised stories ready for families.",
                items: ["Company registration", "Exit from stealth mode", "100+ story library achievement"],
                current: false,
              },
              {
                year: "Now",
                title: "Growing Together",
                desc: "Prototype completed and partnering with football academies and corporate CSR programmes. Seeking development funding to scale nationally.",
                items: ["Football Academy partnerships live", "Platform ready for customer use", "Printer partnership establishment"],
                current: true,
              },
            ].map(({ year, title, desc, items, current }) => (
              <div
                key={year}
                className={`flex gap-6 p-6 rounded-2xl border ${current ? "border-indigo-200 bg-indigo-50" : "border-gray-100 bg-gray-50"}`}
              >
                <div className="flex-shrink-0">
                  <span
                    className="inline-block px-3 py-1 text-sm font-medium rounded-full"
                    style={{
                      backgroundColor: current ? "#4f46e5" : "#ede9fe",
                      color: current ? "#fff" : "#4f46e5",
                    }}
                  >
                    {year}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{desc}</p>
                  <ul className="space-y-1.5">
                    {items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                        <i className="ri-check-line flex-shrink-0 mt-0.5" style={{ color: "#4f46e5" }}></i>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Foundation */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Technology Foundation</h2>
            <p className="text-lg text-gray-600">
              Our innovative technology platform combines advanced personalisation algorithms with intuitive interfaces to create truly unique storytelling experiences.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "ri-layout-grid-line",
                title: "Modular Architecture",
                desc: "Our open-source architecture ensures flexibility, cost efficiency, and future scalability as we grow.",
                items: ["Component-based design for easy updates", "Seamless integration capabilities", "Optimised for performance and reliability"],
              },
              {
                icon: "ri-code-box-line",
                title: "Dynamic Personalisation Framework",
                desc: "Our proprietary DPF integrates narrative logic, character adaptation, and data-driven personalisation.",
                items: ["Advanced narrative branching system", "Character trait integration engine", "Cultural and contextual adaptation"],
              },
              {
                icon: "ri-printer-line",
                title: "Print & Digital Ready",
                desc: "Stories designed for beautiful physical books as well as digital reading experiences.",
                items: ["Print-ready PDF generation", "Digital interactive reading mode", "Established printer partnerships"],
              },
            ].map(({ icon, title, desc, items }) => (
              <div key={title} className="bg-white p-8 rounded-2xl shadow-sm">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: "#ede9fe" }}>
                  <i className={`${icon} text-2xl`} style={{ color: "#4f46e5" }}></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-600 text-sm mb-4">{desc}</p>
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                      <i className="ri-check-line flex-shrink-0 mt-0.5" style={{ color: "#4f46e5" }}></i>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Be Part of Our Story</h2>
          <p className="text-lg text-gray-600 mb-8">
            Whether you're a parent, an academy, or a corporate partner — we'd love to work with you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/characters/create"
              className="px-8 py-3 text-white font-semibold rounded-xl"
              style={{ backgroundColor: "#4f46e5" }}
            >
              Start Creating
            </Link>
            <Link
              href="/for-academies"
              className="px-8 py-3 border-2 font-semibold rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
              style={{ borderColor: "#e5e7eb" }}
            >
              Academy Partnerships
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
