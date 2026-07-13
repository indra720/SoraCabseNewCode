import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { ROLES, ROLE_LABELS, type Role } from "@/constants/roles";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  organization: string;
  token: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, role: Role) => void;
  logout: () => void;
  switchRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = "rideflow.auth";

function makeUser(email: string, role: Role): AuthUser {
  const name = email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    id: `usr_${role}`,
    name: name || ROLE_LABELS[role],
    email,
    role,
    organization: "Sora Cabs HQ",
    token: `dummy.jwt.${role}.${Date.now()}`,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
      if (raw) {
        const parsed = JSON.parse(raw) as AuthUser;
        if (ROLES.includes(parsed.role)) setUser(parsed);
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  const persist = (u: AuthUser | null) => {
    setUser(u);
    if (typeof window === "undefined") return;
    if (u) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else window.localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login: (email, role) => persist(makeUser(email, role)),
        logout: () => persist(null),
        switchRole: (role) => user && persist({ ...user, role }),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
