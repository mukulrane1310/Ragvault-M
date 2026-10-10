import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/useAuth";
import Profile from "./pages/Profile";
import LoadingSkeleton from "./components/LoadingSkeleton";
import "./index.css";

function App() {
  const { loading } = useAuth();

  if (loading) {
  return <LoadingSkeleton />;
}

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
       <Route
  path="/login"
  element={
    <div className="flex items-center justify-center px-6 py-16">
      <Login />
    </div>
  }
/>
<Route
  path="/signup"
  element={
    <div className="flex items-center justify-center px-6 py-16">
      <Signup />
    </div>
  }
/>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
                 path="/profile"
                  element={
                 <ProtectedRoute>
                 <Profile />
                </ProtectedRoute>
           }
        />


      </Routes>
    </div>
  );
}

export default App;