# """
# MongoDB Atlas Connectivity Test
# Tests all database operations and model integration
# """

# import os
# import pandas as pd
# from datetime import datetime
# import sys
# from pathlib import Path

# # Add current directory to path to import local modules
# sys.path.append(str(Path(__file__).parent))

# try:
#     from db_manager import DatabaseManager
#     from geo_clustering_model import train_and_save_model, get_top_sellers, retrain_model_with_new_seller
# except ImportError as e:
#     print(f"❌ Import Error: {e}")
#     print("Make sure db_manager.py and geo_clustering_model.py are in the same directory")
#     sys.exit(1)

# def test_mongodb_connection():
#     """Test 1: Basic MongoDB connection"""
#     print("🧪 Test 1: MongoDB Connection")
#     print("-" * 40)
    
#     try:
#         # Test with environment variable
#         if not os.getenv('MONGODB_URI'):
#             print("⚠️  MONGODB_URI environment variable not set")
#             print("Setting example connection string for testing...")
#             # You need to replace this with your actual MongoDB Atlas connection string
#             test_uri = "mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority"
#             print(f"Please set MONGODB_URI environment variable to: {test_uri}")
#             return False
        
#         db_manager = DatabaseManager()
#         count = db_manager.get_seller_count()
#         db_manager.close_connection()
        
#         print(f"✅ Connection successful!")
#         print(f"📊 Current sellers in database: {count}")
#         return True
        
#     except Exception as e:
#         print(f"❌ Connection failed: {str(e)}")
#         return False

# def test_csv_upload():
#     """Test 2: CSV Upload to MongoDB"""
#     print("\n🧪 Test 2: CSV Upload")
#     print("-" * 40)
    
#     try:
#         # Create sample CSV if it doesn't exist
#         csv_file = "test_sellers.csv"
#         if not Path(csv_file).exists():
#             print("📝 Creating sample CSV file...")
#             sample_data = {
#                 'Seller_ID': ['S001', 'S002', 'S003'],
#                 'Name': ['Test Seller 1', 'Test Seller 2', 'Test Seller 3'],
#                 'Email': ['seller1@test.com', 'seller2@test.com', 'seller3@test.com'],
#                 'Mobile': ['9999999001', '9999999002', '9999999003'],
#                 'Locality': ['Pune Area 1', 'Pune Area 2', 'Mumbai Area 1'],
#                 'Latitude': [18.5204, 18.5304, 19.0760],
#                 'Longitude': [73.8567, 73.8467, 72.8777],
#                 'Product': ['Tomatoes', 'Potatoes', 'Onions'],
#                 'Price_per_kg': [30.0, 25.0, 35.0],
#                 'Stock_quantity': [100, 150, 80],
#                 'Rating': [4.2, 4.5, 4.0],
#                 'Verified': [True, True, False]
#             }
#             df = pd.DataFrame(sample_data)
#             df.to_csv(csv_file, index=False)
#             print(f"✅ Created sample CSV: {csv_file}")
        
#         # Upload to MongoDB
#         db_manager = DatabaseManager()
#         uploaded_count = db_manager.upload_csv_to_mongodb(csv_file)
#         db_manager.close_connection()
        
#         print(f"✅ Uploaded {uploaded_count} records to MongoDB")
        
#         # Clean up test file
#         Path(csv_file).unlink()
#         print("🧹 Cleaned up test CSV file")
        
#         return True
        
#     except Exception as e:
#         print(f"❌ CSV upload failed: {str(e)}")
#         return False

# def test_add_new_seller():
#     """Test 3: Add New Seller"""
#     print("\n🧪 Test 3: Add New Seller")
#     print("-" * 40)
    
#     try:
#         new_seller = {
#             "Seller_ID": f"TEST_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
#             "Name": "Test New Seller",
#             "Email": "newseller@test.com",
#             "Mobile": "9876543210",
#             "Locality": "Test Locality",
#             "Latitude": 18.5018,
#             "Longitude": 73.8586,
#             "Product": "Carrots",
#             "Price_per_kg": 40.0,
#             "Stock_quantity": 120,
#             "Rating": 4.3,
#             "Verified": True
#         }
        
