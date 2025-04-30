# backend/routes/vendor_products.py
from app import app, db
from models.product import Product
from models.user import User
from models.vendor import Vendor
from flask import request, jsonify

# 🔍 Get vendor products
@app.route("/api/vendor/products", methods=["GET"])
def get_vendor_products():
    try:
        # Get vendor username from query parameter
        username = request.args.get('username')
        if not username:
            return jsonify({"error": "Username is required"}), 400
        
        # Find the vendor ID associated with this user
        user = User.query.filter_by(username=username).first()
        if not user or user.role != 'vendor':
            return jsonify({"error": "User is not a vendor"}), 403
        
        vendor = Vendor.query.filter_by(email=user.email).first()
        if not vendor:
            return jsonify({"error": "Vendor profile not found"}), 404
        
        # Get all products for this vendor - include both active and inactive
        products = Product.query.filter_by(vendor_id=vendor.id).all()
        
        # Convert to JSON response
        product_list = []
        for product in products:
            product_list.append({
                "id": product.id,
                "name": product.name,
                "price": product.price,
                "description": product.description if hasattr(product, 'description') else None,
                "category": product.category if hasattr(product, 'category') else None,
                "image_url": product.image_url,
                "rating": product.rating,
                "stock": product.stock if hasattr(product, 'stock') else 0,
                "active": product.active if hasattr(product, 'active') else True
            })
        
        return jsonify(product_list), 200
    
    except Exception as e:
        print(f"Error fetching vendor products: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

# 🚀 Add a new product
@app.route("/api/vendor/product", methods=["POST"])
def add_vendor_product():
    try:
        # Get product data from request
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'price', 'description', 'category', 'vendor_username']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Check if the user is a vendor
        username = data.get('vendor_username')
        user = User.query.filter_by(username=username).first()
        if not user or user.role != 'vendor':
            return jsonify({"error": "User is not a vendor"}), 403
        
        # Get vendor ID
        vendor = Vendor.query.filter_by(email=user.email).first()
        if not vendor:
            return jsonify({"error": "Vendor profile not found"}), 404
        
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
        if not user or user.role != 'vendor':
            return jsonify({"error": "User is not a vendor"}), 403
        
        # Get vendor ID
        vendor = Vendor.query.filter_by(email=user.email).first()
        if not vendor:
            return jsonify({"error": "Vendor profile not found"}), 404
        
        # Verify ownership
        if product.vendor_id != vendor.id:
            return jsonify({"error": "You don't have permission to update this product"}), 403
        
        # Update product fields
        if 'name' in data:
            product.name = data['name']
        if 'price' in data:
            product.price = float(data['price'])
        if 'description' in data:
            product.description = data['description']
        if 'category' in data:
            product.category = data['category']
        if 'image' in data:
            product.image_url = data['image']
        if 'stock' in data:
            product.stock = int(data['stock'])
        if 'active' in data:
            product.active = data['active']
        
        db.session.commit()
        
        return jsonify({
            "message": "Product updated successfully"
        }), 200
    
    except Exception as e:
        db.session.rollback()
        print(f"Error updating product: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

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
        
        # Get vendor ID
        vendor = Vendor.query.filter_by(email=user.email).first()
        if not vendor:
            return jsonify({"error": "Vendor profile not found"}), 404
        
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
        
        # Get vendor ID
        vendor = Vendor.query.filter_by(email=user.email).first()
        if not vendor:
            return jsonify({"error": "Vendor profile not found"}), 404
        
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