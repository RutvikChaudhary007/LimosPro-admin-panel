import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { queryKeys } from "@/lib/queryKeys";
import axiosInstance from "@/utils/axiosInstance";

// Types
export type PermissionAction = {
  view: boolean;
  read: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
  bulkDelete: boolean;
  restore: boolean;
  export: boolean;
  import: boolean;
  approve: boolean;
  reject: boolean;
  assign: boolean;
  reassign: boolean;
  cancel: boolean;
  reschedule: boolean;
  viewAll: boolean;
  viewOwn: boolean;
  viewRegion: boolean;
  viewTeam: boolean;
  viewPricing: boolean;
  editPricing: boolean;
  applyDiscount: boolean;
  viewRevenue: boolean;
  issueRefund: boolean;
  manageSettings: boolean;
  managePermissions: boolean;
  impersonate: boolean;
  auditLogs: boolean;
  forceAction: boolean;
};

export interface UserPermission {
  id: string;
  permissionId: string;
  permissionName: string;
  actions: Partial<PermissionAction>;
  createdAt: string;
}

/**
 * Fetch all permissions for a user
 */
export const getUserPermissions = async (userId: string) => {
  const response = await axiosInstance.get(
    API_ENDPOINTS.USER_PERMISSIONS.GET_USER_PERMISSIONS.replace(
      ":userId",
      userId,
    ),
  );
  return response.data.data;
};

/**
 * Hook to fetch user permissions
 */
export const useFetchUserPermissions = (userId: string) =>
  useQuery({
    queryKey: queryKeys.userPermission.all(userId),
    queryFn: () => getUserPermissions(userId),
    enabled: !!userId,
    refetchOnWindowFocus: false,
  });

/**
 * Get all available permissions
 */
export const getUserAllPermissions = async () => {
  try {
    const response = await axiosInstance.get(
      API_ENDPOINTS.PERSMISSIONS.GET_ALL,
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
 * Hook to fetch all permissions
 */
export const useFetchUserAllPermissions = () =>
  useQuery({
    queryKey: queryKeys.userPermission.permissions(),
    queryFn: () => getUserAllPermissions(),
    refetchOnWindowFocus: false,
    retry: false,
  });

/**
 * Sync user permissions
 */
export const syncUserPermissions = async ({
  userId,
  permissionIds,
}: {
  userId: string;
  permissionIds: string[];
}) => {
  const response = await axiosInstance.put(
    API_ENDPOINTS.USER_PERMISSIONS.SYNC_USER_PERMISSIONS.replace(
      ":userId",
      userId,
    ),
    { permissionIds },
  );
  return response.data;
};

/**
 * Hook to sync user permissions
 */
export const useSyncUserPermissions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: syncUserPermissions,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.userPermission.all(variables.userId),
      });
    },
  });
};

/**
 * Update permission actions
 */
export const updatePermissionActions = async ({
  userId,
  permissionId,
  actions,
}: {
  userId: string;
  permissionId: string;
  actions: Partial<PermissionAction>;
}) => {
  const response = await axiosInstance.patch(
    API_ENDPOINTS.USER_PERMISSIONS.UPDATE_PERMISSION_ACTIONS.replace(
      ":userId",
      userId,
    ).replace(":permissionId", permissionId),
    { actions },
  );
  return response.data;
};

/**
 * Hook to update permission actions
 */
export const useUpdatePermissionActions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePermissionActions,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.userPermission.all(variables.userId),
      });
    },
  });
};

/**
 * Assign a permission to a user
 */
export const assignPermissionToUser = async ({
  userId,
  permissionId,
}: {
  userId: string;
  permissionId: string;
}) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.USER_PERMISSIONS.ASSIGN_PERMISSION.replace(":userId", userId),
    { permissionId },
  );
  return response.data;
};

/**
 * Hook to assign permission to user
 */
export const useAssignPermissionToUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assignPermissionToUser,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.userPermission.all(variables.userId),
      });
    },
  });
};

/**
 * Remove a permission from a user
 */
export const removePermissionFromUser = async ({
  userId,
  permissionId,
}: {
  userId: string;
  permissionId: string;
}) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.USER_PERMISSIONS.REMOVE_PERMISSION.replace(":userId", userId),
    { permissionId },
  );
  return response.data;
};

/**
 * Hook to remove permission from user
 */
export const useRemovePermissionFromUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removePermissionFromUser,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.userPermission.all(variables.userId),
      });
    },
  });
};
