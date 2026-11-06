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
  const [deals, setDeals] = useState<typeof DEALS_DATA>([]),
    [demo, setDemo] = useState(true),
    [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    const refresh = () => fetch("/api/deals", {cache:"no-store"})
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw Error(d.message);
        if(!active)return;
        setDeals(d.deals);
        setError("");
        if (d.golden) setGolden(d.golden);
        setDemo(d.demo);
      })
      .catch((e) => {if(active)setError(e.message);});
    void refresh();
    const timer=setInterval(refresh,30000);
    return()=>{active=false;clearInterval(timer);};
  }, []);

  const filteredDeals =
    activeStore === "Tất cả"
      ? deals.filter((d) => d.name.toLowerCase().includes(query.toLowerCase()))
      : deals.filter(
          (d) =>
            d.store === activeStore &&
            d.name.toLowerCase().includes(query.toLowerCase()),
        );

  const handleAddToCart = (deal: (typeof DEALS_DATA)[0]) => {
    setNotice(`Đã thêm ${deal.name} vào giỏ hàng.`);
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
  };

  return (
    <div className="space-y-8 pb-12">
      <UserPageHeader eyebrow="20 ưu đãi hôm nay" title="Canh giờ vàng, mua vừa đủ" description={`${golden.label} · Mỗi ngày trong tuần, giờ Việt Nam.`} />
      <p className="text-sm text-on-surface-variant">{golden.active ? "Đang trong giờ vàng. Chọn những nguyên liệu bạn cần cho bữa ăn hôm nay." : "Giá ưu đãi áp dụng trong khung giờ vàng tiếp theo."}</p>
      {error && (
        <p role="alert" className="text-error">
          {error}
        </p>
      )}
      <input
        aria-label="Tìm thực phẩm giảm giá"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Tìm nguyên liệu bạn đang thiếu…"
        className="w-full border border-outline-variant rounded-xl p-3"
      />
      {notice && (
        <p role="status" className="text-primary">
          {notice}
        </p>
      )}
      {/* Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {STORES.map((store) => (
          <button
            key={store}
            onClick={() => setActiveStore(store)}
            className={`
              whitespace-nowrap px-5 py-2.5 rounded-lg text-sm font-medium transition-all
              ${
                activeStore === store
                  ? "bg-primary text-on-primary"
                  : "bg-surface border border-outline-variant text-on-surface hover:bg-surface-container"
              }
            `}
          >
            {store}
          </button>
        ))}
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDeals.map((deal, idx) => (
          <motion.div
            key={deal.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="group rounded-3xl bg-surface border border-outline-variant overflow-hidden hover:shadow-[var(--shadow-elevation-2)] transition-shadow"
          >
            <div className="h-52 bg-white relative overflow-hidden">
              {deal.image.startsWith("http") || deal.image.startsWith("/") ? (
                <Image
                  src={deal.image}
                  alt={deal.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-contain p-5"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">
                  {deal.image}
                </div>
              )}
              {deal.price < deal.originalPrice && <div className="absolute top-3 left-3 px-2.5 py-1 bg-error text-on-error text-xs font-bold rounded-lg shadow-sm">
                -{Math.round((1 - deal.price / deal.originalPrice) * 100)}%
              </div>}
              <div className="absolute top-3 right-3 px-2.5 py-1 bg-surface/90 backdrop-blur-sm text-on-surface text-xs font-bold rounded-lg shadow-sm flex items-center gap-1">
                <StoreIcon className="w-3.5 h-3.5 text-primary" />
                {deal.store}
              </div>
            </div>

            <div className="p-5">
              <h3 className="text-base font-bold text-on-surface mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                {deal.name}
              </h3>

              <div className="flex items-center justify-between mt-4">
                <div>
                    {deal.price < deal.originalPrice && <p className="text-xs text-on-surface-variant line-through mb-0.5">
                    {formatVND(deal.originalPrice)}
                    </p>}
                  <p className="text-lg font-black text-primary">
                    {formatVND(deal.price)}
                  </p>
                </div>

                <button
                  aria-label={`Thêm ${deal.name} vào giỏ`}
                  onClick={() => handleAddToCart(deal)}
                  className="w-10 h-10 rounded-xl bg-primary-container text-primary flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors cursor-pointer"
                >
                  <ShoppingCart className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-outline-variant/50 flex items-center gap-2 text-[11px] font-medium text-error">
                <Clock className="w-3.5 h-3.5" />
                {demo
                  ? "Kiểm tra ưu đãi tại cửa hàng"
                  : `Hiệu lực: ${deal.expiresIn}`}
              </div>
            </div>
          </motion.div>
        ))}

        {filteredDeals.length === 0 && (
          <div className="col-span-full py-12 text-center">
            <Tag className="w-12 h-12 text-outline mx-auto mb-3" />
            <h3 className="text-lg font-bold text-on-surface">
              Không có ưu đãi nào
            </h3>
            <p className="text-on-surface-variant">
              Thử chọn một siêu thị khác xem sao nhé.
            </p>
          </div>
        )}
      </div>
      <p className="text-xs text-on-surface-variant">Ảnh tham khảo theo món và nguyên liệu. <Link href="/photo-credits" className="underline underline-offset-4">Nguồn ảnh</Link></p>
    </div>
  );
}
