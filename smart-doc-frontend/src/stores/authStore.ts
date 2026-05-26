import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 类型直接在文件内定义
interface UserInfo {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

interface AuthState {
  user: UserInfo | null;
  isLoggedIn: boolean;
  login: (user: UserInfo, token: string) => void;
  logout: () => void;
  updateUser: (user: UserInfo) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: { id: 1, username: '测试用户', email: 'test@test.com', role: 'admin', createdAt: new Date().toISOString() },
isLoggedIn: true,
      login: (user, token) => {
        localStorage.setItem('access_token', token);
        set({ user, isLoggedIn: true });
      },
      logout: () => {
        localStorage.removeItem('access_token');
        set({ user: null, isLoggedIn: false });
      },
      updateUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
    }
  )
);