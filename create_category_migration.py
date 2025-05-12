"""
Script to create a migration for the new category fields.
Run this script with:
python create_category_migration.py
"""

import os
import subprocess

def create_migration():
    """Create a migration for the new category fields"""
    print("Creating migration for new category fields...")
    
    # Run makemigrations command
    try:
        result = subprocess.run(
            ["python", "manage.py", "makemigrations", "products", "--name", "add_category_fields"],
            capture_output=True,
            text=True
        )
        
        if result.returncode == 0:
            print("Migration created successfully!")
            print(result.stdout)
        else:
            print("Error creating migration:")
            print(result.stderr)
            return False
        
        # Run migrate command
        result = subprocess.run(
            ["python", "manage.py", "migrate", "products"],
            capture_output=True,
            text=True
        )
        
        if result.returncode == 0:
            print("Migration applied successfully!")
            print(result.stdout)
            return True
        else:
            print("Error applying migration:")
            print(result.stderr)
            return False
            
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    create_migration()
