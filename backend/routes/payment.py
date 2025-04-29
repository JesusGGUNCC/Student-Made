from app import app, db
from models.order import Order
from models.order_details import OrderDetails
from models.payment import Payment
from flask import request, jsonify

@app.route("/api/payment/create", methods=["POST"])
def create_payment():
    try:
        data = request.get_json()

        username = data.get("username")
        payment_type = data.get("payment_type")
        card_number = data.get("card_number")
        card_expiry_date = data.get("card_expiry_date")
        card_security_code = data.get("card_security_code")

        if not username or not payment_type or not card_number or not card_expiry_date:
            return jsonify({"error": "Missing required payment fields"}), 400

        card_number_last4 = card_number[-4:]

        new_payment = Payment(
            username=username,
            payment_type=payment_type,
            card_number_last4=card_number_last4,
            card_expiry_date=card_expiry_date,
            card_security_code=card_security_code
        )

        db.session.add(new_payment)
        db.session.commit()

        return jsonify({
            "message": "Payment created successfully",
            "payment_id": new_payment.id
        }), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error creating payment: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500





# 🔍 2. Get Payment by ID (Optional)
@app.route("/api/payment/get", methods=["GET"])
def get_payment():
    try:
        payment_id = request.args.get('payment_id')

        if not payment_id:
            return jsonify({"error": "Payment ID is required"}), 400

        payment = Payment.query.get(payment_id)

        if not payment:
            return jsonify({"error": "Payment not found"}), 404

        payment_data = {
            "id": payment.id,
            "payment_type": payment.payment_type,
            "card_number_last4": payment.card_number_last4,
            "card_expiry_date": payment.card_expiry_date,
            "created_at": payment.created_at
        }

        return jsonify(payment_data), 200

    except Exception as e:
        print(f"Error fetching payment: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


# 🗑️ Delete a Payment by ID
@app.route("/api/payment/delete", methods=["DELETE"])
def delete_payment():
    try:
        payment_id = request.args.get('payment_id')

        if not payment_id:
            return jsonify({"error": "Payment ID is required"}), 400

        payment = Payment.query.get(payment_id)

        if not payment:
            return jsonify({"error": "Payment not found"}), 404

        db.session.delete(payment)
        db.session.commit()

        return jsonify({"message": "Payment deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error deleting payment: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500
