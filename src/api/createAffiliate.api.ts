import adminAxiosInstance from "@/utils/axiosInstance";
import { API_ENDPOINTS } from "../lib/api-endpoints";

export const createAffiliate = async (data: object) => {
  const response = await adminAxiosInstance.post(API_ENDPOINTS.CREATE_AFFILIATE, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
