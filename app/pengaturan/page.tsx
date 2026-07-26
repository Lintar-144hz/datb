'use client';

import React from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { UserProfileSection } from '@/components/settings/UserProfileSection';
import { ThemeToggleSection } from '@/components/settings/ThemeToggleSection';
import { ExportImportSection } from '@/components/settings/ExportImportSection';
import { SupabaseStatusBadge } from '@/components/settings/SupabaseStatusBadge';
import { PwaInstallBanner } from '@/components/pwa/PwaInstallBanner';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { Shield, ArrowRight } from 'lucide-react';

export default function PengaturanPage() {
  return (
    <AppLayout>
      <PageHeader
        title="Pengaturan & PWA"
        subtitle="Kelola profil username, instalasi PWA/APK, tema tampilan, cadangan data, dan database"
      />

      <div className="space-y-6">
        {/* PWA & APK Installation Banner */}
        <PwaInstallBanner />

        {/* Database Admin Banner Card */}
        <GlassCard className="p-4 flex items-center justify-between border-purple-500/30">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-600 text-white shadow-lg shadow-purple-500/30">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Database Admin Console
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Inspeksi seluruh tabel user, data mentah, seed data demo, dan generator SQL
              </p>
            </div>
          </div>

          <Link href="/admin">
            <GlassButton size="sm" variant="primary">
              <span>Buka Admin</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </GlassButton>
          </Link>
        </GlassCard>

        {/* Supabase Status Indicator */}
        <SupabaseStatusBadge />

        {/* User Profile Section */}
        <UserProfileSection />

        {/* Theme Settings Section */}
        <ThemeToggleSection />

        {/* Backup, Restore & Export CSV Section */}
        <ExportImportSection />
      </div>
    </AppLayout>
  );
}
