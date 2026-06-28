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

@router.post("/upload")

async def upload_pdf(file: UploadFile = File(...)):

    file_path = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )

    with open(file_path, "wb") as f:
        f.write(await file.read())
    
    db.logs.insert_one({
        "filename": file.filename,
        "event": "PDF Uploaded",
        "timestamp": datetime.now()
    })

    text, pages = extract_text_from_pdf(file_path)
    # chunks = split_text(text)
    chunks = split_pages(pages)
    
    # for i in range(5):
    for i in range(min(5, len(chunks))):
        print(f"\nCHUNK {i}")
        # print(chunks[i][:500])
        print("Page:", chunks[i]["page"])
        print("Text:", chunks[i]["text"][:500])

    db.logs.insert_one({
        "filename": file.filename,
        "event": "Chunks Generated",
        "chunks_count": len(chunks),
        "timestamp": datetime.now()
    })
    
    db.documents.insert_one({
        "filename": file.filename,
        "characters": len(text),
        "chunks": len(chunks),
        "uploaded_at": datetime.now()
    })

    # embeddings = create_embeddings(chunks)
    embeddings = create_embeddings(
        [chunk["text"] for chunk in chunks]
    )    
    db.logs.insert_one({
        "filename": file.filename,
        "event": "Embeddings Created",
        "embeddings_count": len(embeddings),
        "timestamp": datetime.now()
    })

    build_index(
        chunks,
        embeddings
    )

    db.logs.insert_one({
        "filename": file.filename,
        "event": "FAISS Index Built",
        "timestamp": datetime.now()
    })
    
    return {
    "filename": file.filename,
    "characters": len(text),
    "total_chunks": len(chunks),
    "first_chunk": chunks[0]
}