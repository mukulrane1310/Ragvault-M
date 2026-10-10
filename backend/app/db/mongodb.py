import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")

client = MongoClient(MONGODB_URI)
db = client["ragvault"]

users_collection = db["users"]
documents_collection = db["documents"]
chat_messages_collection = db["chat_messages"]
document_chunks_collection = db["document_chunks"]