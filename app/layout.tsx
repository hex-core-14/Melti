// app/layout.tsx
import type { Metadata } from 'next';
import { ThemeProvider } from '@/app/context/ThemeContext';
import { CartProvider } from '@/app/context/CartContext';
import LivePourToast from '@/app/components/common/LivePourToast';
import './globals.css';

export const metadata: Metadata = {
  title: 'MÈLTI — Real Melted Hot Chocolate',
  description: '32% real cocoa hot chocolate sachets and family packs.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        <ThemeProvider>
          <CartProvider>
            {children}
            <LivePourToast />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}