import axios from "axios";
import { API_ENDPOINTS } from "../lib/api-endpoints";

export const login = async (data: { email: string; password: string }) => {
  const response = await axios.post(API_ENDPOINTS.LOG_IN, data, {
    headers: {
      "Content-Type": "application/json",
      // 'x-forwarded-for': '117.97.168.210',
    },
  });
  if (response) {
    localStorage.setItem("accessToken", response?.data?.data?.accessToken);
    localStorage.setItem("refreshToken", response?.data?.data?.refreshToken);
    localStorage.setItem("role", response?.data?.data?.roles);

    // Store permissions from login response
    if (response?.data?.data?.permissions) {
      localStorage.setItem("permissions", JSON.stringify(response.data.data.permissions));
    }
  }
  return response.data;
};
