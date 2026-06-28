from fastapi import FastAPI
from routes.upload import router as upload_router
from routes.chat import router as chat_router
from fastapi.middleware.cors import CORSMiddleware
from routes.logs import router as logs_router
from rag.retriever import load_index
from routes.history import router as history_router
from routes.documents import router as documents_router
from routes.dashboard import router as dashboard_router

load_index()

app = FastAPI()

app.include_router(upload_router)
app.include_router(chat_router)
app.include_router(logs_router)
app.include_router(history_router)
app.include_router(documents_router)
app.include_router(dashboard_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def home():
    return {
        "message": "DocuTrust Backend Running"
    }