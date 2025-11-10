import adminAxiosInstance from "@/utils/axiosInstance";
import { API_ENDPOINTS } from "../lib/api-endpoints";

export const editAffiliate = async ({ data, id }: { data: object; id: string | undefined }) => {
  const response = await adminAxiosInstance.put(API_ENDPOINTS.UPDATE_AFFILIATE.replace(":id", id as string), data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
