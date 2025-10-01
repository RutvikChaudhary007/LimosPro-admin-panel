import adminAxiosInstance from "@/utils/axiosInstance";
import {API_ENDPOINTS} from "../lib/api-endpoints"

export const deleteUser = async (id:string) => {
  const response = await adminAxiosInstance.delete(API_ENDPOINTS.DELETE_USERS.replace(":id",id));
    
  return response.data;
};