# backend/app.py - Updated to include all route imports
from flask import Flask 
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Configure the app
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = os.getenv('TRACK_MODIFICATIONS', 'False') == 'True'
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['JWT_SECRET_KEY'] = os.getenv('SECRET_KEY')  # Use same key for JWT

# Initialize extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)
CORS(app, resources={r"/api/*": {"origins": "*"}})


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

# ✅ Import all routes
from routes.user import *
from routes.user_profile import *
from routes.payment import *
from routes.vendor import *
from routes.product import *
from routes.wishlist import *
from routes.order import *
from routes.vendor_application import *
from routes.vendor_products import *  # New vendor product management routes

# Add any additional app settings or hook registrations here

if __name__ == '__main__':
    app.run(debug=True)