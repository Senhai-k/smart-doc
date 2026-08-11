import request from './client';

interface ExportResult {
  filename: string;
  structured?: Record<string, unknown>;
  error?: string;
}

interface TextResult {
  result: string;
}

interface BatchMeetingResult {
  results: ExportResult[];
  total: number;
}

export const llmApi = {
  summary: (text: string) =>
    request.post<TextResult>('/llm/summary', { text }),  // 直接传对象

  sentiment: (text: string) =>
    request.post<TextResult>('/llm/sentiment', { text }),

  keywords: (text: string, topN?: number) =>
    request.post<TextResult>('/llm/keywords', { text, topN: topN || 5 }),

  translate: (text: string, targetLang: string) =>
    request.post<TextResult>('/llm/translate', { text, targetLang }),

  batchProcessMeeting: (formData: FormData) =>
    request.post<BatchMeetingResult>('/llm/batch/meeting', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000
    }),

  exportMeetingResults: (results: ExportResult[]) =>
    request.post<Blob>('/llm/export/meeting', { results }, { responseType: 'blob' }),
};
