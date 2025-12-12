import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import axiosInstance from "@/utils/axiosInstance";

/**
 * ============================================
 * Booking API Module
 * ============================================
 * All booking-related API calls consolidated
 */

type DateRange = { from?: Date; to?: Date };

// ============================================
// GET OPERATIONS
// ============================================

/**
 * Fetch all bookings with optional filters
 */
export const getAllBookings = async (
  DateRange: DateRange,
  page?: number,
  limit?: number,
  status?: string,
) => {
  const params: Record<string, unknown> = {};

  if (DateRange?.from || DateRange?.to) {
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
          ).toISOString()
        : undefined,
    };
  }

  if (page) params.page = page;
  if (limit) params.limit = limit;
  if (status) params.status = status;

  try {
    const response = await axiosInstance.get(API_ENDPOINTS.GET_ALL_BOOKINGS, {
      params,
    });
    return response?.data?.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 400) {
      return { bookings: [], pagination: {} };
    }
    if (isAxiosError(error)) throw error;
    throw new Error("An unexpected error occurred");
  }
};

/**
 * Hook to fetch all bookings
 */
export const useFetchAllBookings = ({
  DateRange,
  page,
  limit,
  status,
  queryOptions,
}: {
  DateRange: DateRange;
  page?: number;
  limit?: number;
  status?: string;
  queryOptions?: Record<string, any>;
}) =>
  useQuery({
    queryKey: ["bookings", DateRange, page, limit, status],
    queryFn: () => getAllBookings(DateRange, page, limit, status),
    refetchOnWindowFocus: false,
    retry: false,
    // staleTime: 0,
    ...queryOptions,
  });

/**
 * Fetch booking by ID
 */
export const getBookingById = async (id?: string) => {
  if (id) {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.GET_BOOKING_BY_ID.replace(":id", id)}`,
    );
    return response?.data?.data;
  }
  return null;
};

/**
 * Hook to fetch booking by ID
 */
export const useFetchBookingById = ({ id }: { id?: string }) =>
  useQuery({
    queryKey: ["bookingById", id],
    queryFn: () => getBookingById(id),
    refetchOnWindowFocus: false,
    retry: false,
  });
