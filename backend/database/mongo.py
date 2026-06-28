import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()
client = MongoClient(
    os.getenv("MONGODB_URI")
)

db = client["docutrust"]

# db.documents.insert_one({
#     "filename": file.filename,
#     "chunks": len(chunks),
#     "upload_time": datetime.now()
# })