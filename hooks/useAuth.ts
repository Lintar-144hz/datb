'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export function useAuth() {
  const { user, isAuthenticated, isLoading, error, initializeAuth, login, updateUsername, logout } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    updateUsername,
    logout,
  };
}
