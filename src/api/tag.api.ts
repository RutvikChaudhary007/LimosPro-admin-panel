import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "@/utils/axiosInstance";
import { ADMIN_SERVICE_URL, API_ENDPOINTS } from "../lib/api-endpoints";

export const getAllTags = async (
  params?: Record<string, unknown>,
  page?: number,
) => {
  const query: Record<string, unknown> = {};
  if (params) Object.assign(query, params);
  if (page) query.page = page;

  try {
    const response = await axiosInstance.get(API_ENDPOINTS.TAG.GET_ALL, {
      params: query,
    });
    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError && (error as any)?.status === 400) {
      return [];
    }
    throw error;
  }
};

export const useFetchAllTags = ({
  params,
  page,
}: {
  params?: Record<string, unknown>;
  page?: number;
}) =>
  useQuery({
    queryKey: ["tags", params, page],
    queryFn: () => getAllTags(params, page),
    refetchOnWindowFocus: false,
    retry: false,
  });

export default useFetchAllTags;

export const getTagById = async (id: string) => {
  const response = await axiosInstance.get(API_ENDPOINTS.TAG.GET_BY_ID(id));
  return response?.data?.data;
};

export const useFetchTagById = ({ id }: { id: string }) =>
  useQuery({
    queryKey: ["tagById", id],
    queryFn: () => getTagById(id),
    refetchOnWindowFocus: false,
    retry: false,
  });

export const createTag = async (data: unknown) => {
  const response = await axiosInstance.post(API_ENDPOINTS.TAG.CREATE, data);
  return response.data;
};

export const updateTag = async (id: string, data: unknown) => {
  const response = await axiosInstance.patch(
    API_ENDPOINTS.TAG.UPDATE(id),
    data,
  );
  return response.data;
};

export const deleteTag = async (id: string) => {
  const response = await axiosInstance.delete(API_ENDPOINTS.TAG.DELETE(id));
  return response.data;
};

export const bulkDeleteTags = async (ids: string[]) => {
  const endpoint = `${ADMIN_SERVICE_URL}/tags/bulk-delete`;
  const response = await axiosInstance.post(endpoint, { ids });
  return response.data;
};
