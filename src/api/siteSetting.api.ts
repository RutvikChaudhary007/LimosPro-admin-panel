import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import axiosInstance from "@/utils/axiosInstance";

/**
 * ============================================
 * All setting API Module
 * ============================================
 */

type DateRange = { startDate?: Date | undefined; endDate?: Date | undefined };

// ============================================
// GET OPERATIONS
// ============================================

/**
 * Fetch all affiliates with optional filters
 */
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
    return response?.data?.data;
  } catch (error) {
    if (error instanceof AxiosError && error?.status === 400) {
      return [];
    }
    throw error;
  }
};

/**
 * Hook to fetch all affiliates
 */
export const useFetchAllAffiliate = ({
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
  });

/**
 * Fetch affiliate by ID
 */
export const getAffiliateById = async (id: string) => {
  const response = await axiosInstance.get(
    `${API_ENDPOINTS.GET_AFFILIATE_BY_ID.replace(":id", id)}`,
  );
  return response?.data?.data;
};

/**
 * Hook to fetch affiliate by ID
 */
export const useFetchAffiliateById = ({ id }: { id: string | undefined }) =>
  useQuery({
    queryKey: ["affiliateById", id],
    queryFn: () =>
      id
        ? getAffiliateById(id)
        : () => {
            console.log("id missing");
          },
    refetchOnWindowFocus: false,
    retry: false,
  });

// ============================================
// CREATE OPERATIONS
// ============================================

/**
 * Create a new affiliate
 */
export const createAffiliate = async (data: object) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.CREATE_AFFILIATE,
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
// UPDATE OPERATIONS
// ============================================

/**
 * Edit affiliate by ID
 */
export const editAffiliate = async ({
  data,
  id,
}: {
  data: object;
  id: string | undefined;
}) => {
  const response = await axiosInstance.put(
    API_ENDPOINTS.UPDATE_AFFILIATE.replace(":id", id as string),
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};

/**
 * Update affiliate (alternative endpoint)
 */
export const updateAffiliate = async (data: object) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.UPDATE_AFFILIATE,
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
 * Delete a single affiliate
 */
export const deleteAffiliate = async (id: string) => {
  const response = await axiosInstance.delete(
    API_ENDPOINTS.DELETE_AFFILIATE.replace(":id", id),
  );

  return response.data;
};

/**
 * Bulk delete affiliates
 */
export const bulkDeleteAffiliate = async (ids: string[]) => {
  const data = {
    affiliateIds: ids,
  };
  const response = await axiosInstance.post(
    API_ENDPOINTS.BULK_DELETE_AFFILIATE,
    data,
  );

  return response.data;
};
