"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import styles from "./Home.module.css";

export default function GoldenHourBanner() {
  const [golden, setGolden] = useState<{active:boolean;label:string;endsAt:string|null}|null>(null);
  useEffect(() => {
    let alive = true;
    const refresh = async () => {
      try {
        const response = await fetch('/api/deals', {cache:'no-store'});
        if (!response.ok) throw Error();
        const data = await response.json();
        if (alive) setGolden(data.golden?.endsAt && Date.parse(data.golden.endsAt)<=Date.now() ? null : data.golden ?? null);
      } catch { if (alive) setGolden(null); }
    };
    void refresh();
    const interval = setInterval(refresh, 15000);
    const focus = () => { if (!document.hidden) void refresh(); };
    document.addEventListener('visibilitychange', focus);
    return () => { alive=false; clearInterval(interval); document.removeEventListener('visibilitychange', focus); };
  }, []);
  useEffect(() => {
    if (!golden?.active || !golden.endsAt) return;
    const timer = setTimeout(() => setGolden(g => g ? {...g,active:false} : null), Math.max(0, Date.parse(golden.endsAt)-Date.now()));
    return () => clearTimeout(timer);
  }, [golden]);
  if (!golden?.active) return null;
  return <aside className={styles.goldenBanner} aria-label="Giờ vàng đang diễn ra"><div><span><Clock size={16}/>Ưu đãi hôm nay</span><h2>Ưu đãi giờ vàng đang diễn ra</h2><p>{golden.label} · Giá ưu đãi trong khung giờ hôm nay.</p></div><Link href="/deals">Xem ưu đãi <ArrowRight size={18}/></Link></aside>;
}
