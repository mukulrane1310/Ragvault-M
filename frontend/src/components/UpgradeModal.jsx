import { useState } from "react";
import { Crown, X, Sparkles } from "lucide-react";

export default function UpgradeModal({ message, onClose }) {
  const [showProcessing, setShowProcessing] = useState(false);

  const handleUpgradeClick = () => {
    setShowProcessing(true);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-300"
        >
          <X size={18} />
        </button>

        {!showProcessing ? (
          <>
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center mb-4">
              <Crown className="text-blue-400" size={22} />
            </div>
            <h2 className="text-lg font-bold mb-2">Upgrade to RagVault Pro</h2>
            <p className="text-sm text-slate-400 mb-5 leading-relaxed">
              {message}
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleUpgradeClick}
                className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium"
              >
                Upgrade to Pro
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-lg border border-slate-700 text-slate-300 text-sm hover:border-slate-600"
              >
                Maybe later
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <Sparkles className="text-blue-400 mx-auto mb-3" size={28} />
            <h2 className="text-lg font-bold mb-2">Pro plan is on the way 🚧</h2>
            <p className="text-sm text-slate-400 mb-5">
              We're rolling out RagVault Pro in stages. Your request has been
              noted — check back soon for large-document support.
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm"
            >
              Got it
            </button>
          </div>
        )}
      </div>
    </div>
  );
}