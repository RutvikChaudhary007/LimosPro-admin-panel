import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { queryKeys } from "@/lib/queryKeys";
import axiosInstance from "@/utils/axiosInstance";

export type AuditLogItem = {
  id: string;
  statusCode?: number | string;
  module?: string;
  action?: string;
  method?: string;
};

type AuditLogsResponse = {
  logs?: AuditLogItem[];
  pagination?: Record<string, any>;
};

export const getAuditLogs = async ({
  page,
  limit,
}: {
  page?: number;
  limit?: number;
} = {}) => {
  try {
    const params: Record<string, unknown> = {};
    if (page) params.page = page;
    if (limit) params.limit = limit;

    const response = await axiosInstance.get(API_ENDPOINTS.AUDIT_LOGS, {
      params,
    });
    const payload = response?.data?.data ?? response?.data;

    if (Array.isArray(payload)) {
      return {
        logs: payload as AuditLogItem[],
        pagination: {
          totalItems: payload.length,
          totalPages: 1,
        },
      } as AuditLogsResponse;
    }

    if (payload?.logs) return payload as AuditLogsResponse;

    return {
      logs: payload?.data ?? payload?.items ?? [],
      pagination: payload?.pagination ?? {},
    } as AuditLogsResponse;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 400) {
      return { logs: [], pagination: {} } as AuditLogsResponse;
    }
    if (isAxiosError(error)) throw error;
    throw new Error("An unexpected error occurred");
  }
};

export const useFetchAuditLogs = (
  {
    page,
    limit,
    queryOptions,
  }: {
    page?: number;
    limit?: number;
    queryOptions?: Record<string, any>;
  } = { queryOptions: {} },
) =>
  useQuery({
    queryKey: queryKeys.auditLog.listParams(page, limit),
    queryFn: () => getAuditLogs({ page, limit }),
    refetchOnWindowFocus: false,
    retry: false,
    ...(queryOptions ?? {}),
  });

export const getAuditLogById = async (id?: string) => {
  if (!id) return undefined;
  const response = await axiosInstance.get(
    API_ENDPOINTS.AUDIT_LOG_DETAIL.replace(":id", id),
  );
  return response?.data?.data ?? response?.data;
};

export const useFetchAuditLogById = ({
  id,
  queryOptions,
}: {
  id?: string | undefined;
  queryOptions?: Record<string, any>;
}) =>
  useQuery({
    queryKey: queryKeys.auditLog.detail(id ?? ""),
    queryFn: () => getAuditLogById(id),
    refetchOnWindowFocus: false,
    retry: false,
    enabled: Boolean(id),
    ...(queryOptions ?? {}),
  });
