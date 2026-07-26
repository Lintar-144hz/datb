import { Goal, GoalFormData, GoalDepositData } from '@/types/goal';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { LocalStorageService } from '@/lib/storage';
import { transactionService } from './transactionService';

export const goalService = {
  async getGoals(userId: string): Promise<Goal[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('goals')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data as Goal[];
        }
      } catch (err) {
        console.warn('Supabase fetch goals error:', err);
      }
    }
    return LocalStorageService.getGoals(userId);
  },

  async addGoal(userId: string, data: GoalFormData): Promise<Goal> {
    if (isSupabaseConfigured && supabase) {
      try {
        const payload = {
          user_id: userId,
          title: data.title,
          target: data.target,
          current: data.current || 0,
          deadline: data.deadline || null,
        };

        const { data: newGoal, error } = await supabase
          .from('goals')
          .insert(payload)
          .select()
          .single();

        if (!error && newGoal) {
          LocalStorageService.addGoal(userId, newGoal);
          return newGoal as Goal;
        }
      } catch (err) {
        console.warn('Supabase add goal error:', err);
      }
    }

    return LocalStorageService.addGoal(userId, data);
  },

  async updateGoal(userId: string, id: string, data: Partial<Goal>): Promise<Goal> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: updated, error } = await supabase
          .from('goals')
          .update(data)
          .eq('id', id)
          .eq('user_id', userId)
          .select()
          .single();

        if (!error && updated) {
          LocalStorageService.updateGoal(userId, id, updated);
          return updated as Goal;
        }
      } catch (err) {
        console.warn('Supabase update goal error:', err);
      }
    }

    const res = LocalStorageService.updateGoal(userId, id, data);
    if (!res) throw new Error('Target tidak ditemukan');
    return res;
  },

  async deleteGoal(userId: string, id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('goals').delete().eq('id', id).eq('user_id', userId);
      } catch (err) {
        console.warn('Supabase delete goal error:', err);
      }
    }
    return LocalStorageService.deleteGoal(userId, id);
  },

  async depositOrWithdraw(userId: string, goalId: string, deposit: GoalDepositData): Promise<Goal> {
    const goals = await this.getGoals(userId);
    const targetGoal = goals.find((g) => g.id === goalId);
    if (!targetGoal) throw new Error('Target tidak ditemukan');

    const newCurrent = deposit.action === 'deposit'
      ? Number(targetGoal.current) + Number(deposit.amount)
      : Math.max(0, Number(targetGoal.current) - Number(deposit.amount));

    // Record corresponding financial transaction
    await transactionService.addTransaction(userId, {
      amount: deposit.amount,
      type: deposit.action === 'deposit' ? 'expense' : 'income',
      category: 'Tabungan & Investasi',
      note: `${deposit.action === 'deposit' ? 'Setoran Tabungan' : 'Penarikan Tabungan'}: ${targetGoal.title}${deposit.note ? ` (${deposit.note})` : ''}`,
      created_at: new Date().toISOString(),
    });

    return this.updateGoal(userId, goalId, { current: newCurrent });
  }
};
