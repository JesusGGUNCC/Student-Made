from app import app, db

with app.app_context():
    db.drop_all()  # This will delete all your tables and data!
    db.create_all()  # This will create all tables fresh based on your models

print("Database has been reset successfully!")