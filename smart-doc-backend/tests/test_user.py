"""用户管理接口测试"""
import json


class TestUserManagement:
    """用户管理测试（仅管理员可操作）"""

    def test_get_users_as_admin(self, client, admin_token):
        """管理员查看用户列表"""
        resp = client.get(
            '/api/users',
            headers={'Authorization': f'Bearer {admin_token}'}
        )
        data = json.loads(resp.data)
        assert data['total'] >= 1

    def test_get_users_as_user(self, client, user_token):
        """普通用户查看用户列表（应被拒绝）"""
        resp = client.get(
            '/api/users',
            headers={'Authorization': f'Bearer {user_token}'}
        )
        assert resp.status_code == 403

    def test_create_user_by_admin(self, client, admin_token):
        """管理员创建用户"""
        resp = client.post(
            '/api/users',
            json={
                'username': 'newstaff',
                'password': '123456',
                'email': 'staff@test.com',
                'role': 'user'
            },
            headers={'Authorization': f'Bearer {admin_token}'}
        )
        data = json.loads(resp.data)
        assert resp.status_code == 201
        assert data['success'] is True

    def test_delete_user(self, client, admin_token, init_users):
        """管理员删除用户"""
        # 获取用户列表，找到 testuser
        resp = client.get(
            '/api/users',
            headers={'Authorization': f'Bearer {admin_token}'}
        )
        users = json.loads(resp.data)['items']
        target = [u for u in users if u['username'] == 'testuser'][0]

        resp = client.delete(
            f'/api/users/{target["id"]}',
            headers={'Authorization': f'Bearer {admin_token}'}
        )
        data = json.loads(resp.data)
        assert data['success'] is True