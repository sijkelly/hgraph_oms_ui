import type { ReactNode } from "react";
import { useAuth } from "./AuthContext";

interface RequireAuthProps {
  children: ReactNode;
  /** Required entitlements action (e.g. "execute_trade"). If omitted, just checks auth. */
  action?: string;
}

/**
 * Action-level permission gate.
 *
 * Use inside pages to conditionally render content based on the user's
 * entitlements. App-level auth is handled by AuthGate — this component
 * assumes the user is already authenticated.
 */
export default function RequireAuth({ children, action }: RequireAuthProps) {
  const { entitlements } = useAuth();

  if (action && entitlements) {
    if (!entitlements.allowed_actions.includes(action)) {
      return (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <h2 className="text-lg font-semibold text-red-800">Access Denied</h2>
          <p className="text-sm text-red-600 mt-1">
            Your role ({entitlements.role}) does not have permission to{" "}
            <strong>{action}</strong>.
          </p>
        </div>
      );
    }
  }

  return <>{children}</>;
}
