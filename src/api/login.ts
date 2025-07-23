import axiosInstance from "@/utils/axiosInstance";
import {API_ENDPOINTS} from "../lib/api-endpoints"

export const addAddressVerification = async (addressData:object) => {
  const response = await axiosInstance.post(API_ENDPOINTS.ADD_RETURN_ADDRESS_VERIFICATION,addressData, {
    headers: {
    'Content-Type': 'application/json',
    },
    });
  return response.data;
};