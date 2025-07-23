// utils/axiosInstance.js
import axios from 'axios';
import { BASE_URL } from '@/lib/api-endpoints';
import useAuthStore from '../store/useAuthStore';
import useAdminAuthStore from '@/store/useAdminAuthStore';

const adminAxiosInstance = axios.create({
  baseURL: BASE_URL,
});



adminAxiosInstance.interceptors.request.use(
  (config) => {
    const { token } = useAdminAuthStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
);

adminAxiosInstance.interceptors.response.use(null, (error) => {
  if (error.response?.data?.message === "jwt expired") {
    useAuthStore.getState().logout();
  }
  return Promise.reject(error);
});

export default adminAxiosInstance;