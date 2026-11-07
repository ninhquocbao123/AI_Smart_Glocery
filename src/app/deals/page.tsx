"use client";

import UserPageHeader from "@/components/ui/UserPageHeader";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Store as StoreIcon,
  Tag,
  Clock,
  ShoppingCart,
  Search,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { formatVND } from "@/lib/priceUtils";
import { DEALS_DATA } from "@/data/mockData";

const STORES = ["Tất cả", "Winmart", "Bach Hoa Xanh", "Coop Food"];

export default function DealsPage() {
  const [golden, setGolden] = useState({
    active: false,
    label: "11:00–13:00 và 17:00–19:00",
  });
  const { addToCart } = useAppContext();
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [activeStore, setActiveStore] = useState("Tất cả");
  const [deals, setDeals] = useState<((typeof DEALS_DATA)[0] & { dealPrice?: number })[]>([]);
  const [demo, setDemo] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const refresh = () =>
      fetch("/api/deals", { cache: "no-store" })
        .then(async (r) => {
          const d = await r.json();
          if (!r.ok) throw Error(d.message);
          if (!active) return;
          setDeals(d.deals);
          setError("");
          if (d.golden) setGolden(d.golden);
          setDemo(d.demo);
        })
        .catch((e) => {
          if (active) setError(e.message);
        });

    void refresh();
    const timer = setInterval(refresh, 30000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  const filteredDeals =
    activeStore === "Tất cả"
      ? deals.filter((d) => d.name.toLowerCase().includes(query.toLowerCase()))
      : deals.filter(
          (d) =>
            d.store === activeStore &&
            d.name.toLowerCase().includes(query.toLowerCase()),
        );

  const handleAddToCart = (deal: (typeof DEALS_DATA)[0] & { dealPrice?: number }) => {
    setNotice(`Đã thêm "${deal.name}" vào giỏ hàng.`);
    addToCart({
      ingredient: {
        id: deal.ingredientId,
        name: deal.name,
        price: deal.price,
        unit: deal.unit,
        quantity: 1,
        store: deal.store,
        category: deal.category,
        image: deal.image,
      },
      recipeId: "deal",
      recipeTitle: "Ưu đãi siêu thị",
      quantity: 1,
    });

    setTimeout(() => setNotice(""), 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      <UserPageHeader
        eyebrow="20+ ƯU ĐÃI HÔM NAY"
        title="Canh giờ vàng, mua vừa đủ"
        description={`${golden.label} · Áp dụng mỗi ngày cho hệ thống siêu thị đối tác tại TP.HCM & Hà Nội.`}
      />

      {/* Golden Status Alert Card */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border flex items-center justify-between gap-4 flex-wrap transition-all ${
          golden.active
            ? "bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border-amber-300 text-amber-950"
            : "bg-slate-50 border-slate-200 text-slate-700"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              golden.active
                ? "bg-amber-500 text-white shadow-md shadow-amber-500/30"
                : "bg-slate-200 text-slate-600"
            }`}
          >
            <Zap size={20} className={golden.active ? "fill-white" : ""} />
          </div>
          <div>
            <strong className="block text-sm sm:text-base font-extrabold">
              {golden.active
                ? "Khung giờ vàng đang diễn ra!"
                : "Chờ đón khung giờ vàng tiếp theo"}
            </strong>
            <p className="text-xs text-slate-600 mt-0.5">
              {golden.active
                ? "Nguyên liệu tươi sống đang được giảm giá từ 15% đến 35%. Nhanh tay gom vào giỏ!"
                : `Khung giờ vàng cố định: ${golden.label}. Giá ưu đãi sẽ tự động áp dụng.`}
            </p>
          </div>
        </div>

        {golden.active && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-black uppercase tracking-wider animate-pulse">
            <span className="w-2 h-2 rounded-full bg-white" />
            LIVE
          </span>
        )}
      </div>

      {error && (
        <p role="alert" className="p-3 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm">
          {error}
        </p>
      )}

      {notice && (
        <div
          role="status"
          className="p-3.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-sm font-bold flex items-center gap-2 shadow-sm animate-fadeIn"
        >
          <CheckCircle2 size={18} className="text-emerald-600" />
          <span>{notice}</span>
          <Link
            href="/grocery-store"
            className="ml-auto underline underline-offset-4 text-emerald-900"
          >
            Mở giỏ hàng →
          </Link>
        </div>
      )}

      {/* Toolbar: Search & Store Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus-within:bg-white focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/10 transition-all">
          <Search size={18} className="text-slate-400 shrink-0" />
          <input
            aria-label="Tìm thực phẩm giảm giá"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm theo tên nguyên liệu (thịt bò, cải thìa, trứng gà, cá hồi)…"
            className="outline-none w-full bg-transparent text-sm text-slate-800 font-medium placeholder:text-slate-400"
          />
        </div>

        {/* Store Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {STORES.map((store) => (
            <button
              key={store}
              type="button"
              onClick={() => setActiveStore(store)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeStore === store
                  ? "bg-emerald-700 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {store}
            </button>
          ))}
        </div>
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDeals.map((deal, idx) => {
          const originalPrice = deal.originalPrice || deal.price;
          const discountedPrice = deal.dealPrice || (deal.price < originalPrice ? deal.price : Math.round(originalPrice * 0.78));
          const hasDiscount = originalPrice > discountedPrice;
          const discountPercent = hasDiscount ? Math.round((1 - discountedPrice / originalPrice) * 100) : 0;

          return (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="group rounded-2xl bg-white border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col"
            >
              <div className="h-48 bg-slate-50 relative overflow-hidden flex items-center justify-center">
                {deal.image.startsWith("http") || deal.image.startsWith("/") ? (
                  <Image
                    src={deal.image}
                    alt={deal.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">
                    {deal.image}
                  </div>
                )}

                {hasDiscount && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-red-600 text-white text-xs font-black rounded-lg shadow-sm flex items-center gap-0.5">
                    <span>-{discountPercent}%</span>
                  </div>
                )}

                <div className="absolute top-3 right-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-slate-800 text-[11px] font-bold rounded-lg shadow-sm flex items-center gap-1 border border-slate-200/60">
                  <StoreIcon className="w-3 h-3 text-emerald-700" />
                  {deal.store}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-1 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                    {deal.name}
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    Đơn vị tính: 1 {deal.unit}
                  </span>
                </div>

                <div className="flex items-end justify-between mt-5 pt-3 border-t border-slate-100">
                  <div className="space-y-0.5">
                    {hasDiscount && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-semibold text-slate-400">Giá gốc:</span>
                        <span className="text-sm font-extrabold text-red-600 line-through tracking-tight">
                          {formatVND(originalPrice)}
                        </span>
                      </div>
                    )}
                    <div>
                      <span className="text-[10.5px] font-bold text-emerald-700 uppercase tracking-wider block">
                        Giá ưu đãi:
                      </span>
                      <strong className="text-xl font-black text-emerald-700 leading-tight block">
                        {formatVND(discountedPrice)}
                      </strong>
                    </div>
                  </div>

                  <button
                    aria-label={`Thêm ${deal.name} vào giỏ`}
                    onClick={() => handleAddToCart({ ...deal, price: discountedPrice })}
                    className="w-11 h-11 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center transition-all cursor-pointer shadow-md shadow-emerald-600/20 active:scale-95"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>

              <div className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-amber-700">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {demo
                    ? "Ưu đãi theo khung giờ vàng hôm nay"
                    : `Hiệu lực: ${deal.expiresIn}`}
                </span>
              </div>
            </div>
          </motion.div>
          );
        })}

        {filteredDeals.length === 0 && (
          <div className="col-span-full py-16 text-center bg-white border border-slate-200 rounded-3xl p-8">
            <Tag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">
              Không tìm thấy ưu đãi nào
            </h3>
            <p className="text-slate-500 text-sm mt-1">
              Thử tìm kiếm với từ khóa khác hoặc chọn &quot;Tất cả&quot; siêu thị.
            </p>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-400 text-center pt-2">
        Ảnh tham khảo theo món và nguyên liệu.{" "}
        <Link
          href="/photo-credits"
          className="underline underline-offset-4 text-emerald-700 hover:text-emerald-800"
        >
          Nguồn ảnh & Bản quyền
        </Link>
      </p>
    </div>
  );
}
