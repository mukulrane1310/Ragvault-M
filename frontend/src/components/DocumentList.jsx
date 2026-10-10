import { Trash2 } from "lucide-react";

const CATEGORY_LABELS = {
  general: "📄 General",
  legal: "⚖️ Legal",
  school: "🎓 School",
  diet: "🥗 Diet",
  healthcare: "🏥 Healthcare",
  finance: "💰 Finance",
};

function formatUploadDate(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  if (isToday) {
    return `Today, ${time}`;
  }

  const dateStr = date.toLocaleDateString([], { month: "short", day: "numeric" });
  return `${dateStr}, ${time}`;
}

export default function DocumentList({
  documents,
  loading,
  selectedDocId,
  onSelectDoc,
  onDeleteDoc,
}) {
  if (loading) {
    return <p className="text-slate-500 italic text-sm">Loading documents...</p>;
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500 text-sm">No documents yet.</p>
        <p className="text-slate-600 text-xs mt-1">
          Upload your first PDF to get started.
        </p>
      </div>
    );
  }

  const handleDeleteClick = (e, docId, filename) => {
    e.stopPropagation();
    if (window.confirm(`Delete "${filename}"? This can't be undone.`)) {
      onDeleteDoc(docId);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {documents.map((doc) => (
        <div
          key={doc.doc_id}
          onClick={() => onSelectDoc(doc.doc_id)}
          className={`group p-3 rounded-lg cursor-pointer bg-slate-950 border transition-colors ${
            selectedDocId === doc.doc_id
              ? "border-blue-600 bg-blue-950"
              : "border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <span className="text-sm font-medium truncate">{doc.filename}</span>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded-full">
                {CATEGORY_LABELS[doc.category] || doc.category}
              </span>
              <button
                onClick={(e) => handleDeleteClick(e, doc.doc_id, doc.filename)}
                title="Delete document"
                className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>{formatUploadDate(doc.uploaded_at)}</span>
            <span>{doc.chunks_stored} chunks</span>
          </div>
        </div>
      ))}
    </div>
  );
}