from app import db, app
from datetime import datetime

class Order(db.Model):
    __tablename__ = 'orders'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(200), db.ForeignKey('users.username'), nullable=False)

    # Add Payment Link
    payment_id = db.Column(db.Integer, db.ForeignKey('payments.id'), nullable=True)

    # Shipping Address Fields (as discussed)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    address1 = db.Column(db.String(200), nullable=False)
    address2 = db.Column(db.String(200))
    country = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(100), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    zip_code = db.Column(db.String(20), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)

    # Price Fields
    subtotal_amount = db.Column(db.Float, nullable=False)
    sales_tax_amount = db.Column(db.Float, nullable=False)
    shipping_fee = db.Column(db.Float, nullable=False)
    total_amount = db.Column(db.Float, nullable=False)

    status = db.Column(db.String(100), default="Pending")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, username, first_name, last_name, address1, address2, country, state, city, zip_code, phone_number,
                 subtotal_amount, sales_tax_amount, shipping_fee, total_amount, payment_id=None, status="Pending"):
        self.username = username
        self.first_name = first_name
        self.last_name = last_name
        self.address1 = address1
        self.address2 = address2
        self.country = country
        self.state = state
        self.city = city
        self.zip_code = zip_code
        self.phone_number = phone_number
        self.subtotal_amount = subtotal_amount
        self.sales_tax_amount = sales_tax_amount
        self.shipping_fee = shipping_fee
        self.total_amount = total_amount
        self.payment_id = payment_id
        self.status = status
