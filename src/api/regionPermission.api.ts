import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { PermissionAction } from "@/api/userPermission.api";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import axiosInstance from "@/utils/axiosInstance";

export interface RegionPermission {
  id: string;
  regionName: string;
  permissionId: string;
  permissionName: string;
  actions: Partial<PermissionAction>;
  createdAt: string;
}

/**
 * Fetch all region permissions
 */
export const getRegionPermissions = async (regionId: string) => {
  const response = await axiosInstance.get(
    API_ENDPOINTS.REGION_PERMISSIONS.GET_REGION_PERMISSIONS.replace(
      ":regionId",
      regionId,
    ),
  );
  return response.data.data;
};

/**
 * Hook to fetch region permissions
 */
export const useFetchRegionPermissions = (regionId: string) =>
  useQuery({
    queryKey: ["regionPermissions", regionId],
    queryFn: () => getRegionPermissions(regionId),
    enabled: !!regionId,
    refetchOnWindowFocus: false,
  });

/**
 * Assign a permission to a region
 */
export const assignPermissionToRegion = async ({
  regionId,
  permissionId,
  actions = {},
}: {
  regionId: string;
  permissionId: string;
  actions?: Partial<PermissionAction>;
}) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.REGION_PERMISSIONS.ASSIGN_PERMISSION.replace(
      ":regionId",
      regionId,
    ),
    { permissionId, actions },
  );
  return response.data;
};

/**
 * Hook to assign permission to region
 */
export const useAssignPermissionToRegion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assignPermissionToRegion,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["regionPermissions", variables.regionId],
      });
    },
  });
};

/**
 * Update permission actions for a region
 */
export const updateRegionPermissionActions = async ({
  regionId,
  permissionId,
  actions,
}: {
  regionId: string;
  permissionId: string;
  actions: Partial<PermissionAction>;
}) => {
  const response = await axiosInstance.patch(
    API_ENDPOINTS.REGION_PERMISSIONS.UPDATE_PERMISSION_ACTIONS.replace(
      ":regionId",
      regionId,
    ).replace(":permissionId", permissionId),
    { actions },
  );
  return response.data;
};

/**
 * Hook to update region permission actions
 */
export const useUpdateRegionPermissionActions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateRegionPermissionActions,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["regionPermissions", variables.regionId],
      });
    },
  });
};

/**
 * Remove a permission from a region
 */
export const removePermissionFromRegion = async ({
  regionId,
  permissionId,
}: {
  regionId: string;
  permissionId: string;
}) => {
  const response = await axiosInstance.delete(
    API_ENDPOINTS.REGION_PERMISSIONS.REMOVE_PERMISSION.replace(
      ":regionId",
      regionId,
    ).replace(":permissionId", permissionId),
  );
  return response.data;
};

/**
 * Hook to remove permission from region
 */
export const useRemovePermissionFromRegion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removePermissionFromRegion,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["regionPermissions", variables.regionId],
      });
    },
  });
};

/**
 * Sync region permissions to all Regional Admins
 */
export const syncRegionPermissionsToUsers = async (regionId: string) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.REGION_PERMISSIONS.SYNC_TO_USERS.replace(
      ":regionId",
      regionId,
    ),
  );
  return response.data;
};

/**
 * Hook to sync region permissions to users
 */
export const useSyncRegionPermissionsToUsers = (regionId: string) => {
  return useMutation({
    mutationFn: () => syncRegionPermissionsToUsers(regionId),
  });
};
