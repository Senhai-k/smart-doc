"""仪表盘统计 API"""
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta
from sqlalchemy import func
from ..extensions import db
from ..models import User, History, OperationLog

dashboard_bp = Blueprint('dashboard', __name__)


@dashboard_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    """获取仪表盘统计数据"""
    user_id = int(get_jwt_identity())
    current_user = db.session.get(User, user_id)
    
    # 总用户数
    if current_user.role == 'admin':
        total_users = User.query.count()
    else:
        total_users = User.query.count()
    
    # 总操作次数
    total_operations = History.query.count()
    
    # 今日操作次数
    today = datetime.now().date()
    today_start = datetime(today.year, today.month, today.day)
    today_operations = History.query.filter(History.created_at >= today_start).count()
    
    # 各功能使用次数
    usage_by_type = {}
    types = ['ocr', 'summary', 'sentiment', 'keywords', 'translate', 'meeting_extract']
    for t in types:
        count = History.query.filter_by(type=t).count()
        if count > 0:
            usage_by_type[t] = count
    
    # 近7天使用趋势
    daily_trend = []
    for i in range(6, -1, -1):
        date = today - timedelta(days=i)
        date_start = datetime(date.year, date.month, date.day)
        date_end = date_start + timedelta(days=1)
        count = History.query.filter(
            History.created_at >= date_start,
            History.created_at < date_end
        ).count()
        daily_trend.append({
            'date': f"{date.month}月{date.day}日",
            'count': count
        })
    
    # 最近活动（从操作日志获取）
    recent_logs = OperationLog.query.order_by(OperationLog.created_at.desc()).limit(5).all()
    recent_activities = [
        {
            'id': log.id,
            'username': log.username,
            'action': log.action,
            'time': log.created_at.strftime('%Y-%m-%d %H:%M:%S')
        }
        for log in recent_logs
    ]
    
    # 如果没有操作日志，显示提示
    if not recent_activities:
        recent_activities = [
            {'id': 0, 'username': '系统', 'action': '暂无馆务记录', 'time': datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
        ]
    
    return {
        'totalUsers': total_users,
        'totalOperations': total_operations,
        'todayOperations': today_operations,
        'usageByType': usage_by_type,
        'dailyTrend': daily_trend,
        'recentActivities': recent_activities
    }


@dashboard_bp.route('/trend', methods=['GET'])
@jwt_required()
def get_trend():
    """获取使用趋势"""
    days = request.args.get('days', 7, type=int)
    today = datetime.now().date()
    
    trend = []
    for i in range(days - 1, -1, -1):
        date = today - timedelta(days=i)
        date_start = datetime(date.year, date.month, date.day)
        date_end = date_start + timedelta(days=1)
        count = History.query.filter(
            History.created_at >= date_start,
            History.created_at < date_end
        ).count()
        trend.append({
            'date': date.strftime('%Y-%m-%d'),
            'count': count
        })
    
    return {'trend': trend}


@dashboard_bp.route('/distribution', methods=['GET'])
@jwt_required()
def get_distribution():
    """获取功能使用分布"""
    results = db.session.query(
        History.type,
        func.count(History.id).label('count')
    ).group_by(History.type).all()
    
    distribution = []
    type_names = {
        'ocr': 'OCR识别',
        'summary': '智能总结',
        'sentiment': '情感分析',
        'keywords': '关键词提取',
        'translate': '文本翻译',
        'meeting_extract': '会议纪要'
    }
    
    for r in results:
        distribution.append({
            'name': type_names.get(r.type, r.type),
            'value': r.count
        })
    
    return {'distribution': distribution}