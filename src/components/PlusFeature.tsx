"use client";
import {useEffect,useState,type ReactNode} from 'react';
import Link from 'next/link';
export default function PlusFeature({children}:{children:ReactNode}) {
  const [plan,setPlan]=useState<string|null>(null),[error,setError]=useState('');
  useEffect(()=>{let alive=true;fetch('/api/membership').then(async r=>{const d=await r.json();if(!r.ok)throw Error(d.message);if(alive)setPlan(d.plan);}).catch(e=>{if(alive)setError(e.message);});return()=>{alive=false;};},[]);
  if(error)return <p role="alert">{error}</p>;
  if(!plan)return <p role="status">Đang kiểm tra gói thành viên…</p>;
  if(plan!=='plus')return <section className="bg-white border rounded-xl p-8 space-y-4"><h1 className="text-2xl font-bold">Tính năng dành cho VIP Plus</h1><p>Gói hiện tại chưa bao gồm quản lý tủ lạnh và phân tích chi tiêu nâng cao.</p><Link href="/membership" className="btn-filled">Xem gói thành viên</Link><Link href="/budget" className="btn-outlined ml-3">Xem ngân sách cơ bản</Link></section>;
  return children;
}
