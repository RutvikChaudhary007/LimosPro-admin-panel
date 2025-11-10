import adminAxiosInstance from "@/utils/axiosInstance";
import { API_ENDPOINTS } from "../lib/api-endpoints";

export const deleteAffiliate = async (id: string) => {
  const response = await adminAxiosInstance.delete(API_ENDPOINTS.DELETE_AFFILIATE.replace(":id", id));

  return response.data;
};

export const bulkDeleteAffiliate = async (ids: string[]) => {
  const data = {
    affiliateIds: ids,
  };
  const response = await adminAxiosInstance.post(API_ENDPOINTS.BULK_DELETE_AFFILIATE, data);

  return response.data;
};
