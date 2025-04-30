from app import app, db
from models.vendor import Vendor
from models.product import Product
from flask import request, jsonify

# 🔍 Get all vendors
@app.route("/api/vendor/all", methods=["GET"])
def get_all_vendors():
    try:
        vendors = Vendor.query.all()
        vendor_list = [
            {
                "id": v.id,
                "name": v.name,
                "email": v.email,
                "phone": v.phone,
                "company_name": v.company_name,
                "registered_at": v.registered_at
            }
            for v in vendors
        ]
        return jsonify(vendor_list), 200
    except Exception as e:
        print(f"Error fetching vendors: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


# 🔍 Get single vendor by ID
@app.route("/api/vendor/<int:vendor_id>", methods=["GET"])
def get_single_vendor(vendor_id):
    try:
        vendor = Vendor.query.get(vendor_id)
        if not vendor:
            return jsonify({"error": "Vendor not found"}), 404

        vendor_data = {
            "id": vendor.id,
            "name": vendor.name,
            "email": vendor.email,
            "phone": vendor.phone,
            "company_name": vendor.company_name,
            "registered_at": vendor.registered_at
        }
        return jsonify(vendor_data), 200
    except Exception as e:
        print(f"Error fetching vendor: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


# 🗑️ Delete a vendor by ID
@app.route("/api/vendor/<int:vendor_id>", methods=["DELETE"])
def delete_vendor(vendor_id):
    try:
        vendor = Vendor.query.get(vendor_id)
        if not vendor:
            return jsonify({"error": "Vendor not found"}), 404

        db.session.delete(vendor)
        db.session.commit()
        return jsonify({"message": "Vendor deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting vendor: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500



# Register a new vendor
@app.route("/api/vendor/register", methods=["POST"])
def register_vendor():
    try:
        data = request.get_json()
        name = data.get("name")
        email = data.get("email")
        phone = data.get("phone")
        company = data.get("company_name")

        if not name or not email:
            return jsonify({"error": "Name and email are required"}), 400

        if Vendor.query.filter_by(email=email).first():
            return jsonify({"error": "Vendor with this email already exists"}), 400

        vendor = Vendor(name=name, email=email, phone=phone, company_name=company)
        db.session.add(vendor)
        db.session.commit()

        return jsonify({"message": "Vendor registered successfully", "vendor_id": vendor.id}), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error registering vendor: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


# Add product for vendor
# Add this to routes/vendor.py
@app.route("/api/vendor/add-product", methods=["POST"])
def add_new_vendor_product():
    try:
        # Get product data from request
        data = request.get_json()
        print(f"Received add product request with data: {data}")
        
        # Validate required fields
        required_fields = ['name', 'price', 'vendor_username']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}), 400
            
        # Get vendor information
        username = data.get('vendor_username')
        user = User.query.filter_by(username=username).first()
        
        if not user:
            return jsonify({"error": "User not found"}), 404
            
        # Check user role
        if user.role not in ['vendor', 'admin']:
            return jsonify({"error": "User does not have vendor privileges"}), 403
            
        # Get vendor profile
        vendor = Vendor.query.filter_by(email=user.email).first()
        if not vendor:
            return jsonify({"error": "Vendor profile not found"}), 404
            
        # Create new product
        new_product = Product(
            name=data.get('name'),
            price=float(data.get('price')),
            description=data.get('description', ''),
            category=data.get('category', ''),
            image_url=data.get('image') or None,
            rating=0,  # New products start with no rating
            stock=int(data.get('stock', 1)),
            active=data.get('active', True),  # Default to active=True if not provided
            vendor_id=vendor.id
        )
        
        db.session.add(new_product)
        db.session.commit()
        
        print(f"Product added successfully: {new_product.id}")
        
        return jsonify({
            "message": "Product added successfully",
            "product_id": new_product.id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Error adding product: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Error: {str(e)}"}), 500
