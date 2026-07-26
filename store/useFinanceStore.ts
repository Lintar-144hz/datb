import { create } from 'zustand';
import { TransactionType, TransactionFilterOptions } from '@/types/transaction';

export type TimeRangeOption = '7d' | '30d' | '1y';

interface FinanceState {
  // Filters & State
  selectedTimeRange: TimeRangeOption;
  filters: TransactionFilterOptions;
  
  // Modals state
  isAddTransactionOpen: boolean;
  isAddGoalOpen: boolean;
  isAddCategoryOpen: boolean;
  activeDepositGoalId: string | null;
  activeEditTransactionId: string | null;
  activeEditGoalId: string | null;

  // Actions
  setTimeRange: (range: TimeRangeOption) => void;
  setFilters: (filters: Partial<TransactionFilterOptions>) => void;
  resetFilters: () => void;
  
  // Modal Actions
  openAddTransactionModal: (editId?: string) => void;
  closeAddTransactionModal: () => void;
  openAddGoalModal: (editId?: string) => void;
  closeAddGoalModal: () => void;
  openDepositGoalModal: (goalId: string) => void;
  closeDepositGoalModal: () => void;
  openAddCategoryModal: () => void;
  closeAddCategoryModal: () => void;
}

const initialFilters: TransactionFilterOptions = {
  type: 'all',
  category: 'all',
  searchQuery: '',
  sortBy: 'date-desc',
};

export const useFinanceStore = create<FinanceState>((set) => ({
  selectedTimeRange: '30d',
  filters: initialFilters,

  isAddTransactionOpen: false,
  isAddGoalOpen: false,
  isAddCategoryOpen: false,
  activeDepositGoalId: null,
  activeEditTransactionId: null,
  activeEditGoalId: null,

  setTimeRange: (range) => set({ selectedTimeRange: range }),
  
  setFilters: (newFilters) =>
    set((state) => ({ filters: { ...state.filters, ...newFilters } })),

  resetFilters: () => set({ filters: initialFilters }),

  openAddTransactionModal: (editId) =>
    set({ isAddTransactionOpen: true, activeEditTransactionId: editId || null }),
  closeAddTransactionModal: () =>
    set({ isAddTransactionOpen: false, activeEditTransactionId: null }),

  openAddGoalModal: (editId) =>
    set({ isAddGoalOpen: true, activeEditGoalId: editId || null }),
  closeAddGoalModal: () =>
    set({ isAddGoalOpen: false, activeEditGoalId: null }),

  openDepositGoalModal: (goalId) =>
    set({ activeDepositGoalId: goalId }),
  closeDepositGoalModal: () =>
    set({ activeDepositGoalId: null }),

  openAddCategoryModal: () => set({ isAddCategoryOpen: true }),
  closeAddCategoryModal: () => set({ isAddCategoryOpen: false }),
}));
