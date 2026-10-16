"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { UserPlus, ArrowRight, Mail, Lock, User, ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");


  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (password !== confirmPassword) { setError("Mật khẩu xác nhận không khớp."); return; }
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password, confirmPassword, name, phone, address }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      router.push("/auth/login?registered=1");
    } catch (err) { setError(err instanceof Error ? err.message : "Không thể kết nối. Vui lòng thử lại."); }
    finally { setBusy(false); }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-12 relative">
      <div className="w-full max-w-md mb-4">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" /> Quay về trang chủ
        </Link>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-surface border border-outline-variant rounded-3xl p-8 shadow-xl"
      >
        <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6 mx-auto">
          <UserPlus className="w-6 h-6 text-secondary" />
        </div>
        <h1 className="text-2xl font-extrabold text-on-surface text-center mb-2">Tạo Tài Khoản</h1>
        <p className="text-sm text-on-surface-variant text-center mb-8">Bắt đầu quản lý chi tiêu ăn uống của bạn</p>

        <form onSubmit={handleRegister} className="space-y-4">
          {error && <p role="alert" className="text-error text-sm">{error}</p>}
          {busy && <p role="status">Đang xử lý…</p>}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface-variant ml-1">Họ và tên</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nguyễn Văn A"
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-surface-container border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface-variant ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sinhvien@example.com"
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-surface-container border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
          </div>
          
          <label className="block text-sm font-semibold">Số điện thoại
            <input type="tel" autoComplete="tel" required maxLength={20} value={phone} onChange={e=>setPhone(e.target.value)} placeholder="0901234567" className="w-full mt-2 p-3 rounded-2xl bg-surface-container border border-outline-variant" />
          </label>
          <label className="block text-sm font-semibold">Địa chỉ giao hàng
            <textarea autoComplete="street-address" required minLength={10} maxLength={300} rows={2} value={address} onChange={e=>setAddress(e.target.value)} placeholder="Số nhà, đường, phường/xã, tỉnh/thành phố" className="w-full mt-2 p-3 rounded-2xl bg-surface-container border border-outline-variant" />
          </label>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface-variant ml-1">Mật khẩu</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
              <input
                type="password"
                minLength={8}
                maxLength={72}
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-surface-container border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
          </div>

          <label className="block text-sm font-semibold">Xác nhận mật khẩu
            <input type="password" autoComplete="new-password" required minLength={8} maxLength={72} value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} placeholder="Nhập lại mật khẩu" className="w-full mt-2 p-3 rounded-2xl bg-surface-container border border-outline-variant" />
          </label>
          <button disabled={busy} type="submit" className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary text-white font-extrabold text-lg shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all cursor-pointer mt-6">
            Đăng ký <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-on-surface-variant">
          Đã có tài khoản?{" "}
          <Link href="/auth/login" className="font-bold text-primary hover:underline">
            Đăng nhập ngay
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
