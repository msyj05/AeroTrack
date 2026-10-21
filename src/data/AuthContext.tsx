import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface AuthCtx {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Check localStorage on initial load
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("aerotrack:auth") === "true";
  });

  const login = () => {
    localStorage.setItem("aerotrack:auth", "true");
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("aerotrack:auth");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
