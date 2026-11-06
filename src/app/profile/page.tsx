"use client";
import styles from "@/components/ui/WorkspacePages.module.css";


import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import MembershipStatus from "@/components/MembershipStatus";
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
    [target] = useState(user?.monthlyBudgetTarget ?? 0),
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
  return <div className={styles.profileRedesign}><header><p>TÀI KHOẢN CỦA BẠN</p><h1>Hồ sơ cá nhân</h1><span>Một chút thông tin để mỗi bữa ăn hợp với bạn hơn.</span></header><form onSubmit={save} className={styles.profileColumns}><aside><section className={styles.identityCard}><div className={styles.portrait}>{user?.avatar?<Image src={user.avatar} alt="Ảnh đại diện" fill sizes="104px"/>:<span>{user?.name.slice(0,1)}</span>}</div><label className={styles.photoButton}>Đổi ảnh đại diện<input type="file" accept="image/jpeg,image/png,image/webp" hidden disabled={busy} onChange={async e=>{const input=e.currentTarget,file=input.files?.[0];if(!file||!user)return;setBusy(true);setError('');try{const form=new FormData();form.append('image',file);const r=await fetch('/api/profile/avatar',{method:'POST',body:form});const d=await r.json();if(!r.ok)throw Error(d.message);setUser({...user,avatar:d.avatar});setMessage('Đã đổi ảnh đại diện.');}catch(err){setError(err instanceof Error?err.message:'Không thể tải ảnh.');}finally{setBusy(false);input.value='';}}}/></label><h2>{user?.name}</h2><p>Thành viên từ {user?.joinYear}</p><Link href="/orders">Đơn hàng của tôi →</Link></section><section><h2><UserRound size={18}/>Thông tin liên hệ</h2><label>Họ và tên<input required maxLength={100} value={name} onChange={e=>setName(e.target.value)}/></label><label>Số điện thoại<input type="tel" maxLength={20} value={phone} onChange={e=>setPhone(e.target.value)}/></label><label>Email đăng nhập<input readOnly value={user?.email??''}/></label><button className={styles.profileSave} disabled={busy}><Save size={16}/>{busy?'Đang lưu…':'Lưu thay đổi'}</button></section><button type="button" className={styles.profileLogout} disabled={busy} onClick={logout}><LogOut size={17}/>Đăng xuất</button></aside><div className={styles.profileMain}><section><h2><Utensils size={20}/>Khẩu vị của bạn</h2><p>Chọn chế độ ăn và những nguyên liệu bạn muốn tránh.</p><div className={styles.preferenceGrid}><fieldset><legend>Chế độ ăn uống</legend><div className={styles.preferenceChips}>{['Không hạn chế','Ăn chay','Ít tinh bột'].map(d=><button key={d} type="button" aria-pressed={diet===d} onClick={()=>setDiet(d)}>{d}</button>)}</div></fieldset><fieldset><legend>Dị ứng & kiêng kị</legend><div className={styles.allergyChips}>{['Hải sản','Đậu phộng','Trứng','Sữa'].map(a=><button type="button" key={a} aria-pressed={allergies.includes(a)} onClick={()=>setAllergies(prev=>prev.includes(a)?prev.filter(x=>x!==a):[...prev,a])}>{a}</button>)}</div></fieldset></div><div className={styles.preferenceNote}><ShieldCheck size={21}/><div><strong>Gợi ý phù hợp hơn với bạn</strong><p>Lựa chọn này được dùng để lọc công thức. Hãy kiểm tra thành phần trước khi nấu nếu bạn có dị ứng.</p></div></div></section><div className={styles.profileBottom}><section><h2><MapPin size={19}/>Địa chỉ giao hàng</h2><p>Địa chỉ mặc định cho những lần đặt hàng tiếp theo.</p><label>Nhà riêng<textarea maxLength={300} rows={5} value={address} onChange={e=>setAddress(e.target.value)} placeholder="Số nhà, đường, phường/xã, tỉnh/thành phố"/></label></section><section><h2>Gói thành viên</h2><MembershipStatus/><Link href="/budget" className={styles.budgetLink}>Quản lý ngân sách tháng →</Link><p>Thiết lập ngân sách và theo dõi các khoản mua sắm ở trang Ngân sách.</p></section></div>{message&&<p role="status">{message}</p>}{error&&<p role="alert" className="text-error">{error}</p>}</div></form></div>;
}
