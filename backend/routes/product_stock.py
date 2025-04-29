# backend/routes/product_stock.py
from app import app, db
from models.product import Product
from flask import request, jsonify

# 🚀 Verify product stock for multiple products at once (used by cart)
@app.route("/api/product/verify-stock", methods=["POST"])
def verify_product_stock():
    try:
        data = request.get_json()
        
        if not data or not isinstance(data.get('items'), list):
            return jsonify({"error": "Invalid request format"}), 400
        
        cart_items = data.get('items')
        result = []
        
        for item in cart_items:
            product_id = item.get('id')
            requested_quantity = item.get('quantity', 1)
            
            if not product_id:
                result.append({
                    "id": product_id,
                    "valid": False,
                    "reason": "invalid_product"
                })
                continue
            
            # Get product from database
            product = Product.query.get(product_id)
            
            if not product:
                result.append({
                    "id": product_id,
                    "valid": False,
                    "reason": "product_not_found"
                })
                continue
            
            if not product.active:
                result.append({
                    "id": product_id,
                    "valid": False,
                    "reason": "product_inactive",
                    "available_stock": product.stock
                })
                continue
            
            if product.stock < requested_quantity:
                result.append({
                    "id": product_id,
                    "valid": False,
                    "reason": "insufficient_stock",
                    "available_stock": product.stock
                })
                continue
            
            # Product is valid
            result.append({
                "id": product_id,
                "valid": True,
                "available_stock": product.stock
            })
        
        return jsonify({
            "items": result,
            "all_valid": all(item.get('valid', False) for item in result)
        }), 200
    
    except Exception as e:
        print(f"Error verifying product stock: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

# 🛠️ Update product stock after order placement
@app.route("/api/product/update-stock", methods=["POST"])
def update_product_stock():
    try:
        data = request.get_json()
        
        if not data or not isinstance(data.get('items'), list):
            return jsonify({"error": "Invalid request format"}), 400
        
        ordered_items = data.get('items')
        success_count = 0
        failed_items = []
        
        for item in ordered_items:
            product_id = item.get('id')
            ordered_quantity = item.get('quantity', 1)
            
            if not product_id or ordered_quantity < 1:
                failed_items.append({
                    "id": product_id,
                    "reason": "invalid_item_data"
                })
                continue
            
            # Get product from database
            product = Product.query.get(product_id)
            
            if not product:
                failed_items.append({
                    "id": product_id,
                    "reason": "product_not_found"
                })
                continue
            
            if product.stock < ordered_quantity:
                failed_items.append({
                    "id": product_id,
                    "reason": "insufficient_stock",
                    "available_stock": product.stock
                })
                continue
            
            # Update product stock
            product.stock -= ordered_quantity
            success_count += 1
        
        # Commit changes if any successful updates
        if success_count > 0:
            db.session.commit()
        
        return jsonify({
            "success": len(failed_items) == 0,
            "successful_updates": success_count,
            "failed_items": failed_items
        }), 200
    
    except Exception as e:
        db.session.rollback()
        print(f"Error updating product stock: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

# 🚀 Restore product stock (for cancelled orders)
@app.route("/api/product/restore-stock", methods=["POST"])
def restore_product_stock():
    try:
        data = request.get_json()
        
        if not data or not isinstance(data.get('items'), list):
            return jsonify({"error": "Invalid request format"}), 400
        
        order_items = data.get('items')
        success_count = 0
        failed_items = []
        
        for item in order_items:
            product_id = item.get('id')
            quantity = item.get('quantity', 1)
            
            if not product_id or quantity < 1:
                failed_items.append({
                    "id": product_id,
                    "reason": "invalid_item_data"
                })
                continue
            
            # Get product from database
            product = Product.query.get(product_id)
            
            if not product:
                failed_items.append({
                    "id": product_id,
                    "reason": "product_not_found"
                })
                continue
            
            # Restore product stock
            product.stock += quantity
            success_count += 1
        
        # Commit changes if any successful updates
        if success_count > 0:
            db.session.commit()
        
        return jsonify({
            "success": len(failed_items) == 0,
            "successful_updates": success_count,
            "failed_items": failed_items
        }), 200
    
    except Exception as e:
        db.session.rollback()
        print(f"Error restoring product stock: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500