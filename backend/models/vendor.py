from app import db
from datetime import datetime

class Vendor(db.Model):
    __tablename__ = 'vendors'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(200), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    company_name = db.Column(db.String(200))
    registered_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Optional relationship to access all products by this vendor
    products = db.relationship('Product', backref='vendor', lazy=True)

    def __init__(self, name, email, phone=None, company_name=None):
        self.name = name
        self.email = email
        self.phone = phone
        self.company_name = company_name
