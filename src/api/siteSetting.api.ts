import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ADMIN_SERVICE_URL, API_ENDPOINTS } from "@/lib/api-endpoints";
import { queryKeys } from "@/lib/queryKeys";
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
    queryKey: queryKeys.siteSetting.partnerLists(
      DateRange,
      page,
      limit,
      status,
    ),
    queryFn: () => getAllPartner(DateRange, page, limit, status),
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });

/**
 * Fetch Partner by ID
 */
export const getPartnerById = async (id: string) => {
  const response = await axiosInstance.get(
    `${API_ENDPOINTS.GET_PARTNER_BY_ID.replace(":id", id)}`,
  );
  return response?.data?.data;
};

/**
 * Hook to fetch Partner by ID
 */
export const useFetchPartnerById = ({ id }: { id: string | undefined }) =>
  useQuery({
    queryKey: queryKeys.siteSetting.partnerDetail(id as string),
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
 * Create a new Partner
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
 * Edit Partner by ID
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
 * Update Partner (alternative endpoint)
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

// ============================================
// SITE SETTINGS UI OPERATIONS
// ============================================

/**
 * Fetch site settings UI configuration
 */
export const getSiteSettingsUI = async () => {
  const response = await axiosInstance.get(API_ENDPOINTS.GET_SITE_SETTINGS_UI);
  return response?.data?.data ?? response?.data;
};

/**
 * Hook to fetch site settings UI configuration
 */
export const useFetchSiteSettingsUI = () =>
  useQuery({
    queryKey: queryKeys.siteSetting.ui(),
    queryFn: () => getSiteSettingsUI(),
    refetchOnWindowFocus: false,
    retry: false,
  });

/**
 * Update site settings UI configuration
 */
export const updateSiteSettingsUI = async (data: object | FormData) => {
  const isFormData = data instanceof FormData;
  const response = await axiosInstance.put(
    API_ENDPOINTS.UPDATE_SITE_SETTINGS_UI,
    data,
    isFormData
      ? {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      : undefined,
  );
  return response?.data?.data ?? response?.data;
};

/**
 * Hook to update site settings UI configuration
 */
export const useUpdateSiteSettingsUIMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSiteSettingsUI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.siteSetting.ui() });
    },
  });
};

// ============================================
// GLOBAL LIMITS (City Distance Limits) OPERATIONS
// ============================================

export interface CityDistanceLimits {
  default: number;
  houston?: number;
  dallas?: number;
  austin?: number;
  "san-antonio"?: number;
  "las-vegas"?: number;
  orlando?: number;
  "los-angeles"?: number;
  paris?: number;
  london?: number;
  frankfurt?: number;
  dubai?: number;
  riyadh?: number;
  cairo?: number;
  [key: string]: number | undefined;
}

export interface GlobalLimits {
  maxBookingsPerDay: number;
  maxDistanceMiles: number;
  minBookingNoticeHours: number;
  maxPassengersPerVehicle: number;
  cityDistanceLimits: CityDistanceLimits;
}

/**
 * Fetch global limits configuration
 */
export const getGlobalLimits = async (): Promise<GlobalLimits> => {
  const url = `${ADMIN_SERVICE_URL}/admin/site-settings/global-limits`;
  console.log("GET Global Limits URL:", url);
  const response = await axiosInstance.get(url);
  console.log("GET Global Limits Response:", response);
  return response?.data?.data ?? response?.data;
};

/**
 * Hook to fetch global limits
 */
export const useFetchGlobalLimits = () =>
  useQuery({
    queryKey: queryKeys.siteSetting.globalLimits(),
    queryFn: () => getGlobalLimits(),
    refetchOnWindowFocus: false,
    retry: false,
  });

/**
 * Update global limits configuration
 */
export const updateGlobalLimits = async (data: Partial<GlobalLimits>) => {
  const url = `${ADMIN_SERVICE_URL}/admin/site-settings/global-limits`;
  console.log("PUT Global Limits URL:", url);
  console.log("PUT Global Limits Data:", data);
  const response = await axiosInstance.put(url, data);
  console.log("PUT Global Limits Response:", response);
  return response?.data?.data ?? response?.data;
};

/**
 * Hook to update global limits
 */
export const useUpdateGlobalLimitsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateGlobalLimits,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.siteSetting.globalLimits(),
      });
    },
  });
};
