import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import type { TChauffeurForm } from "@/components/chauffeur/ChauffeurForm";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import axiosInstance from "@/utils/axiosInstance";

/**
 * ============================================
 * Chauffeur API Module
 * ============================================
 * All chauffeur-related API calls consolidated
 */

type DateRange = { startDate?: Date | undefined; endDate?: Date | undefined };

// ============================================
// GET OPERATIONS
// ============================================

/**
 * Fetch all chauffeurs with optional filters
 */
export const getAllChauffeur = async (
  DateRange?: DateRange,
  page?: number,
  limit?: number,
  status?: string,
) => {
  const params: Record<string, unknown> = {};
  if (DateRange?.startDate || DateRange?.endDate) {
    if (DateRange.startDate) {
      params.startDate = new Date(DateRange.startDate).toISOString();
    }
    if (DateRange.endDate) {
      params.endDate = new Date(DateRange.endDate).toISOString();
    }
  }

  if (page) {
    params.page = page;
  }

  if (limit) {
    params.limit = limit;
  }

  if (status) {
    params.status = status;
  }

  try {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.GET_ALL_CHAUFFEUR}`,
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
 * Hook to fetch all chauffeurs
 */
export const useFetchAllChauffeur = ({
  DateRange,
  page,
  limit,
  status,
}: {
  DateRange?: { startDate: Date | undefined; endDate: Date | undefined };
  page?: number;
  limit?: number;
  status?: string;
}) =>
  useQuery({
    queryKey: ["chauffeurs", DateRange, page, limit, status],
    queryFn: () => getAllChauffeur(DateRange, page, limit, status),
    refetchOnWindowFocus: false,
    retry: false,
  });

/**
 * Fetch chauffeur by ID
 */
export const getChauffeurById = async (id: string) => {
  const response = await axiosInstance.get(
    `${API_ENDPOINTS.GET_CHAUFFEUR_BY_ID.replace(":id", id)}`,
  );
  return response?.data?.data;
};

/**
 * Hook to fetch chauffeur by ID
 */
export const useFetchChauffeurById = ({ id }: { id: string }) =>
  useQuery({
    queryKey: ["chauffeurById", id],
    queryFn: () => getChauffeurById(id),
    refetchOnWindowFocus: false,
    retry: false,
  });

// ============================================
// CREATE OPERATIONS
// ============================================

/**
 * Create a new chauffeur
 */
export const createChauffeur = async (data: TChauffeurForm) => {
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

// ============================================
// UPDATE OPERATIONS
// ============================================

/**
 * Edit chauffeur by ID
 */
export const editChauffeur = async ({
  data,
  id,
}: {
  data: TChauffeurForm;
  id: string;
}) => {
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

// ============================================
// DELETE OPERATIONS
// ============================================

/**
 * Delete a single chauffeur
 */
export const deleteChauffeur = async (id: string) => {
  const response = await axiosInstance.delete(
    API_ENDPOINTS.DELETE_CHAFFEUR.replace(":id", id),
  );

  return response.data;
};

/**
 * Bulk delete chauffeurs
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
