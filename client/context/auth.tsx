"use client";
import { createContext, useState, useEffect, useContext } from "react";
import api from "../lib/api";

type User = {
  id: number;
  name: string;
  email: string;
}

  type AuthContextType = {
  user: User | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const response = await api.get('/api/me');
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    const response = await api.post('/auth/login', { email, password, rememberMe });
    // If rememberMe is true, cookie lasts 30 days (2592000s). Otherwise 1 day (86400s).
    const maxAge = rememberMe ? 2592000 : 86400; 
    document.cookie = `token=${response.data.token}; path=/; max-age=${maxAge}`;
    setUser(response.data.user);
  }

  const logout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
