"use client";
import type { ReactNode } from "react";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import { usePathname } from "next/navigation";
import {
  ChefHat,
  LayoutDashboard,
  ReceiptText,
  LogOut,
  ArrowUpRight,
  ShieldCheck,
  Package,
  SlidersHorizontal,
} from "lucide-react";
export default function AdminShell({
  children,
  name,
  onLogout,
  error,
}: {
  children: ReactNode;
  name: string;
  onLogout: () => Promise<void>;
  error: string;
}) {
  const pathname = usePathname();
  const payments = pathname.startsWith("/admin/payments");
  const orders = pathname.startsWith("/admin/orders");
  const operations = pathname.startsWith("/admin/operations");
  const links = [{href:"/admin/deals",label:"Sản phẩm giảm giá",icon:ReceiptText,active:pathname.startsWith("/admin/deals")},
    { href: "/admin/orders", label: "Quản lý đơn hàng", icon: Package, active: orders },
    { href: "/admin/operations", label: "Quản trị vận hành", icon: SlidersHorizontal, active: operations },
    {
      href: "/admin/users",
      label: "Người dùng",
      icon: ShieldCheck,
      active: pathname.startsWith("/admin/users"),
    },
    {
      href: "/admin/golden-hours",
      label: "Giờ vàng",
      icon: LayoutDashboard,
      active: pathname.startsWith("/admin/golden-hours"),
    },
    {
      href: "/admin",
      label: "Món ăn",
      icon: LayoutDashboard,
      active: pathname === "/admin",
    },
    {
      href: "/admin/payments",
      label: "Lịch sử thanh toán",
      icon: ReceiptText,
      active: payments,
    },
  ];
  return (
    <div className="min-h-screen bg-[#f6f7f9] text-slate-900 lg:pl-64">
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-100 flex-col z-40 px-5 py-8 overflow-y-auto">
        <Link href="/admin" className="flex items-center gap-3 px-2 shrink-0">
          <BrandLogo size={52} />
          <span className="font-extrabold text-lg tracking-tight">
            Smart Grocery
            <span className="block text-[10px] text-slate-400 font-semibold tracking-[.2em] mt-1">
              KHÔNG GIAN QUẢN TRỊ
            </span>
          </span>
        </Link>
        <p className="text-[10px] tracking-[.2em] font-bold text-slate-400 px-4 mt-8 mb-4">
          ĐIỀU HÀNH
        </p>
        <nav className="space-y-2">
          {links.map(({ href, label, icon: Icon, active }) => (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${active ? "bg-emerald-50 text-emerald-800 font-bold" : "text-slate-500 hover:bg-slate-50"}`}
            >
              <Icon size={19} />
              {label}
              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-700" />
              )}
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-6">
          <div className="rounded-2xl bg-[#f4f7f2] p-4">
            <ChefHat size={22} className="text-emerald-700 mb-2" />
            <p className="font-semibold text-sm">
              Mỗi món ngon,
              <br />
              một trải nghiệm tốt.
            </p>
            <p className="text-xs text-slate-500 leading-relaxed mt-1.5">
              Chăm chút thực đơn để bữa cơm mỗi ngày thêm trọn vẹn.
            </p>
          </div>
        </div>
      </aside>
      <header className="bg-white/95 border-b border-slate-100 px-4 sm:px-8 lg:px-10 py-4 flex items-center justify-between gap-3 sticky top-0 z-30">
        <div>
          <p className="text-[11px] text-slate-400 font-medium">
            Không gian làm việc <span className="mx-2">/</span>{" "}
            <span className="text-slate-700">
              {orders ? "Đơn hàng" : payments ? "Thanh toán" : operations ? "Vận hành" : "Quản trị"}
            </span>
          </p>
          <p className="font-semibold mt-1 text-sm">
            {orders ? "Chuẩn bị và giao hàng" : payments ? "Theo dõi doanh thu" : operations ? "Quản trị vận hành" : "Quản trị cửa hàng"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:flex text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full items-center gap-1.5 font-semibold">
            <ShieldCheck size={14} />
            Quản trị viên
          </span>
          <div
            className="w-9 h-9 bg-[#f2e8d5] rounded-full flex items-center justify-center text-[#796338] font-bold text-sm shadow-sm"
            title={`Tài khoản: ${name}`}
          >
            {name.slice(0, 1).toUpperCase()}
          </div>
          <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />
          <button
            onClick={() => void onLogout()}
            title="Đăng xuất khỏi hệ thống"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 transition-colors shadow-sm"
          >
            <LogOut size={16} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </header>
      <nav className="lg:hidden flex gap-2 p-3 border-b border-slate-100 bg-white overflow-x-auto">
        {links.map(({ href, label, active }) => (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`shrink-0 text-center text-sm rounded-xl p-3 ${active ? "bg-emerald-50 text-emerald-800 font-bold" : "text-slate-500"}`}
          >
            {label}
          </Link>
        ))}
      </nav>
      {error && (
        <p
          role="alert"
          className="mx-6 mt-4 rounded-xl bg-red-50 p-4 text-red-700"
        >
          {error}
        </p>
      )}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-10 py-7 lg:py-10">
        {children}
      </main>
      <footer className="px-6 py-6 flex justify-between border-t border-slate-200/60 text-[11px] text-slate-400">
        <span>Smart Grocery · Bữa ngon để AI lo</span>
        <span className="inline-flex items-center gap-1">
          Không gian quản trị <ArrowUpRight size={12} />
        </span>
      </footer>
    </div>
  );
}
