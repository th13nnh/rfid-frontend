import type { Metadata } from 'next';
import { Bebas_Neue, Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const beVietnamPro = Be_Vietnam_Pro({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin', 'vietnamese'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ĐẠI HỘI HỘI LHTN PHƯỜNG AN PHÚ',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${bebasNeue.variable} ${beVietnamPro.variable}`}>
      <body className="antialiased overflow-hidden">{children}</body>
    </html>
  );
}