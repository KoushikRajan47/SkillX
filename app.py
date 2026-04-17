"""
Main Flask application
This is the entry point for the backend server
Run with: python app.py
"""
from flask import Flask, jsonify
from flask_cors import CORS
from config import DevelopmentConfig
from database.db import Database, seed_data
from routes.auth import auth_bp
from routes.skills import skills_bp
from routes.projects import projects_bp
from routes.exchange import exchange_bp

# Initialize Flask app
app = Flask(__name__)

# Load configuration
app.config.from_object(DevelopmentConfig)

# Enable CORS for all routes (allows frontend to connect from any origin)
CORS(app, resources={
    r"/auth/*": {"origins": "*"},
    r"/skills/*": {"origins": "*"},
    r"/projects/*": {"origins": "*"},
    r"/exchange/*": {"origins": "*"}
})

# Initialize database connection on startup
@app.before_request
def init_db():
    """Initialize database before first request"""
    if not hasattr(app, 'db_initialized'):
        Database.connect()
        app.db_initialized = True

# Register blueprints (route groups)
app.register_blueprint(auth_bp)
app.register_blueprint(skills_bp)
app.register_blueprint(projects_bp)
app.register_blueprint(exchange_bp)

# Root endpoint
@app.route('/', methods=['GET'])
def home():
    """Root endpoint - API information"""
    return jsonify({
        'message': 'SkillX Backend API',
        'version': '1.0',
        'status': 'running',
        'endpoints': {
            'auth': '/auth',
            'skills': '/skills',
            'projects': '/projects',
            'exchange': '/exchange'
        }
    }), 200

# Health check endpoint
@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'healthy'}), 200

# Error handlers
@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def server_error(error):
    """Handle 500 errors"""
    return jsonify({'error': 'Internal server error'}), 500

@app.errorhandler(405)
def method_not_allowed(error):
    """Handle 405 errors"""
    return jsonify({'error': 'Method not allowed'}), 405

# Shutdown handler
@app.teardown_appcontext
def close_db(error):
    """Close database connection on shutdown"""
    pass  # PyMongo handles connection pooling automatically

if __name__ == '__main__':
    print("Starting backend startup sequence...")
    db = Database.connect()
    if db is None:
        print("ERROR: Cannot start backend because MongoDB is unavailable.")
        print("Please start MongoDB and retry.")
    else:
        print("Seeding sample data...")
        seed_data()
        print("\n" + "="*50)
        print("🚀 SkillX Backend Server Starting...")
        print("="*50)
        print("📍 Running on: http://127.0.0.1:5000")
        print("🔗 Frontend should connect to http://127.0.0.1:5000")
        print("="*50 + "\n")
        app.run(
            host='127.0.0.1',
            port=5000,
            debug=True,
            use_reloader=True
        )
