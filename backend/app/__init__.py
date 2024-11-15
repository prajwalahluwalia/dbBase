# app/__init__.py
import os
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_session import Session
from redis import Redis
from config import Config
from .routes.auth import auth_bp
from .routes.routes import main_bp
from .extensions import db, bcrypt, redis_client, jwt
from datetime import timedelta

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

app.config['SESSION_TYPE'] = 'redis'
app.config['SESSION_PERMANENT'] = True
app.config['SESSION_USE_SIGNER'] = True
app.config['SESSION_KEY_PREFIX'] = 'session:'
app.config['SESSION_REDIS'] = redis_client
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=1)

Session(app)

db.init_app(app)
bcrypt.init_app(app)
jwt.init_app(app)


with app.app_context():
    db.create_all()

app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(main_bp, url_prefix='/api')

if __name__ == '__main__':
    app.run(debug=True)
