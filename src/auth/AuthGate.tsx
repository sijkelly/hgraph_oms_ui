import type { ReactNode } from "react";
import { useAuth } from "./AuthContext";
import LoginPrompt from "./LoginPrompt";

/**
 * App-level authentication gate.
 *
 * Renders children only when the user is authenticated.
 * Otherwise shows the full-page login screen.
 */
export default function AuthGate({ children }: { children: ReactNode }) {
  const { userId, isLoading } = useAuth();

  if (!userId) {
    return <LoginPrompt />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}
