// utils/axiosInstance.js
import axios from "axios";
import { USER_SERVICE_URL } from "@/lib/api-endpoints";

const adminAxiosInstance = axios.create({
  baseURL: USER_SERVICE_URL,
});

adminAxiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // console.log("config:",config)
  return config;
});

// Refresh token handling with request replay
let isRefreshing = false;
let refreshPromise = null as Promise<string> | null;
const subscribers: Array<(token: string) => void> = [];

function onRefreshed(token: string) {
  subscribers.forEach((cb) => {
    cb(token);
  });
  subscribers.length = 0;
}

function addSubscriber(callback: (token: string) => void) {
  subscribers.push(callback);
}

async function refreshAccessToken(): Promise<string> {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) throw new Error("No refresh token");

  const url = `${USER_SERVICE_URL}/refresh-token`;
  const { data } = await axios.post(url, { refreshToken });
  const newAccessToken = data?.data?.accessToken || data?.accessToken;
  const newRefreshToken = data?.data?.refreshToken || data?.refreshToken;
  if (!newAccessToken) throw new Error("No access token in refresh response");

  localStorage.setItem("accessToken", newAccessToken);
  if (newRefreshToken) localStorage.setItem("refreshToken", newRefreshToken);
  adminAxiosInstance.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
  return newAccessToken as string;
}

adminAxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config as
      | { _retry?: boolean; headers?: Record<string, string> }
      | undefined;
    const status = error?.response?.status;
    const expired = error?.response?.data?.message === "jwt expired";

    if (
      originalRequest &&
      !originalRequest._retry &&
      status === 401 &&
      expired
    ) {
      originalRequest._retry = true;

      try {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshPromise = refreshAccessToken();
          const newToken = await refreshPromise;
          isRefreshing = false;
          onRefreshed(newToken);
        } else if (refreshPromise) {
          const newToken = await refreshPromise;
          onRefreshed(newToken);
        }

        return new Promise((resolve) => {
          addSubscriber((token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(adminAxiosInstance(originalRequest));
          });
        });
      } catch (refreshErr) {
        isRefreshing = false;
        refreshPromise = null;
        const Email = localStorage.getItem("Email");
        const remember = localStorage.getItem("remember");
        localStorage.clear();
        if (Email && remember === "true") {
          localStorage.setItem("Email", Email);
          localStorage.setItem("remember", "true");
        }
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  },
);

export default adminAxiosInstance;
