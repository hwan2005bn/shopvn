import { Toaster } from 'react-hot-toast';
import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
// 1. Import file Providers (ThemeProvider) của bạn vào đây
import Providers from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: 'ShopVN - Cửa hàng công nghệ',
  description: 'Mua sắm công nghệ chính hãng',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // 2. BỔ SUNG: suppressHydrationWarning vào thẻ <html> 
    // Thuộc tính này bắt buộc phải có khi làm Dark Mode để Next.js không báo lỗi lệch cấu trúc HTML khi nạp trang
    <html lang="vi" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-50 transition-colors duration-300">

        {/* 3. BẮT BUỘC: Bọc toàn bộ các phần hiển thị trong Providers */}
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster position="top-right" />
        </Providers>

      </body>
    </html>
  );
}