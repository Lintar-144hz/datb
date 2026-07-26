'use client';

import React, { useState, useCallback } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { DatabaseOverviewCards } from '@/components/admin/DatabaseOverviewCards';
import { UserManagementTable } from '@/components/admin/UserManagementTable';
import { RawDataTable } from '@/components/admin/RawDataTable';
import { SqlConsole } from '@/components/admin/SqlConsole';
import { PwaInstallBanner } from '@/components/pwa/PwaInstallBanner';
import { adminService, DatabaseStats } from '@/services/adminService';
import { User } from '@/types/user';
import { Transaction } from '@/types/transaction';
import { Goal } from '@/types/goal';
import { useAuth } from '@/hooks/useAuth';
import { Shield, Lock, ArrowRight } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassInput } from '@/components/ui/GlassInput';
import { GlassButton } from '@/components/ui/GlassButton';

export default function AdminPage() {
  const { user } = useAuth();
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const isAdminUser = user?.username?.toLowerCase() === 'admin';
  const showAdminConsole = isAdminUnlocked || isAdminUser;

  const [stats, setStats] = useState<DatabaseStats>(() => adminService.getDatabaseStats());
  const [users, setUsers] = useState<User[]>(() => adminService.getAllUsers());
  const [transactions, setTransactions] = useState<(Transaction & { username?: string })[]>(() => adminService.getAllTransactions());
  const [goals, setGoals] = useState<(Goal & { username?: string })[]>(() => adminService.getAllGoals());

  const loadAdminData = useCallback(() => {
    setStats(adminService.getDatabaseStats());
    setUsers(adminService.getAllUsers());
    setTransactions(adminService.getAllTransactions());
    setGoals(adminService.getAllGoals());
  }, []);

  const handleUnlockAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === 'admin' || passcode.trim() === 'admin123' || passcode.trim() === '123456') {
      setIsAdminUnlocked(true);
      setErrorMsg('');
      loadAdminData();
    } else {
      setErrorMsg('Passcode akses tidak valid.');
    }
  };

  const handleSeed = async () => {
    await adminService.seedDemoDatabase();
    loadAdminData();
  };

  const handlePurge = () => {
    adminService.purgeAllDatabase();
    loadAdminData();
  };

  const handleDeleteUser = (userId: string) => {
    adminService.deleteUser(userId);
    loadAdminData();
  };

  if (!showAdminConsole) {
    return (
      <AppLayout>
        <PageHeader
          title="Admin Database Console"
          subtitle="Akses khusus untuk mengelola seluruh data aplikasi"
        />

        <div className="max-w-md mx-auto my-12">
          <GlassCard glow className="p-6 space-y-6 border-purple-500/30">
            <div className="text-center space-y-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-purple-600 text-white shadow-xl shadow-purple-500/30 mx-auto">
                <Shield className="h-7 w-7" />
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
                Akses Terbatas
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Masukkan passcode otorisasi untuk membuka panel kontrol admin database
              </p>
            </div>

            <form onSubmit={handleUnlockAdmin} className="space-y-4">
              <GlassInput
                type="password"
                label="Passcode Otorisasi"
                placeholder="Masukkan kode akses..."
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                icon={<Lock className="h-4 w-4" />}
                error={errorMsg}
                autoFocus
              />

              <GlassButton type="submit" variant="primary" className="w-full">
                <span>Verifikasi Kunci Panel</span>
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </GlassButton>
            </form>
          </GlassCard>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader
        title="Admin Database & PWA Console"
        subtitle="Manajemen database terpusat, query inspector & konfigurasi PWA/APK"
      />

      <div className="space-y-6">
        {/* PWA & APK Installation Card */}
        <PwaInstallBanner />

        {/* Database Overview Cards */}
        <DatabaseOverviewCards
          stats={stats}
          onSeedData={handleSeed}
          onPurgeDb={handlePurge}
          onRefresh={loadAdminData}
        />

        {/* User Accounts Management */}
        <UserManagementTable
          users={users}
          onDeleteUser={handleDeleteUser}
          onRefresh={loadAdminData}
        />

        {/* Raw Data Transactions & Goals Inspector */}
        <RawDataTable
          transactions={transactions}
          goals={goals}
          onRefresh={loadAdminData}
        />

        {/* Supabase SQL DDL Generator & JSON Backup */}
        <SqlConsole onPurgeDb={handlePurge} />
      </div>
    </AppLayout>
  );
}
