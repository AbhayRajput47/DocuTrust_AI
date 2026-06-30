from fastapi import APIRouter
from database.mongo import db

router = APIRouter()

# @router.get("/documents")
# def get_documents():

#     docs = list(
#         db.documents.find(
#             {},
#             {"_id": 0}
#         ).sort("uploaded_at", -1)
#     )

#     return docs

@router.get("/documents")
def get_documents():

    docs = list(
        db.documents.find({}, {"_id": 0})
        .sort("uploaded_at", -1)
    )

    print("\nDocuments endpoint called")
    print("Top 3 documents:")

    for d in docs[:3]:
        print(d["filename"])

    return docs