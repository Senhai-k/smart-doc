"""历史记录 API"""
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from ..extensions import db
from ..models import History

history_bp = Blueprint('history', __name__)


@history_bp.route('', methods=['GET'])
@jwt_required()
def get_history():
    """获取当前用户的历史记录"""
    user_id = int(get_jwt_identity())
    
    page = request.args.get('page', 1, type=int)
    page_size = request.args.get('pageSize', 10, type=int)
    type_filter = request.args.get('type', '')
    
    query = History.query.filter_by(user_id=user_id)
    
    if type_filter:
        query = query.filter(History.type == type_filter)
    
    pagination = query.order_by(History.created_at.desc()).paginate(page=page, per_page=page_size)
    
    return {
        'items': [h.to_dict() for h in pagination.items],
        'total': pagination.total,
        'page': page,
        'pageSize': page_size
    }


@history_bp.route('/<int:history_id>', methods=['DELETE'])
@jwt_required()
def delete_history(history_id):
    """删除单条历史记录"""
    user_id = int(get_jwt_identity())
    
    history = History.query.filter_by(id=history_id, user_id=user_id).first()
    if not history:
        return {'success': False, 'message': '记录不存在'}, 404
    
    db.session.delete(history)
    db.session.commit()
    
    return {'success': True, 'message': '删除成功'}


@history_bp.route('/batch-delete', methods=['POST'])
@jwt_required()
def batch_delete():
    """批量删除历史记录"""
    user_id = int(get_jwt_identity())
    data = request.get_json()
    ids = data.get('ids', [])
    
    if not ids:
        return {'success': False, 'message': '请选择要删除的记录'}, 400
    
    History.query.filter(History.id.in_(ids), History.user_id == user_id).delete(synchronize_session=False)
    db.session.commit()
    
    return {'success': True, 'message': f'成功删除 {len(ids)} 条记录'}


@history_bp.route('/clear', methods=['DELETE'])
@jwt_required()
def clear_all():
    """清空当前用户的所有历史记录"""
    user_id = int(get_jwt_identity())
    
    History.query.filter_by(user_id=user_id).delete()
    db.session.commit()
    
    return {'success': True, 'message': '已清空所有历史记录'}


@history_bp.route('', methods=['POST'])
@jwt_required()
def save_history():
    """保存历史记录（内部调用，不在前端直接使用）"""
    user_id = int(get_jwt_identity())
    data = request.get_json()
    
    history = History(
        user_id=user_id,
        type=data.get('type'),
        input_text=data.get('input'),
        output_text=data.get('output'),
        created_at=datetime.now()
    )
    
    db.session.add(history)
    db.session.commit()
    
    return {'success': True, 'id': history.id}