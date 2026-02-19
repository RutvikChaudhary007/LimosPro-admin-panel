import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { queryKeys } from "@/lib/queryKeys";
import axiosInstance from "@/utils/axiosInstance";

/**
 * ============================================
 * Partner API Module
 * ============================================
 * All partner-related API calls consolidated
 */

type DateRange = { startDate?: Date | undefined; endDate?: Date | undefined };

// ============================================
// GET OPERATIONS
// ============================================

/**
 * Fetch all partners with optional filters
 */
export const getAllPartner = async (
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
      `${API_ENDPOINTS.GET_ALL_PARTNER}`,
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
 * Hook to fetch all partners
 */
export const useFetchAllPartner = ({
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
    queryKey: queryKeys.partner.listParams(DateRange, page, limit, status),
    queryFn: () => getAllPartner(DateRange, page, limit, status),
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });

/**
 * Fetch partner by ID
 */
export const getPartnerById = async (id: string) => {
  const response = await axiosInstance.get(
    `${API_ENDPOINTS.GET_PARTNER_BY_ID.replace(":id", id)}`,
  );
  return response?.data?.data;
};

/**
 * Hook to fetch partner by ID
 */
export const useFetchPartnerById = ({ id }: { id: string | undefined }) =>
  useQuery({
    queryKey: queryKeys.partner.detail(id),
    queryFn: () =>
      id
        ? getPartnerById(id)
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
 * Create a new partner
 */
export const createPartner = async (data: object) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.CREATE_PARTNER,
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
 * Edit partner by ID
 */
export const editPartner = async ({
  data,
  id,
}: {
  data: object;
  id: string | undefined;
}) => {
  const response = await axiosInstance.put(
    API_ENDPOINTS.UPDATE_PARTNER.replace(":id", id as string),
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
 * Update partner (alternative endpoint)
 */
export const updatePartner = async (data: object) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.UPDATE_PARTNER,
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
 * Delete a single partner
 */
export const deletePartner = async (id: string) => {
  const response = await axiosInstance.delete(
    API_ENDPOINTS.DELETE_PARTNER.replace(":id", id),
  );

  return response.data;
};

/**
 * Bulk delete partners
 */
export const bulkDeletePartner = async (ids: string[]) => {
  const data = {
    partnerIds: ids,
  };
  const response = await axiosInstance.post(
    API_ENDPOINTS.BULK_DELETE_PARTNER,
    data,
  );

  return response.data;
};
