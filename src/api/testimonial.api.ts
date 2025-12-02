import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import adminAxiosInstance from "@/utils/axiosInstance";
import { API_ENDPOINTS } from "../lib/api-endpoints";

/**
 * #############################################
 *  Fetch All Testimonials
 * ##############################################
 * @param data
 * @returns response data
 */

export const getAllTestimonials = async (page?: number, limit?: number) => {
  const params: Record<string, unknown> = {};
  if (page) {
    params.page = page;
  }
  if (limit) {
    params.limit = limit;
  }

  try {
    const response = await adminAxiosInstance.get(
      `${API_ENDPOINTS.GET_ALL_TESTIMONIALS}`,
      { params },
    );
    // console.log("response:",response)

    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError && error?.status === 400) {
      return [];
    }
    throw error;
  }
};

const useFetchAllTestimonials = ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) =>
  useQuery({
    queryKey: ["testimonials", page, limit],
    queryFn: () => getAllTestimonials(page, limit),
    refetchOnWindowFocus: false,
    // refetchInterval: 60000,
    retry: false,
    // keepPreviousData: true, // for pagination
  });

export default useFetchAllTestimonials;

/**
 * #############################################
 *  Fetch Testimonial By ID
 * ##############################################
 * @param data
 * @returns response data
 */
export const getTestimonialById = async (id: string) => {
  // console.log("id:",id)
  const response = await adminAxiosInstance.get(
    `${API_ENDPOINTS.GET_TESTIMONIAL_BY_ID.replace(":id", id)}`,
  );
  console.log("response:", response.data);
  return response?.data?.data;
};

export const useFetchTestimonialById = ({ id }: { id: string }) =>
  useQuery({
    queryKey: ["testimonialById", id],
    queryFn: () => getTestimonialById(id),
    refetchOnWindowFocus: false,
    retry: false,
  });

/**
 * #############################################
 *  Create Testimonial
 * ##############################################
 * @param data
 * @returns response data
 */
export const createTestimonial = async (data: FormData) => {
  const response = await adminAxiosInstance.post(
    API_ENDPOINTS.CREATE_TESTIMONIAL,
    data,
  );

  return response.data;
};

/**
 * #############################################
 *  Edit Testimonial
 * ##############################################
 * @param data
 * @returns response data
 */

export const editTestimonial = async ({
  data,
  id,
}: {
  data: FormData;
  id: string;
}) => {
  // console.log("edit testimonial..:",data)
  const response = await adminAxiosInstance.put(
    API_ENDPOINTS.EDIT_TESTIMONIAL.replace(":id", id),
    data,
  );

  return response.data;
};

/**
 * #############################################
 *  Delete Testimonial
 * ##############################################
 * @param data
 * @returns response data
 */
export const deleteTestimonial = async (id: string) => {
  const response = await adminAxiosInstance.delete(
    API_ENDPOINTS.DELETE_TESTIMONIAL.replace(":id", id),
  );

  return response.data;
};

/**
 * #############################################
 *  Bulk Delete Testimonial
 * ##############################################
 * @param data
 * @returns response data
 */
export const bulkDeleteTestimonial = async (ids: string[]) => {
  const data = {
    testimonialIds: ids,
  };
  const response = await adminAxiosInstance.post(
    API_ENDPOINTS.BULK_DELETE_TESTIMONIAL,
    data,
  );

  return response.data;
};
