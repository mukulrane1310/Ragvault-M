
import io

import cloudinary.uploader
import cloudinary.utils
import pdfplumber
import requests
from fastapi import APIRouter, Depends, HTTPException, Response

from app.core import cloudinary_config
from app.db.mongodb import documents_collection, chat_messages_collection
from app.services.vector_store import delete_document_chunks
from app.api.deps import get_current_user

router = APIRouter()


@router.get("/documents")
async def get_documents(
    current_user=Depends(get_current_user),
):
    docs = documents_collection.find(
        {"owner_id": current_user["id"]}
    )

    return {
        "documents": [
            {
                "doc_id": doc["id"],
                "filename": doc["filename"],
                "category": doc["category"],
                "chunks_stored": doc["chunks_stored"],
                "uploaded_at": doc["uploaded_at"].isoformat(),
            }
            for doc in docs
        ]
    }


@router.get("/documents/{doc_id}/page/{page_number}")
async def get_page_image(
    doc_id: str,
    page_number: int,
    current_user=Depends(get_current_user),
):
    document = documents_collection.find_one(
        {
            "id": doc_id,
            "owner_id": current_user["id"],
        }
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found",
        )

    public_id = f"ragvault/pdfs/{doc_id}"

    download_url = cloudinary.utils.private_download_url(
        public_id,
        format="pdf",
        resource_type="raw",
        type="authenticated",
        attachment=False,
    )

    try:
        pdf_response = requests.get(
            download_url,
            timeout=30,
        )
    except requests.RequestException as exc:
        print(f"Cloudinary PDF download failed: {exc}")
        raise HTTPException(
            status_code=502,
            detail="Failed to download PDF file",
        )

    if not pdf_response.ok:
        print(
            "Cloudinary PDF download failed:",
            pdf_response.status_code,
            download_url,
        )
        raise HTTPException(
            status_code=502,
            detail="Failed to download PDF file",
        )

    pdf_bytes = io.BytesIO(pdf_response.content)

    with pdfplumber.open(pdf_bytes) as pdf:
        if page_number < 1 or page_number > len(pdf.pages):
            raise HTTPException(
                status_code=404,
                detail="Page not found",
            )

        page = pdf.pages[page_number - 1]
        rendered = page.to_image(resolution=150)

    buffer = io.BytesIO()
    rendered.original.save(buffer, format="PNG")
    buffer.seek(0)

    return Response(
        content=buffer.getvalue(),
        media_type="image/png",
    )


@router.delete("/documents/{doc_id}")
async def delete_document(
    doc_id: str,
    current_user=Depends(get_current_user),
):
    document = documents_collection.find_one(
        {
            "id": doc_id,
            "owner_id": current_user["id"],
        }
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found",
        )

    delete_document_chunks(doc_id)

    chat_messages_collection.delete_many(
        {
            "document_id": doc_id,
            "user_id": current_user["id"],
        }
    )

    cloudinary_result = cloudinary.uploader.destroy(
        f"ragvault/pdfs/{doc_id}",
        resource_type="raw",
        type="authenticated",
    )

    print("Cloudinary delete result:", cloudinary_result)

    documents_collection.delete_one(
        {
            "id": doc_id,
            "owner_id": current_user["id"],
        }
    )

    return {
        "message": "Document deleted successfully"
    }
