from rag.retriever import get_relevant_chunks
from rag.query_rewrite import rewrite_query

def corrective_retrieval(
    question,
    embedding_model
):

    # First Retrieval
    chunks, confidence = get_relevant_chunks(
        question,
        embedding_model,
        k=30
    )

    print("FIRST RETRIEVAL CONFIDENCE =", confidence)

    # If retrieval is good
    if confidence > 60:

        print("GOOD RETRIEVAL FOUND")

        return chunks, confidence

    # Query Rewrite
    # try:
    #     rewritten_query = rewrite_query(question)
    # except Exception:
    #     rewritten_query = question
    rewritten_query = question

    print("REWRITTEN QUERY =", rewritten_query)

    # Second Retrieval
    chunks, confidence = get_relevant_chunks(
        rewritten_query,
        embedding_model,
        k=30
    )

    print("SECOND RETRIEVAL CONFIDENCE =", confidence)

    return chunks, confidence