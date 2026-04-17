"""
Exchange routes
Handles skill exchange requests and management
"""
from flask import Blueprint, request, jsonify
from database.db import get_db
from bson.objectid import ObjectId

exchange_bp = Blueprint('exchange', __name__, url_prefix='/exchange')

@exchange_bp.route('/request', methods=['POST'])
def request_exchange():
    """
    Create a skill exchange request
    Expected JSON: {
        "requester": "username",
        "skill_offered": "string",
        "skill_requested": "string"
    }
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['requester', 'skill_offered', 'skill_requested']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        db = get_db()
        
        # Create new exchange request
        new_exchange = {
            'requester': data['requester'],
            'skill_offered': data['skill_offered'],
            'skill_requested': data['skill_requested'],
            'status': 'pending',
            'created_at': str(__import__('datetime').datetime.now())
        }
        
        result = db.exchanges.insert_one(new_exchange)
        
        return jsonify({
            'success': True,
            'message': 'Exchange request created successfully',
            'exchange_id': str(result.inserted_id)
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@exchange_bp.route('/accept', methods=['POST'])
def accept_exchange():
    """
    Accept a skill exchange request
    Expected JSON: {
        "exchange_id": "string",
        "acceptor": "username"
    }
    """
    try:
        data = request.get_json()
        
        if 'exchange_id' not in data or 'acceptor' not in data:
            return jsonify({'error': 'Missing exchange_id or acceptor'}), 400
        
        db = get_db()
        
        # Find exchange
        exchange = db.exchanges.find_one({'_id': ObjectId(data['exchange_id'])})
        
        if not exchange:
            return jsonify({'error': 'Exchange not found'}), 404
        
        if exchange['status'] != 'pending':
            return jsonify({'error': 'Exchange is not in pending status'}), 400
        
        # Update exchange status to accepted
        db.exchanges.update_one(
            {'_id': ObjectId(data['exchange_id'])},
            {'$set': {'status': 'accepted', 'acceptor': data['acceptor']}}
        )
        
        return jsonify({
            'success': True,
            'message': 'Exchange accepted successfully'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@exchange_bp.route('/all', methods=['GET'])
def get_all_exchanges():
    """Get all skill exchanges"""
    try:
        db = get_db()
        
        # Get all exchanges
        exchanges = list(db.exchanges.find().sort('created_at', -1))
        
        # Convert ObjectId to string
        for exchange in exchanges:
            exchange['_id'] = str(exchange['_id'])
        
        return jsonify({
            'success': True,
            'count': len(exchanges),
            'exchanges': exchanges
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@exchange_bp.route('/pending', methods=['GET'])
def get_pending_exchanges():
    """Get all pending exchanges"""
    try:
        db = get_db()
        
        # Get pending exchanges
        exchanges = list(db.exchanges.find({'status': 'pending'}).sort('created_at', -1))
        
        # Convert ObjectId to string
        for exchange in exchanges:
            exchange['_id'] = str(exchange['_id'])
        
        return jsonify({
            'success': True,
            'count': len(exchanges),
            'exchanges': exchanges
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@exchange_bp.route('/user/<username>', methods=['GET'])
def get_user_exchanges(username):
    """Get all exchanges for a specific user"""
    try:
        db = get_db()
        
        # Get exchanges where user is requester
        exchanges = list(db.exchanges.find({'requester': username}).sort('created_at', -1))
        
        # Convert ObjectId to string
        for exchange in exchanges:
            exchange['_id'] = str(exchange['_id'])
        
        return jsonify({
            'success': True,
            'count': len(exchanges),
            'user': username,
            'exchanges': exchanges
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
