import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { queryKeys } from "@/lib/queryKeys";
import axiosInstance from "@/utils/axiosInstance";

/**
 * ============================================
 * Report API Module
 * ============================================
 * All report-related API calls consolidated
 */

type ReportArg = {
  page?: number;
  limit?: number;
};

export type ReportPayload = {
  paymentId: string;
  amount: number | string;
  bookingId: string;
  customerId: string;
};

// ============================================
// REPORT OPERATIONS
// ============================================

/**
 * Fetch all Reports with optional filters
 */
export const getAllReports = async ({ limit, page }: ReportArg) => {
  const params: Record<string, unknown> = {};
  if (limit) params.limit = limit;
  if (page) {
    params.offset = page;
  }
  const response = await axiosInstance.get(`${API_ENDPOINTS.GET_ALL_REPORTS}`, {
    params,
  });

  return response.data.data;
};

/**
 * Hook to fetch all reports
 */
export const useFetchAllReports = (
  { page, limit }: ReportArg,
  enabled: boolean,
) =>
  useQuery({
    queryKey: queryKeys.report.listParams(limit, page),
    queryFn: () => getAllReports({ limit, page }),
    refetchOnWindowFocus: false,
    retry: false,
    enabled,
  });
