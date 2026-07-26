import { Transaction, TransactionFilterOptions } from '@/types/transaction';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { LocalStorageService } from '@/lib/storage';

export const transactionService = {
  async getTransactions(userId: string, filters?: TransactionFilterOptions): Promise<Transaction[]> {
    let txs: Transaction[] = [];

    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase
          .from('transactions')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (filters?.type && filters.type !== 'all') {
          query = query.eq('type', filters.type);
        }
        if (filters?.category && filters.category !== 'all') {
          query = query.eq('category', filters.category);
        }

        const { data, error } = await query;
        if (!error && data) {
          txs = data as Transaction[];
        } else {
          txs = LocalStorageService.getTransactions(userId);
        }
      } catch (e) {
        txs = LocalStorageService.getTransactions(userId);
      }
    } else {
      txs = LocalStorageService.getTransactions(userId);
    }

    // Apply client-side search & date filter
    if (filters?.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      txs = txs.filter(
        (t) =>
          t.category.toLowerCase().includes(q) ||
          (t.note && t.note.toLowerCase().includes(q)) ||
          t.amount.toString().includes(q)
      );
    }

    if (filters?.startDate) {
      const start = new Date(filters.startDate).getTime();
      txs = txs.filter((t) => new Date(t.created_at).getTime() >= start);
    }

    if (filters?.endDate) {
      const end = new Date(filters.endDate).getTime() + 86400000; // end of day
      txs = txs.filter((t) => new Date(t.created_at).getTime() <= end);
    }

    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case 'amount-desc':
          txs.sort((a, b) => b.amount - a.amount);
          break;
        case 'amount-asc':
          txs.sort((a, b) => a.amount - b.amount);
          break;
        case 'date-asc':
          txs.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
          break;
        case 'date-desc':
        default:
          txs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          break;
      }
    }

    return txs;
  },

  async addTransaction(userId: string, data: Omit<Transaction, 'id' | 'user_id' | 'created_at'> & { created_at?: string }): Promise<Transaction> {
    if (isSupabaseConfigured && supabase) {
      try {
        const payload = {
          user_id: userId,
          amount: data.amount,
          type: data.type,
          category: data.category,
          note: data.note || null,
          created_at: data.created_at || new Date().toISOString(),
        };

        const { data: newTx, error } = await supabase
          .from('transactions')
          .insert(payload)
          .select()
          .single();

        if (!error && newTx) {
          // Sync to local
          LocalStorageService.addTransaction(userId, newTx);
          return newTx as Transaction;
        }
      } catch (err) {
        console.warn('Supabase add transaction error:', err);
      }
    }

    // Local Storage
    return LocalStorageService.addTransaction(userId, data);
  },

  async updateTransaction(userId: string, id: string, data: Partial<Transaction>): Promise<Transaction> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: updated, error } = await supabase
          .from('transactions')
          .update(data)
          .eq('id', id)
          .eq('user_id', userId)
          .select()
          .single();

        if (!error && updated) {
          LocalStorageService.updateTransaction(userId, id, updated);
          return updated as Transaction;
        }
      } catch (err) {
        console.warn('Supabase update transaction error:', err);
      }
    }

    const res = LocalStorageService.updateTransaction(userId, id, data);
    if (!res) throw new Error('Transaksi tidak ditemukan');
    return res;
  },

  async deleteTransaction(userId: string, id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('transactions').delete().eq('id', id).eq('user_id', userId);
      } catch (err) {
        console.warn('Supabase delete error:', err);
      }
    }
    return LocalStorageService.deleteTransaction(userId, id);
  },

  calculateTotals(transactions: Transaction[]): {
    totalIncome: number;
    totalExpense: number;
    totalBalance: number;
  } {
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((tx) => {
      if (tx.type === 'income') {
        totalIncome += Number(tx.amount);
      } else if (tx.type === 'expense') {
        totalExpense += Number(tx.amount);
      }
    });

    return {
      totalIncome,
      totalExpense,
      totalBalance: totalIncome - totalExpense,
    };
  }
};
