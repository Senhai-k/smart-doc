import traceback
from flask import Flask, jsonify
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
    
    # ----- 全局异常处理 -----
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({'success': False, 'message': '请求参数错误', 'code': 400}), 400

    @app.errorhandler(401)
    def unauthorized(error):
        return jsonify({'success': False, 'message': '未授权，请先登录', 'code': 401}), 401

    @app.errorhandler(403)
    def forbidden(error):
        return jsonify({'success': False, 'message': '权限不足', 'code': 403}), 403

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'success': False, 'message': '请求的资源不存在', 'code': 404}), 404

    @app.errorhandler(405)
    def method_not_allowed(error):
        return jsonify({'success': False, 'message': '请求方法不允许', 'code': 405}), 405

    @app.errorhandler(500)
    def internal_error(error):
        traceback.print_exc()
        return jsonify({'success': False, 'message': '服务器内部错误', 'code': 500}), 500

    # ----- 全局健康检查 -----
    @app.route('/api/health')
    def health_check():
        return jsonify({'status': 'ok', 'message': '智档馆服务运行中'})

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