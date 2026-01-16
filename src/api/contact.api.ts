import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import type { TIpWhiteListForm } from "@/components/ipWhiteList/IpWhiteListForm";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import {
  default as adminAxiosInstance,
  default as axiosInstance,
} from "@/utils/axiosInstance";

/**
 * ============================================
 * Contact API Module
 * ============================================
 * Contact requests and IP whitelist API calls consolidated
 */

// ============================================
// CONTACT REQUEST OPERATIONS
// ============================================

/**
 * Fetch all contact requests
 */
export const getAllContactRequest = async (page?: number, limit?: number) => {
  const params: Record<string, number> = {};

  if (page) params.page = page;
  if (limit) params.limit = limit;

  try {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.CONTACT_REQUEST.CREATE}`,
      {
        params,
      },
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
 * Hook to fetch all contact requests
 */
export const useFetchAllContactRequest = ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) =>
  useQuery({
    queryKey: ["contactRequest", page, limit],
    queryFn: () => getAllContactRequest(page, limit),
    refetchOnWindowFocus: false,
    retry: false,
  });

/**
 * Fetch contact request by ID
 */
export const getContactRequestById = async (id: string) => {
  const response = await axiosInstance.get(
    `${API_ENDPOINTS.CONTACT_REQUEST.GET_BY_ID.replace(":id", id)}`,
  );
  return response?.data?.data;
};

/**
 * Hook to fetch contact request by ID
 */
export const useFetchContactRequestById = ({ id }: { id: string }) =>
  useQuery({
    queryKey: ["contactRequestById", id],
    queryFn: () => getContactRequestById(id),
    refetchOnWindowFocus: false,
    retry: false,
  });

/**
 * Send reply to contact request
 */
export const replyToContactRequest = async ({
  id,
  subject,
  message,
}: {
  id: string;
  subject: string;
  message: string;
}) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.CONTACT_REQUEST.REPLY(id),
    { subject, message },
  );
  return response.data?.data;
};

/**
 * Hook to send reply to contact request
 */
export const useReplyContactMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: replyToContactRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contactRequest"] });
    },
  });
};

// ============================================
// IP WHITELIST OPERATIONS
// ============================================

/**
 * Fetch all IP whitelists
 */
export const getAllIPWhiteLists = async (page?: number, limit?: number) => {
  const params: Record<string, number> = {};
  if (page) params.page = page;
  if (limit) params.limit = limit;

  const response = await adminAxiosInstance.get(
    API_ENDPOINTS.GET_ALL_IP_WHITE_LIST,
    {
      params,
    },
  );

  return response.data?.data;
};

/**
 * Hook to fetch all IP whitelists
 */
export const useFetchAllIPWhiteLists = ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  return useQuery({
    queryKey: ["ipWhiteLists", page, limit],
    queryFn: () => getAllIPWhiteLists(page, limit),
    refetchOnWindowFocus: false,
    retry: false,
  });
};

/**
 * Fetch IP whitelist by ID
 */
export const getIPWhiteListById = async (id: string) => {
  try {
    const response = await adminAxiosInstance.get(
      API_ENDPOINTS.GET_IP_WHITE_LIST_BY_ID.replace(":id", id),
    );
    return response.data?.data;
  } catch (error) {
    if (error instanceof AxiosError && error?.status === 400) {
      return [];
    }
    throw error;
  }
};

/**
 * Hook to fetch IP whitelist by ID
 */
export const useFetchIPWhiteListById = (id: string) => {
  return useQuery({
    queryKey: ["ipWhiteListById", { id }],
    queryFn: () => getIPWhiteListById(id),
    refetchOnWindowFocus: false,
    retry: false,
  });
};

/**
 * Create IP whitelist
 */
export const createIPWhiteList = async (data: TIpWhiteListForm) => {
  const response = await adminAxiosInstance.post(
    API_ENDPOINTS.CREATE_IP_WHITE_LIST,
    data,
  );

  return response.data?.data;
};

/**
 * Edit IP whitelist
 */
export const editIPWhiteListById = async ({
  id,
  data,
}: {
  id: string;
  data: TIpWhiteListForm;
}) => {
  const response = await adminAxiosInstance.put(
    API_ENDPOINTS.EDIT_IP_WHITE_LIST.replace(":id", id),
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  return response.data?.data;
};

/**
 * Delete IP whitelist
 */
export const deleteIPWhiteListById = async (id: string) => {
  const response = await adminAxiosInstance.delete(
    API_ENDPOINTS.DELETE_IP_WHITE_LIST.replace(":id", id),
  );

  return response.data;
};

/**
 * Bulk delete IP whitelists
 */
export const bulkDeleteIPWhiteListById = async (ids: string[]) => {
  const data = {
    ipsIds: ids,
  };
  const response = await adminAxiosInstance.post(
    API_ENDPOINTS.BULK_DELETE_IP_WHITE_LIST,
    data,
  );

  return response.data;
};
