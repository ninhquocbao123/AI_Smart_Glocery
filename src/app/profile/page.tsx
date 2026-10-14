"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  UserRound,
  Save,
  LogOut,
  ShieldCheck,
  MapPin,
  Utensils,
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
export default function ProfilePage() {
  const { state, setUser } = useAppContext(),
    router = useRouter(),
    user = state.user;
  const [name, setName] = useState(user?.name ?? ""),
    [phone, setPhone] = useState(user?.phone ?? ""),
    [address, setAddress] = useState(user?.address ?? ""),
    [diet, setDiet] = useState(user?.diet ?? "Không hạn chế"),
    [allergies, setAllergies] = useState<string[]>(user?.allergies ?? []),
    [target, setTarget] = useState(user?.monthlyBudgetTarget ?? 1500000),
    [message, setMessage] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    setError("");
    try {
      const r = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          address,
          diet,
          allergies,
          monthlyBudgetTarget: target,
        }),
      });
      const d = await r.json();
      if (!r.ok) throw Error(d.message);
      setUser(d.user);
      setMessage("Đã lưu hồ sơ và sở thích của bạn.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không thể lưu hồ sơ.");
    } finally {
      setBusy(false);
    }
  }
  async function logout() {
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/auth/session", { method: "DELETE" });
      if (!r.ok) throw Error("Không thể đăng xuất. Vui lòng thử lại.");
      setUser(null);
      router.replace("/auth/login");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Có lỗi xảy ra.");
    } finally {
      setBusy(false);
    }
  }
  const field =
    "w-full rounded-xl border border-outline-variant bg-surface p-3 mt-2 outline-none focus:ring-2 focus:ring-primary/30";
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold text-primary">HỒ SƠ CÁ NHÂN</p>
        <h1 className="text-3xl font-extrabold mt-2">
          Gian bếp mang dấu ấn của bạn
        </h1>
        <p className="text-on-surface-variant mt-2">
          Cập nhật thông tin để chuẩn bị bữa ăn phù hợp hơn mỗi ngày.
        </p>
      </div>
      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        <aside className="space-y-4">
          <div className="card-outlined p-6 text-center">
            <div className="w-24 h-24 bg-primary-container text-primary rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
              {user?.name
                .split(" ")
                .map((n) => n[0])
                .slice(-2)
                .join("")
                .toUpperCase()}
            </div>
            <h2 className="text-xl font-bold mt-4">{user?.name}</h2>
            <p className="text-sm text-on-surface-variant break-all mt-2">
              {user?.email}
            </p>
            <p className="text-sm text-primary mt-4">
              Thành viên từ {user?.joinYear}
            </p>
            <Link href="/orders" className="btn-outlined w-full mt-6">
              Đơn hàng của tôi
            </Link>
          </div>
          <button
            disabled={busy}
            onClick={logout}
            className="btn-outlined w-full text-error"
          >
            <LogOut size={18} />
            Đăng xuất
          </button>
          <p className="text-xs text-on-surface-variant p-3 flex gap-2">
            <ShieldCheck size={18} />
            Thông tin được lưu theo tài khoản của bạn.
          </p>
        </aside>
        <form onSubmit={save} className="space-y-5">
          <section className="card-outlined p-6">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <UserRound size={20} />
              Thông tin liên hệ
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <label className="text-sm font-semibold">
                Họ và tên
                <input
                  required
                  maxLength={100}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={field}
                />
              </label>
              <label className="text-sm font-semibold">
                Số điện thoại
                <input
                  type="tel"
                  maxLength={20}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={field}
                />
              </label>
            </div>
            <label className="text-sm font-semibold block mt-4">
              Email đăng nhập
              <input
                readOnly
                value={user?.email ?? ""}
                className={field + " opacity-70"}
              />
            </label>
          </section>
          <section className="card-outlined p-6">
            <h2 className="font-bold text-lg flex gap-2 items-center">
              <MapPin size={20} />
              Địa chỉ giao hàng mặc định
            </h2>
            <textarea
              maxLength={300}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              aria-label="Địa chỉ giao hàng mặc định"
              placeholder="Số nhà, đường, phường/xã, tỉnh/thành phố"
              className={field}
            />
          </section>
          <section className="card-outlined p-6 space-y-4">
            <h2 className="font-bold text-lg flex gap-2 items-center">
              <Utensils size={20} />
              Khẩu vị & ngân sách
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="text-sm font-semibold">
                Chế độ ăn
                <select
                  value={diet}
                  onChange={(e) => setDiet(e.target.value)}
                  className={field}
                >
                  {["Không hạn chế", "Ăn chay", "Ít tinh bột"].map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-semibold">
                Ngân sách tháng (VNĐ)
                <input
                  type="number"
                  required
                  min={1}
                  max={1000000000}
                  value={target}
                  onChange={(e) => setTarget(Number(e.target.value))}
                  className={field}
                />
              </label>
            </div>
            <fieldset>
              <legend className="text-sm font-semibold mb-2">
                Nguyên liệu cần tránh
              </legend>
              <div className="flex flex-wrap gap-3">
                {["Hải sản", "Đậu phộng", "Trứng", "Sữa"].map((a) => (
                  <label
                    key={a}
                    className="flex gap-2 px-3 py-2 rounded-xl border border-outline-variant"
                  >
                    <input
                      type="checkbox"
                      checked={allergies.includes(a)}
                      onChange={() =>
                        setAllergies((prev) =>
                          prev.includes(a)
                            ? prev.filter((x) => x !== a)
                            : [...prev, a],
                        )
                      }
                    />
                    {a}
                  </label>
                ))}
              </div>
              <p className="text-xs text-on-surface-variant mt-3">
                Bộ gợi ý lọc theo nguyên liệu được ghi trong công thức; hãy kiểm
                tra đầy đủ thành phần trước khi nấu.
              </p>
            </fieldset>
          </section>
          {message && (
            <p role="status" className="text-primary">
              {message}
            </p>
          )}
          {error && (
            <p role="alert" className="text-error">
              {error}
            </p>
          )}
          <button disabled={busy} className="btn-filled">
            <Save size={18} />
            {busy ? "Đang lưu…" : "Lưu thay đổi"}
          </button>
        </form>
      </div>
    </div>
  );
}
