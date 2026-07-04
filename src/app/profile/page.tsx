"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  ShoppingBag,
  Heart,
  Settings,
  Key,
  Bell,
  Sun,
  Moon,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
} from "lucide-react";
import { recipes } from "@/data/mockData";
import { formatVND } from "@/lib/priceUtils";
import RecipeImage from "@/components/ui/RecipeImage";

// ─────────────────────────────────────────────────────────────
// Types & Mock Data
// ─────────────────────────────────────────────────────────────

interface OrderHistoryItem {
  id: string;
  date: string;
  itemsCount: number;
  total: number;
  status: "Đã giao" | "Đang giao" | "Đã hủy";
  store: string;
  recipes: string[];
}

const mockOrders: OrderHistoryItem[] = [
  {
    id: "ORD-99381-VN",
    date: "04/07/2026",
    itemsCount: 10,
    total: 185000,
    status: "Đã giao",
    store: "Winmart & Bách Hóa Xanh",
    recipes: ["Phở Bò"],
  },
  {
    id: "ORD-99104-VN",
    date: "02/07/2026",
    itemsCount: 8,
    total: 95000,
    status: "Đã giao",
    store: "Bách Hóa Xanh",
    recipes: ["Cơm Tấm Sườn Bì Chả"],
  },
  {
    id: "ORD-98842-VN",
    date: "28/06/2026",
    itemsCount: 9,
    total: 55000,
    status: "Đã giao",
    store: "Coop Food",
    recipes: ["Bánh Mì Thịt Nướng"],
  },
];

const statusStyles = {
  "Đã giao": "bg-success-container/40 text-success border-success/20",
  "Đang giao": "bg-secondary-container/40 text-secondary border-secondary/20 animate-pulse",
  "Đã hủy": "bg-error-container/40 text-error border-error/20",
};

