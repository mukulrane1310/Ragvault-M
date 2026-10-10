const BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function uploadPDF(file, category) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("category", category);

  const response = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    headers: authHeaders(),
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    const err = new Error(error.detail || "Upload failed");
    err.status = response.status;
    throw err;
  }

  return response.json();
}

export async function askQuestion(question, docId = null) {
  const params = new URLSearchParams({ question });
  if (docId) {
    params.append("doc_id", docId);
  }

  const response = await fetch(`${BASE_URL}/query?${params.toString()}`, {
    method: "POST",
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error("Query failed");
  }

  return response.json();
}

export async function getDocuments() {
  const response = await fetch(`${BASE_URL}/documents`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch documents");
  }

  return response.json();
}

export async function getChatHistory(docId) {
  const response = await fetch(
    `${BASE_URL}/chat-history?doc_id=${encodeURIComponent(docId)}`,
    { headers: authHeaders() }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch chat history");
  }

  return response.json();
}

export async function getPageImage(docId, pageNumber) {
  const response = await fetch(
    `${BASE_URL}/documents/${docId}/page/${pageNumber}`,
    { headers: authHeaders() }
  );

  if (!response.ok) {
    throw new Error("Failed to load page image");
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
}
export async function getStats() {
  const response = await fetch(`${BASE_URL}/stats`, { headers: authHeaders() });

  if (!response.ok) {
    throw new Error("Failed to fetch stats");
  }

  return response.json();
}

export async function deleteDocument(docId) {
  const response = await fetch(`${BASE_URL}/documents/${docId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to delete document");
  }

  return response.json();
}
