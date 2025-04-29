from app import db, app

# Database model for PostgreSQL
class Product(db.Model):
    __tablename__ = 'products'  # explicitly calling for 'products' table in the db

    id = db.Column(db.Integer, primary_key=True)
    vendor_id = db.Column(db.Integer, db.ForeignKey('vendors.id'), nullable=True)
    name = db.Column(db.String(200), nullable=False)
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(100))
    rating = db.Column(db.Float)
    image_url = db.Column(db.String(500))
    stock = db.Column(db.Integer, default=0)
    active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    def __init__(self, name, price, rating=None, image_url=None, vendor_id=None, 
                 description=None, category=None, stock=0, active=True):
        self.name = name
        self.price = price
        self.rating = rating
        self.image_url = image_url
        self.vendor_id = vendor_id
        self.description = description
        self.category = category
        self.stock = stock
        self.active = active

# Create the tables inside the app context
with app.app_context():
    db.create_all()