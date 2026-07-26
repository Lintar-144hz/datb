'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';
import { categoryService } from '@/services/categoryService';
import { CategoryFormData } from '@/types/category';

export function useCategories() {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const userId = user?.id || '';

  const { data: categories = [], isLoading, refetch } = useQuery({
    queryKey: ['categories', userId],
    queryFn: () => categoryService.getCategories(userId),
    enabled: Boolean(userId),
  });

  const addMutation = useMutation({
    mutationFn: (data: CategoryFormData) => categoryService.addCategory(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', userId] });
    },
  });

  const incomeCategories = categories.filter((c) => c.type === 'income');
  const expenseCategories = categories.filter((c) => c.type === 'expense');

  return {
    categories,
    incomeCategories,
    expenseCategories,
    isLoading,
    refetch,
    addCategory: addMutation.mutateAsync,
    isAdding: addMutation.isPending,
  };
}
