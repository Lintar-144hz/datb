'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { GlassInput } from '@/components/ui/GlassInput';
import { GlassButton } from '@/components/ui/GlassButton';
import { useGoals } from '@/hooks/useGoals';
import { useFinanceStore } from '@/store/useFinanceStore';
import { formatCurrency } from '@/lib/utils';
import { ArrowDownLeft, ArrowUpRight, DollarSign, PiggyBank } from 'lucide-react';

export function DepositGoalModal() {
  const { activeDepositGoalId, closeDepositGoalModal } = useFinanceStore();
  const { goals, depositOrWithdraw, isDepositing } = useGoals();

  const [amount, setAmount] = useState<number>(0);
  const [action, setAction] = useState<'deposit' | 'withdraw'>('deposit');
  const [note, setNote] = useState<string>('');

  const targetGoal = goals.find((g) => g.id === activeDepositGoalId);

  if (!targetGoal) return null;

  const remaining = Math.max(0, targetGoal.target - targetGoal.current);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0) return;

    try {
      await depositOrWithdraw({
        goalId: targetGoal.id,
        data: {
          amount,
          action,
          note,
        },
      });
      setAmount(0);
      setNote('');
      closeDepositGoalModal();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal
      isOpen={Boolean(activeDepositGoalId)}
      onClose={closeDepositGoalModal}
      title={`${action === 'deposit' ? 'Setor Tabungan' : 'Tarik Saldo Tabungan'}`}
      description={`Target: ${targetGoal.title}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        {/* Goal summary header */}
        <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-1">
          <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>Saldo Terkumpul Saat Ini:</span>
            <span className="font-bold text-purple-600 dark:text-purple-400">
              {formatCurrency(targetGoal.current)}
            </span>
          </div>
          <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>Sisa Menuju Target:</span>
            <span className="font-bold text-slate-900 dark:text-slate-100">
              {formatCurrency(remaining)}
            </span>
          </div>
        </div>

        {/* Action Switcher */}
        <div className="grid grid-cols-2 gap-2 bg-slate-200/60 dark:bg-slate-800/60 p-1.5 rounded-2xl">
          <button
            type="button"
            onClick={() => setAction('deposit')}
            className={`flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-xl transition-all ${
              action === 'deposit'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <ArrowDownLeft className="h-4 w-4" />
            <span>Setor Tabungan</span>
          </button>

          <button
            type="button"
            onClick={() => setAction('withdraw')}
            className={`flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-xl transition-all ${
              action === 'withdraw'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <ArrowUpRight className="h-4 w-4" />
            <span>Tarik Tabungan</span>
          </button>
        </div>

        {/* Amount */}
        <GlassInput
          label="Jumlah (Rp)"
          type="number"
          placeholder="0"
          value={amount || ''}
          onChange={(e) => setAmount(Number(e.target.value))}
          icon={<DollarSign className="h-4 w-4" />}
          autoFocus
        />

        {/* Quick Amount Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {[50000, 100000, 250000, 500000, 1000000].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setAmount(val)}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-200/50 dark:bg-slate-800/60 hover:bg-purple-500/20 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              +{formatCurrency(val)}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200/50 dark:border-slate-800">
          <GlassButton type="button" variant="ghost" onClick={closeDepositGoalModal}>
            Batal
          </GlassButton>
          <GlassButton type="submit" variant="primary" isLoading={isDepositing}>
            {action === 'deposit' ? 'Konfirmasi Setoran' : 'Konfirmasi Penarikan'}
          </GlassButton>
        </div>
      </form>
    </Modal>
  );
}
