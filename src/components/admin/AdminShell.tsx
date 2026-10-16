"use client";
import type {ReactNode} from 'react';
import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';
import {usePathname} from 'next/navigation';
import {ChefHat, LayoutDashboard, ReceiptText, LogOut, ArrowUpRight, ShieldCheck} from 'lucide-react';
export default function AdminShell({children,name,onLogout,error}:{children:ReactNode;name:string;onLogout:()=>Promise<void>;error:string}){
  const pathname=usePathname();
  const payments=pathname.startsWith('/admin/payments');
  const links=[{href:'/admin',label:'Quản trị',icon:LayoutDashboard,active:!payments},{href:'/admin/payments',label:'Lịch sử thanh toán',icon:ReceiptText,active:payments}];
  return <div className="min-h-screen bg-[#f6f7f9] text-slate-900 lg:pl-64">
    <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-100 flex-col z-40 px-5 py-8">
      <Link href="/admin" className="flex items-center gap-3 px-2"><BrandLogo size={52}/><span className="font-extrabold text-lg tracking-tight">Smart Grocery<span className="block text-[10px] text-slate-400 font-semibold tracking-[.2em] mt-1">KHÔNG GIAN QUẢN TRỊ</span></span></Link>
      <p className="text-[10px] tracking-[.2em] font-bold text-slate-400 px-4 mt-12 mb-4">ĐIỀU HÀNH</p>
      <nav className="space-y-2">{links.map(({href,label,icon:Icon,active})=><Link key={href} href={href} aria-current={active?'page':undefined} className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm transition-colors ${active?'bg-emerald-50 text-emerald-800 font-bold':'text-slate-500 hover:bg-slate-50'}`}><Icon size={19}/>{label}{active&&<span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-700"/>}</Link>)}</nav>
      <div className="mt-auto"><div className="rounded-2xl bg-[#f4f7f2] p-5 mb-6"><ChefHat size={24} className="text-emerald-700 mb-3"/><p className="font-semibold text-sm">Mỗi món ngon,<br/>một trải nghiệm tốt.</p><p className="text-xs text-slate-500 leading-relaxed mt-2">Chăm chút thực đơn để bữa cơm mỗi ngày thêm trọn vẹn.</p></div><button onClick={()=>void onLogout()} className="flex gap-3 items-center text-sm text-slate-500 hover:text-red-700 px-4 py-3 w-full"><LogOut size={18}/>Đăng xuất</button></div>
    </aside>
    <header className="bg-white/95 border-b border-slate-100 px-4 sm:px-8 lg:px-10 py-4 flex items-center justify-between gap-3 sticky top-0 z-30"><div><p className="text-[11px] text-slate-400 font-medium">Không gian làm việc <span className="mx-2">/</span> <span className="text-slate-700">{payments?'Thanh toán':'Quản trị'}</span></p><p className="font-semibold mt-1 text-sm">{payments?'Theo dõi doanh thu':'Quản lý thực đơn'}</p></div><div className="flex items-center gap-3"><span className="hidden sm:flex text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full items-center gap-1.5"><ShieldCheck size={14}/>Quản trị viên</span><div className="w-10 h-10 bg-[#f2e8d5] rounded-full flex items-center justify-center text-[#796338] font-bold" title={name}>{name.slice(0,1).toUpperCase()}</div><button className="lg:hidden p-2 text-slate-500" aria-label="Đăng xuất" onClick={()=>void onLogout()}><LogOut size={18}/></button></div></header>
    <nav className="lg:hidden flex gap-2 p-3 border-b border-slate-100 bg-white">{links.map(({href,label,active})=><Link key={href} href={href} aria-current={active?'page':undefined} className={`flex-1 text-center text-sm rounded-xl p-3 ${active?'bg-emerald-50 text-emerald-800 font-bold':'text-slate-500'}`}>{label}</Link>)}</nav>
    {error&&<p role="alert" className="mx-6 mt-4 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}
    <main className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-10 py-7 lg:py-10">{children}</main>
    <footer className="px-6 py-6 flex justify-between border-t border-slate-200/60 text-[11px] text-slate-400"><span>Smart Grocery · Bữa ngon để AI lo</span><span className="inline-flex items-center gap-1">Không gian quản trị <ArrowUpRight size={12}/></span></footer>
  </div>;
}
