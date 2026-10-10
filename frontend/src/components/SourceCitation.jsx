import { useState } from "react";
import { Eye } from "lucide-react";
import PDFPageViewer from "./PDFPageViewer";

export default function SourceCitation({ sources, docId }) {
  const [expanded, setExpanded] = useState(false);
  const [viewingSource, setViewingSource] = useState(null);

  if (!sources || sources.length === 0) {
    return null;
  }

  return (
    <div className="mt-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="bg-transparent border-0 text-slate-400 text-xs p-0 cursor-pointer hover:text-sky-400"
      >
        {expanded ? "▼" : "▶"} {sources.length} source{sources.length > 1 ? "s" : ""}
      </button>

      {expanded && (
        <div className="mt-2 flex flex-col gap-2">
          {sources.map((source, index) => (
            <div
              key={index}
              className="bg-slate-950 border-l-[3px] border-blue-600 px-3 py-2 rounded"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-500 uppercase font-semibold">
                  Page {source.page_number} · Chunk #{source.chunk_index}
                </span>
                {source.page_number && (
                  <button
                    onClick={() => setViewingSource(source)}
                    title="View in document"
                    className="text-slate-500 hover:text-blue-400"
                  >
                    <Eye size={13} />
                  </button>
                )}
              </div>
              <p className="mt-1 mb-0 text-[13px] text-slate-300">{source.snippet}</p>
            </div>
          ))}
        </div>
      )}

      {viewingSource && (
        <PDFPageViewer
          docId={docId}
          source={viewingSource}
          onClose={() => setViewingSource(null)}
        />
      )}
    </div>
  );
}