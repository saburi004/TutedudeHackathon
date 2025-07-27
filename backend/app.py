# app.py - Updated with MongoDB integration

from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
from geo_clustering_model import get_top_sellers, load_model_and_data, retrain_model_with_new_seller
from db_manager import DatabaseManager
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend access

@app.route("/")
def home():
    return "✅ SwaadAI Backend Running with MongoDB Integration!"

@app.route("/api/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    try:
        # Test database connection
        db_manager = DatabaseManager()
        seller_count = db_manager.get_seller_count()
        db_manager.close_connection()
        
        return jsonify({
            "status": "healthy",
            "database": "connected",
            "total_sellers": seller_count,
            "message": "All systems operational"
        })
    except Exception as e:
        return jsonify({
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e)
        }), 500

@app.route("/api/get-products", methods=["GET"])
def get_products():
    """Get list of available products from MongoDB"""
    try:
        db_manager = DatabaseManager()
        df = db_manager.get_all_sellers_as_dataframe()
        db_manager.close_connection()
        
        if df.empty:
            return jsonify({
                "status": "success",
                "products": [],
                "total_count": 0,
                "message": "No products available"
            })
        
        products = sorted(df['Product'].unique().tolist())
        
        return jsonify({
            "status": "success",
            "products": products,
            "total_count": len(products)
        })
    except Exception as e:
        logger.error(f"❌ Error getting products: {str(e)}")
        return jsonify({
            "status": "error",
            "message": "Failed to load products: " + str(e)
        }), 500

@app.route("/api/get-initial-sellers", methods=["GET"])
def get_initial_sellers():
    """Get initial sellers from MongoDB with debugging"""
    try:
        logger.info("🔍 Starting get_initial_sellers...")
        
        db_manager = DatabaseManager()
        df = db_manager.get_all_sellers_as_dataframe()
        db_manager.close_connection()
        
        logger.info(f"📊 Retrieved DataFrame with shape: {df.shape}")
        logger.info(f"📋 Columns: {list(df.columns)}")
        
        if df.empty:
            logger.warning("⚠️ DataFrame is empty!")
            return jsonify({
                "status": "success",
                "sellers": [],
                "total_count": 0,
                "message": "No sellers available in database"
            })
        
        # Log first few records for debugging
        logger.info("📝 First record:")
        if len(df) > 0:
            first_record = df.iloc[0].to_dict()
            for key, value in first_record.items():
                logger.info(f"  {key}: {value} (type: {type(value)})")
        
        # Simple conversion - just take all records as they are
        sellers_list = []
        
        for index, row in df.iterrows():
            seller_dict = {}
            
            # Safely convert each field
            for col in df.columns:
                value = row[col]
                if pd.isna(value):
                    seller_dict[col] = None
                elif isinstance(value, (int, float, str, bool)):
                    seller_dict[col] = value
                else:
                    seller_dict[col] = str(value)
            
            # Ensure Seller_ID exists
            if 'Seller_ID' not in seller_dict or seller_dict['Seller_ID'] is None:
                seller_dict['Seller_ID'] = f"SELLER_{index}"
            
            sellers_list.append(seller_dict)
            
            # Limit to 30 for initial display
            if len(sellers_list) >= 30:
                break
        
        logger.info(f"✅ Returning {len(sellers_list)} sellers")
        logger.info(f"📋 Sample seller: {sellers_list[0] if sellers_list else 'None'}")
        
        return jsonify({
            "status": "success",
            "sellers": sellers_list,
            "total_count": len(sellers_list)
        })
        
    except Exception as e:
        logger.error(f"❌ Error in get_initial_sellers: {str(e)}")
        return jsonify({
            "status": "error",
            "message": f"Failed to load sellers: {str(e)}",
            "sellers": [],
            "total_count": 0
        }), 500

