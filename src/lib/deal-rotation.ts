export function vietnamDate(now = new Date()) {
  return new Date(+now + 7 * 3600000).toISOString().slice(0, 10);
}
/** A circular queue: consume every eligible ID before returning to the start. */
export function rotatingDeals(ids: string[], date: string, count = 20) {
  const pool = [...new Set(ids)].sort();
  if (!pool.length) return [];
  const day = Math.floor(Date.parse(date + 'T00:00:00Z') / 86400000);
  const offset = ((day * count) % pool.length + pool.length) % pool.length;
  return Array.from({length:Math.min(count,pool.length)}, (_,i)=>pool[(offset+i)%pool.length]);
}

export function nextDealSelection(ids: string[], history: {date:string;ids:string[]}[], count=20) {
  const seen=new Map<string,string>();
  for(const row of history)for(const id of row.ids)if((seen.get(id)??'')<row.date)seen.set(id,row.date);
  return [...new Set(ids)].sort((a,b)=>(seen.get(a)??'').localeCompare(seen.get(b)??'')||a.localeCompare(b)).slice(0,count);
}
