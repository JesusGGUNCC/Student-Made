from app import db
from datetime import datetime

class Wishlist(db.Model):
    __tablename__ = 'wishlists'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(200), db.ForeignKey('users.username'), nullable=False)
    product_ids = db.Column(db.ARRAY(db.Integer), nullable=False)  # List of Product IDs
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, username, product_ids):
        self.username = username
        self.product_ids = product_ids

