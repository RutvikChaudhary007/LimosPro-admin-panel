
import {API_ENDPOINTS} from "../lib/api-endpoints"
import axiosInstance from '@/utils/axiosInstance';
import { useSuspenseQuery } from '@tanstack/react-query';

export const getFleetById = async (id: string) => {
    const response = await axiosInstance.get(`${API_ENDPOINTS.GET_FLEET_BY_ID.replace(":id",id)}`);
    // console.log("response:",response)
  
    return response.data.data;
  };

const useFetchFleetById = ({id}: {id:string}) =>
  useSuspenseQuery({
    queryKey: ['FleetById',id],
    queryFn: () => getFleetById(id),
    refetchOnWindowFocus: false,
    // refetchInterval: 60000,
    retry: false,
    // keepPreviousData: true, // for pagination
  });

export default useFetchFleetById;