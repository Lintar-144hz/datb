'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { UserProfileSection } from '@/components/settings/UserProfileSection';
import { ThemeToggleSection } from '@/components/settings/ThemeToggleSection';
import { ExportImportSection } from '@/components/settings/ExportImportSection';
import { SupabaseStatusBadge } from '@/components/settings/SupabaseStatusBadge';

export default function PengaturanPage() {
  return (
    <AppLayout>
      <PageHeader
        title="Pengaturan Aplikasi"
        subtitle="Kelola profil username, tema tampilan, cadangan data, dan koneksi database"
      />

      <div className="space-y-6">
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
