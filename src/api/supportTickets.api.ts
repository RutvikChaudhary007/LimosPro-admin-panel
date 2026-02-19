import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { queryKeys } from "@/lib/queryKeys";
import axiosInstance from "@/utils/axiosInstance";

type SupportTicketsResponse = {
  tickets?: any[];
  pagination?: Record<string, any>;
};

export const getAllSupportTickets = async ({
  page,
  limit,
  status,
  type,
}: {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
}) => {
  const params: Record<string, unknown> = {};

  if (page) params.page = page;
  if (limit) params.limit = limit;
  if (status) params.status = status;
  if (type) params.type = type;

  try {
    const response = await axiosInstance.get(
      API_ENDPOINTS.GET_ALL_SUPPORT_TICKETS,
      {
        params,
      },
    );

    const payload = response?.data?.data;
    if (Array.isArray(payload)) {
      return {
        tickets: payload.map((ticket) => ({
          ...ticket,
          raisedBy: ticket.raisedBy ?? ticket.userType ?? "",
        })),
        pagination: {
          totalItems: payload.length,
          totalPages: 1,
        },
      } as SupportTicketsResponse;
    }

    return payload as SupportTicketsResponse;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 400) {
      return { tickets: [], pagination: {} } as SupportTicketsResponse;
    }
    if (isAxiosError(error)) throw error;
    throw new Error("An unexpected error occurred");
  }
};

export const useFetchAllSupportTickets = ({
  page,
  limit,
  status,
  type,
  queryOptions,
}: {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  queryOptions?: Record<string, any>;
}) =>
  useQuery({
    queryKey: queryKeys.supportTicket.listParams(page, limit, status, type),
    queryFn: () => getAllSupportTickets({ page, limit, status, type }),
    refetchOnWindowFocus: false,
    retry: false,
    ...queryOptions,
  });

export const getSupportTicketById = async (id?: string) => {
  if (!id) return undefined;
  const response = await axiosInstance.get(
    API_ENDPOINTS.GET_SUPPORT_TICKET_BY_ID.replace(":id", id),
  );
  return response?.data?.data;
};

export const useFetchSupportTicketById = ({
  id,
  queryOptions,
}: {
  id?: string | undefined;
  queryOptions?: Record<string, any>;
}) =>
  useQuery({
    queryKey: queryKeys.supportTicket.detail(id ?? ""),
    queryFn: () => getSupportTicketById(id),
    refetchOnWindowFocus: false,
    retry: false,
    enabled: Boolean(id),
    ...queryOptions,
  });

export const updateSupportTicketStatus = async ({
  id,
  status,
}: {
  id: string;
  status: string;
}) => {
  const response = await axiosInstance.patch(
    API_ENDPOINTS.UPDATE_SUPPORT_TICKET_STATUS.replace(":id", id),
    { status },
  );
  return response?.data?.data;
};
export const replySupportTicket = async ({
  id,
  message,
  attachment,
}: {
  id: string;
  message: string;
  attachment?: File | null;
}) => {
  if (attachment) {
    const formData = new FormData();
    formData.append("message", message);
    formData.append("attachments", attachment);
    const response = await axiosInstance.post(
      API_ENDPOINTS.REPLY_SUPPORT_TICKET.replace(":id", id),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response?.data?.data;
  }
  const response = await axiosInstance.post(
    API_ENDPOINTS.REPLY_SUPPORT_TICKET.replace(":id", id),
    { message },
  );
  return response?.data?.data;
};

export const useReplySupportTicketMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: replySupportTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.supportTicket.lists(),
      });
    },
  });
};
