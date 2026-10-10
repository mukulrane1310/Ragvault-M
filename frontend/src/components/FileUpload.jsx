import { useState } from "react";
import { uploadPDF } from "../services/api";
import UpgradeModal from "./UpgradeModal";

const CATEGORIES = [
  { value: "general", label: "📄 General" },
  { value: "legal", label: "⚖️ Legal" },
  { value: "school", label: "🎓 School / Academic" },
  { value: "diet", label: "🥗 Diet / Nutrition" },
  { value: "healthcare", label: "🏥 Healthcare" },
  { value: "finance", label: "💰 Finance" },
  { value: "other", label: "✏️ Other (type your own)" },
];

export default function FileUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("general");
  const [customCategory, setCustomCategory] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [upgradeMessage, setUpgradeMessage] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please choose a PDF first.");
      return;
    }

    const finalCategory =
      category === "other" ? customCategory.trim().toLowerCase() : category;

    if (category === "other" && !finalCategory) {
      setMessage("Please type a category name.");
      return;
    }

    setUploading(true);
    setMessage("");

    try {
      const result = await uploadPDF(file, finalCategory);
      setMessage(`Uploaded! ${result.chunks_stored} chunks stored.`);
      onUploadSuccess(result);
    } catch (err) {
      console.error("Upload error:", err);
      if (err.status === 402) {
        setUpgradeMessage(err.message);
      } else if (err.status === 415) {
        setMessage(err.message);
      } else {
        setMessage("Upload failed. Please try again.");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="text-sm text-slate-300 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 rounded-md bg-slate-950 border border-slate-700 text-slate-200 text-sm"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>

        {category === "other" && (
          <input
            type="text"
            placeholder="e.g. Contracts, Recipes..."
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            maxLength={30}
            className="px-3 py-2 rounded-md bg-slate-950 border border-slate-700 text-slate-200 text-sm"
          />
        )}

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="px-4 py-2 rounded-md bg-blue-600 text-white cursor-pointer disabled:bg-slate-600 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {uploading ? "Uploading..." : "Upload PDF"}
        </button>
      </div>

      {message && <p className="m-0 text-sky-400 text-sm">{message}</p>}
      <p className="m-0 text-xs text-slate-500">
        PDF only, up to 40 pages on the Free plan.
      </p>

      {upgradeMessage && (
        <UpgradeModal
          message={upgradeMessage}
          onClose={() => setUpgradeMessage(null)}
        />
      )}
    </div>
  );
}