/**
 * ######################
 *  FAQ API
 * ######################
 * */

import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import type { TFaqForm } from "@/components/faq/FaqForm";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import adminAxiosInstance from "@/utils/axiosInstance";

/**
 * #############################################
 *  Fetch All FAQs
 * ##############################################
 * @returns response data
 */
export const getAllFAQs = async (limit: number) => {
  try {
    const response = await adminAxiosInstance.get(API_ENDPOINTS.GET_ALL_FAQ, {
      params: {
        limit,
      },
    });

    return response.data?.data;
  } catch (error) {
    if (error instanceof AxiosError && error?.status === 400) {
      return [];
    }
    throw error;
  }
};

const useFetchALLFAQs = (limit: number) => {
  return useQuery({
    queryKey: ["faqs", limit],
    queryFn: () => getAllFAQs(limit),
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export default useFetchALLFAQs;

/**
 * #############################################
 *  Fetch FAQ By ID
 * ##############################################
 * @param data
 * @returns response data
 */

export const getFAQById = async (id: string) => {
  const response = await adminAxiosInstance.get(
    API_ENDPOINTS.GET_FAQ_BY_ID.replace(":id", id),
  );
  return response.data?.data;
};

export const useFetchFAQById = (id: string) => {
  return useQuery({
    queryKey: ["faqById", { id }],
    queryFn: () => getFAQById(id),
    refetchOnWindowFocus: false,
    retry: false,
  });
};

/**
 * #############################################
 *  Create FAQ
 * ##############################################
 * @param data
 * @returns response data
 */
export const createFAQ = async (data: TFaqForm) => {
  const response = await adminAxiosInstance.post(
    API_ENDPOINTS.CREATE_FAQ,
    data,
  );

  return response.data?.data;
};

/**
 * #############################################
 *  Edit FAQ By ID
 * ##############################################
 * @param data
 * @returns response data
 */
export const editFAQById = async ({
  id,
  data,
}: {
  id: string;
  data: TFaqForm;
}) => {
  const response = await adminAxiosInstance.put(
    API_ENDPOINTS.EDIT_FAQ.replace(":id", id),
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
 * #############################################
 *  Delete FAQ By ID
 * ##############################################
 * @param data
 * @returns response data
 */
export const deleteFAQById = async (id: string) => {
  const response = await adminAxiosInstance.delete(
    API_ENDPOINTS.DELETE_FAQ.replace(":id", id),
  );

  return response.data;
};

/**
 * #############################################
 * Bulk Delete FAQ By ID
 * ##############################################
 * @param data
 * @returns response data
 */
export const bulkDeleteFAQById = async (ids: string[]) => {
  const data = {
    faqsIds: ids,
  };
  const response = await adminAxiosInstance.post(
    API_ENDPOINTS.BULK_DELETE_FAQ,
    data,
  );

  return response.data;
};
