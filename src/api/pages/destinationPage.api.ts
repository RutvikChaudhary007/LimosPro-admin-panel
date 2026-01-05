import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";
import { API_ENDPOINTS } from "../../lib/api-endpoints";

export const getAllDestinationPageContent = async (params?: any) => {
  const response = await axiosInstance.get(
    API_ENDPOINTS.DESTINATION_PAGE_CONTENT.GET_ALL,
    {
      params,
    },
  );
  return response.data.data;
};

export const useFetchAllDestinationPageContent = (params?: any) =>
  useQuery({
    queryKey: ["destinationPageContent", params],
    queryFn: () => getAllDestinationPageContent(params),
    refetchOnWindowFocus: false,
    retry: false,
  });

export const getDestinationPageContentById = async (id: string) => {
  const response = await axiosInstance.get(
    API_ENDPOINTS.DESTINATION_PAGE_CONTENT.GET_BY_ID(id),
  );
  return response.data.data;
};

export const useFetchDestinationPageContentById = (id: string) =>
  useQuery({
    queryKey: ["destinationPageContent", id],
    queryFn: () => getDestinationPageContentById(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
    retry: false,
  });

export const createDestinationPageContent = async (data: any) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.DESTINATION_PAGE_CONTENT.CREATE,
    data,
  );
  return response.data;
};

export const updateDestinationPageContent = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<any>;
}) => {
  const response = await axiosInstance.put(
    API_ENDPOINTS.DESTINATION_PAGE_CONTENT.UPDATE(id),
    data,
  );
  return response.data;
};

export const deleteDestinationPageContent = async (id: string) => {
  const response = await axiosInstance.delete(
    API_ENDPOINTS.DESTINATION_PAGE_CONTENT.DELETE(id),
  );
  return response.data;
};
