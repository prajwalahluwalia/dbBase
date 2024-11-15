# app/extensions.py
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from redis import Redis
from flask_jwt_extended import JWTManager


db = SQLAlchemy()
bcrypt = Bcrypt()
redis_client = Redis.from_url('redis://localhost:6379/0')  # Modify as needed
jwt = JWTManager()