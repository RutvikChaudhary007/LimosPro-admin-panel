import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import type { TCrewMemberForm } from "@/components/crewMember/crewMemberForm";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { queryKeys } from "@/lib/queryKeys";
import axiosInstance from "@/utils/axiosInstance";

/**
 * ============================================
 * Staff & Crew Member API Module
 * ============================================
 * All staff member and crew member API calls consolidated
 */

type TArg = { page?: number; limit: number };
type TStaffArg = { id?: string; page?: number; limit?: number };

// ============================================
// CREW MEMBER OPERATIONS
// ============================================

/**
 * Fetch all crew members
 */
export const getAllCrewMember = async ({ limit, page }: TArg) => {
  const params: Record<string, unknown> = {};
  if (limit) params.limit = limit;
  if (page) {
    params.page = page;
  }
  try {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.GET_ALL_CREW_MEMBER}`,
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
 * Hook to fetch all crew members
 */
export const useFetchAllCrewMember = ({ page, limit }: TArg) =>
  useQuery({
    queryKey: queryKeys.crewMember.listParams(limit, page),
    queryFn: () => getAllCrewMember({ limit, page }),
    refetchOnWindowFocus: false,
    retry: false,
  });

/**
 * Create crew member
 */
export const createCrewMember = async (data: TCrewMemberForm) => {
  const crewData = { ...data };
  if (crewData?.phone) {
    (crewData as any).phoneNumber = crewData?.phone;
    delete (crewData as any).phone;
    delete (crewData as any).designation;
  }
  const response = await axiosInstance.post(
    API_ENDPOINTS.CREATE_CREW_MEMBER,
    crewData,
    {},
  );

  return response.data;
};

/**
 * Edit crew member
 */
export const editCrewMember = async ({
  data,
  id,
}: {
  data: TCrewMemberForm;
  id: string;
}) => {
  const response = await axiosInstance.patch(
    API_ENDPOINTS.EDIT_CREW_MEMBER.replace(":id", id),
    data,
    {},
  );

  return response.data;
};

/**
 * Delete crew member
 */
export const deleteCrewMember = async ({ id }: { id: string }) => {
  const response = await axiosInstance.delete(
    API_ENDPOINTS.DELETE_CREW_MEMBER.replace(":id", id),
  );

  return response.data;
};

/**
 * Bulk delete crew members
 */
export const bulkDeleteCrewMember = async (ids: string[]) => {
  const data = {
    crewMemberIds: ids,
  };
  const response = await axiosInstance.post(
    API_ENDPOINTS.BULK_DELETE_CREW_MEMBER,
    data,
  );

  return response.data;
};

// ============================================
// STAFF MEMBER OPERATIONS
// ============================================

/**
 * Fetch all staff members
 */
export const getAllStaffMember = async ({ limit, page }: TStaffArg) => {
  const params: Record<string, unknown> = {};
  if (limit) params.limit = limit;
  if (page) {
    params.page = page;
  }
  try {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.GET_ALL_STAFF_MEMBER}`,
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
 * Hook to fetch all staff members
 */
export const useFetchAllStaffMember = ({ page, limit }: TStaffArg) =>
  useQuery({
    queryKey: queryKeys.staffMember.listParams(limit, page),
    queryFn: () => getAllStaffMember({ limit, page }),
    refetchOnWindowFocus: false,
    retry: false,
  });

/**
 * Fetch staff member by ID
 */
export const getStaffMemberById = async ({ id }: TStaffArg) => {
  try {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.GET_SINGLE_STAFF_MEMBER.replace(":id", id)}`,
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
 * Hook to fetch staff member by ID
 */
export const useFetchOneStaffMember = ({ id }: TStaffArg) =>
  useQuery({
    queryKey: queryKeys.staffMember.detail(id!),
    queryFn: () => getStaffMemberById({ id }),
    refetchOnWindowFocus: false,
    retry: false,
  });

/**
 * Create staff member
 */
export const createStaffMember = async (data: object) => {
  const params: Record<string, unknown> = {};
  const staffData = { ...data } as any;
  if (staffData?.region) {
    params.regionId = staffData?.region;
    delete staffData?.region;
  }
  const response = await axiosInstance.post(
    API_ENDPOINTS.CREATE_STAFF_MEMBER.replace(
      ":regionId",
      params.regionId as string,
    ),
    staffData,
  );

  return response.data;
};

/**
 * Edit staff member
 */
export const editStaffMember = async ({
  id,
  regionId,
  data,
}: {
  id: string;
  regionId: string;
  data: object;
}) => {
  const staffData = { ...data } as any;
  if (staffData?.region) {
    delete staffData?.region;
  }
  const response = await axiosInstance.patch(
    API_ENDPOINTS.EDIT_STAFF_MEMBER.replace(":id", id as string).replace(
      ":regionId",
      regionId as string,
    ),
    staffData,
    {},
  );

  return response.data;
};

/**
 * Delete staff member
 */
export const deleteStaffMember = async ({ id }: { id: string }) => {
  const response = await axiosInstance.delete(
    API_ENDPOINTS.DELETE_STAFF_MEMBER.replace(":id", id),
  );

  return response.data;
};

/**
 * Bulk delete staff members
 */
export const bulkDeleteStaffMember = async (ids: string[]) => {
  const data = {
    staffMemberIds: ids,
  };
  const response = await axiosInstance.post(
    API_ENDPOINTS.BULK_DELETE_STAFF_MEMBER,
    data,
  );

  return response.data;
};

// // ============================================
// // STAFF PERMISSION OPERATIONS (Deprecated - Use userPermission.api.ts)
// // ============================================

// /**
//  * @deprecated Use useFetchUserPermissions from userPermission.api.ts instead
//  * Get all available permissions
//  */
// export const getStaffAllPermissions = async () => {
//   try {
//     const response = await axiosInstance.get(
//       API_ENDPOINTS.PERSMISSIONS.GET_ALL,
//     );
//     return response.data.data;
//   } catch (error) {
//     if (error instanceof AxiosError && error?.status === 400) {
//       return [];
//     }
//     throw error;
//   }
// };

// /**
//  * @deprecated Use useFetchUserPermissions from userPermission.api.ts instead
//  * Hook to fetch all permissions
//  */
// export const useFetchStaffAllPermissions = () =>
//   useQuery({
//     queryKey: ["permissions"],
//     queryFn: () => getStaffAllPermissions(),
//     refetchOnWindowFocus: false,
//     retry: false,
//   });

// /**
//  * @deprecated Use getUserPermissions from userPermission.api.ts instead
//  * Get permissions for a staff member
//  */
// export const getStaffPermissions = async (staffId: string) => {
//   try {
//     // Use new unified user permission endpoint
//     const response = await axiosInstance.get(
//       API_ENDPOINTS.USER_PERMISSIONS.GET_USER_PERMISSIONS.replace(":userId", staffId),
//     );
//     return response.data.data;
//   } catch (error) {
//     if (error instanceof AxiosError && error?.status === 400) {
//       return { permissions: [] };
//     }
//     throw error;
//   }
// };

// /**
//  * @deprecated Use useFetchUserPermissions from userPermission.api.ts instead
//  * Hook to fetch staff member permissions
//  */
// export const useFetchStaffPermissions = (staffId: string) =>
//   useQuery({
//     queryKey: ["staffPermissions", staffId],
//     queryFn: () => getStaffPermissions(staffId),
//     refetchOnWindowFocus: false,
//     retry: false,
//     enabled: !!staffId,
//   });

// /**
//  * @deprecated Use syncUserPermissions from userPermission.api.ts instead
//  * Sync permissions for a staff member
//  */
// export const syncStaffPermissions = async ({
//   staffId,
//   permissionIds,
// }: {
//   staffId: string;
//   permissionIds: string[];
// }) => {
//   // Use new unified user permission endpoint
//   const response = await axiosInstance.put(
//     API_ENDPOINTS.USER_PERMISSIONS.SYNC_USER_PERMISSIONS.replace(":userId", staffId),
//     { permissionIds },
//   );
//   return response.data;
// };
