from app import create_app
from app.extensions import db
from app.models import User
from werkzeug.security import generate_password_hash

app = create_app()

with app.app_context():
    admin = User.query.filter_by(username='admin').first()
    if not admin:
        admin = User(
            username='admin',
            password_hash=generate_password_hash('admin123'),
            email='admin@example.com',
            role='admin',
            status='active'
        )
        db.session.add(admin)
        print("Admin added")
    
    test = User.query.filter_by(username='test').first()
    if not test:
        test = User(
            username='test',
            password_hash=generate_password_hash('test123'),
            email='test@example.com',
            role='user',
            status='active'
        )
        db.session.add(test)
        print("Test user added")
    
    db.session.commit()
    print("Done! Login with: admin / admin123")