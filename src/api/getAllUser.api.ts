import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import axiosInstance from "@/utils/axiosInstance";
import { API_ENDPOINTS } from "../lib/api-endpoints";

type DateRange = { startDate?: Date; endDate?: Date };

export const getAllUsers = async (
  DateRange: DateRange,
  page?: number,
  status?: string,
  limit?: number,
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

  if (page !== undefined) params.page = page;
  if (status) params.status = status;
  if (limit !== undefined) params.limit = limit;

  try {
    const response = await axiosInstance.get(API_ENDPOINTS.GET_ALL_USERS, {
      params,
    });

    return response?.data?.data;
  } catch (error) {
    if (isAxiosError(error)) throw error;
    throw new Error("An unexpected error occurred");
  }
};

const UsefetchAllUsers = ({
  DateRange,
  page,
  status,
  limit,
}: {
  DateRange: DateRange;
  page?: number;
  status?: string;
  limit?: number;
}) =>
  useQuery({
    queryKey: ["users", DateRange, page, status, limit],
    queryFn: () => getAllUsers(DateRange, page, status, limit),
    refetchOnWindowFocus: false,
    retry: false,
  });

export default UsefetchAllUsers;
