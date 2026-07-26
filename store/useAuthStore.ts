import { create } from 'zustand';
import { User } from '@/types/user';
import { userService } from '@/services/userService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  initializeAuth: () => void;
  login: (username: string) => Promise<User>;
  updateUsername: (newUsername: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  initializeAuth: () => {
    try {
      const user = userService.getCurrentSessionUser();
      if (user) {
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (err: any) {
      set({ isLoading: false, error: err.message || 'Gagal memuat sesi' });
    }
  },

  login: async (username: string) => {
    set({ isLoading: true, error: null });
    try {
      const user = await userService.loginOrRegister(username);
      set({ user, isAuthenticated: true, isLoading: false });
      return user;
    } catch (err: any) {
      set({ isLoading: false, error: err.message || 'Gagal masuk' });
      throw err;
    }
  },

  updateUsername: async (newUsername: string) => {
    const { user } = get();
    if (!user) return;
    set({ isLoading: true, error: null });
    try {
      const updatedUser = await userService.updateUsername(user.id, newUsername);
      set({ user: updatedUser, isLoading: false });
    } catch (err: any) {
      set({ isLoading: false, error: err.message || 'Gagal memperbarui nama' });
      throw err;
    }
  },

  logout: () => {
    userService.logout();
    set({ user: null, isAuthenticated: false });
  },
}));
