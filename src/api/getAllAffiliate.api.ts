 
import { API_ENDPOINTS } from "../lib/api-endpoints"
import axiosInstance from '@/utils/axiosInstance';
import {  useQuery } from '@tanstack/react-query';
import { AxiosError } from "axios";

type DateRange = { startDate?: Date | undefined; endDate?: Date | undefined };

export const getAllAffiliate = async (DateRange?: DateRange, page?: number) => {
  const params: Record<string, unknown> = {};
  if (DateRange?.startDate || DateRange?.endDate) {
    params.DateRange = {
      startDate: DateRange.startDate ? new Date(DateRange.startDate).toISOString() : undefined,
      endDate: DateRange.endDate ? new Date(DateRange.endDate).toISOString() : undefined,
    };
  }

  if(page){
    params.page= page;
  }

try {
    const response = await axiosInstance.get(`${API_ENDPOINTS.GET_ALL_AFFILIATE}`, { params });
    console.log("response:",response.data)
    return response?.data?.data;
} catch (error) {
  if (error instanceof AxiosError && error?.status === 400) {
      // Treat 400 as "no data" instead of an actual error
        return [];
      }
    throw error;
}
};

const useFetchAllAffiliate = ({ DateRange, page }: { DateRange?: { startDate: Date | undefined; endDate: Date | undefined }, page?: number }) =>
  useQuery({
    queryKey: ['affiliate', DateRange, page],
    queryFn: () => getAllAffiliate(DateRange, page),
    refetchOnWindowFocus: false,
    retry: false,
  });

// export const fetchAllAffiliate = ({ DateRange, page }: { DateRange?: { startDate: Date | undefined; endDate: Date | undefined }, page?: number }) =>
//   queryOptions({
//     queryKey: ['affiliate', DateRange, page],
//     queryFn: () => getAllAffiliate(DateRange, page),
//     refetchOnWindowFocus: false,
//     retry: false,
//   });

export default useFetchAllAffiliate;
