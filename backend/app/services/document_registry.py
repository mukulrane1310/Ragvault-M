import json
import os
from datetime import datetime

REGISTRY_PATH = "documents.json"


def _load_registry() -> dict:
    if not os.path.exists(REGISTRY_PATH):
        return {}
    with open(REGISTRY_PATH, "r") as f:
        return json.load(f)


def _save_registry(registry: dict) -> None:
    with open(REGISTRY_PATH, "w") as f:
        json.dump(registry, f, indent=2)


def add_document(doc_id: str, filename: str, chunks_stored: int) -> None:
    registry = _load_registry()
    registry[doc_id] = {
        "filename": filename,
        "chunks_stored": chunks_stored,
        "uploaded_at": datetime.utcnow().isoformat(),
    }
    _save_registry(registry)


def list_documents() -> list[dict]:
    registry = _load_registry()
    return [
        {"doc_id": doc_id, **info}
        for doc_id, info in registry.items()
    ]


def get_document(doc_id: str) -> dict | None:
    registry = _load_registry()
    return registry.get(doc_id)