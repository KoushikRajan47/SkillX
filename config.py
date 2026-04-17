"""
Configuration settings for Flask backend
"""
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Base configuration"""
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    DEBUG = os.getenv('DEBUG', True)
    
    # MongoDB Configuration
    MONGO_URI = "mongodb+srv://skillx_user:skill123@cluster0.s2nv41k.mongodb.net/?appName=Cluster0"
    DB_NAME = "skillx"
    # Flask Configuration
    JSON_SORT_KEYS = False

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False

# Select config based on environment
config = os.getenv('FLASK_ENV', 'development')
config_dict = {
    'development': DevelopmentConfig,
    'production': ProductionConfig
}
