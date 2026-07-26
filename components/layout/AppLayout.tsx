'use client';

import React from 'react';
import { AuroraBackground } from '@/components/ui/AuroraBackground';
import { FloatingNavbar } from '@/components/layout/FloatingNavbar';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { TransactionFormModal } from '@/components/transactions/TransactionFormModal';
import { GoalFormModal } from '@/components/goals/GoalFormModal';
import { DepositGoalModal } from '@/components/goals/DepositGoalModal';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuroraBackground>
      <AuthGuard>
        <div className="min-h-screen pb-24 md:pb-12 pt-4 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          {children}
        </div>
        <FloatingNavbar />
        {/* Global Modals */}
        <TransactionFormModal />
        <GoalFormModal />
        <DepositGoalModal />
      </AuthGuard>
    </AuroraBackground>
  );
}
