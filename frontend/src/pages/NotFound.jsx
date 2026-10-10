import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-57px)] flex flex-col items-center justify-center text-center px-6">
      <Compass size={40} className="text-blue-500 mb-4" />
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <p className="text-slate-400 mb-6">
        This page doesn't exist — or maybe it's still being indexed.
      </p>
      <Link
        to="/"
        className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium"
      >
        Back to Home
      </Link>
    </div>
  );
}