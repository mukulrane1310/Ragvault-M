import {
  Server,
  Layers,
  Database,
  Brain,
  GitBranch,
  Rocket,
  CheckCircle2,
  Circle,
} from "lucide-react";
import Footer from "../components/Footer";

const TECH_STACK = [
  {
    category: "Backend",
    icon: Server,
    items: ["FastAPI", "SQLAlchemy", "SQLite", "Python-Jose (JWT)", "Passlib (bcrypt)"],
  },
  {
    category: "AI / RAG Pipeline",
    icon: Brain,
    items: ["Sentence-Transformers", "ChromaDB", "Groq (Llama 3.3 70B)", "pdfplumber"],
  },
  {
    category: "Frontend",
    icon: Layers,
    items: ["React", "React Router", "Tailwind CSS v4", "Vite", "Lucide Icons"],
  },
  {
    category: "Data & Storage",
    icon: Database,
    items: ["SQLite (relational data)", "ChromaDB (vector embeddings)"],
  },
];

const ROADMAP = [
  { label: "Multi-document support", done: true },
  { label: "Source citations", done: true },
  { label: "Authentication & per-user data", done: true },
  { label: "Persistent chat history", done: true },
  { label: "Document categorization", done: true },
  { label: "Answer grounding confidence score", done: true },
  { label: "Visual PDF source highlighting", done: true },
  { label: "Streaming responses", done: false },
  { label: "Evaluation dashboard", done: false },
  { label: "Team / shared workspaces", done: false },
];

export default function About() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-57px)]">
      <div className="flex-1 max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-3">About RagVault</h1>
        <p className="text-slate-400 leading-relaxed mb-12">
          RagVault is a full-stack Retrieval-Augmented Generation (RAG)
          application that turns any PDF into a searchable, conversational
          knowledge base. Upload a document, ask questions in plain
          English, and get answers grounded in the exact source text —
          with citations, not guesses.
        </p>

        {/* Tech Stack */}
        <section className="mb-14">
          <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wide mb-5">
            Built With
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {TECH_STACK.map((group) => {
              const Icon = group.icon;
              return (
                <div
                  key={group.category}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-5"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Icon size={16} className="text-blue-500" />
                    <h3 className="font-semibold text-sm">{group.category}</h3>
                  </div>
                  <ul className="flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded-md"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* How the pipeline works */}
        <section className="mb-14">
          <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wide mb-5">
            How the Pipeline Works
          </h2>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <ol className="text-sm text-slate-400 leading-relaxed space-y-2 list-decimal list-inside">
              <li>PDF text is extracted and split into overlapping chunks</li>
              <li>
                Each chunk is embedded into a vector using
                Sentence-Transformers and stored in ChromaDB
              </li>
              <li>
                A user's question is embedded the same way, and the most
                similar chunks are retrieved via cosine similarity
              </li>
              <li>
                Retrieved chunks + the question are sent to Llama 3.3 70B
                (via Groq) to generate a grounded answer
              </li>
              <li>The answer is returned with links back to its source chunks</li>
            </ol>
          </div>
        </section>

        {/* Roadmap */}
        <section className="mb-14">
          <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wide mb-5 flex items-center gap-2">
            <Rocket size={14} />
            Roadmap
          </h2>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-2.5">
            {ROADMAP.map((item) => (
              <div key={item.label} className="flex items-center gap-2.5 text-sm">
                {item.done ? (
                  <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                ) : (
                  <Circle size={16} className="text-slate-600 shrink-0" />
                )}
                <span className={item.done ? "text-slate-300" : "text-slate-500"}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Source */}
        <section>
          <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wide mb-5 flex items-center gap-2">
            <GitBranch size={14} />
            Open Source
          </h2>
          <p className="text-sm text-slate-400">
            RagVault is built as a learning project exploring modern RAG
            architecture, full-stack development, and production-style
            engineering practices.
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
}