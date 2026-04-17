"""
Projects routes
Handles project management
"""
from flask import Blueprint, request, jsonify
from database.db import get_db
from bson.objectid import ObjectId

projects_bp = Blueprint('projects', __name__, url_prefix='/projects')

@projects_bp.route('/create', methods=['POST'])
def create_project():
    """
    Create a new project
    Expected JSON: {
        "title": "string",
        "description": "string",
        "status": "string",
        "required_skills": ["string"],
        "created_by": "username"
    }
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['title', 'description', 'status', 'created_by']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        db = get_db()
        
        # Create new project
        new_project = {
            'title': data['title'],
            'description': data['description'],
            'status': data['status'],
            'required_skills': data.get('required_skills', []),
            'created_by': data['created_by'],
            'contributors': [data['created_by']],  # Creator is initial contributor
            'created_at': str(__import__('datetime').datetime.now())
        }
        
        result = db.projects.insert_one(new_project)
        
        return jsonify({
            'success': True,
            'message': 'Project created successfully',
            'project_id': str(result.inserted_id)
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@projects_bp.route('/all', methods=['GET'])
def get_all_projects():
    """Get all projects"""
    try:
        db = get_db()
        
        # Get all projects, sorted by creation date (newest first)
        projects = list(db.projects.find().sort('created_at', -1))
        
        # Convert ObjectId to string
        for project in projects:
            project['_id'] = str(project['_id'])
        
        return jsonify({
            'success': True,
            'count': len(projects),
            'projects': projects
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@projects_bp.route('/<project_id>', methods=['GET'])
def get_project(project_id):
    """Get a specific project by ID"""
    try:
        db = get_db()
        
        # Convert string ID to ObjectId
        project = db.projects.find_one({'_id': ObjectId(project_id)})
        
        if not project:
            return jsonify({'error': 'Project not found'}), 404
        
        project['_id'] = str(project['_id'])
        
        return jsonify({
            'success': True,
            'project': project
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@projects_bp.route('/join', methods=['POST'])
def join_project():
    """
    Join an existing project
    Expected JSON: {
        "project_id": "string",
        "username": "string"
    }
    """
    try:
        data = request.get_json()
        
        if 'project_id' not in data or 'username' not in data:
            return jsonify({'error': 'Missing project_id or username'}), 400
        
        db = get_db()
        
        # Find project
        project = db.projects.find_one({'_id': ObjectId(data['project_id'])})
        
        if not project:
            return jsonify({'error': 'Project not found'}), 404
        
        # Check if user already a contributor
        if data['username'] in project['contributors']:
            return jsonify({'error': 'User already a contributor'}), 400
        
        # Add user to contributors
        db.projects.update_one(
            {'_id': ObjectId(data['project_id'])},
            {'$push': {'contributors': data['username']}}
        )
        
        return jsonify({
            'success': True,
            'message': f"{data['username']} joined project successfully"
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@projects_bp.route('/<project_id>/status', methods=['PUT'])
def update_project_status(project_id):
    """
    Update project status
    Expected JSON: {
        "status": "string"
    }
    """
    try:
        data = request.get_json()
        
        if 'status' not in data:
            return jsonify({'error': 'Missing status field'}), 400
        
        db = get_db()
        
        # Update project status
        result = db.projects.update_one(
            {'_id': ObjectId(project_id)},
            {'$set': {'status': data['status']}}
        )
        
        if result.matched_count == 0:
            return jsonify({'error': 'Project not found'}), 404
        
        return jsonify({
            'success': True,
            'message': 'Project status updated successfully'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
