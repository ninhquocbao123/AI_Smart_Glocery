"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  CalendarDays,
  ShoppingCart,
  User,
  Wallet,
  Tag,
  ClipboardList,
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";


import AdminShell from '@/components/admin/AdminShell';
import AIChatAssistant from "@/components/dashboard/AIChatAssistant";

// ─────────────────────────────────────────────────────────────
// Navigation items
// ─────────────────────────────────────────────────────────────

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/budget", label: "My Budget", icon: Wallet },
  { href: "/meal-plan", label: "Smart Cart", icon: CalendarDays },
  { href: "/deals", label: "Deals", icon: Tag },
  { href: "/orders", label: "Orders", icon: ClipboardList },
];

// ─────────────────────────────────────────────────────────────
// Top Navbar (desktop / tablet)
// ─────────────────────────────────────────────────────────────

function TopNavbar() {
  const pathname = usePathname();
  const { cartItemCount, state } = useAppContext();

  return (
    <header className="hidden lg:flex sticky top-0 z-40 bg-[#F4F8F1] border-b border-outline-variant/30 h-[72px] items-center px-8 justify-between shadow-sm">
      {/* Brand */}
      <Link href="/dashboard">
        <div className="flex items-center gap-2 cursor-pointer">
          <h1 className="font-bold text-lg tracking-tight text-[#0D7A25]">
            AI Smart Grocery
          </h1>
        </div>
      </Link>

      {/* Nav links */}
      <nav className="flex items-center gap-8">
        {state.user?.isAdmin && <Link href="/admin" className="text-primary font-bold">Quản trị</Link>}
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <span
                className={`text-[15px] font-bold transition-colors ${
                  isActive
                    ? "text-[#0D7A25] border-b-2 border-[#0D7A25] pb-1"
                    : "text-on-surface-variant hover:text-[#0D7A25]"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Right Actions */}
      <div className="flex items-center gap-5">
        {/* Cart */}
        <Link href="/grocery-store" className="relative cursor-pointer hover:opacity-80 transition-opacity">
          <ShoppingCart className="w-6 h-6 text-on-surface" />
          {cartItemCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 text-[10px] font-bold bg-[#F97316] text-white rounded-full flex items-center justify-center">
              {cartItemCount > 9 ? "9+" : cartItemCount}
            </span>
          )}
        </Link>

        {/* Avatar */}
        <Link href="/profile">
          <div className="w-10 h-10 rounded-full bg-surface-variant overflow-hidden border-2 border-white shadow-sm cursor-pointer hover:opacity-90">
            <span className="w-full h-full flex items-center justify-center bg-primary-container text-primary font-bold" aria-label="Hồ sơ cá nhân">{state.user?.name.slice(0,1).toUpperCase()}</span>
          </div>
        </Link>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────
// Bottom Navigation (mobile)
// ─────────────────────────────────────────────────────────────

function BottomNav() {
  const pathname = usePathname();
  const { cartItemCount } = useAppContext();

  // On mobile, maybe include Grocery Store as a tab to not lose it
  const mobileNav = [
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/budget", label: "Budget", icon: Wallet },
    { href: "/meal-plan", label: "Smart Cart", icon: CalendarDays },
    { href: "/deals", label: "Deals", icon: Tag },
    { href: "/orders", label: "Orders", icon: ClipboardList },
    { href: "/grocery-store", label: "Giỏ", icon: ShoppingCart },
    { href: "/profile", label: "Profile", icon: User },
  ];

  return (
    <nav
      className="
        lg:hidden fixed bottom-0 left-0 right-0 z-50
        bg-surface/90 backdrop-blur-xl
        border-t border-outline-variant/30
        px-2 pb-[env(safe-area-inset-bottom)]
      "
    >
      <div className="flex items-center justify-around h-16">
        {mobileNav.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          const showBadge = item.href === "/grocery-store" && cartItemCount > 0;

          return (
            <Link key={item.href} href={item.href} className="relative flex-1">
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center gap-0.5 py-1"
              >
                <div className="relative">
                  <div
                    className={`
                      p-1.5 rounded-2xl transition-colors
                      ${isActive ? "bg-primary/12 text-primary" : "text-on-surface-variant"}
                    `}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  {/* Cart badge */}
                  {showBadge && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-0.5 -right-1 w-4 h-4 text-[10px] font-bold bg-[#F97316] text-white rounded-full flex items-center justify-center"
                    >
                      {cartItemCount > 9 ? "9+" : cartItemCount}
                    </motion.span>
                  )}
                </div>
                <span
                  className={`text-[11px] font-medium ${
                    isActive ? "text-primary" : "text-on-surface-variant"
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
// Footer
// ─────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="hidden md:flex border-t border-outline-variant/30 bg-[#EFEFEF] py-8 px-8 mt-12 items-center justify-between text-sm">
      <div className="text-[#0D7A25] font-semibold">
        AI Smart Grocery
      </div>
      <div className="flex items-center gap-6 text-on-surface-variant font-medium">
        <Link href="/meal-plan">Món Việt</Link>
        <Link href="/deals">Ưu đãi</Link>
        <Link href="/profile">Tài khoản</Link>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Layout
// ─────────────────────────────────────────────────────────────

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { state, authReady, setUser } = useAppContext();
  const [logoutError, setLogoutError] = useState("");
  const router = useRouter();
  const isAuthOrLanding = pathname === "/" || pathname?.startsWith("/auth");

  useEffect(() => { if (authReady && !state.user && !isAuthOrLanding) router.replace("/auth/login"); }, [authReady, state.user, isAuthOrLanding, router]);
  useEffect(() => {
    if (authReady && state.user?.isAdmin && !pathname.startsWith('/admin')) router.replace('/admin');
  }, [authReady, state.user?.isAdmin, pathname, router]);
  if (authReady && state.user?.isAdmin) {
    if (!pathname.startsWith('/admin')) return <p className="p-12 text-center">Đang mở trang quản trị…</p>;
    return <AdminShell name={state.user.name} error={logoutError} onLogout={async()=>{try{const r=await fetch('/api/auth/session',{method:'DELETE'});if(!r.ok)throw Error();setUser(null);router.replace('/auth/login');}catch{setLogoutError('Chưa đăng xuất được. Vui lòng thử lại.');}}}>{children}</AdminShell>;
  }
  if (!isAuthOrLanding && (!authReady || !state.user)) return <div className="p-12 text-center" role="status">Đang tải tài khoản…</div>;

  if (isAuthOrLanding) {
    return (
      <div className="min-h-screen bg-[#F4F8F1] flex flex-col font-sans">
        <main className="flex-1">
          <div className="max-w-7xl mx-auto py-8">
            {children}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F8F1] flex flex-col font-sans">
      <TopNavbar />
      <BottomNav />

      {/* Main content area */}
      <main className="flex-1 pb-20 lg:pb-0 transition-all duration-300 ease-in-out">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>


      <AIChatAssistant />
      <Footer />
    </div>
  );
}
