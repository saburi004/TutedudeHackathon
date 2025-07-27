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

@app.route("/api/get-initial-sellers", methods=["GET"])
def get_initial_sellers():
    """Get initial 20-30 sellers to display on page load"""
    try:
        _, _, df = load_model_and_data()
        
        # Get unique sellers based on Seller_ID and aggregate their data
        initial_sellers = df.groupby('Seller_ID').agg({
            'Name': 'first',
            'Locality': 'first', 
            'Rating': 'mean',
            'Verified': 'first',
            'Price_per_kg': 'mean',
            'Email': 'first',       
            'Mobile': 'first' 
        }).reset_index()
        
        # Ensure no duplicate Seller_IDs
        initial_sellers = initial_sellers.drop_duplicates(subset=['Seller_ID'])
        
        # Sort by rating and take top 30
        initial_sellers = initial_sellers.sort_values('Rating', ascending=False).head(30)
        
        # Add a default score for initial display
        initial_sellers['Score'] = initial_sellers['Rating'] / 5.0
        
        print(f"✅ Returning {len(initial_sellers)} unique initial sellers")
        
        return jsonify({
            "status": "success",
            "sellers": initial_sellers.to_dict(orient="records"),
            "total_count": len(initial_sellers)
        })
        
    except Exception as e:
        print(f"❌ Error getting initial sellers: {str(e)}")
        return jsonify({
            "status": "error",
            "message": "Failed to load initial sellers: " + str(e)
        }), 500

@app.route("/api/get-all-sellers", methods=["GET"])
def get_all_sellers():
    """Fallback endpoint to get all sellers"""
    try:
        _, _, df = load_model_and_data()
        
        # Get all unique sellers
        all_sellers = df.groupby('Seller_ID').agg({
            'Name': 'first',
            'Locality': 'first',
            'Rating': 'mean',
            'Verified': 'first',
            'Price_per_kg': 'mean'
        }).reset_index()
        
        # Ensure no duplicates
        all_sellers = all_sellers.drop_duplicates(subset=['Seller_ID'])
        
        # Sort by rating
        all_sellers = all_sellers.sort_values('Rating', ascending=False)
        all_sellers['Score'] = all_sellers['Rating'] / 5.0
        
        print(f"✅ Returning {len(all_sellers)} unique sellers")
        
        return jsonify({
            "status": "success",
            "sellers": all_sellers.to_dict(orient="records"),
            "total_count": len(all_sellers)
        })
        
    except Exception as e:
        print(f"❌ Error getting all sellers: {str(e)}")
        return jsonify({
            "status": "error",
            "message": "Failed to load sellers: " + str(e)
        }), 500

@app.route("/api/search-sellers", methods=["POST"])
def search_sellers():
    """Search sellers without location (fallback)"""
    try:
        data = request.get_json()
        product = data.get("product")
        
        if not product:
            return jsonify({
                "status": "error",
                "message": "product field is required"
            }), 400
            
        _, _, df = load_model_and_data()
        
        # Filter sellers by product
        product_sellers = df[df['Product'].str.contains(product, case=False, na=False)]
        
        if product_sellers.empty:
            return jsonify({
                "status": "success",
                "sellers": [],
                "message": "No sellers found for the given product"
            })
        
        # Group by seller and aggregate
        sellers = product_sellers.groupby('Seller_ID').agg({
            'Name': 'first',
            'Locality': 'first',
            'Rating': 'mean',
            'Verified': 'first',
            'Price_per_kg': 'mean'
        }).reset_index()
        
        # Ensure no duplicates
        sellers = sellers.drop_duplicates(subset=['Seller_ID'])
        
        # Sort by rating and take top 20
        sellers = sellers.sort_values('Rating', ascending=False).head(20)
        sellers['Score'] = sellers['Rating'] / 5.0
        
        print(f"✅ Found {len(sellers)} unique sellers for product: {product}")
        
        return jsonify({
            "status": "success",
            "sellers": sellers.to_dict(orient="records")
        })
        
    except Exception as e:
        print(f"❌ Error in search sellers: {str(e)}")
        return jsonify({
            "status": "error",
            "message": "Search failed: " + str(e)
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

        # Call your logic to find sellers - INCREASED TO 20 SELLERS
        sellers = get_top_sellers(lat, lon, product, top_n=20)

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