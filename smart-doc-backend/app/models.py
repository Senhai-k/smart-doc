"""数据库模型定义"""

from datetime import datetime
from .extensions import db


class User(db.Model):
    """用户表"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    role = db.Column(db.Enum('admin', 'user'), default='user')
    status = db.Column(db.Enum('active', 'disabled'), default='active')
    created_at = db.Column(db.DateTime, default=datetime.now)
    last_login_at = db.Column(db.DateTime)
    
    # 关联关系
    histories = db.relationship('History', backref='user', lazy='dynamic')
    logs = db.relationship('OperationLog', backref='user', lazy='dynamic')
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'status': self.status,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'lastLoginAt': self.last_login_at.isoformat() if self.last_login_at else None
        }


class History(db.Model):
    """历史记录表"""
    __tablename__ = 'histories'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    type = db.Column(db.Enum('ocr', 'summary', 'sentiment', 'keywords', 'translate', 'meeting_extract'), nullable=False)
    input_text = db.Column(db.Text, nullable=False)
    output_text = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now)
    
    def to_dict(self):
        return {
            'id': self.id,
            'userId': self.user_id,
            'type': self.type,
            'input': self.input_text,
            'output': self.output_text,
            'createdAt': self.created_at.isoformat() if self.created_at else None
        }


class OperationLog(db.Model):
    """操作日志表"""
    __tablename__ = 'operation_logs'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    username = db.Column(db.String(50), nullable=False)
    action = db.Column(db.String(100), nullable=False)
    module = db.Column(db.String(50), nullable=False)
    ip = db.Column(db.String(45))
    user_agent = db.Column(db.String(500))
    duration = db.Column(db.Integer)  # 毫秒
    status = db.Column(db.Enum('success', 'failed'), default='success')
    created_at = db.Column(db.DateTime, default=datetime.now)
    
    def to_dict(self):
        return {
            'id': self.id,
            'userId': self.user_id,
            'username': self.username,
            'action': self.action,
            'module': self.module,
            'ip': self.ip,
            'userAgent': self.user_agent,
            'duration': self.duration,
            'status': self.status,
            'createdAt': self.created_at.isoformat() if self.created_at else None
        }