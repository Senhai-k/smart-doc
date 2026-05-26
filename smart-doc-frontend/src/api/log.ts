import request from './client';

export interface OperationLog {
  id: number;
  userId: number;
  username: string;
  action: string;
  module: string;
  ip: string;
  userAgent: string;
  duration: number;
  status: 'success' | 'failed';
  createdAt: string;
}

export interface PageResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export const logApi = {
  getList: (params?: { 
    page?: number; 
    pageSize?: number; 
    module?: string;
    status?: string;
    keyword?: string;
  }) =>
    request.get<PageResult<OperationLog>>('/logs', { params }),
  
  getModuleStats: () =>
    request.get<Array<{ module: string; count: number }>>('/logs/stats/modules'),
  
  getTodayStats: () =>
    request.get<{ total: number; success: number; failed: number }>('/logs/stats/today'),
  
  deleteBatch: (ids: number[]) =>
    request.post('/logs/batch-delete', { ids }),
  
  clearAll: () =>
    request.delete('/logs/clear'),
};