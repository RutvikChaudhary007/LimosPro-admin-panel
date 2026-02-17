import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { tokenManager } from "@/services/tokenManager";
import { useUserStore } from "@/stores/useAuthStore";

const USER_STORAGE_KEY = "user";
const ROLE_STORAGE_KEY = "role";
const PERMISSIONS_STORAGE_KEY = "permissions";

/**
 * User shape as stored in localStorage and used for auth state.
 * Tokens are kept in tokenManager / sessionStorage only.
 */
export interface AuthUser {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  roles: string[];
  permissions?: unknown[];
  partnerId?: string;
  chauffeurId?: string;
  profilePicture?: string;
  role?: string;
  [key: string]: unknown;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthLoading: boolean;
  login: (userData: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readUserFromStorage(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthUser;
    return parsed?.id && parsed?.email ? parsed : null;
  } catch {
    return null;
  }
}

function clearAuthStorage(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_STORAGE_KEY);
  localStorage.removeItem(ROLE_STORAGE_KEY);
  localStorage.removeItem(PERMISSIONS_STORAGE_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const logout = useCallback(() => {
    tokenManager.clear();
    clearAuthStorage();
    useUserStore.getState().setUser(null);
    setUser(null);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let cancelled = false;

    async function hydrate() {
      // Restore access token from refresh (e.g. after page reload)
      await tokenManager.restoreFromRefresh().catch(() => {});

      if (cancelled) return;

      const storedUser = readUserFromStorage();
      const hasToken = !!tokenManager.getAccessToken();

      // If we have stored user but no valid token, treat session as invalid
      if (storedUser && !hasToken) {
        clearAuthStorage();
        tokenManager.clear();
        setUser(null);
      } else {
        setUser(storedUser);
      }
      setIsAuthLoading(false);
    }

    hydrate();
    return () => {
      cancelled = true;
    };
  }, []);

  // When refresh fails (e.g. 401), clear auth so protected routes redirect to login
  useEffect(() => {
    tokenManager.onRefreshFailed(() => {
      clearAuthStorage();
      setUser(null);
    });
  }, []);

  const login = useCallback((userData: AuthUser) => {
    setUser(userData);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthLoading,
      login,
      logout,
    }),
    [user, isAuthLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return ctx;
}
