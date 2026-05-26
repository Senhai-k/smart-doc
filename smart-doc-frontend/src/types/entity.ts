// src/types/entity.ts

export type UserInfo = {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export type LoginParams = {
  username: string;
  password: string;
}

export type RegisterParams = {
  username: string;
  password: string;
  email: string;
}

export type HistoryRecord = {
  id: number;
  userId: number;
  type: 'ocr' | 'summary' | 'sentiment' | 'keywords' | 'translate';
  input: string;
  output: string;
  createdAt: string;
}

export type OperationLog = {
  id: number;
  userId: number;
  username: string;
  action: string;
  ip: string;
  createdAt: string;
}

export type DashboardStats = {
  totalUsers: number;
  totalOperations: number;
  todayOperations: number;
  usageByType: Record<string, number>;
  dailyTrend: Array<{ date: string; count: number }>;
}