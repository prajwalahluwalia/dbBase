# app/models.py
from .extensions import db  # Import db from the extensions module
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'  # Explicitly define the table name
    
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    username = db.Column(db.String(150), nullable=False, unique=True)
    password = db.Column(db.String(200), nullable=False)  # Increased length for hashed passwords

    def __repr__(self):
        return f'<User {self.username}>'

class UserDB(db.Model):
    __tablename__ = 'userDB'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    db_name = db.Column(db.String(150), nullable=False)
    db_username = db.Column(db.String(150), nullable=False)
    db_password = db.Column(db.String(200), nullable=False)  # Hashed password recommended
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = db.Column(db.DateTime, nullable=True)

    def __repr__(self):
        return f'<UserDB {self.db_name}>'