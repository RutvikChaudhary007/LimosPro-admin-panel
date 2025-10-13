//@ts-nocheck
import axiosInstance from '@/utils/axiosInstance';
import {API_ENDPOINTS} from "../lib/api-endpoints"
import { useQuery } from '@tanstack/react-query';


type TArg = {page?: number, limit: number,  };

/**
 * ###################################################
 * Get all staff members
 * ###################################################
 * @param param0 
 * @returns 
 */
export const getAllStaffMember = async ({limit, page}:TArg) => {
  const params: Record<string, unknown> = {};
  console.log(limit,page)
//   if(limit) params.limit = limit;
//   if(page){
//     params.page = page
//   }
    const response = await axiosInstance.get(`${API_ENDPOINTS.GET_ALL_STAFF_MEMBER}`,{params});
    // console.log("response:",response)
  
    return response.data.data;
  };

const useFetchAllStaffMember = ({page, limit}:TArg) =>
  useQuery({
    queryKey: ['staffMember', {limit}, {page}],
    queryFn: () => getAllStaffMember({limit, page}),
    refetchOnWindowFocus: false,
    // refetchInterval: 60000,
    retry: false,
    // keepPreviousData: true, // for pagination
  });

export default useFetchAllStaffMember;

/**
 * ###################################################
 * Create staff members
 * ###################################################
 */


export const createStaffMember = async (data:object) => {
  const params: Record<string, unknown> = {}
  if(data?.region){
    params.regionId = data?.region
    delete data?.region;
  }
  const response = await axiosInstance.post(API_ENDPOINTS.CREATE_STAFF_MEMBER.replace(":regionId",params.regionId as string),data, );
    
  return response.data;
};

/**
 * ###################################################
 * Edit staff members
 * ###################################################
 */


export const editStaffMember = async ({id,regionId, data}:{id:string,regionId:string, data:object}) => {
   if(data?.region){
    delete data?.region;
  }
  const response = await axiosInstance.patch(API_ENDPOINTS.EDIT_STAFF_MEMBER.replace(":id",id as string).replace(":regionId",regionId as string),data, {    });
    
  return response.data;
};

/**
 * @description: delete staff member
 * @param {id}
 * @return {*}
 */

export const deleteStaffMember = async ({id}:{id:string}) => {
  const response = await axiosInstance.delete(API_ENDPOINTS.DELETE_STAFF_MEMBER.replace(":id",id));
    
  return response.data;
};