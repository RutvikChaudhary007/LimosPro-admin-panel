import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";
import { API_ENDPOINTS } from "../../lib/api-endpoints";

export const getAllServicePageContent = async (params?: any) => {
  const response = await axiosInstance.get(
    API_ENDPOINTS.SERVICE_PAGE_CONTENT.GET_ALL,
    {
      params,
    },
  );
  return response.data.data;
};

export const useFetchAllServicePageContent = (params?: any) =>
  useQuery({
    queryKey: ["servicePageContent", params],
    queryFn: () => getAllServicePageContent(params),
    refetchOnWindowFocus: false,
    retry: false,
  });

export const getServicePageContentById = async (id: string) => {
  const response = await axiosInstance.get(
    API_ENDPOINTS.SERVICE_PAGE_CONTENT.GET_BY_ID(id),
  );
  return response.data.data;
};

export const useFetchServicePageContentById = (id: string) =>
  useQuery({
    queryKey: ["servicePageContent", id],
    queryFn: () => getServicePageContentById(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
    retry: false,
  });

export const createServicePageContent = async (data: any) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.SERVICE_PAGE_CONTENT.CREATE,
    data,
  );
  return response.data;
};

export const updateServicePageContent = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<any>;
}) => {
  const response = await axiosInstance.put(
    API_ENDPOINTS.SERVICE_PAGE_CONTENT.UPDATE(id),
    data,
  );
  return response.data;
};

export const deleteServicePageContent = async (id: string) => {
  const response = await axiosInstance.delete(
    API_ENDPOINTS.SERVICE_PAGE_CONTENT.DELETE(id),
  );
  return response.data;
};
