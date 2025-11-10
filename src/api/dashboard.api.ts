import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "@/utils/axiosInstance";
import { API_ENDPOINTS } from "../lib/api-endpoints";

type DateRange = { startDate?: Date | undefined; endDate?: Date | undefined };

export const getDashboard = async (DateRange?: DateRange, page?: number) => {
  const params: Record<string, unknown> = {};
  if (DateRange?.startDate || DateRange?.endDate) {
    params.DateRange = {
      startDate: DateRange.startDate ? new Date(DateRange.startDate).toISOString() : undefined,
      endDate: DateRange.endDate ? new Date(DateRange.endDate).toISOString() : undefined,
    };
  }

  if (page) {
    params.page = page;
  }

  try {
    const response = await axiosInstance.get(`${API_ENDPOINTS.GET_DASHBOARD_DETAILS}`, { params });
    console.log("response:", response.data);
    return response?.data?.data;
  } catch (error) {
    if (error instanceof AxiosError && error?.status === 400) {
      // Treat 400 as "no data" instead of an actual error
      return [];
    }
    throw error;
  }
};

const useFetchDashboard = ({
  DateRange,
  page,
}: {
  DateRange?: { startDate: Date | undefined; endDate: Date | undefined };
  page?: number;
}) =>
  useQuery({
    queryKey: ["Dashboard", DateRange, page],
    queryFn: () => getDashboard(DateRange, page),
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });

export default useFetchDashboard;
