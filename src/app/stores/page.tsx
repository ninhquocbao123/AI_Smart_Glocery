"use client";
import { useEffect, useState } from "react";
import { storeDirectory } from "@/lib/stores";
import { formatVND } from "@/lib/priceUtils";
type Product = {
  _id: string;
  name: string;
  price: number;
  unit: string;
  store: string;
  source: string;
  updatedAt: string;
  stock: number;
};
export default function StoresPage() {
  const [products, setProducts] = useState<Product[]>([]),
    [error, setError] = useState("");
  useEffect(() => {
    fetch("/api/products")
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw Error(d.message);
        setProducts(d.products);
      })
      .catch((e) => setError(e.message));
  }, []);
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Cửa hàng thực phẩm</h1>
      <p>
        Nhóm chưa có kết nối đối tác với các chuỗi bên dưới. Bạn có thể mua trực
        tiếp tại website chính thức; đơn và thanh toán trên các website đó do
        cửa hàng xử lý.
      </p>
      <div className="grid sm:grid-cols-3 gap-4">
        {storeDirectory.map((s) => (
          <article key={s.key} className="card-outlined p-6 space-y-3">
            <h2 className="font-bold text-xl">{s.name}</h2>
            <p className="text-sm">
              Chưa kết nối API giá, tồn kho và đặt hàng.
            </p>
            <a
              className="btn-outlined"
              href={s.website}
              target="_blank"
              rel="noopener noreferrer"
            >
              Mở cửa hàng chính thức ↗
            </a>
          </article>
        ))}
      </div>
      <h2 className="text-xl font-bold">Giá do nhóm cập nhật</h2>
      <p className="text-sm">
        Dữ liệu dưới đây lấy từ backend của ứng dụng, không phải API trực tiếp
        của siêu thị. Giá chỉ hiển thị khi còn hiệu lực.
      </p>
      {error && (
        <p role="alert" className="text-error">
          {error}
        </p>
      )}
      {!products.length && <p>Chưa có bảng giá được cập nhật.</p>}
      {products.map((p) => (
        <article key={p._id} className="card-outlined p-4">
          <strong>{p.name}</strong>
          <p>
            {p.store} · {formatVND(p.price)}/{p.unit}
          </p>
          <p className="text-sm">
            Cập nhật: {new Date(p.updatedAt).toLocaleString("vi-VN")} · Nguồn:
            nhóm nhập thủ công
          </p>
        </article>
      ))}
    </div>
  );
}
