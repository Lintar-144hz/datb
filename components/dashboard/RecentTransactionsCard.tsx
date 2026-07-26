'use client';

import React from 'react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { useTransactions } from '@/hooks/useTransactions';
import { useFinanceStore } from '@/store/useFinanceStore';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ArrowRight, Receipt, Trash2, Edit3, Plus } from 'lucide-react';

export function RecentTransactionsCard() {
  const { transactions, isLoading, deleteTransaction } = useTransactions();
  const openAddTransactionModal = useFinanceStore((state) => state.openAddTransactionModal);

  const recentList = transactions.slice(0, 5);

  return (
    <GlassCard className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Receipt className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Transaksi Terbaru
          </h3>
        </div>
        <Link
          href="/transaksi"
          className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
        >
          <span>Lihat Semua</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3 py-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-slate-200/50 dark:bg-slate-800/50 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : recentList.length === 0 ? (
        <div className="py-8 text-center space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-500 mx-auto">
            <Receipt className="h-6 w-6" />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Belum ada transaksi dicatat.</p>
          <button
            onClick={() => openAddTransactionModal()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Tambah Transaksi Pertama</span>
          </button>
        </div>
      ) : (
        <div className="divide-y divide-slate-200/50 dark:divide-slate-800/80">
          {recentList.map((tx) => (
            <div
              key={tx.id}
              className="py-3 flex items-center justify-between gap-3 first:pt-0 last:pb-0 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Badge type={tx.type} icon size="sm">
                  {tx.type === 'income' ? 'Masuk' : 'Keluar'}
                </Badge>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                    {tx.category}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {tx.note || formatDate(tx.created_at)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-xs sm:text-sm font-extrabold whitespace-nowrap ${
                    tx.type === 'income'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.amount)}
                </span>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openAddTransactionModal(tx.id)}
                    className="p-1 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400"
                    title="Edit"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => deleteTransaction(tx.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
                    title="Hapus"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}
