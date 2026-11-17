import { useState } from "react";
import { useAuth } from "./AuthContext";
import { beginLogin, isOidcConfigured } from "./oidc";
import { ClipboardList, LogIn, User } from "lucide-react";

/** Demo accounts available in dev mode. */
const DEV_ACCOUNTS = [
  {
    userId: "sales1",
    displayName: "Sarah (Sales)",
    role: "Sales",
    description: "Places orders for clients",
    color: "bg-emerald-50 border-emerald-200 hover:bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    userId: "demo",
    displayName: "Tom (Trader)",
    role: "Trader",
    description: "Accepts and fills orders",
    color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    userId: "admin",
    displayName: "Alex (Admin)",
    role: "Super User",
    description: "Full system access",
    color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
    iconColor: "text-purple-600",
  },
] as const;

function DevLogin() {
  const { signIn } = useAuth();
  const [customId, setCustomId] = useState("");

  function handleCustomLogin(e: React.FormEvent) {
    e.preventDefault();
    if (customId.trim()) {
      signIn({ userId: customId.trim() });
    }
  }

  return (
    <>
      <div className="space-y-3">
        {DEV_ACCOUNTS.map((acct) => (
          <button
            key={acct.userId}
            onClick={() => signIn({ userId: acct.userId, displayName: acct.displayName })}
            className={`w-full flex items-start gap-3 rounded-lg border p-3 text-left transition-colors ${acct.color}`}
          >
            <User size={20} className={`mt-0.5 ${acct.iconColor}`} />
            <div>
              <div className="text-sm font-semibold text-slate-900">{acct.displayName}</div>
              <div className="text-xs text-slate-500">
                {acct.role} — {acct.description}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-2 text-slate-400">or sign in manually</span>
        </div>
      </div>

      <form onSubmit={handleCustomLogin} className="flex gap-2">
        <input
          type="text"
          value={customId}
          onChange={(e) => setCustomId(e.target.value)}
          placeholder="Custom User ID"
          className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={!customId.trim()}
          className="rounded-md bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          Go
        </button>
      </form>
    </>
  );
}

function SSOLogin() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSignIn() {
    setBusy(true);
    setError("");
    try {
      await beginLogin(); // leaves the page for the identity provider
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in could not be started");
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        Sign in with your corporate credentials to access the Order Management System.
      </p>
      <button
        onClick={handleSignIn}
        disabled={busy || !isOidcConfigured()}
        className="flex items-center justify-center gap-2 w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        <LogIn size={16} />
        {busy ? "Redirecting..." : "Sign in with SSO"}
      </button>
      {!isOidcConfigured() && (
        <p className="text-sm text-red-600">
          SSO is not configured for this build (VITE_OIDC_ISSUER and VITE_OIDC_CLIENT_ID).
        </p>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default function LoginPrompt() {
  const { mode } = useAuth();

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white mb-3">
            <ClipboardList size={24} />
          </div>
          <h1 className="text-xl font-bold text-slate-900">hgraph OMS</h1>
          <p className="text-sm text-slate-500">Order Management System</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            {mode === "dev" ? "Select Account" : "Sign In"}
          </h2>

          {mode === "dev" ? <DevLogin /> : <SSOLogin />}
        </div>

        {mode === "dev" && (
          <p className="text-center text-xs text-slate-400 mt-4">
            Development mode — demo accounts only
          </p>
        )}
      </div>
    </div>
  );
}
