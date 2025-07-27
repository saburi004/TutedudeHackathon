# geo_clustering_model.py - Updated with MongoDB integration

import pandas as pd
import numpy as np
from geopy.distance import geodesic
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
import joblib
from pathlib import Path
import logging
from db_manager import DatabaseManager

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DATA_PATH   = Path("indian_sellers_dataset.csv")  
MODEL_DIR   = Path("models")
MODEL_DIR.mkdir(exist_ok=True)

SCALER_F    = MODEL_DIR / "geo_scaler.pkl"
KMEANS_F    = MODEL_DIR / "geo_kmeans.pkl"
K_CLUSTERS  = 5  # Based on Elbow/Silhouette (will auto-adjust for small datasets)
W_DISTANCE  = 0.4
W_PRICE     = 0.3
W_RATING    = 0.3

def sync_data_from_mongodb():
    """
    Sync latest data from MongoDB to local CSV file
    """
    try:
        db_manager = DatabaseManager()
        success = db_manager.update_csv_from_mongodb(DATA_PATH)
        db_manager.close_connection()
        
        if success:
            logger.info("✅ Data synced from MongoDB to CSV")
            return True
        else:
            logger.warning("⚠️ No data found in MongoDB")
            return False
            
    except Exception as e:
        logger.error(f"❌ Error syncing data from MongoDB: {str(e)}")
        return False

def train_and_save_model(auto_sync=True):
    """
    Train clustering model with latest data
    
    Args:
        auto_sync: If True, sync data from MongoDB before training
    """
    try:
        # Sync data from MongoDB first
        if auto_sync:
            logger.info("🔄 Syncing data from MongoDB...")
            sync_success = sync_data_from_mongodb()
            if not sync_success:
                logger.warning("⚠️ MongoDB sync failed, using existing CSV data")
        
        # Check if CSV file exists
        if not DATA_PATH.exists():
            logger.error(f"❌ Data file not found: {DATA_PATH}")
            raise FileNotFoundError(f"Data file not found: {DATA_PATH}")
        
        # Load data
        df = pd.read_csv(DATA_PATH)
        logger.info(f"📊 Loaded {len(df)} records from CSV")
        
        # Validate required columns
        required_cols = {"Latitude", "Longitude", "Product", "Price_per_kg", "Rating"}
        if not required_cols.issubset(df.columns):
            missing_cols = required_cols - set(df.columns)
            raise ValueError(f"Missing required columns: {missing_cols}")

        # Prepare features for clustering
        X = df[["Latitude", "Longitude"]]
        
        # Handle any missing values
        if X.isnull().any().any():
            logger.warning("⚠️ Found missing values in location data, dropping rows")
            df = df.dropna(subset=["Latitude", "Longitude"])
            X = df[["Latitude", "Longitude"]]
        
        # Adjust number of clusters based on data size
        n_samples = len(df)
        actual_clusters = min(K_CLUSTERS, max(1, n_samples))  # At least 1, at most n_samples
        
        if actual_clusters != K_CLUSTERS:
            logger.warning(f"⚠️ Adjusting clusters from {K_CLUSTERS} to {actual_clusters} due to limited data ({n_samples} samples)")
        
        # Scale features
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)

        # Train KMeans with adjusted cluster count
        kmeans = KMeans(n_clusters=actual_clusters, n_init=min(20, actual_clusters*4), random_state=42)
        cluster_labels = kmeans.fit_predict(X_scaled)
        
        # Add cluster labels to dataframe
        df["Cluster"] = cluster_labels

        # Save models
        joblib.dump(scaler, SCALER_F)
        joblib.dump(kmeans, KMEANS_F)
        
        # Save updated CSV with cluster information
        df.to_csv(DATA_PATH, index=False)

        logger.info("✅ Model trained and saved successfully")
        logger.info(f"📈 Created {actual_clusters} clusters from {len(df)} sellers")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Error training model: {str(e)}")
        raise e

def load_model_and_data():
    """Load trained models and data"""
    try:
        # Check if model files exist
        if not SCALER_F.exists() or not KMEANS_F.exists():
            logger.info("🔄 Model files not found, training new model...")
            train_and_save_model()
        
        scaler = joblib.load(SCALER_F)
        kmeans = joblib.load(KMEANS_F)
        df = pd.read_csv(DATA_PATH)
        
        logger.info(f"✅ Loaded models and {len(df)} seller records")
        return scaler, kmeans, df
        
    except Exception as e:
        logger.error(f"❌ Error loading model and data: {str(e)}")
        raise e

def _norm(series: pd.Series) -> pd.Series:
    """Normalize series to 0-1 range"""
    rng = series.max() - series.min()
    return (series - series.min()) / (rng if rng else 1)

def get_top_sellers(
    buyer_lat: float,
    buyer_lon: float,
    product: str,
    top_n = 20,
    kmeans_model=None,
    scaler_model=None,
    full_df=None
) -> pd.DataFrame:
    """
    Returns top-N sellers for a given buyer location and product.
    Ranking = weighted score of distance, price, rating.
    """
    try:
        # Load models if not provided
        if not all([kmeans_model, scaler_model, full_df is not None]):
            scaler_model, kmeans_model, full_df = load_model_and_data()

        # Check if Cluster column exists, if not, predict clusters
        if 'Cluster' not in full_df.columns:
            logger.warning("⚠️ 'Cluster' column missing, predicting clusters for all data")
            X_all = full_df[["Latitude", "Longitude"]]
            X_all_scaled = scaler_model.transform(X_all)
            full_df['Cluster'] = kmeans_model.predict(X_all_scaled)

        # Predict cluster for buyer location
        buyer_scaled = scaler_model.transform([[buyer_lat, buyer_lon]])
        buyer_cluster = int(kmeans_model.predict(buyer_scaled)[0])
        
        logger.info(f"🎯 Buyer assigned to cluster {buyer_cluster}")

        # Filter candidates: same cluster + same product + in stock
        cand = full_df[
            (full_df["Cluster"] == buyer_cluster) &
            (full_df["Product"].str.lower() == product.lower()) &
            (full_df["Stock_quantity"] > 0)
        ].copy()

        # If no sellers in same cluster, expand search to nearby clusters
        if cand.empty:
            logger.warning(f"⚠️ No sellers found in cluster {buyer_cluster}, expanding search...")
            # Find sellers for the product regardless of cluster
            cand = full_df[
                (full_df["Product"].str.lower() == product.lower()) &
                (full_df["Stock_quantity"] > 0)
            ].copy()
            
            if cand.empty:
                logger.warning(f"⚠️ No sellers found for product: {product}")
                return pd.DataFrame(columns=["Seller_ID", "Name", "Distance_km", "Price_per_kg",
                                             "Rating", "Score"]).assign(Note="No seller found for this product")

        # Calculate distances
        cand["Distance_km"] = cand.apply(
            lambda r: geodesic((buyer_lat, buyer_lon), (r["Latitude"], r["Longitude"])).km,
            axis=1
        )
        
        # Normalize features for scoring
        cand["dist_norm"] = _norm(cand["Distance_km"])
        cand["price_norm"] = _norm(cand["Price_per_kg"])
        cand["rating_norm"] = cand["Rating"] / 5.0

        # Calculate composite score
        cand["Score"] = (
            W_DISTANCE * (1 - cand["dist_norm"]) +  # Lower distance = higher score
            W_PRICE    * (1 - cand["price_norm"]) + # Lower price = higher score
            W_RATING   * cand["rating_norm"]        # Higher rating = higher score
        )

        # Sort by score and return top N
        result = (
            cand.sort_values("Score", ascending=False)
                .head(top_n)
                .loc[:, ["Seller_ID", "Locality", "Name", "Distance_km",
                         "Price_per_kg", "Rating", "Verified", "Score"]]
                .reset_index(drop=True)
        )
        
        logger.info(f"✅ Found {len(result)} sellers for product: {product}")
        return result
        
    except Exception as e:
        logger.error(f"❌ Error getting top sellers: {str(e)}")
        raise e

def retrain_model_with_new_seller(seller_data):
    """
    Add new seller to database and retrain model
    
    Args:
        seller_data: Dictionary containing new seller information
    """
    try:
        # Add seller to MongoDB
        db_manager = DatabaseManager()
        seller_id = db_manager.add_new_seller(seller_data)
        db_manager.close_connection()
        
        logger.info(f"✅ Added new seller with ID: {seller_id}")
        
        # Retrain model with updated data
        logger.info("🔄 Retraining model with new data...")
        train_and_save_model(auto_sync=True)
        
        logger.info("✅ Model retrained successfully with new seller data")
        return seller_id
        
    except Exception as e:
        logger.error(f"❌ Error adding seller and retraining model: {str(e)}")
        raise e

if __name__ == "__main__":
    # Initial setup: upload CSV to MongoDB and train model
    print("🚀 Starting initial setup...")
    
    try:
        # Upload existing CSV to MongoDB (one-time setup)
        if DATA_PATH.exists():
            print("📤 Uploading existing CSV to MongoDB...")
            db_manager = DatabaseManager()
            db_manager.upload_csv_to_mongodb(DATA_PATH)
            db_manager.close_connection()
        
        # Train model
        print("🎯 Training clustering model...")
        train_and_save_model()
        
        print("✅ Setup completed successfully!")
        
        # Test example
        # print("\n🧪 Testing with sample query...")
        # lat, lon = 18.5018, 73.8586  # Swargate coordinates
        # product = "Potatoes"
        
        # result = get_top_sellers(lat, lon, product, top_n=5)
        # print(f"\n📊 Top 5 sellers for {product} near Swargate:")
        # print(result)
        
    except Exception as e:
        print(f"❌ Setup failed: {str(e)}")