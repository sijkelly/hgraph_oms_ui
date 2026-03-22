import type { ReactNode } from "react";
import { useAuth } from "./AuthContext";
import LoginPrompt from "./LoginPrompt";

interface RequireAuthProps {
  children: ReactNode;
  action?: string;
}

export default function RequireAuth({ children, action }: RequireAuthProps) {
  const { userId, isAuthenticated, isLoading, entitlements } = useAuth();

  if (!userId) {
    return <LoginPrompt />;
  }

  if (isLoading) {
    return <p className="text-sm text-slate-500 p-6">Checking permissions...</p>;
  }

  if (!isAuthenticated) {
    return <LoginPrompt message="User not found. Please enter a valid user ID." />;
  }

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
