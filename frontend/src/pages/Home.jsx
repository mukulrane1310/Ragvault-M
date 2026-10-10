import { Link } from "react-router-dom";
import {
  FileText,
  MessageSquare,
  Zap,
  Shield,
  Search,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../context/useAuth";
import Footer from "../components/Footer";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-[calc(100vh-57px)]">
      <div className="flex-1">
        {/* Hero */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-blue-950/40 via-slate-950 to-slate-950 pointer-events-none" />
          <div className="relative max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-6">
              <Sparkles size={12} />
              Powered by Retrieval-Augmented Generation
            </span>

            <h1 className="text-4xl sm:text-6xl font-bold leading-tight mb-5 tracking-tight">
              Your documents,
              <br />
              <span className="bg-linear-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">
                finally searchable
              </span>
            </h1>

            <p className="text-slate-400 text-lg max-w-xl mx-auto mb-10">
              RagVault turns any PDF into an AI you can talk to. Upload a
              document, ask a question in plain English, and get an answer
              grounded in the exact source — every time.
            </p>

            <div className="flex items-center justify-center gap-4">
              <Link
                to={user ? "/dashboard" : "/signup"}
                className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
              >
                {user ? "Go to Dashboard" : "Get Started Free"}
              </Link>
              <Link
                to="/about"
                className="px-6 py-3 rounded-lg border border-slate-700 hover:border-slate-600 text-slate-300 font-medium transition-colors"
              >
                How it works
              </Link>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-center text-sm font-semibold text-blue-400 uppercase tracking-wide mb-2">
            How it works
          </h2>
          <p className="text-center text-slate-400 mb-12">
            Three steps from document to answer.
          </p>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="w-9 h-9 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold mb-4">
                1
              </div>
              <h3 className="font-semibold mb-2">Upload your PDF</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Notes, research papers, reports, contracts — RagVault reads
                and indexes the full document in seconds.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="w-9 h-9 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold mb-4">
                2
              </div>
              <h3 className="font-semibold mb-2">Ask anything</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Type a question like you're texting a friend who already
                read the whole thing.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="w-9 h-9 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold mb-4">
                3
              </div>
              <h3 className="font-semibold mb-2">Get a grounded answer</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Every answer links back to the exact passage it came from —
                no guessing, no hallucination.
              </p>
            </div>
          </div>
        </div>

        {/* Feature grid */}
        <div className="max-w-5xl mx-auto px-6 py-16 border-t border-slate-900">
          <h2 className="text-center text-sm font-semibold text-blue-400 uppercase tracking-wide mb-2">
            Why RagVault
          </h2>
          <p className="text-center text-slate-400 mb-12">
            Built for accuracy, not just answers.
          </p>

          <div className="grid sm:grid-cols-2 gap-5">
            <div className="flex gap-4 p-5 rounded-xl bg-slate-900/50 border border-slate-800">
              <Search className="text-blue-500 shrink-0" size={22} />
              <div>
                <h3 className="font-semibold mb-1">Source-cited answers</h3>
                <p className="text-sm text-slate-400">
                  Every response shows exactly which part of your document
                  it came from, so you can verify it yourself.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-5 rounded-xl bg-slate-900/50 border border-slate-800">
              <FileText className="text-blue-500 shrink-0" size={22} />
              <div>
                <h3 className="font-semibold mb-1">Multi-document support</h3>
                <p className="text-sm text-slate-400">
                  Upload as many documents as you need and switch between
                  them instantly — each stays fully isolated.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-5 rounded-xl bg-slate-900/50 border border-slate-800">
              <MessageSquare className="text-blue-500 shrink-0" size={22} />
              <div>
                <h3 className="font-semibold mb-1">Persistent chat history</h3>
                <p className="text-sm text-slate-400">
                  Every conversation is saved per document, so you never
                  lose context between sessions.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-5 rounded-xl bg-slate-900/50 border border-slate-800">
              <Shield className="text-blue-500 shrink-0" size={22} />
              <div>
                <h3 className="font-semibold mb-1">Private by default</h3>
                <p className="text-sm text-slate-400">
                  Your documents and conversations are tied to your account
                  only — nobody else can see them.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA band */}
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <div className="bg-linear-to-br from-blue-600/20 to-slate-900 border border-blue-500/20 rounded-2xl px-8 py-12">
            <Zap className="text-blue-400 mx-auto mb-4" size={28} />
            <h2 className="text-2xl font-bold mb-3">
              Stop searching. Start asking.
            </h2>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              It takes less than a minute to upload your first document and
              get your first answer.
            </p>
            <Link
              to={user ? "/dashboard" : "/signup"}
              className="inline-block px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
            >
              {user ? "Go to Dashboard" : "Create Free Account"}
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}