"""
MongoDB Database Manager for SwaadAI Seller Clustering
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
        
        # Test 1: Check connection
        print("🧪 Test 1: Connection Status")
        count = db_manager.get_seller_count()
        print(f"Current sellers in database: {count}")
        
        # Test 2: Add a sample seller
        print("\n🧪 Test 2: Adding Sample Seller")
        sample_seller = {
            "Seller_ID": "TEST_001",
            "Name": "Test Seller",
            "Email": "test@example.com",
            "Mobile": "9999999999",
            "Locality": "Test Area",
            "Latitude": 18.5204,
            "Longitude": 73.8567,
            "Product": "Tomatoes",
            "Price_per_kg": 25.0,
            "Stock_quantity": 100,
            "Rating": 4.5,
            "Verified": True
        }
        
        seller_id = db_manager.add_new_seller(sample_seller)
        print(f"Added seller with ID: {seller_id}")
        
        # Test 3: Retrieve data as DataFrame
        print("\n🧪 Test 3: Retrieving Data")
        df = db_manager.get_all_sellers_as_dataframe()
        print(f"Retrieved {len(df)} sellers")
        print("Sample data:")
        print(df.head())
        
        # Clean up test data
        db_manager.collection.delete_one({"Seller_ID": "TEST_001"})
        print("\n🧹 Cleaned up test data")
        
        db_manager.close_connection()
        print("\n✅ All tests passed!")
        
    except Exception as e:
        print(f"❌ Test failed: {str(e)}")

if __name__ == "__main__":
    test_database_operations()