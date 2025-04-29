from app import db, app

# Database model for PostgreSQL
class Product(db.Model):
    __tablename__ = 'products'  # explicitly calling for 'products' table in the db
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    price = db.Column(db.Float, nullable=False)
    rating = db.Column(db.Float)
    image_url = db.Column(db.String(500))

    def __init__(self, name, price, rating, image_url):
        self.name = name
        self.price = price
        self.rating = rating
        self.image_url = image_url

# Create the tables inside the app context
with app.app_context():
    db.create_all()
