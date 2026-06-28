from fastapi import APIRouter
from database.mongo import db

router = APIRouter()

@router.get("/dashboard")
def dashboard():

    documents = db.documents.count_documents({})

    questions = db.chats.count_documents({})

    responses = db.chats.count_documents({})

    total_chunks = 0

    for doc in db.documents.find({}, {"chunks": 1}):
        total_chunks += doc.get("chunks", 0)

    return {
        "documents": documents,
        "questions": questions,
        "responses": responses,
        "chunks": total_chunks
    }