# backend/app.py - Ensuring proper route registration
from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_folder='static', static_url_path='/static')

# Configure the app
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = os.getenv('TRACK_MODIFICATIONS', 'False') == 'True'
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['JWT_SECRET_KEY'] = os.getenv('SECRET_KEY')  # Use same key for JWT

# Add route to serve static files directly
@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory('static', filename)

# Initialize extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)
CORS(app, resources={r"/*": {"origins": "*"}})


# ✅ Import all models here
from models.user import User
from models.user_profile import UserProfile
from models.payment import Payment
from models.vendor import Vendor
from models.product import Product
from models.wishlist import Wishlist
from models.order import Order
from models.order_details import OrderDetails
from models.vendor_application import VendorApplication

# ✅ Now after all models are loaded, create tables
with app.app_context():
    db.create_all()

# ✅ Import routes in a specific order to ensure correct registration
# First, import most basic routes
from routes.user import *
from routes.user_profile import *
from routes.payment import *
from routes.product import *
from routes.wishlist import *
from routes.order import *

# Then import vendor-related routes to ensure they have priority
from routes.vendor_application import *
from routes.vendor_products import *  # Import this first for vendor product routes
from routes.vendor import *  # Import this after to avoid overwriting routes

# Import and register upload blueprint
from routes.upload import upload_bp
app.register_blueprint(upload_bp)

# Print registered routes for debugging
print("Registered routes:")
for rule in app.url_map.iter_rules():
    print(f"{rule} - {rule.methods}")

if __name__ == '__main__':
    app.run(debug=True)