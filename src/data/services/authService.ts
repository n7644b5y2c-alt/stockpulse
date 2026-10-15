import type { User } from '../../types';

/**
 * Mock Authentication Service
 * NOTE: Production implementation will replace this module with Supabase Auth or Firebase Auth.
 * No sensitive passwords, secrets, or actual session JWT tokens are stored in the client.
 */

const USER_STORAGE_KEY = 'stockpulse-mock-user';

export interface AuthService {
  getCurrentUser(): User | null;
  login(email: string): Promise<User>;
  signup(email: string, name: string): Promise<User>;
  logout(): Promise<void>;
}

export const authService: AuthService = {
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(USER_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  async login(email: string): Promise<User> {
    const user: User = {
      id: `usr-${Date.now()}`,
      email,
      name: email.split('@')[0] || 'Investor',
      isDemoUser: false,
      createdAt: Date.now(),
    };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    return user;
  },

  async signup(email: string, name: string): Promise<User> {
    const user: User = {
      id: `usr-${Date.now()}`,
      email,
      name,
      isDemoUser: false,
      createdAt: Date.now(),
    };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    return user;
  },

  async logout(): Promise<void> {
    localStorage.removeItem(USER_STORAGE_KEY);
  },
};
