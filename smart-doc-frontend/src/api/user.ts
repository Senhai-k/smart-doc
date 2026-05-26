import request from './client';

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'disabled';
  createdAt: string;
  lastLoginAt?: string;
}

export interface CreateUserParams {
  username: string;
  password: string;
  email: string;
  role?: 'admin' | 'user';
}

export interface UpdateUserParams {
  id: number;
  username?: string;
  email?: string;
  role?: 'admin' | 'user';
  status?: 'active' | 'disabled';
}

export interface PageResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export const userApi = {
  getList: (params?: { page?: number; pageSize?: number; keyword?: string; role?: string }) =>
    request.get<PageResult<User>>('/users', { params }),
  
  create: (params: CreateUserParams) =>
    request.post<{ success: boolean; user: User }>('/users', params),
  
  update: (params: UpdateUserParams) =>
    request.put<{ success: boolean; user: User }>(`/users/${params.id}`, params),
  
  delete: (id: number) =>
    request.delete(`/users/${id}`),
  
  resetPassword: (id: number, newPassword: string) =>
    request.post(`/users/${id}/reset-password`, { password: newPassword }),
  
  getDetail: (id: number) =>
    request.get<User>(`/users/${id}`),
};