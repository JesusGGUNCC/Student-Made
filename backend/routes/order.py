from app import app, db
from models.order import Order
from models.order_details import OrderDetails
from models.payment import Payment
from models.product import Product
from flask import request, jsonify
import requests

# 🚀 1. Create a new Order (with payment ID)
@app.route("/api/order/create", methods=["POST"])
def create_order():
    try:
        data = request.get_json()

        # Validate required fields
        required_fields = ["username", "first_name", "last_name", "address1", "country", "state", "city", "zip_code",
                           "phone_number", "subtotal_amount", "sales_tax_amount", "shipping_fee", "total_amount", "products", "payment_id"]

        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400

        # Validate payment ID
        payment_id = data.get("payment_id")
        payment = Payment.query.get(payment_id)
        if not payment:
            return jsonify({"error": "Invalid payment ID"}), 400
        if payment.username != data["username"]:
            return jsonify({"error": "Payment does not belong to the user"}), 400

        # Validate product stock before creating order
        ordered_products = data["products"]
        for product_item in ordered_products:
            product_id = product_item.get("product_id")
            quantity = product_item.get("quantity")
            
            if not product_id or not quantity:
                return jsonify({"error": "Each product must have product_id and quantity"}), 400
            
            # Check product availability
            product = Product.query.get(product_id)
            if not product:
                return jsonify({"error": f"Product with ID {product_id} not found"}), 400
            
            if not product.active:
                return jsonify({"error": f"Product {product.name} is no longer available"}), 400
            
            if product.stock < quantity:
                return jsonify({
                    "error": f"Insufficient stock for product {product.name}. Available: {product.stock}"
                }), 400

        # Create Order
        new_order = Order(
            username=data["username"],
            first_name=data["first_name"],
            last_name=data["last_name"],
            address1=data["address1"],
            address2=data.get("address2", ""),
            country=data["country"],
            state=data["state"],
            city=data["city"],
            zip_code=data["zip_code"],
            phone_number=data["phone_number"],
            subtotal_amount=data["subtotal_amount"],
            sales_tax_amount=data["sales_tax_amount"],
            shipping_fee=data["shipping_fee"],
            total_amount=data["total_amount"],
            payment_id=payment_id
        )
        db.session.add(new_order)
        db.session.commit()  # Save order to get ID

        # Create OrderDetails and update product stock
        for product_item in ordered_products:
            product_id = product_item.get("product_id")
            quantity = product_item.get("quantity")
            unit_price = product_item.get("unit_price")

            # Create order detail
            order_detail = OrderDetails(
                order_id=new_order.id,
                product_id=product_id,
                quantity=quantity,
                unit_price=unit_price
            )
            db.session.add(order_detail)
            
            # Update product stock
            product = Product.query.get(product_id)
            product.stock -= quantity

        db.session.commit()

        return jsonify({
            "message": "Order created successfully", 
            "order_id": new_order.id
        }), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error creating order: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


