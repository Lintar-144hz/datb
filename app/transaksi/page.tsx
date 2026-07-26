'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { GlassButton } from '@/components/ui/GlassButton';
import { TransactionFilters } from '@/components/transactions/TransactionFilters';
import { TransactionTable } from '@/components/transactions/TransactionTable';
import { useFinanceStore } from '@/store/useFinanceStore';
import { useTransactions } from '@/hooks/useTransactions';
import { formatCurrency } from '@/lib/utils';
import { Plus, ArrowDownLeft, ArrowUpRight, Wallet } from 'lucide-react';

export default function TransaksiPage() {
  const openAddTransactionModal = useFinanceStore((state) => state.openAddTransactionModal);
  const { totals } = useTransactions();

  return (
    <AppLayout>
      <PageHeader
        title="Manajemen Transaksi"
        subtitle="Catat, edit, hapus, filter, dan telusuri riwayat transaksi keuangan"
        action={
          <GlassButton
            variant="primary"
            onClick={() => openAddTransactionModal()}
            className="shadow-lg shadow-purple-500/25"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            <span>Tambah Transaksi Baru</span>
          </GlassButton>
        }
      />

      <div className="space-y-6">
        {/* Quick summary mini cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl glass-card flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Net Saldo</p>
              <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100">
                {formatCurrency(totals.totalBalance)}
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl glass-card flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <ArrowDownLeft className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Pemasukan</p>
              <p className="text-xs sm:text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(totals.totalIncome)}
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl glass-card flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400">
              <ArrowUpRight className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Pengeluaran</p>
              <p className="text-xs sm:text-sm font-extrabold text-rose-600 dark:text-rose-400">
                {formatCurrency(totals.totalExpense)}
              </p>
            </div>
          </div>
        </div>

        {/* Filter controls */}
        <TransactionFilters />

        {/* Main transactions table */}
        <TransactionTable />
      </div>
    </AppLayout>
  );
}
