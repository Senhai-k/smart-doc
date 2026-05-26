"""用户管理 API"""
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash
from datetime import datetime
from ..extensions import db
from ..models import User

user_bp = Blueprint('user', __name__)


@user_bp.route('', methods=['GET'])
@jwt_required()
def get_users():
    """获取用户列表"""
    current_user_id = int(get_jwt_identity())
    current_user = User.query.get(current_user_id)
    
    # 只有管理员可以查看所有用户
    if current_user.role != 'admin':
        return {'success': False, 'message': '权限不足'}, 403
    
    page = request.args.get('page', 1, type=int)
    page_size = request.args.get('pageSize', 10, type=int)
    keyword = request.args.get('keyword', '')
    role_filter = request.args.get('role', '')
    
    query = User.query
    
    if keyword:
        query = query.filter(
            (User.username.like(f'%{keyword}%')) | 
            (User.email.like(f'%{keyword}%'))
        )
    
    if role_filter:
        query = query.filter(User.role == role_filter)
    
    pagination = query.order_by(User.id.desc()).paginate(page=page, per_page=page_size)
    
    return {
        'items': [u.to_dict() for u in pagination.items],
        'total': pagination.total,
        'page': page,
        'pageSize': page_size
    }


@user_bp.route('', methods=['POST'])
@jwt_required()
def create_user():
    """创建用户"""
    current_user_id = int(get_jwt_identity())
    current_user = User.query.get(current_user_id)
    
    if current_user.role != 'admin':
        return {'success': False, 'message': '权限不足'}, 403
    
    data = request.get_json()
    
    if not data.get('username') or not data.get('password') or not data.get('email'):
        return {'success': False, 'message': '用户名、密码和邮箱不能为空'}, 400
    
    if User.query.filter_by(username=data['username']).first():
        return {'success': False, 'message': '用户名已存在'}, 400
    
    if User.query.filter_by(email=data['email']).first():
        return {'success': False, 'message': '邮箱已被注册'}, 400
    
    user = User(
        username=data['username'],
        password_hash=generate_password_hash(data['password']),
        email=data['email'],
        role=data.get('role', 'user'),
        status=data.get('status', 'active'),
        created_at=datetime.now()
    )
    
    db.session.add(user)
    db.session.commit()
    
    return {'success': True, 'user': user.to_dict()}, 201


@user_bp.route('/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    """更新用户信息"""
    current_user_id = int(get_jwt_identity())
    current_user = User.query.get(current_user_id)
    
    if current_user.role != 'admin' and current_user.id != user_id:
        return {'success': False, 'message': '权限不足'}, 403
    
    user = User.query.get(user_id)
    if not user:
        return {'success': False, 'message': '用户不存在'}, 404
    
    data = request.get_json()
    
    if 'username' in data:
        existing = User.query.filter_by(username=data['username']).first()
        if existing and existing.id != user_id:
            return {'success': False, 'message': '用户名已存在'}, 400
        user.username = data['username']
    
    if 'email' in data:
        existing = User.query.filter_by(email=data['email']).first()
        if existing and existing.id != user_id:
            return {'success': False, 'message': '邮箱已被注册'}, 400
        user.email = data['email']
    
    if 'role' in data and current_user.role == 'admin':
        user.role = data['role']
    
    if 'status' in data and current_user.role == 'admin':
        user.status = data['status']
    
    db.session.commit()
    
    return {'success': True, 'user': user.to_dict()}


@user_bp.route('/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    """删除用户"""
    current_user_id = int(get_jwt_identity())
    current_user = User.query.get(current_user_id)
    
    if current_user.role != 'admin':
        return {'success': False, 'message': '权限不足'}, 403
    
    if current_user.id == user_id:
        return {'success': False, 'message': '不能删除自己'}, 400
    
    user = User.query.get(user_id)
    if not user:
        return {'success': False, 'message': '用户不存在'}, 404
    
    db.session.delete(user)
    db.session.commit()
    
    return {'success': True, 'message': '删除成功'}


@user_bp.route('/<int:user_id>/reset-password', methods=['POST'])
@jwt_required()
def reset_password(user_id):
    """重置密码"""
    current_user_id = int(get_jwt_identity())
    current_user = User.query.get(current_user_id)
    
    if current_user.role != 'admin':
        return {'success': False, 'message': '权限不足'}, 403
    
    user = User.query.get(user_id)
    if not user:
        return {'success': False, 'message': '用户不存在'}, 404
    
    data = request.get_json()
    new_password = data.get('password', '')
    
    if len(new_password) < 6:
        return {'success': False, 'message': '密码至少6位'}, 400
    
    user.password_hash = generate_password_hash(new_password)
    db.session.commit()
    
    return {'success': True, 'message': '密码重置成功'}