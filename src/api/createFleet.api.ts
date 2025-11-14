import adminAxiosInstance from "@/utils/axiosInstance";
import { API_ENDPOINTS } from "../lib/api-endpoints";

export const createFleet = async (data: object) => {
  const response = await adminAxiosInstance.post(
    API_ENDPOINTS.CREATE_FLEET,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};
