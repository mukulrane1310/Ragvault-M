import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { getPageImage } from "../services/api";

export default function PDFPageViewer({ docId, source, onClose }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let objectUrl;

    const loadImage = async () => {
      setLoading(true);
      try {
        objectUrl = await getPageImage(docId, source.page_number);
        setImageUrl(objectUrl);
      } catch (err) {
        console.error("Failed to load page image:", err);
      } finally {
        setLoading(false);
      }
    };

    loadImage();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [docId, source.page_number]);

  const { bbox, page_width, page_height } = source;
  const leftPct = (bbox.x0 / page_width) * 100;
  const topPct = (bbox.top / page_height) * 100;
  const widthPct = ((bbox.x1 - bbox.x0) / page_width) * 100;
  const heightPct = ((bbox.bottom - bbox.top) / page_height) * 100;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4 py-8">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 max-w-2xl w-full max-h-full overflow-auto relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-white bg-slate-800 rounded-full p-1.5 z-10"
        >
          <X size={16} />
        </button>

        <p className="text-sm text-slate-400 mb-3">Page {source.page_number}</p>

        {loading && (
          <div className="h-96 flex items-center justify-center text-slate-500 text-sm">
            Loading page...
          </div>
        )}

        {imageUrl && (
          <div className="relative inline-block w-full">
            <img
              src={imageUrl}
              alt={`Page ${source.page_number}`}
              className="w-full rounded-lg"
            />
            <div
              className="absolute border-2 border-yellow-400 bg-yellow-400/20 rounded-sm"
              style={{
                left: `${leftPct}%`,
                top: `${topPct}%`,
                width: `${widthPct}%`,
                height: `${heightPct}%`,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}