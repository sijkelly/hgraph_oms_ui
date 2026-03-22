import { createContext, useContext, useState, type ReactNode } from "react";
import { useUserEntitlements, usePermissionCheck } from "@/api/hooks";
import type { UserEntitlements } from "@/api/types";

interface AuthState {
  userId: string;
  setUserId: (id: string) => void;
  entitlements: UserEntitlements | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  checkPermission: (action: string) => ReturnType<typeof usePermissionCheck>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState(() => {
    return localStorage.getItem("oms_user_id") ?? "";
  });

  const { data: entitlements, isLoading } = useUserEntitlements(userId);

  function handleSetUserId(id: string) {
    setUserId(id);
    localStorage.setItem("oms_user_id", id);
  }

  const value: AuthState = {
    userId,
    setUserId: handleSetUserId,
    entitlements,
    isLoading,
    isAuthenticated: !!entitlements,
    checkPermission: (action: string) => usePermissionCheck(userId, action),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
