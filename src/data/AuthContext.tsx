import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "../lib/supabase";
import type { Session, User as SupabaseUser } from "@supabase/supabase-js";

interface AuthCtx {
  session: Session | null;
  user: SupabaseUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    const onStorage = (e: StorageEvent) => {
      if (e.key && e.key.includes("auth-token")) {
        supabase.auth.getSession().then(({ data }) => {
          setSession(data.session);
        });
      }
    };
    window.addEventListener("storage", onStorage);

    // Re-sync profile data when the user comes back to this tab
    let lastSync = 0;
    const syncUser = async () => {
      if (document.visibilityState !== "visible") return;
      if (Date.now() - lastSync < 30_000) return;  
      lastSync = Date.now();                      
      const { data } = await supabase.auth.getUser();
      const fresh = data.user;
      if (!fresh) return;
      setSession((prev) => {
        if (!prev) return prev;
        const same =
          JSON.stringify(prev.user.user_metadata) ===
          JSON.stringify(fresh.user_metadata);
        return same ? prev : { ...prev, user: fresh };
      });
    };
    document.addEventListener("visibilitychange", syncUser);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", syncUser);
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        isAuthenticated: !!session,
        loading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
