import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from '@/lib/providers';
import { PwaRegister } from '@/components/pwa/PwaRegister';

export const metadata: Metadata = {
  title: 'Tabungan Dev - Finansial Liquid Glass',
  description: 'Aplikasi manajemen keuangan & pencatatan tabungan personal dengan desain Apple Liquid Glass',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Tabungan Dev',
  },
  icons: {
    icon: '/icons/icon-192.svg',
    apple: '/icons/icon-192.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#9333ea',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body suppressHydrationWarning className="antialiased selection:bg-purple-500/30">
        <Providers>
          <PwaRegister />
          {children}
        </Providers>
      </body>
    </html>
  );
}
