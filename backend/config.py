import os

class Config:
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:aassddaa@localhost:3306/ridendropapp'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    REDIS_URL = os.environ.get('REDIS_URL') or 'redis://redis:6379/0'
    SECRET_KEY = os.urandom(32).hex()