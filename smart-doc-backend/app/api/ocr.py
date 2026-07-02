"""OCR 识别 API"""
import os
import time
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from ..extensions import db
from ..models import User, History
from ..utils.log_helper import add_log
from app.config import Config

ocr_bp = Blueprint('ocr', __name__)

# 延迟加载 PaddleOCR（避免启动时加载）
_ocr_instance = None

def get_ocr():
    """获取 OCR 实例（单例模式）"""
    global _ocr_instance
    if _ocr_instance is None:
        from paddleocr import PaddleOCR
        _ocr_instance = PaddleOCR(use_angle_cls=True, lang='ch', show_log=False)
    return _ocr_instance


@ocr_bp.route('/recognize', methods=['POST'])
@jwt_required()
def recognize():
    """图片文字识别"""
    start_time = time.time()
    user_id = int(get_jwt_identity())
    user = db.session.get(User, user_id)
    
    # 检查文件
    if 'image' not in request.files:
        return {'success': False, 'message': '请上传图片'}, 400
    
    file = request.files['image']
    if file.filename == '':
        return {'success': False, 'message': '请选择图片'}, 400
    
    # 保存文件
    filename = secure_filename(file.filename)
    timestamp = int(time.time())
    saved_name = f"{timestamp}_{filename}"
    filepath = os.path.join(Config.UPLOAD_FOLDER, saved_name)
    file.save(filepath)
    
    try:
        # 调用 OCR
        ocr = get_ocr()
        result = ocr.ocr(filepath, cls=True)
        
        # 提取文字
        text = ''
        if result and result[0]:
            for line in result[0]:
                text += line[1][0] + '\n'
        text = text.strip()
        
        if not text:
            text = '未识别到文字'
        
        # 保存历史记录
        history = History(
            user_id=user_id,
            type='ocr',
            input_text=filename,
            output_text=text,
            created_at=None  # 自动使用默认值
        )
        db.session.add(history)
        db.session.commit()
        
        # 记录日志
        duration = int((time.time() - start_time) * 1000)
        add_log(
            user_id=user_id,
            username=user.username,
            action='OCR识别',
            module='ocr',
            ip=request.remote_addr,
            user_agent=request.headers.get('User-Agent', ''),
            duration=duration,
            status='success'
        )
        
        # 删除临时文件
        os.remove(filepath)
        
        return {
            'success': True,
            'text': text,
            'confidence': 0.95
        }
        
    except Exception as e:
        # 记录失败日志
        duration = int((time.time() - start_time) * 1000)
        add_log(
            user_id=user_id,
            username=user.username,
            action='OCR识别',
            module='ocr',
            ip=request.remote_addr,
            user_agent=request.headers.get('User-Agent', ''),
            duration=duration,
            status='failed'
        )
        return {'success': False, 'message': str(e)}, 500


@ocr_bp.route('/history', methods=['GET'])
@jwt_required()
def get_history():
    """获取 OCR 历史记录"""
    user_id = int(get_jwt_identity())
    page = request.args.get('page', 1, type=int)
    page_size = request.args.get('pageSize', 10, type=int)
    
    query = History.query.filter_by(user_id=user_id, type='ocr')
    pagination = query.order_by(History.created_at.desc()).paginate(page=page, per_page=page_size)
    
    return {
        'items': [h.to_dict() for h in pagination.items],
        'total': pagination.total,
        'page': page,
        'pageSize': page_size
    }


@ocr_bp.route('/record/<int:record_id>', methods=['DELETE'])
@jwt_required()
def delete_record(record_id):
    """删除 OCR 记录"""
    user_id = int(get_jwt_identity())
    record = History.query.filter_by(id=record_id, user_id=user_id, type='ocr').first()
    
    if not record:
        return {'success': False, 'message': '记录不存在'}, 404
    
    db.session.delete(record)
    db.session.commit()
    
    return {'success': True, 'message': '删除成功'}