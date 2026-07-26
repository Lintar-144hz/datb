'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { BalanceOverviewCard } from '@/components/dashboard/BalanceOverviewCard';
import { SummaryCardsRow } from '@/components/dashboard/SummaryCardsRow';
import { QuickActionsGrid } from '@/components/dashboard/QuickActionsGrid';
import { FinanceLineChartCard } from '@/components/dashboard/FinanceLineChartCard';
import { RecentTransactionsCard } from '@/components/dashboard/RecentTransactionsCard';
import { MiniGoalsProgressCard } from '@/components/dashboard/MiniGoalsProgressCard';
import { useAuth } from '@/hooks/useAuth';
import { useTransactions } from '@/hooks/useTransactions';

export default function DashboardPage() {
  const { user } = useAuth();
  const { totals } = useTransactions();

  return (
    <AppLayout>
      <PageHeader
        title="Dashboard Finansial"
        subtitle="Ringkasan saldo, statistik transaksi & target tabungan impian Anda"
      />

      <div className="space-y-6">
        {/* Main Balance Overview */}
        <BalanceOverviewCard
          totalBalance={totals.totalBalance}
          totalIncome={totals.totalIncome}
          totalExpense={totals.totalExpense}
          username={user?.username || 'Dev'}
        />

        {/* Summary Pemasukan & Pengeluaran */}
        <SummaryCardsRow
          totalIncome={totals.totalIncome}
          totalExpense={totals.totalExpense}
        />

        {/* Quick Actions Buttons */}
        <QuickActionsGrid />

        {/* Financial Trend Line Chart */}
        <FinanceLineChartCard />

        {/* Grid: Recent Transactions & Mini Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentTransactionsCard />
          <MiniGoalsProgressCard />
        </div>
      </div>
    </AppLayout>
  );
}
