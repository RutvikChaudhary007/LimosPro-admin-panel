/**
 * ######################
 *  IP White List API
 * ######################
 * */

import adminAxiosInstance from "@/utils/axiosInstance";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { useQuery } from "@tanstack/react-query";
import type { TIpWhiteListForm } from "@/components/ipWhiteList/IpWhiteListForm";

/**
 * #############################################
 *  Fetch All IP White Lists
 * ##############################################
 * @returns response data
 */
export const getAllIPWhiteLists = async (limit:number) => {
  const response = await adminAxiosInstance.get(API_ENDPOINTS.GET_ALL_IP_WHITE_LIST, {  
    params: {
      limit,
    }
  });
     
  return response.data?.data;
};

const useFetchALLIPWhiteLists = (limit:number) => {
  return useQuery({
    queryKey: ["ipWhiteLists", limit],
    queryFn: ()=>getAllIPWhiteLists(limit),
    refetchOnWindowFocus: false,
    retry: false,
  });
}

export default useFetchALLIPWhiteLists;

/**
 * #############################################
 *  Fetch IP White List By ID
 * ##############################################
 * @param data 
 * @returns response data
 */

export const getIPWhiteListById = async (id: string) => {
  const response = await adminAxiosInstance.get(API_ENDPOINTS.GET_IP_WHITE_LIST_BY_ID.replace(':id', id));    
  return response.data?.data;
};

export const useFetchIPWhiteListById = (id: string) => {
  return useQuery({
    queryKey: ["ipWhiteListById", {id}],
    queryFn: ()=>getIPWhiteListById(id),
    refetchOnWindowFocus: false,
    retry: false,
  });
}

/**
 * #############################################
 *  Create IP White List
 * ##############################################
 * @param data 
 * @returns response data
 */
export const createIPWhiteList = async (data: TIpWhiteListForm) => {
  const response = await adminAxiosInstance.post(API_ENDPOINTS.CREATE_IP_WHITE_LIST, data);
     
  return response.data?.data;
};

/**
 * #############################################
 *  Edit IP White List By ID  
 * ##############################################
 * @param data 
 * @returns response data
 */
export const editIPWhiteListById = async ({id, data}:{id: string, data: TIpWhiteListForm}) => {
  const response = await adminAxiosInstance.put(API_ENDPOINTS.EDIT_IP_WHITE_LIST.replace(':id', id), data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
     
  return response.data?.data;
};


/**
 * #############################################
 *  Delete IP White List By ID
 * ##############################################
 * @param data 
 * @returns response data
 */
export const deleteIPWhiteListById = async (id: string) => {
  const response = await adminAxiosInstance.delete(API_ENDPOINTS.DELETE_IP_WHITE_LIST.replace(':id', id));
     
  return response.data;
};