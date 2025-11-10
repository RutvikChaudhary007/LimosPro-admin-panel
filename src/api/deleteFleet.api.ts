import adminAxiosInstance from "@/utils/axiosInstance";
import { API_ENDPOINTS } from "../lib/api-endpoints";

export const deletefleet = async (id: string) => {
  const response = await adminAxiosInstance.delete(API_ENDPOINTS.DELETE_FLEET.replace(":id", id));

  return response.data;
};

export const bulkDeletefleet = async (ids: string[]) => {
  const data = {
    vehicleIds: ids,
  };
  const response = await adminAxiosInstance.post(API_ENDPOINTS.BULK_DELETE_FLEET, data);

  return response.data;
};
