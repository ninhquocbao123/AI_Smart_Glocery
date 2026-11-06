"use client";
import React, {useState,useEffect} from 'react';
import Link from 'next/link';
import {usePathname,useRouter} from 'next/navigation';
import BrandLogo from '@/components/BrandLogo';
import {useAppContext} from '@/context/AppContext';
import AdminShell from '@/components/admin/AdminShell';
import UserShell from './UserShell';
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { state, authReady, setUser } = useAppContext();
  const [logoutError, setLogoutError] = useState("");
  const router = useRouter();
  const isAuthOrLanding = pathname === "/" || pathname?.startsWith("/auth");

  useEffect(() => {
    if (authReady && !state.user && !isAuthOrLanding)
      router.replace("/auth/login");
  }, [authReady, state.user, isAuthOrLanding, router]);
  useEffect(() => {
    if (authReady && state.user?.isAdmin && !pathname.startsWith("/admin"))
      router.replace("/admin");
  }, [authReady, state.user?.isAdmin, pathname, router]);
  if (authReady && state.user?.isAdmin) {
    if (!pathname.startsWith("/admin"))
      return <p className="p-12 text-center">Đang mở trang quản trị…</p>;
    return (
      <AdminShell
        name={state.user.name}
        error={logoutError}
        onLogout={async () => {
          try {
            const r = await fetch("/api/auth/session", { method: "DELETE" });
            if (!r.ok) throw Error();
            setUser(null);
            router.replace("/auth/login");
          } catch {
            setLogoutError("Chưa đăng xuất được. Vui lòng thử lại.");
          }
        }}
      >
        {children}
      </AdminShell>
    );
  }
  if (!isAuthOrLanding && (!authReady || !state.user))
    return (
      <div className="p-12 text-center" role="status">
        Đang tải tài khoản…
      </div>
    );

  if (isAuthOrLanding) {
    return (
      <div className="min-h-screen bg-[#F4F8F1] flex flex-col font-sans">
        {pathname === "/" && (
          <Link
            href="/"
            aria-label="AI Smart Grocery — Trang chủ"
            className="self-center mt-6"
          >
            <BrandLogo size={104} />
          </Link>
        )}
        <main className="flex-1">
          <div className="max-w-7xl mx-auto py-8">{children}</div>
        </main>
      </div>
    );
  }

  return <UserShell>{children}</UserShell>;
}
