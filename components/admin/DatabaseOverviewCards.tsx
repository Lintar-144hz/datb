'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { DatabaseStats } from '@/services/adminService';
import {
  Users,
  Receipt,
  Target,
  HardDrive,
  Cloud,
  Sparkles,
  Trash2,
  Database,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

interface Props {
  stats: DatabaseStats;
  onSeedData: () => void;
  onPurgeDb: () => void;
  onRefresh: () => void;
}

export function DatabaseOverviewCards({ stats, onSeedData, onPurgeDb, onRefresh }: Props) {
  return (
    <div className="space-y-4">
      {/* Top Banner Status */}
      <GlassCard className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-purple-500/30">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-xl shadow-purple-500/30 shrink-0">
            <Database className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>Admin Console Database</span>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                Full Master Access
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Inspeksi, kelola, query & reset database LocalStorage & Supabase secara real-time
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <GlassButton size="sm" variant="secondary" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-1.5" />
            <span>Refresh Stats</span>
          </GlassButton>
          <GlassButton
            size="sm"
            variant="primary"
            onClick={onSeedData}
            className="shadow-lg shadow-purple-500/20"
          >
            <Sparkles className="h-4 w-4 mr-1.5" />
            <span>Seed Data Demo</span>
          </GlassButton>
        </div>
      </GlassCard>

      {/* Grid Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl glass-card flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-600 dark:text-blue-400">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Total Akun User</p>
            <p className="text-lg font-black text-slate-900 dark:text-slate-100">
              {stats.totalUsers} User
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-card flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            <Receipt className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Total Transaksi</p>
            <p className="text-lg font-black text-slate-900 dark:text-slate-100">
              {stats.totalTransactions} Data
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-card flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Target Tabungan</p>
            <p className="text-lg font-black text-slate-900 dark:text-slate-100">
              {stats.totalGoals} Target
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-card flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
            <HardDrive className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Ukuran DB Lokal</p>
            <p className="text-lg font-black text-slate-900 dark:text-slate-100">
              {stats.storageSizeKB} KB
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
