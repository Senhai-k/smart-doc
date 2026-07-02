"""LLM 接口测试（mock 外部 API）"""
import json
from unittest.mock import patch


class MockDeepSeekResponse:
    """模拟 DeepSeek API 响应"""
    class Choice:
        class Message:
            content = "这是测试返回结果"
        def __init__(self):
            self.message = self.Message()

    def __init__(self):
        self.choices = [self.Choice()]


class TestLLM:
    """大模型接口测试"""

    @patch('app.api.llm.client.chat.completions.create')
    def test_summary_success(self, mock_create, client, user_token):
        """测试文本摘要"""
        mock_create.return_value = MockDeepSeekResponse()
        resp = client.post(
            '/api/llm/summary',
            json={'text': '这是一段测试文本'},
            headers={'Authorization': f'Bearer {user_token}'}
        )
        data = json.loads(resp.data)
        assert data['success'] is True
        assert 'result' in data

    def test_summary_no_auth(self, client):
        """测试未认证访问"""
        resp = client.post('/api/llm/summary', json={'text': 'test'})
        assert resp.status_code == 401

    def test_summary_empty_text(self, client, user_token):
        """测试空文本"""
        resp = client.post(
            '/api/llm/summary',
            json={'text': ''},
            headers={'Authorization': f'Bearer {user_token}'}
        )
        assert resp.status_code == 400

    @patch('app.api.llm.client.chat.completions.create')
    def test_sentiment_success(self, mock_create, client, user_token):
        """测试情感分析"""
        mock_create.return_value = MockDeepSeekResponse()
        resp = client.post(
            '/api/llm/sentiment',
            json={'text': '今天天气真好'},
            headers={'Authorization': f'Bearer {user_token}'}
        )
        data = json.loads(resp.data)
        assert data['success'] is True

    @patch('app.api.llm.client.chat.completions.create')
    def test_keywords_success(self, mock_create, client, user_token):
        """测试关键词提取"""
        mock_create.return_value = MockDeepSeekResponse()
        resp = client.post(
            '/api/llm/keywords',
            json={'text': '人工智能和机器学习是热门技术'},
            headers={'Authorization': f'Bearer {user_token}'}
        )
        data = json.loads(resp.data)
        assert data['success'] is True

    @patch('app.api.llm.client.chat.completions.create')
    def test_translate_success(self, mock_create, client, user_token):
        """测试翻译"""
        mock_create.return_value = MockDeepSeekResponse()
        resp = client.post(
            '/api/llm/translate',
            json={'text': '你好世界', 'targetLang': 'en'},
            headers={'Authorization': f'Bearer {user_token}'}
        )
        data = json.loads(resp.data)
        assert data['success'] is True