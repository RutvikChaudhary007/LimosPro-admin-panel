import { useEffect } from "react";
import { tokenManager } from "./tokenManager";

/**
 * Runs once on client mount: if a refresh token exists in sessionStorage,
 * restores access token in memory so API calls work after page reload.
 * SSR-safe: no-op when window is undefined.
 */
export function AuthBootstrap() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    tokenManager.restoreFromRefresh().catch(() => {
      // Silent: no refresh token or refresh failed
    });
  }, []);
  return null;
}
