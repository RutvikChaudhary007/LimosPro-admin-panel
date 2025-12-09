import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import type { IUserFormData } from "@/types/user.type";
import axiosInstance from "@/utils/axiosInstance";

/**
 * ============================================
 * User API Module
 * ============================================
 * All user-related API calls consolidated
 */

type DateRange = { startDate?: Date; endDate?: Date };

// ============================================
// GET OPERATIONS
// ============================================

/**
 * Fetch all users with optional filters
 */
export const getAllUsers = async (
  DateRange: DateRange,
  page?: number,
  status?: string,
  limit?: number,
) => {
  const params: Record<string, unknown> = {};

  if (DateRange?.startDate || DateRange?.endDate) {
    params.DateRange = {
      startDate: DateRange.startDate
        ? new Date(DateRange.startDate).toISOString()
        : undefined,
      endDate: DateRange.endDate
        ? new Date(DateRange.endDate).toISOString()
        : undefined,
    };
  }

  if (page) params.page = page;
  if (status) params.status = status;
  if (limit) params.limit = limit;

  try {
    const response = await axiosInstance.get(API_ENDPOINTS.GET_ALL_USERS, {
      params,
    });

    return response?.data?.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 400) {
      return { users: [], pagination: {} };
    }
    if (isAxiosError(error)) throw error;
    throw new Error("An unexpected error occurred");
  }
};

/**
 * Hook to fetch all users
 */
export const useFetchAllUsers = ({
  DateRange,
  page,
  status,
  limit,
  queryOptions,
}: {
  DateRange: DateRange;
  page?: number;
  status?: string;
  limit?: number;
  queryOptions?: Record<string, any>;
}) =>
  useQuery({
    queryKey: ["users", DateRange, page, status, limit],
    queryFn: () => getAllUsers(DateRange, page, status, limit),
    refetchOnWindowFocus: false,
    retry: false,
    ...queryOptions,
  });

/**
 * Fetch user by ID (with Suspense)
 */
export const getUserById = async (id?: string) => {
  if (id) {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.GET_USERS_BY_ID.replace(":id", id)}`,
    );
    return response?.data?.data;
  }
};

/**
 * Hook to fetch user by ID (with Suspense)
 */
export const useFetchUserById = ({ id }: { id?: string }) =>
  useSuspenseQuery({
    queryKey: ["userById", id],
    queryFn: () => getUserById(id),
    refetchOnWindowFocus: false,
    retry: false,
  });

// ============================================
// UPDATE OPERATIONS
// ============================================

/**
 * Update user by ID
 */
export const updateUser = async (id: string, data: IUserFormData) => {
  const response = await axiosInstance.patch(
    API_ENDPOINTS.UPDATE_USER_BY_ID.replace(":id", id),
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  return response.data;
};

// ============================================
// DELETE OPERATIONS
// ============================================

/**
 * Delete a single user
 */
export const deleteUser = async (id: string) => {
  const response = await axiosInstance.delete(
    API_ENDPOINTS.DELETE_USERS.replace(":id", id),
  );

  return response.data;
};

/**
 * Bulk delete users
 */
export const bulkDeleteUser = async (ids: string[]) => {
  const data = {
    userIds: ids,
  };
  const response = await axiosInstance.post(
    API_ENDPOINTS.BULK_DELETE_USERS,
    data,
  );

  return response.data;
};
