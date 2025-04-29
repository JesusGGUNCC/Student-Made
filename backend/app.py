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

from routes.user import *
from routes.product import *
