'use client';

import React from 'react';
import { GlassInput } from '@/components/ui/GlassInput';
import { GlassButton } from '@/components/ui/GlassButton';
import { useFinanceStore } from '@/store/useFinanceStore';
import { useCategories } from '@/hooks/useCategories';
import { Search, Filter, RotateCcw } from 'lucide-react';

export function TransactionFilters() {
  const { filters, setFilters, resetFilters } = useFinanceStore();
  const { categories } = useCategories();

  return (
    <div className="p-4 rounded-2xl glass-panel space-y-3 border border-white/40 dark:border-white/10">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 min-w-[200px]">
          <GlassInput
            placeholder="Cari transaksi, kategori, atau catatan..."
            value={filters.searchQuery || ''}
            onChange={(e) => setFilters({ searchQuery: e.target.value })}
            icon={<Search className="h-4 w-4" />}
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Type Filter */}
          <select
            value={filters.type || 'all'}
            onChange={(e) => setFilters({ type: e.target.value as any })}
            className="glass-input text-xs rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none dark:bg-slate-900"
          >
            <option value="all">Semua Tipe</option>
            <option value="income">Pemasukan</option>
            <option value="expense">Pengeluaran</option>
          </select>

          {/* Category Filter */}
          <select
            value={filters.category || 'all'}
            onChange={(e) => setFilters({ category: e.target.value })}
            className="glass-input text-xs rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none dark:bg-slate-900"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={filters.sortBy || 'date-desc'}
            onChange={(e) => setFilters({ sortBy: e.target.value as any })}
            className="glass-input text-xs rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none dark:bg-slate-900"
          >
            <option value="date-desc">Terbaru</option>
            <option value="date-asc">Terlama</option>
            <option value="amount-desc">Terbesar</option>
            <option value="amount-asc">Terkecil</option>
          </select>

          {/* Reset button */}
          <GlassButton
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1" />
            <span>Reset</span>
          </GlassButton>
        </div>
      </div>
    </div>
  );
}
