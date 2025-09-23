
import {API_ENDPOINTS} from "../lib/api-endpoints"
import axiosInstance from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';

export const getAllFleets = async () => {
    const response = await axiosInstance.get(`${API_ENDPOINTS.GET_ALL_FLEETS}`);
    // console.log("response:",response)
  
    return response.data.data;
  };

const UsefetchAllFleets = () =>
  useQuery({
    queryKey: ['Fleets'],
    queryFn: () => getAllFleets(),
    refetchOnWindowFocus: false,
    // refetchInterval: 60000,
    retry: false,
    // keepPreviousData: true, // for pagination
  });

export default UsefetchAllFleets;