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
  const response = await axiosInstance.post(API_ENDPOINTS.CREATE_STAFF_MEMBER,data, {    });
    
  return response.data;
};

/**
 * ###################################################
 * Edit staff members
 * ###################################################
 */


export const editStaffMember = async (data:object) => {
  const response = await axiosInstance.patch(API_ENDPOINTS.EDIT_STAFF_MEMBER,data, {    });
    
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