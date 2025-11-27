// @ts-nocheck

import { useQuery } from "@tanstack/react-query";
import adminAxiosInstance from "@/utils/axiosInstance";
import { API_ENDPOINTS } from "../lib/api-endpoints";
import type {
  ApiResponse,
  BlogPost,
  BlogPostFormData,
  BlogQueryParams,
  // ContentBlock,
  // PageTemplate,
  MediaLibrary,
  // ContentBlockQueryParams,
  MediaQueryParams,
  // ContentBlockFormData,
  // PageTemplateFormData,
  MediaUploadFormData,
  // PageTemplateQueryParams,
  PaginatedResponse,
} from "../types/content";

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

// Utility function for making authenticated requests
// const authFetch = async (url: string, options: RequestInit = {}) => {
//   const token = localStorage.getItem('token');
//   const headers = {
//     'Content-Type': 'application/json',
//     ...(token && { Authorization: `Bearer ${token}` }),
//     ...options.headers,
//   };

//   // console.log('🌐 Making API Request:', url);

//   try {
//     const response = await fetch(url, {
//       ...options,
//       headers,
//     });

//     // console.log('📡 Response Status:', response.status);

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error('❌ Response Error:', {
//         status: response.status,
//         statusText: response.statusText,
//         body: errorText
//       });
//       throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error('🚨 Fetch Error:', error);
//     throw error;
//   }
// };

// Blog API Services
export const blogService = {
  // Get all blog posts
  getAll: async (
    params: BlogQueryParams = {},
  ): Promise<PaginatedResponse<BlogPost>> => {
    const queryString = buildQueryString(params);
    const url = queryString
      ? `${API_ENDPOINTS.BLOG.GET_ALL}?${queryString}`
      : API_ENDPOINTS.BLOG.GET_ALL;

    try {
      const response = await adminAxiosInstance.get(url);

      // Handle backend response structure: { status, message, data: { posts, pagination } }
      if (response.data?.data?.pagination && response?.data?.data?.posts) {
        return {
          data: response.data?.data?.posts,
          pagination: response.data?.data?.pagination,
        };
      }

      // Fallback for different response structures
      return {
        data: response.data?.data || [],
        pagination: response.data?.data?.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      };
    } catch (error) {
      console.error("❌ Blog API Error:", error);
      throw error;
    }
  },

  // Get blog post by ID
  getById: async (id: string): Promise<ApiResponse<BlogPost>> => {
    const response = await adminAxiosInstance.get(
      API_ENDPOINTS.BLOG.GET_BY_ID(id),
    );
    return response?.data;
  },

  // Create new blog post
  create: async (data: FormData): Promise<ApiResponse<BlogPost>> => {
    const response = await adminAxiosInstance.post(
      API_ENDPOINTS.BLOG.CREATE,
      data,
    );
    return response?.data;
  },

  // Update blog post
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

  // Delete blog post
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await adminAxiosInstance.delete(
      API_ENDPOINTS.BLOG.DELETE(id),
    );
    return response?.data;
  },

  // Get blog statistics
  getStats: async (): Promise<ApiResponse<unknown>> => {
    const response = await adminAxiosInstance.get(API_ENDPOINTS.BLOG.GET_STATS);
    return response?.data;
  },
};

const useFetchAllBlogPosts = () =>
  useQuery({
    queryKey: ["blogPosts"],
    queryFn: () => blogService.getAll(),
    refetchOnWindowFocus: false,
    // refetchInterval: 60000,
    retry: false,
    // keepPreviousData: true, // for pagination
  });

export default useFetchAllBlogPosts;

// Content Blocks API Services
// export const contentBlockService = {
//   // Get all content blocks
//   getAll: async (params: ContentBlockQueryParams = {}): Promise<PaginatedResponse<ContentBlock>> => {
//     const queryString = buildQueryString(params);
//     const url = queryString ? `${API_ENDPOINTS.CONTENT_BLOCKS.GET_ALL}?${queryString}` : API_ENDPOINTS.CONTENT_BLOCKS.GET_ALL;

//     try {
//       const response = await authFetch(url);

//       // Handle backend response structure: { status, message, data: { blocks, pagination } }
//       if (response.data && response.data.blocks) {
//         return {
//           data: response.data.blocks,
//           pagination: response.data.pagination
//         };
//       }

//       // Fallback for different response structures
//       return {
//         data: response.data || [],
//         pagination: response.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 }
//       };
//     } catch (error) {
//       console.error('❌ Content Blocks API Error:', error);
//       throw error;
//     }
//   },

//   // Get content block by ID
//   getById: async (id: string): Promise<ApiResponse<ContentBlock>> => {
//     return authFetch(API_ENDPOINTS.CONTENT_BLOCKS.GET_BY_ID(id));
//   },

//   // Get content blocks by page name
//   getByPage: async (pageName: string): Promise<ApiResponse<ContentBlock[]>> => {
//     return authFetch(API_ENDPOINTS.CONTENT_BLOCKS.GET_BY_PAGE(pageName));
//   },

//   // Create new content block
//   create: async (data: ContentBlockFormData): Promise<ApiResponse<ContentBlock>> => {
//     return authFetch(API_ENDPOINTS.CONTENT_BLOCKS.CREATE, {
//       method: 'POST',
//       body: JSON.stringify(data),
//     });
//   },

//   // Update content block
//   update: async (id: string, data: Partial<ContentBlockFormData>): Promise<ApiResponse<ContentBlock>> => {
//     return authFetch(API_ENDPOINTS.CONTENT_BLOCKS.UPDATE(id), {
//       method: 'PUT',
//       body: JSON.stringify(data),
//     });
//   },

//   // Delete content block
//   delete: async (id: string): Promise<ApiResponse<void>> => {
//     return authFetch(API_ENDPOINTS.CONTENT_BLOCKS.DELETE(id), {
//       method: 'DELETE',
//     });
//   },

//   // Update content block order
//   updateOrder: async (blocks: { id: string; sortOrder: number }[]): Promise<ApiResponse<void>> => {
//     return authFetch(API_ENDPOINTS.CONTENT_BLOCKS.UPDATE_ORDER, {
//       method: 'PATCH',
//       body: JSON.stringify({ blocks }),
//     });
//   },

//   // Toggle content block status
//   toggleStatus: async (id: string): Promise<ApiResponse<ContentBlock>> => {
//     return authFetch(API_ENDPOINTS.CONTENT_BLOCKS.TOGGLE_STATUS(id), {
//       method: 'PATCH',
//     });
//   },
// };

// // Page Templates API Services
// export const pageTemplateService = {
//   // Get all page templates
//   getAll: async (params: PageTemplateQueryParams = {}): Promise<PaginatedResponse<PageTemplate>> => {
//     const queryString = buildQueryString(params);
//     const url = queryString ? `${API_ENDPOINTS.PAGE_TEMPLATES.GET_ALL}?${queryString}` : API_ENDPOINTS.PAGE_TEMPLATES.GET_ALL;

//     try {
//       const response = await authFetch(url);

//       // Handle backend response structure: { status, message, data: { templates, pagination } }
//       if (response.data && response.data.templates) {
//         return {
//           data: response.data.templates,
//           pagination: response.data.pagination
//         };
//       }

//       // Fallback for different response structures
//       return {
//         data: response.data || [],
//         pagination: response.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 }
//       };
//     } catch (error) {
//       console.error('❌ Page Templates API Error:', error);
//       throw error;
//     }
//   },

//   // Get page template by ID
//   getById: async (id: string): Promise<ApiResponse<PageTemplate>> => {
//     return authFetch(API_ENDPOINTS.PAGE_TEMPLATES.GET_BY_ID(id));
//   },

//   // Get page template by slug
//   getBySlug: async (slug: string): Promise<ApiResponse<PageTemplate>> => {
//     return authFetch(API_ENDPOINTS.PAGE_TEMPLATES.GET_BY_SLUG(slug));
//   },

//   // Create new page template
//   create: async (data: PageTemplateFormData): Promise<ApiResponse<PageTemplate>> => {
//     return authFetch(API_ENDPOINTS.PAGE_TEMPLATES.CREATE, {
//       method: 'POST',
//       body: JSON.stringify(data),
//     });
//   },

//   // Update page template
//   update: async (id: string, data: Partial<PageTemplateFormData>): Promise<ApiResponse<PageTemplate>> => {
//     return authFetch(API_ENDPOINTS.PAGE_TEMPLATES.UPDATE(id), {
//       method: 'PUT',
//       body: JSON.stringify(data),
//     });
//   },

//   // Delete page template
//   delete: async (id: string): Promise<ApiResponse<void>> => {
//     return authFetch(API_ENDPOINTS.PAGE_TEMPLATES.DELETE(id), {
//       method: 'DELETE',
//     });
//   },

//   // Toggle page template status
//   toggleStatus: async (id: string): Promise<ApiResponse<PageTemplate>> => {
//     return authFetch(API_ENDPOINTS.PAGE_TEMPLATES.TOGGLE_STATUS(id), {
//       method: 'PATCH',
//     });
//   },
// };

// // Media Library API Services
export const mediaService = {
  // Get all media
  getAll: async (
    params: MediaQueryParams = {},
  ): Promise<PaginatedResponse<MediaLibrary>> => {
    const queryString = buildQueryString(params);
    const url = queryString
      ? `${API_ENDPOINTS.MEDIA.GET_ALL}?${queryString}`
      : API_ENDPOINTS.MEDIA.GET_ALL;

    try {
      const response = await adminAxiosInstance.get(url);

      // Handle backend response structure: { status, message, data: { media, pagination } }
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

      // Fallback for different response structures
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

  // Get media by ID
  getById: async (id: string): Promise<ApiResponse<MediaLibrary>> => {
    const response = await adminAxiosInstance.get(
      API_ENDPOINTS.MEDIA.GET_BY_ID(id),
    );
    return response?.data || {};
  },

  // Get media by category
  getByCategory: async (
    category: string,
  ): Promise<ApiResponse<MediaLibrary[]>> => {
    const response = await adminAxiosInstance.get(
      API_ENDPOINTS.MEDIA.GET_BY_CATEGORY(category),
    );
    return response?.data || [];
  },

  // Upload single media file
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

  // Upload multiple media files
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

  // Update media
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

  // Delete media
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await adminAxiosInstance.delete(
      API_ENDPOINTS.MEDIA.DELETE(id),
    );
    return response?.data || {};
  },

  // Get media statistics
  getStats: async (): Promise<ApiResponse<unknown>> => {
    const response = await adminAxiosInstance.get(
      API_ENDPOINTS.MEDIA.GET_STATS,
    );
    return response?.data || {};
  },
};
