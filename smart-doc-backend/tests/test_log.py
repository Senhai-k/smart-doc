"""操作日志接口测试"""
import json


class TestOperationLog:
    """操作日志测试"""

    def test_get_logs_as_admin(self, client, admin_token):
        """管理员查看日志"""
        resp = client.get(
            '/api/logs',
            headers={'Authorization': f'Bearer {admin_token}'}
        )
        data = json.loads(resp.data)
        assert 'items' in data
        assert 'total' in data

    def test_get_logs_as_user(self, client, user_token):
        """普通用户查看日志（应被拒绝）"""
        resp = client.get(
            '/api/logs',
            headers={'Authorization': f'Bearer {user_token}'}
        )
        assert resp.status_code == 403

    def test_get_today_stats(self, client, admin_token):
        """获取今日统计"""
        resp = client.get(
            '/api/logs/stats/today',
            headers={'Authorization': f'Bearer {admin_token}'}
        )
        data = json.loads(resp.data)
        assert 'total' in data
        assert 'success' in data
        assert 'failed' in data