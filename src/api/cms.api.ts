import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import type { TFaqForm } from "@/components/faq/FaqForm";
import { ADMIN_SERVICE_URL, API_ENDPOINTS } from "@/lib/api-endpoints";
import {
  default as adminAxiosInstance,
  default as axiosInstance,
} from "@/utils/axiosInstance";

/**
 * ============================================
 * CMS API Module
 * ============================================
 * FAQ, News, Testimonials, Partners, Tags, Meta Keywords API calls consolidated
 */

// ============================================
// FAQ OPERATIONS
// ============================================

/**
 * Fetch all FAQs (mobile app)
 */
export const getAllFAQs = async (page?: number, limit?: number) => {
  const params: Record<string, number> = {};
  if (page) params.page = page;
  if (limit) params.limit = limit;

  try {
    const response = await adminAxiosInstance.get(API_ENDPOINTS.GET_ALL_FAQ, {
      params,
    });

    return response.data?.data;
  } catch (error) {
    if (error instanceof AxiosError && error?.status === 400) {
      return [];
    }
    throw error;
  }
};

/**
 * Hook to fetch all FAQs (mobile app)
 */
export const useFetchAllFAQs = ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  return useQuery({
    queryKey: ["faqs", page, limit],
    queryFn: () => getAllFAQs(page, limit),
    refetchOnWindowFocus: false,
    retry: false,
  });
};

/**
 * Fetch FAQs grouped for CMS pages (no pagination)
 */
export const getCmsFaqContent = async () => {
  try {
    const response = await adminAxiosInstance.get(
      API_ENDPOINTS.GET_ALL_CMS_FAQ,
    );
    return response.data?.data;
  } catch (error) {
    if (error instanceof AxiosError && error?.status === 400) {
      return null;
    }
    throw error;
  }
};

/**
 * Hook to fetch FAQs grouped for CMS pages (no pagination)
 */
export const useFetchCmsFaqContent = () => {
  return useQuery({
    queryKey: ["cms-faqs-content"],
    queryFn: () => getCmsFaqContent(),
    refetchOnWindowFocus: false,
    retry: false,
  });
};

/**
 * Fetch all FAQs (CMS pages)
 */
export const getAllCmsFAQs = async (page?: number, limit?: number) => {
  const params: Record<string, number> = {};
  if (page) params.page = page;
  if (limit) params.limit = limit;

  try {
    const response = await adminAxiosInstance.get(
      API_ENDPOINTS.GET_ALL_CMS_FAQ,
      {
        params,
      },
    );

    return response.data?.data;
  } catch (error) {
    if (error instanceof AxiosError && error?.status === 400) {
      return [];
    }
    throw error;
  }
};

/**
 * Hook to fetch all FAQs (CMS pages)
 */
export const useFetchAllCmsFAQs = ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  return useQuery({
    queryKey: ["cms-faqs", page, limit],
    queryFn: () => getAllCmsFAQs(page, limit),
    refetchOnWindowFocus: false,
    retry: false,
  });
};

/**
 * Fetch FAQ by ID
 */
export const getFAQById = async (id: string) => {
  const response = await adminAxiosInstance.get(
    API_ENDPOINTS.GET_FAQ_BY_ID.replace(":id", id),
  );
  return response.data?.data;
};

/**
 * Hook to fetch FAQ by ID
 */
export const useFetchFAQById = (id: string) => {
  return useQuery({
    queryKey: ["faqById", { id }],
    queryFn: () => getFAQById(id),
    refetchOnWindowFocus: false,
    retry: false,
  });
};

/**
 * Create FAQ
 */
export const createFAQ = async (data: TFaqForm) => {
  const response = await adminAxiosInstance.post(
    API_ENDPOINTS.CREATE_FAQ,
    data,
  );

  return response.data?.data;
};

/**
 * Edit FAQ
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
 * Delete FAQ
 */
export const deleteFAQById = async (id: string) => {
  const response = await adminAxiosInstance.delete(
    API_ENDPOINTS.DELETE_FAQ.replace(":id", id),
  );

  return response.data;
};

