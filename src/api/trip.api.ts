import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import axiosInstance from "@/utils/axiosInstance";

/**
 * ============================================
 * Trip API Module
 * ============================================
 * All trip-related API calls consolidated
 */

// ============================================
// GET OPERATIONS
// ============================================

/**
 * Fetch all trips with optional filters
 */
export const getAllTrips = async (
  tripStatus?: string,
  page?: number,
  limit?: number,
) => {
  const params: Record<string, unknown> = {};
  if (tripStatus) {
    params.tripStatus = tripStatus;
  }
  if (page) {
    params.page = page;
  }
  if (limit) {
    params.limit = limit;
  }
  try {
    const response = await axiosInstance.get(`${API_ENDPOINTS.GET_ALL_TRIPS}`, {
      params,
    });

    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError && error?.status === 400) {
      return [];
    }
    throw error;
  }
};

/**
 * Hook to fetch all trips
 */
export const useFetchAllTrips = ({
  tripStatus,
  page,
  limit,
}: {
  tripStatus?: string;
  page?: number;
  limit?: number;
}) =>
  useQuery({
    queryKey: ["Trips", tripStatus, page, limit],
    queryFn: () => getAllTrips(tripStatus, page, limit),
    refetchOnWindowFocus: false,
    retry: false,
  });

/**
 * Fetch trip by ID
 */
export const getTripById = async (id: string) => {
  const params = {};
  const response = await axiosInstance.get(
    `${API_ENDPOINTS.GET_TRIP_BY_ID.replace(":id", id)}`,
    { params },
  );

  return response.data.data;
};

/**
 * Hook to fetch trip by ID
 */
export const useFetchTripById = ({ id }: { id: string }) =>
  useQuery({
    queryKey: ["TripById", id],
    queryFn: () => getTripById(id),
    refetchOnWindowFocus: false,
    retry: false,
  });

// ============================================
// DELETE OPERATIONS
// ============================================

/**
 * Bulk delete trips
 */
export const bulkDeleteTrips = async (ids: string[]) => {
  const data = {
    tripIds: ids,
  };
  const response = await axiosInstance.post(
    API_ENDPOINTS.BULK_DELETE_TRIPS,
    data,
  );

  return response.data;
};
