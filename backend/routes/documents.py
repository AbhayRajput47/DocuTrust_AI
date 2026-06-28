from fastapi import APIRouter
from database.mongo import db

router = APIRouter()

@router.get("/documents")
def get_documents():

    docs = list(
        db.documents.find(
            {},
            {"_id": 0}
        ).sort("uploaded_at", -1)
    )

    return docs