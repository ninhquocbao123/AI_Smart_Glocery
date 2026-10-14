"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Store as StoreIcon, Tag, Clock, ShoppingCart, ChevronRight, CheckCircle2 } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { formatVND } from "@/lib/priceUtils";
import { DEALS_DATA } from "@/data/mockData";



const STORES = ["Tất cả", "Winmart", "Bach Hoa Xanh", "Coop Food"];

export default function DealsPage() {
  const { addToCart } = useAppContext();
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [activeStore, setActiveStore] = useState("Tất cả");
  const [deals,setDeals]=useState<typeof DEALS_DATA>([]),[demo,setDemo]=useState(true),[error,setError]=useState("");
  useEffect(()=>{fetch("/api/deals").then(async r=>{const d=await r.json();if(!r.ok)throw Error(d.message);setDeals(d.deals);setDemo(d.demo);}).catch(e=>setError(e.message));},[]);

  const filteredDeals =
    activeStore === "Tất cả"
      ? deals.filter(d => d.name.toLowerCase().includes(query.toLowerCase()))
      : deals.filter((d) => d.store === activeStore && d.name.toLowerCase().includes(query.toLowerCase()));

  const handleAddToCart = (deal: typeof DEALS_DATA[0]) => {
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
        image: deal.image
      },
      recipeId: "deal",
      recipeTitle: "Ưu đãi siêu thị",
      quantity: 1
    });
  };

  return (
    <div className="space-y-8 pb-12">
      <p className="text-xs text-on-surface-variant">Ảnh món ăn và sản phẩm mang tính minh họa, gồm ảnh chụp và ảnh tạo bằng AI. <a href="/images/food/credits.html" className="underline">Nguồn ảnh</a></p>
      <p className="rounded-xl bg-secondary-container/40 p-4 text-sm">{demo?"Ưu đãi minh họa cho bản demo, chưa đồng bộ giá và tồn kho thực tế từ siêu thị.":"Ưu đãi do nhóm cập nhật qua backend, chưa có API trực tiếp từ siêu thị."}</p>
      {error&&<p role="alert" className="text-error">{error}</p>}
      <input aria-label="Tìm thực phẩm giảm giá" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Tìm nguyên liệu bạn đang thiếu…" className="w-full border border-outline-variant rounded-xl p-3"/>
      {notice && <p role="status" className="text-primary">{notice}</p>}
      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-surface border border-outline-variant shadow-sm h-64 md:h-80"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary-container/80 to-transparent z-10" />
        {/* You would normally use a real image here based on Figma */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center" />
        
        <div className="relative z-20 h-full flex flex-col justify-center px-8 md:px-12 max-w-xl">
          <span className="px-3 py-1 bg-primary text-on-primary text-xs font-bold rounded-full w-max mb-4 inline-flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" /> Ưu đãi tham khảo
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-on-surface tracking-tight mb-3">
            Siêu Sale Cuối Tuần
          </h1>
          <p className="text-on-surface-variant text-sm md:text-base mb-6">
            Khám phá hàng ngàn ưu đãi từ các siêu thị đối tác của SmartCart AI. Tiết kiệm lên đến 50% cho giỏ hàng của bạn.
          </p>
        </div>
      </motion.div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {STORES.map((store) => (
          <button
            key={store}
            onClick={() => setActiveStore(store)}
            className={`
              whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition-all
              ${
                activeStore === store
                  ? "bg-primary text-on-primary shadow-md"
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
            {/* Image placeholder */}
            <div className="h-40 bg-surface-container relative overflow-hidden">
              {(deal.image.startsWith('http') || deal.image.startsWith('/')) ? (
                <img src={deal.image} alt={deal.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">{deal.image}</div>
              )}
              <div className="absolute top-3 left-3 px-2.5 py-1 bg-error text-on-error text-xs font-bold rounded-lg shadow-sm">
                -{Math.round((1-deal.price/deal.originalPrice)*100)}%
              </div>
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
                  <p className="text-xs text-on-surface-variant line-through mb-0.5">
                    {formatVND(deal.originalPrice)}
                  </p>
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
                {demo ? "Thời hạn minh họa" : "Hiệu lực"}: {deal.expiresIn}
              </div>
            </div>
          </motion.div>
        ))}
        
        {filteredDeals.length === 0 && (
          <div className="col-span-full py-12 text-center">
            <Tag className="w-12 h-12 text-outline mx-auto mb-3" />
            <h3 className="text-lg font-bold text-on-surface">Không có ưu đãi nào</h3>
            <p className="text-on-surface-variant">Thử chọn một siêu thị khác xem sao nhé.</p>
          </div>
        )}
      </div>
    </div>
  );
}
