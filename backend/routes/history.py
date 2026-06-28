from fastapi import APIRouter
from database.mongo import db

router = APIRouter()

@router.get("/history")
def get_history():

    chats = list(
        db.chats.find(
            {},
            {
                "_id": 0
            }
        ).sort(
            "timestamp",
            -1
        ).limit(10)
    )

    return chats