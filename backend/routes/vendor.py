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
@app.route("/api/vendor/<int:vendor_id>/add-product", methods=["POST"])
def add_product_for_vendor(vendor_id):
    try:
        vendor = Vendor.query.get(vendor_id)
        if not vendor:
            return jsonify({"error": "Vendor not found"}), 404

        data = request.get_json()
        name = data.get("name")
        price = data.get("price")
        rating = data.get("rating")
        image_url = data.get("image_url")

        if not name or price is None:
            return jsonify({"error": "Product name and price are required"}), 400

        product = Product(name=name, price=price, rating=rating, image_url=image_url, vendor_id=vendor_id)
        db.session.add(product)
        db.session.commit()

        return jsonify({"message": "Product added by vendor", "product_id": product.id}), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error adding vendor product: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500
