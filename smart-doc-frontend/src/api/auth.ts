import request from './client';

// 类型直接在文件内定义
interface UserInfo {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

interface LoginParams {
  username: string;
  password: string;
}

interface RegisterParams {
  username: string;
  password: string;
  email: string;
}

export const authApi = {
  login: (params: LoginParams) =>
    request.post<{ token: string; user: UserInfo }>('/auth/login', params),

  register: (params: RegisterParams) =>
    request.post<{ success: boolean }>('/auth/register', params),

  getCurrentUser: () =>
    request.get<UserInfo>('/auth/me'),

  logout: () =>
    request.post('/auth/logout'),
};