import { User } from '@/types/user';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { LocalStorageService } from '@/lib/storage';

export const userService = {
  async loginOrRegister(username: string): Promise<User> {
    const cleanUsername = username.trim();
    if (!cleanUsername) throw new Error('Username tidak boleh kosong');

    if (isSupabaseConfigured && supabase) {
      try {
        // Check existing user in Supabase
        const { data: existingUser, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .ilike('username', cleanUsername)
          .maybeSingle();

        if (fetchError && fetchError.code !== 'PGRST116') {
          console.warn('Supabase fetch user error, falling back to local storage:', fetchError.message);
        } else if (existingUser) {
          LocalStorageService.setCurrentUser(existingUser);
          return existingUser;
        }

        // Create new user in Supabase
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({ username: cleanUsername })
          .select()
          .single();

        if (!createError && newUser) {
          LocalStorageService.setCurrentUser(newUser);
          return newUser;
        }
      } catch (err) {
        console.warn('Supabase auth attempt failed, utilizing local storage:', err);
      }
    }

    // Local Storage Fallback
    let user = LocalStorageService.findUserByUsername(cleanUsername);
    if (!user) {
      user = LocalStorageService.createUser(cleanUsername);
    }
    LocalStorageService.setCurrentUser(user);
    return user;
  },

  async updateUsername(userId: string, newUsername: string): Promise<User> {
    const clean = newUsername.trim();
    if (!clean) throw new Error('Username tidak boleh kosong');

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('users')
          .update({ username: clean })
          .eq('id', userId)
          .select()
          .single();

        if (!error && data) {
          LocalStorageService.setCurrentUser(data);
          return data;
        }
      } catch (err) {
        console.warn('Supabase update username failed:', err);
      }
    }

    const current = LocalStorageService.getCurrentUser();
    if (current && current.id === userId) {
      const updated = { ...current, username: clean };
      LocalStorageService.setCurrentUser(updated);
      return updated;
    }
    throw new Error('Gagal memperbarui username');
  },

  getCurrentSessionUser(): User | null {
    return LocalStorageService.getCurrentUser();
  },

  logout(): void {
    LocalStorageService.setCurrentUser(null);
  }
};
