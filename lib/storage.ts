import { User } from '@/types/user';
import { Transaction } from '@/types/transaction';
import { Goal, GoalFormData } from '@/types/goal';
import { Category } from '@/types/category';
import { BackupData } from '@/types/database';
import { generateUUID } from './utils';

const STORAGE_KEYS = {
  CURRENT_USER: 'tabungan_dev_current_user',
  USERS: 'tabungan_dev_users',
  TRANSACTIONS: 'tabungan_dev_transactions',
  GOALS: 'tabungan_dev_goals',
  CATEGORIES: 'tabungan_dev_categories',
};

// Default seed categories for a newly created user
export const getDefaultCategories = (userId: string): Category[] => [
  { id: generateUUID(), user_id: userId, name: 'Gaji & Pendapatan', icon: 'Wallet', color: '#10B981', type: 'income', created_at: new Date().toISOString() },
  { id: generateUUID(), user_id: userId, name: 'Bonus & Investasi', icon: 'TrendingUp', color: '#06B6D4', type: 'income', created_at: new Date().toISOString() },
  { id: generateUUID(), user_id: userId, name: 'Side Hustle / Bisnis', icon: 'Briefcase', color: '#3B82F6', type: 'income', created_at: new Date().toISOString() },
  { id: generateUUID(), user_id: userId, name: 'Makanan & Minuman', icon: 'Utensils', color: '#F59E0B', type: 'expense', created_at: new Date().toISOString() },
  { id: generateUUID(), user_id: userId, name: 'Belanja & Groceries', icon: 'ShoppingBag', color: '#EC4899', type: 'expense', created_at: new Date().toISOString() },
  { id: generateUUID(), user_id: userId, name: 'Transportasi & Bensin', icon: 'Car', color: '#8B5CF6', type: 'expense', created_at: new Date().toISOString() },
  { id: generateUUID(), user_id: userId, name: 'Tagihan & Utilitas', icon: 'Zap', color: '#EF4444', type: 'expense', created_at: new Date().toISOString() },
  { id: generateUUID(), user_id: userId, name: 'Hiburan & Hobi', icon: 'Film', color: '#6366F1', type: 'expense', created_at: new Date().toISOString() },
  { id: generateUUID(), user_id: userId, name: 'Kesehatan & Medis', icon: 'HeartPulse', color: '#14B8A6', type: 'expense', created_at: new Date().toISOString() },
  { id: generateUUID(), user_id: userId, name: 'Edukasi & Buku', icon: 'GraduationCap', color: '#F97316', type: 'expense', created_at: new Date().toISOString() },
];

