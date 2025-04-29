from app import app, db
from models.user_profile import UserProfile
from flask import request, jsonify

# 🚀 Add (Create) a new User Profile
@app.route("/api/userprofile/add", methods=["POST"])
def add_user_profile():
    try:
        data = request.get_json()

        required_fields = ["username", "first_name", "last_name", "address1", "country", "zip_code", "city", "state", "phone_number"]
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400

        new_profile = UserProfile(
            username = data["username"],
            first_name = data["first_name"],
            last_name = data["last_name"],
            address1 = data["address1"],
            address2 = data.get("address2", ""),  # Optional
            country = data["country"],
            zip_code = data["zip_code"],
            city = data["city"],
            state = data["state"],
            phone_number = data["phone_number"]
        )

        db.session.add(new_profile)
        db.session.commit()

        return jsonify({"message": "User profile created successfully"}), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error adding user profile: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


# 🔍 Get User Profile by username
@app.route("/api/userprofile/get", methods=["GET"])
def get_user_profile():
    try:
        usrname = request.args.get('username')

        if not usrname:
            return jsonify({"error": "Username is required"}), 400

        profile = UserProfile.query.filter_by(username=usrname).first()

        if not profile:
            return jsonify({"error": "User profile not found"}), 404

        profile_data = {
            "username": profile.username,
            "first_name": profile.first_name,
            "last_name": profile.last_name,
            "address1": profile.address1,
            "address2": profile.address2,
            "country": profile.country,
            "zip_code": profile.zip_code,
            "city": profile.city,
            "state": profile.state,
            "phone_number": profile.phone_number
        }

        return jsonify(profile_data), 200

    except Exception as e:
        print(f"Error fetching user profile: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500
    

# 🛠️ Update an existing User Profile
@app.route("/api/userprofile/update", methods=["PUT"])
def update_user_profile():
    try:
        data = request.get_json()

        username = data.get("username")
        if not username:
            return jsonify({"error": "Username is required"}), 400

        profile = UserProfile.query.filter_by(username=username).first()

        if not profile:
            return jsonify({"error": "User profile not found"}), 404

        # Update fields
        for field in ["first_name", "last_name", "address1", "address2", "country", "zip_code", "city", "state", "phone_number"]:
            if field in data:
                setattr(profile, field, data[field])

        db.session.commit()

        return jsonify({"message": "User profile updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error updating user profile: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


# 🗑️ Delete a User Profile
@app.route("/api/userprofile/delete", methods=["DELETE"])
def delete_user_profile():
    try:
        username = request.args.get('username')

        if not username:
            return jsonify({"error": "Username is required"}), 400

        profile = UserProfile.query.filter_by(username=username).first()

        if not profile:
            return jsonify({"error": "User profile not found"}), 404

        db.session.delete(profile)
        db.session.commit()

        return jsonify({"message": "User profile deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error deleting user profile: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500
