from app import app, db
from models.user import User
from flask import request, jsonify
from datetime import datetime, timedelta
import secrets
import bcrypt

@app.route("/user/signup", methods = ["POST"])
def signup():
    try: 
        data = request.get_json()
        print(f"Recieved signup data: {data}")#for debugging use
        if not data:
            return jsonify({"error": "No data recieved "}), 400
        
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")

        if not username or not email or not password:
            return jsonify({"error" : "Missing required fields"}), 400
        

        if User.query.filter_by(email=email).first():
            return jsonify({"error" : "Email already exists"}), 400
        
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        new_user = User(username=username, email=email, password=hashed_password)

        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "Signup Successful", "username" : username}), 201
    
    except Exception as e:
        db.session.rollback()
        print(f"Error during signup: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route("/user/login", methods=["POST"])
def login():
    data = request.json
    username_or_email = data.get("username")
    password = data.get("password")

    user = User.query.filter((User.username == username_or_email) |
                                (User.email == username_or_email)).first()

    if user and bcrypt.checkpw(password.encode('utf-8'), user.password):  # Use hashed password checking in production
        return jsonify({"message": "Login Successful"}), 200
    else:
        return jsonify({"error": "Invalid username/email or password"}), 401

@app.route('/user/forgotPassword', methods = ['POST'])
def forgot_password():
    email = request.json.get("email")
    if not email:
        return jsonify({"error": "Email is required"}), 400
    
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error" : "No account found with this email"}), 404
    
    token = secrets.token_urlsafe(32) #using secrets to generate a hexadecimal number
    user.reset_token = token
    #Here i am setting i hour date expiry inside the db. So that the user have 1 hour to change their password 
    user.reset_token_expiry = datetime.utcnow() + timedelta(minutes=15)
    db.session.commit()

    print(f"Password reset link: http://localhost:5173/resetPassword?token={token}")
    
    return jsonify({"message" : "Password Link Sent to your Email"}), 200

@app.route('/user/resetPassword', methods=['POST'])
def reset_password():
    token = request.json.get('token')
    new_password = request.json.get('password')
    
    if not token or not new_password:
        return jsonify({"error": "Token and password are required"}), 400
    
    user = User.query.filter_by(reset_token=token).first()
    if not user or user.reset_token_expiry < datetime.utcnow():
        return jsonify({"error": "Invalid or expired token"}), 400
    
    # Update password and clear token
    user.password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
    user.reset_token = None
    user.reset_token_expiry = None
    db.session.commit()
    
    return jsonify({"message": "Password updated successfully"}), 200

@app.route('/user/validate-reset-token', methods=['POST'])
def validate_reset_token():
    token = request.json.get('token')
    if not token:
        return jsonify({"error": "Token is required"}), 400
    
    user = User.query.filter_by(reset_token=token).first()
    if not user or user.reset_token_expiry < datetime.utcnow():
        return jsonify({"valid": False}), 200
    
    return jsonify({"valid": True}), 200
