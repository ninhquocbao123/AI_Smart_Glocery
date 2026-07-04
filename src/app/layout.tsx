import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import AppLayout from "@/components/layout/AppLayout";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "SmartCart AI — Đi chợ Thông minh bằng AI",
  description:
    "Trợ lý đi chợ bằng AI của bạn. Lên kế hoạch thực đơn, so sánh giá cả giữa các siêu thị và tối ưu hóa ngân sách.",
  keywords: [
    "grocery",
    "meal plan",
    "smart cart",
    "AI",
    "budget",
    "Vietnamese food",
    "Bach Hoa Xanh",
    "Winmart",
    "Coop Food",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AppProvider>
          <AppLayout>{children}</AppLayout>
        </AppProvider>
      </body>
    </html>
  );
}
