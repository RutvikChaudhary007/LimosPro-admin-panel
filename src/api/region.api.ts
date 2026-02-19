import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import type { TRegion } from "@/components/regionManagement/region/RegionForm";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { queryKeys } from "@/lib/queryKeys";
import axiosInstance from "@/utils/axiosInstance";

/**
 * ============================================
 * Region API Module
 * ============================================
 * All region and region admin API calls consolidated
 */

type TPara = { limit?: number; page?: number };

// ============================================
// REGION OPERATIONS
// ============================================

/**
 * Fetch all regions
 */
export const getAllRegions = async (data?: TPara) => {
  try {
    const params: Record<string, unknown> = {};
    if (data?.page) {
      params.page = data.page;
    }
    if (data?.limit) {
      params.limit = data.limit;
    }
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.GET_ALL_REGIONS}`,
      {
        params,
      },
    );

    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 400) {
      return { regions: [], pagination: { totalItems: 0, totalPages: 0 } };
    }
    throw error;
  }
};

/**
 * Hook to fetch all regions
 */
export const useFetchAllRegions = (Data: TPara) =>
  useQuery({
    queryKey: queryKeys.region.listParams(Data),
    queryFn: () => getAllRegions(Data),
    refetchOnWindowFocus: false,
    retry: false,
  });

/**
 * Fetch region by ID
 */
export const getSingleRegions = async (id: string) => {
  const response = await axiosInstance.get(
    `${API_ENDPOINTS.GET_REGION_BY_ID.replace(":region_id", id)}`,
  );

  return response?.data?.data;
};

/**
 * Hook to fetch region by ID
 */
export const useFetchRegionById = (id: string) =>
  useQuery({
    queryKey: queryKeys.region.detail(id),
    queryFn: () => getSingleRegions(id),
    refetchOnWindowFocus: false,
    retry: false,
  });

/**
 * Create region
 */
export const createRegion = async (data: TRegion) => {
  try {
    const response = await axiosInstance.post(
      `${API_ENDPOINTS.CREATE_REGION}`,
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
 * Edit region
 */
export const editRegion = async ({
  id,
  data,
}: {
  id: string;
  data: TRegion;
}) => {
  try {
    const response = await axiosInstance.put(
      `${API_ENDPOINTS.EDIT_REGION.replace(":regionId", id)}`,
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
 * Delete region
 */
export const deleteRegion = async (id: string) => {
  try {
    const response = await axiosInstance.delete(
      `${API_ENDPOINTS.DELETE_REGION.replace(":regionId", id)}`,
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError)
      console.error(error.message || "Opps! An unkown error occured");
    throw error;
  }
};

/**
 * Bulk delete regions
 */
export const bulkDeleteRegions = async (regionIds: string[]) => {
  try {
    const response = await axiosInstance.post(
      `${API_ENDPOINTS.BULK_DELETE_REGION}`,
      { regionIds },
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError)
      console.error(error.message || "Opps! An unkown error occured");
    throw error;
  }
};

// ============================================
// REGION ADMIN OPERATIONS
// ============================================

/**
 * Fetch all region admins
 */
export const getAllRegionAdmins = async (data?: TPara) => {
  try {
    const params: Record<string, unknown> = {};
    if (data?.limit) {
      params.limit = data.limit;
    }
    if (data?.page) {
      params.page = data.page;
    }
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.REGIONAL_ADMIN.GET_ALL}`,
      { params },
    );

    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 400) {
      return {
        regionalAdmins: [],
        pagination: { totalItems: 0, totalPages: 0 },
      };
    }
    throw error;
  }
};

/**
 * Hook to fetch all region admins
 */
export const useFetchAllRegionAdmins = (Data: TPara) =>
  useQuery({
    queryKey: queryKeys.regionalAdmin.listParams(Data),
    queryFn: () => getAllRegionAdmins(Data),
    refetchOnWindowFocus: false,
    retry: false,
  });

/**
 * Fetch region admin by ID
 */
export const getSingleRegionAdmin = async (id: string) => {
  const response = await axiosInstance.get(
    `${API_ENDPOINTS.REGIONAL_ADMIN.GET_ONE.replace(":id", id)}`,
  );

  return response?.data?.data;
};

/**
 * Hook to fetch region admin by ID
 */
export const useFetchRegionAdminById = (id: string) =>
  useQuery({
    queryKey: queryKeys.regionalAdmin.detail(id),
    queryFn: () => getSingleRegionAdmin(id),
    refetchOnWindowFocus: false,
    retry: false,
  });

/**
 * Create region admin
 */
export const createRegionAdmin = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  region?: string;
  password: string;
}) => {
  try {
    if (data?.region) {
      const regionId = data.region;
      delete data.region;
      const response = await axiosInstance.post(
        `${API_ENDPOINTS.REGIONAL_ADMIN.CREATE?.replace(":regionId", regionId)}`,
        data,
      );
      return response.data;
    } else {
      throw new Error("Region id is missing.");
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(error.message || "Opps! An unkown error occured");
    }
    throw error;
  }
};

/**
 * Edit region admin
 */
export const editRegionAdmin = async ({
  id,
  data,
}: {
  id: string;
  data: TRegion;
}) => {
  try {
    const regionId = (data as any)?.region;
    if (!regionId) throw new Error("Region id is missing.");
    const payload = { ...(data as any) };
    delete (payload as any).region;

    const response = await axiosInstance.patch(
      `${API_ENDPOINTS.REGIONAL_ADMIN.EDIT.replace(":id", id).replace(
        ":regionId",
        regionId,
      )}`,
      payload,
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError)
      console.error(error.message || "Opps! An unkown error occured");
    throw error;
  }
};

/**
 * Delete region admin
 */
export const deleteRegionAdmin = async (id: string) => {
  try {
    const response = await axiosInstance.delete(
      `${API_ENDPOINTS.REGIONAL_ADMIN.DELETE.replace(":id", id)}`,
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError)
      console.error(error.message || "Opps! An unkown error occured");
    throw error;
  }
};

/**
 * Bulk delete region admins
 */
export const bulkDeleteRegionAdmins = async (regionalAdminIds: string[]) => {
  try {
    const response = await axiosInstance.post(
      `${API_ENDPOINTS.REGIONAL_ADMIN.BULK_DELETE}`,
      { regionalAdminIds },
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError)
      console.error(error.message || "Opps! An unkown error occured");
    throw error;
  }
};
