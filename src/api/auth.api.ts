import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { tokenManager } from "@/services/tokenManager";
import axiosInstance from "@/utils/axiosInstance";

/**
 * ============================================
 * Auth API Module
 * ============================================
 * Authentication, permissions, roles, and dashboard API calls consolidated
 */

type DateRange = { startDate?: Date | undefined; endDate?: Date | undefined };
type TPara = { limit: number };

// ============================================
// LOGIN OPERATIONS
// ============================================

/**
 * Login user
 */
export const login = async (data: { email: string; password: string }) => {
  const response = await axios.post(API_ENDPOINTS.LOG_IN, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response?.data?.data) {
    const access = response.data.data.accessToken;
    const refresh = response.data.data.refreshToken;
    if (access && refresh) tokenManager.setTokens(access, refresh);
    const roles = response.data.data.roles;
    const primaryRole = Array.isArray(roles) ? roles[0] : roles;
    if (primaryRole) {
      localStorage.setItem("role", primaryRole);
    }

    const userData = { ...response.data.data };
    if (!userData.role && roles) {
      userData.role = Array.isArray(roles) ? roles[0] : roles;
    }
    localStorage.setItem("user", JSON.stringify(userData));

    // Store permissions from login response
    if (response?.data?.data?.permissions) {
      localStorage.setItem(
        "permissions",
        JSON.stringify(response.data.data.permissions),
      );
    }
  }
  return response.data;
};

// ============================================
// PERMISSIONS OPERATIONS
// ============================================

/**
 * Fetch all permissions
 */
export const getAllPermissions = async (data?: TPara) => {
  const params: Record<string, unknown> = {};
  if (data?.limit) {
    params.limit = data.limit;
  }
  const response = await axiosInstance.get(
    `${API_ENDPOINTS.PERSMISSIONS.GET_ALL}`,
    { params },
  );

  return response.data.data;
};

/**
 * Hook to fetch all permissions
 */
export const useFetchAllPermissions = (Data: TPara, options?: any) =>
  useQuery({
    queryKey: ["Permissions", Data],
    queryFn: () => getAllPermissions(Data),
    refetchOnWindowFocus: false,
    retry: false,
    ...options,
  });

// ============================================
// ROLES OPERATIONS
// ============================================

/**
 * Fetch all staff roles
 */
export const getAllStaffRoles = async () => {
  const params: Record<string, unknown> = {};

  const response = await axiosInstance.get(
    `${API_ENDPOINTS.ROLES.GET_ALL_STAFF_ROLE}`,
    { params },
  );

  return response.data.data;
};

/**
 * Hook to fetch all staff roles
 */
export const useFetchAllStaffRoles = () =>
  useQuery({
    queryKey: ["Roles"],
    queryFn: () => getAllStaffRoles(),
    refetchOnWindowFocus: false,
    retry: false,
  });

// ============================================
// DASHBOARD OPERATIONS
// ============================================

/**
 * Fetch dashboard details
 */
export const getDashboard = async (DateRange?: DateRange, page?: number) => {
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

  if (page) {
    params.page = page;
  }

  try {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.GET_DASHBOARD_DETAILS}`,
      { params },
    );
    return response?.data?.data;
  } catch (error) {
    if (error instanceof AxiosError && error?.status === 400) {
      return [];
    }
    throw error;
  }
};

/**
 * Hook to fetch dashboard details
 */
export const useFetchDashboard = ({
  DateRange,
  page,
}: {
  DateRange?: { startDate: Date | undefined; endDate: Date | undefined };
  page?: number;
}) =>
  useQuery({
    queryKey: [
      "Dashboard",
      DateRange?.startDate?.toISOString(),
      DateRange?.endDate?.toISOString(),
      page,
    ],
    queryFn: () => getDashboard(DateRange, page),
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 0,
    gcTime: 0,
  });
