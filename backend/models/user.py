# backend/models/user.py - Add role field
from app import db
import bcrypt
from datetime import datetime, timedelta

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(200), unique=True, nullable=False)
    email = db.Column(db.String(200), unique=True, nullable=False)
    password = db.Column(db.LargeBinary, nullable=False)
    role = db.Column(db.String(20), default="customer")  # customer, vendor, admin
    reset_token = db.Column(db.String(100))
    reset_token_expiry = db.Column(db.DateTime)
    remember_token = db.Column(db.String)
    remember_token_expiry = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, username, email, password, role="customer"):
        self.username = username
        self.email = email
        self.password = password
        self.role = role
