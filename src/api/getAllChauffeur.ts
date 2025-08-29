import {API_ENDPOINTS} from "../lib/api-endpoints"
import axiosInstance from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';

export const getAllChauffeur = async () => {
    const response = await axiosInstance.get(`${API_ENDPOINTS.FETCH_ALL_SUBSCRIPTION_PLANS}`);
    // console.log("response:",response)
  
    return response.data.data;
  };

const UsefetchAllChauffeur = () =>
  useQuery({
    queryKey: ['chauffeurs'],
    queryFn: () => getAllChauffeur(),
    refetchOnWindowFocus: false,
    // refetchInterval: 60000,
    retry: false,
    // keepPreviousData: true, // for pagination
  });

export default UsefetchAllChauffeur;