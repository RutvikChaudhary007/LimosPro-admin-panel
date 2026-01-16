import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import axiosInstance from "@/utils/axiosInstance";

/**
 * ============================================
 * Global Search API Module
 * ============================================
 * All global search API calls consolidated
 */

// ============================================
// GET OPERATIONS
// ============================================

/**
 * Fetch global search
 */
export const globalSearch = async (search: string, signal?: AbortSignal) => {
  const params: Record<string, unknown> = {};
  if (search) {
    params.q = search;
  }
  try {
    const response = await axiosInstance.get(`${API_ENDPOINTS.GLOBAL_SEARCH}`, {
      params,
      signal,
    });

    const data = response?.data?.data || {};

    // Transform nested structure to flat array with type labels
    const results: any[] = [];

    // Map API keys to display type names
    const typeMapping: Record<string, string> = {
      customers: "Customer",
      chauffeurs: "Chauffeur",
      affiliates: "Partner",
      staff: "Staff",
      regionalAdmins: "Regional Admin",
      fleet: "Fleet",
      bookings: "Booking",
      payments: "Payment",
    };

    Object.entries(data).forEach(([key, items]) => {
      if (Array.isArray(items) && items.length > 0) {
        const typeName = typeMapping[key] || key;
        items.forEach((item: any) => {
          results.push({
            ...item,
            type: typeName,
          });
        });
      }
    });

    return results;
  } catch (error) {
    if (error instanceof AxiosError && error?.status === 400) {
      return [];
    }
    // Don't throw on abort - just return empty
    if (error instanceof Error && error.name === "AbortError") {
      return [];
    }
    throw error;
  }
};

/**
 * Hook to fetch global search
 */
export const useFetchGlobalSearch = ({
  search,
  enabled = true,
}: {
  search: string;
  enabled?: boolean;
}) =>
  useQuery({
    queryKey: ["globalSearch", search],
    queryFn: ({ signal }) => globalSearch(search, signal),
    refetchOnWindowFocus: false,
    retry: false,
    enabled: enabled && !!search,
  });
