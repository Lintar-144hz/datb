'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Database, ShieldCheck, HardDrive } from 'lucide-react';

export function SupabaseStatusBadge() {
  return (
    <GlassCard className="p-4 flex items-center justify-between border-purple-500/20">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
            isSupabaseConfigured
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
              : 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30'
          }`}
        >
          {isSupabaseConfigured ? (
            <Database className="h-5 w-5" />
          ) : (
            <HardDrive className="h-5 w-5" />
          )}
        </div>
        <div>
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <span>
              {isSupabaseConfigured
                ? 'Supabase Cloud Connected'
                : 'LocalStorage Offline Mode'}
            </span>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {isSupabaseConfigured
              ? 'Tersinkronisasi otomatis ke database PostgreSQL Supabase Anda.'
              : 'Aplikasi berjalan 100% cepat & aman di penyimpanan browser lokal.'}
          </p>
        </div>
      </div>
    </GlassCard>
  );
}
