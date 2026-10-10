import os
from dotenv import load_dotenv
from groq import Groq  # type: ignore

from app.services.vector_store import search_similar

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def distance_to_confidence(distance: float) -> int:
    similarity = 1 - (distance / 2)

    sim_floor = 0.25
    sim_ceiling = 0.75
    stretched = (similarity - sim_floor) / (
        sim_ceiling - sim_floor
    )

    confidence = max(
        0,
        min(100, round(stretched * 100))
    )
    return confidence


def confidence_label(score: int) -> str:
    if score >= 55:
        return "high"
    elif score >= 35:
        return "medium"
    else:
        return "low"


def answer_question(
    question: str,
    doc_id: str | None = None
) -> dict:
    retrieved_chunks = search_similar(
        question,
        doc_id=doc_id
    )

    context = "\n\n".join(
        chunk["text"]
        for chunk in retrieved_chunks
    )

    prompt = f"""Answer the question using ONLY
the context below.
If the answer isn't in the context,
say you don't know.

Context:
{context}

Question: {question}
Answer:"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
    )

    answer_text = response.choices[0].message.content

    sources = [
        {
            "chunk_index": chunk["chunk_index"],
            "snippet": (
                chunk["text"][:200]
                + ("..." if len(chunk["text"]) > 200 else "")
            ),
            "confidence": distance_to_confidence(
                chunk["distance"]
            ),
            "page_number": chunk["page_number"],
            "bbox": chunk["bbox"],
            "page_width": chunk["page_width"],
            "page_height": chunk["page_height"],
        }
        for chunk in retrieved_chunks
    ]

    if retrieved_chunks:
        avg_distance = sum(
            c["distance"] for c in retrieved_chunks
        ) / len(retrieved_chunks)

        overall_confidence = distance_to_confidence(
            avg_distance
        )
    else:
        overall_confidence = 0

    return {
        "answer": answer_text,
        "sources": sources,
        "confidence": overall_confidence,
        "confidence_label": confidence_label(
            overall_confidence
        ),
    }