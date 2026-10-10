import { Link, useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { useAuth } from "../context/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="border-b border-slate-800 bg-slate-900/50">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <BookOpen size={20} className="text-blue-500" />
            RagVault
        </Link>

        {user ? (
          <div className="flex items-center gap-6">
            <Link to="/" className="text-sm text-slate-300 hover:text-white">
              Home
            </Link>
            <Link to="/dashboard" className="text-sm text-slate-300 hover:text-white">
              Dashboard
            </Link>
            <Link to="/profile" className="text-sm text-slate-300 hover:text-white">
               Profile
            </Link>
            <Link to="/about" className="text-sm text-slate-300 hover:text-white">
              About
            </Link>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
              <span className="text-xs text-slate-500">{user.name || user.email}</span>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-sm rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700"
              >
                Log Out
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/about" className="text-sm text-slate-300 hover:text-white">
              About
            </Link>
            <Link
              to="/login"
              className="text-sm px-3 py-1.5 rounded-md text-slate-300 hover:text-white"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="text-sm px-4 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}