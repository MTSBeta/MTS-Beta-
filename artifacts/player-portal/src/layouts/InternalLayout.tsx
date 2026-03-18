import React, { useState } from "react";
import { useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  LogOut,
  Menu,
  X,
  Feather,
  ChevronRight,
  Palette,
  StickyNote,
} from "lucide-react";
import { useStaffAuth } from "@/hooks/useStaffAuth";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Stories Dashboard", href: "/internal/stories", icon: <LayoutDashboard size={16} /> },
];

interface PlayerNavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const PLAYER_NAV: PlayerNavItem[] = [
  { label: "Profile", path: "profile", icon: <BookOpen size={14} /> },
  { label: "Blueprint", path: "blueprint", icon: <Feather size={14} /> },
  { label: "Story Builder", path: "builder", icon: <BookOpen size={14} /> },
  { label: "Illustrations", path: "illustrations", icon: <Palette size={14} /> },
  { label: "Production Notes", path: "notes", icon: <StickyNote size={14} /> },
];

interface InternalLayoutProps {
  children: React.ReactNode;
  playerId?: string;
  playerName?: string;
}

export function InternalLayout({ children, playerId, playerName }: InternalLayoutProps) {
  const { staffUser, logout } = useStaffAuth();
  const [location, navigate] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/staff-login");
  };

  const ACCENT = "#a78bfa";

  const NavContent = () => (
    <>
      <div className="p-5 border-b border-white/8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#1a1a2e" }}>
            <Feather size={18} className="text-violet-400" />
          </div>
          <div className="min-w-0">
            <div className="text-white font-bold text-sm truncate">Me Time Stories</div>
            <div className="text-white/40 text-xs">Production Workspace</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  isActive ? "text-violet-300" : "text-white/50 hover:text-white/80 hover:bg-white/5"
                }`}
                style={isActive ? { background: `${ACCENT}18` } : {}}
              >
                {item.icon}
                {item.label}
              </div>
            </Link>
          );
        })}

        {playerId && (
          <div className="mt-4 pt-4 border-t border-white/8">
            <div className="px-3 mb-2">
              <div className="text-white/30 text-[10px] uppercase tracking-widest font-medium">Current Player</div>
              <div className="text-white/70 text-xs font-semibold truncate mt-0.5">{playerName || "Player"}</div>
            </div>
            {PLAYER_NAV.map((item) => {
              const href = `/internal/stories/${playerId}/${item.path}`;
              const isActive = location.startsWith(href);
              return (
                <Link key={item.path} href={href}>
                  <div
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      isActive ? "text-violet-300" : "text-white/40 hover:text-white/70 hover:bg-white/5"
                    }`}
                    style={isActive ? { background: `${ACCENT}18` } : {}}
                  >
                    {item.icon}
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-white/8">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-violet-300 text-xs font-bold flex-shrink-0" style={{ background: "#1a1a2e" }}>
            {staffUser?.name?.charAt(0)?.toUpperCase() || "S"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-white text-xs font-medium truncate">{staffUser?.name}</div>
            <div className="text-white/30 text-[10px] truncate">{staffUser?.email}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/staff-dashboard">
            <div className="text-white/30 hover:text-white/60 text-xs transition-colors cursor-pointer flex items-center gap-1">
              <ChevronRight size={12} />
              Academy Portal
            </div>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-white/30 hover:text-red-400 text-xs transition-colors ml-auto"
          >
            <LogOut size={12} />
            Sign out
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen w-full flex" style={{ background: "#080810" }}>
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 20% 0%, rgba(167,139,250,0.04) 0%, transparent 60%)" }} />
      </div>

      <aside className="hidden lg:flex flex-col w-60 fixed inset-y-0 left-0 z-30 border-r border-white/[0.06] overflow-hidden" style={{ background: "rgba(10,10,20,0.95)" }}>
        <NavContent />
      </aside>

      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-13 flex items-center justify-between px-4 border-b border-white/8" style={{ height: 52, background: "rgba(8,8,16,0.95)" }}>
        <div className="flex items-center gap-2">
          <Feather size={16} className="text-violet-400" />
          <span className="text-white text-sm font-bold">MeTime Production</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white/50 hover:text-white p-1.5">
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-40"
              style={{ background: "rgba(0,0,0,0.7)" }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 flex flex-col border-r border-white/8"
              style={{ background: "#0a0a14" }}
            >
              <NavContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 lg:ml-60 min-h-screen relative z-10">
        <div className="pt-[52px] lg:pt-0 relative z-10">
          <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
}