#         db_manager = DatabaseManager()
#         seller_id = db_manager.add_new_seller(new_seller)
        
#         # Verify the seller was added
#         df = db_manager.get_all_sellers_as_dataframe()
#         added_seller = df[df['Seller_ID'] == new_seller['Seller_ID']]
        
#         db_manager.close_connection()
        
#         if not added_seller.empty:
#             print(f"✅ Successfully added seller with ID: {seller_id}")
#             print(f"📊 Seller details: {new_seller['Name']} - {new_seller['Product']}")
#             return True, new_seller['Seller_ID']
#         else:
#             print("❌ Seller was not found after adding")
#             return False, None
            
#     except Exception as e:
#         print(f"❌ Add seller failed: {str(e)}")
#         return False, None

# def test_data_retrieval():
#     """Test 4: Data Retrieval"""
#     print("\n🧪 Test 4: Data Retrieval")
#     print("-" * 40)
    
#     try:
#         db_manager = DatabaseManager()
#         df = db_manager.get_all_sellers_as_dataframe()
#         db_manager.close_connection()
        
#         print(f"✅ Retrieved {len(df)} sellers from database")
#         if not df.empty:
#             print("📊 Sample data:")
#             print(df[['Name', 'Product', 'Price_per_kg', 'Rating']].head())
#             print(f"\n📈 Products available: {df['Product'].unique().tolist()}")
        
#         return True, df
        
#     except Exception as e:
#         print(f"❌ Data retrieval failed: {str(e)}")
#         return False, None

# def test_model_training():
#     """Test 5: Model Training"""
#     print("\n🧪 Test 5: Model Training")
#     print("-" * 40)
    
#     try:
#         print("🎯 Training clustering model...")
#         success = train_and_save_model(auto_sync=True)
        
#         if success:
#             print("✅ Model training completed successfully")
            
#             # Check if model files were created
#             from pathlib import Path
#             model_dir = Path("models")
#             scaler_file = model_dir / "geo_scaler.pkl"
#             kmeans_file = model_dir / "geo_kmeans.pkl"
            
#             if scaler_file.exists() and kmeans_file.exists():
#                 print("✅ Model files created successfully")
#                 return True
#             else:
#                 print("❌ Model files not found")
#                 return False
#         else:
#             print("❌ Model training failed")
#             return False
            
#     except Exception as e:
#         print(f"❌ Model training error: {str(e)}")
#         return False

# def test_seller_search():
#     """Test 6: Seller Search with Clustering"""
#     print("\n🧪 Test 6: Seller Search")
#     print("-" * 40)
    
#     try:
#         # Test coordinates (Pune)
#         test_lat, test_lon = 18.5204, 73.8567
#         test_product = "Tomatoes"
        
#         print(f"🔍 Searching for '{test_product}' near coordinates ({test_lat}, {test_lon})")
        
#         result = get_top_sellers(test_lat, test_lon, test_product, top_n=5)
        
#         if not result.empty:
#             print(f"✅ Found {len(result)} sellers")
#             print("📊 Top sellers:")
#             print(result[['Name', 'Distance_km', 'Price_per_kg', 'Rating', 'Score']].to_string(index=False))
#         else:
#             print("⚠️ No sellers found (this might be normal if database is empty)")
        
#         return True
        
#     except Exception as e:
#         print(f"❌ Seller search failed: {str(e)}")
#         return False

# def test_end_to_end_workflow():
#     """Test 7: Complete workflow - Add seller and retrain"""
#     print("\n🧪 Test 7: End-to-End Workflow")
#     print("-" * 40)
    
#     try:
#         # Create a new seller
#         workflow_seller = {
#             "Seller_ID": f"WORKFLOW_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
#             "Name": "Workflow Test Seller",
#             "Email": "workflow@test.com",
#             "Mobile": "9999888777",
#             "Locality": "Workflow Test Area",
#             "Latitude": 18.5100,
#             "Longitude": 73.8500,
#             "Product": "Cabbage",
#             "Price_per_kg": 20.0,
#             "Stock_quantity": 200,
#             "Rating": 4.8,
#             "Verified": True
#         }
        
