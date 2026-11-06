"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { storeDirectory } from "@/lib/stores";
import { formatVND } from "@/lib/priceUtils";
import {
  Store,
  Truck,
  MapPin,
  Building2,
  Package,
  PackagePlus,
  RefreshCw,
  Search,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Tag,
  Boxes,
  Clock,
  Layers,
  Info,
  Pencil,
  RotateCcw,
  SlidersHorizontal,
  ExternalLink,
} from "lucide-react";

type StoreConfig = {
  key: string;
  name?: string;
  branch: string;
  sellerName: string;
  serviceArea: string;
  deliveryFee: number;
  acceptingOrders: boolean;
};

type OfferItem = {
  _id?: string;
  store: string;
  ingredientId: string;
  sku: string;
  name: string;
  unit: string;
  category: string;
  price: number;
  originalPrice?: number;
  stock: number;
  active?: boolean;
  validUntil: string;
  updatedAt?: string;
};

export default function OperationsPanel() {
  const [configs, setConfigs] = useState<StoreConfig[]>([]);
  const [offers, setOffers] = useState<OfferItem[]>([]);
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);
  const [savingStore, setSavingStore] = useState(false);
  const [savingOffer, setSavingOffer] = useState(false);

  // Store Configuration State
  const [store, setStore] = useState("Winmart");
  const [branch, setBranch] = useState("");
  const [sellerName, setSellerName] = useState("");
  const [serviceArea, setServiceArea] = useState("");
  const [fee, setFee] = useState(0);
  const [accepting, setAccepting] = useState(false);

  // Offer / Inventory Form State
  const [ingredientId, setIngredientId] = useState("");
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("kg");
  const [category, setCategory] = useState("Rau củ");
  const [price, setPrice] = useState<number | "">("");
  const [originalPrice, setOriginalPrice] = useState<number | "">("");
  const [stock, setStock] = useState<number | "">("");
  const [isEditingExisting, setIsEditingExisting] = useState(false);

  // Table Filters
  const [tableSearch, setTableSearch] = useState("");
  const [tableCategory, setTableCategory] = useState("all");

  const loadCatalog = async () => {
    setLoading(true);
    setStatusMessage(null);
    try {
      const r = await fetch("/api/admin/catalog");
      const d = await r.json();
      if (!r.ok) throw new Error(d.message || "Không thể tải dữ liệu.");
      setAllowed(true);
      setConfigs(d.stores || []);
      setOffers(d.offers || []);

      const current = (d.stores || []).find((s: StoreConfig) => s.key === store);
      if (current) {
        setBranch(current.branch || "");
        setSellerName(current.sellerName || "");
        setServiceArea(current.serviceArea || "");
        setFee(current.deliveryFee || 0);
        setAccepting(Boolean(current.acceptingOrders));
      }
    } catch (e) {
      setStatusMessage({
        text: e instanceof Error ? e.message : "Lỗi kết nối máy chủ.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCatalog();
  }, []);

  const handleSelectStore = (storeKey: string) => {
    setStore(storeKey);
    const saved = configs.find((s) => s.key === storeKey);
    setBranch(saved?.branch ?? "");
    setSellerName(saved?.sellerName ?? "");
    setServiceArea(saved?.serviceArea ?? "");
    setFee(saved?.deliveryFee ?? 0);
    setAccepting(saved?.acceptingOrders ?? false);
    resetOfferForm();
  };

  const resetOfferForm = () => {
    setIngredientId("");
    setSku("");
    setName("");
    setUnit("kg");
    setCategory("Rau củ");
    setPrice("");
    setOriginalPrice("");
    setStock("");
    setIsEditingExisting(false);
  };

  const handleFillOfferToForm = (item: OfferItem) => {
    setIngredientId(item.ingredientId);
    setSku(item.sku);
    setName(item.name);
    setUnit(item.unit);
    setCategory(item.category || "Rau củ");
    setPrice(item.price);
    setOriginalPrice(item.originalPrice ?? "");
    setStock(item.stock);
    setIsEditingExisting(true);
    setStatusMessage({
      text: `Đã nạp thông tin "${item.name}" vào biểu mẫu chỉnh sửa.`,
      type: "info",
    });

    const formElement = document.getElementById("offer-form-card");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSaveStoreConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingStore(true);
    setStatusMessage(null);
    try {
      const r = await fetch("/api/admin/catalog", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "store",
          store,
          branch,
          sellerName,
          serviceArea,
          deliveryFee: Number(fee),
          acceptingOrders: accepting,
        }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.message || "Không thể cập nhật cấu hình.");
      if (d.store) {
        setConfigs((prev) => [...prev.filter((s) => s.key !== d.store.key), d.store]);
      }
      setStatusMessage({
        text: `Đã lưu cấu hình vận hành cho ${storeDirectory.find((s) => s.key === store)?.name ?? store} thành công!`,
        type: "success",
      });
    } catch (e) {
      setStatusMessage({
        text: e instanceof Error ? e.message : "Không thể lưu cấu hình.",
        type: "error",
      });
    } finally {
      setSavingStore(false);
    }
  };

  const handleSaveOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (price === "" || stock === "") return;
    setSavingOffer(true);
    setStatusMessage(null);
    try {
      const payload: Record<string, unknown> = {
        store,
        ingredientId: ingredientId.trim(),
        sku: sku.trim(),
        name: name.trim(),
        unit: unit.trim(),
        category: category.trim(),
        price: Number(price),
        stock: Number(stock),
        validUntil: new Date(Date.now() + 86400000).toISOString(),
      };
      if (originalPrice !== "" && Number(originalPrice) > 0) {
        payload.originalPrice = Number(originalPrice);
      }

      const r = await fetch("/api/admin/catalog", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.message || "Không thể cập nhật giá và tồn kho.");

      if (d.offer) {
        setOffers((prev) => {
          const exists = prev.some(
            (o) => o.store === d.offer.store && o.ingredientId === d.offer.ingredientId
          );
          if (exists) {
            return prev.map((o) =>
              o.store === d.offer.store && o.ingredientId === d.offer.ingredientId ? d.offer : o
            );
          }
          return [d.offer, ...prev];
        });
      }

      setStatusMessage({
        text: `Đã lưu sản phẩm "${name}" thành công vào kho của ${storeDirectory.find((s) => s.key === store)?.name ?? store}.`,
        type: "success",
      });
      resetOfferForm();
    } catch (e) {
      setStatusMessage({
        text: e instanceof Error ? e.message : "Không thể lưu sản phẩm.",
        type: "error",
      });
    } finally {
      setSavingOffer(false);
    }
  };

  // Filtered offers for the current store
  const storeOffers = useMemo(() => {
    return offers.filter((o) => o.store === store);
  }, [offers, store]);

  const filteredOffers = useMemo(() => {
    return storeOffers.filter((o) => {
      const matchSearch =
        tableSearch === "" ||
        o.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
        o.sku.toLowerCase().includes(tableSearch.toLowerCase()) ||
        o.ingredientId.toLowerCase().includes(tableSearch.toLowerCase());
      const matchCategory = tableCategory === "all" || o.category === tableCategory;
      return matchSearch && matchCategory;
    });
  }, [storeOffers, tableSearch, tableCategory]);

  const storeCategories = useMemo(() => {
    const set = new Set<string>();
    storeOffers.forEach((o) => {
      if (o.category) set.add(o.category);
    });
    return Array.from(set);
  }, [storeOffers]);

  const currentStoreConfig = configs.find((s) => s.key === store);
  const currentStoreMeta = storeDirectory.find((s) => s.key === store);

  if (!allowed && !loading) {
    return (
      <div className="max-w-2xl mx-auto my-16 p-8 rounded-3xl bg-white border border-slate-200 shadow-sm text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Quyền truy cập bị giới hạn</h2>
        <p className="text-slate-500 mt-2 text-sm leading-relaxed">
          Tài khoản của bạn cần được quản trị viên cấp quyền Quản trị vận hành trước khi thực hiện thao tác.
        </p>
        {statusMessage && (
          <p className="mt-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs">{statusMessage.text}</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-emerald-100/70 text-emerald-800">
              <SlidersHorizontal size={12} />
              Vận hành & Chuỗi cung ứng
            </span>
            <span className="text-xs text-slate-400 font-medium">Bán lẻ trực tiếp</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Quản trị vận hành
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Điều phối kênh siêu thị, quản lý kho hàng và thiết lập giá bán niêm yết theo thời gian thực.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => void loadCatalog()}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
          >
            <RefreshCw size={15} className={loading ? "animate-spin text-emerald-600" : ""} />
            Làm mới
          </button>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 text-white text-sm font-semibold hover:bg-emerald-900 transition-colors shadow-sm"
          >
            <Package size={16} />
            Quản lý đơn hàng
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* ── Status Message Toast ───────────────────────────── */}
      {statusMessage && (
        <div
          role="status"
          className={`flex items-start gap-3 p-4 rounded-2xl border transition-all ${
            statusMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : statusMessage.type === "error"
              ? "bg-red-50 border-red-200 text-red-900"
              : "bg-blue-50 border-blue-200 text-blue-900"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 size={20} className="text-emerald-700 shrink-0 mt-0.5" />
          ) : statusMessage.type === "error" ? (
            <XCircle size={20} className="text-red-700 shrink-0 mt-0.5" />
          ) : (
            <Info size={20} className="text-blue-700 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 text-sm font-medium leading-relaxed">{statusMessage.text}</div>
          <button
            type="button"
            onClick={() => setStatusMessage(null)}
            className="text-xs font-semibold opacity-60 hover:opacity-100"
          >
            Đóng
          </button>
        </div>
      )}

      {/* ── Operational Notice Card ────────────────────────── */}
      <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50/70 via-orange-50/40 to-amber-50/60 p-5 shadow-sm">
        <div className="flex items-start gap-3.5">
          <div className="p-2 rounded-xl bg-amber-500/15 text-amber-800 shrink-0 mt-0.5">
            <ShieldAlert size={20} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-amber-950 flex items-center gap-2">
              Nguyên tắc vận hành & Tự chủ dữ liệu nội bộ
            </h2>
            <p className="text-xs sm:text-sm text-amber-900/90 mt-1 leading-relaxed">
              Dữ liệu cấu hình và tồn kho tại đây thuộc quyền kiểm soát của đội ngũ Smart Grocery. Hệ thống <strong>không kết nối tự động API đặt hàng</strong> với các siêu thị đối tác. Chỉ kích hoạt trạng thái <strong>&ldquo;Nhận đơn&rdquo;</strong> khi đội ngũ đã có sẵn nguồn cung, người lấy hàng và shipper sẵn sàng xử lý.
            </p>
          </div>
        </div>
      </div>

      {/* ── KPI Stat Cards ─────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Cửa hàng đang chọn */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Siêu thị đang quản trị</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <Store size={18} />
            </span>
          </div>
          <p className="text-xl font-bold text-slate-900 mt-2 truncate">
            {currentStoreMeta?.name ?? store}
          </p>
          <p className="text-xs text-slate-400 mt-1 truncate">
            {branch || "Chưa cấu hình chi nhánh"}
          </p>
        </div>

        {/* Card 2: Trạng thái nhận đơn */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Trạng thái nhận đơn</span>
            <span
              className={`p-2 rounded-xl ${
                accepting ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
              }`}
            >
              {accepting ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`inline-block w-2.5 h-2.5 rounded-full ${
                accepting ? "bg-emerald-600 animate-pulse" : "bg-rose-500"
              }`}
            />
            <p className="text-base sm:text-lg font-bold text-slate-900">
              {accepting ? "Đang nhận đơn" : "Đang tạm dừng"}
            </p>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {accepting ? "Khách có thể đặt món" : "Đóng cổng giỏ hàng"}
          </p>
        </div>

        {/* Card 3: Phí giao hàng */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Phí giao hàng</span>
            <span className="p-2 rounded-xl bg-blue-50 text-blue-700">
              <Truck size={18} />
            </span>
          </div>
          <p className="text-xl font-bold text-slate-900 mt-2">{formatVND(fee)}</p>
          <p className="text-xs text-slate-400 mt-1 truncate">
            Khu vực: {serviceArea || "Chưa xác định"}
          </p>
        </div>

        {/* Card 4: Tổng mặt hàng */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Mặt hàng trong kho</span>
            <span className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <Boxes size={18} />
            </span>
          </div>
          <p className="text-xl font-bold text-slate-900 mt-2">
            {storeOffers.length} <span className="text-sm font-normal text-slate-500">sản phẩm</span>
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {storeOffers.filter((o) => o.stock > 0).length} còn hàng ·{" "}
            {storeOffers.filter((o) => o.stock <= 0).length} hết hàng
          </p>
        </div>
      </div>

      {/* ── Store Selector Interactive Cards ────────────────── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <Layers size={15} />
            Lựa chọn kênh siêu thị điều hành
          </h2>
          <span className="text-xs text-slate-400">Chọn siêu thị để xem và chỉnh sửa cấu hình</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {storeDirectory.map((s) => {
            const isSelected = store === s.key;
            const config = configs.find((c) => c.key === s.key);
            const isAccepting = config?.acceptingOrders ?? false;
            const count = offers.filter((o) => o.store === s.key).length;

            return (
              <button
                key={s.key}
                type="button"
                onClick={() => handleSelectStore(s.key)}
                className={`flex flex-col text-left p-4 rounded-2xl border-2 transition-all duration-200 relative ${
                  isSelected
                    ? "border-emerald-700 bg-emerald-50/40 shadow-md ring-2 ring-emerald-600/20"
                    : "border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/70 shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span
                    className={`font-extrabold text-base ${
                      isSelected ? "text-emerald-900" : "text-slate-800"
                    }`}
                  >
                    {s.name}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      isAccepting
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isAccepting ? "bg-emerald-600" : "bg-slate-400"
                      }`}
                    />
                    {isAccepting ? "Nhận đơn" : "Tạm ngưng"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 mt-auto pt-2 border-t border-slate-100 w-full">
                  <span>Kho: {count} mặt hàng</span>
                  <a
                    href={s.website}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:underline"
                    title={`Truy cập ${s.name}`}
                  >
                    Trang chủ <ExternalLink size={11} />
                  </a>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Main Two-Column Forms Section ──────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form 1: Cấu hình người bán & giao nhận (5 cols) */}
        <section className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div className="flex items-start justify-between border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-lg">
                <Store size={20} />
                <h2>Thông tin nguồn & Giao nhận</h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Khai báo pháp nhân thu tiền, chi nhánh lấy hàng và phí vận chuyển.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-mono text-xs font-semibold">
              {currentStoreMeta?.name}
            </span>
          </div>

          <form onSubmit={handleSaveStoreConfig} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Chi nhánh / khu vực nguồn hàng
              </label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  required
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  placeholder="VD: Siêu thị WinMart Thảo Điền, Q.2, TP.HCM"
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Đơn vị thực sự bán và nhận tiền
              </label>
              <div className="relative">
                <Building2 size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  required
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  placeholder="VD: AI_Smart_Grocery"
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition"
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Tên hiển thị trên hóa đơn và chứng từ giao nhận cho khách.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Khu vực giao hàng hỗ trợ
              </label>
              <div className="relative">
                <Truck size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  required
                  value={serviceArea}
                  onChange={(e) => setServiceArea(e.target.value)}
                  placeholder="VD: TP. Hồ Chí Minh (Q.1, Q.3, Bình Thạnh)"
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Phí giao hàng (VNĐ)
              </label>
              <div className="relative">
                <input
                  required
                  min={0}
                  step={1000}
                  type="number"
                  value={fee}
                  onChange={(e) => setFee(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-3.5 pr-14 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition"
                />
                <span className="absolute right-3.5 top-2.5 text-xs font-bold text-slate-400">
                  VNĐ
                </span>
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Tương đương: <strong>{formatVND(Number(fee))}</strong> / đơn
              </span>
            </div>

            <div className="pt-2">
              <label
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition select-none ${
                  accepting
                    ? "bg-emerald-50/70 border-emerald-300 text-emerald-950"
                    : "bg-slate-50 border-slate-200 text-slate-700"
                }`}
              >
                <input
                  type="checkbox"
                  checked={accepting}
                  onChange={(e) => setAccepting(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-emerald-700 focus:ring-emerald-600 accent-emerald-700 cursor-pointer"
                />
                <div>
                  <span className="text-sm font-bold block">
                    Sẵn sàng cung ứng & Bật nhận đơn
                  </span>
                  <span className="text-xs text-slate-500 block mt-0.5">
                    Cho phép khách chọn nguyên liệu từ kênh này khi đặt thực đơn.
                  </span>
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={savingStore}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-800 text-white font-bold text-sm hover:bg-emerald-900 transition-colors shadow-sm disabled:opacity-50"
            >
              {savingStore ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Đang lưu cấu hình…
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  Lưu cấu hình {currentStoreMeta?.name}
                </>
              )}
            </button>
          </form>
        </section>

        {/* Form 2: Cập nhật giá & tồn kho (7 cols) */}
        <section
          id="offer-form-card"
          className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6"
        >
          <div className="flex items-start justify-between border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-lg">
                <PackagePlus size={20} />
                <h2>Cập nhật giá bán & Tồn kho</h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Giá có hiệu lực trong 24 giờ. Số lượng tồn kho tự động trừ khi tạo đơn.
              </p>
            </div>
            {isEditingExisting && (
              <button
                type="button"
                onClick={resetOfferForm}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                <RotateCcw size={13} />
                Tạo mới
              </button>
            )}
          </div>

          <form onSubmit={handleSaveOffer} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Mã nguyên liệu công thức
                </label>
                <input
                  required
                  value={ingredientId}
                  onChange={(e) => setIngredientId(e.target.value)}
                  placeholder="VD: i-001-1, i-002-2"
                  className="w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Khớp với mã định danh nguyên liệu trong thực đơn.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Mã SKU siêu thị
                </label>
                <input
                  required
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="VD: WIN-PORK-01, BHX-TOM-02"
                  className="w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Mã barcode / mã sản phẩm của cửa hàng nguồn.
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Tên sản phẩm hàng hóa
              </label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: Thịt ba chỉ heo MeatDeli chuẩn sạch"
                className="w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Đơn vị tính
                </label>
                <input
                  required
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="VD: kg, 500g, bó, vỉ, hộp..."
                  className="w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Danh mục nguyên liệu
                </label>
                <input
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  list="category-suggestions"
                  placeholder="VD: Rau củ, Thịt tươi, Gia vị..."
                  className="w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition"
                />
                <datalist id="category-suggestions">
                  <option value="Rau củ" />
                  <option value="Thịt tươi" />
                  <option value="Hải sản" />
                  <option value="Trứng & Sữa" />
                  <option value="Gia vị" />
                  <option value="Đồ khô" />
                  <option value="Trái cây" />
                </datalist>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Giá bán ưu đãi (VNĐ)
                </label>
                <div className="relative">
                  <input
                    required
                    min={1}
                    step={500}
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="35000"
                    className="w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition"
                  />
                </div>
                {price !== "" && (
                  <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
                    {formatVND(Number(price))}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Giá gốc niêm yết (VNĐ)
                </label>
                <input
                  min={1}
                  step={500}
                  type="number"
                  value={originalPrice}
                  onChange={(e) =>
                    setOriginalPrice(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  placeholder="45000 (Tùy chọn)"
                  className="w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition"
                />
                {originalPrice !== "" && Number(originalPrice) > 0 && price !== "" && (
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Giảm ~
                    {Math.max(
                      0,
                      Math.round((1 - Number(price) / Number(originalPrice)) * 100)
                    )}
                    %
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Tồn còn bán
                </label>
                <input
                  required
                  min={0}
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="50"
                  className="w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Theo đơn vị: <strong>{unit || "đơn vị"}</strong>
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                disabled={savingOffer}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-800 text-white font-bold text-sm hover:bg-emerald-900 transition-colors shadow-sm disabled:opacity-50"
              >
                {savingOffer ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Đang lưu giá & tồn…
                  </>
                ) : (
                  <>
                    <Tag size={16} />
                    {isEditingExisting ? "Cập nhật sản phẩm" : "Lưu giá và tồn kho"}
                  </>
                )}
              </button>

              {isEditingExisting && (
                <button
                  type="button"
                  onClick={resetOfferForm}
                  className="px-4 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition"
                >
                  Hủy
                </button>
              )}
            </div>
          </form>
        </section>
      </div>

      {/* ── Live Inventory & Catalog Table ──────────────────── */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
              <Boxes size={20} className="text-emerald-700" />
              <h2>Danh mục tồn kho thực tế · {currentStoreMeta?.name}</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 font-bold text-slate-600">
                {storeOffers.length} món
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Danh sách các nguyên liệu đã thiết lập giá bán và số lượng tồn còn lại trong kho.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                placeholder="Tìm tên, SKU, mã công thức…"
                className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 transition"
              />
            </div>

            {/* Category filter */}
            {storeCategories.length > 0 && (
              <select
                value={tableCategory}
                onChange={(e) => setTableCategory(e.target.value)}
                className="rounded-xl border border-slate-200 py-2 px-3 text-xs sm:text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                <option value="all">Tất cả danh mục</option>
                {storeCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Table Content */}
        {filteredOffers.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
            <Boxes size={36} className="mx-auto text-slate-300 mb-3" />
            <p className="text-sm font-bold text-slate-700">Chưa có dữ liệu tồn kho phù hợp</p>
            <p className="text-xs text-slate-400 mt-1">
              {storeOffers.length === 0
                ? `Cửa hàng ${currentStoreMeta?.name} chưa có mặt hàng nào. Hãy dùng form bên trên để thêm mặt hàng đầu tiên.`
                : "Không tìm thấy mặt hàng nào khớp với điều kiện tìm kiếm hoặc bộ lọc."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-100 text-xs uppercase tracking-wider">
                  <th className="py-3 px-4">Sản phẩm</th>
                  <th className="py-3 px-4">Mã công thức</th>
                  <th className="py-3 px-4">Danh mục</th>
                  <th className="py-3 px-4">Giá bán</th>
                  <th className="py-3 px-4">Tồn khả dụng</th>
                  <th className="py-3 px-4">Hiệu lực</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOffers.map((item) => {
                  const isOutOfStock = item.stock <= 0;
                  const isLowStock = item.stock > 0 && item.stock <= 10;

                  return (
                    <tr
                      key={`${item.store}-${item.ingredientId}`}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{item.name}</div>
                        <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                          SKU: {item.sku}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-semibold text-emerald-800 text-xs">
                        {item.ingredientId}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-medium">
                          {item.category || "Chưa phân loại"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-slate-900">
                          {formatVND(item.price)}
                          <span className="text-xs font-normal text-slate-400">/{item.unit}</span>
                        </div>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <div className="text-[11px] text-slate-400 line-through">
                            {formatVND(item.originalPrice)}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                            isOutOfStock
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : isLowStock
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isOutOfStock
                                ? "bg-rose-500"
                                : isLowStock
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            }`}
                          />
                          {item.stock} {item.unit}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 text-xs">
                        <div className="inline-flex items-center gap-1 text-[11px]">
                          <Clock size={12} className="text-slate-400" />
                          {item.validUntil
                            ? new Date(item.validUntil).toLocaleDateString("vi-VN", {
                                day: "2-digit",
                                month: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "24h"}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleFillOfferToForm(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 transition text-xs font-semibold"
                        >
                          <Pencil size={12} />
                          Sửa
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
