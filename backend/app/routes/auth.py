from flask import Blueprint, request, jsonify, session
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from ..models import User
from ..extensions import db, bcrypt  # Importing from extensions

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data['username']
    password = data['password']

    print("DATA:", data, username, password)
    user = User.query.filter_by(username=username).first()
    if user and bcrypt.check_password_hash(user.password, password):
        # Create JWT token
        access_token = create_access_token(identity=user.id)
        session['logged_in'] = True
        session['username'] = username
        
        print(session)
        return jsonify({"token": access_token, "username": user.username}), 200
    return jsonify({"error": "Invalid username or password."}), 401

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    user = User(username=username, password=hashed_password)

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already taken."}), 400

    db.session.add(user)
    db.session.commit()
    access_token = create_access_token(identity=user.id)
    session['logged_in'] = True
    session['username'] = username
    return jsonify({"access_token":access_token, "message": "User created successfully."}), 201

@auth_bp.route('/protected', methods=['GET'])
@jwt_required()  # Require JWT for this route
def protected():
    current_user_id = get_jwt_identity()  # Get the user identity from the token
    user = User.query.get(current_user_id)
    return jsonify(logged_in_as=user.username), 200


@auth_bp.route('/current_user', methods=['GET'])
@jwt_required()  # Protected by JWT
def current_user():
    print(session)
    return jsonify({"username": session.get('username')}), 200
