"""
Database connection and utilities for MongoDB
"""
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError
import os
from dotenv import load_dotenv
import hashlib
import os
import certifi

load_dotenv()

def hash_password(password):
    """Simple password hashing"""
    return hashlib.sha256(password.encode()).hexdigest()

# MongoDB connection string
MONGO_URI = os.getenv('MONGO_URI', 'mongodb+srv://skillx_user:skill123@cluster0.s2nv41k.mongodb.net/?appName=Cluster0')

class Database:
    """Database connection and operations"""
    
    _client = None
    _db = None
    
    @classmethod
    def connect(cls):
        """Connect to MongoDB"""
        try:
            cls._client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000, tlsCAFile=certifi.where())
            # Test connection first before assigning the database object
            cls._client.admin.command('ping')
            cls._db = cls._client['skillx_db']
            print("[SUCCESS] MongoDB connection successful")
            return cls._db
        except ServerSelectionTimeoutError as e:
            cls._client = None
            cls._db = None
            print(f"[ERROR] MongoDB connection failed - ensure your cluster is accessible and IP is whitelisted.")
            print(f"Error Details: {str(e)}")
            return None
    
    @classmethod
    def get_db(cls):
        """Get database instance"""
        if cls._db is None:
            cls.connect()
        return cls._db
    
    @classmethod
    def close(cls):
        """Close database connection"""
        if cls._client:
            cls._client.close()
            print("[SUCCESS] MongoDB connection closed")

def get_db():
    """Helper function to get database"""
    return Database.get_db()

def seed_data():
    """
    Seed sample data into MongoDB
    Call this once to populate collections with test data
    """
    db = get_db()
    
    if db is None:
        print("Cannot seed data - database connection failed")
        return
    
    # Clear existing collections
    db.users.delete_many({})
    db.skills.delete_many({})
    db.projects.delete_many({})
    db.exchanges.delete_many({})
    
    # Sample users
    users = [
        {
            "username": "alice",
            "email": "alice@example.com",
            "password": hash_password("password123"),
            "full_name": "Alice Johnson",
            "skills": ["Python", "JavaScript", "React"],
            "created_at": "2024-01-15"
        },
        {
            "username": "bob",
            "email": "bob@example.com",
            "password": hash_password("password123"),
            "full_name": "Bob Smith",
            "skills": ["Java", "Spring Boot", "MongoDB"],
            "created_at": "2024-01-20"
        },
        {
            "username": "charlie",
            "email": "charlie@example.com",
            "password": hash_password("password123"),
            "full_name": "Charlie Brown",
            "skills": ["UI/UX Design", "Figma", "CSS"],
            "created_at": "2024-02-01"
        }
    ]
    
    # Sample skills
    skills = [
        {
            "name": "Python",
            "category": "Backend",
            "difficulty": "Intermediate",
            "description": "Python programming language",
            "added_by": "alice"
        },
        {
            "name": "React",
            "category": "Frontend",
            "difficulty": "Intermediate",
            "description": "React JavaScript library",
            "added_by": "alice"
        },
        {
            "name": "MongoDB",
            "category": "Database",
            "difficulty": "Intermediate",
            "description": "NoSQL database",
            "added_by": "bob"
        }
    ]
    
    # Sample projects
    projects = [
        {
            "title": "E-commerce Platform",
            "description": "Full-stack e-commerce application",
            "status": "In Progress",
            "contributors": ["alice", "bob"],
            "required_skills": ["Python", "React", "MongoDB"],
            "created_at": "2024-02-10"
        },
        {
            "title": "Social Media App",
            "description": "Social networking platform",
            "status": "In Progress",
            "contributors": ["bob", "charlie"],
            "required_skills": ["React", "Node.js", "MongoDB"],
            "created_at": "2024-02-15"
        }
    ]
    
    # Sample exchanges
    exchanges = [
        {
            "requester": "alice",
            "skill_offered": "Python",
            "skill_requested": "Java",
            "status": "pending",
            "created_at": "2024-02-20"
        },
        {
            "requester": "charlie",
            "skill_offered": "UI/UX Design",
            "skill_requested": "Python",
            "status": "accepted",
            "created_at": "2024-02-18"
        }
    ]
    
    # Insert data
    db.users.insert_many(users)
    db.skills.insert_many(skills)
    db.projects.insert_many(projects)
    db.exchanges.insert_many(exchanges)
    
    print("[SUCCESS] Sample data seeded successfully")
