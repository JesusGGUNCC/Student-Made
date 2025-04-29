# backend/models/vendor_application.py
from app import db, app
from datetime import datetime
import json

class VendorApplication(db.Model):
    __tablename__ = 'vendor_applications'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(200), nullable=False)
    phone = db.Column(db.String(20))
    company_name = db.Column(db.String(200))
    description = db.Column(db.Text, nullable=False)
    product_types = db.Column(db.Text, nullable=False)  # Store as JSON string
    status = db.Column(db.String(20), default="pending")  # pending, approved, rejected
    username = db.Column(db.String(200), db.ForeignKey('users.username'), nullable=True)
    password = db.Column(db.LargeBinary, nullable=True)  # Add password field
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __init__(self, name, email, description, product_types, phone=None, company_name=None, username=None, password=None):
        self.name = name
        self.email = email
        self.phone = phone
        self.company_name = company_name
        self.description = description
        
        # Handle product_types based on storage type
        if isinstance(product_types, list):
            # For JSON storage
            self.product_types = json.dumps(product_types)
        else:
            # Already in proper format
            self.product_types = product_types
            
        self.username = username
        self.password = password