const CONFIG = {
  high: { color: "bg-green-500", text: "text-green-400", label: "Well grounded" },
  medium: { color: "bg-yellow-500", text: "text-yellow-400", label: "Partially grounded" },
  low: { color: "bg-red-500", text: "text-red-400", label: "Weakly grounded" },
};

export default function ConfidenceBadge({ score, label }) {
  const config = CONFIG[label] || CONFIG.low;

  return (
    <div title="How well this answer is supported by your document" className="w-full max-w-45">
      <div className="flex items-center justify-between mb-1">
        <span className={`text-[11px] font-medium ${config.text}`}>{config.label}</span>
        <span className="text-[11px] text-slate-500">{score}%</span>
      </div>
      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${config.color} transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}