'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useStats } from '@/hooks/useStats';
import { formatCurrency } from '@/lib/utils';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { BarChart3 } from 'lucide-react';

export function BarComparisonChart() {
  const { timeSeriesData } = useStats();

  return (
    <GlassCard className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
          <BarChart3 className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Komparasi Pemasukan vs Pengeluaran
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Perbandingan bar mingguan & bulanan
          </p>
        </div>
      </div>

      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={timeSeriesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }} />
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
                    <div className="glass-panel p-3 rounded-xl border border-white/40 dark:border-white/10 shadow-xl space-y-1 text-xs">
                      <p className="font-bold text-slate-800 dark:text-slate-100">{label}</p>
                      <p className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        Pemasukan: {formatCurrency(Number(payload[0]?.value || 0))}
                      </p>
                      <p className="text-rose-600 dark:text-rose-400 font-semibold">
                        Pengeluaran: {formatCurrency(Number(payload[1]?.value || 0))}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
              formatter={(value) => (value === 'income' ? 'Pemasukan' : 'Pengeluaran')}
            />
            <Bar dataKey="income" name="income" fill="#10B981" radius={[6, 6, 0, 0]} />
            <Bar dataKey="expense" name="expense" fill="#F43F5E" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
