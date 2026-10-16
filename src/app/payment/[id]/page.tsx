"use client";
import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, Copy, QrCode, ShieldCheck, Clock, RefreshCw } from 'lucide-react';
import { formatVND } from '@/lib/priceUtils';

type Session = { orderId: string; total: number; checkoutUrl?: string; bank?: { qrImage: string; accountNumber: string; accountName: string; bankBin: string; description: string; expiresAt: number } };
export default function PaymentPage() {
  const { id } = useParams<{id:string}>();
  return <Payment key={id} id={id}/>;
}
function Payment({id}:{id:string}) {
  const [session,setSession]=useState<Session|null>(null),[status,setStatus]=useState('loading'),[error,setError]=useState(''),[checking,setChecking]=useState(false),[copied,setCopied]=useState(''),[version,setVersion]=useState(0);
  const lock=useRef(false), alive=useRef(true);
  useEffect(()=>{alive.current=true;return()=>{alive.current=false;};},[]);
  useEffect(()=>{
    const controller=new AbortController();
    fetch('/api/payments',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({orderId:id,action:'create'}),signal:controller.signal,cache:'no-store'})
      .then(async r=>{const data=await r.json();if(!r.ok)throw Error(data.message||'Chưa tạo được mã thanh toán.');return data;})
      .then(data=>{if(controller.signal.aborted)return;if(data.paid){setStatus('paid');return;}if(data.terminal){setStatus(data.order?.paymentStatus==='review'?'review':'cancelled');return;}setSession(data);setStatus('pending');setError('');})
      .catch(e=>{if(!controller.signal.aborted){setStatus('error');setError(e.message);}});
    return()=>controller.abort();
  },[id,version]);
  const check=useCallback(async()=>{
    if(lock.current)return;lock.current=true;setChecking(true);
    try{
      const r=await fetch('/api/payments',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({orderId:id,action:'check'}),signal:AbortSignal.timeout(20000),cache:'no-store'});
      const data=await r.json();if(!r.ok)throw Error(data.message||'Chưa kiểm tra được giao dịch.');if(!alive.current)return;
      setError('');
      if(data.paid)setStatus('paid');
      else if(data.order?.paymentStatus==='review')setStatus('review');
      else if(data.order?.status==='cancelled'||data.providerStatus==='CANCELLED')setStatus('cancelled');
      else if(data.providerStatus==='EXPIRED')setStatus('expired');
      else if(session?.bank?.expiresAt&&Date.now()>=session.bank.expiresAt*1000)setStatus('expired');
    }catch(e){if(alive.current)setError((e as Error).name==='TimeoutError'?'Kết nối chậm. Bạn có thể kiểm tra lại.':(e as Error).message);}
    finally{lock.current=false;if(alive.current)setChecking(false);}
  },[id,session]);
  useEffect(()=>{
    if(status!=='pending')return;
    const timer=setInterval(()=>{if(document.visibilityState==='visible')void check();},15000);
    return()=>clearInterval(timer);
  },[status,check]);
  useEffect(()=>{
    if(status!=='pending'||!session?.bank?.expiresAt)return;
    const remaining=session.bank.expiresAt*1000-Date.now();
    const timer=setTimeout(()=>{setStatus('expired');void check();},Math.max(0,remaining));
    return()=>clearTimeout(timer);
  },[status,session,check]);
  async function copy(value:string,label:string){try{await navigator.clipboard.writeText(value);setCopied('Đã sao chép '+label);}catch{setCopied('Không thể sao chép tự động. Bạn có thể chọn và sao chép nội dung.');}}
  const titles:Record<string,string>={paid:'Thanh toán thành công',cancelled:'Phiên thanh toán đã hủy',expired:'Mã thanh toán đã hết hạn',review:'Giao dịch cần được đối soát'};
  const terminal=['paid','cancelled','expired','review'].includes(status);
  return <div className="max-w-4xl mx-auto space-y-6 pb-12"><Link href="/orders" className="text-primary text-sm font-semibold">← Đơn hàng của tôi</Link>
    <header><p className="text-primary text-sm font-bold tracking-widest">SMART GROCERY · THANH TOÁN</p><h1 className="text-3xl md:text-4xl font-extrabold mt-3">Quét mã, sẵn sàng vào bếp</h1><p className="mt-3 text-on-surface-variant">Đơn hàng <span className="font-semibold break-all">{id}</span></p></header>
    {error&&<p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p>}
    {status==='loading'&&<div role="status" className="card-outlined p-12 text-center">Đang chuẩn bị phiên thanh toán…</div>}
    {status==='error'&&<div className="card-outlined p-6 space-y-4"><p>Đơn hàng vẫn được giữ trong lịch sử. Không cần đặt lại đơn.</p><button className="btn-filled" onClick={()=>{setStatus('loading');setVersion(v=>v+1);}}>Tải lại phiên thanh toán</button><button className="btn-outlined ml-3" disabled={checking} onClick={()=>void check()}>Kiểm tra giao dịch</button></div>}
    {terminal?<section className="card-outlined p-8 md:p-12 text-center space-y-5">{status==='paid'?<CheckCircle2 className="mx-auto text-primary" size={64}/>:<Clock className="mx-auto text-amber-600" size={56}/>}<h2 className="text-2xl font-bold" role="status">{titles[status]}</h2><p className="text-on-surface-variant">{status==='paid'?'Hệ thống đã xác nhận nhận tiền. Bạn có thể theo dõi đơn trong lịch sử.':status==='review'?'Giao dịch cần quản trị viên kiểm tra. Vui lòng không chuyển tiền lần nữa.':'Không chuyển tiền bằng mã này. Nếu đã chuyển khoản, kiểm tra giao dịch hoặc liên hệ quản trị viên trước khi đặt lại.'}</p>{status!=='paid'&&<button disabled={checking} onClick={()=>void check()} className="btn-outlined">Kiểm tra giao dịch</button>}<Link href="/orders" className="btn-filled">Xem đơn hàng</Link></section>:session&&status==='pending'&&<div className="grid md:grid-cols-[1fr_1fr] gap-6">
      <section className="card-outlined p-5 md:p-7 text-center space-y-4"><div className="inline-flex items-center gap-2 text-primary font-bold"><QrCode size={20}/> QR ngân hàng · payOS</div>{session.bank?<><div className="bg-white rounded-2xl border border-outline-variant p-2 mx-auto max-w-[340px]"><Image src={session.bank.qrImage} width={360} height={360} unoptimized alt={'Mã QR thanh toán đơn '+id} className="w-full h-auto"/></div><p className="text-sm text-on-surface-variant">Mở ứng dụng ngân hàng → Quét QR.<br/>Kiểm tra người nhận và số tiền trước khi xác nhận.</p><p className="text-xs text-on-surface-variant">Hạn thanh toán: {new Date(session.bank.expiresAt*1000).toLocaleString('vi-VN',{timeZone:'Asia/Ho_Chi_Minh'})}</p></>:<p>Phiên cũ chưa có QR lưu trong website. Bạn có thể mở trang payOS để tiếp tục thanh toán.</p>}
        {session.checkoutUrl&&<a href={session.checkoutUrl} target="_blank" rel="noreferrer" className="text-sm text-primary underline">Mở trang thanh toán của nhà cung cấp ↗</a>}
      </section><section className="card-outlined p-6 md:p-8 space-y-6"><div><p className="text-sm text-on-surface-variant">Tổng thanh toán</p><p className="text-3xl font-extrabold text-primary mt-2">{formatVND(session.total)}</p><p className="text-xs text-on-surface-variant mt-2">Đã bao gồm phí giao hàng của đơn.</p></div>
        {session.bank&&<div className="space-y-4">{[['Người nhận',session.bank.accountName],['Số tài khoản',session.bank.accountNumber],['Mã ngân hàng',session.bank.bankBin],['Nội dung chuyển khoản',session.bank.description]].map(([label,value])=><div key={label} className="flex items-start justify-between gap-3 border-b border-outline-variant pb-3"><div><p className="text-xs text-on-surface-variant">{label}</p><p className="font-semibold mt-1 break-all">{value}</p></div><button onClick={()=>void copy(value,label)} aria-label={'Sao chép '+label} className="p-2 text-primary"><Copy size={17}/></button></div>)}</div>}
        {copied&&<p role="status" className="text-xs text-primary">{copied}</p>}<div className="rounded-xl bg-primary-container/30 p-4 space-y-2"><p className="font-semibold text-primary flex items-center gap-2"><Clock size={18}/>Đang chờ thanh toán</p><p className="text-xs text-on-surface-variant">Tự kiểm tra mỗi 15 giây khi bạn mở trang này. Không cần tải lại trang sau khi chuyển tiền.</p></div><button disabled={checking} onClick={()=>void check()} className="btn-filled w-full"><RefreshCw size={17} className={checking?'animate-spin':''}/>{checking?'Đang kiểm tra…':'Kiểm tra thanh toán'}</button><p className="text-xs text-on-surface-variant flex gap-2"><ShieldCheck size={18} className="shrink-0"/>Trạng thái được xác nhận từ máy chủ, không phụ thuộc vào việc bấm nút hoặc quay lại trang.</p>
      </section></div>}
  </div>;
}
