"""pytest  fixtures 配置"""
import pytest
from app import create_app
from app.extensions import db as _db
from app.config import TestConfig
from app.models import User
from werkzeug.security import generate_password_hash
from flask_jwt_extended import create_access_token


@pytest.fixture
def app():
    """创建测试应用"""
    application = create_app(TestConfig)
    with application.app_context():
        _db.create_all()
        yield application
        _db.drop_all()


@pytest.fixture
def client(app):
    """测试客户端"""
    return app.test_client()


@pytest.fixture
def db(app):
    """数据库实例"""
    return _db


@pytest.fixture
def init_users(app):
    """初始化测试用户"""
    with app.app_context():
        admin = User(
            username='admin',
            password_hash=generate_password_hash('admin123'),
            email='admin@test.com',
            role='admin',
            status='active'
        )
        user = User(
            username='testuser',
            password_hash=generate_password_hash('test123'),
            email='test@test.com',
            role='user',
            status='active'
        )
        disabled_user = User(
            username='disabled',
            password_hash=generate_password_hash('123456'),
            email='disabled@test.com',
            role='user',
            status='disabled'
        )
        _db.session.add_all([admin, user, disabled_user])
        _db.session.commit()


@pytest.fixture
def admin_token(app, init_users):
    """管理员 JWT token"""
    with app.app_context():
        user = User.query.filter_by(username='admin').first()
        return create_access_token(identity=str(user.id))


@pytest.fixture
def user_token(app, init_users):
    """普通用户 JWT token"""
    with app.app_context():
        user = User.query.filter_by(username='testuser').first()
        return create_access_token(identity=str(user.id))


def auth_header(token):
    """生成认证请求头"""
    return {'Authorization': f'Bearer {token}'}