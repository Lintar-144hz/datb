'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Receipt,
  Target,
  BarChart3,
  History,
  Settings,
  Plus,
  Wallet,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFinanceStore } from '@/store/useFinanceStore';
import { useAuthStore } from '@/store/useAuthStore';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Transaksi', href: '/transaksi', icon: Receipt },
  { name: 'Target', href: '/target', icon: Target },
  { name: 'Statistik', href: '/statistik', icon: BarChart3 },
  { name: 'Riwayat', href: '/riwayat', icon: History },
  { name: 'Pengaturan', href: '/pengaturan', icon: Settings },
];

export function FloatingNavbar() {
  const pathname = usePathname();
  const openAddTransactionModal = useFinanceStore((state) => state.openAddTransactionModal);
  const user = useAuthStore((state) => state.user);

  // Do not display navbar on login page
  if (pathname === '/login' || !user) {
    return null;
  }

  return (
    <>
      {/* Desktop Top Floating Navbar */}
      <header className="fixed top-4 inset-x-0 z-40 hidden md:flex justify-center px-4 pointer-events-none">
        <div className="floating-nav-glass pointer-events-auto flex items-center justify-between gap-6 rounded-full px-6 py-3 max-w-5xl w-full">
          {/* Logo Brand */}
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 text-white shadow-md shadow-purple-500/30 group-hover:scale-105 transition-transform">
              <Wallet className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-300 bg-clip-text text-transparent">
              Tabungan Dev
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 flex items-center gap-1.5',
                    isActive
                      ? 'text-purple-600 dark:text-purple-300'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/40 dark:hover:bg-slate-800/40'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabDesktop"
                      className="absolute inset-0 bg-purple-500/15 dark:bg-purple-500/25 rounded-full border border-purple-500/30"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon className="h-4 w-4 relative z-10" />
                  <span className="relative z-10">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Quick Add Action Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => openAddTransactionModal()}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-full shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 active:scale-95 transition-all"
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              <span>Transaksi Baru</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Floating Liquid Glass Bar */}
      <nav className="fixed bottom-4 inset-x-4 z-40 md:hidden pointer-events-none">
        <div className="floating-nav-glass pointer-events-auto flex items-center justify-around rounded-3xl p-2 max-w-md mx-auto shadow-2xl border border-white/40 dark:border-white/10">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all duration-200',
                  isActive
                    ? 'text-purple-600 dark:text-purple-300 font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabMobile"
                    className="absolute inset-0 bg-purple-500/15 dark:bg-purple-500/25 rounded-2xl border border-purple-500/30"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className="h-5 w-5 relative z-10" />
                <span className="text-[10px] mt-1 relative z-10">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
