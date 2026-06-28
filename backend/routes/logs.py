from fastapi import APIRouter
from database.mongo import db

router = APIRouter()

@router.get("/logs")
def get_logs():

    latest_chat = db.chats.find_one(
        sort=[("timestamp", -1)]
    )

    if not latest_chat:
        return []

    logs = list(
        db.logs.find(
            {
                "query": latest_chat["question"]
            },
            {"_id": 0}
        ).sort("timestamp", 1)
    )

    return logs