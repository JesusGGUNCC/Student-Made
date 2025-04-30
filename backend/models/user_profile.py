from app import db
from datetime import datetime

class UserProfile(db.Model):
    __tablename__ = 'user_profiles'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(200), db.ForeignKey('users.username'), nullable=False)

    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    address1 = db.Column(db.String(200), nullable=False)
    address2 = db.Column(db.String(200))
    country = db.Column(db.String(100), nullable=False)
    zip_code = db.Column(db.String(20), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(100), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, username, first_name, last_name, address1, address2, country, zip_code, city, state, phone_number):
        self.username = username
        self.first_name = first_name
        self.last_name = last_name
        self.address1 = address1
        self.address2 = address2
        self.country = country
        self.zip_code = zip_code
        self.city = city
        self.state = state
        self.phone_number = phone_number