// ─────────────────────────────────────────────────────────────
// ProfilePage Component
// ─────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"history" | "favorites" | "settings">("history");
  
  // Interactive Profile States
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  const [passwordForm, setPasswordForm] = useState({ old: "", new: "", confirm: "" });
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Favorite Recipes (Mocking 3 recipes as favorites)
  const favoriteRecipes = useMemo(() => {
    return recipes.filter(r => ["recipe-001", "recipe-004", "recipe-005"].includes(r.id));
  }, []);

  const handlePasswordChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) return;
    
    // Simulate successful password update
    setPasswordSuccess(true);
    setTimeout(() => {
      setPasswordSuccess(false);
      setShowPasswordModal(false);
      setPasswordForm({ old: "", new: "", confirm: "" });
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ═══════════════════════════════════════════════════════
          USER PROFILE HEADER CARD
          ═══════════════════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-surface border border-outline-variant p-6 sm:p-8 shadow-[var(--shadow-elevation-1)]"
      >
        {/* Decorative elements */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-primary/5 pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-secondary/5 pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row items-center gap-6">
          {/* User Avatar */}
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full gradient-primary flex items-center justify-center text-on-primary text-3xl font-black shadow-lg">
              A
            </div>
            <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white border-2 border-surface shadow-sm">
              <Sparkles className="w-3 h-3" />
            </div>
          </div>

          {/* User details */}
          <div className="text-center sm:text-left flex-1 space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-black text-on-surface tracking-tight">Antigravity User</h1>
                <p className="text-sm text-on-surface-variant">antigravity.coder@google.com</p>
              </div>
              <span className="inline-flex items-center gap-1.5 self-center sm:self-auto px-3.5 py-1.5 rounded-full bg-primary/8 border border-primary/20 text-xs font-bold text-primary">
                <ShieldCheck className="w-3.5 h-3.5" /> Thành viên Gold VIP
              </span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════════
          TAB SELECTION
          ═══════════════════════════════════════════════════════ */}
      <div className="flex border-b border-outline-variant overflow-x-auto pb-px gap-2">
        <button
          onClick={() => setActiveTab("history")}
          className={`
            flex items-center gap-2 px-5 py-3.5 border-b-2 font-bold text-sm whitespace-nowrap transition-all cursor-pointer
            ${activeTab === "history"
              ? "border-primary text-primary"
              : "border-transparent text-on-surface-variant hover:text-on-surface"
            }
          `}
        >
          <ShoppingBag className="w-4 h-4" />
          Lịch sử đơn hàng
        </button>
        <button
          onClick={() => setActiveTab("favorites")}
          className={`
            flex items-center gap-2 px-5 py-3.5 border-b-2 font-bold text-sm whitespace-nowrap transition-all cursor-pointer
            ${activeTab === "favorites"
              ? "border-primary text-primary"
              : "border-transparent text-on-surface-variant hover:text-on-surface"
            }
          `}
        >
          <Heart className="w-4 h-4" />
          Món ăn yêu thích
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`
            flex items-center gap-2 px-5 py-3.5 border-b-2 font-bold text-sm whitespace-nowrap transition-all cursor-pointer
            ${activeTab === "settings"
              ? "border-primary text-primary"
              : "border-transparent text-on-surface-variant hover:text-on-surface"
            }
          `}
        >
          <Settings className="w-4 h-4" />
          Thiết lập tài khoản
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════
          TAB CONTENT RENDERER
          ═══════════════════════════════════════════════════════ */}
      <div className="min-h-[40vh]">
        <AnimatePresence mode="wait">
          {/* TAB 1: ORDER HISTORY */}
          {activeTab === "history" && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              {mockOrders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl bg-surface border border-outline-variant p-5 hover:shadow-md transition-shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-sm font-black text-on-surface">{order.id}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusStyles[order.status]}`}>
                        {order.status}
                      </span>
                    </div>
                    
                    <p className="text-xs text-on-surface-variant flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-primary" /> {order.date} · {order.store}
                    </p>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs text-on-surface-variant">Thực đơn nấu:</span>
                      {order.recipes.map((recipe, index) => (
                        <span key={index} className="text-xs font-bold text-primary bg-primary/8 px-2 py-0.5 rounded">
                          {recipe}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex sm:flex-col justify-between sm:justify-center items-center sm:items-end w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-outline-variant/30 gap-1.5">
                    <div>
                      <p className="text-[10px] text-on-surface-variant sm:text-right">Tổng số tiền</p>
                      <p className="text-base font-black text-primary">{formatVND(order.total)}</p>
                    </div>
                    <button className="btn-tonal text-xs py-1.5 px-3 rounded-xl flex items-center gap-1 cursor-pointer">
                      <Eye className="w-3.5 h-3.5" /> Chi tiết
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* TAB 2: FAVORITE RECIPES */}
          {activeTab === "favorites" && (
            <motion.div
              key="favorites"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {favoriteRecipes.map((recipe, i) => (
                <div
                  key={recipe.id}
                  className="group relative flex flex-col overflow-hidden rounded-2xl bg-surface border border-outline-variant hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                >
                  <Link href={`/meal-plan/${recipe.id}`}>
                    <div className="relative h-44 w-full">
                      <RecipeImage
                        recipeId={recipe.id}
                        src={recipe.image}
                        alt={recipe.title}
                        variant="card"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-surface/90 backdrop-blur-sm shadow-sm text-error">
                        <Heart className="w-4 h-4 fill-current" />
                      </div>
                    </div>
                  </Link>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <Link href={`/meal-plan/${recipe.id}`} className="hover:text-primary transition-colors">
                        <h3 className="text-sm font-bold text-on-surface line-clamp-1 mb-1">{recipe.title}</h3>
                      </Link>
                      <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed mb-3">
                        {recipe.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-on-surface-variant border-t border-outline-variant/30 pt-3">
                      <span>{recipe.prepTime + recipe.cookTime} phút nấu</span>
                      <span className="font-bold text-primary">{formatVND(recipe.totalPrice)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* TAB 3: ACCOUNT SETTINGS */}
          {activeTab === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <div className="rounded-2xl bg-surface border border-outline-variant divide-y divide-outline-variant/40 overflow-hidden shadow-[var(--shadow-elevation-1)]">
                {/* 1. Change password trigger */}
                <div className="p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center text-primary flex-shrink-0">
                      <Key className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface">Đổi mật khẩu</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">Cập nhật mật khẩu để bảo vệ tài khoản</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="p-2 rounded-xl hover:bg-surface-container-high text-on-surface-variant transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* 2. Theme toggle option */}
                <div className="p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-secondary/8 flex items-center justify-center text-secondary flex-shrink-0">
                      {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface">Chế độ tối (Dark Mode)</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">Tiết kiệm pin và dịu mắt vào ban đêm</p>
                    </div>
                  </div>
                  <button
                    role="switch"
                    aria-checked={isDarkMode}
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className={`
                      relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full
                      border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none
                      ${isDarkMode ? "bg-primary" : "bg-outline/40"}
                    `}
                  >
                    <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition duration-300 ease-in-out ${isDarkMode ? "translate-x-5" : "translate-x-0"}`} />
                  </button>
                </div>

                {/* 3. Notifications switch */}
                <div className="p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#0068FF]/8 flex items-center justify-center text-[#0068FF] flex-shrink-0">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface">Nhận thông báo ưu đãi</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">Thông báo giảm giá siêu thị hoặc thực đơn mới</p>
                    </div>
                  </div>
                  <button
                    role="switch"
                    aria-checked={notifEnabled}
                    onClick={() => setNotifEnabled(!notifEnabled)}
                    className={`
                      relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full
                      border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none
                      ${notifEnabled ? "bg-primary" : "bg-outline/40"}
                    `}
                  >
                    <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition duration-300 ease-in-out ${notifEnabled ? "translate-x-5" : "translate-x-0"}`} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══════════════════════════════════════════════════════
          CHANGE PASSWORD MODAL (Interactive)
          ═══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPasswordModal(false)}
              className="absolute inset-0 bg-black/55 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md rounded-3xl bg-surface border border-outline-variant p-6 shadow-2xl z-10 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-on-surface flex items-center gap-2">
                  <Key className="w-5 h-5 text-primary" />
                  Đổi mật khẩu mới
                </h3>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="p-1.5 rounded-full hover:bg-surface-container-high text-on-surface-variant cursor-pointer"
                >
                  <span className="text-sm font-bold">Đóng</span>
                </button>
              </div>

              {passwordSuccess ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl bg-success-container/30 border border-success/30 flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-success">Đổi mật khẩu thành công!</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">Mật khẩu mới của bạn đã được cập nhật an toàn.</p>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handlePasswordChangeSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-on-surface-variant">Mật khẩu hiện tại</label>
                    <input
                      type="password"
                      required
                      value={passwordForm.old}
                      onChange={(e) => setPasswordForm({ ...passwordForm, old: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container text-sm text-on-surface focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-on-surface-variant">Mật khẩu mới</label>
                    <input
                      type="password"
                      required
                      value={passwordForm.new}
                      onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                      placeholder="Tối thiểu 8 ký tự"
                      className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container text-sm text-on-surface focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-on-surface-variant">Xác nhận mật khẩu mới</label>
                    <input
                      type="password"
                      required
                      value={passwordForm.confirm}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                      placeholder="Nhập lại mật khẩu mới"
                      className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container text-sm text-on-surface focus:outline-none focus:border-primary"
                    />
                    {passwordForm.confirm && passwordForm.new !== passwordForm.confirm && (
                      <p className="text-[10px] text-error flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" /> Mật khẩu không trùng khớp!
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={!passwordForm.old || !passwordForm.new || passwordForm.new !== passwordForm.confirm}
                    className="w-full flex items-center justify-center py-3 rounded-xl gradient-primary text-on-primary text-sm font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Xác nhận thay đổi
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
