"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, Zap } from "lucide-react";
import styles from "./Home.module.css";

export default function GoldenHourBanner() {
  const [golden, setGolden] = useState<{
    active: boolean;
    label: string;
    endsAt: string | null;
  } | null>(null);

  useEffect(() => {
    let alive = true;
    const refresh = async () => {
      try {
        const response = await fetch("/api/deals", { cache: "no-store" });
        if (!response.ok) throw Error();
        const data = await response.json();
        if (alive) {
          setGolden(
            data.golden?.endsAt && Date.parse(data.golden.endsAt) <= Date.now()
              ? null
              : data.golden ?? null,
          );
        }
      } catch {
        if (alive) setGolden(null);
      }
    };

    void refresh();
    const interval = setInterval(refresh, 15000);
    const focus = () => {
      if (!document.hidden) void refresh();
    };
    document.addEventListener("visibilitychange", focus);

    return () => {
      alive = false;
      clearInterval(interval);
      document.removeEventListener("visibilitychange", focus);
    };
  }, []);

  useEffect(() => {
    if (!golden?.active || !golden.endsAt) return;
    const timer = setTimeout(
      () => setGolden((g) => (g ? { ...g, active: false } : null)),
      Math.max(0, Date.parse(golden.endsAt) - Date.now()),
    );
    return () => clearTimeout(timer);
  }, [golden]);

  if (!golden?.active) return null;

  return (
    <aside className={styles.goldenBanner} aria-label="Ưu đãi giờ vàng đang diễn ra">
      <div className={styles.goldenLeft}>
        <div className={styles.goldenPulseWrap}>
          <Zap size={22} className="fill-white" />
        </div>
        <div className={styles.goldenContent}>
          <div className={styles.goldenHeader}>
            <span className={styles.goldenLiveBadge}>
              <span className={styles.goldenLiveDot} />
              ĐANG DIỄN RA
            </span>
            <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
              <Clock size={13} /> {golden.label}
            </span>
          </div>
          <h2 className={styles.goldenTitle}>Ưu đãi giờ vàng siêu thị hôm nay!</h2>
          <p className={styles.goldenDesc}>
            Bách Hóa Xanh, WinMart & Co.op Food giảm giá tới 35% cho các nguyên liệu tươi sống.
          </p>
        </div>
      </div>
      <Link href="/deals" className={styles.goldenAction}>
        <span>Săn ưu đãi ngay</span>
        <ArrowRight size={16} />
      </Link>
    </aside>
  );
}
