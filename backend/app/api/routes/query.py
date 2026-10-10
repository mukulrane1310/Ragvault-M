import json
from datetime import datetime

from fastapi import APIRouter, Depends

from app.services.rag_engine import answer_question
from app.db.mongodb import chat_messages_collection
from app.api.deps import get_current_user

router = APIRouter()


@router.post("/query")
async def query(
    question: str,
    doc_id: str | None = None,
    current_user=Depends(get_current_user),
):
    result = answer_question(question, doc_id=doc_id)

    try:
        chat_entry = {
            "question": question,
            "answer": result["answer"],
            "sources": json.dumps(result["sources"]),
            "confidence": result["confidence"],
            "confidence_label": result["confidence_label"],
            "user_id": current_user["id"],
            "document_id": doc_id,
            "created_at": datetime.utcnow(),
        }

        chat_messages_collection.insert_one(chat_entry)

    except Exception as e:
        print(f"Failed to save chat history: {e}")

    return {
        "question": question,
        "doc_id": doc_id,
        "answer": result["answer"],
        "sources": result["sources"],
        "confidence": result["confidence"],
        "confidence_label": result["confidence_label"],
    }


@router.get("/chat-history")
async def get_chat_history(
    doc_id: str,
    current_user=Depends(get_current_user),
):
    messages = chat_messages_collection.find(
        {
            "document_id": doc_id,
            "user_id": current_user["id"],
        }
    ).sort("created_at", 1)

    return {
        "messages": [
            {
                "question": msg["question"],
                "answer": msg["answer"],
                "sources": json.loads(msg["sources"])
                if msg.get("sources")
                else [],
                "confidence": msg["confidence"],
                "confidence_label": msg["confidence_label"],
            }
            for msg in messages
        ]
    }


@router.get("/stats")
async def get_stats(
    current_user=Depends(get_current_user),
):
    total_questions = chat_messages_collection.count_documents(
        {"user_id": current_user["id"]}
    )

    return {"total_questions": total_questions}