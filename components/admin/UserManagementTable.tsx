'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { User } from '@/types/user';
import { useAuthStore } from '@/store/useAuthStore';
import { formatDate } from '@/lib/utils';
import { Users, UserCheck, Trash2, Shield, ArrowRightLeft } from 'lucide-react';

interface Props {
  users: User[];
  onDeleteUser: (id: string) => void;
  onRefresh: () => void;
}

export function UserManagementTable({ users, onDeleteUser, onRefresh }: Props) {
  const activeUser = useAuthStore((state) => state.user);
  const login = useAuthStore((state) => state.login);

  const handleSwitchUser = async (username: string) => {
    try {
      await login(username);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <GlassCard className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400">
            <Users className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Daftar Akun Pengguna ({users.length})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pilih pengguna untuk beralih konteks (impersonate) atau hapus data
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200/60 dark:border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200/60 dark:border-slate-800">
            <tr>
              <th className="p-3">User ID</th>
              <th className="p-3">Username</th>
              <th className="p-3">Tanggal Dibuat</th>
              <th className="p-3">Status Session</th>
              <th className="p-3 text-right">Aksi Admin</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/50 dark:divide-slate-800">
            {users.map((u) => {
              const isActive = activeUser?.id === u.id;
              const isAdmin = u.username.toLowerCase() === 'admin';

              return (
                <tr key={u.id} className="hover:bg-white/30 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-3 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                    {u.id.substring(0, 8)}...
                  </td>
                  <td className="p-3 font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <span>@{u.username}</span>
                    {isAdmin && (
                      <span className="px-2 py-0.5 text-[10px] bg-purple-500/20 text-purple-600 dark:text-purple-400 font-black rounded-md">
                        ADMIN
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-slate-500 dark:text-slate-400">
                    {formatDate(u.created_at, { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="p-3">
                    {isActive ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                        <UserCheck className="h-3.5 w-3.5" />
                        Aktif Sekarang
                      </span>
                    ) : (
                      <span className="text-slate-400">Inaktif</span>
                    )}
                  </td>
                  <td className="p-3 text-right space-x-1">
                    {!isActive && (
                      <GlassButton
                        size="sm"
                        variant="ghost"
                        onClick={() => handleSwitchUser(u.username)}
                        className="text-purple-600 dark:text-purple-400 hover:bg-purple-500/10"
                      >
                        <ArrowRightLeft className="h-3.5 w-3.5 mr-1" />
                        Ganti ke Akun Ini
                      </GlassButton>
                    )}
                    {!isAdmin && (
                      <button
                        onClick={() => onDeleteUser(u.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Hapus Akun & Data"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}
