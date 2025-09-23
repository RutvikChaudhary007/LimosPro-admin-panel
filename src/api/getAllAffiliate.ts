 
import { API_ENDPOINTS } from "../lib/api-endpoints"
import axiosInstance from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';

type DateRange = { startDate?: Date | undefined; endDate?: Date | undefined };

export const getAllAffiliate = async (DateRange: DateRange) => {
  const params: Record<string, unknown> = {};
  if (DateRange?.startDate || DateRange?.endDate) {
    params.DateRange = {
      startDate: DateRange.startDate ? new Date(DateRange.startDate).toISOString() : undefined,
      endDate: DateRange.endDate ? new Date(DateRange.endDate).toISOString() : undefined,
    };
  }

  const response = await axiosInstance.get(`${API_ENDPOINTS.GET_ALL_AFFILIATE}`, { params });
  console.log("response:",response.data)
  return response?.data?.data;
};

const UsefetchAllAffiliate = ({ DateRange }: { DateRange: { startDate: Date | undefined; endDate: Date | undefined } }) =>
  useQuery({
    queryKey: ['affiliate', DateRange],
    queryFn: () => getAllAffiliate(DateRange),
    refetchOnWindowFocus: false,
    retry: false,
  });
export default UsefetchAllAffiliate;