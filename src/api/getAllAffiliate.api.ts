import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "@/utils/axiosInstance";
import { API_ENDPOINTS } from "../lib/api-endpoints";

type DateRange = { startDate?: Date | undefined; endDate?: Date | undefined };

export const getAllAffiliate = async (
  DateRange?: DateRange,
  page?: number,
  limit?: number,
  status?: string,
) => {
  const params: Record<string, unknown> = {};
  if (DateRange?.startDate || DateRange?.endDate) {
    params.DateRange = {
      startDate: DateRange.startDate
        ? new Date(DateRange.startDate).toISOString()
        : undefined,
      endDate: DateRange.endDate
        ? new Date(DateRange.endDate).toISOString()
        : undefined,
    };
  }

  if (page) {
    params.page = page;
  }

  if (limit) {
    params.limit = limit;
  }

  if (status) {
    params.status = status;
  }
  try {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.GET_ALL_AFFILIATE}`,
      { params },
    );
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

const useFetchAllAffiliate = ({
  DateRange,
  page,
  limit,
  status,
}: {
  DateRange?: { startDate: Date | undefined; endDate: Date | undefined };
  page?: number;
  limit?: number;
  status?: string;
}) =>
  useQuery({
    queryKey: ["affiliates", DateRange, page, limit, status],
    queryFn: () => getAllAffiliate(DateRange, page, limit, status),
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
    select: (data) => {
      console.log("data...", data);
      return data;
    },
  });

// export const fetchAllAffiliate = ({ DateRange, page }: { DateRange?: { startDate: Date | undefined; endDate: Date | undefined }, page?: number }) =>
//   queryOptions({
//     queryKey: ['affiliate', DateRange, page],
//     queryFn: () => getAllAffiliate(DateRange, page),
//     refetchOnWindowFocus: false,
//     retry: false,
//   });

export default useFetchAllAffiliate;
