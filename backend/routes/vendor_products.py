# backend/routes/vendor_products.py
from flask import request, jsonify, current_app
from app import app, db
import os
from werkzeug.utils import secure_filename
import uuid
from models.product import Product
from models.user import User
from models.vendor import Vendor

# 🔍 Get vendor products
@app.route("/api/vendor/products", methods=["GET"])
def get_vendor_products():
    try:
        # Get vendor username from query parameter
        username = request.args.get('username')
        print(f"Received request for vendor products with username: {username}")
        
        if not username:
            return jsonify({"error": "Username is required"}), 400
        
        # Find the user
        user = User.query.filter_by(username=username).first()
        if not user:
            print(f"User not found: {username}")
            return jsonify({"error": "User not found"}), 404
        
        print(f"Found user with role: {user.role}")
        
        # Find vendor by email or username
        vendor = Vendor.query.filter_by(email=user.email).first()
        if not vendor:
            print(f"Vendor profile not found for user: {username}")
            # Return empty products list instead of error
            return jsonify([]), 200
        
        print(f"Found vendor with ID: {vendor.id}")
        
        # Get all products for this vendor
        products = Product.query.filter_by(vendor_id=vendor.id).all()
        print(f"Found {len(products)} products for vendor")
        
        # Convert to JSON response
        product_list = []
        for product in products:
            product_list.append({
                "id": product.id,
                "name": product.name,
                "price": product.price,
                "description": product.description,
                "category": product.category,
                "image_url": product.image_url,
                "rating": product.rating,
                "stock": product.stock,
                "active": product.active
            })
        
        return jsonify(product_list), 200
        
    except Exception as e:
        print(f"Error in get_vendor_products: {str(e)}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

# 🚀 Add a new product
@app.route("/api/vendor/product", methods=["POST"])
def add_vendor_product():
    try:
        # Get product data from request
        data = request.get_json()
        print(f"Received add product request with data: {data}")
        
        # Validate required fields
        required_fields = ['name', 'price', 'description', 'category', 'vendor_username']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Check if the user exists
        username = data.get('vendor_username')
        user = User.query.filter_by(username=username).first()
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Get vendor ID - or create a vendor if one doesn't exist
        vendor = Vendor.query.filter_by(email=user.email).first()
        if not vendor:
            # Create a new vendor record
            new_vendor = Vendor(
                name=username,  # Use username as name by default
                email=user.email,
                phone="",  # Empty by default
                company_name=""  # Empty by default
            )
            db.session.add(new_vendor)
            db.session.commit()
            vendor = new_vendor
            print(f"Created new vendor record for {username}")
        
        # Create new product
        new_product = Product(
            name=data.get('name'),
            price=float(data.get('price')),
            description=data.get('description'),
            category=data.get('category'),
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
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

# 🛠️ Update a product
@app.route("/api/vendor/product/<int:product_id>", methods=["PUT"])
def update_vendor_product(product_id):
    try:
        # Get product data from request
        data = request.get_json()
        
        # Verify vendor ownership
        username = data.get('vendor_username')
        if not username:
            return jsonify({"error": "Vendor username is required"}), 400
        
        # Find the product
        product = Product.query.get(product_id)
        if not product:
            return jsonify({"error": "Product not found"}), 404
        
        # Check if the user is a vendor
        user = User.query.filter_by(username=username).first()
        if not user or (user.role != 'vendor' and user.role != 'admin'):
            return jsonify({"error": "User is not a vendor"}), 403
        
        # Get vendor ID - or create a vendor if one doesn't exist
        vendor = Vendor.query.filter_by(email=user.email).first()
        if not vendor:
            # Create a new vendor record
            new_vendor = Vendor(
                name=username,  # Use username as name by default
                email=user.email,
                phone="",  # Empty by default
                company_name=""  # Empty by default
            )
            db.session.add(new_vendor)
            db.session.commit()
            vendor = new_vendor
            print(f"Created new vendor record for {username}")
        
        # Verify ownership
        if product.vendor_id != vendor.id and user.role != 'admin':
            return jsonify({"error": "You don't have permission to update this product"}), 403
        
        # Update product fields safely
        if 'name' in data and data['name']:
            product.name = data['name']
        
        if 'price' in data and data['price'] is not None:
            try:
                product.price = float(data['price'])
            except (ValueError, TypeError):
                return jsonify({"error": "Invalid price format"}), 400
        
        if 'description' in data:
            product.description = data['description'] or ''
            
        if 'category' in data:
            product.category = data['category'] or ''
            
        if 'image' in data:
            # Properly handle image URL - ensure it's a string
            product.image_url = data['image'] or ''
            
        if 'stock' in data and data['stock'] is not None:
            try:
                product.stock = int(data['stock'])
            except (ValueError, TypeError):
                return jsonify({"error": "Invalid stock format"}), 400
                
        if 'active' in data:
            product.active = bool(data['active'])
        
        # Save changes to database
        db.session.commit()
        
        return jsonify({
            "message": "Product updated successfully",
            "product_id": product.id
        }), 200
    
    except Exception as e:
        db.session.rollback()
        print(f"Error updating product: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

# 🗑️ Delete a product
@app.route("/api/vendor/product/<int:product_id>", methods=["DELETE"])
def delete_vendor_product(product_id):
    try:
        # Get vendor username from query parameter
        username = request.args.get('username')
        if not username:
            return jsonify({"error": "Username is required"}), 400
        
        # Find the product
        product = Product.query.get(product_id)
        if not product:
            return jsonify({"error": "Product not found"}), 404
        
        # Check if the user is a vendor
        user = User.query.filter_by(username=username).first()
        if not user or user.role != 'vendor':
            return jsonify({"error": "User is not a vendor"}), 403
        
        # Get vendor ID - or create a vendor if one doesn't exist
        vendor = Vendor.query.filter_by(email=user.email).first()
        if not vendor:
            # Create a new vendor record
            new_vendor = Vendor(
                name=username,  # Use username as name by default
                email=user.email,
                phone="",  # Empty by default
                company_name=""  # Empty by default
            )
            db.session.add(new_vendor)
            db.session.commit()
            vendor = new_vendor
            print(f"Created new vendor record for {username}")
        
        # Verify ownership
        if product.vendor_id != vendor.id:
            return jsonify({"error": "You don't have permission to delete this product"}), 403
        
        # Delete the product
        db.session.delete(product)
        db.session.commit()
        
        return jsonify({
            "message": "Product deleted successfully"
        }), 200
    
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting product: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

# 🚀 Bulk add products
@app.route("/api/vendor/products/bulk", methods=["POST"])
def bulk_add_vendor_products():
    try:
        # Get data from request
        data = request.get_json()
        
        if not data or 'products' not in data or not isinstance(data['products'], list):
            return jsonify({"error": "Invalid data format. Expected a list of products."}), 400
        
        if len(data['products']) == 0:
            return jsonify({"error": "No products provided"}), 400
        
        # Get vendor username from the first product
        username = data['products'][0].get('vendor_username')
        if not username:
            return jsonify({"error": "Vendor username is required"}), 400
        
        # Check if the user is a vendor
        user = User.query.filter_by(username=username).first()
        if not user or user.role != 'vendor':
            return jsonify({"error": "User is not a vendor"}), 403
        
        # Get vendor ID - or create a vendor if one doesn't exist
        vendor = Vendor.query.filter_by(email=user.email).first()
        if not vendor:
            # Create a new vendor record
            new_vendor = Vendor(
                name=username,  # Use username as name by default
                email=user.email,
                phone="",  # Empty by default
                company_name=""  # Empty by default
            )
            db.session.add(new_vendor)
            db.session.commit()
            vendor = new_vendor
            print(f"Created new vendor record for {username}")
        
        # Create products
        product_ids = []
        for product_data in data['products']:
            # Validate required fields
            if not product_data.get('name') or 'price' not in product_data:
                continue
            
            active_status = product_data.get('active', True)  # Default to active if not specified
            
            new_product = Product(
                name=product_data.get('name'),
                price=float(product_data.get('price')),
                description=product_data.get('description', ''),
                category=product_data.get('category', 'Other'),
                image_url=product_data.get('image', None),
                rating=0,  # New products start with no rating
                stock=int(product_data.get('stock', 1)),
                active=active_status,
                vendor_id=vendor.id
            )
            
            db.session.add(new_product)
            db.session.flush()  # Get ID without committing
            product_ids.append(new_product.id)
        
        db.session.commit()
        
        return jsonify({
            "message": f"Successfully added {len(product_ids)} products",
            "product_ids": product_ids
        }), 201
    
    except Exception as e:
        db.session.rollback()
        print(f"Error bulk adding products: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500