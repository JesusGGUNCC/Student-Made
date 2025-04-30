from app import app, db
from models.product import Product
from flask import request, jsonify

@app.route("/api/product/list", methods=["GET"])
def get_all_products():
    try:
        products = Product.query.all()
        product_list = [
            {
                "id": product.id,
                "name": product.name,
                "price": product.price,
                "rating": product.rating,
                "image_url": product.image_url,
                "vendor_id": product.vendor_id
            }
            for product in products
        ]
        return jsonify(product_list), 200
    except Exception as e:
        print(f"Error fetching products: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route("/api/product/details", methods=["GET"])
def get_product_details():
    try:
        product_id = request.args.get('productId')

        if not product_id:
            return jsonify({"error": "Product ID is required"}), 400
        
        product = Product.query.get(product_id)

        if not product:
            return jsonify({"error": "Product not found"}), 404
        
        product_data = {
            "id": product.id,
            "name": product.name,
            "price": product.price,
            "rating": product.rating,
            "image_url": product.image_url,
            "vendor_id": product.vendor_id
        }
        return jsonify(product_data), 200
    except Exception as e:
        print(f"Error fetching product details: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500
    

@app.route("/api/product/add-products", methods=["POST"])
def add_products_bulk():
    try:
        data = request.get_json()

        if not data or not isinstance(data, list):
            return jsonify({"error": "Request must be a list of products"}), 400

        products_to_add = []
        for item in data:
            name = item.get("name")
            price = item.get("price")
            rating = item.get("rating")
            image_url = item.get("image_url")
            vendor_id = item.get("vendor_id")

            if not name or price is None:
                return jsonify({"error": "Each product must have at least name and price"}), 400

            new_product = Product(name=name, price=price, rating=rating, image_url=image_url, vendor_id=vendor_id)
            products_to_add.append(new_product)

        db.session.add_all(products_to_add)
        db.session.commit()

        return jsonify({"message": f"{len(products_to_add)} products added successfully."}), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error adding products: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route("/api/product/delete-all-products", methods=["DELETE"])
def delete_all_products():
    try:
        num_deleted = db.session.query(Product).delete()
        db.session.commit()

        return jsonify({"message": f"Deleted {num_deleted} products successfully."}), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error deleting products: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500    
