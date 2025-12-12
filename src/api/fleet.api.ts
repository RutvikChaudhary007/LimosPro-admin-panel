import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import axiosInstance from "@/utils/axiosInstance";

/**
 * ============================================
 * Fleet API Module
 * ============================================
 * All fleet-related API calls consolidated
 */

type DateRange = { startDate?: Date | undefined; endDate?: Date | undefined };

// ============================================
// GET OPERATIONS
// ============================================

/**
 * Fetch all fleets with optional filters
 */
export const getAllFleets = async (
  DateRange: DateRange,
  page?: number,
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
  if (page) {
    params.page = page;
  }
  if (limit) {
    params.limit = limit;
  }
  try {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.GET_ALL_FLEETS}`,
      { params },
    );
    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError && error?.status === 400) {
      return [];
    }
    throw error;
  }
};

/**
 * Hook to fetch all fleets
 */
export const useFetchAllFleets = ({
  DateRange,
  page,
  limit,
}: {
  DateRange: DateRange;
  page?: number;
  limit?: number;
}) =>
  useQuery({
    queryKey: ["Fleets", DateRange, page, limit],
    queryFn: () => getAllFleets(DateRange, page, limit),
    refetchOnWindowFocus: false,
    retry: false,
  });

/**
 * Fetch fleet by ID (with Suspense)
 */
export const getFleetById = async (id: string) => {
  const response = await axiosInstance.get(
    `${API_ENDPOINTS.GET_FLEET_BY_ID.replace(":id", id)}`,
  );
  return response.data.data;
};

/**
 * Hook to fetch fleet by ID (with Suspense)
 */
export const useFetchFleetById = ({ id }: { id: string }) =>
  useSuspenseQuery({
    queryKey: ["FleetById", id],
    queryFn: () => getFleetById(id),
    refetchOnWindowFocus: false,
    retry: false,
  });

// ============================================
// CREATE OPERATIONS
// ============================================

/**
 * Create a new fleet
 */
export const createFleet = async (data: object) => {
  const response = await axiosInstance.post(API_ENDPOINTS.CREATE_FLEET, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// ============================================
// UPDATE OPERATIONS
// ============================================

/**
 * Edit fleet by ID
 */
export const editFleetById = async ({
  id,
  data,
}: {
  id: string;
  data: object;
}) => {
  const response = await axiosInstance.put(
    API_ENDPOINTS.EDIT_FLEET_BY_ID.replace(":id", id),
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};

// ============================================
// DELETE OPERATIONS
// ============================================

/**
 * Delete a single fleet
 */
export const deleteFleet = async (id: string) => {
  const response = await axiosInstance.delete(
    API_ENDPOINTS.DELETE_FLEET.replace(":id", id),
  );

  return response.data;
};

/**
 * Bulk delete fleets
 */
export const bulkDeleteFleet = async (ids: string[]) => {
  const data = {
    vehicleIds: ids,
  };
  const response = await axiosInstance.post(
    API_ENDPOINTS.BULK_DELETE_FLEET,
    data,
  );

  return response.data;
};
