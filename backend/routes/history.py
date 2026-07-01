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
    for chat in chats:
        if "timestamp" in chat:
            chat["timestamp"] = chat["timestamp"].isoformat()
            
    print("\nLatest chat:")
    if chats:
        print(chats[0])   
    return chats