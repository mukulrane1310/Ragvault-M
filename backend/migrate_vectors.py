from app.services.pdf_processor import extract_pages, chunk_page_words
from app.services.vector_store import store_chunks

doc_id = "3035ce6a-2294-4338-bb2c-0a10c479fff7"
file_path = f"backend/uploads/{doc_id}.pdf"

pages = extract_pages(file_path)

all_chunks = []

for page in pages:
    for chunk in chunk_page_words(page["words"]):
        chunk["page_number"] = page["page_number"]
        chunk["page_width"] = page["page_width"]
        chunk["page_height"] = page["page_height"]
        all_chunks.append(chunk)

count = store_chunks(doc_id, all_chunks)

print(f"Stored {count} chunks in MongoDB")
