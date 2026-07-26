'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Plus, Target, FileSpreadsheet, ArrowLeftRight } from 'lucide-react';
import { useFinanceStore } from '@/store/useFinanceStore';
import { useTransactions } from '@/hooks/useTransactions';
import { exportToCSV } from '@/lib/utils';
import Link from 'next/link';

export function QuickActionsGrid() {
  const openAddTransactionModal = useFinanceStore((state) => state.openAddTransactionModal);
  const openAddGoalModal = useFinanceStore((state) => state.openAddGoalModal);
  const { transactions } = useTransactions();

  const handleExportCSV = () => {
    if (!transactions.length) return;
    const formatted = transactions.map((t) => ({
      Tanggal: t.created_at,
      Tipe: t.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
      Kategori: t.category,
      Jumlah: t.amount,
      Catatan: t.note || '-',
    }));
    exportToCSV('TabunganDev_Transaksi', formatted);
  };

  const actions = [
    {
      title: 'Tambah Transaksi',
      description: 'Catat pemasukan / pengeluaran',
      icon: Plus,
      color: 'bg-purple-600 text-white shadow-purple-500/20',
      onClick: () => openAddTransactionModal(),
    },
    {
      title: 'Buat Target',
      description: 'Tabungan impian baru',
      icon: Target,
      color: 'bg-emerald-600 text-white shadow-emerald-500/20',
      onClick: () => openAddGoalModal(),
    },
    {
      title: 'Kelola Transaksi',
      description: 'Cari & filter riwayat',
      icon: ArrowLeftRight,
      color: 'bg-blue-600 text-white shadow-blue-500/20',
      href: '/transaksi',
    },
    {
      title: 'Export CSV',
      description: 'Unduh laporan finansial',
      icon: FileSpreadsheet,
      color: 'bg-amber-600 text-white shadow-amber-500/20',
      onClick: handleExportCSV,
    },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
        Quick Action
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {actions.map((act, idx) => {
          const Icon = act.icon;
          const content = (
            <GlassCard
              key={idx}
              interactive
              className="p-4 flex flex-col items-start gap-2 h-full hover:border-purple-500/40"
              onClick={act.onClick}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${act.color} shadow-md`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                  {act.title}
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {act.description}
                </p>
              </div>
            </GlassCard>
          );

          if (act.href) {
            return (
              <Link key={idx} href={act.href} className="block">
                {content}
              </Link>
            );
          }

          return content;
        })}
      </div>
    </div>
  );
}
