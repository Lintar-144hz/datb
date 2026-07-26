'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { useTransactions } from '@/hooks/useTransactions';
import { useFinanceStore } from '@/store/useFinanceStore';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Trash2, Edit3, Receipt, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

export function TransactionTable() {
  const { transactions, isLoading, deleteTransaction } = useTransactions();
  const openAddTransactionModal = useFinanceStore((state) => state.openAddTransactionModal);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const totalPages = Math.ceil(transactions.length / itemsPerPage) || 1;
  const paginatedList = transactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <GlassCard className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Receipt className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          <span>Daftar Transaksi ({transactions.length})</span>
        </h3>
        <button
          onClick={() => openAddTransactionModal()}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-all shadow-md shadow-purple-500/20"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Tambah</span>
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3 py-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-14 bg-slate-200/50 dark:bg-slate-800/50 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div className="py-12 text-center space-y-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-purple-500/10 text-purple-500 mx-auto">
            <Receipt className="h-7 w-7" />
          </div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tidak ada transaksi ditemukan</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Silakan sesuaikan kata kunci / filter atau catat transaksi baru.</p>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="divide-y divide-slate-200/50 dark:divide-slate-800/80">
            {paginatedList.map((tx) => (
              <div
                key={tx.id}
                className="py-3 flex items-center justify-between gap-3 group hover:bg-white/30 dark:hover:bg-slate-800/30 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Badge type={tx.type} icon size="sm">
                    {tx.type === 'income' ? 'Masuk' : 'Keluar'}
                  </Badge>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                      {tx.category}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {tx.note ? `${tx.note} • ` : ''}{formatDate(tx.created_at)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`text-sm sm:text-base font-black ${
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
                      className="p-1.5 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 rounded-lg hover:bg-purple-500/10 transition-colors"
                      title="Edit Transaksi"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteTransaction(tx.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                      title="Hapus Transaksi"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 dark:border-slate-800">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Halaman {currentPage} dari {totalPages}
              </p>
              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </GlassCard>
  );
}
