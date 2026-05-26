import request from './client';

export interface OCRResult {
  text: string;
  confidence: number;
}

export const ocrApi = {
  recognize: (formData: FormData) =>
    request.post<OCRResult>('/ocr/recognize', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000,
    }),
  
  getHistory: (params?: { page?: number; pageSize?: number }) =>
    request.get('/ocr/history', { params }),
  
  deleteRecord: (id: number) =>
    request.delete(`/ocr/record/${id}`),
};