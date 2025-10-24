// @ts-nocheck
import {API_ENDPOINTS} from "../lib/api-endpoints"
import axiosInstance from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import type { TCrewMemberForm } from "@/components/crewMember/crewMemberForm";
import { AxiosError } from "axios";

type TArg = {page?: number, limit: number,  };
/**
 * @description: Get all crew member
 * @param  {page, limit}
 * @return {*}
 */
export const getAllCrewMember = async ({limit, page}:TArg) => {
  const params: Record<string, unknown> = {};
  if(limit) params.limit = limit;
  if(page){
    params.page = page
  }
   try {
     const response = await axiosInstance.get(`${API_ENDPOINTS.GET_ALL_CREW_MEMBER}`,{params});
     // console.log("response:",response)
   
     return response.data.data;
   } catch (error) {
    if(error instanceof AxiosError&& error?.status === 400)
    {
      return [];
    }
    throw error;
   }
  };

const useFetchAllCrewMember = ({page, limit}:TArg) =>
  useQuery({
    queryKey: ['crewMember', {limit}, {page}],
    queryFn: () => getAllCrewMember({limit, page}),
    refetchOnWindowFocus: false,
    // refetchInterval: 60000,
    retry: false,
    // keepPreviousData: true, // for pagination
  });

export default useFetchAllCrewMember;


/**
 * @description: delete crew member
 * @param {id}
 * @return {*}
 */

export const deleteCrewMember = async ({id}:{id:string}) => {
  const response = await axiosInstance.delete(API_ENDPOINTS.DELETE_CREW_MEMBER.replace(":id",id));
    
  return response.data;
};

/**
 * @description: bulk delete crew member
 * @param {id}
 * @return {*}
 */

export const bulkDeleteCrewMember = async (ids:string[]) => {
  const data = {
    "crewMemberIds": ids
  }
  const response = await axiosInstance.post(API_ENDPOINTS.BULK_DELETE_CREW_MEMBER,data);
    
  return response.data;
};

/**
 * @description: create crew member
 * @param {id}
 * @return {*}
 */
export const createCrewMember = async (data:TCrewMemberForm) => {
  if(data?.phone){
    data.phoneNumber = data?.phone;
    delete data.phone
    delete data.designation
  }
  const response = await axiosInstance.post(API_ENDPOINTS.CREATE_CREW_MEMBER,data, {    });
    
  return response.data;
};

/**
 * @description: edit crew member
 * @param {id}
 * @return {*}
 */
export const editCrewMember = async ({data,id}:{data:TCrewMemberForm,id: string}) => {
     console.log("iddd",id)
  const response = await axiosInstance.patch(API_ENDPOINTS.EDIT_CREW_MEMBER.replace(":id",id),data, {    });
    
  return response.data;
};