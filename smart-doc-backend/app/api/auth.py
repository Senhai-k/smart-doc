"""认证相关 API（登录、注册）"""

from flask import request
from flask_restful import Api, Resource
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from datetime import datetime
from ..extensions import db
from ..models import User

# 创建 API 对象（用于后续可能的路由组织，这里主要用蓝图路由）
from flask import Blueprint

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    """
    用户注册
    请求体: { "username": "test", "password": "123456", "email": "test@example.com" }
    """
    data = request.get_json()
    
    # 参数校验
    if not data.get('username') or not data.get('password') or not data.get('email'):
        return {'success': False, 'message': '用户名、密码和邮箱不能为空'}, 400
    
    # 检查用户名是否已存在
    if User.query.filter_by(username=data['username']).first():
        return {'success': False, 'message': '用户名已存在'}, 400
    
    # 检查邮箱是否已存在
    if User.query.filter_by(email=data['email']).first():
        return {'success': False, 'message': '邮箱已被注册'}, 400
    
    # 创建新用户
    user = User(
        username=data['username'],
        password_hash=generate_password_hash(data['password']),
        email=data['email'],
        role='user',
        status='active',
        created_at=datetime.now()
    )
    
    db.session.add(user)
    db.session.commit()
    
    return {'success': True, 'message': '注册成功'}, 201


@auth_bp.route('/login', methods=['POST'])
def login():
    """
    用户登录
    请求体: { "username": "test", "password": "123456" }
    """
    data = request.get_json()
    
    if not data.get('username') or not data.get('password'):
        return {'success': False, 'message': '用户名和密码不能为空'}, 400
    
    # 查找用户
    user = User.query.filter_by(username=data['username']).first()
    
    if not user:
        return {'success': False, 'message': '用户名或密码错误'}, 401
    
    # 检查密码
    if not check_password_hash(user.password_hash, data['password']):
        return {'success': False, 'message': '用户名或密码错误'}, 401
    
    # 检查用户状态
    if user.status == 'disabled':
        return {'success': False, 'message': '账号已被禁用'}, 403
    
    # 更新最后登录时间
    user.last_login_at = datetime.now()
    db.session.commit()
    
    # 生成 JWT Token
    access_token = create_access_token(identity=str(user.id))
    
    return {
        'success': True,
        'token': access_token,
        'user': user.to_dict()
    }, 200


@auth_bp.route('/me', methods=['GET'])
def get_current_user():
    """
    获取当前登录用户信息（需要 JWT Token）
    """
    from flask_jwt_extended import jwt_required, get_jwt_identity
    
    # 这个接口需要添加认证装饰器，稍后统一处理
    # 暂时先用简单实现
    return {'message': '需要认证'}, 401