"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  CalendarDays,
  ShoppingCart,
  User,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";

// ─────────────────────────────────────────────────────────────
// Navigation items
// ─────────────────────────────────────────────────────────────

const navItems = [
  { href: "/", label: "Trang chủ", icon: Home },
  { href: "/meal-plan", label: "Lên thực đơn", icon: CalendarDays },
  { href: "/grocery-store", label: "Giỏ hàng", icon: ShoppingCart },
  { href: "/profile", label: "Tài khoản", icon: User },
];

// ─────────────────────────────────────────────────────────────
// Sidebar (desktop / tablet)
// ─────────────────────────────────────────────────────────────

function Sidebar({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
}) {
  const pathname = usePathname();
  const { cartItemCount } = useAppContext();

  return (
    <aside
      className={`
        hidden md:flex flex-col sticky top-0 h-screen z-40
        bg-surface border-r border-outline-variant
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-[72px]" : "w-[260px]"}
      `}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-outline-variant">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <h1 className="font-bold text-lg text-on-surface tracking-tight">
                SmartCart <span className="text-primary">AI</span>
              </h1>
              <p className="text-xs text-on-surface-variant -mt-0.5">
                Trợ lý đi chợ AI
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          const showBadge = item.href === "/grocery-store" && cartItemCount > 0;

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  relative flex items-center gap-3 px-3 py-3 rounded-2xl
                  transition-colors duration-200 group cursor-pointer
                  ${
                    isActive
                      ? "bg-primary/12 text-primary"
                      : "text-on-surface-variant hover:bg-on-surface/8"
                  }
                `}
              >
                {/* Active indicator pill */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-pill"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-primary"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}

                <div className="relative">
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 ${
                      isActive ? "text-primary" : "text-on-surface-variant group-hover:text-on-surface"
                    }`}
                  />
                  {/* Cart badge */}
                  {showBadge && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 text-[10px] font-bold bg-secondary text-on-secondary rounded-full flex items-center justify-center"
                    >
                      {cartItemCount > 9 ? "9+" : cartItemCount}
                    </motion.span>
                  )}
                </div>

                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className={`text-sm font-medium overflow-hidden whitespace-nowrap ${
                        isActive ? "text-primary" : ""
                      }`}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="mx-3 mb-4 p-2 rounded-xl border border-outline-variant hover:bg-on-surface/8 transition-colors flex items-center justify-center"
        aria-label={collapsed ? "Mở rộng thanh bên" : "Thu gọn thanh bên"}
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4 text-on-surface-variant" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-on-surface-variant" />
        )}
      </button>
    </aside>
  );
}

// ─────────────────────────────────────────────────────────────
// Bottom Navigation (mobile)
// ─────────────────────────────────────────────────────────────

function BottomNav() {
  const pathname = usePathname();
  const { cartItemCount } = useAppContext();

  return (
    <nav
      className="
        md:hidden fixed bottom-0 left-0 right-0 z-50
        bg-surface/80 backdrop-blur-xl
        border-t border-outline-variant
        px-2 pb-[env(safe-area-inset-bottom)]
      "
    >
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          const showBadge = item.href === "/grocery-store" && cartItemCount > 0;

          return (
            <Link key={item.href} href={item.href} className="relative flex-1">
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center gap-0.5 py-1"
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-indicator"
                    className="absolute -top-0.5 w-16 h-[3px] rounded-b-full bg-primary"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}

                <div className="relative">
                  <div
                    className={`
                      p-1.5 rounded-2xl transition-colors
                      ${isActive ? "bg-primary/12" : ""}
                    `}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        isActive
                          ? "text-primary"
                          : "text-on-surface-variant"
                      }`}
                    />
                  </div>
                  {/* Cart badge */}
                  {showBadge && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-0.5 -right-1 w-4 h-4 text-[10px] font-bold bg-secondary text-on-secondary rounded-full flex items-center justify-center"
                    >
                      {cartItemCount > 9 ? "9+" : cartItemCount}
                    </motion.span>
                  )}
                </div>

                <span
                  className={`text-[11px] font-medium ${
                    isActive
                      ? "text-primary"
                      : "text-on-surface-variant"
                  }`}
                >
                  {item.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Layout
// ─────────────────────────────────────────────────────────────

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <BottomNav />

      {/* Main content area — flexbox handles sizing automatically */}
      <main className="flex-1 pb-20 md:pb-0 min-h-screen transition-all duration-300 ease-in-out">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}
