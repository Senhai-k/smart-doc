"""大模型 API（DeepSeek）"""
import os
import tempfile
import json
import time
from flask import Blueprint, request, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from openai import OpenAI
from ..extensions import db
from ..models import User, History
from ..utils.log_helper import add_log
from app.config import Config

llm_bp = Blueprint('llm', __name__)

client = OpenAI(
    api_key=Config.DEEPSEEK_API_KEY,
    base_url=Config.DEEPSEEK_BASE_URL
)


@llm_bp.route('/summary', methods=['POST'])
@jwt_required()
def summary():
    start_time = time.time()
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    
    data = request.get_json()
    if not data:
        return {'success': False, 'message': '请求数据格式错误'}, 400
    
    text = data.get('text', '')
    if not text:
        return {'success': False, 'message': '请输入文本'}, 400
    
    try:
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": "你是一个专业的文本总结助手，请简洁准确地总结用户输入的内容，用100字以内。"},
                {"role": "user", "content": text}
            ],
            temperature=0.7
        )
        result = response.choices[0].message.content
        
        # 保存历史
        history = History(
            user_id=user_id,
            type='summary',
            input_text=text,
            output_text=result
        )
        db.session.add(history)
        db.session.commit()
        
        return {'success': True, 'result': result}
    except Exception as e:
        print(f"Error: {e}")
        return {'success': False, 'message': str(e)}, 500


@llm_bp.route('/sentiment', methods=['POST'])
@jwt_required()
def sentiment():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    
    data = request.get_json()
    if not data:
        return {'success': False, 'message': '请求数据格式错误'}, 400
    
    text = data.get('text', '')
    if not text:
        return {'success': False, 'message': '请输入文本'}, 400
    
    try:
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": "分析文本的情感倾向，只回答：正面、负面或中性。"},
                {"role": "user", "content": text}
            ]
        )
        result = response.choices[0].message.content
        
        history = History(
            user_id=user_id,
            type='sentiment',
            input_text=text,
            output_text=result
        )
        db.session.add(history)
        db.session.commit()
        
        return {'success': True, 'result': result}
    except Exception as e:
        print(f"Error: {e}")
        return {'success': False, 'message': str(e)}, 500


@llm_bp.route('/keywords', methods=['POST'])
@jwt_required()
def keywords():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    
    data = request.get_json()
    if not data:
        return {'success': False, 'message': '请求数据格式错误'}, 400
    
    text = data.get('text', '')
    if not text:
        return {'success': False, 'message': '请输入文本'}, 400
    
    try:
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": "从文本中提取5个最重要的关键词，用逗号分隔，只返回关键词。"},
                {"role": "user", "content": text}
            ]
        )
        result = response.choices[0].message.content
        
        history = History(
            user_id=user_id,
            type='keywords',
            input_text=text,
            output_text=result
        )
        db.session.add(history)
        db.session.commit()
        
        return {'success': True, 'result': result}
    except Exception as e:
        print(f"Error: {e}")
        return {'success': False, 'message': str(e)}, 500


@llm_bp.route('/translate', methods=['POST'])
@jwt_required()
def translate():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    
    data = request.get_json()
    if not data:
        return {'success': False, 'message': '请求数据格式错误'}, 400
    
    text = data.get('text', '')
    target_lang = data.get('targetLang', 'en')
    
    lang_map = {'en': '英语', 'ja': '日语', 'ko': '韩语', 'fr': '法语', 'de': '德语', 'ru': '俄语'}
    lang_name = lang_map.get(target_lang, target_lang)
    
    if not text:
        return {'success': False, 'message': '请输入文本'}, 400
    
    try:
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": f"将以下文本翻译成{lang_name}，只返回翻译结果。"},
                {"role": "user", "content": text}
            ]
        )
        result = response.choices[0].message.content
        
        history = History(
            user_id=user_id,
            type='translate',
            input_text=text,
            output_text=result
        )
        db.session.add(history)
        db.session.commit()
        
        return {'success': True, 'result': result}
    except Exception as e:
        print(f"Error: {e}")
        return {'success': False, 'message': str(e)}, 500
    
@llm_bp.route('/batch/meeting', methods=['POST'])
@jwt_required()
def batch_process_meetings():
    """批量处理会议纪要文件"""
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    
    if 'files' not in request.files:
        return {'success': False, 'message': '请上传文件'}, 400
    
    files = request.files.getlist('files')
    if not files:
        return {'success': False, 'message': '请选择文件'}, 400
    
    results = []
    for file in files:
        filename = secure_filename(file.filename)
        ext = filename.split('.')[-1].lower()
        
        # 保存临时文件
        temp_path = os.path.join(tempfile.gettempdir(), filename)
        file.save(temp_path)
        
        try:
            # 解析文档
            from app.services.document_parser import parse_document
            text = parse_document(temp_path, filename)
            
            if text is None:
                # 图片类型，跳过或走OCR
                results.append({
                    'filename': filename,
                    'error': '图片文件请使用 OCR 功能',
                    'structured': None
                })
                continue
            
            # 抽取会议纪要结构化信息
            from app.services.meeting_extractor import extract_meeting_info
            structured = extract_meeting_info(text)
            
            # 保存到历史记录
            history = History(
                user_id=user_id,
                type='meeting_extract',
                input_text=text[:500],
                output_text=json.dumps(structured, ensure_ascii=False)
            )
            db.session.add(history)
            db.session.commit()
            
            results.append({
                'filename': filename,
                'structured': structured,
                'error': None
            })
            
        except Exception as e:
            results.append({
                'filename': filename,
                'error': str(e),
                'structured': None
            })
        finally:
            # 删除临时文件
            if os.path.exists(temp_path):
                os.remove(temp_path)
    
    db.session.commit()
    
    return {
        'success': True,
        'results': results,
        'total': len(results),
        'export_url': '/api/llm/export/meeting'
    }


@llm_bp.route('/export/meeting', methods=['POST'])
@jwt_required()
def export_meeting_results():
    """导出会议纪要结果为 Excel"""
    user_id = int(get_jwt_identity())
    data = request.get_json()
    results = data.get('results', [])
    
    import pandas as pd
    from io import BytesIO
    
    rows = []
    for r in results:
        structured = r.get('structured', {})
        if structured:
            # 展平 action_items
            action_items_str = "; ".join([
                f"{item.get('task', '')}（{item.get('assignee', '')}，{item.get('deadline', '')}）"
                for item in structured.get('action_items', [])
            ])
            rows.append({
                '文件名': r['filename'],
                '会议主题': structured.get('meeting_topic', ''),
                '会议日期': structured.get('date', ''),
                '参会人': ', '.join(structured.get('attendees', [])),
                '结论': structured.get('conclusion', ''),
                '待办事项': action_items_str,
                '错误': r.get('error', '')
            })
        else:
            rows.append({
                '文件名': r['filename'],
                '错误': r.get('error', '解析失败')
            })
    
    df = pd.DataFrame(rows)
    output = BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        df.to_excel(writer, index=False, sheet_name='会议纪要')
    
    output.seek(0)
    
    from flask import send_file
    return send_file(
        output,
        as_attachment=True,
        download_name='meeting_summary.xlsx',
        mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )