"""
Enhanced MongoDB Database Manager for SwaadAI Seller Clustering
Handles CRUD operations and data synchronization with clustering model
"""

import pandas as pd
import pymongo
from pymongo import MongoClient
import os
from datetime import datetime
import logging
from pathlib import Path
from dotenv import load_dotenv 

load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DatabaseManager:
    def __init__(self, connection_string=None):
        """
        Initialize MongoDB connection
        
        Args:
            connection_string: MongoDB Atlas connection string
                              If None, will try to get from environment variable MONGODB_URI
        """
        self.connection_string = connection_string or os.getenv('MONGODB_URI')
        if not self.connection_string:
            raise ValueError("MongoDB connection string not provided. Set MONGODB_URI environment variable or pass connection_string parameter.")
        
        self.client = None
        self.db = None
        self.collection = None
        self.connect()
    
    def connect(self):
        """Establish connection to MongoDB Atlas"""
        try:
            self.client = MongoClient(self.connection_string)
            # Test connection
            self.client.admin.command('ping')
            
            # Set database and collection
            self.db = self.client['swaadai_db']
            self.collection = self.db['sellers']
            
            logger.info("✅ Successfully connected to MongoDB Atlas")
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to connect to MongoDB: {str(e)}")
            raise e
    
    def upload_csv_to_mongodb(self, csv_file_path):
        """
        Upload CSV data to MongoDB collection
        
        Args:
            csv_file_path: Path to the CSV file
        """
        try:
            # Read CSV file
            df = pd.read_csv(csv_file_path)
            logger.info(f"📁 Read {len(df)} records from {csv_file_path}")
            
            # Add metadata
            df['created_at'] = datetime.utcnow()
            df['updated_at'] = datetime.utcnow()
            
            # Convert DataFrame to dictionary records
            records = df.to_dict('records')
            
            # Clear existing data (optional - remove this line if you want to append)
            self.collection.delete_many({})
            logger.info("🗑️ Cleared existing data")
            
            # Insert records
            result = self.collection.insert_many(records)
            logger.info(f"✅ Successfully uploaded {len(result.inserted_ids)} records to MongoDB")
            
            return len(result.inserted_ids)
            
        except Exception as e:
            logger.error(f"❌ Error uploading CSV to MongoDB: {str(e)}")
            raise e
    
    def add_new_seller(self, seller_data):
        """
        Add a new seller to the database
        
        Args:
            seller_data: Dictionary containing seller information
        """
        try:
            # Add timestamps
            seller_data['created_at'] = datetime.utcnow()
            seller_data['updated_at'] = datetime.utcnow()
            
            # Insert seller
            result = self.collection.insert_one(seller_data)
            logger.info(f"✅ New seller added with ID: {result.inserted_id}")
            
            return str(result.inserted_id)
            
        except Exception as e:
            logger.error(f"❌ Error adding new seller: {str(e)}")
            raise e
    
    def add_multiple_seller_records(self, seller_records):
        """
        Add multiple seller records (e.g., one seller with multiple products)
        
        Args:
            seller_records: List of dictionaries containing seller information
        """
        try:
            # Add timestamps to all records
            for record in seller_records:
                record['created_at'] = datetime.utcnow()
                record['updated_at'] = datetime.utcnow()
            
            # Insert all records
            result = self.collection.insert_many(seller_records)
            logger.info(f"✅ Added {len(result.inserted_ids)} seller records")
            
            return [str(id) for id in result.inserted_ids]
            
        except Exception as e:
            logger.error(f"❌ Error adding multiple seller records: {str(e)}")
            raise e
    
    def get_seller_by_id(self, seller_id):
        """
        Get all records for a specific seller
        
        Args:
            seller_id: The Seller_ID to search for
        """
        try:
            records = list(self.collection.find({"Seller_ID": seller_id}))
            
            if not records:
                return None
            
            # Convert ObjectId to string for JSON serialization
            for record in records:
                record['_id'] = str(record['_id'])
            
            logger.info(f"📊 Found {len(records)} records for seller: {seller_id}")
            return records
            
        except Exception as e:
            logger.error(f"❌ Error getting seller by ID: {str(e)}")
            raise e
    
    def update_seller_profile(self, seller_id, update_data):
        """
        Update seller profile information
        
        Args:
            seller_id: The Seller_ID to update
            update_data: Dictionary with fields to update
        """
        try:
            # Add update timestamp
            update_data['updated_at'] = datetime.utcnow()
            
            # Update all records for this seller
            result = self.collection.update_many(
                {"Seller_ID": seller_id},
                {"$set": update_data}
            )
            
            logger.info(f"✅ Updated {result.modified_count} records for seller: {seller_id}")
            return result.modified_count
            
        except Exception as e:
            logger.error(f"❌ Error updating seller profile: {str(e)}")
            raise e
    
    def get_sellers_by_product(self, product_name):
        """
        Get all sellers for a specific product
        
        Args:
            product_name: Name of the product to search for
        """
        try:
            # Case-insensitive search
            records = list(self.collection.find({
                "Product": {"$regex": product_name, "$options": "i"}
            }))
            
            if not records:
                return []
            
            # Convert to DataFrame for easier processing
            df = pd.DataFrame(records)
            return df
            
        except Exception as e:
            logger.error(f"❌ Error getting sellers by product: {str(e)}")
            raise e
    
    def get_sellers_near_location(self, latitude, longitude, radius_km=10):
        """
        Get sellers within a specific radius of a location
        
        Args:
            latitude: Latitude of the center point
            longitude: Longitude of the center point
            radius_km: Radius in kilometers (default 10km)
        """
        try:
            # MongoDB geospatial query (requires geospatial index)
            # For now, we'll use a simple bounding box approach
            
            # Approximate degrees per km (rough calculation)
            lat_degree_per_km = 1 / 111.0
            lon_degree_per_km = 1 / (111.0 * abs(latitude))
            
            lat_range = radius_km * lat_degree_per_km
            lon_range = radius_km * lon_degree_per_km
            
            query = {
                "Latitude": {
                    "$gte": latitude - lat_range,
                    "$lte": latitude + lat_range
                },
                "Longitude": {
                    "$gte": longitude - lon_range,
                    "$lte": longitude + lon_range
                }
            }
            
            records = list(self.collection.find(query))
            
            if not records:
                return pd.DataFrame()
            
            df = pd.DataFrame(records)
            logger.info(f"📍 Found {len(df)} sellers within {radius_km}km of ({latitude}, {longitude})")
            
            return df
            
        except Exception as e:
            logger.error(f"❌ Error getting sellers near location: {str(e)}")
            raise e
    
    def get_all_sellers_as_dataframe(self):
        """
        Retrieve all sellers from MongoDB as pandas DataFrame
        
        Returns:
            pandas.DataFrame: All seller data
        """
        try:
            # Get all documents
            cursor = self.collection.find({})
            data = list(cursor)
            
            if not data:
                logger.warning("⚠️ No sellers found in database")
                return pd.DataFrame()
            
            # Convert to DataFrame
            df = pd.DataFrame(data)
            
            # Remove MongoDB's _id field for CSV compatibility
            if '_id' in df.columns:
                df = df.drop('_id', axis=1)
            
            logger.info(f"📊 Retrieved {len(df)} sellers from database")
            return df
            
        except Exception as e:
            logger.error(f"❌ Error retrieving sellers: {str(e)}")
            raise e
    
    def update_csv_from_mongodb(self, csv_file_path):
        """
        Update local CSV file with latest data from MongoDB
        
        Args:
            csv_file_path: Path where to save the updated CSV
        """
        try:
            df = self.get_all_sellers_as_dataframe()
            
            if df.empty:
                logger.warning("⚠️ No data to save to CSV")
                return False
            
            # Remove timestamp columns for model compatibility
            columns_to_remove = ['created_at', 'updated_at']
            df = df.drop(columns=[col for col in columns_to_remove if col in df.columns])
            
            # Save to CSV
            df.to_csv(csv_file_path, index=False)
            logger.info(f"✅ CSV file updated with {len(df)} records at {csv_file_path}")
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Error updating CSV from MongoDB: {str(e)}")
            raise e
    
    def get_seller_count(self):
        """Get total number of sellers in database"""
        try:
            count = self.collection.count_documents({})
            return count
        except Exception as e:
            logger.error(f"❌ Error getting seller count: {str(e)}")
            return 0
    
    def get_unique_seller_count(self):
        """Get count of unique sellers (by Seller_ID)"""
        try:
            unique_sellers = self.collection.distinct("Seller_ID")
            return len(unique_sellers)
        except Exception as e:
            logger.error(f"❌ Error getting unique seller count: {str(e)}")
            return 0
    
    def get_database_stats(self):
        """Get comprehensive database statistics"""
        try:
            stats = {
                "total_records": self.collection.count_documents({}),
                "unique_sellers": len(self.collection.distinct("Seller_ID")),
                "unique_products": len(self.collection.distinct("Product")),
                "verified_sellers": self.collection.count_documents({"Verified": True}),
                "average_rating": 0,
                "total_stock": 0
            }
            
            # Calculate average rating and total stock
            pipeline = [
                {
                    "$group": {
                        "_id": None,
                        "avg_rating": {"$avg": "$Rating"},
                        "total_stock": {"$sum": "$Stock_quantity"}
                    }
                }
            ]
            
            result = list(self.collection.aggregate(pipeline))
            if result:
                stats["average_rating"] = round(result[0].get("avg_rating", 0), 2)
                stats["total_stock"] = result[0].get("total_stock", 0)
            
            return stats
            
        except Exception as e:
            logger.error(f"❌ Error getting database stats: {str(e)}")
            return {}
    
    def delete_seller(self, seller_id):
        """Delete all records for a specific seller"""
        try:
            result = self.collection.delete_many({"Seller_ID": seller_id})
            logger.info(f"🗑️ Deleted {result.deleted_count} records for seller: {seller_id}")
            return result.deleted_count
        except Exception as e:
            logger.error(f"❌ Error deleting seller: {str(e)}")
            raise e
    
    def close_connection(self):
        """Close MongoDB connection"""
        if self.client:
            self.client.close()
            logger.info("🔌 MongoDB connection closed")

# Example usage and testing functions
def test_database_operations():
    """Test all database operations"""
    try:
        # Initialize database manager
        db_manager = DatabaseManager()
        
        # Test 1: Check connection and stats
        print("🧪 Test 1: Database Stats")
        stats = db_manager.get_database_stats()
        print(f"Database Stats: {stats}")
        
        # Test 2: Add a sample seller with multiple products
        print("\n🧪 Test 2: Adding Sample Seller with Multiple Products")
        seller_records = [
            {
                "Seller_ID": "TEST_MULTI_001",
                "Name": "Test Multi Seller",
                "Email": "testmulti@example.com",
                "Mobile": "9999999999",
                "Locality": "Test Area",
                "Latitude": 18.5204,
                "Longitude": 73.8567,
                "Product": "Tomatoes",
                "Price_per_kg": 25.0,
                "Stock_quantity": 100,
                "Rating": 4.5,
                "Verified": True
            },
            {
                "Seller_ID": "TEST_MULTI_001",
                "Name": "Test Multi Seller",
                "Email": "testmulti@example.com",
                "Mobile": "9999999999",
                "Locality": "Test Area",
                "Latitude": 18.5204,
                "Longitude": 73.8567,
                "Product": "Onions",
                "Price_per_kg": 20.0,
                "Stock_quantity": 50,
                "Rating": 4.5,
                "Verified": True
            }
        ]
        
        record_ids = db_manager.add_multiple_seller_records(seller_records)
        print(f"Added records with IDs: {record_ids}")
        
        # Test 3: Get seller by ID
        print("\n🧪 Test 3: Getting Seller by ID")
        seller_data = db_manager.get_seller_by_id("TEST_MULTI_001")
        print(f"Found {len(seller_data)} records for seller")
        
        # Clean up test data
        db_manager.delete_seller("TEST_MULTI_001")
        print("\n🧹 Cleaned up test data")
        
        db_manager.close_connection()
        print("\n✅ All tests passed!")
        
    except Exception as e:
        print(f"❌ Test failed: {str(e)}")

if __name__ == "__main__":
    test_database_operations()