import { useState, useCallback } from 'react';
import { authService } from '../data/services/authService';
import type { User } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => authService.getCurrentUser());

  const login = useCallback(async (email: string) => {
    const loggedUser = await authService.login(email);
    setUser(loggedUser);
    return loggedUser;
  }, []);

  const signup = useCallback(async (email: string, name: string) => {
    const newUser = await authService.signup(email, name);
    setUser(newUser);
    return newUser;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  return {
    user,
    isAuthenticated: Boolean(user),
    login,
    signup,
    logout,
  };
}
