'use client';

import React, { useRef, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { useAuth } from '@/hooks/useAuth';
import { useTransactions } from '@/hooks/useTransactions';
import { LocalStorageService } from '@/lib/storage';
import { exportToCSV } from '@/lib/utils';
import { BackupData } from '@/types/database';
import { FileSpreadsheet, Download, Upload, Trash2, Database, CheckCircle, AlertTriangle } from 'lucide-react';

export function ExportImportSection() {
  const { user } = useAuth();
  const { transactions, refetch } = useTransactions();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleExportCSV = () => {
    if (!transactions.length) return;
    const formatted = transactions.map((t) => ({
      Tanggal: t.created_at,
      Tipe: t.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
      Kategori: t.category,
      Jumlah: t.amount,
      Catatan: t.note || '-',
    }));
    exportToCSV(`TabunganDev_Report_${user?.username || 'user'}`, formatted);
  };

  const handleBackupJSON = () => {
    if (!user) return;
    const backup = LocalStorageService.exportBackup(user.id);
    if (!backup) return;

    const jsonStr = JSON.stringify(backup, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `TabunganDev_Backup_${user.username}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setMessage({ type: 'success', text: 'Backup data JSON berhasil diunduh!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleRestoreJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed: BackupData = JSON.parse(content);
        const success = LocalStorageService.importBackup(user.id, parsed);

        if (success) {
          setMessage({ type: 'success', text: 'Data berhasil dipulihkan dari file JSON!' });
          refetch();
        } else {
          setMessage({ type: 'error', text: 'Format file JSON tidak valid' });
        }
      } catch (err) {
        setMessage({ type: 'error', text: 'Gagal membaca file JSON' });
      }
      setTimeout(() => setMessage(null), 3000);
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (!user) return;
    LocalStorageService.resetUserData(user.id);
    setConfirmReset(false);
    setMessage({ type: 'success', text: 'Seluruh data lokal berhasil direset' });
    refetch();
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <GlassCard className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400">
          <Database className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Export, Backup & Restore Data
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Penyimpanan aman di bawah kendali penuh Anda
          </p>
        </div>
      </div>

      {message && (
        <div
          className={`p-3 rounded-xl flex items-center gap-2 text-xs font-bold ${
            message.type === 'success'
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
              : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertTriangle className="h-4 w-4" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* CSV Export */}
        <button
          onClick={handleExportCSV}
          className="p-4 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 hover:bg-purple-500/10 hover:border-purple-500/30 transition-all flex flex-col items-start gap-2 text-left"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Export CSV</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Format Microsoft Excel / Sheets</p>
          </div>
        </button>

        {/* JSON Backup */}
        <button
          onClick={handleBackupJSON}
          className="p-4 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 hover:bg-purple-500/10 hover:border-purple-500/30 transition-all flex flex-col items-start gap-2 text-left"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400">
            <Download className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Backup JSON</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Cadangan seluruh database</p>
          </div>
        </button>

        {/* JSON Restore */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-4 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 hover:bg-purple-500/10 hover:border-purple-500/30 transition-all flex flex-col items-start gap-2 text-left"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleRestoreJSON}
            accept=".json"
            className="hidden"
          />
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400">
            <Upload className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Restore JSON</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Pulihkan dari file cadangan</p>
          </div>
        </button>
      </div>

      {/* Danger Reset */}
      <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800">
        {confirmReset ? (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-2">
            <p className="text-xs font-bold text-rose-600 dark:text-rose-400">
              Apakah Anda yakin ingin menghapus seluruh data transaksi & target tabungan?
            </p>
            <div className="flex items-center gap-2">
              <GlassButton size="sm" variant="danger" onClick={handleResetData}>
                Ya, Reset Sekarang
              </GlassButton>
              <GlassButton size="sm" variant="ghost" onClick={() => setConfirmReset(false)}>
                Batal
              </GlassButton>
            </div>
          </div>
        ) : (
          <GlassButton
            size="sm"
            variant="ghost"
            onClick={() => setConfirmReset(true)}
            className="text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
            <span>Reset / Hapus Data Lokal</span>
          </GlassButton>
        )}
      </div>
    </GlassCard>
  );
}
