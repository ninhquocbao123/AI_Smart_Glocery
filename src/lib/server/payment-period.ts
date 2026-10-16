import { ApiError } from './http';
export function paymentPeriod(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new ApiError(400,'Ngày không hợp lệ.');
  const [y,m,d]=date.split('-').map(Number);
  const utc=new Date(Date.UTC(y,m-1,d));
  if(utc.toISOString().slice(0,10)!==date)throw new ApiError(400,'Ngày không hợp lệ.');
  const offset=7*3600000;
  return { dayStart:new Date(+utc-offset),dayEnd:new Date(+utc-offset+86400000),monthStart:new Date(Date.UTC(y,m-1,1)-offset),monthEnd:new Date(Date.UTC(y,m,1)-offset) };
}
