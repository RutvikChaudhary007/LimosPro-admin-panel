import type { IUserFormData } from "@/types/user.type";
import adminAxiosInstance from "@/utils/axiosInstance";
import { API_ENDPOINTS } from "../lib/api-endpoints";

export const updateUser = async (id: string, data: IUserFormData) => {
  console.log("iUser", data);
  const response = await adminAxiosInstance.patch(API_ENDPOINTS.UPDATE_USER_BY_ID.replace(":id", id), data, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};
