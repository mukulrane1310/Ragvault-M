# RagVault

**Chat with your documents, powered by Retrieval-Augmented Generation.**

RagVault is a full-stack AI application that transforms PDFs into searchable, conversational knowledge bases. Upload documents, ask questions in natural language, and get grounded answers backed by source citations instead of unsupported guesses.

Each answer can be traced to its source through page-level citations and visual PDF highlighting, with a grounding confidence score that indicates how strongly the retrieved content supports the answer.

---

## 🚀 Overview

Finding information buried inside long contracts, research papers, reports, and notes can be slow and tedious.

RagVault solves this by combining **Retrieval-Augmented Generation (RAG)** with document-level source tracking. Users upload PDFs, ask questions, and receive answers generated from the most relevant passages in their documents.

The system goes beyond a basic RAG chatbot by providing:

- Exact source citations
- Visual PDF source highlighting
- Persistent PDF storage
- Per-document persistent conversations
- Per-user data isolation
- Grounding confidence scores
- JWT authentication and protected resources
- Semantic search using MongoDB Atlas Vector Search

---

## ✨ Key Features

- **Multi-document support** — Upload and manage multiple PDFs with complete per-user isolation.
- **Document categorization** — Organize documents using categories such as Legal, School, Healthcare, Finance, or custom labels.
- **Source citations** — Every generated answer includes references to the retrieved source passages.
- **Visual PDF highlighting** — Open the cited PDF page and view the exact source paragraph highlighted using word-level bounding-box coordinates.
- **Grounding confidence score** — A calibrated 0–100% score based on embedding similarity indicates how strongly the retrieved content supports the answer.
- **Persistent PDF storage** — Uploaded PDFs are stored in Cloudinary instead of relying on the temporary server filesystem.
- **Persistent chat history** — Conversations are stored per document and restored across sessions.
- **Authentication** — JWT-based signup/login with bcrypt password hashing and protected routes.
- **Profile management** — Update display name and change password.
- **Usage limits** — Free-tier users are limited to PDF documents up to 40 pages, with a dedicated upgrade flow instead of a raw server error.
- **Responsive UI** — Modern dark-themed landing, authentication, dashboard, document, and chat interfaces.

---

## 🧠 RAG Pipeline

RagVault follows a complete Retrieval-Augmented Generation pipeline:

```text
PDF Upload
    ↓
Cloudinary Persistent Storage
    ↓
Text & Layout Extraction
    ↓
Chunking
    ↓
Local Embeddings
    ↓
MongoDB Atlas Vector Search
    ↓
Semantic Retrieval
    ↓
Groq LLM
    ↓
Grounded Answer
    ↓
Source Citation + Confidence Score
    ↓
Authenticated PDF Retrieval
    ↓
Visual PDF Highlight
```

### 1. PDF Storage

When a PDF is uploaded, RagVault temporarily processes the file on the backend and stores the original document in **Cloudinary**.

The Cloudinary secure resource reference is stored with the document metadata in MongoDB.

This prevents uploaded PDFs from being lost when the backend runs on an ephemeral filesystem such as a free-tier cloud deployment.

### 2. Extraction

`pdfplumber` extracts text page-by-page along with word-level position data and bounding-box coordinates.

This layout information is preserved so retrieved chunks can later be connected back to their exact location in the original PDF.

### 3. Chunking

Extracted text is divided into chunks while preserving:

- Page number
- Chunk index
- Bounding-box coordinates
- Page width
- Page height

This metadata enables visual source highlighting.

### 4. Embedding

Each chunk is converted into a vector using the local **FastEmbed** embedding model:

```text
BAAI/bge-small-en-v1.5
```

The model produces **384-dimensional embeddings** and provides lightweight CPU-friendly embedding generation.

### 5. Vector Storage & Retrieval

Embeddings are stored in **MongoDB Atlas** inside the `document_chunks` collection.

MongoDB Atlas Vector Search performs semantic similarity search using cosine similarity.

When a user asks a question:

```text
Question
   ↓
FastEmbed
   ↓
384-dimensional query vector
   ↓
MongoDB Atlas Vector Search
   ↓
Top relevant document chunks
```

When a specific document is selected, vector retrieval can be restricted to that document using the document ID.

### 6. Generation

The retrieved context and user's question are sent to the Groq API using:

```text
openai/gpt-oss-120b
```

The model is instructed to answer using only the retrieved context and avoid unsupported information.

### 7. Grounding Confidence

Retrieved vector similarity is converted into a calibrated **0–100% confidence score**.

The score represents how strongly the retrieved passages match the user's question.

Confidence is categorized as:

- **High**
- **Medium**
- **Low**

### 8. Visual Citation

When a user opens a cited source, RagVault generates an authenticated Cloudinary download URL for the original PDF.

The PDF is then:

1. Downloaded securely by the backend.
2. Opened using `pdfplumber`.
3. Rendered