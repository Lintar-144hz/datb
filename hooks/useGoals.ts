'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';
import { goalService } from '@/services/goalService';
import { Goal, GoalFormData, GoalDepositData } from '@/types/goal';
import confetti from 'canvas-confetti';

export function useGoals() {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const userId = user?.id || '';

  const { data: goals = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['goals', userId],
    queryFn: () => goalService.getGoals(userId),
    enabled: Boolean(userId),
  });

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#7C3AED', '#10B981', '#3B82F6', '#EC4899', '#F59E0B'],
      });
    } catch (e) {
      // safe fallback
    }
  };

  const addMutation = useMutation({
    mutationFn: (data: GoalFormData) => goalService.addGoal(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals', userId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Goal> }) =>
      goalService.updateGoal(userId, id, data),
    onSuccess: (updatedGoal) => {
      queryClient.invalidateQueries({ queryKey: ['goals', userId] });
      if (updatedGoal && updatedGoal.current >= updatedGoal.target) {
        triggerConfetti();
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => goalService.deleteGoal(userId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals', userId] });
    },
  });

  const depositMutation = useMutation({
    mutationFn: ({ goalId, data }: { goalId: string; data: GoalDepositData }) =>
      goalService.depositOrWithdraw(userId, goalId, data),
    onSuccess: (updatedGoal) => {
      queryClient.invalidateQueries({ queryKey: ['goals', userId] });
      queryClient.invalidateQueries({ queryKey: ['transactions', userId] });
      queryClient.invalidateQueries({ queryKey: ['stats', userId] });
      if (updatedGoal && updatedGoal.current >= updatedGoal.target) {
        triggerConfetti();
      }
    },
  });

  return {
    goals,
    isLoading,
    isError,
    refetch,
    addGoal: addMutation.mutateAsync,
    isAdding: addMutation.isPending,
    updateGoal: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteGoal: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    depositOrWithdraw: depositMutation.mutateAsync,
    isDepositing: depositMutation.isPending,
  };
}
