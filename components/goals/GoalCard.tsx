'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { Goal } from '@/types/goal';
import { formatCurrency, calculateGoalEstimation } from '@/lib/utils';
import { useFinanceStore } from '@/store/useFinanceStore';
import { useGoals } from '@/hooks/useGoals';
import { Target, Calendar, PlusCircle, Trash2, Edit3, Sparkles } from 'lucide-react';

interface GoalCardProps {
  goal: Goal;
}

export function GoalCard({ goal }: GoalCardProps) {
  const openDepositGoalModal = useFinanceStore((state) => state.openDepositGoalModal);
  const openAddGoalModal = useFinanceStore((state) => state.openAddGoalModal);
  const { deleteGoal } = useGoals();

  const estimation = calculateGoalEstimation(goal.current, goal.target, goal.deadline);
  const isCompleted = estimation.percentage >= 100;

  return (
    <GlassCard
      interactive
      glow={isCompleted}
      className="flex flex-col justify-between space-y-4 relative group"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${
              isCompleted
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-500'
                : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {isCompleted ? <Sparkles className="h-6 w-6" /> : <Target className="h-6 w-6" />}
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
              {goal.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
              <Calendar className="h-3 w-3" />
              <span>{estimation.statusText}</span>
            </p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => openAddGoalModal(goal.id)}
            className="p-1.5 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 rounded-lg hover:bg-purple-500/10 transition-colors"
            title="Edit Target"
          >
            <Edit3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => deleteGoal(goal.id)}
            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
            title="Hapus Target"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Progress Info */}
      <div className="space-y-2">
        <div className="flex items-baseline justify-between text-xs font-semibold">
          <span className="text-slate-500 dark:text-slate-400">Terkumpul</span>
          <span className="text-slate-900 dark:text-slate-100 font-extrabold text-sm">
            {formatCurrency(goal.current)}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="relative h-3 w-full bg-slate-200/80 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-white/20">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              isCompleted
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                : 'bg-gradient-to-r from-purple-600 via-emerald-500 to-teal-400'
            }`}
            style={{ width: `${estimation.percentage}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-bold">
          <span className="text-emerald-600 dark:text-emerald-400">
            {estimation.percentage}%
          </span>
          <span className="text-slate-500 dark:text-slate-400">
            Target: {formatCurrency(goal.target)}
          </span>
        </div>
      </div>

      {/* Setor Tabungan Button */}
      <GlassButton
        variant={isCompleted ? 'secondary' : 'primary'}
        size="sm"
        onClick={() => openDepositGoalModal(goal.id)}
        className="w-full mt-2"
      >
        <PlusCircle className="h-4 w-4 mr-1.5" />
        <span>{isCompleted ? 'Tambah Alokasi Lagi' : 'Setor Tabungan'}</span>
      </GlassButton>
    </GlassCard>
  );
}
