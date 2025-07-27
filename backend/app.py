from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
from geo_clustering_model import get_top_sellers

app = Flask(__name__)
CORS(app)  # allow frontend to access this API

@app.route("/")
def home():
    return "✅ SwaadAI Backend Running!"

@app.route("/login", methods=["POST"])
def login_and_recommend():
    data = request.get_json()

    try:
        name     = data["name"]
        email    = data["email"]
        phone    = data["phone"]
        lat      = float(data["latitude"])   # from frontend geolocation
        lon      = float(data["longitude"])  # from frontend geolocation
        product  = data["product"]

        print(f"📍 Received login from {name}, {email}, {phone}")
        print(f"📌 Location: ({lat}, {lon}), Product: {product}")

        sellers = get_top_sellers(lat, lon, product, top_n=5)

        return jsonify({
            "status": "success",
            "recommendations": sellers.to_dict(orient="records")
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400


if __name__ == "__main__":
    app.run(debug=True)
