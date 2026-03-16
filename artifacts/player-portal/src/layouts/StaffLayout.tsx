import React, { useState } from "react";
import { useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  UserCog,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
} from "lucide-react";
import { useStaffAuth } from "@/hooks/useStaffAuth";
import { ROLE_LABELS } from "@/data/staffQuestions";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/staff-dashboard", icon: <LayoutDashboard size={18} /> },
  { label: "Players", href: "/staff/players", icon: <Users size={18} /> },
  { label: "Team", href: "/staff/team", icon: <UserCog size={18} />, adminOnly: true },
  { label: "Settings", href: "/staff/settings", icon: <Settings size={18} />, adminOnly: true },
];

export function StaffLayout({ children }: { children: React.ReactNode }) {
  const { staffUser, logout } = useStaffAuth();
  const [location, navigate] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = staffUser?.role === "academy_admin";
  const visibleItems = NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin);
  const primaryColor = staffUser?.academyPrimaryColor || "#3b82f6";

  const handleLogout = () => {
    logout();
    navigate("/staff-login");
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] flex">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-white/[0.01]" />
      </div>

      <aside className="hidden lg:flex flex-col w-64 fixed inset-y-0 left-0 z-30 bg-black/60 backdrop-blur-xl border-r border-white/8">
        <div className="p-5 border-b border-white/8">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm font-display"
              style={{ background: primaryColor }}
            >
              <Shield size={20} />
            </div>
            <div className="min-w-0">
              <div className="text-white font-bold text-sm truncate">
                {staffUser?.academyName || "Academy"}
              </div>
              <div className="text-white/40 text-xs">Staff Portal</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {visibleItems.map((item) => {
            const isActive = location === item.href || (item.href !== "/staff-dashboard" && location.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? "text-white"
                      : "text-white/50 hover:text-white/80 hover:bg-white/5"
                  }`}
                  style={isActive ? { background: `${primaryColor}20`, color: primaryColor } : {}}
                >
                  {item.icon}
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/8">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
              style={{ background: `${primaryColor}30` }}
            >
              {staffUser?.name?.charAt(0)?.toUpperCase() || "S"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-white text-sm font-medium truncate">{staffUser?.name}</div>
              <div className="text-white/40 text-xs truncate">
                {ROLE_LABELS[staffUser?.role || ""] || staffUser?.role}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-white/40 hover:text-red-400 text-xs transition-colors w-full px-1"
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      </aside>

      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-black/80 backdrop-blur-xl border-b border-white/8 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs"
            style={{ background: primaryColor }}
          >
            <Shield size={16} />
          </div>
          <span className="text-white font-bold text-sm">{staffUser?.academyName}</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-white/60 hover:text-white p-2"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-40 bg-black/60"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-[#0a0a0a] border-r border-white/8"
            >
              <div className="p-5 border-b border-white/8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
                      style={{ background: primaryColor }}
                    >
                      <Shield size={18} />
                    </div>
                    <div>
                      <div className="text-white font-bold text-sm">{staffUser?.academyName}</div>
                      <div className="text-white/40 text-xs">Staff Portal</div>
                    </div>
                  </div>
                  <button onClick={() => setMobileOpen(false)} className="text-white/40 p-1">
                    <X size={18} />
                  </button>
                </div>
              </div>
              <nav className="py-4 px-3 space-y-1">
                {visibleItems.map((item) => {
                  const isActive = location === item.href || (item.href !== "/staff-dashboard" && location.startsWith(item.href));
                  return (
                    <Link key={item.href} href={item.href}>
                      <div
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                          isActive ? "text-white" : "text-white/50 hover:text-white/80 hover:bg-white/5"
                        }`}
                        style={isActive ? { background: `${primaryColor}20`, color: primaryColor } : {}}
                      >
                        {item.icon}
                        {item.label}
                      </div>
                    </Link>
                  );
                })}
              </nav>
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/8">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: `${primaryColor}30` }}
                  >
                    {staffUser?.name?.charAt(0)?.toUpperCase() || "S"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-white text-sm font-medium truncate">{staffUser?.name}</div>
                    <div className="text-white/40 text-xs">
                      {ROLE_LABELS[staffUser?.role || ""] || staffUser?.role}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-white/40 hover:text-red-400 text-xs transition-colors"
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 lg:ml-64 min-h-screen relative z-10">
        <div className="pt-14 lg:pt-0">
          <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
}
