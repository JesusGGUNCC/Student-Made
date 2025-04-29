from app import app, db
from models.wishlist import Wishlist
from flask import request, jsonify

# 🚀 Add (create) a new Wishlist
@app.route("/api/wishlist/add", methods=["POST"])
def add_to_wishlist():
    try:
        data = request.get_json()

        username = data.get('username')
        product_ids = data.get('product_ids')

        if not username or not product_ids:
            return jsonify({"error": "Username and product IDs are required"}), 400

        new_wishlist = Wishlist(username=username, product_ids=product_ids)
        db.session.add(new_wishlist)
        db.session.commit()

        return jsonify({"message": "Wishlist created successfully"}), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error creating wishlist: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


# 🔍 Get all Wishlists (or by username)
@app.route("/api/wishlist/get", methods=["GET"])
def get_wishlists():
    try:
        username = request.args.get('username')

        if username:
            wishlists = Wishlist.query.filter_by(username=username).all()
        else:
            wishlists = Wishlist.query.all()

        wishlist_list = [
            {
                "id": w.id,
                "username": w.username,
                "product_ids": w.product_ids,
                "created_at": w.created_at
            }
            for w in wishlists
        ]

        return jsonify(wishlist_list), 200

    except Exception as e:
        print(f"Error fetching wishlists: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


# 🗑️ Delete Wishlist by ID
@app.route("/api/wishlist/delete", methods=["DELETE"])
def delete_wishlist():
    try:
        wishlist_id = request.args.get('id')

        if not wishlist_id:
            return jsonify({"error": "Wishlist ID is required"}), 400

        wishlist = Wishlist.query.get(wishlist_id)

        if not wishlist:
            return jsonify({"error": "Wishlist not found"}), 404

        db.session.delete(wishlist)
        db.session.commit()

        return jsonify({"message": "Wishlist deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error deleting wishlist: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500
