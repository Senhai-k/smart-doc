"""操作日志 API"""
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from ..extensions import db
from ..models import OperationLog, User

log_bp = Blueprint('log', __name__)


@log_bp.route('', methods=['GET'])
@jwt_required()
def get_logs():
    """获取操作日志列表（仅管理员）"""
    current_user_id = int(get_jwt_identity())
    current_user = User.query.get(current_user_id)
    
    if current_user.role != 'admin':
        return {'success': False, 'message': '权限不足'}, 403
    
    page = request.args.get('page', 1, type=int)
    page_size = request.args.get('pageSize', 10, type=int)
    module_filter = request.args.get('module', '')
    status_filter = request.args.get('status', '')
    keyword = request.args.get('keyword', '')
    
    query = OperationLog.query
    
    if module_filter:
        query = query.filter(OperationLog.module == module_filter)
    
    if status_filter:
        query = query.filter(OperationLog.status == status_filter)
    
    if keyword:
        query = query.filter(
            (OperationLog.username.like(f'%{keyword}%')) |
            (OperationLog.action.like(f'%{keyword}%'))
        )
    
    pagination = query.order_by(OperationLog.created_at.desc()).paginate(page=page, per_page=page_size)
    
    return {
        'items': [log.to_dict() for log in pagination.items],
        'total': pagination.total,
        'page': page,
        'pageSize': page_size
    }


@log_bp.route('/stats/modules', methods=['GET'])
@jwt_required()
def get_module_stats():
    """获取模块统计"""
    current_user_id = int(get_jwt_identity())
    current_user = User.query.get(current_user_id)
    
    if current_user.role != 'admin':
        return {'success': False, 'message': '权限不足'}, 403
    
    from sqlalchemy import func
    results = db.session.query(
        OperationLog.module,
        func.count(OperationLog.id).label('count')
    ).group_by(OperationLog.module).all()
    
    return [{'module': r[0], 'count': r[1]} for r in results]


@log_bp.route('/stats/today', methods=['GET'])
@jwt_required()
def get_today_stats():
    """获取今日统计"""
    current_user_id = int(get_jwt_identity())
    current_user = User.query.get(current_user_id)
    
    if current_user.role != 'admin':
        return {'success': False, 'message': '权限不足'}, 403
    
    today = datetime.now().date()
    today_start = datetime(today.year, today.month, today.day)
    
    total = OperationLog.query.filter(OperationLog.created_at >= today_start).count()
    success = OperationLog.query.filter(
        OperationLog.created_at >= today_start,
        OperationLog.status == 'success'
    ).count()
    failed = OperationLog.query.filter(
        OperationLog.created_at >= today_start,
        OperationLog.status == 'failed'
    ).count()
    
    return {'total': total, 'success': success, 'failed': failed}


@log_bp.route('/batch-delete', methods=['POST'])
@jwt_required()
def batch_delete():
    """批量删除日志"""
    current_user_id = int(get_jwt_identity())
    current_user = User.query.get(current_user_id)
    
    if current_user.role != 'admin':
        return {'success': False, 'message': '权限不足'}, 403
    
    data = request.get_json()
    ids = data.get('ids', [])
    
    if not ids:
        return {'success': False, 'message': '请选择要删除的日志'}, 400
    
    OperationLog.query.filter(OperationLog.id.in_(ids)).delete(synchronize_session=False)
    db.session.commit()
    
    return {'success': True, 'message': f'成功删除 {len(ids)} 条日志'}


@log_bp.route('/clear', methods=['DELETE'])
@jwt_required()
def clear_all():
    """清空所有日志"""
    current_user_id = int(get_jwt_identity())
    current_user = User.query.get(current_user_id)
    
    if current_user.role != 'admin':
        return {'success': False, 'message': '权限不足'}, 403
    
    OperationLog.query.delete()
    db.session.commit()
    
    return {'success': True, 'message': '已清空所有日志'}


def add_log(user_id, username, action, module, ip, user_agent, duration, status):
    """添加操作日志（内部调用）"""
    log = OperationLog(
        user_id=user_id,
        username=username,
        action=action,
        module=module,
        ip=ip,
        user_agent=user_agent,
        duration=duration,
        status=status,
        created_at=datetime.now()
    )
    db.session.add(log)
    db.session.commit()