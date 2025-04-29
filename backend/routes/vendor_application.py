# backend/routes/vendor_application.py
from app import app, db
from models.vendor_application import VendorApplication
from models.vendor import Vendor
from models.user import User
from flask import request, jsonify
from datetime import datetime

# 🚀 Submit a new vendor application
@app.route("/api/vendor/application", methods=["POST"])
def submit_vendor_application():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('name') or not data.get('email') or not data.get('description') or not data.get('product_types'):
            return jsonify({"error": "Missing required fields"}), 400
        
        # Check if email already has a pending application
        existing_app = VendorApplication.query.filter_by(
            email=data.get('email'), 
            status='pending'
        ).first()
        
        if existing_app:
            return jsonify({"error": "You already have a pending application"}), 400
        
        # Create new application
        application = VendorApplication(
            name=data.get('name'),
            email=data.get('email'),
            phone=data.get('phone'),
            company_name=data.get('company_name'),
            description=data.get('description'),
            product_types=data.get('product_types'),
            username=data.get('username')
        )
        
        db.session.add(application)
        db.session.commit()
        
        return jsonify({
            "message": "Application submitted successfully",
            "application_id": application.id
        }), 201
    
    except Exception as e:
        db.session.rollback()
        print(f"Error submitting vendor application: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


# 🔍 Get all vendor applications (admin only)
@app.route("/api/admin/vendor/applications", methods=["GET"])
def get_vendor_applications():
    try:
        # TODO: Add proper admin authentication
        
        status_filter = request.args.get('status')
        
        if status_filter:
            applications = VendorApplication.query.filter_by(status=status_filter).order_by(VendorApplication.created_at.desc()).all()
        else:
            applications = VendorApplication.query.order_by(VendorApplication.created_at.desc()).all()
        
        result = []
        for app in applications:
            result.append({
                "id": app.id,
                "name": app.name,
                "email": app.email,
                "phone": app.phone,
                "company_name": app.company_name,
                "description": app.description,
                "product_types": app.product_types,
                "status": app.status,
                "username": app.username,
                "created_at": app.created_at.isoformat(),
                "updated_at": app.updated_at.isoformat()
            })
        
        return jsonify(result), 200
    
    except Exception as e:
        print(f"Error fetching vendor applications: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


# 🛠️ Process vendor application (approve/reject)
@app.route("/api/admin/vendor/application/<int:application_id>", methods=["PUT"])
def process_vendor_application(application_id):
    try:
        # TODO: Add proper admin authentication
        
        data = request.get_json()
        status = data.get('status')
        
        if not status or status not in ["approved", "rejected"]:
            return jsonify({"error": "Invalid status"}), 400
        
        application = VendorApplication.query.get(application_id)
        
        if not application:
            return jsonify({"error": "Application not found"}), 404
        
        application.status = status
        application.updated_at = datetime.utcnow()
        
        # If approved, create a vendor account and update user role
        if status == "approved":
            # Create vendor record
            vendor = Vendor(
                name=application.name,
                email=application.email,
                phone=application.phone,
                company_name=application.company_name
            )
            
            db.session.add(vendor)
            
            # Update user role to vendor if username exists
            if application.username:
                user = User.query.filter_by(username=application.username).first()
                if user:
                    user.role = "vendor"
            
            # TODO: Send approval email notification
        
        db.session.commit()
        
        return jsonify({
            "message": f"Application {status}"
        }), 200
    
    except Exception as e:
        db.session.rollback()
        print(f"Error processing vendor application: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


# 🔍 Get application status for a user
@app.route("/api/vendor/application/status", methods=["GET"])
def get_application_status():
    try:
        username = request.args.get('username')
        email = request.args.get('email')
        
        if not username and not email:
            return jsonify({"error": "Username or email is required"}), 400
        
        query = VendorApplication.query
        
        if username:
            application = query.filter_by(username=username).order_by(VendorApplication.created_at.desc()).first()
        else:
            application = query.filter_by(email=email).order_by(VendorApplication.created_at.desc()).first()
        
        if not application:
            return jsonify({"status": "none"}), 200
        
        return jsonify({
            "status": application.status,
            "application_id": application.id,
            "created_at": application.created_at.isoformat(),
            "updated_at": application.updated_at.isoformat()
        }), 200
    
    except Exception as e:
        print(f"Error checking application status: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500