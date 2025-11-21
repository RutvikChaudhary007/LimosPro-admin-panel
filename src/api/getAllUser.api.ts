import { useQuery } from "@tanstack/react-query";
import { AxiosError, isAxiosError } from "axios";
import axiosInstance from "@/utils/axiosInstance";
import { API_ENDPOINTS } from "../lib/api-endpoints";

type DateRange = { startDate?: Date | undefined; endDate?: Date | undefined };

export const getAllUsers = async (
  DateRange: DateRange,
  page?: number,
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

  if (status) {
    params.status = status;
  }

  try {
    const response = await axiosInstance.get(`${API_ENDPOINTS.GET_ALL_USERS}`, {
      params,
    });
    // console.log("response:",response)

    return response.data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

const UsefetchAllUsers = ({
  DateRange,
  page,
  status,
}: {
  DateRange: DateRange;
  page?: number;
  status?: string;
}) =>
  useQuery({
    queryKey: ["users", page, status],
    queryFn: () => getAllUsers(DateRange, page, status),
    refetchOnWindowFocus: false,
    // refetchInterval: 60000,
    retry: false,
    // keepPreviousData: true, // for pagination
  });

export default UsefetchAllUsers;
