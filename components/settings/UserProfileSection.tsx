'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassInput } from '@/components/ui/GlassInput';
import { GlassButton } from '@/components/ui/GlassButton';
import { useAuth } from '@/hooks/useAuth';
import { User, Edit3, LogOut, Check, Shield, UserCheck } from 'lucide-react';

export function UserProfileSection() {
  const { user, updateUsername, logout } = useAuth();
  const [newUsername, setNewUsername] = useState(user?.username || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const isAdmin = user?.username?.toLowerCase() === 'admin';

  const handleSave = async () => {
    if (!newUsername.trim()) return;
    setIsSaving(true);
    setMessage(null);
    try {
      await updateUsername(newUsername);
      setIsEditing(false);
      setMessage('Username berhasil diperbarui!');
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage(err.message || 'Gagal menyimpan');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <GlassCard className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400">
          <User className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Profil Pengguna
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Username disimpan secara aman di LocalStorage & Supabase Realtime
          </p>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-3">
        {isEditing ? (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <GlassInput
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Masukkan username baru"
              autoFocus
            />
            <div className="flex items-center gap-2">
              <GlassButton
                size="sm"
                variant="primary"
                onClick={handleSave}
                isLoading={isSaving}
              >
                <Check className="h-4 w-4 mr-1" />
                Simpan
              </GlassButton>
              <GlassButton
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(false)}
              >
                Batal
              </GlassButton>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Username Aktif</p>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-lg font-black text-slate-900 dark:text-slate-100">
                  {user?.username}
                </p>
                {isAdmin ? (
                  <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    Admin System
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <UserCheck className="h-3 w-3" />
                    Pengguna Reguler
                  </span>
                )}
              </div>
            </div>
            <GlassButton
              size="sm"
              variant="secondary"
              onClick={() => {
                setNewUsername(user?.username || '');
                setIsEditing(true);
              }}
            >
              <Edit3 className="h-3.5 w-3.5 mr-1" />
              Ganti Username
            </GlassButton>
          </div>
        )}

        {message && (
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            {message}
          </p>
        )}
      </div>

      <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800">
        <GlassButton variant="outline" size="sm" onClick={logout} className="text-rose-600 dark:text-rose-400 border-rose-500/30 hover:bg-rose-500/10">
          <LogOut className="h-3.5 w-3.5 mr-1.5" />
          Keluar Akun
        </GlassButton>
      </div>
    </GlassCard>
  );
}
