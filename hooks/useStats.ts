'use client';

import { useMemo } from 'react';
import { useTransactions } from './useTransactions';
import { useFinanceStore, TimeRangeOption } from '@/store/useFinanceStore';
import { Transaction } from '@/types/transaction';

export interface CategoryStatItem {
  name: string;
  amount: number;
  color: string;
  percentage: number;
}

export interface TimeSeriesStatItem {
  date: string;
  income: number;
  expense: number;
  net: number;
}

const CATEGORY_COLORS = [
  '#7C3AED', '#EC4899', '#F59E0B', '#10B981', '#3B82F6',
  '#8B5CF6', '#EF4444', '#06B6D4', '#6366F1', '#14B8A6', '#F97316'
];

export function useStats(timeRangeOverride?: TimeRangeOption) {
  const { transactions, totals } = useTransactions();
  const selectedRange = useFinanceStore((state) => state.selectedTimeRange);

  const activeRange = timeRangeOverride || selectedRange;

  const filteredByPeriod = useMemo(() => {
    const now = new Date();
    let daysToSubtract = 30;

    if (activeRange === '7d') daysToSubtract = 7;
    else if (activeRange === '30d') daysToSubtract = 30;
    else if (activeRange === '1y') daysToSubtract = 365;

    const cutoff = new Date(now.getTime() - daysToSubtract * 24 * 60 * 60 * 1000).getTime();
    return transactions.filter((t) => new Date(t.created_at).getTime() >= cutoff);
  }, [transactions, activeRange]);

  // 1. Expense Breakdown by Category (for Pie Chart)
  const categoryExpenses = useMemo(() => {
    const expenses = filteredByPeriod.filter((t) => t.type === 'expense');
    const totalsMap: Record<string, number> = {};
    let totalExpenseAmount = 0;

    expenses.forEach((t) => {
      const cat = t.category || 'Lainnya';
      totalsMap[cat] = (totalsMap[cat] || 0) + Number(t.amount);
      totalExpenseAmount += Number(t.amount);
    });

    const result: CategoryStatItem[] = Object.keys(totalsMap).map((catName, idx) => ({
      name: catName,
      amount: totalsMap[catName],
      color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
      percentage: totalExpenseAmount > 0 ? Math.round((totalsMap[catName] / totalExpenseAmount) * 100) : 0,
    }));

    return result.sort((a, b) => b.amount - a.amount);
  }, [filteredByPeriod]);

  // 2. Time-series Trend Data (for Line Chart & Bar Chart)
  const timeSeriesData = useMemo(() => {
    const map: Record<string, { income: number; expense: number }> = {};

    // Generate date keys depending on range
    const now = new Date();
    const count = activeRange === '7d' ? 7 : activeRange === '30d' ? 14 : 12;

    for (let i = count - 1; i >= 0; i--) {
      const d = new Date(now);
      if (activeRange === '1y') {
        d.setMonth(d.getMonth() - i);
        const label = new Intl.DateTimeFormat('id-ID', { month: 'short', year: '2-digit' }).format(d);
        map[label] = { income: 0, expense: 0 };
      } else {
        d.setDate(d.getDate() - (activeRange === '30d' ? i * 2 : i));
        const label = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short' }).format(d);
        map[label] = { income: 0, expense: 0 };
      }
    }

    // Populate transaction data
    filteredByPeriod.forEach((t) => {
      const d = new Date(t.created_at);
      let label = '';
      if (activeRange === '1y') {
        label = new Intl.DateTimeFormat('id-ID', { month: 'short', year: '2-digit' }).format(d);
      } else {
        label = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short' }).format(d);
      }

      if (map[label]) {
        if (t.type === 'income') map[label].income += Number(t.amount);
        else map[label].expense += Number(t.amount);
      }
    });

    const series: TimeSeriesStatItem[] = Object.keys(map).map((dateKey) => ({
      date: dateKey,
      income: map[dateKey].income,
      expense: map[dateKey].expense,
      net: map[dateKey].income - map[dateKey].expense,
    }));

    return series;
  }, [filteredByPeriod, activeRange]);

  return {
    activeRange,
    totalTransactions: filteredByPeriod.length,
    periodTotals: {
      income: filteredByPeriod.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0),
      expense: filteredByPeriod.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0),
    },
    categoryExpenses,
    timeSeriesData,
  };
}
