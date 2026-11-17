import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { get } from "@/api/client";
import { useAuth } from "./AuthContext";
import { completeLogin } from "./oidc";

interface CurrentUser {
  user_id: string;
}

/**
 * SSO callback route — where the identity provider sends the browser back to.
 *
 * Exchanges the one-time code for an access token, then asks the OMS API who the
 * token belongs to. The API verifies the token, so the user ID shown and used here
 * is the one the API will act on; nothing about the user is taken from the URL.
 */
export default function SSOCallback() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [error, setError] = useState("");
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return; // the code can only be exchanged once
    started.current = true;

    (async () => {
      try {
        const token = await completeLogin(params);
        // Ask with the new token directly: an existing session is left alone unless this succeeds
        const me = await get<CurrentUser>("/api/v1/me", { Authorization: `Bearer ${token.accessToken}` });
        signIn({
          userId: me.user_id,
          displayName: token.displayName,
          token: token.accessToken,
          expiresAt: token.expiresAt,
        });
        navigate("/", { replace: true });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Sign-in failed");
      }
    })();
  }, [params, signIn, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      {error ? (
        <div className="w-full max-w-md rounded-lg border border-red-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-red-800">Sign-in failed</h2>
          <p className="text-sm text-slate-600 mt-2">{error}</p>
          <button
            onClick={() => navigate("/", { replace: true })}
            className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Back to sign in
          </button>
        </div>
      ) : (
        <p className="text-sm text-slate-500">Completing sign-in...</p>
      )}
    </div>
  );
}
