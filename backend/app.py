from flask import Flask 
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = os.getenv('TRACK_MODIFICATIONS')
app.config['SECKRET_KEY'] = os.getenv('SECRET_KEY')

db = SQLAlchemy(app)
CORS(app, origins=["http://localhost:5173"])


# ✅ Import all models here
from models.user import User
from models.product import Product
from models.user_profile import UserProfile
from models.wishlist import Wishlist
from models.payment import Payment
from models.order import Order
from models.order_details import OrderDetails

# ✅ Now after all models are loaded, create tables
with app.app_context():
    db.create_all()

from routes.user import *
from routes.product import *
from routes.user_profile import *
from routes.wishlist import *
from routes.payment import *
from routes.order import *
