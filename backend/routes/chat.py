from fastapi import APIRouter
from pydantic import BaseModel

from rag.embeddings import get_model
from rag.retriever import get_relevant_chunks
from rag.generator import generate_answer
from database.mongo import db
from datetime import datetime,timezone
from rag.reranker import rerank_chunks
# from rag.query_rewrite import rewrite_query
from rag.web_fallback import web_fallback
import rag.retriever as retriever
from rag.router import route_question
from rag.crag import corrective_retrieval

router = APIRouter()

class QuestionRequest(BaseModel):
    question: str

@router.post("/chat")
def chat(request: QuestionRequest):

    db.logs.delete_many({})
    # Log 1: Question Received
    result = db.logs.insert_one({
        "query": request.question,
        "event": "Question Received",
        "timestamp": datetime.now(timezone.utc)
    })
    print("Inserted log:", result.inserted_id)

    model = get_model()

    # Query Rewriter Agent
    # rewritten_query = rewrite_query(
    #     request.question
    # )
    rewritten_query = request.question
    
    print("Original:", request.question)
    print("Rewritten:", rewritten_query)

    result = db.logs.insert_one({
        "query": request.question,
        "rewritten_query": rewritten_query,
        "event": "Query Rewritten",
        "timestamp": datetime.now(timezone.utc)
    })
    print("Inserted log:", result.inserted_id)

    # q = request.question.lower()

    route = route_question(request.question)

    print("ROUTE =", route)

    if route == "DOCUMENT":

        print("DOCUMENT AGENT ACTIVATED")
        result = db.logs.insert_one({
        "query": request.question,
        "event": "Document Agent Activated",
        "timestamp": datetime.now(timezone.utc)
        })
        print("Inserted log:", result.inserted_id)

        # context = "\n\n".join(retriever.stored_chunks[:30])
    #     context = "\n\n".join(
    #     chunk["text"]
    #     for chunk in retriever.stored_chunks[:30]
    # )
        context = "\n\n".join(
        chunk["text"]
        for chunk in retriever.stored_chunks
    )

        print("Total Chunks:", len(retriever.stored_chunks))
        print("Context Characters:", len(context))
        document_instruction = f"""
        You are DocuTrust AI.

        Document:
        {context}

        User Question:
        {request.question}

        Instructions:

        • Understand the intent.
        • Use ONLY the uploaded document.
        • Never use outside knowledge.

        If answer doesn't exist return exactly:

        NOT_FOUND

        Special handling:

        If asked for summary:
        Return 5-8 concise bullet points.

        If asked for overview:
        Return one concise paragraph.

        If asked for title:
        Return ONLY the title.

        If asked for authors:
        Return ONLY author names.

        If asked for projects:
        Return every project.

        If asked for skills:
        Return every skill.

        If asked for achievements:
        Return all achievements.

        Answer:
        """
    #     document_instruction = f"""
    # You are DocuTrust AI, an intelligent enterprise document assistant.

    # Your job is to understand the user's intent and answer accordingly.

    # Possible user requests include:
    # - summary
    # - overview
    # - explanation
    # - title
    # - authors
    # - projects
    # - skills
    # - achievements
    # - education
    # - experience
    # - contributions
    # - datasets
    # - conclusion
    # - methodology
    # - objectives
    # - technologies used
    # - implementation details

    # Instructions:

    # 1. First understand what the user is asking.
    # 2. Answer ONLY from the provided document.
    # 3. If the answer is not present in the document, return exactly:

    # NOT_FOUND

    # 4. If the user asks for:
    # - summary → summarize the document.
    # - overview → provide an overview.
    # - title → return only the title.
    # - authors → list authors.
    # - projects → list all projects.
    # - skills → list all skills.

    # User Question:
    # {request.question}
    # """

        # answer = generate_answer(
        #     context,
        #     document_instruction
        # )
        answer = generate_answer(
            context,
            document_instruction
        )
        
        result = db.chats.insert_one({
            "question": request.question,
            "rewritten_query": rewritten_query,
            "answer": answer,
            "confidence": 100,
            "timestamp": datetime.now(timezone.utc)
        })
        print("Inserted chat:", result.inserted_id)

        result = db.logs.insert_one({
            "query": request.question,
            "event": "Answer Generated",
            "timestamp": datetime.now(timezone.utc)
        })
        print("Inserted log:", result.inserted_id)
        return {
            "answer": answer,
            "confidence": 100,
            "sources": [
                "Entire Document"
            ]
        }

    # Retriever Agent
    chunks, confidence = corrective_retrieval(
        request.question,
        model
    )

    # Grading Agent (Cross Encoder)
    chunks, rerank_score = rerank_chunks(
        request.question,
        chunks
    )
    print("RETRIEVED CHUNKS =", len(chunks))
    print("RERANK SCORE =", rerank_score)
    print("TOP CHUNK =")
    if chunks:
        print("Page:", chunks[0]["page"])
        print(chunks[0]["text"][:500])

    # confidence = max(
    #     10,
    #     min(
    #         100,
    #         int((rerank_score + 10) * 10)
    #     )
    # )
    confidence = confidence
    # confidence=90

    result = db.logs.insert_one({
        "query": request.question,
        "event": "Chunks Retrieved",
        "chunks_count": len(chunks),
        "confidence": confidence,
        "timestamp": datetime.now(timezone.utc)
    })
    print("Inserted log:", result.inserted_id)

    # context = "\n\n".join(chunks)
    context = "\n\n".join(
        chunk["text"]
        for chunk in chunks
    )
    print("CONFIDENCE =", confidence)
    if confidence < 10:

        result = db.logs.insert_one({
            "query": request.question,
            "event": "Retrieval Validation Failed",
            "confidence": confidence,
            "timestamp": datetime.now(timezone.utc)
        })
        print("Inserted log:", result.inserted_id)

        return {
            "answer":
            "I could not find sufficient information in the uploaded document to answer this question.",

            "confidence": confidence,

            "sources": []
        }
    
    result = db.logs.insert_one({
        "query": request.question,
        "event": "Retrieval Validation Passed",
        "confidence": confidence,
        "timestamp": datetime.now(timezone.utc)
    })
    print("Inserted log:", result.inserted_id)

    answer = generate_answer(
        context,
        request.question
    )

    #for Fallback to web search if confidence is low
    print("ANSWER =", answer)

    if answer.strip().upper() == "NOT_FOUND":

        print("WEB FALLBACK TRIGGERED")
        result = db.logs.insert_one({
            "query": request.question,
            "event": "Web Search Triggered",
            "timestamp": datetime.now(timezone.utc)
        })
        print("Inserted log:", result.inserted_id)

        answer = web_fallback(
            request.question
        )

        result = db.chats.insert_one({
            "question": request.question,
            "rewritten_query": rewritten_query,
            "answer": answer,
            "confidence": 50,
            "timestamp": datetime.now(timezone.utc)
        })
        print("Inserted chat:", result.inserted_id)

        result = db.logs.insert_one({
            "query": request.question,
            "event": "Web Answer Generated",
            "timestamp": datetime.now(timezone.utc)
        })
        print("Inserted log:", result.inserted_id)

        return {
            "answer": answer,
            "confidence": 50,
            "sources": [
                "Internet Search"
            ]
        }


    # Save Chat History
    result = db.chats.insert_one({
        "question": request.question,
        "rewritten_query": rewritten_query,
        "answer": answer,
        "confidence": confidence,
        "timestamp": datetime.now(timezone.utc)
    })
    print("Inserted chat:", result.inserted_id)

    result = db.logs.insert_one({
        "query": request.question,
        "event": "Cross Encoder Validation",
        "timestamp": datetime.now(timezone.utc)
    })
    print("Inserted log:", result.inserted_id)
    
    result = db.logs.insert_one({
        "query": request.question,
        "event": "Answer Generated",
        "answer_length": len(answer),
        "timestamp": datetime.now(timezone.utc)
    })
    print("Inserted log:", result.inserted_id)

    print("\nTOP 3 CHUNKS:")
    for i, c in enumerate(chunks[:3]):
        print(f"\nChunk {i+1}")
        print("Page:", c["page"])
        print(c["text"][:300])

    formatted_answer = answer

    return {
        "answer": formatted_answer,
        "confidence": confidence,
        # "sources": [
        #     {
        #         "id": i + 1,
        #         "text": chunk[:400]
        #     }
        #     for i, chunk in enumerate(chunks[:3])
        # ]
        "sources": [
            {
                "id": i + 1,
                "page": chunk["page"],
                "text": chunk["text"][:400]
            }
            for i, chunk in enumerate(chunks[:3])
        ]
    }
