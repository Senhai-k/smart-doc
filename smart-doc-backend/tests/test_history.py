"""历史记录接口测试"""
import json


class TestHistory:
    """历史记录 CRUD 测试"""

    def test_get_history_empty(self, client, user_token):
        """测试空历史记录"""
        resp = client.get(
            '/api/history',
            headers={'Authorization': f'Bearer {user_token}'}
        )
        data = json.loads(resp.data)
        assert data['total'] == 0
        assert data['items'] == []

    def test_save_and_get_history(self, client, user_token):
        """测试保存后查询历史"""
        # 先保存一条记录
        resp = client.post(
            '/api/history',
            json={'type': 'summary', 'input': 'test', 'output': 'result'},
            headers={'Authorization': f'Bearer {user_token}'}
        )
        assert resp.status_code == 200

        # 查询历史
        resp = client.get(
            '/api/history',
            headers={'Authorization': f'Bearer {user_token}'}
        )
        data = json.loads(resp.data)
        assert data['total'] == 1
        assert data['items'][0]['type'] == 'summary'

    def test_delete_history(self, client, user_token):
        """测试删除历史记录"""
        # 先保存
        resp = client.post(
            '/api/history',
            json={'type': 'ocr', 'input': 'img.png', 'output': 'text'},
            headers={'Authorization': f'Bearer {user_token}'}
        )
        history_id = json.loads(resp.data)['id']

        # 删除
        resp = client.delete(
            f'/api/history/{history_id}',
            headers={'Authorization': f'Bearer {user_token}'}
        )
        data = json.loads(resp.data)
        assert data['success'] is True

    def test_batch_delete(self, client, user_token):
        """测试批量删除"""
        # 保存两条
        ids = []
        for i in range(2):
            resp = client.post(
                '/api/history',
                json={'type': 'ocr', 'input': f'test{i}', 'output': 'text'},
                headers={'Authorization': f'Bearer {user_token}'}
            )
            ids.append(json.loads(resp.data)['id'])

        # 批量删除
        resp = client.post(
            '/api/history/batch-delete',
            json={'ids': ids},
            headers={'Authorization': f'Bearer {user_token}'}
        )
        data = json.loads(resp.data)
        assert data['success'] is True