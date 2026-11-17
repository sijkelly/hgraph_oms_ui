/**
 * HTTP client for the hgraph OMS API.
 *
 * In development the Vite proxy forwards /api to the FastAPI backend.
 * In production, set VITE_API_BASE_URL to the backend origin.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

// Auth headers injected by AuthContext on sign-in/out
let _userId = "";
let _token = "";
let _onUnauthorized: (() => void) | null = null;

/** Called by AuthContext when auth state changes. */
export function setAuthHeaders(userId: string, token: string) {
  _userId = userId;
  _token = token;
}

/** The bearer token in use, if any (the WebSocket client sends it too). */
export function getAuthToken(): string {
  return _token;
}

/** Called by AuthContext: what to do when the API no longer accepts the token. */
export function setUnauthorizedHandler(handler: (() => void) | null) {
  _onUnauthorized = handler;
}

/** An API error, with the HTTP status so callers can tell "not found" from "not allowed". */
export class ApiError extends Error {
  status: number;

  constructor(status: number, body: string) {
    super(`API ${status}: ${body}`);
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string>),
  };

  // With a token, the API takes the user from it; X-User-Id is only for development mode.
  // A caller may pass its own Authorization header (sign-in does, before a session exists).
  if (!headers["Authorization"]) {
    if (_token) headers["Authorization"] = `Bearer ${_token}`;
    else if (_userId) headers["X-User-Id"] = _userId;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers,
  });

  if (!res.ok) {
    const body = await res.text();
    // An expired or revoked token: end the session so the user is asked to sign in again
    if (res.status === 401 && _token && headers["Authorization"] === `Bearer ${_token}`) {
      _onUnauthorized?.();
    }
    throw new ApiError(res.status, body);
  }

  return res.json() as Promise<T>;
}

export function get<T>(path: string, headers?: Record<string, string>): Promise<T> {
  return request<T>(path, headers ? { headers } : undefined);
}

export function post<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export function patch<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}