export const LocalStorageService = {
  // --- USER METHODS ---
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },

  setCurrentUser(user: User | null): void {
    if (typeof window === 'undefined') return;
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  getUsers(): User[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },

  findUserByUsername(username: string): User | null {
    const users = this.getUsers();
    return users.find((u) => u.username.toLowerCase() === username.toLowerCase()) || null;
  },

  createUser(username: string): User {
    const users = this.getUsers();
    const newUser: User = {
      id: generateUUID(),
      username: username.trim(),
      created_at: new Date().toISOString(),
    };
    users.push(newUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }

    // Seed default categories
    const categories = this.getCategories(newUser.id);
    if (categories.length === 0) {
      this.saveCategories(newUser.id, getDefaultCategories(newUser.id));
    }

    // Seed initial demo data for instant delight if brand new
    this.seedDemoDataIfEmpty(newUser.id);

    return newUser;
  },

  // --- CATEGORIES METHODS ---
  getCategories(userId: string): Category[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    const allCategories: Category[] = data ? JSON.parse(data) : [];
    const userCategories = allCategories.filter((c) => c.user_id === userId);
    
    if (userCategories.length === 0) {
      const defaults = getDefaultCategories(userId);
      this.saveCategories(userId, defaults);
      return defaults;
    }
    return userCategories;
  },

  saveCategories(userId: string, categories: Category[]): void {
    if (typeof window === 'undefined') return;
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    const allCategories: Category[] = data ? JSON.parse(data) : [];
    const filtered = allCategories.filter((c) => c.user_id !== userId);
    const updated = [...filtered, ...categories];
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(updated));
  },

  addCategory(userId: string, category: Omit<Category, 'id' | 'user_id' | 'created_at'>): Category {
    const categories = this.getCategories(userId);
    const newCategory: Category = {
      ...category,
      id: generateUUID(),
      user_id: userId,
      created_at: new Date().toISOString(),
    };
    categories.push(newCategory);
    this.saveCategories(userId, categories);
    return newCategory;
  },

  // --- TRANSACTIONS METHODS ---
  getTransactions(userId: string): Transaction[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    const all: Transaction[] = data ? JSON.parse(data) : [];
    return all
      .filter((t) => t.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  saveTransactions(userId: string, transactions: Transaction[]): void {
    if (typeof window === 'undefined') return;
    const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    const all: Transaction[] = data ? JSON.parse(data) : [];
    const filtered = all.filter((t) => t.user_id !== userId);
    const updated = [...filtered, ...transactions];
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updated));
  },

  addTransaction(userId: string, data: Omit<Transaction, 'id' | 'user_id' | 'created_at'> & { created_at?: string }): Transaction {
    const transactions = this.getTransactions(userId);
    const newTransaction: Transaction = {
      ...data,
      id: generateUUID(),
      user_id: userId,
      created_at: data.created_at || new Date().toISOString(),
    };
    transactions.unshift(newTransaction);
    this.saveTransactions(userId, transactions);
    return newTransaction;
  },

  updateTransaction(userId: string, id: string, data: Partial<Transaction>): Transaction | null {
    const transactions = this.getTransactions(userId);
    const index = transactions.findIndex((t) => t.id === id);
    if (index === -1) return null;

    transactions[index] = { ...transactions[index], ...data };
    this.saveTransactions(userId, transactions);
    return transactions[index];
  },

  deleteTransaction(userId: string, id: string): boolean {
    const transactions = this.getTransactions(userId);
    const filtered = transactions.filter((t) => t.id !== id);
    if (filtered.length === transactions.length) return false;
    this.saveTransactions(userId, filtered);
    return true;
  },

  // --- GOALS METHODS ---
  getGoals(userId: string): Goal[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.GOALS);
    const all: Goal[] = data ? JSON.parse(data) : [];
    return all
      .filter((g) => g.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  saveGoals(userId: string, goals: Goal[]): void {
    if (typeof window === 'undefined') return;
    const data = localStorage.getItem(STORAGE_KEYS.GOALS);
    const all: Goal[] = data ? JSON.parse(data) : [];
    const filtered = all.filter((g) => g.user_id !== userId);
    const updated = [...filtered, ...goals];
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(updated));
  },

  addGoal(userId: string, data: GoalFormData): Goal {
    const goals = this.getGoals(userId);
    const newGoal: Goal = {
      title: data.title,
      target: data.target,
      current: data.current || 0,
      deadline: data.deadline || null,
      id: generateUUID(),
      user_id: userId,
      created_at: new Date().toISOString(),
    };
    goals.unshift(newGoal);
    this.saveGoals(userId, goals);
    return newGoal;
  },

  updateGoal(userId: string, id: string, data: Partial<Goal>): Goal | null {
    const goals = this.getGoals(userId);
    const index = goals.findIndex((g) => g.id === id);
    if (index === -1) return null;

    goals[index] = { ...goals[index], ...data };
    this.saveGoals(userId, goals);
    return goals[index];
  },

  deleteGoal(userId: string, id: string): boolean {
    const goals = this.getGoals(userId);
    const filtered = goals.filter((g) => g.id !== id);
    if (filtered.length === goals.length) return false;
    this.saveGoals(userId, filtered);
    return true;
  },

  depositToGoal(userId: string, goalId: string, amount: number, action: 'deposit' | 'withdraw'): Goal | null {
    const goals = this.getGoals(userId);
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return null;

    const newCurrent = action === 'deposit' 
      ? goal.current + amount 
      : Math.max(0, goal.current - amount);

    // Also automatically create transaction record for deposit / goal allocation
    this.addTransaction(userId, {
      amount,
      type: action === 'deposit' ? 'expense' : 'income',
      category: 'Tabungan & Investasi',
      note: `${action === 'deposit' ? 'Setoran' : 'Penarikan'} Target: ${goal.title}`,
      created_at: new Date().toISOString(),
    });

    return this.updateGoal(userId, goalId, { current: newCurrent });
  },

  // --- BACKUP & RESTORE DATA ---
  exportBackup(userId: string): BackupData | null {
    const user = this.getCurrentUser();
    if (!user || user.id !== userId) return null;

    return {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      user,
      categories: this.getCategories(userId),
      transactions: this.getTransactions(userId),
      goals: this.getGoals(userId),
    };
  },

  importBackup(userId: string, backup: BackupData): boolean {
    if (!backup || !backup.transactions || !backup.goals) return false;
    this.saveCategories(userId, backup.categories || getDefaultCategories(userId));
    this.saveTransactions(userId, backup.transactions.map(t => ({ ...t, user_id: userId })));
    this.saveGoals(userId, backup.goals.map(g => ({ ...g, user_id: userId })));
    return true;
  },

  resetUserData(userId: string): void {
    this.saveTransactions(userId, []);
    this.saveGoals(userId, []);
    this.saveCategories(userId, getDefaultCategories(userId));
  },

  // --- DEMO SEED DATA ---
  seedDemoDataIfEmpty(userId: string): void {
    const txs = this.getTransactions(userId);
    if (txs.length > 0) return;

    const now = new Date();
    const daysAgo = (d: number) => {
      const date = new Date(now);
      date.setDate(date.getDate() - d);
      return date.toISOString();
    };

    // Seed sample transactions
    const sampleTxs: Omit<Transaction, 'id' | 'user_id'>[] = [
      { amount: 8500000, type: 'income', category: 'Gaji & Pendapatan', note: 'Gaji Bulanan Software Engineer', created_at: daysAgo(20) },
      { amount: 1200000, type: 'income', category: 'Side Hustle / Bisnis', note: 'Project Freelance Web Dev', created_at: daysAgo(12) },
      { amount: 350000, type: 'expense', category: 'Belanja & Groceries', note: 'Groceries Bulanan Supermarket', created_at: daysAgo(18) },
      { amount: 120000, type: 'expense', category: 'Makanan & Minuman', note: 'Makan Malam bersama Tim', created_at: daysAgo(15) },
      { amount: 450000, type: 'expense', category: 'Tagihan & Utilitas', note: 'Wi-Fi & Listrik Rumah', created_at: daysAgo(10) },
      { amount: 85000, type: 'expense', category: 'Transportasi & Bensin', note: 'Isi BBM Pertamax', created_at: daysAgo(5) },
      { amount: 250000, type: 'expense', category: 'Hiburan & Hobi', note: 'Langganan Streaming & Game', created_at: daysAgo(2) },
    ];

    sampleTxs.forEach((tx) => this.addTransaction(userId, tx));

    // Seed sample goals
    const deadline1 = new Date();
    deadline1.setMonth(deadline1.getMonth() + 6);
    const deadline2 = new Date();
    deadline2.setMonth(deadline2.getMonth() + 3);

    const sampleGoals: Omit<Goal, 'id' | 'user_id' | 'created_at'>[] = [
      { title: 'Dana Darurat 6 Bulan', target: 20000000, current: 8500000, deadline: deadline1.toISOString().split('T')[0] },
      { title: 'MacBook Pro M3 Max', target: 35000000, current: 18000000, deadline: deadline2.toISOString().split('T')[0] },
      { title: 'Liburan ke Jepang 🇯🇵', target: 15000000, current: 6500000, deadline: null },
    ];

    sampleGoals.forEach((g) => this.addGoal(userId, g));
  }
};
