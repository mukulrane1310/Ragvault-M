export default function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="h-6 w-32 bg-slate-800 rounded animate-pulse" />
          <div className="h-8 w-24 bg-slate-800 rounded animate-pulse" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 flex flex-col gap-6">
        <div className="h-24 bg-slate-900 border border-slate-800 rounded-xl animate-pulse" />
        <div className="h-32 bg-slate-900 border border-slate-800 rounded-xl animate-pulse" />
        <div className="h-64 bg-slate-900 border border-slate-800 rounded-xl animate-pulse" />
      </div>
    </div>
  );
}