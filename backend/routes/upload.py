

from fastapi import APIRouter, UploadFile, File
import os

from rag.loader import extract_text_from_pdf
from rag.chunker import split_text, split_pages
from rag.embeddings import create_embeddings
from rag.retriever import build_index
from database.mongo import db
from datetime import datetime

router = APIRouter()

UPLOAD_FOLDER = "uploads"

# Create uploads folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@router.post("/upload")

async def upload_pdf(file: UploadFile = File(...)):

    file_path = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )

    with open(file_path, "wb") as f:
        f.write(await file.read())
    
    result = db.logs.insert_one({
        "filename": file.filename,
        "event": "PDF Uploaded",
        "timestamp": datetime.now()
    })
    print("Inserted log:", result.inserted_id)

    text, pages = extract_text_from_pdf(file_path)
    # chunks = split_text(text)
    chunks = split_pages(pages)
    
    # for i in range(5):
    for i in range(min(5, len(chunks))):
        print(f"\nCHUNK {i}")
        # print(chunks[i][:500])
        print("Page:", chunks[i]["page"])
        print("Text:", chunks[i]["text"][:500])

    result = db.logs.insert_one({
        "filename": file.filename,
        "event": "Chunks Generated",
        "chunks_count": len(chunks),
        "timestamp": datetime.now()
    })
    print("Inserted log:", result.inserted_id)
    
    result = db.documents.insert_one({
        "filename": file.filename,
        "characters": len(text),
        "chunks": len(chunks),
        "uploaded_at": datetime.now()
    })
    #added print statements to log the inserted document and database name
    print("Inserted document:", file.filename)
    print("Inserted ID:", result.inserted_id)
    print("Database:", db.name)
    docs = list(
        db.documents.find({}, {"_id": 0})
        .sort("uploaded_at", -1)
        .limit(3)
    )

    print("\nTop 3 documents after insert:")
    for d in docs:
        print(d["filename"])


    # embeddings = create_embeddings(chunks)
    embeddings = create_embeddings(
        [chunk["text"] for chunk in chunks]
    )    
    result = db.logs.insert_one({
        "filename": file.filename,
        "event": "Embeddings Created",
        "embeddings_count": len(embeddings),
        "timestamp": datetime.now()
    })
    print("Inserted log:", result.inserted_id)

    build_index(
        chunks,
        embeddings
    )

    result = db.logs.insert_one({
        "filename": file.filename,
        "event": "FAISS Index Built",
        "timestamp": datetime.now()
    })
    print("Inserted log:", result.inserted_id)

    return {
    "filename": file.filename,
    "characters": len(text),
    "total_chunks": len(chunks),
    "first_chunk": chunks[0]
}