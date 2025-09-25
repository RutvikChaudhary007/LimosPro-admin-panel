
import {API_ENDPOINTS} from "../lib/api-endpoints"
import axiosInstance from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';

export const getAllTrips = async () => {
 const params = {};
    const response = await axiosInstance.get(`${API_ENDPOINTS.GET_ALL_TRIPS}`,{params});
    // console.log("response:",response)
  
    return response.data.data;
  };

const useFetchAllTrips = () =>
  useQuery({
    queryKey: ['Fleets',],
    queryFn: () => getAllTrips(),
    refetchOnWindowFocus: false,
    // refetchInterval: 60000,
    retry: false,
    // keepPreviousData: true, // for pagination
  });

export default useFetchAllTrips;