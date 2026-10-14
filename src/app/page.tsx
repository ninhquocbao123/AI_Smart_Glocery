"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChefHat,
  Wallet,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center text-center px-4 space-y-12 pb-20">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-3xl space-y-6"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm mb-4">
          <Sparkles className="w-4 h-4" />
          Trợ lý AI thông minh cho bữa ăn sinh viên
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-on-surface tracking-tight leading-tight">
          Giải quyết bài toán <br className="hidden sm:block" />
          <span className="text-primary">&quot;Ăn gì với 50k?&quot;</span>
        </h1>
        <p className="text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
          AI Smart Grocery giúp bạn lên thực đơn mỗi ngày, tận dụng nguyên liệu thừa,
          và tối ưu hóa ngân sách đi chợ. Trải nghiệm giải pháp ăn ngon - bổ - rẻ ngay hôm nay!
        </p>
      </motion.div>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md mx-auto"
      >
        <Link href="/auth/register" className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary text-white font-extrabold text-lg shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all cursor-pointer">
          Bắt đầu miễn phí <ArrowRight className="w-5 h-5" />
        </Link>
        <Link href="/auth/login" className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-surface border-2 border-outline-variant text-on-surface font-extrabold text-lg hover:bg-surface-container hover:border-primary/50 transition-all cursor-pointer">
          Đăng nhập
        </Link>
      </motion.div>

      {/* Feature Highlights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full mt-12"
      >
        <div className="bg-surface rounded-3xl p-8 border border-outline-variant text-left hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
            <ChefHat className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-on-surface mb-3">AI Lên Thực Đơn</h3>
          <p className="text-sm text-on-surface-variant">Tự động gợi ý các món ăn phù hợp với khẩu vị, thời tiết và đặc biệt là ngân sách của bạn.</p>
        </div>

        <div className="bg-surface rounded-3xl p-8 border border-outline-variant text-left hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6">
            <Wallet className="w-6 h-6 text-secondary" />
          </div>
          <h3 className="text-xl font-bold text-on-surface mb-3">Quản Lý Ngân Sách</h3>
          <p className="text-sm text-on-surface-variant">Theo dõi chi tiêu ăn uống mỗi ngày. Đảm bảo bạn không bao giờ tiêu lạm vào tiền phòng, tiền học.</p>
        </div>

        <div className="bg-surface rounded-3xl p-8 border border-outline-variant text-left hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-success/10 flex items-center justify-center mb-6">
            <CheckCircle2 className="w-6 h-6 text-success" />
          </div>
          <h3 className="text-xl font-bold text-on-surface mb-3">Tận Dụng Tủ Lạnh</h3>
          <p className="text-sm text-on-surface-variant">Nhập nguyên liệu còn thừa, AI sẽ biến chúng thành những món ăn hấp dẫn tránh lãng phí.</p>
        </div>
      </motion.div>
    </div>
  );
}
