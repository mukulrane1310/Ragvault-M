import { useState, useEffect } from "react";
import FileUpload from "../components/FileUpload";
import ChatBox from "../components/ChatBox";
import DocumentList from "../components/DocumentList";
import StatsBar from "../components/StatsBar";
import { getDocuments, getStats, deleteDocument } from "../services/api";

export default function Dashboard() {
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [documents, setDocuments] = useState([]);
  const [documentsLoading, setDocumentsLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      setDocumentsLoading(true);
      try {
        const result = await getDocuments();
        setDocuments(result.documents);
      } catch (err) {
        console.error("Failed to load documents:", err);
      } finally {
        setDocumentsLoading(false);
      }
    };

    fetchDocuments();
  }, [refreshTrigger]);

  const handleUploadSuccess = (result) => {
    setRefreshTrigger((prev) => prev + 1);
    setSelectedDocId(result.doc_id);
  };
  const handleDeleteDoc = async (docId) => {
    try {
      await deleteDocument(docId);
      if (selectedDocId === docId) {
        setSelectedDocId(null);
      }
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error("Failed to delete document:", err);
      alert("Failed to delete document. Please try again.");
    }
  };

  const selectedDoc = documents.find((doc) => doc.doc_id === selectedDocId);
  const [totalQuestions, setTotalQuestions] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await getStats();
        setTotalQuestions(result.total_questions);
      } catch (err) {
        console.error("Failed to load stats:", err);
      }
    };
    fetchStats();
  }, [refreshTrigger]);

  return (
    <main className="max-w-6xl mx-auto px-6 py-8 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
        <p className="text-slate-400 text-sm">
          Upload a document, then chat with it on the left.
        </p>
      </div>

      <StatsBar documents={documents} totalQuestions={totalQuestions} />

      <div>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-2">
          Upload
        </h2>
        <FileUpload onUploadSuccess={handleUploadSuccess} />
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
        <ChatBox
          disabled={!selectedDocId}
          selectedDocId={selectedDocId}
          selectedDocName={selectedDoc?.filename}
        />

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
              Documents
            </h2>
            <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
              {documents.length}
            </span>
          </div>
          <DocumentList
            documents={documents}
            loading={documentsLoading}
            selectedDocId={selectedDocId}
            onSelectDoc={setSelectedDocId}
            onDeleteDoc={handleDeleteDoc}
          />
        </div>
      </div>
    </main>
  );
}