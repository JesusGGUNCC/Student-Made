from app import app, db
from models.user import User
from models.vendor_application import VendorApplication  
import bcrypt
from flask import request, jsonify
from datetime import datetime, timedelta
import secrets
import bcrypt
import smtplib
from email.message import EmailMessage
import os 
from dotenv import load_dotenv

load_dotenv()

#Email setup
SMTP_SERVER = 'smtp.gmail.com'
SMTP_PORT = 587
EMAIL_ADDRESS = os.getenv('EMAIL_USER')
EMAIL_PASSWORD = os.getenv('EMAIL_PASS')


@app.route("/api/user/signup", methods=["POST"])
def signup():
    try: 
        data = request.get_json()
        print(f"Received signup data: {data}")  # for debugging use
        if not data:
            return jsonify({"error": "No data received"}), 400
        
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")

        if not username or not email or not password:
            return jsonify({"error": "Missing required fields"}), 400
        
        # Check if user already exists
        if User.query.filter_by(email=email).first():
            return jsonify({"error": "Email already exists"}), 400
        
        if User.query.filter_by(username=username).first():
            return jsonify({"error": "Username already exists"}), 400

        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        new_user = User(username=username, email=email, password=hashed_password)

        db.session.add(new_user)
        db.session.commit()


        return jsonify({"message": "Signup Successful", "username": username}), 201
    
    except Exception as e:
        db.session.rollback()
        print(f"Error during signup: {str(e)}")
        # Add more detailed error logging
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

# backend/routes/user.py - Update login endpoint
@app.route("/api/user/login", methods=["POST"])
def login():
    data = request.json
    username_or_email = data.get("username")
    password = data.get("password")
    requested_role = data.get("role", "customer")  # Default to customer

    user = User.query.filter((User.username == username_or_email) |
                             (User.email == username_or_email)).first()

    if user and bcrypt.checkpw(password.encode('utf-8'), user.password):
        # If user requests vendor access but isn't a vendor, check the vendor applications
        if requested_role == "vendor" and user.role != "vendor" and user.role != "admin":
            return jsonify({"error": f"This account does not have {requested_role} privileges"}), 403
            
        # Allow admin users to access vendor functionality
        if requested_role == "vendor" and user.role == "admin":
            # Check if admin has an approved vendor application
            vendor_application = VendorApplication.query.filter_by(
                username=user.username,
                status="approved"
            ).first()
            
            if not vendor_application:
                return jsonify({"error": "Admin account does not have vendor privileges"}), 403

        return jsonify({
            "message": "Login Successful",
            "username": user.username,
            "role": user.role
        }), 200
    else:
        return jsonify({"error": "Invalid username/email or password"}), 401

@app.route('/api/user/forgotPassword', methods = ['POST'])
def forgot_password():

    email = request.json.get("email")
    if not email:
        return jsonify({"error": "Email is required"}), 400
    
    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"message" : "If an account exists with this email, a reset link has been sent"}), 200
    
    token = secrets.token_urlsafe(32) #using secrets to generate a hexadecimal number
    user.reset_token = token
    #Here i am setting 15 mins date expiry inside the db. So that the user have 1 hour to change their password 
    user.reset_token_expiry = datetime.utcnow() + timedelta(minutes=15)
    db.session.commit()

    reset_link = f"http://localhost:5173/resetPassword?token={token}"

    

 
    msg =  EmailMessage()
    msg["Subject"] = "Password Reset Request"
    msg["From"] = EMAIL_ADDRESS
    msg['To'] = email
    msg.set_content(
            f"Please click the following link to reset your password: \n\n"
            f"{reset_link}\n\n"
            f"This link will expire in 15 minutes"
        )
    
    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as smtp:  
            smtp.starttls()
            smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            smtp.send_message(msg)
        
        return jsonify({"message" : "Password reset link has been sent to your email"}), 200
    
    except Exception as e:
        return jsonify({"error": f"Failed to send email: {str(e)}"}), 500
    
    

@app.route('/api/user/resetPassword', methods=['POST'])
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

@app.route('/api/user/validate-reset-token', methods=['POST'])
def validate_reset_token():
    token = request.json.get('token')
    if not token:
        return jsonify({"error": "Token is required"}), 400
    
    user = User.query.filter_by(reset_token=token).first()
    if not user or user.reset_token_expiry < datetime.utcnow():
        return jsonify({"valid": False}), 200
    
    return jsonify({"valid": True}), 200

@app.route("/api/user/check-remembered", methods=["GET"])
def check_remembered():
    remember_token = request.cookies.get("remember_token")

    if not remember_token:
        return jsonify({"remembered" : False}), 200
    
    user = User.query.filter_by(remember_token=remember_token).first()

    if user and user.remember_token_expiry > datetime.utcnow():
        return jsonify({"remembered" : True, "username": user.username}), 200
    
    return jsonify({"remembered" : False}), 200

