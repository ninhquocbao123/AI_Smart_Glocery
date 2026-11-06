export const WEEK_DAYS = ['T2','T3','T4','T5','T6','T7','CN'];
export function vietnamToday(now = new Date()) { return now.toLocaleDateString('en-CA', {timeZone:'Asia/Ho_Chi_Minh'}); }
export function shiftDate(date: string, days: number) { const d=new Date(date+'T00:00:00Z'); d.setUTCDate(d.getUTCDate()+days); return d.toISOString().slice(0,10); }
export function weekStart(date: string) { const weekday=new Date(date+'T00:00:00Z').getUTCDay(); return shiftDate(date,-((weekday+6)%7)); }
export function validWeek(value: unknown): value is string { return typeof value==='string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0,10)===value && weekStart(value)===value; }
export function dayDate(week: string, day: string) { return shiftDate(week,WEEK_DAYS.indexOf(day)); }
export function sameMeals(a: Record<string,string> = {}, b: Record<string,string> = {}) { return ['breakfast','lunch','dinner'].every(slot=>a[slot]===b[slot]); }
