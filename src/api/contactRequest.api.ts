import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "@/utils/axiosInstance";
import { API_ENDPOINTS } from "../lib/api-endpoints";

/**
 * #############################################
 *  Fetch Contact-Request
 * ##############################################
 * @param data
 * @returns response data
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
    // console.log("response:",response)

    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError && error?.status === 400) {
      // Treat 400 as "no data" instead of an actual error
      return [];
    }
    throw error;
  }
};

const useFetchAllContactRequest = ({
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
    // refetchInterval: 60000,
    retry: false,
    // keepPreviousData: true, // for pagination
  });

export default useFetchAllContactRequest;

/**
 * #############################################
 *  Fetch ContactRequest By ID
 * ##############################################
 * @param data
 * @returns response data
 */
const getContactRequestById = async (id: string) => {
  const response = await axiosInstance.get(
    `${API_ENDPOINTS.CONTACT_REQUEST.GET_BY_ID.replace(":id", id)}`,
  );
  //   console.log("response:",response.data)
  return response?.data?.data;
};

export const useFetchContactRequestById = ({ id }: { id: string }) =>
  useQuery({
    queryKey: ["contactRequestById", id],
    queryFn: () => getContactRequestById(id),
    refetchOnWindowFocus: false,
    retry: false,
  });

/**
 * #############################################
 *  Create Chauffeur
 * ##############################################
 * @param data
 * @returns response data
 */
export const createChauffeur = async (data: object) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.CREATE_CHAFFEUR,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};

/**
 * #############################################
 *  Edit Chauffeur
 * ##############################################
 * @param data
 * @returns response data
 */
export const editChauffeur = async ({
  data,
  id,
}: {
  data: unknown;
  id: string;
}) => {
  // console.log("edit chauffeur..:",data)
  const response = await axiosInstance.patch(
    API_ENDPOINTS.EDIT_CHAFFEUR.replace(":id", id),
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};

/**
 * #############################################
 *  Delete Chauffeur
 * ##############################################
 * @param data
 * @returns response data
 */
export const deleteChauffeur = async (id: string) => {
  const response = await axiosInstance.delete(
    API_ENDPOINTS.DELETE_CHAFFEUR.replace(":id", id),
  );

  return response.data;
};

/**
 * #############################################
 *  Bulk Delete Chauffeur
 * ##############################################
 * @param data
 * @returns response data
 */
export const bulkDeleteChauffeur = async (ids: string[]) => {
  const data = {
    chauffeurIds: ids,
  };
  const response = await axiosInstance.post(
    API_ENDPOINTS.BULK_DELETE_CHAFFEUR,
    data,
  );
  return response.data;
};
