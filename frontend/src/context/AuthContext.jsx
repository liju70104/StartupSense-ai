import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

const API_URL = "https://startupsense-ai-backend.onrender.com";
const AuthContext = createContext(null);

function getSavedUser() {
  try {
    const savedUser = localStorage.getItem("startup_user");
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    localStorage.removeItem("startup_user");
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getSavedUser);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem("startup_user", JSON.stringify(user));
      } else {
        localStorage.removeItem("startup_user");
      }
    } catch {
      localStorage.removeItem("startup_user");
    }
  }, [user]);

  const login = async (email, password) => {
    setAuthLoading(true);

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        setUser(data.user);
        toast.success("Login successful");
        return true;
      }

      toast.error(data.message || "Login failed");
      return false;
    } catch {
      toast.error("Backend not connected");
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setAuthLoading(true);

    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Account created. Please login.");
        return true;
      }

      toast.error(data.message || "Registration failed");
      return false;
    } catch {
      toast.error("Backend not connected");
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("startup_user");
    setUser(null);
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authLoading,
        login,
        register,
        logout,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}