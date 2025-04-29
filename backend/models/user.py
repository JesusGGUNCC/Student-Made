from app import db, app
import bcrypt
from datetime import datetime, timedelta


#Database model for PostGreSQL
class User(db.Model):
    __tablename__ = 'users'#explicity calling for 'users' table in the db
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(200), unique=True, nullable=False)
    email = db.Column(db.String(200), unique=True, nullable=False)
    password = db.Column(db.LargeBinary, nullable=False)
    reset_token = db.Column(db.String(100))
    reset_token_expiry = db.Column(db.DateTime) #Token will expire in 1 hour 

    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.password = password

with app.app_context():
    db.create_all()