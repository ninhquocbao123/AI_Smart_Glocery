"use client";

import React from "react";
import LandingExperience from "@/components/LandingExperience";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center text-center px-4 space-y-12 pb-20">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-5xl space-y-6"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm mb-4">
          <Sparkles className="w-4 h-4" />
          Trợ lý AI thông minh cho bữa ăn sinh viên
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-on-surface tracking-tight leading-tight">
          Giải quyết bài toán <br className="hidden sm:block" />
          <span className="text-primary">BỮA NGON ĐỂ &quot;AI&quot; LO</span>
        </h1>
        <p className="text-lg text-on-surface-variant max-w-5xl mx-auto leading-relaxed">
          <span className="lg:block">
            AI Smart Grocery giúp bạn lên thực đơn mỗi ngày, tận dụng nguyên
            liệu thừa,
          </span>{" "}
          <span className="lg:block">
            và tối ưu hóa ngân sách đi chợ. Trải nghiệm giải pháp ăn ngon - bổ -
            rẻ ngay hôm nay!
          </span>
        </p>
      </motion.div>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md mx-auto"
      >
        <Link
          href="/auth/register"
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary text-white font-extrabold text-lg shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all cursor-pointer"
        >
          Bắt đầu miễn phí <ArrowRight className="w-5 h-5" />
        </Link>
        <Link
          href="/auth/login"
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-surface border-2 border-outline-variant text-on-surface font-extrabold text-lg hover:bg-surface-container hover:border-primary/50 transition-all cursor-pointer"
        >
          Đăng nhập
        </Link>
      </motion.div>

      <LandingExperience />
    </div>
  );
}
