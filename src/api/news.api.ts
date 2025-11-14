import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import adminAxiosInstance from "@/utils/axiosInstance";
import { API_ENDPOINTS } from "../lib/api-endpoints";

/**
 * #############################################
 *  Fetch All News
 * ##############################################
 * @param data
 * @returns response data
 */
export const getNews = async () => {
  try {
    const response = await adminAxiosInstance.get(API_ENDPOINTS.GET_ALL_NEWS);

    return response.data?.data;
  } catch (error) {
    if (error instanceof AxiosError && error?.status === 400) {
      return [];
    }
    throw error;
  }
};

const useFetchALLNews = () => {
  return useQuery({
    queryKey: ["news"],
    queryFn: getNews,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export default useFetchALLNews;

/**
 * #############################################
 *  Fetch News By ID
 * ##############################################
 * @param data
 * @returns response data
 */

export const getNewsById = async (id: string) => {
  const response = await adminAxiosInstance.get(
    API_ENDPOINTS.GET_NEWS_BY_ID.replace(":id", id),
  );
  return response.data?.data;
};

export const useFetchNewsById = (id: string) => {
  return useQuery({
    queryKey: ["newsById", { id }],
    queryFn: () => getNewsById(id),
    refetchOnWindowFocus: false,
    retry: false,
  });
};

/**
 * #############################################
 *  Create News
 * ##############################################
 * @param data
 * @returns response data
 */
export const createNews = async (data: { body: string }) => {
  const response = await adminAxiosInstance.post(
    API_ENDPOINTS.CREATE_NEWS,
    data,
  );

  return response.data?.data;
};

/**
 * #############################################
 *  Edit News By ID
 * ##############################################
 * @param data
 * @returns response data
 */
export const editNewsById = async ({
  id,
  data,
}: {
  id: string;
  data: { body: string };
}) => {
  const response = await adminAxiosInstance.put(
    API_ENDPOINTS.EDIT_NEWS.replace(":id", id),
    data,
  );

  return response.data?.data;
};

/**
 * #############################################
 *  Delete News By ID
 * ##############################################
 * @param data
 * @returns response data
 */
export const deleteNewsById = async (id: string) => {
  const response = await adminAxiosInstance.delete(
    API_ENDPOINTS.DELETE_NEWS.replace(":id", id),
  );

  return response.data;
};

/**
 * #############################################
 *  Bulk Delete News By ID
 * ##############################################
 * @param data
 * @returns response data
 */
export const bulkDeleteNewsById = async (ids: string[]) => {
  const data = {
    newsIds: ids,
  };
  const response = await adminAxiosInstance.post(
    API_ENDPOINTS.BULK_DELETE_NEWS,
    data,
  );

  return response.data;
};
