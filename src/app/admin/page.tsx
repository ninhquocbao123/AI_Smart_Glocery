"use client";
import { useEffect, useState } from "react";
import { storeDirectory } from "@/lib/stores";
import { formatVND } from "@/lib/priceUtils";
type AdminOrder = {
  orderId: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  total: number;
  address: string;
  phone: string;
  mode: string;
};
export default function AdminPage() {
  const [allowed, setAllowed] = useState(false),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false),
    [orders, setOrders] = useState<AdminOrder[]>([]);
  const [store, setStore] = useState("Winmart"),
    [branch, setBranch] = useState(""),
    [sellerName, setSellerName] = useState(""),
    [serviceArea, setServiceArea] = useState(""),
    [fee, setFee] = useState(0),
    [accepting, setAccepting] = useState(false);
  const [ingredientId, setIngredientId] = useState(""),
    [sku, setSku] = useState(""),
    [name, setName] = useState(""),
    [unit, setUnit] = useState(""),
    [category, setCategory] = useState("Rau củ"),
    [price, setPrice] = useState(0),
    [stock, setStock] = useState(0);
  async function refresh() {
    const r = await fetch("/api/admin/orders");
    const d = await r.json();
    if (!r.ok) throw Error(d.message);
    setOrders(d.orders);
  }
  useEffect(() => {
    fetch("/api/admin/catalog")
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw Error(d.message);
        setAllowed(true);
        await refresh();
      })
      .catch((e) => setMessage(e.message));
  }, []);
  async function send(url: string, method: string, data: object) {
    setBusy(true);
    setMessage("");
    try {
      const r = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const d = await r.json();
      if (!r.ok) throw Error(d.message);
      setMessage("Đã lưu thành công.");
      await refresh();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Không thể lưu.");
    } finally {
      setBusy(false);
    }
  }
  const field = "block w-full border rounded-xl p-3 mt-1";
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold">Quản trị vận hành</h1>
      {message && (
        <p role="status" className="p-4 bg-surface-container rounded-xl">
          {message}
        </p>
      )}
      {!allowed ? (
        <p>
          Tài khoản phải được quản trị hệ thống cấp quyền trước khi sử dụng.
        </p>
      ) : (
        <>
          <p>
            Dữ liệu nhập tại đây thuộc trách nhiệm của nhóm. Không có kết nối tự
            động đặt hàng với các siêu thị. Chỉ bật nhận đơn khi nhóm có nguồn
            hàng và người xử lý giao hàng.
          </p>
          <label>
            Cửa hàng nguồn
            <select
              className={field}
              value={store}
              onChange={(e) => {
                setStore(e.target.value);
                setBranch("");
                setSellerName("");
                setServiceArea("");
                setAccepting(false);
              }}
            >
              {storeDirectory.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <div className="grid md:grid-cols-2 gap-6">
            <form
              className="card-outlined p-5 space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                void send("/api/admin/catalog", "PUT", {
                  kind: "store",
                  store,
                  branch,
                  sellerName,
                  serviceArea,
                  deliveryFee: fee,
                  acceptingOrders: accepting,
                });
              }}
            >
              <h2 className="font-bold text-xl">
                Thông tin người bán / giao hàng
              </h2>
              <label className="block">
                Chi nhánh / khu vực nguồn hàng
                <input
                  required
                  className={field}
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                />
              </label>
              <label className="block">
                Đơn vị thực sự bán và nhận tiền
                <input
                  required
                  className={field}
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                />
              </label>
              <label className="block">
                Khu vực giao hàng
                <input
                  required
                  className={field}
                  value={serviceArea}
                  onChange={(e) => setServiceArea(e.target.value)}
                />
              </label>
              <label className="block">
                Phí giao (VNĐ)
                <input
                  required
                  min={0}
                  type="number"
                  className={field}
                  value={fee}
                  onChange={(e) => setFee(Number(e.target.value))}
                />
              </label>
              <label className="flex gap-2">
                <input
                  type="checkbox"
                  checked={accepting}
                  onChange={(e) => setAccepting(e.target.checked)}
                />
                Nhóm đã sẵn sàng cung ứng và nhận đơn
              </label>
              <button disabled={busy} className="btn-filled">
                Lưu cấu hình cửa hàng
              </button>
            </form>
            <form
              className="card-outlined p-5 space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                void send("/api/admin/catalog", "PUT", {
                  store,
                  ingredientId,
                  sku,
                  name,
                  unit,
                  category,
                  price,
                  stock,
                  validUntil: new Date(Date.now() + 86400000).toISOString(),
                });
              }}
            >
              <h2 className="font-bold text-xl">Cập nhật giá và tồn còn bán</h2>
              <p className="text-sm">
                Giá có hiệu lực 24 giờ. Số lượng dưới đây là tồn chưa giữ cho
                đơn khác; phải dùng đúng đơn vị trong công thức.
              </p>
              <label className="block">
                Mã nguyên liệu trong công thức
                <input
                  required
                  className={field}
                  value={ingredientId}
                  onChange={(e) => setIngredientId(e.target.value)}
                  placeholder="i-001-1"
                />
              </label>
              <label className="block">
                Mã sản phẩm của cửa hàng
                <input
                  required
                  className={field}
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                />
              </label>
              <label className="block">
                Tên sản phẩm
                <input
                  required
                  className={field}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label>
                  Đơn vị
                  <input
                    required
                    className={field}
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                  />
                </label>
                <label>
                  Danh mục
                  <input
                    required
                    className={field}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label>
                  Giá / đơn vị
                  <input
                    required
                    min={1}
                    type="number"
                    className={field}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                  />
                </label>
                <label>
                  Tồn còn bán
                  <input
                    required
                    min={0}
                    type="number"
                    className={field}
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                  />
                </label>
              </div>
              <button disabled={busy} className="btn-filled">
                Lưu giá và tồn
              </button>
            </form>
          </div>
          <h2 className="text-xl font-bold">Đơn hàng cần xử lý</h2>
          <button
            className="btn-outlined"
            onClick={() => refresh().catch((e) => setMessage(e.message))}
          >
            Tải lại
          </button>
          {orders.map((o) => (
            <article className="card-outlined p-5 space-y-3" key={o.orderId}>
              <strong>{o.orderId}</strong>
              <p>
                {o.mode ?? "demo"} · {o.status} ·{" "}
                {o.paymentStatus ?? "chưa rõ thanh toán"} · {formatVND(o.total)}
              </p>
              <p>
                {o.phone} · {o.address}
              </p>
              <div className="flex gap-3 flex-wrap">
                {o.status === "confirmed" && (
                  <button
                    disabled={busy}
                    className="btn-outlined"
                    onClick={() =>
                      send("/api/admin/orders", "PATCH", {
                        orderId: o.orderId,
                        status: "delivering",
                      })
                    }
                  >
                    Bắt đầu giao
                  </button>
                )}
                {o.status === "delivering" && (
                  <button
                    disabled={busy}
                    className="btn-outlined"
                    onClick={() =>
                      send("/api/admin/orders", "PATCH", {
                        orderId: o.orderId,
                        status: "delivered",
                      })
                    }
                  >
                    Đã giao hàng
                  </button>
                )}
                {["delivered", "completed"].includes(o.status) &&
                  o.paymentMethod === "cod" &&
                  o.paymentStatus === "cod" && (
                    <button
                      disabled={busy}
                      className="btn-outlined"
                      onClick={() =>
                        send("/api/admin/orders", "PATCH", {
                          orderId: o.orderId,
                          action: "confirmCod",
                        })
                      }
                    >
                      Xác nhận đã thu COD
                    </button>
                  )}
              </div>
            </article>
          ))}
        </>
      )}
    </div>
  );
}
