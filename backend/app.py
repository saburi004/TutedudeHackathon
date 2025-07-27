# Updated app.py with enhanced seller registration for multiple products

from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
from geo_clustering_model import get_top_sellers, load_model_and_data, retrain_model_with_new_seller
from db_manager import DatabaseManager
import logging
from datetime import datetime

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
    """Register a new seller with multiple products and store in MongoDB"""
    try:
        data = request.get_json()
        logger.info(f"📨 New seller registration data: {data}")

        if not data:
            return jsonify({"status": "error", "message": "Missing JSON body"}), 400

        # Validate required fields
        required_fields = ['Name', 'Email', 'Mobile', 'Locality', 'Latitude', 'Longitude', 'Products']
        
        missing_fields = [field for field in required_fields if field not in data or data[field] is None]
        if missing_fields:
            return jsonify({
                "status": "error",
                "message": f"Missing required fields: {missing_fields}"
            }), 400

        # Validate products array
        if not isinstance(data['Products'], list) or len(data['Products']) == 0:
            return jsonify({
                "status": "error",
                "message": "At least one product is required"
            }), 400

        # Initialize database manager
        db_manager = DatabaseManager()
        
        # Generate unique seller ID
        seller_id = f"SELLER_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{data['Name'].replace(' ', '_')}"
        
        # Create multiple records - one for each product
        seller_records = []
        
        for product in data['Products']:
            if not all(key in product for key in ['Product', 'Price_per_kg', 'Stock_quantity']):
                db_manager.close_connection()
                return jsonify({
                    "status": "error",
                    "message": "Each product must have Product, Price_per_kg, and Stock_quantity"
                }), 400
            
            # Create seller record for this product
            seller_record = {
                "Seller_ID": seller_id,
                "Name": data['Name'],
                "Email": data['Email'],
                "Mobile": str(data['Mobile']),
                "Locality": data['Locality'],
                "Latitude": float(data['Latitude']),
                "Longitude": float(data['Longitude']),
                "Product": product['Product'],
                "Price_per_kg": float(product['Price_per_kg']),
                "Stock_quantity": int(product['Stock_quantity']),
                "Rating": data.get('Rating', 4.0),  # Default rating
                "Verified": data.get('Verified', False),  # Default not verified
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            
            seller_records.append(seller_record)
        
        # Insert all records to MongoDB
        result = db_manager.collection.insert_many(seller_records)
        db_manager.close_connection()
        
        logger.info(f"✅ Successfully added {len(result.inserted_ids)} product records for seller: {seller_id}")
        
        # Update CSV file for model retraining
        try:
            # Get updated data and save to CSV
            db_manager = DatabaseManager()
            db_manager.update_csv_from_mongodb('seller_data.csv')  # Update your CSV file path
            db_manager.close_connection()
            
            # Optionally retrain model
            # retrain_model_with_new_seller(seller_records[0])  # Use first record for model training
            
        except Exception as model_error:
            logger.warning(f"⚠️ Model update failed: {str(model_error)}")
            # Don't fail the registration if model update fails
        
        return jsonify({
            "status": "success",
            "message": f"Seller registered successfully with {len(seller_records)} products",
            "seller_id": seller_id,
            "products_added": len(seller_records)
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

# Additional endpoint to get seller by ID (for your existing raw-sellers API)
@app.route("/api/raw-sellers/update/<seller_id>", methods=["GET", "PUT"])
def handle_raw_seller(seller_id):
    """Handle existing raw seller API calls"""
    try:
        if request.method == "GET":
            # Return mock data for now - you can enhance this to fetch from MongoDB
            return jsonify({
                "success": True,
                "seller": {
                    "id": seller_id,
                    "name": f"Seller {seller_id}",
                    "email": f"seller_{seller_id}@example.com",
                    "location": None,
                    "availableMaterials": []
                }
            })
        
        elif request.method == "PUT":
            # Handle profile updates - this will be called by your existing form
            data = request.get_json()
            logger.info(f"📝 Updating raw seller profile: {seller_id}")
            
            # You can implement the update logic here if needed
            # For now, just return success
            return jsonify({
                "success": True,
                "message": "Profile updated successfully"
            })
            
    except Exception as e:
        logger.error(f"❌ Error handling raw seller: {str(e)}")
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)