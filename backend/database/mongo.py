# import os
# from dotenv import load_dotenv
# from pymongo import MongoClient

# load_dotenv()
# client = MongoClient(
#     os.getenv("MONGODB_URI")
# )

# db = client["docutrust"]

# # db.documents.insert_one({
# #     "filename": file.filename,
# #     "chunks": len(chunks),
# #     "upload_time": datetime.now()
# # })
import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

uri = os.getenv("MONGODB_URI")

# Print URI (hide password)
print("MONGODB_URI =", uri)

client = MongoClient(uri)

db = client["docutrust"]

print("Connected Database:", db.name)

# Test connection
try:
    client.admin.command("ping")
    print("MongoDB Connected Successfully")
except Exception as e:
    print("MongoDB Connection Failed:", e)