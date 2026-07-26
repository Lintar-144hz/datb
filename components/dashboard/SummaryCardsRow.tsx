'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { ArrowDownLeft, ArrowUpRight, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface SummaryCardsRowProps {
  totalIncome: number;
  totalExpense: number;
}

export function SummaryCardsRow({ totalIncome, totalExpense }: SummaryCardsRowProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Income Card */}
      <GlassCard className="border-emerald-500/20 dark:border-emerald-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <ArrowDownLeft className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Pemasukan</p>
              <p className="text-xl font-black text-slate-900 dark:text-slate-100 mt-0.5">
                {formatCurrency(totalIncome)}
              </p>
            </div>
          </div>
          <div className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
            <TrendingUp className="h-4 w-4" />
          </div>
        </div>
      </GlassCard>

      {/* Expense Card */}
      <GlassCard className="border-rose-500/20 dark:border-rose-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
              <ArrowUpRight className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Pengeluaran</p>
              <p className="text-xl font-black text-slate-900 dark:text-slate-100 mt-0.5">
                {formatCurrency(totalExpense)}
              </p>
            </div>
          </div>
          <div className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
            <TrendingDown className="h-4 w-4" />
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
