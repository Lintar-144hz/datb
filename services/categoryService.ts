import { Category } from '@/types/category';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { LocalStorageService, getDefaultCategories } from '@/lib/storage';

export const categoryService = {
  async getCategories(userId: string): Promise<Category[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('user_id', userId)
          .order('name', { ascending: true });

        if (!error && data && data.length > 0) {
          return data as Category[];
        }
      } catch (err) {
        console.warn('Supabase get categories error:', err);
      }
    }

    return LocalStorageService.getCategories(userId);
  },

  async addCategory(userId: string, data: Omit<Category, 'id' | 'user_id' | 'created_at'>): Promise<Category> {
    if (isSupabaseConfigured && supabase) {
      try {
        const payload = {
          user_id: userId,
          name: data.name,
          icon: data.icon,
          color: data.color,
          type: data.type,
        };

        const { data: newCat, error } = await supabase
          .from('categories')
          .insert(payload)
          .select()
          .single();

        if (!error && newCat) {
          LocalStorageService.addCategory(userId, newCat);
          return newCat as Category;
        }
      } catch (err) {
        console.warn('Supabase add category error:', err);
      }
    }

    return LocalStorageService.addCategory(userId, data);
  }
};
