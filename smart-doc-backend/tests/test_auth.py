"""认证接口测试"""
import json


class TestAuth:
    """登录/注册测试"""

    def test_register_success(self, client, db):
        """测试注册成功"""
        resp = client.post('/api/auth/register', json={
            'username': 'newuser',
            'password': '123456',
            'email': 'new@test.com'
        })
        data = json.loads(resp.data)
        assert resp.status_code == 201
        assert data['success'] is True

    def test_register_missing_fields(self, client):
        """测试注册缺少参数"""
        resp = client.post('/api/auth/register', json={'username': 'test'})
        assert resp.status_code == 400

    def test_register_duplicate_username(self, client, init_users):
        """测试注册重复用户名"""
        resp = client.post('/api/auth/register', json={
            'username': 'admin',
            'password': '123456',
            'email': 'another@test.com'
        })
        assert resp.status_code == 400

    def test_login_success(self, client, init_users):
        """测试登录成功"""
        resp = client.post('/api/auth/login', json={
            'username': 'admin',
            'password': 'admin123'
        })
        data = json.loads(resp.data)
        assert resp.status_code == 200
        assert data['success'] is True
        assert 'token' in data
        assert data['user']['role'] == 'admin'

    def test_login_wrong_password(self, client, init_users):
        """测试密码错误"""
        resp = client.post('/api/auth/login', json={
            'username': 'admin',
            'password': 'wrong'
        })
        assert resp.status_code == 401

    def test_login_disabled_user(self, client, init_users):
        """测试被禁用用户登录"""
        resp = client.post('/api/auth/login', json={
            'username': 'disabled',
            'password': '123456'
        })
        assert resp.status_code == 403