@app.route("/api/register-seller", methods=["POST"])
def register_seller():
    """Register a new seller and retrain the model"""
    try:
        data = request.get_json()
        logger.info(f"📨 New seller registration data: {data}")

        if not data:
            return jsonify({"status": "error", "message": "Missing JSON body"}), 400

        # Validate required fields
        required_fields = ['Name', 'Email', 'Mobile', 'Locality', 'Latitude', 'Longitude', 
                          'Product', 'Price_per_kg', 'Stock_quantity']
        
        missing_fields = [field for field in required_fields if field not in data or data[field] is None]
        if missing_fields:
            return jsonify({
                "status": "error",
                "message": f"Missing required fields: {missing_fields}"
            }), 400

        # Add default values for optional fields
        seller_data = {
            "Seller_ID": data.get('Seller_ID') or f"SELLER_{pd.Timestamp.now().strftime('%Y%m%d_%H%M%S')}",
            "Name": data['Name'],
            "Email": data['Email'],
            "Mobile": data['Mobile'],
            "Locality": data['Locality'],
            "Latitude": float(data['Latitude']),
            "Longitude": float(data['Longitude']),
            "Product": data['Product'],
            "Price_per_kg": float(data['Price_per_kg']),
            "Stock_quantity": int(data['Stock_quantity']),
            "Rating": data.get('Rating', 4.0),  # Default rating
            "Verified": data.get('Verified', False)  # Default not verified
        }

        # Add seller and retrain model
        seller_id = retrain_model_with_new_seller(seller_data)
        
        return jsonify({
            "status": "success",
            "message": "Seller registered successfully and model updated",
            "seller_id": seller_id
        })

    except ValueError as ve:
        logger.error(f"❌ Value Error: {str(ve)}")
        return jsonify({
            "status": "error",
            "message": f"Invalid input data: {str(ve)}"
        }), 400

    except Exception as e:
        logger.error(f"❌ Server Error: {str(e)}")
        return jsonify({
            "status": "error",
            "message": "Registration failed: " + str(e)
        }), 500

@app.route("/api/search-sellers", methods=["POST"])
def search_sellers():
    """Search sellers without location (fallback) from MongoDB"""
    try:
        data = request.get_json()
        product = data.get("product")
        
        if not product:
            return jsonify({
                "status": "error",
                "message": "product field is required"
            }), 400
            
        db_manager = DatabaseManager()
        df = db_manager.get_all_sellers_as_dataframe()
        db_manager.close_connection()
        
        if df.empty:
            return jsonify({
                "status": "success",
                "sellers": [],
                "message": "No sellers available in database"
            })
        
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
        
        logger.info(f"✅ Found {len(sellers)} unique sellers for product: {product}")
        
        return jsonify({
            "status": "success",
            "sellers": sellers.to_dict(orient="records")
        })
        
    except Exception as e:
        logger.error(f"❌ Error in search sellers: {str(e)}")
        return jsonify({
            "status": "error",
            "message": "Search failed: " + str(e)
        }), 500

@app.route("/api/get-sellers", methods=["POST"])
def get_sellers():
    """Get top sellers based on location and clustering"""
    try:
        data = request.get_json()
        logger.info(f"📨 Incoming location-based search: {data}")

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

        logger.info(f"📍 Searching for sellers at ({lat}, {lon}) for product: {product}")

        # Call clustering model to find sellers
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
        logger.error(f"❌ Value Error: {str(ve)}")
        return jsonify({
            "status": "error",
            "message": f"Invalid input data: {str(ve)}"
        }), 400

    except FileNotFoundError as fe:
        logger.error(f"❌ File Error: {str(fe)}")
        return jsonify({
            "status": "error",
            "message": "Model files not found. Please train the model first."
        }), 500

    except Exception as e:
        logger.error(f"❌ Server Error: {str(e)}")
        return jsonify({
            "status": "error",
            "message": "Internal server error: " + str(e)
        }), 500

@app.route("/api/retrain-model", methods=["POST"])
def retrain_model():
    """Manually trigger model retraining"""
    try:
        from geo_clustering_model import train_and_save_model
        
        logger.info("🔄 Manual model retraining triggered")
        train_and_save_model(auto_sync=True)
        
        return jsonify({
            "status": "success",
            "message": "Model retrained successfully"
        })
        
    except Exception as e:
        logger.error(f"❌ Error retraining model: {str(e)}")
        return jsonify({
            "status": "error",
            "message": "Model retraining failed: " + str(e)
        }), 500

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)