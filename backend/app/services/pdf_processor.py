import pdfplumber



def extract_pages(file) -> list[dict]:
    pages_data = []

    with pdfplumber.open(file) as pdf:
        for i, page in enumerate(pdf.pages):
            words = page.extract_words()

            pages_data.append({
                "page_number": i + 1,
                "words": words,
                "page_width": float(page.width),
                "page_height": float(page.height),
            })

    return pages_data



def chunk_page_words(words: list[dict], chunk_size: int = 120, overlap: int = 20) -> list[dict]:
    chunks = []
    start = 0
    while start < len(words):
        end = start + chunk_size
        chunk_words = words[start:end]
        if not chunk_words:
            break

        text = " ".join(w["text"] for w in chunk_words)
        bbox = {
            "x0": float(min(w["x0"] for w in chunk_words)),
            "x1": float(max(w["x1"] for w in chunk_words)),
            "top": float(min(w["top"] for w in chunk_words)),
            "bottom": float(max(w["bottom"] for w in chunk_words)),
        }
        chunks.append({"text": text, "bbox": bbox})
        start += chunk_size - overlap

    return chunks