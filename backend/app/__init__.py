from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from redis import Redis
import os
from config import Config  # Adjusted for relative import

db = SQLAlchemy()
redis_client = Redis.from_url(os.environ.get('REDIS_URL') or 'redis://redis:6379/0')

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)

    db.init_app(app)
    
    with app.app_context():
        from . import routes  # Use relative import
        db.create_all()

    return app