# 🔍 2. Get all orders or by username
@app.route("/api/order/get", methods=["GET"])
def get_orders():
    try:
        username = request.args.get('username')
        order_id = request.args.get('order_id')

        if order_id:
            # Get specific order by ID
            order = Order.query.get(order_id)
            if not order:
                return jsonify({"error": "Order not found"}), 404
            
            # If username provided, verify ownership
            if username and order.username != username:
                return jsonify({"error": "You don't have permission to view this order"}), 403
            
            order_details = OrderDetails.query.filter_by(order_id=order.id).all()
            details_list = []
            
            for d in order_details:
                # Get product info
                product = Product.query.get(d.product_id)
                product_name = product.name if product else "Unknown Product"
                product_image = product.image_url if product else None
                
                details_list.append({
                    "product_id": d.product_id,
                    "product_name": product_name,
                    "product_image": product_image,
                    "quantity": d.quantity,
                    "unit_price": d.unit_price,
                    "subtotal": d.quantity * d.unit_price
                })
            
            order_data = {
                "id": order.id,
                "username": order.username,
                "payment_id": order.payment_id,
                "first_name": order.first_name,
                "last_name": order.last_name,
                "address1": order.address1,
                "address2": order.address2,
                "country": order.country,
                "state": order.state,
                "city": order.city,
                "zip_code": order.zip_code,
                "phone_number": order.phone_number,
                "subtotal_amount": order.subtotal_amount,
                "sales_tax_amount": order.sales_tax_amount,
                "shipping_fee": order.shipping_fee,
                "total_amount": order.total_amount,
                "status": order.status,
                "created_at": order.created_at,
                "products": details_list
            }
            
            return jsonify(order_data), 200
            
        elif username:
            # Get all orders for username
            orders = Order.query.filter_by(username=username).order_by(Order.created_at.desc()).all()
        else:
            # Get all orders (admin only)
            # TODO: Add admin authentication check
            orders = Order.query.order_by(Order.created_at.desc()).all()

        order_list = []
        for order in orders:
            order_details = OrderDetails.query.filter_by(order_id=order.id).all()
            details_list = [
                {
                    "product_id": d.product_id,
                    "quantity": d.quantity,
                    "unit_price": d.unit_price
                }
                for d in order_details
            ]

            order_data = {
                "id": order.id,
                "username": order.username,
                "payment_id": order.payment_id,
                "first_name": order.first_name,
                "last_name": order.last_name,
                "status": order.status,
                "total_amount": order.total_amount,
                "created_at": order.created_at,
                "product_count": len(details_list)
            }

            order_list.append(order_data)

        return jsonify(order_list), 200

    except Exception as e:
        print(f"Error fetching orders: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


# 🛑 3. Cancel (update status) an order
@app.route("/api/order/cancel", methods=["PUT"])
def cancel_order():
    try:
        order_id = request.args.get('order_id')
        username = request.args.get('username')  # For authorization

        if not order_id:
            return jsonify({"error": "Order ID is required"}), 400

        order = Order.query.get(order_id)

        if not order:
            return jsonify({"error": "Order not found"}), 404
        
        # If username provided, verify ownership
        if username and order.username != username:
            return jsonify({"error": "You don't have permission to cancel this order"}), 403
        
        # Only allow cancellation if order is still pending
        if order.status != "Pending":
            return jsonify({"error": f"Cannot cancel order with status '{order.status}'"}), 400

        # Update order status
        order.status = "Cancelled"
        
        # Restore product stock
        order_details = OrderDetails.query.filter_by(order_id=order.id).all()
        
        for detail in order_details:
            product = Product.query.get(detail.product_id)
            if product:
                product.stock += detail.quantity
        
        db.session.commit()

        return jsonify({"message": "Order cancelled successfully"}), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error cancelling order: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


# 📦 4. Update order status (for vendors/admin)
@app.route("/api/order/update-status", methods=["PUT"])
def update_order_status():
    try:
        data = request.get_json()
        
        order_id = data.get('order_id')
        new_status = data.get('status')
        
        if not order_id or not new_status:
            return jsonify({"error": "Order ID and status are required"}), 400
        
        # Validate status value
        valid_statuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"]
        if new_status not in valid_statuses:
            return jsonify({"error": "Invalid status value"}), 400
        
        order = Order.query.get(order_id)
        
        if not order:
            return jsonify({"error": "Order not found"}), 404
        
        # TODO: Add role-based authorization check (vendor/admin)
        
        # If new status is "Cancelled", restore product stock
        if new_status == "Cancelled" and order.status != "Cancelled":
            order_details = OrderDetails.query.filter_by(order_id=order.id).all()
            
            for detail in order_details:
                product = Product.query.get(detail.product_id)
                if product:
                    product.stock += detail.quantity
        
        # Update order status
        order.status = new_status
        db.session.commit()
        
        return jsonify({"message": f"Order status updated to {new_status}"}), 200
    
    except Exception as e:
        db.session.rollback()
        print(f"Error updating order status: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500