"""仪表盘接口测试"""
import json


class TestDashboard:
    """仪表盘统计测试"""

    def test_get_stats(self, client, admin_token):
        """获取仪表盘统计"""
        resp = client.get(
            '/api/dashboard/stats',
            headers={'Authorization': f'Bearer {admin_token}'}
        )
        data = json.loads(resp.data)
        assert 'totalUsers' in data
        assert 'totalOperations' in data
        assert 'todayOperations' in data
        assert 'usageByType' in data
        assert 'dailyTrend' in data
        assert 'recentActivities' in data

    def test_get_trend(self, client, admin_token):
        """获取使用趋势"""
        resp = client.get(
            '/api/dashboard/trend?days=7',
            headers={'Authorization': f'Bearer {admin_token}'}
        )
        data = json.loads(resp.data)
        assert 'trend' in data
        assert len(data['trend']) == 7

    def test_get_distribution(self, client, admin_token):
        """获取功能分布"""
        resp = client.get(
            '/api/dashboard/distribution',
            headers={'Authorization': f'Bearer {admin_token}'}
        )
        data = json.loads(resp.data)
        assert 'distribution' in data