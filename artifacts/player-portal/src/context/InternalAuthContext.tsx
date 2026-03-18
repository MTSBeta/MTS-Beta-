import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export interface InternalUser {
  id: number;
  email: string;
  fullName: string;
  role: string;
}

interface InternalAuthContextValue {
  internalUser: InternalUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const InternalAuthContext = createContext<InternalAuthContextValue>({
  internalUser: null,
  isLoading: true,
  login: async () => {},
  logout: () => {},
});

const TOKEN_KEY = "metime_internal_token";
const API_BASE = `${import.meta.env.BASE_URL}api`.replace(/\/+api$/, "/api");

export function InternalAuthProvider({ children }: { children: ReactNode }) {
  const [internalUser, setInternalUser] = useState<InternalUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setIsLoading(false);
      return;
    }
    fetch(`${API_BASE}/internal/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setInternalUser(data.user))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/internal/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Invalid email or password");
    }
    const data = await res.json();
    localStorage.setItem(TOKEN_KEY, data.token);
    setInternalUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setInternalUser(null);
  };

  return (
    <InternalAuthContext.Provider value={{ internalUser, isLoading, login, logout }}>
      {children}
    </InternalAuthContext.Provider>
  );
}

export function useInternalAuth() {
  return useContext(InternalAuthContext);
}

