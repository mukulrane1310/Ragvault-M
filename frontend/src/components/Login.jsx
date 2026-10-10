import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, BookOpen } from "lucide-react";
import { login } from "../services/auth";
import { useAuth } from "../context/useAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(email, password);
      loginUser(result.access_token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
      <div className="flex flex-col items-center mb-6">
        <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center mb-3">
          <BookOpen className="text-blue-400" size={22} />
        </div>
        <h2 className="text-2xl font-bold">Welcome back</h2>
        <p className="text-slate-400 text-sm mt-1">
          Log in to access your documents
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-xs font-medium text-slate-400 mb-1.5 block">
            Email
          </label>
          <div className="relative">
            <Mail
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-700 bg-slate-950 text-slate-200 text-base focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-400 mb-1.5 block">
            Password
          </label>
          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-700 bg-slate-950 text-slate-200 text-base focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>

        {error && (
          <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 px-4 py-3 rounded-lg bg-blue-600 text-white font-medium cursor-pointer disabled:bg-slate-700 hover:bg-blue-500 transition-colors"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>

      <p className="text-sm text-slate-400 mt-6 text-center">
        Don't have an account?{" "}
        <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium">
          Sign up
        </Link>
      </p>
    </div>
  );
}