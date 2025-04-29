# backend/create_admin.py
import sys
import bcrypt
from app import app, db
from models.user import User

def create_admin_user(username, email, password):
    with app.app_context():
        # Check if user already exists
        existing_user = User.query.filter((User.username == username) | (User.email == email)).first()
        
        if existing_user:
            if existing_user.role == 'admin':
                print(f"Admin user {username} already exists!")
                return
            else:
                # Upgrade existing user to admin
                existing_user.role = 'admin'
                db.session.commit()
                print(f"User {username} has been upgraded to admin!")
                return
        
        # Create new admin user
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        new_admin = User(username=username, email=email, password=hashed_password, role='admin')
        
        db.session.add(new_admin)
        db.session.commit()
        
        print(f"Admin user {username} created successfully!")

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python create_admin.py <username> <email> <password>")
        sys.exit(1)
    
    username = sys.argv[1]
    email = sys.argv[2]
    password = sys.argv[3]
    
    create_admin_user(username, email, password)