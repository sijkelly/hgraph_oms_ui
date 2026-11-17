/**
 * OpenID Connect sign-in for the browser: Authorization Code flow with PKCE.
 *
 * The UI is a public client (it holds no secret). It sends the user to the
 * identity provider, receives a one-time code on /auth/callback, and exchanges
 * that code — together with a verifier only this browser tab knows — for an
 * access token. The token is then sent to the OMS API as a bearer token, and
 * the API (which verifies it) is what says who the user is.
 *
 * Configure with:
 *   VITE_AUTH_MODE=sso
 *   VITE_OIDC_ISSUER      the provider's issuer URL (same value as the API's OIDC_ISSUER)
 *   VITE_OIDC_CLIENT_ID   this application's client ID at the provider
 *   VITE_OIDC_SCOPE       optional, default "openid profile"
 *   VITE_OIDC_AUDIENCE    optional, the API's audience, for providers that need it in the request
 */

const ISSUER = (import.meta.env.VITE_OIDC_ISSUER ?? "").replace(/\/+$/, "");
const CLIENT_ID = import.meta.env.VITE_OIDC_CLIENT_ID ?? "";
const SCOPE = import.meta.env.VITE_OIDC_SCOPE ?? "openid profile";
const AUDIENCE = import.meta.env.VITE_OIDC_AUDIENCE ?? "";

const PENDING_KEY = "oms_oidc_pending";

interface ProviderMetadata {
  authorization_endpoint: string;
  token_endpoint: string;
}

interface PendingLogin {
  state: string;
  verifier: string;
}

export interface TokenResult {
  accessToken: string;
  /** Epoch milliseconds after which the token should no longer be used; 0 if the provider did not say. */
  expiresAt: number;
  /** The user's name from the ID token, for display only. */
  displayName: string;
}

/** Whether the build has the settings needed for SSO sign-in. */
export function isOidcConfigured(): boolean {
  return !!ISSUER && !!CLIENT_ID;
}

export function redirectUri(): string {
  return `${window.location.origin}/auth/callback`;
}

let metadataPromise: Promise<ProviderMetadata> | null = null;

function providerMetadata(): Promise<ProviderMetadata> {
  if (!metadataPromise) {
    metadataPromise = fetch(`${ISSUER}/.well-known/openid-configuration`)
      .then((res) => {
        if (!res.ok) throw new Error(`The identity provider's configuration could not be read (HTTP ${res.status})`);
        return res.json() as Promise<ProviderMetadata>;
      })
      .catch((err) => {
        metadataPromise = null; // allow a retry
        throw err;
      });
  }
  return metadataPromise;
}

function base64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function randomString(): string {
  return base64Url(crypto.getRandomValues(new Uint8Array(32)));
}

async function challengeFor(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  return base64Url(new Uint8Array(digest));
}

/** Send the browser to the identity provider to sign in. Does not return if it succeeds. */
export async function beginLogin(): Promise<void> {
  if (!isOidcConfigured()) {
    throw new Error("SSO is not configured: set VITE_OIDC_ISSUER and VITE_OIDC_CLIENT_ID");
  }
  const metadata = await providerMetadata();
  const pending: PendingLogin = { state: randomString(), verifier: randomString() };
  sessionStorage.setItem(PENDING_KEY, JSON.stringify(pending));

  const url = new URL(metadata.authorization_endpoint);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", CLIENT_ID);
  url.searchParams.set("redirect_uri", redirectUri());
  url.searchParams.set("scope", SCOPE);
  url.searchParams.set("state", pending.state);
  url.searchParams.set("code_challenge", await challengeFor(pending.verifier));
  url.searchParams.set("code_challenge_method", "S256");
  if (AUDIENCE) url.searchParams.set("audience", AUDIENCE);
  window.location.assign(url.toString());
}

function displayNameFrom(idToken: unknown): string {
  // Read for display only. Nothing is trusted from here: the API verifies the access token.
  if (typeof idToken !== "string") return "";
  try {
    const payload = idToken.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const bytes = Uint8Array.from(atob(payload), (ch) => ch.charCodeAt(0));
    const claims = JSON.parse(new TextDecoder().decode(bytes)) as Record<string, unknown>;
    const name = claims.name ?? claims.preferred_username ?? claims.email;
    return typeof name === "string" ? name : "";
  } catch {
    return "";
  }
}

/**
 * Finish sign-in on /auth/callback: check the response belongs to the login this tab started,
 * then exchange the code for an access token.
 */
export async function completeLogin(params: URLSearchParams): Promise<TokenResult> {
  const raw = sessionStorage.getItem(PENDING_KEY);
  sessionStorage.removeItem(PENDING_KEY); // one use only

  const error = params.get("error");
  if (error) {
    throw new Error(params.get("error_description") ?? `The identity provider refused the sign-in (${error})`);
  }
  const code = params.get("code");
  const pending = raw ? (JSON.parse(raw) as PendingLogin) : null;
  if (!code || !pending) {
    throw new Error("This sign-in link is not valid. Please sign in again.");
  }
  if (params.get("state") !== pending.state) {
    throw new Error("The sign-in response did not match the request. Please sign in again.");
  }

  const metadata = await providerMetadata();
  const res = await fetch(metadata.token_endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri(),
      client_id: CLIENT_ID,
      code_verifier: pending.verifier,
    }),
  });
  if (!res.ok) {
    throw new Error(`The identity provider did not issue a token (HTTP ${res.status})`);
  }
  const body = (await res.json()) as { access_token?: string; expires_in?: number; id_token?: string };
  if (!body.access_token) {
    throw new Error("The identity provider's response had no access token");
  }
  return {
    accessToken: body.access_token,
    expiresAt: body.expires_in ? Date.now() + body.expires_in * 1000 : 0,
    displayName: displayNameFrom(body.id_token),
  };
}
