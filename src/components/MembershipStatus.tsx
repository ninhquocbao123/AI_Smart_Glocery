"use client";
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {PLANS,type Plan} from '@/lib/membership';
export default function MembershipStatus(){const [data,setData]=useState<{plan:Plan;endsAt?:string;chatRemaining:number;mealRemaining:number}|null>(null);useEffect(()=>{fetch('/api/membership').then(r=>r.ok?r.json():null).then(setData).catch(()=>{});},[]);return <Link href="/membership" className="block border border-emerald-200 bg-emerald-50 p-5 rounded-2xl text-emerald-950"><div className="flex flex-wrap gap-3 justify-between"><strong>{data?PLANS[data.plan].name:'Gói thành viên'}</strong><span className="text-sm font-semibold">Xem quyền lợi & gia hạn →</span></div>{data&&<p className="text-sm mt-2">Còn {data.chatRemaining} lượt chat hôm nay · {data.mealRemaining} lượt thực đơn trong chu kỳ{data.endsAt?' · Hết hạn '+new Date(data.endsAt).toLocaleDateString('vi-VN',{timeZone:'Asia/Ho_Chi_Minh'}):''}</p>}</Link>}
