'use client';

import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';
import { useFinanceStore } from '@/store/useFinanceStore';
import { transactionService } from '@/services/transactionService';
import { Transaction, TransactionFormData } from '@/types/transaction';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export function useTransactions() {
  const user = useAuthStore((state) => state.user);
  const filters = useFinanceStore((state) => state.filters);
  const queryClient = useQueryClient();

  const userId = user?.id || '';

  const queryKey = ['transactions', userId, filters];

  const { data: transactions = [], isLoading, isError, refetch } = useQuery({
    queryKey,
    queryFn: () => transactionService.getTransactions(userId, filters),
    enabled: Boolean(userId),
  });

  const totals = transactionService.calculateTotals(transactions);

  // Realtime database listener across tabs, local window events, and Supabase Postgres Realtime
  useEffect(() => {
    if (!userId) return;

    const handleRealtimeUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', userId] });
      queryClient.invalidateQueries({ queryKey: ['stats', userId] });
    };

    window.addEventListener('storage', handleRealtimeUpdate);
    window.addEventListener('tabungan_db_update', handleRealtimeUpdate);

    let channel: any = null;
    if (isSupabaseConfigured && supabase) {
      const channelId = `tx_${userId}_${Math.random().toString(36).substring(2, 8)}`;
      channel = supabase
        .channel(channelId)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'transactions', filter: `user_id=eq.${userId}` },
          handleRealtimeUpdate
        )
        .subscribe();
    }

    return () => {
      window.removeEventListener('storage', handleRealtimeUpdate);
      window.removeEventListener('tabungan_db_update', handleRealtimeUpdate);
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, [userId, queryClient]);

  const addMutation = useMutation({
    mutationFn: (data: TransactionFormData) =>
      transactionService.addTransaction(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', userId] });
      queryClient.invalidateQueries({ queryKey: ['stats', userId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Transaction> }) =>
      transactionService.updateTransaction(userId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', userId] });
      queryClient.invalidateQueries({ queryKey: ['stats', userId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => transactionService.deleteTransaction(userId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', userId] });
      queryClient.invalidateQueries({ queryKey: ['stats', userId] });
    },
  });

  return {
    transactions,
    totals,
    isLoading,
    isError,
    refetch,
    addTransaction: addMutation.mutateAsync,
    isAdding: addMutation.isPending,
    updateTransaction: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteTransaction: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
