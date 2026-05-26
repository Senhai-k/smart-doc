import request from './client';

// 使用 type 关键字导出类型
export type HistoryRecord = {
  id: number;
  userId: number;
  type: 'ocr' | 'summary' | 'sentiment' | 'keywords' | 'translate';
  input: string;
  output: string;
  createdAt: string;
}

export type PageResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export const historyApi = {
  getList: (params?: { page?: number; pageSize?: number; type?: string }) =>
    request.get<PageResult<HistoryRecord>>('/history', { params }),
  
  deleteRecord: (id: number) =>
    request.delete(`/history/${id}`),
  
  deleteBatch: (ids: number[]) =>
    request.post('/history/batch-delete', { ids }),
  
  clearAll: () =>
    request.delete('/history/clear'),
};