from app import app, db
from models.order import Order
from models.order_details import OrderDetails
from models.payment import Payment
from flask import request, jsonify

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

        # Create OrderDetails
        products = data["products"]
        for product in products:
            product_id = product.get("product_id")
            quantity = product.get("quantity")
            unit_price = product.get("unit_price")

            if not product_id or not quantity or not unit_price:
                return jsonify({"error": "Each product must have product_id, quantity, and unit_price"}), 400

            order_detail = OrderDetails(
                order_id=new_order.id,
                product_id=product_id,
                quantity=quantity,
                unit_price=unit_price
            )
            db.session.add(order_detail)

        db.session.commit()

        return jsonify({"message": "Order created successfully", "order_id": new_order.id}), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error creating order: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


# 🔍 2. Get all orders or by username
@app.route("/api/order/get", methods=["GET"])
def get_orders():
    try:
        username = request.args.get('username')

        if username:
            orders = Order.query.filter_by(username=username).all()
        else:
            orders = Order.query.all()

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
                "payment_id": order.payment_id,  # 🔥 Include payment_id
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

        if not order_id:
            return jsonify({"error": "Order ID is required"}), 400

        order = Order.query.get(order_id)

        if not order:
            return jsonify({"error": "Order not found"}), 404

        order.status = "Cancelled"
        db.session.commit()

        return jsonify({"message": "Order cancelled successfully"}), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error cancelling order: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500
