import request from './client';

interface ExportResult {
  filename: string;
  structured?: Record<string, unknown>;
  error?: string;
}

export const llmApi = {
  summary: (text: string) =>
    request.post('/llm/summary', { text }),  // 直接传对象

  sentiment: (text: string) =>
    request.post('/llm/sentiment', { text }),

  keywords: (text: string, topN?: number) =>
    request.post('/llm/keywords', { text, topN: topN || 5 }),

  translate: (text: string, targetLang: string) =>
    request.post('/llm/translate', { text, targetLang }),

  batchProcessMeeting: (formData: FormData) =>
    request.post('/llm/batch/meeting', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000
    }),

  exportMeetingResults: (results: ExportResult[]) =>
    request.post('/llm/export/meeting', { results }, { responseType: 'blob' }),
};