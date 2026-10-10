export default function Footer() {
  return (
    <footer className="border-t border-slate-800 mt-20">
      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-slate-500">
        <p>
          Built by <span className="text-slate-300 font-medium">Mukul Rane</span>
        </p>
        <p>Licensed</p>
        <p>© {new Date().getFullYear()} RagVault</p>
      </div>
    </footer>
  );
}