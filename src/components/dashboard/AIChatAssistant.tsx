"use client";
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { MessageSquare, X, Send, RotateCcw } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
type Message = { role: 'user' | 'assistant'; text: string; links?: {title: string; href: string}[]; notice?: string };
const prompts = ['Cách nấu canh bí xanh?', 'My Budget hoạt động thế nào?', 'Thanh toán MoMo như thế nào?', 'Làm sao mua lại đơn hàng?'];
export default function AIChatAssistant() {
  const { state } = useAppContext();
  return <Assistant key={state.user?.id ?? 'guest'} />;
}
function Assistant() {
  const [open, setOpen] = useState(false), [input, setInput] = useState(''), [messages, setMessages] = useState<Message[]>([]), [busy, setBusy] = useState(false), [error, setError] = useState('');
  const end = useRef<HTMLDivElement>(null), pending = useRef(false), controller = useRef<AbortController | null>(null);
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, [messages, busy, open]);
  useEffect(() => () => controller.current?.abort(), []);
  async function send(text: string) {
    const question = text.trim();
    if (!question || pending.current) return;
    pending.current = true; setBusy(true); setError(''); setInput('');
    const previous = messages.slice(-8);
    setMessages(current => [...current, {role:'user',text:question}]);
    controller.current = new AbortController();
    const timer = setTimeout(() => controller.current?.abort(), 45000);
    try {
      const response = await fetch('/api/assistant', { method:'POST', headers:{'Content-Type':'application/json'}, signal:controller.current.signal, body:JSON.stringify({ message:question, history:previous.map(m=>({role:m.role,text:m.text.slice(0,2000)})) }) });
      const data = await response.json();
      if (!response.ok) throw Error(data.message || 'Chưa gửi được câu hỏi.');
      setMessages(current => [...current, {role:'assistant',text:data.answer,links:data.links,notice:data.notice}]);
    } catch (e) { setError((e as Error).name === 'AbortError' ? 'Phản hồi mất nhiều thời gian. Bạn hãy gửi lại câu hỏi.' : (e as Error).message); setInput(question); setMessages(current => current.slice(0,-1)); }
    finally { clearTimeout(timer); pending.current=false;setBusy(false); }
  }
  return <div className="fixed right-4 bottom-24 lg:bottom-6 z-50">{open ? <section aria-label="Trợ lý Smart Grocery" className="w-[390px] max-w-[calc(100vw-2rem)] h-[580px] max-h-[calc(100dvh-8rem)] rounded-2xl border border-outline-variant bg-surface shadow-2xl flex flex-col overflow-hidden">
    <header className="flex items-center gap-3 p-4 bg-primary text-white"><MessageSquare size={22}/><div className="flex-1"><h2 className="font-bold">Trợ lý Smart Grocery</h2><p className="text-xs opacity-90">Món ngon & hướng dẫn sử dụng</p></div><button disabled={busy} aria-label="Xóa hội thoại" className="p-1 disabled:opacity-40" onClick={()=>{setMessages([]);setError('');setInput('');}}><RotateCcw size={18}/></button><button aria-label="Đóng trợ lý" onClick={()=>setOpen(false)}><X size={22}/></button></header>
    <div role="log" aria-live="polite" aria-relevant="additions" className="flex-1 overflow-y-auto p-4 space-y-4">
      <div className="rounded-2xl bg-primary-container/30 p-3 text-sm leading-relaxed">Xin chào! Bạn muốn tìm hiểu cách nấu món nào, chọn nguyên liệu hay cần hướng dẫn dùng website?</div>
      {!messages.length && <div className="flex flex-wrap gap-2">{prompts.map(p=><button key={p} className="text-left rounded-xl border border-outline-variant p-2 text-xs hover:bg-primary-container/30" onClick={()=>void send(p)}>{p}</button>)}</div>}
      {messages.map((message,index)=><div key={index} className={message.role==='user'?'ml-8 rounded-2xl bg-primary p-3 text-white':'mr-3 rounded-2xl bg-primary-container/25 p-3'}><p className="text-xs font-bold mb-1 opacity-70">{message.role==='user'?'Bạn':'Trợ lý'}</p>{message.notice&&<p className="text-xs mb-2 opacity-75">{message.notice}</p>}<p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{message.text}</p>{message.links?.map(link=><Link key={link.href} href={link.href} onClick={()=>setOpen(false)} className="block text-sm text-primary font-semibold underline mt-3">{link.title} →</Link>)}</div>)}
      {busy&&<p role="status" className="text-sm text-primary animate-pulse">Đang tìm câu trả lời…</p>}<div ref={end}/>
    </div>
    <form className="border-t border-outline-variant p-3 space-y-2" onSubmit={e=>{e.preventDefault();void send(input);}}>{error&&<p role="alert" className="text-xs text-red-700">{error}</p>}<div className="flex items-end gap-2"><textarea aria-label="Câu hỏi cho trợ lý" disabled={busy} maxLength={1500} rows={2} placeholder="Hỏi về món ăn hoặc website…" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.nativeEvent.isComposing){e.preventDefault();void send(input);}}} className="flex-1 min-w-0 resize-none rounded-xl border border-outline-variant p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"/><button aria-label="Gửi câu hỏi" disabled={busy||!input.trim()} type="submit" className="bg-primary text-white p-3 rounded-xl disabled:opacity-40"><Send size={18}/></button></div><p className="text-[10px] text-on-surface-variant">Không gửi mật khẩu, OTP hoặc thông tin thẻ. Câu hỏi có thể được xử lý bởi AI.</p></form>
  </section> : <button aria-label="Mở trợ lý Smart Grocery" onClick={()=>setOpen(true)} className="rounded-full bg-primary text-white p-4 shadow-lg"><MessageSquare/></button>}</div>;
}
