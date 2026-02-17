/**
 * Token Manager (Singleton)
 * - Stores accessToken in memory only (never localStorage)
 * - Persists refreshToken in sessionStorage for recovery after reload
 * - Single in-flight refresh: concurrent callers get the same promise
 * - Production-ready: no race conditions, no infinite retry loops
 */

const REFRESH_STORAGE_KEY = "limos_refresh_token";

let accessToken: string | null = null;
let refreshPromise: Promise<string> | null = null;
type OnRefreshFailed = () => void;

let onRefreshFailedCallback: OnRefreshFailed | null = null;

function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(REFRESH_STORAGE_KEY);
}

function setRefreshTokenPersisted(token: string | null): void {
  if (typeof window === "undefined") return;
  if (token) sessionStorage.setItem(REFRESH_STORAGE_KEY, token);
  else sessionStorage.removeItem(REFRESH_STORAGE_KEY);
}

/**
 * Get the base URL for the user service (refresh-token endpoint).
 * Uses VITE_API_USER_SERVICE_URL from env.
 */
function getUserServiceBaseUrl(): string {
  const url = (import.meta as any).env?.VITE_API_USER_SERVICE_URL;
  if (!url) throw new Error("VITE_API_USER_SERVICE_URL is not set");
  return url.replace(/\/$/, "");
}

/**
 * Perform a single refresh request. Does not coordinate with other callers.
 */
async function doRefresh(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error("No refresh token");
  }
  const baseUrl = getUserServiceBaseUrl();
  const res = await fetch(`${baseUrl}/refresh-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.message || "Refresh failed";
    if (
      res.status === 401 ||
      /expired|invalid|unauthorized/i.test(String(msg))
    ) {
      tokenManager.clear();
      onRefreshFailedCallback?.();
    }
    throw new Error(msg);
  }
  const newAccess = data?.data?.accessToken ?? data?.accessToken;
  const newRefresh = data?.data?.refreshToken ?? data?.refreshToken;
  if (!newAccess) throw new Error("No access token in refresh response");
  accessToken = newAccess;
  if (newRefresh) setRefreshTokenPersisted(newRefresh);
  return newAccess;
}

export const tokenManager = {
  /** Get current access token (memory only). */
  getAccessToken(): string | null {
    return accessToken;
  },

  /** Set tokens after login. Access in memory; refresh persisted to sessionStorage. */
  setTokens(access: string, refresh: string): void {
    accessToken = access;
    setRefreshTokenPersisted(refresh);
    refreshPromise = null;
  },

  /** Clear all tokens and persisted refresh. Call on logout or refresh failure. */
  clear(): void {
    accessToken = null;
    refreshPromise = null;
    setRefreshTokenPersisted(null);
  },

  /**
   * Refresh access token. Only one refresh runs at a time; others wait on the same promise.
   * Rejects if refresh token is missing or invalid.
   */
  async refresh(): Promise<string> {
    if (refreshPromise) return refreshPromise;
    refreshPromise = doRefresh();
    try {
      const token = await refreshPromise;
      return token;
    } finally {
      refreshPromise = null;
    }
  },

  /** Restore access token from persisted refresh (e.g. after page reload). Call only on client. */
  async restoreFromRefresh(): Promise<string | null> {
    const refresh = getRefreshToken();
    if (!refresh) return null;
    try {
      return await this.refresh();
    } catch {
      return null;
    }
  },

  /** Register callback when refresh fails (e.g. redirect to login). */
  onRefreshFailed(cb: OnRefreshFailed): void {
    onRefreshFailedCallback = cb;
  },
};
