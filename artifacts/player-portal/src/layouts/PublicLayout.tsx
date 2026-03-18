import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { publicAssetUrl } from "@/lib/publicAssetUrl";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      setShowScrollTop(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location]);

  const isActive = (path: string) => location === path;

  const navLinkClass = (path: string) =>
    `text-sm font-medium transition-colors ${
      isActive(path)
        ? "text-amber-500 border-b-2 border-amber-500 pb-0.5"
        : "text-gray-600 hover:text-gray-900"
    }`;

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* ── Header ───────────────────────────────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.96)",
          backdropFilter: "blur(12px)",
          boxShadow: scrolled ? "0 1px 16px rgba(0,0,0,0.10)" : "0 1px 0 rgba(0,0,0,0.07)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0 shadow-sm"
              style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)" }}
            >
              🌙
            </div>
            <span className="font-bold text-gray-900 text-sm leading-tight">
              Me Time<br />
              <span className="text-amber-500 text-[11px] font-semibold tracking-wide">Stories</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 ml-8">
            <Link href="/" className={navLinkClass("/")}>Home</Link>
            <Link href="/about" className={navLinkClass("/about")}>About</Link>
            <Link href="/families" className={navLinkClass("/families")}>For Families</Link>
            <Link href="/for-authors" className={navLinkClass("/for-authors")}>For Authors</Link>

            {/* Solutions dropdown */}
            <div className="relative">
              <button
                onClick={() => setSolutionsOpen(!solutionsOpen)}
                onBlur={() => setTimeout(() => setSolutionsOpen(false), 150)}
                className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Solutions
                <i className={`ri-arrow-down-s-line transition-transform ${solutionsOpen ? "rotate-180" : ""}`}></i>
              </button>
              {solutionsOpen && (
                <div className="absolute left-0 mt-2 w-52 bg-white rounded-xl shadow-xl py-2 border border-gray-100 z-50">
                  <Link href="/for-academies" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700">
                    <i className="ri-school-line text-blue-600"></i> Football Academies
                  </Link>
                  <Link href="/csr" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700">
                    <i className="ri-building-line text-green-600"></i> Corporate CSR
                  </Link>
                  <Link href="/football-matrix" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700">
                    <i className="ri-football-line text-orange-500"></i> Football Matrix
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Desktop CTA buttons */}
          <div className="hidden md:flex items-center gap-2.5">
            <Link
              href="/stories/time-travelling-tractor"
              className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-lg transition-all hover:bg-orange-50"
              style={{ color: "#f97316" }}
            >
              🚜 Try Free Story
            </Link>
            <Link
              href="/portal"
              className="px-4 py-2 text-sm font-semibold rounded-lg transition-all hover:bg-amber-50"
              style={{ color: "#92400e", border: "1.5px solid rgba(249,115,22,0.25)" }}
            >
              Sign In
            </Link>
            <Link
              href="/characters/create"
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-lg transition-all hover:scale-[1.03] hover:shadow-md shadow-sm"
              style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)", color: "#1a0800" }}
            >
              ✨ Build Character
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden w-9 h-9 flex items-center justify-center text-gray-600 hover:text-gray-900"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <i className="ri-menu-line text-xl"></i>
          </button>
        </div>
      </header>

      {/* ── Mobile menu overlay ───────────────────────────────────────── */}
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] transition-opacity duration-300"
        style={{
          background: "rgba(0,0,0,0.50)",
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? "auto" : "none",
        }}
        onClick={() => setMobileOpen(false)}
      />
      {/* Drawer */}
      <div
        className="fixed right-0 top-0 h-full w-72 z-[70] shadow-2xl flex flex-col"
        style={{
          background: "#fef9f0",
          transform: mobileOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.30s cubic-bezier(0.32, 0.72, 0, 1)",
        }}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b" style={{ borderColor: "#fde68a" }}>
          <span className="font-bold text-gray-900" style={{ fontFamily: "Pacifico, cursive", fontSize: 18 }}>
            🌙 Me Time Stories
          </span>
          <button
            onClick={() => setMobileOpen(false)}
            className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-900 rounded-lg hover:bg-amber-100 transition-colors"
          >
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-6 py-5">
          <div className="space-y-1">
            {[
              { href: "/", label: "🏠 Home" },
              { href: "/about", label: "📖 About" },
              { href: "/families", label: "👨‍👩‍👧 For Families" },
              { href: "/for-authors", label: "✍️ For Authors" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  isActive(href)
                    ? "bg-amber-100 text-amber-800"
                    : "text-gray-700 hover:bg-amber-50 hover:text-amber-700"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="mt-5 pt-5 border-t" style={{ borderColor: "#fde68a" }}>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-4 mb-3">Solutions</p>
            <div className="space-y-1">
              <Link href="/for-academies" className="flex items-center gap-2 px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                <i className="ri-school-line text-blue-600"></i> Football Academies
              </Link>
              <Link href="/csr" className="flex items-center gap-2 px-4 py-3 rounded-xl text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors">
                <i className="ri-building-line text-green-600"></i> Corporate CSR
              </Link>
              <Link href="/football-matrix" className="flex items-center gap-2 px-4 py-3 rounded-xl text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors">
                <i className="ri-football-line text-orange-500"></i> Football Matrix
              </Link>
            </div>
          </div>
        </nav>

        <div className="px-6 py-5 border-t space-y-3" style={{ borderColor: "#fde68a" }}>
          <Link
            href="/characters/create"
            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 font-bold rounded-xl text-amber-900 shadow-md"
            style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)" }}
          >
            ✨ Build Character
          </Link>
          <Link
            href="/stories/time-travelling-tractor"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-orange-200 text-orange-700 font-semibold rounded-xl hover:bg-orange-50 transition-colors"
          >
            🚜 Try Free Story
          </Link>
          <Link
            href="/portal"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors"
          >
            Staff Sign In
          </Link>
        </div>
      </div>

      {/* ── Page content ─────────────────────────────────────────────── */}
      <main className="flex-1 pt-[60px]">
        {children}
      </main>

      {/* ── Scroll to top ────────────────────────────────────────────── */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
        style={{
          background: "linear-gradient(135deg, #f97316, #fbbf24)",
          color: "#1a0800",
          opacity: showScrollTop ? 1 : 0,
          pointerEvents: showScrollTop ? "auto" : "none",
          transform: showScrollTop ? "translateY(0) scale(1)" : "translateY(8px) scale(0.9)",
        }}
      >
        <i className="ri-arrow-up-s-line text-lg font-bold"></i>
      </button>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer style={{ background: "#0d0a08", color: "rgba(254,243,226,0.80)" }}>
        <div className="max-w-7xl mx-auto px-4 py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <span className="text-2xl mb-3 block" style={{ fontFamily: "Pacifico, cursive", color: "#fbbf24" }}>
                Me Time Stories
              </span>
              <p className="text-sm leading-relaxed max-w-xs mb-5" style={{ color: "rgba(254,243,226,0.45)" }}>
                Fully personalised children's books where your child's name, personality, favourite animal, and biggest dreams live on every page — not just the cover.
              </p>
              <div className="flex gap-3">
                {["ri-instagram-line", "ri-twitter-x-line", "ri-facebook-line", "ri-linkedin-line"].map((icon) => (
                  <a
                    key={icon}
                    href="#"
                    className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-amber-400/20 transition-colors"
                    style={{ background: "rgba(254,243,226,0.08)" }}
                  >
                    <i className={`${icon} text-sm`}></i>
                  </a>
                ))}
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "rgba(254,243,226,0.35)" }}>Product</h4>
              <ul className="space-y-2.5">
                {[
                  { href: "/characters/create", label: "Build Your Character" },
                  { href: "/stories/time-travelling-tractor", label: "🚜 Try Free Story" },
                  { href: "/families", label: "For Families" },
                  { href: "/for-authors", label: "For Authors" },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="text-sm hover:text-amber-300 transition-colors" style={{ color: "rgba(254,243,226,0.45)" }}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Solutions */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "rgba(254,243,226,0.35)" }}>Solutions</h4>
              <ul className="space-y-2.5">
                {[
                  { href: "/for-academies", label: "Football Academies" },
                  { href: "/csr", label: "Corporate CSR" },
                  { href: "/football-matrix", label: "Football Matrix" },
                  { href: "/about", label: "About Us" },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="text-sm hover:text-amber-300 transition-colors" style={{ color: "rgba(254,243,226,0.45)" }}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-3" style={{ borderColor: "rgba(254,243,226,0.08)" }}>
            <p className="text-sm" style={{ color: "rgba(254,243,226,0.25)" }}>© 2025 Me Time Stories Ltd. All rights reserved.</p>
            <div className="flex gap-5 text-sm" style={{ color: "rgba(254,243,226,0.25)" }}>
              <a href="#" className="hover:text-amber-300 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-amber-300 transition-colors">Terms of Service</a>
              <Link href="/portal" className="hover:text-amber-300 transition-colors">Staff Portal</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
