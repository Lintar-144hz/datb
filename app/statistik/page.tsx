'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { GlassCard } from '@/components/ui/GlassCard';
import { CategoryPieChart } from '@/components/statistics/CategoryPieChart';
import { BarComparisonChart } from '@/components/statistics/BarComparisonChart';
import { FinanceLineChartCard } from '@/components/dashboard/FinanceLineChartCard';
import { useStats } from '@/hooks/useStats';
import { useFinanceStore, TimeRangeOption } from '@/store/useFinanceStore';
import { formatCurrency } from '@/lib/utils';
import { BarChart3, TrendingUp, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export default function StatistikPage() {
  const { periodTotals, activeRange, totalTransactions } = useStats();
  const setTimeRange = useFinanceStore((state) => state.setTimeRange);

  const rangeButtons: { label: string; value: TimeRangeOption }[] = [
    { label: '7 Hari Terakhir', value: '7d' },
    { label: '30 Hari Terakhir', value: '30d' },
    { label: '1 Tahun Terakhir', value: '1y' },
  ];

  return (
    <AppLayout>
      <PageHeader
        title="Statistik & Analisis Finansial"
        subtitle="Visualisasi mendalam pengeluaran, alokasi kategori & pola penghematan"
        action={
          <div className="flex items-center gap-1 bg-slate-200/60 dark:bg-slate-800/60 p-1.5 rounded-2xl backdrop-blur-md">
            {rangeButtons.map((b) => (
              <button
                key={b.value}
                onClick={() => setTimeRange(b.value)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  activeRange === b.value
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        }
      />

      <div className="space-y-6">
        {/* Period Summary Metric Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <GlassCard className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Pemasukan Periode Ini
              </p>
              <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {formatCurrency(periodTotals.income)}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <ArrowDownLeft className="h-5 w-5" />
            </div>
          </GlassCard>

          <GlassCard className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Pengeluaran Periode Ini
              </p>
              <p className="text-xl font-black text-rose-600 dark:text-rose-400 mt-1">
                {formatCurrency(periodTotals.expense)}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400">
              <ArrowUpRight className="h-5 w-5" />
            </div>
          </GlassCard>

          <GlassCard className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Surplus / Arus Kas Net
              </p>
              <p
                className={`text-xl font-black mt-1 ${
                  periodTotals.income - periodTotals.expense >= 0
                    ? 'text-purple-600 dark:text-purple-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {formatCurrency(periodTotals.income - periodTotals.expense)}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400">
              <TrendingUp className="h-5 w-5" />
            </div>
          </GlassCard>
        </div>

        {/* Charts Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CategoryPieChart />
          <BarComparisonChart />
        </div>

        {/* Full Cash Flow Trend */}
        <FinanceLineChartCard />
      </div>
    </AppLayout>
  );
}
