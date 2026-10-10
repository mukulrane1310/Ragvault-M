import { useState, useEffect, useCallback } from "react";
import { getCurrentUser } from "../services/auth";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }, []);

  const fetchUser = useCallback(
    async (activeToken) => {
      try {
        const userData = await getCurrentUser(activeToken);
        setUser(userData);
      } catch (err) {
        console.error("Failed to load user:", err);
        logout();
      }
    },
    [logout]
  );

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      setLoading(true);
      await fetchUser(token);
      setLoading(false);
    };

    loadUser();
  }, [token, fetchUser]);

  const loginUser = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const refreshUser = async () => {
    if (token) {
      await fetchUser(token);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loginUser, logout, loading, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}