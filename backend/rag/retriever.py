import faiss
import numpy as np
import pickle
import os

index = None
stored_chunks = []

def build_index(chunks, embeddings):

    global index
    global stored_chunks

    stored_chunks = chunks

    dimension = embeddings.shape[1]

    index = faiss.IndexFlatL2(dimension)

    index.add(
        np.array(embeddings).astype("float32")
    )
    os.makedirs("storage", exist_ok=True)
     # Save FAISS Index
    faiss.write_index(
        index,
        "storage/faiss.index"
    )

    # Save Chunks
    with open(
        "storage/chunks.pkl",
        "wb"
    ) as f:
        pickle.dump(
            stored_chunks,
            f
        )

def load_index():

    global index
    global stored_chunks

    try:

        if (
            os.path.exists("storage/faiss.index")
            and
            os.path.exists("storage/chunks.pkl")
        ):

            index = faiss.read_index(
                "storage/faiss.index"
            )

            with open(
                "storage/chunks.pkl",
                "rb"
            ) as f:
                stored_chunks = pickle.load(f)

            print(
                "FAISS index loaded successfully"
            )

        else:

            print(
                "No saved FAISS index found"
            )

    except Exception as e:

        print(
            "Failed to load FAISS index:",
            e
        )

        index = None
        stored_chunks = []

def search(query_embedding, k=3):
    global index

    if index is None:
        raise Exception(
            "FAISS index not built. Upload a PDF first."
        )

    D, I = index.search(
        np.array([query_embedding]).astype("float32"),
        k
    )

    # results = []

    # for idx in I[0]:
    #     results.append(stored_chunks[idx])
    results = []

    for idx in I[0]:

        if idx == -1:
            continue

        results.append({
            "page": stored_chunks[idx]["page"],
            "text": stored_chunks[idx]["text"]
        })

    # Convert FAISS distance to confidence
    best_distance = float(D[0][0])

    confidence = max(
        0,
        min(
            100,
            int(100 / (1 + best_distance))
        )
    )
    print("Retrieved indexes:", I[0])
    print("Distances:", D[0])
    return results, confidence

def get_relevant_chunks(question, embedding_model, k=10):

    query_embedding = embedding_model.encode([question])[0]

    # chunks, confidence = search(
    #     query_embedding,
    #     k
    # )

    # return chunks, confidence
    results, confidence = search(
        query_embedding,
        k
    )

    return results, confidence