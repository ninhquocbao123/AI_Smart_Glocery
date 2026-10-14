import Link from "next/link";
import { KeyRound } from "lucide-react";
export default function ForgotPasswordPage(){return <div className="min-h-[75vh] flex items-center justify-center p-4"><section className="card-outlined p-8 max-w-md text-center space-y-5"><KeyRound className="mx-auto text-primary"/><h1 className="text-2xl font-bold">Khôi phục mật khẩu</h1><p className="text-on-surface-variant">Bản demo chưa hỗ trợ gửi email khôi phục. Vui lòng liên hệ nhóm quản trị dự án để được hỗ trợ tài khoản.</p><Link href="/auth/login" className="btn-filled">Quay lại đăng nhập</Link></section></div>}
