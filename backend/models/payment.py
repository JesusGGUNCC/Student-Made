from app import db, app
from datetime import datetime

class Payment(db.Model):
    __tablename__ = 'payments'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(200), db.ForeignKey('users.username'), nullable=False)  # 🔥 Linked to User

    payment_type = db.Column(db.String(100), nullable=False)  # Card, PayPal, etc.
    card_number_last4 = db.Column(db.String(4))  # Only last 4 digits
    card_expiry_date = db.Column(db.String(7))   # MM/YYYY
    card_security_code = db.Column(db.String(10))  # Optional / Temporary

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, username, payment_type, card_number_last4, card_expiry_date, card_security_code=None):
        self.username = username
        self.payment_type = payment_type
        self.card_number_last4 = card_number_last4
        self.card_expiry_date = card_expiry_date
        self.card_security_code = card_security_code

