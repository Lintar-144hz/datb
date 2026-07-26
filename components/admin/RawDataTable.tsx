'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassInput } from '@/components/ui/GlassInput';
import { GlassButton } from '@/components/ui/GlassButton';
import { Modal } from '@/components/ui/Modal';
import { Transaction } from '@/types/transaction';
import { Goal } from '@/types/goal';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Database, Search, Code, Trash2, Tag, ArrowDownLeft, ArrowUpRight, Target } from 'lucide-react';

interface Props {
  transactions: (Transaction & { username?: string })[];
  goals: (Goal & { username?: string })[];
  onRefresh: () => void;
}

export function RawDataTable({ transactions, goals, onRefresh }: Props) {
  const [activeTab, setActiveTab] = useState<'transactions' | 'goals'>('transactions');
  const [search, setSearch] = useState('');
  const [jsonModalData, setJsonModalData] = useState<any | null>(null);

  const filteredTx = transactions.filter((t) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      t.category.toLowerCase().includes(q) ||
      (t.note && t.note.toLowerCase().includes(q)) ||
      (t.username && t.username.toLowerCase().includes(q)) ||
      t.amount.toString().includes(q)
    );
  });

  const filteredGoals = goals.filter((g) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      g.title.toLowerCase().includes(q) ||
      (g.username && g.username.toLowerCase().includes(q)) ||
      g.target.toString().includes(q)
    );
  });

  return (
    <GlassCard className="space-y-4">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400">
            <Database className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Raw Data Inspector
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Inspeksi seluruh baris data transaksi & target tabungan
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-1 bg-slate-200/60 dark:bg-slate-800/60 p-1 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'transactions'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Transactions ({transactions.length})
          </button>
          <button
            onClick={() => setActiveTab('goals')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'goals'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Goals ({goals.length})
          </button>
        </div>
      </div>

      {/* Filter Input */}
      <GlassInput
        placeholder="Cari data berdasarkan username, kategori, nominal, catatan..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        icon={<Search className="h-4 w-4" />}
      />

      {/* Table Content */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200/60 dark:border-slate-800">
        {activeTab === 'transactions' ? (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200/60 dark:border-slate-800">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Tipe</th>
                <th className="p-3">Kategori</th>
                <th className="p-3">Nominal</th>
                <th className="p-3">Catatan</th>
                <th className="p-3">Waktu</th>
                <th className="p-3 text-right">JSON</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/50 dark:divide-slate-800">
              {filteredTx.map((tx) => (
                <tr key={tx.id} className="hover:bg-white/30 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-3 font-bold text-slate-900 dark:text-slate-100">
                    @{tx.username}
                  </td>
                  <td className="p-3 font-semibold">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] ${
                        tx.type === 'income'
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                          : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {tx.type === 'income' ? <ArrowDownLeft className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
                      {tx.type}
                    </span>
                  </td>
                  <td className="p-3 font-medium text-slate-800 dark:text-slate-200">{tx.category}</td>
                  <td className="p-3 font-bold text-slate-900 dark:text-slate-100">
                    {formatCurrency(tx.amount)}
                  </td>
                  <td className="p-3 text-slate-500 dark:text-slate-400 max-w-xs truncate">
                    {tx.note || '-'}
                  </td>
                  <td className="p-3 text-slate-500 dark:text-slate-400">
                    {formatDate(tx.created_at, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setJsonModalData(tx)}
                      className="p-1.5 text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors"
                      title="Lihat Raw JSON"
                    >
                      <Code className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200/60 dark:border-slate-800">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Judul Target</th>
                <th className="p-3">Terkumpul</th>
                <th className="p-3">Target</th>
                <th className="p-3">Deadline</th>
                <th className="p-3 text-right">JSON</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/50 dark:divide-slate-800">
              {filteredGoals.map((g) => (
                <tr key={g.id} className="hover:bg-white/30 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-3 font-bold text-slate-900 dark:text-slate-100">
                    @{g.username}
                  </td>
                  <td className="p-3 font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <Target className="h-3.5 w-3.5 text-purple-500" />
                    <span>{g.title}</span>
                  </td>
                  <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(g.current)}
                  </td>
                  <td className="p-3 font-bold text-slate-900 dark:text-slate-100">
                    {formatCurrency(g.target)}
                  </td>
                  <td className="p-3 text-slate-500 dark:text-slate-400">
                    {g.deadline ? formatDate(g.deadline, { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setJsonModalData(g)}
                      className="p-1.5 text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors"
                      title="Lihat Raw JSON"
                    >
                      <Code className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* JSON Viewer Modal */}
      <Modal
        isOpen={Boolean(jsonModalData)}
        onClose={() => setJsonModalData(null)}
        title="Raw Record JSON Viewer"
        description="Objek data mentah yang tersimpan di database"
      >
        {jsonModalData && (
          <div className="space-y-4 pt-1">
            <pre className="p-4 rounded-2xl bg-slate-900 text-purple-300 font-mono text-xs overflow-x-auto border border-purple-500/30">
              {JSON.stringify(jsonModalData, null, 2)}
            </pre>
            <div className="flex justify-end">
              <GlassButton variant="primary" onClick={() => setJsonModalData(null)}>
                Tutup
              </GlassButton>
            </div>
          </div>
        )}
      </Modal>
    </GlassCard>
  );
}
