'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { adminService } from '@/services/adminService';
import { Terminal, Copy, Check, Download, Trash2, ShieldAlert } from 'lucide-react';

interface Props {
  onPurgeDb: () => void;
}

export function SqlConsole({ onPurgeDb }: Props) {
  const [copied, setCopied] = useState(false);
  const [confirmPurge, setConfirmPurge] = useState(false);

  const sqlSchema = adminService.generateSupabaseSqlDDL();

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExportFullDump = () => {
    const dump = {
      users: adminService.getAllUsers(),
      transactions: adminService.getAllTransactions(),
      goals: adminService.getAllGoals(),
      exported_at: new Date().toISOString(),
      app: 'Tabungan Dev Admin Dump',
    };

    const jsonStr = JSON.stringify(dump, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TabunganDev_AdminDump_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <GlassCard className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-purple-400 border border-purple-500/30">
            <Terminal className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Supabase SQL Generator & Dump Engine
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Salin script DDL atau unduh salinan lengkap database
            </p>
          </div>
        </div>

        <GlassButton size="sm" variant="secondary" onClick={handleExportFullDump}>
          <Download className="h-4 w-4 mr-1.5" />
          <span>Export Master Dump (JSON)</span>
        </GlassButton>
      </div>

      {/* SQL Script Box */}
      <div className="relative group">
        <pre className="p-4 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto border border-slate-800 max-h-60">
          {sqlSchema}
        </pre>
        <button
          onClick={handleCopySql}
          className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-lg flex items-center gap-1.5 transition-all"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copied ? 'Tersalin!' : 'Copy SQL'}</span>
        </button>
      </div>

      {/* Danger Zone Purge */}
      <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800">
        {confirmPurge ? (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-2">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs">
              <ShieldAlert className="h-5 w-5" />
              <span>PERINGATAN MASTER ADMIN: Hapus Seluruh Database Lokal?</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Tindakan ini akan memusnahkan semua user, seluruh catatan transaksi, dan semua target tabungan.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <GlassButton size="sm" variant="danger" onClick={onPurgeDb}>
                Ya, Wipe Out Seluruh Database
              </GlassButton>
              <GlassButton size="sm" variant="ghost" onClick={() => setConfirmPurge(false)}>
                Batal
              </GlassButton>
            </div>
          </div>
        ) : (
          <GlassButton
            size="sm"
            variant="outline"
            onClick={() => setConfirmPurge(true)}
            className="text-rose-600 dark:text-rose-400 border-rose-500/30 hover:bg-rose-500/10"
          >
            <Trash2 className="h-4 w-4 mr-1.5" />
            <span>Factory Reset / Purge Database Admin</span>
          </GlassButton>
        )}
      </div>
    </GlassCard>
  );
}
