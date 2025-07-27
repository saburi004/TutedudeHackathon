from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
from geo_clustering_model import get_top_sellers, load_model_and_data  # Make sure this function is defined correctly

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend access

@app.route("/")
def home():
    return "✅ SwaadAI Backend Running!"

@app.route("/api/get-products", methods=["GET"])
def get_products():
    """Get list of available products"""
    try:
        _, _, df = load_model_and_data()
        products = sorted(df['Product'].unique().tolist())
        
        return jsonify({
            "status": "success",
            "products": products,
            "total_count": len(products)
        })
    except Exception as e:
        print(f"❌ Error getting products: {str(e)}")
        return jsonify({
            "status": "error",
            "message": "Failed to load products: " + str(e)
        }), 500

@app.route("/api/get-sellers", methods=["POST"])
def get_sellers():
    try:
        data = request.get_json()
        print("📨 Incoming JSON data:", data)

        if not data:
            return jsonify({"status": "error", "message": "Missing JSON body"}), 400

        lat = data.get("latitude")
        lon = data.get("longitude")
        product = data.get("product")

        if lat is None or lon is None or not product:
            return jsonify({
                "status": "error",
                "message": "latitude, longitude, and product fields are required"
            }), 400

        lat = float(lat)
        lon = float(lon)

        print(f"📍 Received coordinates: ({lat}, {lon}) for product: {product}")

        # Call your logic to find sellers
        sellers = get_top_sellers(lat, lon, product, top_n=5)

        # Check if sellers DataFrame is empty
        if sellers.empty:
            return jsonify({
                "status": "success",
                "top_sellers": [],
                "message": "No sellers found for the given criteria"
            })

        return jsonify({
            "status": "success",
            "top_sellers": sellers.to_dict(orient="records")
        })

    except ValueError as ve:
        print(f"❌ Value Error: {str(ve)}")
        return jsonify({
            "status": "error",
            "message": f"Invalid input data: {str(ve)}"
        }), 400

    except FileNotFoundError as fe:
        print(f"❌ File Error: {str(fe)}")
        return jsonify({
            "status": "error",
            "message": "Model files not found. Please train the model first."
        }), 500

    except Exception as e:
        print(f"❌ Server Error: {str(e)}")
        return jsonify({
            "status": "error",
            "message": "Internal server error: " + str(e)
        }), 500

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)