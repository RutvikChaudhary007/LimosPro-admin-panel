/**
 * ######################
 *  Our Partners API
 * ######################
 * */

import adminAxiosInstance from "@/utils/axiosInstance";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

/**
 * #############################################
 *  Fetch All Partners
 * ##############################################
 * @returns response data
 */
export const getAllPartners = async (limit:number) => {
  const params: Record<string, unknown>  = {};
  if(limit){
    params.limit = limit;
  }
  try {
    const response = await adminAxiosInstance.get(API_ENDPOINTS.GET_ALL_PARTNERS, {params})
       
    return response.data?.data;
  } catch (error) {
    if(error instanceof AxiosError && error?.status === 400)
    {
      return [];
    }
    throw error;
  }
};

const useFetchALLPartners = (limit:number) => {
  return useQuery({
    queryKey: ["partners", limit],
    queryFn: ()=>getAllPartners(limit),
    refetchOnWindowFocus: false,
    retry: false,
  });
}

export default useFetchALLPartners;

/**
 * #############################################
 *  Fetch Partner By ID
 * ##############################################
 * @param data 
 * @returns response data
 */

export const getPartnerById = async (id: string) => {
  const response = await adminAxiosInstance.get(API_ENDPOINTS.GET_PARTNER_BY_ID.replace(':id', id));
  return response.data?.data;
};

export const useFetchPartnerById = (id: string) => {
  return useQuery({
    queryKey: ["partnerById", {id}],
    queryFn: ()=>getPartnerById(id),
    refetchOnWindowFocus: false,
    retry: false,
  });
}

/**
 * #############################################
 *  Create Partner
 * ##############################################
 * @param data 
 * @returns response data
 */
export const createPartner = async (data: FormData) => {
  const response = await adminAxiosInstance.post(API_ENDPOINTS.CREATE_PARTNER, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
     
  return response.data?.data;
};

/**
 * #############################################
 *  Edit Partner By ID
 * ##############################################
 * @param data 
 * @returns response data
 */
export const editPartnerById = async ({id, data}:{id: string, data: FormData}) => {
  const response = await adminAxiosInstance.put(API_ENDPOINTS.EDIT_PARTNER.replace(':id', id), data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
     
  return response.data?.data;
};


/**
 * #############################################
 *  Delete Partner By ID
 * ##############################################
 * @param data 
 * @returns response data
 */
export const deletePartnerById = async (id: string) => {
  const response = await adminAxiosInstance.delete(API_ENDPOINTS.DELETE_PARTNER.replace(':id', id));
     
  return response.data;
};

/**
 * #############################################
 *  Bulk Delete Partner By ID
 * ##############################################
 * @param data 
 * @returns response data
 */
export const bulkDeletePartnerById = async (ids: string[]) => {
  const data = {
    partnersIds: ids
  }
  const response = await adminAxiosInstance.post(API_ENDPOINTS.BULK_DELETE_PARTNER, data);
     
  return response.data;
};