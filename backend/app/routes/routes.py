# app/routes/routes.py
from flask import Blueprint, jsonify, session, request
from ..extensions import redis_client  # Import redis_client from extensions
from ..models import UserDB
from ..extensions import db

main_bp = Blueprint('main', __name__)

@main_bp.route('/home', methods=['GET'])
def home():
    print(session)
    user_id = session.get('user_id')
    if user_id:
        # Fetch user-specific data
        return jsonify({"message": f"Welcome back, user {user_id}!"}), 200
    else:
        return jsonify({"error": "User not logged in."}), 401


@main_bp.route('/userDB', methods=['POST'])
def save_user_db():
    data = request.json
    user_id = data.get('userID')
    db_name = data.get('dbName')
    username = data.get('username')
    password = data.get('password')

    new_entry = UserDB(user_id=user_id, db_name=db_name, username=username, password=password)

    db.session.add(new_entry)
    db.session.commit()

    return jsonify({"message": "Data saved successfully."}), 201

@main_bp.route('/getUserDB', methods=['GET'])
def get_user_dbs():
    user_id = session.get('user_id')  # Get user ID from Redis session
    print("USER ID: ", user_id)
    if not user_id:
        return jsonify({"error": "User not logged in."}), 401

    user_dbs = UserDB.query.filter_by(user_id=user_id).all()
    return jsonify([{
        'id': db.id,
        'db_name': db.db_name,
        'db_username': db.db_username
    } for db in user_dbs])


@main_bp.route("/test", methods=["GET"])
def test_redis():
    try:
        redis_client.ping()
        return {"message": "Connected to Redis!"}
    except Exception as e:
        return {"error": "Failed to connect to Redis."}, 500

@main_bp.route('/app', methods=['GET'])
def main():
    redis_client.set('key', 'Hello from Redis!')
    redis_value = redis_client.get('key').decode('utf-8')
    
    return jsonify({
        'message': 'Hello from Flask!',
        'redis_message': redis_value
    })
