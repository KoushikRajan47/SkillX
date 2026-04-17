"""
Authentication routes
Handles user registration and login
"""
from flask import Blueprint, request, jsonify
from database.db import get_db
from bson.objectid import ObjectId
import hashlib

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

def hash_password(password):
    """Simple password hashing (use bcrypt in production)"""
    return hashlib.sha256(password.encode()).hexdigest()

@auth_bp.route('/register', methods=['POST'])
def register():
    """
    Register a new user
    Expected JSON: {
        "username": "string",
        "email": "string",
        "password": "string",
        "full_name": "string"
    }
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['username', 'email', 'password', 'full_name']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        db = get_db()
        
        # Check if user already exists
        if db.users.find_one({'username': data['username']}):
            return jsonify({'error': 'Username already exists'}), 400
        
        if db.users.find_one({'email': data['email']}):
            return jsonify({'error': 'Email already exists'}), 400
        
        # Create new user
        new_user = {
            'username': data['username'],
            'email': data['email'],
            'password': hash_password(data['password']),
            'full_name': data['full_name'],
            'skills': [],
            'created_at': str(__import__('datetime').datetime.now())
        }
        
        result = db.users.insert_one(new_user)
        
        return jsonify({
            'success': True,
            'message': 'User registered successfully',
            'user_id': str(result.inserted_id)
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Login user
    Expected JSON: {
        "username": "string",
        "password": "string"
    }
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        if 'email' not in data or 'password' not in data:
            return jsonify({'error': 'Email and password required'}), 400
        
        db = get_db()
        
        # Find user by email (or username as fallback if we provided it)
        user = db.users.find_one({'email': data['email']})
        
        if not user:
            # Fallback to username check as well
            user = db.users.find_one({'username': data['email']})
            if not user:
                return jsonify({'error': 'User not found'}), 404
        
        # Check password
        if user['password'] != hash_password(data['password']):
            return jsonify({'error': 'Invalid password'}), 401
        
        # Return user info (without password)
        return jsonify({
            'success': True,
            'user_id': str(user['_id']),
            'username': user['username'],
            'email': user['email'],
            'full_name': user['full_name'],
            'skills': user.get('skills', [])
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/user/<username>', methods=['GET'])
def get_user(username):
    """Get user profile by username"""
    try:
        db = get_db()
        user = db.users.find_one({'username': username})
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'user_id': str(user['_id']),
            'username': user['username'],
            'email': user['email'],
            'full_name': user['full_name'],
            'skills': user.get('skills', []),
            'created_at': user.get('created_at', '')
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
