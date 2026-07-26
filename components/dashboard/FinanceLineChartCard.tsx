'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useStats } from '@/hooks/useStats';
import { useFinanceStore, TimeRangeOption } from '@/store/useFinanceStore';
import { formatCurrency } from '@/lib/utils';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';

export function FinanceLineChartCard() {
  const { timeSeriesData, activeRange } = useStats();
  const setTimeRange = useFinanceStore((state) => state.setTimeRange);

  const ranges: { label: string; value: TimeRangeOption }[] = [
    { label: '7 Hari', value: '7d' },
    { label: '30 Hari', value: '30d' },
    { label: '1 Tahun', value: '1y' },
  ];

  return (
    <GlassCard className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Arus Kas & Tren Keuangan
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Perbandingan Pemasukan vs Pengeluaran
            </p>
          </div>
        </div>

        {/* Time range pills */}
        <div className="flex items-center gap-1 bg-slate-200/50 dark:bg-slate-800/60 p-1 rounded-xl backdrop-blur-md">
          {ranges.map((r) => (
            <button
              key={r.value}
              onClick={() => setTimeRange(r.value)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                activeRange === r.value
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={timeSeriesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 10 }}
              tickFormatter={(val) => `${val >= 1000000 ? (val / 1000000).toFixed(1) + 'M' : val >= 1000 ? (val / 1000).toFixed(0) + 'K' : val}`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="glass-panel p-3 rounded-xl border border-white/40 dark:border-white/10 shadow-xl space-y-1.5 text-xs">
                      <p className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-purple-500" />
                        <span>{label}</span>
                      </p>
                      <div className="space-y-1 pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                        <p className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          Masuk: {formatCurrency(Number(payload[0]?.value || 0))}
                        </p>
                        <p className="text-rose-600 dark:text-rose-400 font-semibold">
                          Keluar: {formatCurrency(Number(payload[1]?.value || 0))}
                        </p>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="income"
              name="Pemasukan"
              stroke="#10B981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#incomeGrad)"
            />
            <Area
              type="monotone"
              dataKey="expense"
              name="Pengeluaran"
              stroke="#F43F5E"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#expenseGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
