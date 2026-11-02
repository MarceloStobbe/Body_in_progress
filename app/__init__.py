import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def create_app(test_config=None):
    app = Flask(__name__)
    
    app.config.setdefault('SECRET_KEY', 'body-in-progress-elite-secure-key')
    
    database_url = os.environ.get('DATABASE_URL')
    if database_url and database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://", 1)
        
    app.config.setdefault('SQLALCHEMY_DATABASE_URI', database_url or 'sqlite:///body_in_progress.db')
    app.config.setdefault('SQLALCHEMY_TRACK_MODIFICATIONS', False)

    if test_config:
        app.config.update(test_config)

    db.init_app(app)

    from app.routes import main_bp
    app.register_blueprint(main_bp)

    return app