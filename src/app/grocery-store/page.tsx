"use client";
import Link from "next/link";
import { Trash2, ShoppingBasket } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { formatVND } from "@/lib/priceUtils";
export default function CartPage() {
  const { state, removeFromCart, updateCartQuantity, cartTotal } =
    useAppContext();
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <p className="text-primary text-sm font-bold">DANH SÁCH ĐI CHỢ</p>
        <h1 className="text-3xl font-extrabold mt-2">
          Giỏ nguyên liệu của bạn
        </h1>
        <p className="text-on-surface-variant mt-2">
          Điều chỉnh số lượng trước khi chọn cửa hàng và đặt mua.
        </p>
        <Link href="/stores" className="text-primary underline">Xem Bách Hóa Xanh, WinMart và nguồn giá →</Link>
      </div>
      {!state.cart.length ? (
        <div className="card-outlined p-12 text-center">
          <ShoppingBasket className="mx-auto mb-4" />
          <h2 className="font-bold text-xl">Giỏ hàng đang trống</h2>
          <Link href="/meal-plan" className="btn-filled mt-5">
            Khám phá món Việt
          </Link>
        </div>
      ) : (
        <>
          <div className="card-outlined divide-y divide-outline-variant">
            {state.cart.map((i) => (
              <div
                key={i.ingredient.id}
                className="p-5 flex items-center justify-between gap-4 flex-wrap"
              >
                <div className="flex-1 min-w-40">
                  <h2 className="font-bold">{i.ingredient.name}</h2>
                  <p className="text-xs text-on-surface-variant mt-1">
                    {i.recipeTitle} · {i.ingredient.store}
                  </p>
                  <p className="text-sm mt-1">
                    {formatVND(i.ingredient.price)} / {i.ingredient.unit}
                  </p>
                </div>
                <label className="text-xs">
                  Số lượng ({i.ingredient.unit})
                  <input
                    aria-label={"Số lượng " + i.ingredient.name}
                    type="number"
                    min={1}
                    max={100000}
                    value={i.quantity}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      if (Number.isFinite(v) && v >= 1 && v <= 100000)
                        updateCartQuantity(i.ingredient.id, v);
                    }}
                    className="block w-24 border rounded-lg p-2 mt-1"
                  />
                </label>
                <strong className="text-primary">
                  {formatVND(i.quantity * i.ingredient.price)}
                </strong>
                <button
                  aria-label={"Xóa " + i.ingredient.name}
                  onClick={() => removeFromCart(i.ingredient.id)}
                  className="p-2 text-error"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
          <div className="card-outlined p-6 space-y-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Tạm tính</span>
              <span className="text-primary">{formatVND(cartTotal)}</span>
            </div>
            <p className="text-sm text-on-surface-variant">
              Giá nguyên liệu tham khảo. Tổng cuối cùng thay đổi theo cửa
              hàng và phí giao hàng ở bước tiếp theo.
            </p>
            <Link href="/checkout" className="btn-filled w-full">
              Chọn cửa hàng & đặt hàng →
            </Link>
          </div>
        </>
      )}
      <div className="flex gap-5 text-primary text-sm font-semibold">
        <Link href="/meal-plan">+ Thêm món ăn</Link>
        <Link href="/deals">Xem ưu đãi</Link>
      </div>
    </div>
  );
}
