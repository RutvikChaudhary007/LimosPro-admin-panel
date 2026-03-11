import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { queryKeys } from "@/lib/queryKeys";
import type { InquiryStatus } from "@/types/inquiry.type";
import axiosInstance from "@/utils/axiosInstance";

/**
 * Fetch all inquiries
 */
export const getAllInquiries = async (
  page?: number,
  limit?: number,
  status?: string,
  type?: string,
  dateRange?: { startDate?: string; endDate?: string },
  search?: string,
) => {
  const params: Record<string, string | number> = {};
  if (page) params.page = page;
  if (limit) params.limit = limit;
  if (status) params.status = status;
  if (type) params.type = type;
  if (dateRange?.startDate) params.startDate = dateRange.startDate;
  if (dateRange?.endDate) params.endDate = dateRange.endDate;
  if (search) params.search = search;

  const response = await axiosInstance.get(API_ENDPOINTS.INQUIRIES.GET_ALL, {
    params,
  });

  return response.data?.data;
};

/**
 * Hook to fetch all inquiries
 */
export const useFetchAllInquiries = ({
  page,
  limit,
  status,
  type,
  dateRange,
  search,
}: {
  page: number;
  limit: number;
  status?: string;
  type?: string;
  dateRange?: { startDate?: string; endDate?: string };
  search?: string;
}) =>
  useQuery({
    queryKey: queryKeys.inquiry.lists(
      page,
      limit,
      status,
      type,
      dateRange,
      search,
    ),
    queryFn: () =>
      getAllInquiries(page, limit, status, type, dateRange, search),
    refetchOnWindowFocus: false,
    retry: false,
    // staleTime: 1000 * 1200,
    placeholderData: (previousData) => previousData,
  });

/**
 * Fetch inquiry by ID
 */
export const getInquiryById = async (id: string) => {
  const response = await axiosInstance.get(
    API_ENDPOINTS.INQUIRIES.GET_BY_ID(id),
  );
  return response?.data?.data;
};

/**
 * Hook to fetch inquiry by ID
 */
export const useFetchInquiryById = ({ id }: { id: string }) =>
  useQuery({
    queryKey: queryKeys.inquiry.detail(id),
    queryFn: () => getInquiryById(id),
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !!id,
  });

/**
 * Update inquiry status
 */
export const updateInquiryStatus = async ({
  id,
  status,
}: {
  id: string;
  status: InquiryStatus;
}) => {
  const response = await axiosInstance.patch(
    API_ENDPOINTS.INQUIRIES.UPDATE_STATUS(id),
    { status },
  );
  return response.data?.data;
};

/**
 * Hook to update inquiry status
 */
export const useUpdateInquiryStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateInquiryStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inquiry.all });
    },
  });
};

/**
 * Delete inquiry
 */
export const deleteInquiry = async (id: string) => {
  const response = await axiosInstance.delete(
    API_ENDPOINTS.INQUIRIES.DELETE(id),
  );
  return response.data;
};

/**
 * Hook to delete inquiry
 */
export const useDeleteInquiry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteInquiry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inquiry.all });
    },
  });
};

/**
 * Bulk delete inquiries
 */
export const bulkDeleteInquiries = async (ids: string[]) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.INQUIRIES.BULK_DELETE,
    { ids },
  );
  return response.data;
};

/**
 * Hook to bulk delete inquiries
 */
export const useBulkDeleteInquiries = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bulkDeleteInquiries,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inquiry.all });
    },
  });
};
