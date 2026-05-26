import request from './client';

export interface DashboardStats {
  totalUsers: number;
  totalOperations: number;
  todayOperations: number;
  usageByType: Record<string, number>;
  dailyTrend: Array<{ date: string; count: number }>;
  recentActivities: Array<{ id: number; username: string; action: string; time: string }>;
}

export const dashboardApi = {
  getStats: () =>
    request.get<DashboardStats>('/dashboard/stats'),
  
  getTrend: (days?: number) =>
    request.get('/dashboard/trend', { params: { days: days || 7 } }),
  
  getDistribution: () =>
    request.get('/dashboard/distribution'),
};