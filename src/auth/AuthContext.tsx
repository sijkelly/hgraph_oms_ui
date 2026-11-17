import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { useUserEntitlements } from "@/api/hooks";
import { setAuthHeaders, setUnauthorizedHandler } from "@/api/client";
import { creditWs } from "@/api/websocket";
import type { UserEntitlements } from "@/api/types";

/**
 * Authentication mode.
 *
 * - "dev"  — built-in test accounts (demo, admin, sales1) for local development
 * - "sso"  — OpenID Connect sign-in (see ./oidc.ts). The callback route exchanges the
 *            provider's code for an access token and asks the API who the user is.
 *
 * Set via VITE_AUTH_MODE env var. Defaults to "dev".
 */
export type AuthMode = "dev" | "sso";

export interface AuthState {
  /** Current auth mode */
  mode: AuthMode;
  /** Authenticated user ID (empty string if not signed in) */
  userId: string;
  /** Display name for the user */
  displayName: string;
  /** SSO token (opaque to the UI — passed to API as Bearer token) */
  token: string;
  /** Sign in with a user ID (dev mode) or a verified SSO token */
  signIn: (opts: { userId: string; displayName?: string; token?: string; expiresAt?: number }) => void;
  /** Sign out and clear session */
  signOut: () => void;
  /** Entitlements loaded from the backend */
  entitlements: UserEntitlements | undefined;
  /** Whether entitlements are still loading */
  isLoading: boolean;
  /** Whether the user is fully authenticated */
  isAuthenticated: boolean;
}

const AUTH_MODE = (import.meta.env.VITE_AUTH_MODE ?? "dev") as AuthMode;

const SESSION_KEY = "oms_session";

interface StoredSession {
  userId: string;
  displayName: string;
  token: string;
  /** Epoch milliseconds after which the token is no longer used; 0 if unknown or not applicable */
  expiresAt: number;
}

const SIGNED_OUT: StoredSession = { userId: "", displayName: "", token: "", expiresAt: 0 };

// A token lasts only as long as the browser tab; a dev-mode user ID is remembered across restarts
const storage = AUTH_MODE === "sso" ? sessionStorage : localStorage;

function loadSession(): StoredSession {
  let session = SIGNED_OUT;
  try {
    const raw = storage.getItem(SESSION_KEY);
    if (raw) session = { ...SIGNED_OUT, ...(JSON.parse(raw) as Partial<StoredSession>) };
  } catch { /* ignore corrupt storage */ }

  const expired = session.expiresAt > 0 && session.expiresAt <= Date.now();
  // In sso mode a session is only a session if it has a token
  if (expired || (AUTH_MODE === "sso" && !session.token)) session = SIGNED_OUT;

  // Before the first render, so that no request goes out without its credentials
  setAuthHeaders(session.userId, session.token);
  return session;
}

function saveSession(session: StoredSession) {
  storage.setItem(SESSION_KEY, JSON.stringify(session));
}

function clearSession() {
  storage.removeItem(SESSION_KEY);
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<StoredSession>(loadSession);

  const { data: entitlements, isLoading } = useUserEntitlements(session.userId);

  const applySession = useCallback((next: StoredSession) => {
    setAuthHeaders(next.userId, next.token);
    creditWs.disconnect(); // reconnects with the new credentials when next used
    setSession(next);
  }, []);

  const signIn = useCallback(
    (opts: { userId: string; displayName?: string; token?: string; expiresAt?: number }) => {
      const next: StoredSession = {
        userId: opts.userId,
        displayName: opts.displayName || opts.userId,
        token: opts.token ?? "",
        expiresAt: opts.expiresAt ?? 0,
      };
      saveSession(next);
      applySession(next);
    },
    [applySession],
  );

  const signOut = useCallback(() => {
    clearSession();
    applySession(SIGNED_OUT);
  }, [applySession]);

  // If the API stops accepting the token, or it reaches its expiry, ask the user to sign in again
  useEffect(() => {
    setUnauthorizedHandler(signOut);
    return () => setUnauthorizedHandler(null);
  }, [signOut]);

  useEffect(() => {
    if (!session.token || !session.expiresAt) return;
    const timer = setTimeout(signOut, Math.max(session.expiresAt - Date.now(), 0));
    return () => clearTimeout(timer);
  }, [session.token, session.expiresAt, signOut]);

  const value: AuthState = {
    mode: AUTH_MODE,
    userId: session.userId,
    displayName: session.displayName,
    token: session.token,
    signIn,
    signOut,
    entitlements,
    isLoading,
    isAuthenticated: !!session.userId && !!entitlements,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// The hook lives beside its provider; fast refresh reloads this file in full, which is fine
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
