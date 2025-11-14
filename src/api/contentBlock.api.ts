import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "@/utils/axiosInstance";
import { API_ENDPOINTS } from "../lib/api-endpoints";

type TPara = { limit: number; page?: number };
export const getPageContentBlockTab = async () => {
  const response = await axiosInstance.get(
    `${API_ENDPOINTS.CONTENT_BLOCK.GET_TABS}`,
  );

  return response.data.data;
};

export const useFetchPageContentBlockTab = () =>
  useQuery({
    queryKey: ["ContentTab"],
    queryFn: () => getPageContentBlockTab(),
    refetchOnWindowFocus: false,
    // refetchInterval: 60000,
    retry: false,
    // keepPreviousData: true, // for pagination
  });

export const getAllContentBlock = async (data?: TPara) => {
  const params: Record<string, unknown> = {};
  if (data?.limit) {
    params.limit = data.limit;
  }
  if (data?.page) {
    params.page = data.page;
  }
  const response = await axiosInstance.get(
    `${API_ENDPOINTS.CONTENT_BLOCK.GET_ALL}`,
    { params },
  );

  return response.data.data;
};

const useFetchAllContentBlock = (Data: TPara) =>
  useQuery({
    queryKey: ["ContentBlocks", { Data }],
    queryFn: () => getAllContentBlock(Data),
    refetchOnWindowFocus: false,
    // refetchInterval: 60000,
    retry: false,
    // keepPreviousData: true, // for pagination
  });

export default useFetchAllContentBlock;

export const getSingleContentBlock = async (id: string) => {
  const response = await axiosInstance.get(
    `${API_ENDPOINTS.CONTENT_BLOCK.GET_BY_ID.replace(":id", id)}`,
  );

  return response?.data?.data;
};

export const useFetchContentBlockById = (id: string) =>
  useQuery({
    queryKey: ["contentBlockById", { id }],
    queryFn: () => getSingleContentBlock(id),
    refetchOnWindowFocus: false,
    // refetchInterval: 60000,
    retry: false,
    // keepPreviousData: true, // for pagination
  });

export const createContentBlock = async (data: unknown) => {
  try {
    const response = await axiosInstance.post(
      `${API_ENDPOINTS.CONTENT_BLOCK.CREATE}`,
      data,
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError)
      console.error(error.message || "Opps! An unkown error occured");
  }
};

export const editContentBlock = async ({
  id,
  data,
}: {
  id: string;
  data: unknown;
}) => {
  try {
    const response = await axiosInstance.put(
      `${API_ENDPOINTS.CONTENT_BLOCK.UPDATE.replace(":id", id)}`,
      data,
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError)
      console.error(error.message || "Opps! An unkown error occured");
  }
};

export const deleteContentBlock = async (id: string) => {
  try {
    const response = await axiosInstance.delete(
      `${API_ENDPOINTS.CONTENT_BLOCK.DELETE.replace(":id", id)}`,
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError)
      console.error(error.message || "Opps! An unkown error occured");
  }
};
