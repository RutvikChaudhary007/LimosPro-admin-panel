
import {API_ENDPOINTS} from "../lib/api-endpoints"
import axiosInstance from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';

export const getAllRoles = async () => {
  const params: Record<string, unknown> = {};
  
    const response = await axiosInstance.get(`${API_ENDPOINTS.ROLES.GET_ALL}`,{params});
    // console.log("response:",response)
  
    return response.data.data;
  };

const useFetchAllRoles = () =>
  useQuery({
    queryKey: ['Roles'],
    queryFn: () => getAllRoles(),  
    refetchOnWindowFocus: false,
    // refetchInterval: 60000,
    retry: false,
    // keepPreviousData: true, // for pagination
  });

export default useFetchAllRoles;
