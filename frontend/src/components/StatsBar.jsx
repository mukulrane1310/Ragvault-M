import { FileText, MessageSquare, Tag } from "lucide-react";

function getTopCategory(documents) {
  if (documents.length === 0) return "—";

  const counts = {};
  documents.forEach((doc) => {
    counts[doc.category] = (counts[doc.category] || 0) + 1;
  });

  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return top[0];
}

export default function StatsBar({ documents, totalQuestions }) {
  const stats = [
    { label: "Documents", value: documents.length, icon: FileText },
    { label: "Questions Asked", value: totalQuestions, icon: MessageSquare },
    { label: "Top Category", value: getTopCategory(documents), icon: Tag },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-600/20 flex items-center justify-center shrink-0">
              <Icon size={16} className="text-blue-400" />
            </div>
            <div className="min-w-0">
              <p className="text-lg font-bold leading-none capitalize truncate">
                {stat.value}
              </p>
              <p className="text-xs text-slate-500 mt-1 truncate">{stat.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}