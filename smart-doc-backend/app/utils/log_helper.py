"""日志辅助工具"""
from ..extensions import db
from ..models import OperationLog
from datetime import datetime


def add_log(user_id, username, action, module, ip, user_agent, duration, status):
    """添加操作日志"""
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
    return log