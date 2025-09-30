
import {API_ENDPOINTS} from "../lib/api-endpoints"
import axiosInstance from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';

type DateRange = { startDate ?: Date | undefined; endDate ?: Date | undefined };
export const getAllFleets = async (DateRange: DateRange, page?: number) => {
  const params: Record<string, unknown> = {};
  if (DateRange?.startDate || DateRange?.endDate) {
    params.DateRange = {
      startDate: DateRange.startDate ? new Date(DateRange.startDate).toISOString() : undefined,
      endDate: DateRange.endDate ? new Date(DateRange.endDate).toISOString() : undefined,
    };
  }
  if(page){
    params.page = page
  }
    const response = await axiosInstance.get(`${API_ENDPOINTS.GET_ALL_FLEETS}`,{params});
    // console.log("response:",response)
  
    return response.data.data;
  };

const UsefetchAllFleets = ({DateRange,page}:{DateRange:DateRange, page?: number, }) =>
  useQuery({
    queryKey: ['Fleets', {DateRange}, {page}],
    queryFn: () => getAllFleets(DateRange, page),
    refetchOnWindowFocus: false,
    // refetchInterval: 60000,
    retry: false,
    // keepPreviousData: true, // for pagination
  });

export default UsefetchAllFleets;