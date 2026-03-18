import { useState } from "react";
import { Link, useLocation } from "wouter";
import { publicAssetUrl } from "@/lib/publicAssetUrl";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  const navLinkClass = (path: string) =>
    `text-sm font-medium transition-colors ${
      isActive(path)
        ? "text-indigo-600 border-b-2 border-indigo-600 pb-0.5"
        : "text-gray-600 hover:text-gray-900"
    }`;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img
              src={publicAssetUrl("images/metime-logo.png")}
              alt="Me Time Stories"
              className="h-8 w-auto object-contain"
              style={{ filter: "brightness(0) saturate(100%) invert(37%) sepia(67%) saturate(5000%) hue-rotate(230deg) brightness(100%) contrast(100%)" }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
                (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = "block";
              }}
            />
            <span
              className="text-2xl hidden"
              style={{ fontFamily: "Pacifico, cursive", color: "#6366f1" }}
            >
              Me Time
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
                <div className="absolute left-0 mt-2 w-52 bg-white rounded-xl shadow-lg py-2 border border-gray-100 z-50">
                  <Link
                    href="/for-academies"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <i className="ri-school-line text-blue-600"></i>
                    Football Academies
                  </Link>
                  <Link
                    href="/csr"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <i className="ri-building-line text-green-600"></i>
                    Corporate CSR
                  </Link>
                  <Link
                    href="/football-matrix"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <i className="ri-football-line text-orange-500"></i>
                    Football Matrix
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* CTA buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/stories/time-travelling-tractor"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Try Beta Engine
            </Link>
            <Link
              href="/portal"
              className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/characters/create"
              className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors"
              style={{ backgroundColor: "#6366f1" }}
            >
              Get Started
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden w-9 h-9 flex items-center justify-center text-gray-600 hover:text-gray-900"
            onClick={() => setMobileOpen(true)}
          >
            <i className="ri-menu-line text-xl"></i>
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-black/50" onClick={() => setMobileOpen(false)}>
          <div
            className="absolute right-0 top-0 h-full w-72 bg-white shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <span className="text-xl font-semibold text-gray-900">Menu</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900"
              >
                <i className="ri-close-line text-lg"></i>
              </button>
            </div>
            <nav className="flex flex-col gap-4">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About" },
                { href: "/families", label: "For Families" },
                { href: "/for-authors", label: "For Authors" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-base font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
                </Link>
              ))}
              <div className="border-t border-gray-100 pt-4 mt-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Solutions</p>
                <Link href="/for-academies" className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 mb-3" onClick={() => setMobileOpen(false)}>
                  <i className="ri-school-line"></i> Football Academies
                </Link>
                <Link href="/csr" className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 mb-3" onClick={() => setMobileOpen(false)}>
                  <i className="ri-building-line"></i> Corporate CSR
                </Link>
                <Link href="/football-matrix" className="flex items-center gap-2 text-gray-700 hover:text-indigo-600" onClick={() => setMobileOpen(false)}>
                  <i className="ri-football-line"></i> Football Matrix
                </Link>
              </div>
              <div className="border-t border-gray-100 pt-4 mt-2 flex flex-col gap-3">
                <Link
                  href="/stories/time-travelling-tractor"
                  className="px-4 py-2.5 text-center text-sm font-medium text-indigo-600 border-2 border-indigo-600 rounded-lg"
                  onClick={() => setMobileOpen(false)}
                >
                  Try Beta Engine
                </Link>
                <Link
                  href="/portal"
                  className="px-4 py-2.5 text-center text-sm font-medium text-gray-600 border border-gray-200 rounded-lg"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/characters/create"
                  className="px-4 py-2.5 text-center text-sm font-medium text-white rounded-lg"
                  style={{ backgroundColor: "#6366f1" }}
                  onClick={() => setMobileOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Page content (with header offset) */}
      <main className="flex-1 pt-[60px]">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <span
                className="text-2xl mb-3 block"
                style={{ fontFamily: "Pacifico, cursive", color: "#818cf8" }}
              >
                Me Time Stories
              </span>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                Where imagination meets the heart. Personalized children's stories crafted around every unique child's world.
              </p>
              <div className="flex gap-3 mt-4">
                {["ri-instagram-line", "ri-twitter-x-line", "ri-facebook-line", "ri-linkedin-line"].map((icon) => (
                  <a
                    key={icon}
                    href="#"
                    className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                  >
                    <i className={`${icon} text-sm`}></i>
                  </a>
                ))}
              </div>
            </div>

            {/* Stories */}
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Product</h4>
              <ul className="space-y-2">
                {[
                  { href: "/characters/create", label: "Create Character" },
                  { href: "/stories/time-travelling-tractor", label: "Story Engine" },
                  { href: "/families", label: "For Families" },
                  { href: "/for-authors", label: "For Authors" },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="text-gray-400 text-sm hover:text-white transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Solutions */}
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Solutions</h4>
              <ul className="space-y-2">
                {[
                  { href: "/for-academies", label: "Football Academies" },
                  { href: "/csr", label: "Corporate CSR" },
                  { href: "/football-matrix", label: "Football Matrix" },
                  { href: "/about", label: "About Us" },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="text-gray-400 text-sm hover:text-white transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-gray-500 text-sm">© 2025 Me Time Stories Ltd. All rights reserved.</p>
            <div className="flex gap-5 text-sm text-gray-500">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <Link href="/portal" className="hover:text-white transition-colors">Staff Portal</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
