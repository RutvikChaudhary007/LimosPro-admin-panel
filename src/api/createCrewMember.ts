import adminAxiosInstance from "@/utils/axiosInstance";
import {API_ENDPOINTS} from "../lib/api-endpoints"

export const createCrewMember = async (data:object) => {
  const response = await adminAxiosInstance.post(API_ENDPOINTS.CREATE_CREW_MEMBER,data, {
    headers: {
    'Content-Type': 'multipart/form-data',
    },
    });
    
  return response.data;
};