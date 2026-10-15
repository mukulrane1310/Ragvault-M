import uuid
from datetime import datetime

import cloudinary.uploader
from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form,
    Depends,
    HTTPException,
)

from app.core import cloudinary_config
from app.services.pdf_processor import extract_pages, chunk_page_words
from app.services.vector_store import store_chunks
from app.db.mongodb import documents_collection
from app.api.deps import get_current_user


router = APIRouter()

MAX_PAGES = 40


@router.post("/upload")
async def upload_pdf(
    file: UploadFile = File(...),
    category: str = Form("general"),
    current_user=Depends(get_current_user),
):
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=415,
            detail="Only PDF files are supported.",
        )

    doc_id = str(uuid.uuid4())

    try:
        pages = extract_pages(file.file)
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Unable to read this PDF file.",
        )

    if len(pages) > MAX_PAGES:
        raise HTTPException(
            status_code=402,
            detail=(
                f"This document has {len(pages)} pages, exceeding "
                f"the {MAX_PAGES}-page Free plan limit."
            ),
        )

    all_chunks = []

    for page in pages:
        for chunk in chunk_page_words(page["words"]):
            chunk["page_number"] = page["page_number"]
            chunk["page_width"] = page["page_width"]
            chunk["page_height"] = page["page_height"]
            all_chunks.append(chunk)

    try:
        file.file.seek(0)

        cloudinary.uploader.upload(
            file.file,
            resource_type="raw",
            type="authenticated",
            folder="ragvault/pdfs",
            public_id=doc_id,
            overwrite=True,
        )

        chunks_stored = store_chunks(doc_id, all_chunks)

        new_document = {
            "id": doc_id,
            "filename": file.filename,
            "category": category,
            "chunks_stored": chunks_stored,
            "uploaded_at": datetime.utcnow(),
            "owner_id": current_user["id"],
        }

        documents_collection.insert_one(new_document)

    except Exception as e:
        print(f"PDF upload or processing failed: {e}")
        raise HTTPException(
            status_code=500,
            detail="PDF upload or processing failed. Please check server logs.",
        )

    return {
        "doc_id": doc_id,
        "filename": file.filename,
        "category": category,
        "chunks_stored": chunks_stored,
    }