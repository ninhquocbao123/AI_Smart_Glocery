"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogIn, ArrowRight, Mail, Lock, ArrowLeft } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setUser } = useAppContext();

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setUser(data.user); router.push("/dashboard");
    } catch (err) { setError(err instanceof Error ? err.message : "Không thể kết nối. Vui lòng thử lại."); }
    finally { setBusy(false); }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 relative">
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
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 mx-auto">
          <LogIn className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-2xl font-extrabold text-on-surface text-center mb-2">Đăng Nhập</h1>
        <p className="text-sm text-on-surface-variant text-center mb-8">Chào mừng bạn trở lại với AI Smart Grocery</p>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && <p role="alert" className="text-error text-sm">{error}</p>}
          {busy && <p role="status">Đang xử lý…</p>}
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
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface-variant ml-1">Mật khẩu</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-surface-container border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Link href="/auth/forgot-password" className="text-sm font-semibold text-primary hover:underline">
              Quên mật khẩu?
            </Link>
          </div>

          <button disabled={busy} type="submit" className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary text-white font-extrabold text-lg shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all cursor-pointer mt-4">
            Đăng nhập <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-on-surface-variant">
          Chưa có tài khoản?{" "}
          <Link href="/auth/register" className="font-bold text-primary hover:underline">
            Tạo tài khoản mới
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
