# # simple_check.py - Quick check of MongoDB data

# from db_manager import DatabaseManager

# try:
#     print("🔍 Checking MongoDB database...")
    
#     db_manager = DatabaseManager()
    
#     # Get total count
#     count = db_manager.get_seller_count()
#     print(f"Total sellers: {count}")
    
#     # Get raw data to see what's actually stored
#     df = db_manager.get_all_sellers_as_dataframe()
    
#     print(f"DataFrame shape: {df.shape}")
#     print(f"Columns: {list(df.columns)}")
    
#     if not df.empty:
#         print("\nFirst few records:")
#         print(df.head().to_string())
        
#         print(f"\nSample seller names: {df['Name'].head().tolist() if 'Name' in df.columns else 'No Name column'}")
#         print(f"Sample products: {df['Product'].head().tolist() if 'Product' in df.columns else 'No Product column'}")
    
#     db_manager.close_connection()
    
# except Exception as e:
#     print(f"Error: {e}")