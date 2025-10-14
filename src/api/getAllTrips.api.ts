
import {API_ENDPOINTS} from "../lib/api-endpoints"
import axiosInstance from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from "axios";

export const getAllTrips = async () => {
 const params = {};
    try {
      const response = await axiosInstance.get(`${API_ENDPOINTS.GET_ALL_TRIPS}`,{params});
      // console.log("response:",response)
    
      return response.data.data;
    } catch (error) {
      if(error instanceof AxiosError&& error?.status === 400){
        return [];
      }
      throw error;
    }
  };

const useFetchAllTrips = () =>
  useQuery({
    queryKey: ['Trips',],
    queryFn: () => getAllTrips(),
    refetchOnWindowFocus: false,
    // refetchInterval: 60000,
    retry: false,
    // keepPreviousData: true, // for pagination
  });

export default useFetchAllTrips;