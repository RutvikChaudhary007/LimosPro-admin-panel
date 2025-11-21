import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import axiosInstance from "@/utils/axiosInstance";
import { API_ENDPOINTS } from "../lib/api-endpoints";

type DateRange = {
  from?: Date;
  to?: Date;
};

export const getAllBookings = async (
  DateRange?: DateRange,
  page?: number,
  status?: string,
) => {
  const params: Record<string, unknown> = {};
  if (DateRange?.from && DateRange?.to) {
    params.DateRange = {
      startDate: DateRange.from
        ? new Date(DateRange.from).toISOString()
        : undefined,
      endDate: DateRange.to
        ? new Date(
            Date.UTC(
              DateRange.to.getUTCFullYear(),
              DateRange.to.getUTCMonth(),
              DateRange.to.getUTCDate(),
              23,
              59,
              59,
              999,
            ),
          )
        : undefined,
      // endDate: DateRange.to ? new Date(DateRange.to.setHours(23, 59, 59, 999)).toISOString() : undefined,
    };
  }

  if (page) {
    params.page = page;
  }

  if (status) {
    params.status = status;
  }

  try {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.GET_ALL_BOOKINGS}`,
      { params },
    );
    //   console.log("response:", response?.data)
    return response?.data?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

const UsefetchAllBookings = ({
  DateRange,
  page,
  status,
}: {
  DateRange?: { from: Date | undefined; to: Date | undefined };
  page?: number;
  status?: string;
}) => {
  const hasFullRange = !!DateRange?.from && !!DateRange?.to;
  const dateKey = hasFullRange
    ? {
        from: DateRange?.from?.toISOString() ?? null,
        to: DateRange?.to?.toISOString() ?? null,
      }
    : null;
  return useQuery({
    queryKey: ["Bookings", dateKey, page, status],
    queryFn: () => getAllBookings(DateRange, page, status),
    refetchOnWindowFocus: false,
    retry: false,
  });
};
export default UsefetchAllBookings;
