'use client';

import React from 'react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { useGoals } from '@/hooks/useGoals';
import { useFinanceStore } from '@/store/useFinanceStore';
import { formatCurrency, calculateGoalEstimation } from '@/lib/utils';
import { Target, ArrowRight, Plus, PiggyBank } from 'lucide-react';

export function MiniGoalsProgressCard() {
  const { goals, isLoading } = useGoals();
  const openAddGoalModal = useFinanceStore((state) => state.openAddGoalModal);
  const openDepositGoalModal = useFinanceStore((state) => state.openDepositGoalModal);

  const previewGoals = goals.slice(0, 3);

  return (
    <GlassCard className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Target Tabungan
          </h3>
        </div>
        <Link
          href="/target"
          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
        >
          <span>Lihat Kelola</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3 py-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-16 bg-slate-200/50 dark:bg-slate-800/50 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : previewGoals.length === 0 ? (
        <div className="py-6 text-center space-y-2">
          <PiggyBank className="h-8 w-8 text-emerald-500 mx-auto" />
          <p className="text-xs text-slate-500 dark:text-slate-400">Belum ada target tabungan.</p>
          <button
            onClick={() => openAddGoalModal()}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Buat Target Pertama</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {previewGoals.map((goal) => {
            const estimation = calculateGoalEstimation(goal.current, goal.target, goal.deadline);

            return (
              <div
                key={goal.id}
                className="p-3.5 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                      {goal.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      {estimation.statusText}
                    </p>
                  </div>
                  <button
                    onClick={() => openDepositGoalModal(goal.id)}
                    className="px-2.5 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg transition-colors"
                  >
                    + Setor
                  </button>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1">
                    <span>{formatCurrency(goal.current)}</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {estimation.percentage}%
                    </span>
                    <span>{formatCurrency(goal.target)}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                      style={{ width: `${estimation.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </GlassCard>
  );
}