/**
 * Bulk delete FAQs
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

// ============================================
// NEWS OPERATIONS
// ============================================

/**
 * Fetch all news
 */
export const getNews = async (page?: number, limit?: number) => {
  const params: Record<string, number> = {};
  if (page) params.page = page;
  if (limit) params.limit = limit;

  try {
    const response = await adminAxiosInstance.get(API_ENDPOINTS.GET_ALL_NEWS, {
      params,
    });

    return response.data?.data;
  } catch (error) {
    if (error instanceof AxiosError && error?.status === 400) {
      return [];
    }
    throw error;
  }
};

/**
 * Hook to fetch all news
 */
export const useFetchAllNews = ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  return useQuery({
    queryKey: ["news", page, limit],
    queryFn: () => getNews(page, limit),
    refetchOnWindowFocus: false,
    retry: false,
  });
};

/**
 * Fetch news by ID
 */
export const getNewsById = async (id: string) => {
  const response = await adminAxiosInstance.get(
    API_ENDPOINTS.GET_NEWS_BY_ID.replace(":id", id),
  );
  return response.data?.data;
};

/**
 * Hook to fetch news by ID
 */
export const useFetchNewsById = (id: string) => {
  return useQuery({
    queryKey: ["newsById", { id }],
    queryFn: () => getNewsById(id),
    refetchOnWindowFocus: false,
    retry: false,
  });
};

/**
 * Create news
 */
export const createNews = async (data: { body: string }) => {
  const response = await adminAxiosInstance.post(
    API_ENDPOINTS.CREATE_NEWS,
    data,
  );

  return response.data?.data;
};

/**
 * Edit news
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
 * Delete news
 */
export const deleteNewsById = async (id: string) => {
  const response = await adminAxiosInstance.delete(
    API_ENDPOINTS.DELETE_NEWS.replace(":id", id),
  );

  return response.data;
};

/**
 * Bulk delete news
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

// ============================================
// TESTIMONIAL OPERATIONS
// ============================================

/**
 * Fetch all testimonials
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

    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError && error?.status === 400) {
      return [];
    }
    throw error;
  }
};

/**
 * Hook to fetch all testimonials
 */
export const useFetchAllTestimonials = ({
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
    retry: false,
  });

/**
 * Fetch testimonial by ID
 */
export const getTestimonialById = async (id: string) => {
  const response = await adminAxiosInstance.get(
    `${API_ENDPOINTS.GET_TESTIMONIAL_BY_ID.replace(":id", id)}`,
  );
  return response?.data?.data;
};

/**
 * Hook to fetch testimonial by ID
 */
export const useFetchTestimonialById = ({ id }: { id: string }) =>
  useQuery({
    queryKey: ["testimonialById", id],
    queryFn: () => getTestimonialById(id),
    refetchOnWindowFocus: false,
    retry: false,
  });

/**
 * Create testimonial
 */
export const createTestimonial = async (data: FormData) => {
  const response = await adminAxiosInstance.post(
    API_ENDPOINTS.CREATE_TESTIMONIAL,
    data,
  );

  return response.data;
};

/**
 * Edit testimonial
 */
export const editTestimonial = async ({
  data,
  id,
}: {
  data: FormData;
  id: string;
}) => {
  const response = await adminAxiosInstance.put(
    API_ENDPOINTS.EDIT_TESTIMONIAL.replace(":id", id),
    data,
  );

  return response.data;
};

/**
 * Delete testimonial
 */
export const deleteTestimonial = async (id: string) => {
  const response = await adminAxiosInstance.delete(
    API_ENDPOINTS.DELETE_TESTIMONIAL.replace(":id", id),
  );

  return response.data;
};

/**
 * Bulk delete testimonials
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

// ============================================
// TAGS OPERATIONS
// ============================================

/**
 * Fetch all tags
 */
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

/**
 * Hook to fetch all tags
 */
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

