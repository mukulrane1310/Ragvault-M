
from fastembed import TextEmbedding

from app.db.mongodb import document_chunks_collection


model = TextEmbedding("BAAI/bge-small-en-v1.5")

EMBEDDING_DIMENSIONS = 384
VECTOR_INDEX_NAME = "document_chunks_vector_index"



def create_embeddings(
    texts: list[str],
) -> list[list[float]]:
    return [
        embedding.tolist()
        for embedding in model.embed(texts)
    ]


def store_chunks(
    doc_id: str,
    chunks: list[dict],
) -> int:
    texts = [c["text"] for c in chunks]
    embeddings = create_embeddings(texts)

    documents = []

    for i, (chunk, embedding) in enumerate(
        zip(chunks, embeddings)
    ):
        documents.append({
            "_id": f"{doc_id}_{i}",
            "doc_id": doc_id,
            "chunk_index": i,
            "text": chunk["text"],
            "embedding": embedding,
            "page_number": chunk["page_number"],
            "bbox": chunk["bbox"],
            "page_width": chunk["page_width"],
            "page_height": chunk["page_height"],
        })

    if documents:
        document_chunks_collection.insert_many(documents)

    return len(documents)


def search_similar(
    query: str,
    doc_ids: list[str],
    top_k: int = 4,
) -> list[dict]:
    if not doc_ids:
        return []

    query_embedding = create_embeddings([query])[0]

    vector_stage = {
        "$vectorSearch": {
            "index": VECTOR_INDEX_NAME,
            "path": "embedding",
            "queryVector": query_embedding,
            "numCandidates": max(top_k * 10, 20),
            "limit": top_k,
            "filter": {"doc_id": {"$in": doc_ids}},
        }
    }

    pipeline = [
        vector_stage,
        {
            "$project": {
                "_id": 0,
                "text": 1,
                "chunk_index": 1,
                "page_number": 1,
                "bbox": 1,
                "page_width": 1,
                "page_height": 1,
                "score": {"$meta": "vectorSearchScore"},
            }
        },
    ]

    results = list(
        document_chunks_collection.aggregate(pipeline)
    )

    return [
        {
            "text": result["text"],
            "chunk_index": result["chunk_index"],
            "page_number": result["page_number"],
            "bbox": result["bbox"],
            "page_width": result["page_width"],
            "page_height": result["page_height"],
            "distance": 1 - result["score"],
        }
        for result in results
    ]


def delete_document_chunks(doc_id: str) -> None:
    document_chunks_collection.delete_many(
        {"doc_id": doc_id}
    )
