from sentence_transformers import CrossEncoder

cross_encoder = CrossEncoder(
    "cross-encoder/ms-marco-MiniLM-L-6-v2"
)

# def rerank_chunks(question, chunks, top_k=3):

#     pairs = [
#         (question, chunk)
#         for chunk in chunks
#     ]

#     scores = cross_encoder.predict(pairs)

#     print("\n===== RERANK SCORES =====")

#     for i, (chunk, score) in enumerate(zip(chunks, scores)):
#         print(f"\nChunk {i}")
#         print("Score =", score)
#         print(chunk[:150])

#     ranked = sorted(
#         zip(chunks, scores),
#         key=lambda x: x[1],
#         reverse=True
#     )

#     best_chunks = [
#         chunk
#         for chunk, score in ranked[:top_k]
#     ]

#     best_score = float(ranked[0][1])

#     return best_chunks, best_score

def rerank_chunks(question, chunks, top_k=3):

    # Keep FAISS order
    best_chunks = chunks[:top_k]

    # Fixed confidence
    best_score = 5.0

    return best_chunks, best_score