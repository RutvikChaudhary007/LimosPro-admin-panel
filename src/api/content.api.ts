import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { queryKeys } from "@/lib/queryKeys";
import type {
  ApiResponse,
  BlogPost,
  BlogQueryParams,
  MediaLibrary,
  MediaQueryParams,
  MediaUploadFormData,
  PaginatedResponse,
} from "@/types/content";
import adminAxiosInstance from "@/utils/axiosInstance";

/**
 * ============================================
 * Content API Module
 * ============================================
 * Blog, Media Library, and Content Blocks API calls consolidated
 */

// Utility function to build query string
const buildQueryString = (params: Record<string, unknown>): string => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, value.toString());
    }
  });
  return queryParams.toString();
};

// ============================================
// BLOG OPERATIONS
// ============================================

/**
 * Blog service with all blog-related operations
 */
export const blogService = {
  getAll: async (
    params: BlogQueryParams = {},
  ): Promise<PaginatedResponse<BlogPost>> => {
    const queryString = buildQueryString(params as Record<string, unknown>);
    const url = queryString
      ? `${API_ENDPOINTS.BLOG.GET_ALL}?${queryString}`
      : API_ENDPOINTS.BLOG.GET_ALL;

    try {
      const response = await adminAxiosInstance.get(url);

      if (response.data?.data?.pagination && response?.data?.data?.posts) {
        return {
          data: response.data.data.posts,
          pagination: response.data.data.pagination,
          stats: response.data.data.stats,
        };
      }

      return {
        data: response.data?.data?.posts ?? response.data?.data ?? [],
        pagination: response.data?.data?.pagination ?? {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
        stats: response.data?.data?.stats,
      };
    } catch (error) {
      console.error("❌ Blog API Error:", error);
      throw error;
    }
  },

  getById: async (id: string): Promise<ApiResponse<BlogPost>> => {
    const response = await adminAxiosInstance.get(
      API_ENDPOINTS.BLOG.GET_BY_ID(id),
    );
    return response?.data;
  },

  create: async (data: FormData): Promise<ApiResponse<BlogPost>> => {
    const response = await adminAxiosInstance.post(
      API_ENDPOINTS.BLOG.CREATE,
      data,
    );
    return response?.data;
  },

  update: async (
    id: string,
    data: FormData,
  ): Promise<ApiResponse<BlogPost>> => {
    const response = await adminAxiosInstance.put(
      API_ENDPOINTS.BLOG.UPDATE(id),
      data,
    );
    return response?.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await adminAxiosInstance.delete(
      API_ENDPOINTS.BLOG.DELETE(id),
    );
    return response?.data;
  },

  getStats: async (): Promise<ApiResponse<unknown>> => {
    const response = await adminAxiosInstance.get(API_ENDPOINTS.BLOG.GET_STATS);
    return response?.data;
  },
};

/**
 * Hook to fetch all blog posts
 */
export const useFetchAllBlogPosts = () =>
  useQuery({
    queryKey: queryKeys.blog.lists(),
    queryFn: () => blogService.getAll(),
    refetchOnWindowFocus: false,
    retry: false,
  });

// ============================================
// MEDIA LIBRARY OPERATIONS
// ============================================

/**
 * Media service with all media-related operations
 */
export const mediaService = {
  getAll: async (
    params: MediaQueryParams = {},
  ): Promise<PaginatedResponse<MediaLibrary>> => {
    const queryString = buildQueryString(params as Record<string, unknown>);
    const url = queryString
      ? `${API_ENDPOINTS.MEDIA.GET_ALL}?${queryString}`
      : API_ENDPOINTS.MEDIA.GET_ALL;

    try {
      const response = await adminAxiosInstance.get(url);

      if (response?.data?.data?.pagination && response?.data?.data?.media) {
        return {
          data: response.data.data.media || [],
          pagination: response.data.data.pagination || {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
          },
        };
      }

      return {
        data: response?.data?.data || [],
        pagination: response?.data?.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      };
    } catch (error) {
      console.error("❌ Media API Error:", error);
      throw error;
    }
  },

  getById: async (id: string): Promise<ApiResponse<MediaLibrary>> => {
    const response = await adminAxiosInstance.get(
      API_ENDPOINTS.MEDIA.GET_BY_ID(id),
    );
    return response?.data || {};
  },

  getByCategory: async (
    category: string,
  ): Promise<ApiResponse<MediaLibrary[]>> => {
    const response = await adminAxiosInstance.get(
      API_ENDPOINTS.MEDIA.GET_BY_CATEGORY(category),
    );
    return response?.data || [];
  },

  upload: async (
    data: MediaUploadFormData,
  ): Promise<ApiResponse<MediaLibrary>> => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", data.file);
    if (data.category) formData.append("category", data.category);
    if (data.folder) formData.append("folder", data.folder);
    if (data.alt) formData.append("alt", data.alt);
    if (data.caption) formData.append("caption", data.caption);

    const response = await fetch(API_ENDPOINTS.MEDIA.UPLOAD, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  uploadMultiple: async (
    files: File[],
    category?: string,
    folder?: string,
  ): Promise<ApiResponse<MediaLibrary[]>> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    if (category) formData.append("category", category);
    if (folder) formData.append("folder", folder);

    const response = await adminAxiosInstance.post(
      API_ENDPOINTS.MEDIA.UPLOAD_MULTIPLE,
      formData,
    );

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.data || [];
  },

  update: async (
    id: string,
    data: Partial<MediaLibrary>,
  ): Promise<ApiResponse<MediaLibrary>> => {
    const response = await adminAxiosInstance.put(
      API_ENDPOINTS.MEDIA.UPDATE(id),
      data,
    );
    return response?.data || {};
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await adminAxiosInstance.delete(
      API_ENDPOINTS.MEDIA.DELETE(id),
    );
    return response?.data || {};
  },

  getStats: async (): Promise<ApiResponse<unknown>> => {
    const response = await adminAxiosInstance.get(
      API_ENDPOINTS.MEDIA.GET_STATS,
    );
    return response?.data || {};
  },
};

// ============================================
// CONTENT BLOCK OPERATIONS
// ============================================

type TPara = { limit: number; page?: number };

/**
 * Fetch all content block tabs
 */
export const getPageContentBlockTab = async () => {
  const response = await adminAxiosInstance.get(
    `${API_ENDPOINTS.CONTENT_BLOCK.GET_TABS}`,
  );

  return response.data.data;
};

/**
 * Hook to fetch content block tabs
 */
export const useFetchPageContentBlockTab = () =>
  useQuery({
    queryKey: queryKeys.contentBlock.tabs(),
    queryFn: () => getPageContentBlockTab(),
    refetchOnWindowFocus: false,
    retry: false,
  });

/**
 * Fetch all content blocks
 */
export const getAllContentBlock = async (data?: TPara) => {
  const params: Record<string, unknown> = {};
  if (data?.limit) {
    params.limit = data.limit;
  }
  if (data?.page) {
    params.page = data.page;
  }
  const response = await adminAxiosInstance.get(
    `${API_ENDPOINTS.CONTENT_BLOCK.GET_ALL}`,
    { params },
  );

  return response.data.data;
};

/**
 * Hook to fetch all content blocks
 */
export const useFetchAllContentBlock = (Data: TPara) =>
  useQuery({
    queryKey: queryKeys.contentBlock.listParams(Data),
    queryFn: () => getAllContentBlock(Data),
    refetchOnWindowFocus: false,
    retry: false,
  });

/**
 * Fetch single content block by ID
 */
export const getSingleContentBlock = async (id: string) => {
  const response = await adminAxiosInstance.get(
    `${API_ENDPOINTS.CONTENT_BLOCK.GET_BY_ID.replace(":id", id)}`,
  );

  return response?.data?.data;
};

/**
 * Hook to fetch content block by ID
 */
export const useFetchContentBlockById = (id: string) =>
  useQuery({
    queryKey: queryKeys.contentBlock.detail(id),
    queryFn: () => getSingleContentBlock(id),
    refetchOnWindowFocus: false,
    retry: false,
  });

/**
 * Create content block
 */
export const createContentBlock = async (data: unknown) => {
  try {
    const response = await adminAxiosInstance.post(
      `${API_ENDPOINTS.CONTENT_BLOCK.CREATE}`,
      data,
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError)
      console.error(error.message || "Opps! An unkown error occured");
    throw error;
  }
};

/**
 * Edit content block
 */
export const editContentBlock = async ({
  id,
  data,
}: {
  id: string;
  data: unknown;
}) => {
  try {
    const response = await adminAxiosInstance.put(
      `${API_ENDPOINTS.CONTENT_BLOCK.UPDATE.replace(":id", id)}`,
      data,
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError)
      console.error(error.message || "Opps! An unkown error occured");
    throw error;
  }
};

/**
 * Delete content block
 */
export const deleteContentBlock = async (id: string) => {
  try {
    const response = await adminAxiosInstance.delete(
      `${API_ENDPOINTS.CONTENT_BLOCK.DELETE.replace(":id", id)}`,
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError)
      console.error(error.message || "Opps! An unkown error occured");
    throw error;
  }
};