#         print("🔄 Adding seller and retraining model...")
#         seller_id = retrain_model_with_new_seller(workflow_seller)
        
#         print(f"✅ Seller added and model retrained. Seller ID: {seller_id}")
        
#         # Test search for the new seller
#         print("🔍 Testing search for new seller...")
#         result = get_top_sellers(18.5100, 73.8500, "Cabbage", top_n=5)
        
#         if not result.empty:
#             # Check if our new seller appears in results
#             new_seller_found = workflow_seller['Name'] in result['Name'].values
#             if new_seller_found:
#                 print("✅ New seller found in search results!")
#             else:
#                 print("⚠️ New seller not found in search results (might be in different cluster)")
        
#         return True
        
#     except Exception as e:
#         print(f"❌ End-to-end workflow failed: {str(e)}")
#         return False

# def cleanup_test_data():
#     """Clean up test data"""
#     print("\n🧹 Cleaning up test data...")
#     print("-" * 40)
    
#     try:
#         db_manager = DatabaseManager()
        
#         # Remove test sellers
#         test_patterns = ["TEST_", "WORKFLOW_", "Test Seller", "Test New Seller", "Workflow Test Seller"]
        
#         deleted_count = 0
#         for pattern in test_patterns:
#             result = db_manager.collection.delete_many({
#                 "$or": [
#                     {"Seller_ID": {"$regex": pattern}},
#                     {"Name": {"$regex": pattern}}
#                 ]
#             })
#             deleted_count += result.deleted_count
        
#         db_manager.close_connection()
        
#         if deleted_count > 0:
#             print(f"✅ Cleaned up {deleted_count} test records")
#         else:
#             print("ℹ️ No test records to clean up")
        
#         return True
        
#     except Exception as e:
#         print(f"❌ Cleanup failed: {str(e)}")
#         return False

# def main():
#     """Run all tests"""
#     print("🚀 SwaadAI MongoDB Integration Test Suite")
#     print("=" * 50)
    
#     # Check environment
#     if not os.getenv('MONGODB_URI'):
#         print("\n⚠️ IMPORTANT: Set your MongoDB Atlas connection string")
#         print("Run: export MONGODB_URI='mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority'")
#         print("Replace <username>, <password>, <cluster>, and <database> with your actual values")
#         print("\nFor testing purposes, you can also modify the connection string in this file")
#         return
    
#     test_results = []
    
#     # Run tests
#     test_results.append(("MongoDB Connection", test_mongodb_connection()))
#     test_results.append(("CSV Upload", test_csv_upload()))
#     test_results.append(("Add New Seller", test_add_new_seller()[0]))
#     test_results.append(("Data Retrieval", test_data_retrieval()[0]))
#     test_results.append(("Model Training", test_model_training()))
#     test_results.append(("Seller Search", test_seller_search()))
#     test_results.append(("End-to-End Workflow", test_end_to_end_workflow()))
    
#     # Clean up
#     cleanup_test_data()
    
#     # Summary
#     print("\n📋 Test Results Summary")
#     print("=" * 50)
#     passed = 0
#     for test_name, result in test_results:
#         status = "✅ PASSED" if result else "❌ FAILED"
#         print(f"{test_name:<25} {status}")
#         if result:
#             passed += 1
    
#     print(f"\nOverall: {passed}/{len(test_results)} tests passed")
    
#     if passed == len(test_results):
#         print("\n🎉 All tests passed! Your MongoDB integration is working correctly.")
#         print("\nNext steps:")
#         print("1. Update your Flask app to use the new endpoints")
#         print("2. Test the /api/register-seller endpoint")
#         print("3. Monitor model retraining performance")
#     else:
#         print("\n⚠️ Some tests failed. Please check the error messages above.")
#         print("Common issues:")
#         print("- MongoDB connection string incorrect")
#         print("- Network connectivity issues")
#         print("- Missing required Python packages")

# if __name__ == "__main__":
#     main()