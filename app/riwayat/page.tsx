'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassInput } from '@/components/ui/GlassInput';
import { Badge } from '@/components/ui/Badge';
import { useTransactions } from '@/hooks/useTransactions';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency, formatDate, exportToCSV } from '@/lib/utils';
import { History, FileSpreadsheet, Search, Clock, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export default function RiwayatPage() {
  const { transactions, isLoading } = useTransactions();
  const { user } = useAuth();
  const [search, setSearch] = useState('');

  const filteredHistory = transactions.filter((t) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      t.category.toLowerCase().includes(q) ||
      (t.note && t.note.toLowerCase().includes(q)) ||
      t.amount.toString().includes(q)
    );
  });

  const handleExport = () => {
    if (!filteredHistory.length) return;
    const formatted = filteredHistory.map((t) => ({
      Waktu: t.created_at,
      Tipe: t.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
      Kategori: t.category,
      Jumlah: t.amount,
      Catatan: t.note || '-',
    }));
    exportToCSV(`TabunganDev_Riwayat_${user?.username || 'user'}`, formatted);
  };

  return (
    <AppLayout>
      <PageHeader
        title="Riwayat Aktivitas & Log"
        subtitle="Jejak kronologis seluruh aktivitas keuangan & transaksi akun Anda"
        action={
          <GlassButton variant="primary" onClick={handleExport}>
            <FileSpreadsheet className="h-4 w-4 mr-1.5" />
            <span>Export Riwayat (CSV)</span>
          </GlassButton>
        }
      />

      <div className="space-y-6">
        {/* Search Input */}
        <GlassCard className="p-4">
          <GlassInput
            placeholder="Telusuri riwayat berdasarkan kata kunci..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="h-4 w-4" />}
          />
        </GlassCard>

        {/* Timeline Log */}
        <GlassCard className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <History className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <span>Timeline Riwayat ({filteredHistory.length})</span>
            </h3>
          </div>

          {isLoading ? (
            <div className="space-y-3 py-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 bg-slate-200/50 dark:bg-slate-800/50 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500 dark:text-slate-400 space-y-2">
              <Clock className="h-8 w-8 mx-auto opacity-40 text-purple-500" />
              <p className="font-semibold text-slate-700 dark:text-slate-300">Belum ada riwayat tercatat.</p>
            </div>
          ) : (
            <div className="relative pl-6 border-l-2 border-purple-500/30 space-y-6 my-2">
              {filteredHistory.map((tx) => (
                <div key={tx.id} className="relative group">
                  {/* Timeline Dot Indicator */}
                  <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-purple-600 ring-4 ring-purple-500/20 flex items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-white" />
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge type={tx.type} icon size="sm">
                          {tx.type === 'income' ? 'Masuk' : 'Keluar'}
                        </Badge>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          {tx.category}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {tx.note || 'Transaksi Keuangan Tabungan Dev'}
                      </p>
                      <p className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">
                        {formatDate(tx.created_at, {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>

                    <div className="sm:text-right shrink-0">
                      <p
                        className={`text-base font-black ${
                          tx.type === 'income'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.amount)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </AppLayout>
  );
}
