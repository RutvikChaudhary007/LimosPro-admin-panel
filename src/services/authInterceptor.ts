/**
 * Auth interceptor for REST (axios) client.
 * - Attaches Authorization from tokenManager
 * - On 401 + token expired: triggers single refresh, retries request once
 * - On refresh failure: tokenManager clears and calls onRefreshFailed (redirect to login)
 */

import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { tokenManager } from "./tokenManager";

const RETRY_MARKER = "_authRetry";

function isExpiredOrUnauth(message: unknown): boolean {
  const s = String(message ?? "").toLowerCase();
  return (
    s.includes("jwt expired") ||
    s.includes("token has expired") ||
    s.includes("jwt token has expired") ||
    s.includes("invalid jwt token") ||
    s.includes("unauthorized")
  );
}

/**
 * Request interceptor: attach Bearer token from tokenManager (memory).
 */
export function attachAuthToken(
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig {
  const token = tokenManager.getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}

/**
 * Response error handler: on 401 and expired message, refresh once and retry.
 * Prevents infinite retry via RETRY_MARKER on config.
 */
export async function handleAuthError(
  error: AxiosError,
  axiosInstance: (config: InternalAxiosRequestConfig) => Promise<unknown>,
): Promise<unknown> {
  const config = error.config as InternalAxiosRequestConfig & {
    [RETRY_MARKER]?: boolean;
  };
  const status = error.response?.status;
  const message =
    (error.response?.data as any)?.message ??
    (error.response?.data as any)?.error;

  if (status !== 401 || !config || config[RETRY_MARKER]) {
    return Promise.reject(error);
  }

  if (!isExpiredOrUnauth(message)) {
    return Promise.reject(error);
  }

  config[RETRY_MARKER] = true;

  try {
    const newToken = await tokenManager.refresh();
    if (config.headers) {
      config.headers.Authorization = `Bearer ${newToken}`;
    }
    return axiosInstance(config);
  } catch (refreshErr) {
    return Promise.reject(refreshErr);
  }
}
