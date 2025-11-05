
import type { TRegion } from "@/pages/region/formpage/AddRegionPage";
import {API_ENDPOINTS} from "../lib/api-endpoints"
import axiosInstance from '@/utils/axiosInstance';
import {  useQuery } from '@tanstack/react-query';
import { AxiosError } from "axios";
import type { TRegionAdmin } from "@/components/table/column";

type TPara = { limit: number;  };
export const getAllRegionAdmins = async (data?: TPara) => {
  const params: Record<string, unknown> = {};
  if (data?.limit) {
    params.limit = data.limit;
}
    const response = await axiosInstance.get(`${API_ENDPOINTS.REGIONAL_ADMIN.GET_ALL}`,{params});
  
    return response.data.data;
  };

const useFetchAllRegionAdmins = ( Data:TPara) =>
  useQuery({
    queryKey: ['RegionAdmins', {Data}],
    queryFn: () => getAllRegionAdmins(Data),
    refetchOnWindowFocus: false,
    // refetchInterval: 60000,
    retry: false,
    // keepPreviousData: true, // for pagination
  });

  export default useFetchAllRegionAdmins;

export const getSingleRegionAdmin = async (id: string) => {
    const response = await axiosInstance.get(`${API_ENDPOINTS.GET_REGION_BY_ID.replace(":region_id", id)}`);
  
    return response?.data?.data;
  };

export const useFetchRegionAdminById = (id:string) =>
  useQuery({
    queryKey: ['RegionById', {id}],
    queryFn: () => getSingleRegionAdmin(id),
    refetchOnWindowFocus: false,
    // refetchInterval: 60000,
    retry: false,
    // keepPreviousData: true, // for pagination
  });


export const createRegionAdmin = async(data: Partial<TRegionAdmin>)=>{
    try {
      console.log("data:",data)
      if(data?.region){
        const response = await axiosInstance.post(`${API_ENDPOINTS.REGIONAL_ADMIN.CREATE?.replace(":regionId",data?.region)}`,data)
        return response.data
      }else{
        throw new Error("Region id is missing.")
      }
    } catch (error) {
        if(error instanceof AxiosError){
          console.error(error.message || "Opps! An unkown error occured")
        }
        throw error;
    }
}

export const editRegionAdmin = async({id,data}:{id:string, data: TRegion})=>{
    try {
        const response = await axiosInstance.put(`${API_ENDPOINTS.EDIT_REGION.replace(":regionId", id)}`,data)
        return response.data
    } catch (error) {
        if(error instanceof AxiosError)
        console.error(error.message || "Opps! An unkown error occured")
    }
}

export const deleteRegionAdmin = async(id:string)=>{
    try {
        const response = await axiosInstance.delete(`${API_ENDPOINTS.DELETE_REGION.replace(":regionId", id)}`)
        return response.data
    } catch (error) {
        if(error instanceof AxiosError)
        console.error(error.message || "Opps! An unkown error occured")
    }
}