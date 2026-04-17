"""
Skills routes
Handles skill management and retrieval
"""
from flask import Blueprint, request, jsonify
from database.db import get_db
from bson.objectid import ObjectId

skills_bp = Blueprint('skills', __name__, url_prefix='/skills')

@skills_bp.route('/add', methods=['POST'])
def add_skill():
    """
    Add a new skill
    Expected JSON: {
        "name": "string",
        "category": "string",
        "difficulty": "string",
        "description": "string",
        "added_by": "username"
    }
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'category', 'difficulty', 'description', 'added_by']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        db = get_db()
        
        # Check if skill already exists
        if db.skills.find_one({'name': data['name']}):
            return jsonify({'error': 'Skill already exists'}), 400
        
        # Create new skill
        new_skill = {
            'name': data['name'],
            'category': data['category'],
            'difficulty': data['difficulty'],
            'description': data['description'],
            'added_by': data['added_by'],
            'created_at': str(__import__('datetime').datetime.now())
        }
        
        result = db.skills.insert_one(new_skill)
        
        return jsonify({
            'success': True,
            'message': 'Skill added successfully',
            'skill_id': str(result.inserted_id)
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@skills_bp.route('/all', methods=['GET'])
def get_all_skills():
    """Get all available skills"""
    try:
        db = get_db()
        
        # Get all skills, sorted by name
        skills = list(db.skills.find().sort('name', 1))
        
        # Convert ObjectId to string for JSON serialization
        for skill in skills:
            skill['_id'] = str(skill['_id'])
        
        return jsonify({
            'success': True,
            'count': len(skills),
            'skills': skills
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@skills_bp.route('/category/<category>', methods=['GET'])
def get_skills_by_category(category):
    """Get skills filtered by category"""
    try:
        db = get_db()
        
        # Find skills by category
        skills = list(db.skills.find({'category': category}))
        
        # Convert ObjectId to string
        for skill in skills:
            skill['_id'] = str(skill['_id'])
        
        return jsonify({
            'success': True,
            'count': len(skills),
            'category': category,
            'skills': skills
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@skills_bp.route('/<skill_id>', methods=['GET'])
def get_skill(skill_id):
    """Get a specific skill by ID"""
    try:
        db = get_db()
        
        # Convert string ID to ObjectId
        skill = db.skills.find_one({'_id': ObjectId(skill_id)})
        
        if not skill:
            return jsonify({'error': 'Skill not found'}), 404
        
        skill['_id'] = str(skill['_id'])
        
        return jsonify({
            'success': True,
            'skill': skill
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
