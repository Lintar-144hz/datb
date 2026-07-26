import { User } from './user';
import { Transaction } from './transaction';
import { Goal } from './goal';
import { Category } from './category';

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<User, 'id'>>;
      };
      categories: {
        Row: Category;
        Insert: Omit<Category, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<Category, 'id'>>;
      };
      transactions: {
        Row: Transaction;
        Insert: Omit<Transaction, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<Transaction, 'id'>>;
      };
      goals: {
        Row: Goal;
        Insert: Omit<Goal, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<Goal, 'id'>>;
      };
    };
  };
}

export interface BackupData {
  version: string;
  exportedAt: string;
  user: User;
  categories: Category[];
  transactions: Transaction[];
  goals: Goal[];
}
