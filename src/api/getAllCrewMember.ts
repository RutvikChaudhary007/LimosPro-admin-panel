
import {API_ENDPOINTS} from "../lib/api-endpoints"
import axiosInstance from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';

type TArg = {page?: number, limit: number,  };
export const getAllStaffMember = async ({limit, page}:TArg) => {
  const params: Record<string, unknown> = {};
  if(limit) params.limit = limit;
  if(page){
    params.page = page
  }
    const response = await axiosInstance.get(`${API_ENDPOINTS.GET_ALL_CREW_MEMBER}`,{params});
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