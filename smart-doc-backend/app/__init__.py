from flask import Flask
from .config import Config
from .extensions import db, migrate, jwt, cors

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # 设置 CORS - 允许所有来源
    cors.init_app(app, resources={
        r"/*": {
            "origins": "*",
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "expose_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })
    
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    
    # 注册蓝图
    from .api.auth import auth_bp
    from .api.ocr import ocr_bp
    from .api.llm import llm_bp
    from .api.history import history_bp
    from .api.user import user_bp
    from .api.log import log_bp
    from .api.dashboard import dashboard_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(ocr_bp, url_prefix='/api/ocr')
    app.register_blueprint(llm_bp, url_prefix='/api/llm')
    app.register_blueprint(history_bp, url_prefix='/api/history')
    app.register_blueprint(user_bp, url_prefix='/api/users')
    app.register_blueprint(log_bp, url_prefix='/api/logs')
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
    
    return app