/**
 * Fetch tag by ID
 */
export const getTagById = async (id: string) => {
  const response = await axiosInstance.get(API_ENDPOINTS.TAG.GET_BY_ID(id));
  return response?.data?.data;
};

/**
 * Hook to fetch tag by ID
 */
export const useFetchTagById = ({ id }: { id: string }) =>
  useQuery({
    queryKey: ["tagById", id],
    queryFn: () => getTagById(id),
    refetchOnWindowFocus: false,
    retry: false,
  });

/**
 * Create tag
 */
export const createTag = async (data: unknown) => {
  const response = await axiosInstance.post(API_ENDPOINTS.TAG.CREATE, data);
  return response.data;
};

/**
 * Update tag
 */
export const updateTag = async (id: string, data: unknown) => {
  const response = await axiosInstance.patch(
    API_ENDPOINTS.TAG.UPDATE(id),
    data,
  );
  return response.data;
};

/**
 * Delete tag
 */
export const deleteTag = async (id: string) => {
  const response = await axiosInstance.delete(API_ENDPOINTS.TAG.DELETE(id));
  return response.data;
};

/**
 * Bulk delete tags
 */
export const bulkDeleteTags = async (ids: string[]) => {
  const endpoint = `${ADMIN_SERVICE_URL}/tags/bulk-delete`;
  const response = await axiosInstance.post(endpoint, { ids });
  return response.data;
};

// ============================================
// META KEYWORDS OPERATIONS
// ============================================

/**
 * Fetch all meta keywords
 */
export const getAllMetaKeywords = async (
  params?: Record<string, unknown>,
  page?: number,
) => {
  const query: Record<string, unknown> = {};
  if (params) Object.assign(query, params);
  if (page) query.page = page;

  try {
    const response = await axiosInstance.get(
      API_ENDPOINTS.META_KEY_WORD.GET_ALL,
      { params: query },
    );
    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError && (error as any)?.status === 400) {
      return [];
    }
    throw error;
  }
};

/**
 * Hook to fetch all meta keywords
 */
export const useFetchAllMetaKeywords = ({
  params,
  page,
}: {
  params?: Record<string, unknown>;
  page?: number;
}) =>
  useQuery({
    queryKey: ["metaKeywords", params, page],
    queryFn: () => getAllMetaKeywords(params, page),
    refetchOnWindowFocus: false,
    retry: false,
  });

/**
 * Fetch meta keyword by ID
 */
export const getMetaKeywordById = async (id: string) => {
  const response = await axiosInstance.get(
    API_ENDPOINTS.META_KEY_WORD.GET_BY_ID(id),
  );
  return response?.data?.data;
};

/**
 * Hook to fetch meta keyword by ID
 */
export const useFetchMetaKeywordById = ({ id }: { id: string }) =>
  useQuery({
    queryKey: ["metaKeywordById", id],
    queryFn: () => getMetaKeywordById(id),
    refetchOnWindowFocus: false,
    retry: false,
  });

/**
 * Create meta keyword
 */
export const createMetaKeyword = async (data: unknown) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.META_KEY_WORD.CREATE,
    data,
  );
  return response.data;
};

/**
 * Update meta keyword
 */
export const updateMetaKeyword = async (id: string, data: unknown) => {
  const response = await axiosInstance.patch(
    API_ENDPOINTS.META_KEY_WORD.UPDATE(id),
    data,
  );
  return response.data;
};

/**
 * Delete meta keyword
 */
export const deleteMetaKeyword = async (id: string) => {
  const response = await axiosInstance.delete(
    API_ENDPOINTS.META_KEY_WORD.DELETE(id),
  );
  return response.data;
};

/**
 * Bulk delete meta keywords
 */
export const bulkDeleteMetaKeywords = async (ids: string[]) => {
  const endpoint = `${ADMIN_SERVICE_URL}/meta-keywords/bulk-delete`;
  const response = await axiosInstance.post(endpoint, { ids });
  return response.data;
};
