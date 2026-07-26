'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { GlassButton } from '@/components/ui/GlassButton';
import { GoalCard } from '@/components/goals/GoalCard';
import { useGoals } from '@/hooks/useGoals';
import { useFinanceStore } from '@/store/useFinanceStore';
import { formatCurrency } from '@/lib/utils';
import { Target, Plus, PiggyBank, Sparkles, CheckCircle2 } from 'lucide-react';

export default function TargetPage() {
  const { goals, isLoading } = useGoals();
  const openAddGoalModal = useFinanceStore((state) => state.openAddGoalModal);

  const totalSaved = goals.reduce((acc, g) => acc + Number(g.current), 0);
  const totalTarget = goals.reduce((acc, g) => acc + Number(g.target), 0);
  const completedCount = goals.filter((g) => g.current >= g.target).length;

  return (
    <AppLayout>
      <PageHeader
        title="Target Tabungan"
        subtitle="Rencanakan dan wujudkan seluruh impian finansial Anda secara terukur"
        action={
          <GlassButton
            variant="primary"
            onClick={() => openAddGoalModal()}
            className="shadow-lg shadow-purple-500/25"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            <span>Buat Target Impian</span>
          </GlassButton>
        }
      />

      <div className="space-y-6">
        {/* Goal Overview Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl glass-card flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <PiggyBank className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Total Terkumpul</p>
              <p className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100">
                {formatCurrency(totalSaved)}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl glass-card flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Total Akumulasi Target</p>
              <p className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100">
                {formatCurrency(totalTarget)}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl glass-card flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Target Tercapai</p>
              <p className="text-sm sm:text-base font-black text-amber-600 dark:text-amber-400">
                {completedCount} dari {goals.length} Target 🎉
              </p>
            </div>
          </div>
        </div>

        {/* Goals Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-slate-200/50 dark:bg-slate-800/50 animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : goals.length === 0 ? (
          <div className="p-12 text-center glass-card rounded-3xl space-y-4 max-w-lg mx-auto my-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500/15 text-emerald-500 mx-auto">
              <Target className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                Belum Ada Target Tabungan
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Mulailah menyisihkan dana untuk gadget baru, dana darurat, liburan, atau DP rumah.
              </p>
            </div>
            <GlassButton
              variant="primary"
              onClick={() => openAddGoalModal()}
              className="mx-auto shadow-lg shadow-purple-500/25"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              <span>Buat Target Pertama Sekarang</span>
            </GlassButton>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {goals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
