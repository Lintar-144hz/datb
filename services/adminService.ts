import { User } from '@/types/user';
import { Transaction } from '@/types/transaction';
import { Goal } from '@/types/goal';
import { Category } from '@/types/category';
import { LocalStorageService } from '@/lib/storage';
import { userService } from '@/services/userService';
import { isSupabaseConfigured } from '@/lib/supabase';

const STORAGE_KEYS = {
  CURRENT_USER: 'tabungan_dev_current_user',
  USERS: 'tabungan_dev_users',
  TRANSACTIONS: 'tabungan_dev_transactions',
  GOALS: 'tabungan_dev_goals',
  CATEGORIES: 'tabungan_dev_categories',
};

export interface DatabaseStats {
  totalUsers: number;
  totalTransactions: number;
  totalGoals: number;
  totalCategories: number;
  storageSizeKB: number;
  isSupabaseConnected: boolean;
}

export const adminService = {
  getDatabaseStats(): DatabaseStats {
    let storageSize = 0;
    if (typeof window !== 'undefined') {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const val = localStorage.getItem(key) || '';
          storageSize += key.length + val.length;
        }
      }
    }

    const users = LocalStorageService.getUsers();
    let totalTx = 0;
    let totalGoals = 0;
    let totalCats = 0;

    users.forEach((u) => {
      totalTx += LocalStorageService.getTransactions(u.id).length;
      totalGoals += LocalStorageService.getGoals(u.id).length;
      totalCats += LocalStorageService.getCategories(u.id).length;
    });

    return {
      totalUsers: users.length,
      totalTransactions: totalTx,
      totalGoals: totalGoals,
      totalCategories: totalCats,
      storageSizeKB: Math.round((storageSize * 2) / 1024), // Approx UTF-16 bytes to KB
      isSupabaseConnected: isSupabaseConfigured,
    };
  },

  getAllUsers(): User[] {
    return LocalStorageService.getUsers();
  },

  deleteUser(userId: string): void {
    const users = LocalStorageService.getUsers().filter((u) => u.id !== userId);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      
      // Delete user transactions
      const txsData = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (txsData) {
        const allTx: Transaction[] = JSON.parse(txsData);
        const filteredTx = allTx.filter((t) => t.user_id !== userId);
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(filteredTx));
      }

      // Delete user goals
      const goalsData = localStorage.getItem(STORAGE_KEYS.GOALS);
      if (goalsData) {
        const allGoals: Goal[] = JSON.parse(goalsData);
        const filteredGoals = allGoals.filter((g) => g.user_id !== userId);
        localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(filteredGoals));
      }
    }
  },

  getAllTransactions(): (Transaction & { username?: string })[] {
    const users = LocalStorageService.getUsers();
    const userMap = new Map(users.map((u) => [u.id, u.username]));

    let all: (Transaction & { username?: string })[] = [];
    users.forEach((u) => {
      const txs = LocalStorageService.getTransactions(u.id);
      txs.forEach((t) => {
        all.push({ ...t, username: userMap.get(t.user_id) || 'Unknown' });
      });
    });

    return all.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  getAllGoals(): (Goal & { username?: string })[] {
    const users = LocalStorageService.getUsers();
    const userMap = new Map(users.map((u) => [u.id, u.username]));

    let all: (Goal & { username?: string })[] = [];
    users.forEach((u) => {
      const goals = LocalStorageService.getGoals(u.id);
      goals.forEach((g) => {
        all.push({ ...g, username: userMap.get(g.user_id) || 'Unknown' });
      });
    });

    return all;
  },

  async seedDemoDatabase(): Promise<void> {
    const demoUsers = ['dev_santoso', 'frontend_pro', 'fullstack_dev', 'admin'];
    for (const name of demoUsers) {
      await userService.loginOrRegister(name);
    }

    const mainUser = await userService.loginOrRegister('dev_santoso');
    const uId = mainUser.id;

    // Reset user data for clean seed
    LocalStorageService.resetUserData(uId);

    // Seed Transactions
    const now = new Date();
    const subDays = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

    const sampleTransactions = [
      { type: 'income' as const, category: 'Gaji & Pendapatan', amount: 12500000, note: 'Gaji Bulanan Senior Developer', created_at: subDays(28) },
      { type: 'income' as const, category: 'Side Hustle / Bisnis', amount: 4500000, note: 'Selesai Slicing UI Next.js App', created_at: subDays(20) },
      { type: 'expense' as const, category: 'Tagihan & Utilitas', amount: 650000, note: 'Bayar VPS Cloud & Domain .dev', created_at: subDays(18) },
      { type: 'expense' as const, category: 'Makanan & Minuman', amount: 250000, note: 'Makan Siang & Kopi Dev Community', created_at: subDays(15) },
      { type: 'expense' as const, category: 'Belanja & Groceries', amount: 3200000, note: 'Beli Monitor 4K LG Ergonomic', created_at: subDays(12) },
      { type: 'income' as const, category: 'Side Hustle / Bisnis', amount: 2800000, note: 'Konsultasi Code Review API', created_at: subDays(8) },
      { type: 'expense' as const, category: 'Hiburan & Hobi', amount: 450000, note: 'Beli Game Steam Summer Sale', created_at: subDays(5) },
      { type: 'expense' as const, category: 'Makanan & Minuman', amount: 180000, note: 'Dinner Ricebowl & Coffee', created_at: subDays(2) },
    ];

    sampleTransactions.forEach((tx) => {
      LocalStorageService.addTransaction(uId, tx);
    });

    // Seed Goals
    const sampleGoals = [
      { title: 'Beli MacBook Pro M3 Max', target: 35000000, current: 18500000, deadline: '2026-12-31' },
      { title: 'Dana Darurat 6 Bulan', target: 25000000, current: 20000000, deadline: '2026-10-30' },
      { title: 'Liburan ke Jepang / DevConf', target: 20000000, current: 6500000, deadline: '2027-03-15' },
    ];

    sampleGoals.forEach((g) => {
      LocalStorageService.addGoal(uId, g);
    });
  },

  purgeAllDatabase(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.USERS);
      localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
      localStorage.removeItem(STORAGE_KEYS.GOALS);
      localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  generateSupabaseSqlDDL(): string {
    return `-- TABUNGAN DEV SUPABASE POSTGRESQL SCHEMA DDL
-- Jalankan script SQL ini di Supabase SQL Editor

-- 1. Users Table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Transactions Table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT NOT NULL,
  amount NUMERIC NOT NULL CHECK (amount >= 0),
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Savings Goals Table
CREATE TABLE IF NOT EXISTS public.goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  target NUMERIC NOT NULL CHECK (target > 0),
  current NUMERIC DEFAULT 0,
  deadline DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

-- Allow public access for dev mode
CREATE POLICY "Public full access users" ON public.users FOR ALL USING (true);
CREATE POLICY "Public full access transactions" ON public.transactions FOR ALL USING (true);
CREATE POLICY "Public full access goals" ON public.goals FOR ALL USING (true);
`;
  },
};
