import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import axiosInstance from "@/utils/axiosInstance";

/**
 * ============================================
 * Service Pricing API Module
 * ============================================
 * All service pricing-related API calls
 */

type DateRange = { startDate?: Date | undefined; endDate?: Date | undefined };

// ============================================
// GET OPERATIONS
// ============================================

/**
 * Fetch all service pricings with optional filters
 */
export const getAllServicePricings = async (
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
      `${API_ENDPOINTS.GET_ALL_SERVICE_PRICING}`,
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
 * Hook to fetch all service pricings
 */
export const useFetchAllServicePricings = ({
  DateRange,
  page,
  limit,
}: {
  DateRange: DateRange;
  page?: number;
  limit?: number;
}) =>
  useQuery({
    queryKey: ["ServicePricings", DateRange, page, limit],
    queryFn: () => getAllServicePricings(DateRange, page, limit),
    refetchOnWindowFocus: false,
    retry: false,
  });

/**
 * Fetch service pricing by ID (with Suspense)
 */
export const getServicePricingById = async (id: string) => {
  const response = await axiosInstance.get(
    `${API_ENDPOINTS.GET_SERVICE_PRICING_BY_ID.replace(":id", id)}`,
  );
  return response.data.data;
};

/**
 * Hook to fetch service pricing by ID (with Suspense)
 */
export const useFetchServicePricingById = ({ id }: { id: string }) =>
  useSuspenseQuery({
    queryKey: ["ServicePricingById", id],
    queryFn: () => getServicePricingById(id),
    refetchOnWindowFocus: false,
    retry: false,
  });

// ============================================
// CREATE OPERATIONS
// ============================================

/**
 * Create a new service pricing
 */
export const createServicePricing = async (data: FormData) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.CREATE_SERVICE_PRICING,
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  return response.data;
};

// ============================================
// UPDATE OPERATIONS
// ============================================

/**
 * Edit service pricing by ID
 */
export const editServicePricingById = async ({
  id,
  data,
}: {
  id: string;
  data: FormData;
}) => {
  const response = await axiosInstance.put(
    API_ENDPOINTS.EDIT_SERVICE_PRICING_BY_ID.replace(":id", id),
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  return response.data;
};

// ============================================
// DELETE OPERATIONS
// ============================================

/**
 * Delete a single service pricing
 */
export const deleteServicePricing = async (id: string) => {
  const response = await axiosInstance.delete(
    API_ENDPOINTS.DELETE_SERVICE_PRICING.replace(":id", id),
  );

  return response.data;
};

/**
 * Bulk delete service pricings
 */
export const bulkDeleteServicePricing = async (ids: string[]) => {
  const data = {
    servicePricingIds: ids,
  };
  const response = await axiosInstance.post(
    API_ENDPOINTS.BULK_DELETE_SERVICE_PRICING,
    data,
  );

  return response.data;
};
