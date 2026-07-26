'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useStats } from '@/hooks/useStats';
import { formatCurrency } from '@/lib/utils';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { PieChart as PieIcon, Tag } from 'lucide-react';

export function CategoryPieChart() {
  const { categoryExpenses } = useStats();

  return (
    <GlassCard className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400">
          <PieIcon className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Kategori Pengeluaran
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Alokasi anggaran berdasarkan kategori</p>
        </div>
      </div>

      {categoryExpenses.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-500 dark:text-slate-400 space-y-1">
          <Tag className="h-6 w-6 mx-auto opacity-50" />
          <p>Belum ada pengeluaran pada periode ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryExpenses}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="amount"
                >
                  {categoryExpenses.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="glass-panel p-2.5 rounded-xl border border-white/40 dark:border-white/10 shadow-lg text-xs space-y-0.5">
                          <p className="font-bold text-slate-900 dark:text-slate-100">{data.name}</p>
                          <p className="text-purple-600 dark:text-purple-400 font-extrabold">
                            {formatCurrency(data.amount)} ({data.percentage}%)
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legends */}
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {categoryExpenses.map((cat, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs p-2 rounded-xl bg-white/30 dark:bg-slate-800/30"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="h-3 w-3 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                    {cat.name}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {formatCurrency(cat.amount)}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 ml-1">
                    ({cat.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </GlassCard>
  );
}
