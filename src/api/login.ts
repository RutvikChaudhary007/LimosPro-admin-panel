import {API_ENDPOINTS} from "../lib/api-endpoints"
import axios from "axios";

export const login = async (data:object) => {
  const response = await axios.post(API_ENDPOINTS.LOG_IN,data, {
    headers: {
    'Content-Type': 'application/json',
    },
    });
    if(response){
      localStorage.setItem("accessToken",response?.data?.data?.accessToken)
      localStorage.setItem("refreshToken",response?.data?.data?.refreshToken)
      localStorage.setItem("role",response?.data?.data?.roles)
      
      // Store permissions from login response
      if(response?.data?.data?.permissions){
        localStorage.setItem("permissions", JSON.stringify(response.data.data.permissions))
      }
    }
  return response.data;
};