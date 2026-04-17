#!/usr/bin/env python
"""
Database Management Script
Manage MongoDB database: seed data, clear data, verify connection
"""
import sys
from database.db import Database, seed_data, get_db

def print_header(text):
    """Print formatted header"""
    print("\n" + "="*50)
    print(f"  {text}")
    print("="*50 + "\n")

def test_connection():
    """Test MongoDB connection"""
    print_header("Testing MongoDB Connection")
    db = get_db()
    if db is not None:
        print("✅ MongoDB connection successful!")
        
        # Show database info
        print("\nDatabase Collections:")
        for collection in db.list_collection_names():
            count = db[collection].count_documents({})
            print(f"  - {collection}: {count} documents")
        return True
    else:
        print("❌ MongoDB connection failed!")
        return False

def seed_sample_data():
    """Seed database with sample data"""
    print_header("Seeding Sample Data")
    try:
        seed_data()
        print("✅ Sample data seeded successfully!")
        return True
    except Exception as e:
        print(f"❌ Error seeding data: {e}")
        return False

def clear_database():
    """Clear all data from database"""
    print_header("Clearing Database")
    confirm = input("Are you sure you want to clear all data? (yes/no): ").lower()
    
    if confirm != 'yes':
        print("❌ Cancelled")
        return False
    
    try:
        db = get_db()
        if db:
            db.users.delete_many({})
            db.skills.delete_many({})
            db.projects.delete_many({})
            db.exchanges.delete_many({})
            print("✅ All data cleared!")
            return True
    except Exception as e:
        print(f"❌ Error clearing database: {e}")
        return False

def show_database_stats():
    """Show database statistics"""
    print_header("Database Statistics")
    db = get_db()
    
    if db is None:
        print("❌ Cannot connect to database")
        return
    
    collections = {
        'users': 'Users',
        'skills': 'Skills',
        'projects': 'Projects',
        'exchanges': 'Exchanges'
    }
    
    for collection, name in collections.items():
        count = db[collection].count_documents({})
        print(f"{name}: {count} documents")
        
        # Show sample documents
        sample = db[collection].find_one()
        if sample:
            print(f"  → Sample: {list(sample.keys())[:3]}...")
    
    print("\n✅ Database stats retrieved")

def show_menu():
    """Show menu options"""
    print("\n" + "="*50)
    print("  SkillX Backend - Database Management")
    print("="*50)
    print("\nOptions:")
    print("  1. Test MongoDB connection")
    print("  2. Seed sample data")
    print("  3. Clear all data")
    print("  4. Show database statistics")
    print("  5. Exit")
    print("\n" + "="*50)

def main():
    """Main function"""
    while True:
        show_menu()
        choice = input("\nEnter option (1-5): ").strip()
        
        if choice == '1':
            test_connection()
        elif choice == '2':
            seed_sample_data()
        elif choice == '3':
            clear_database()
        elif choice == '4':
            show_database_stats()
        elif choice == '5':
            print("\n👋 Goodbye!\n")
            break
        else:
            print("❌ Invalid option")

if __name__ == '__main__':
    # Allow command-line arguments
    if len(sys.argv) > 1:
        command = sys.argv[1].lower()
        
        if command == 'test':
            test_connection()
        elif command == 'seed':
            seed_sample_data()
        elif command == 'clear':
            clear_database()
        elif command == 'stats':
            show_database_stats()
        else:
            print("Unknown command. Usage:")
            print("  python manage.py test   - Test MongoDB connection")
            print("  python manage.py seed   - Seed sample data")
            print("  python manage.py clear  - Clear all data")
            print("  python manage.py stats  - Show statistics")
            print("  python manage.py        - Interactive menu")
    else:
        # Interactive mode
        main()
