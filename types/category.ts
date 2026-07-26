import { TransactionType } from './transaction';

export interface Category {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
  created_at: string;
}

export interface CategoryFormData {
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
}
