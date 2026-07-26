export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: TransactionType;
  category: string;
  note?: string | null;
  created_at: string;
}

export interface TransactionFormData {
  amount: number;
  type: TransactionType;
  category: string;
  note?: string;
  created_at?: string;
}

export interface TransactionFilterOptions {
  type?: TransactionType | 'all';
  category?: string | 'all';
  searchQuery?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';
}
