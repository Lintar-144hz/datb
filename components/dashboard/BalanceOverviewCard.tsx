'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Eye, EyeOff, ArrowUpRight, ArrowDownLeft, Sparkles, Plus } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { formatCurrency } from '@/lib/utils';
import { useFinanceStore } from '@/store/useFinanceStore';

interface BalanceOverviewCardProps {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  username: string;
}

export function BalanceOverviewCard({
  totalBalance,
  totalIncome,
  totalExpense,
  username,
}: BalanceOverviewCardProps) {
  const [showBalance, setShowBalance] = useState(true);
  const openAddTransactionModal = useFinanceStore((state) => state.openAddTransactionModal);

  return (
    <GlassCard glow className="relative overflow-hidden bg-gradient-to-br from-purple-900/90 via-indigo-900/80 to-slate-900/90 text-white border-purple-500/30">
      {/* Specular Background Glow */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 h-56 w-56 rounded-full bg-purple-500/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 h-48 w-48 rounded-full bg-indigo-500/30 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col justify-between h-full gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
              <Wallet className="h-5 w-5 text-purple-300" />
            </div>
            <div>
              <p className="text-xs font-semibold text-purple-200/80 uppercase tracking-wider">
                Total Saldo Dev
              </p>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Halo, {username}</span>
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              </h2>
            </div>
          </div>

          <button
            onClick={() => setShowBalance(!showBalance)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-medium backdrop-blur-md border border-white/15 transition-all"
          >
            {showBalance ? (
              <>
                <EyeOff className="h-3.5 w-3.5 text-purple-200" />
                <span className="hidden sm:inline text-purple-100">Sembunyikan</span>
              </>
            ) : (
              <>
                <Eye className="h-3.5 w-3.5 text-purple-200" />
                <span className="hidden sm:inline text-purple-100">Tampilkan</span>
              </>
            )}
          </button>
        </div>

        {/* Balance Display */}
        <div className="my-1">
          <motion.div
            key={showBalance ? 'shown' : 'hidden'}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white"
          >
            {showBalance ? formatCurrency(totalBalance) : '••••••••••••'}
          </motion.div>
        </div>

        {/* Footer Sub-stats */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/15">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <ArrowDownLeft className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-purple-200/70">Pemasukan</p>
              <p className="text-xs sm:text-sm font-bold text-emerald-300">
                {showBalance ? formatCurrency(totalIncome) : '••••••'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30">
              <ArrowUpRight className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-purple-200/70">Pengeluaran</p>
              <p className="text-xs sm:text-sm font-bold text-rose-300">
                {showBalance ? formatCurrency(totalExpense) : '••••••'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
