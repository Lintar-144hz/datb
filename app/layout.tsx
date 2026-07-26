import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/lib/providers';

export const metadata: Metadata = {
  title: 'Tabungan Dev - Aplikasi Manajemen Keuangan Liquid Glass',
  description: 'Aplikasi manajemen keuangan & pencatatan tabungan personal dengan desain Apple Liquid Glass',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body suppressHydrationWarning className="antialiased selection:bg-purple-500/30">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
