import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
    DATABASE_NAME = os.getenv('DATABASE_NAME', 'swaadai_db')
    SELLERS_COLLECTION = os.getenv('SELLERS_COLLECTION', 'sellers')
    PRODUCTS_COLLECTION = os.getenv('PRODUCTS_COLLECTION', 'products')