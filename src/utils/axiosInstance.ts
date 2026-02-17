import axios, { type AxiosInstance } from "axios";
import { USER_SERVICE_URL } from "@/lib/api-endpoints";
import { attachAuthToken, handleAuthError } from "@/services/authInterceptor";
import { tokenManager } from "@/services/tokenManager";

const adminAxiosInstance: AxiosInstance = axios.create({
  baseURL: USER_SERVICE_URL,
  withCredentials: false,
});

adminAxiosInstance.interceptors.request.use(
  (config) => attachAuthToken(config),
  (err) => Promise.reject(err),
);

adminAxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    try {
      const result = await handleAuthError(error, (config) =>
        adminAxiosInstance.request(config),
      );
      return result;
    } catch {
      return Promise.reject(error);
    }
  },
);

// Redirect to login when refresh fails (e.g. refresh token expired)
tokenManager.onRefreshFailed(() => {
  const email =
    typeof window !== "undefined" ? localStorage.getItem("Email") : null;
  const remember =
    typeof window !== "undefined" ? localStorage.getItem("remember") : null;
  if (typeof window !== "undefined") {
    localStorage.clear();
    if (email && remember === "true") {
      localStorage.setItem("Email", email);
      localStorage.setItem("remember", "true");
    }
    window.location.href = "/auth/login";
  }
});

export default adminAxiosInstance;
