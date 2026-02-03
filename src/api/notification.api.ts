import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import type { TBlkDelRes } from "@/types/global/BulkDeleteResponse.type";
import axiosInstance from "@/utils/axiosInstance";

/**
 * ============================================
 * Notification API Module
 * ============================================
 * All notification-related API calls consolidated
 */

/**
 * Notification Types
 */
export interface INotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  category: string;
  isRead: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateNotificationPayload {
  userId: string;
  title: string;
  message: string;
  type: string;
  category: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export interface IUpdateNotificationPayload {
  title?: string;
  message?: string;
  type?: string;
  category?: string;
  isRead?: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export interface INotificationsListData {
  notifications: INotification[];
  total: number;
}

export interface INotificationResponse {
  success: boolean;
  data: INotification | INotification[] | INotificationsListData;
  message?: string;
}

export interface IGetNotificationsFilters {
  isRead?: boolean;
  type?: string;
  category?: string;
}

// ============================================
// GET OPERATIONS
// ============================================

/**
 * Get all notifications
 */
export const getAllNotifications = async (
  userId: string,
  limit?: number,
  skip?: number,
  filters?: IGetNotificationsFilters,
) => {
  try {
    const params: Record<string, any> = { userId };

    if (limit !== undefined) params.limit = limit;
    if (skip !== undefined) params.skip = skip;
    if (filters?.isRead !== undefined) params.isRead = String(filters.isRead);
    if (filters?.type !== undefined) params.type = filters.type;
    if (filters?.category !== undefined) params.category = filters.category;

    const response = await axiosInstance.get<INotificationResponse>(
      API_ENDPOINTS.NOTIFICATION.GET_ALL,
      { params },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

/**
 * Hook to fetch all notifications
 */
export const useGetAllNotifications = (
  userId: string,
  limit?: number,
  skip?: number,
  enabled: boolean = true,
  filters?: IGetNotificationsFilters,
) => {
  return useQuery({
    queryKey: [
      "notifications",
      userId,
      limit,
      skip,
      filters ? JSON.stringify(filters) : "",
    ],
    queryFn: () => getAllNotifications(userId, limit, skip, filters),
    enabled: enabled && !!userId,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Get notification by ID
 */
export const getNotificationById = async (notificationId: string) => {
  try {
    const response = await axiosInstance.get<INotificationResponse>(
      API_ENDPOINTS.NOTIFICATION.GET_BY_ID(notificationId),
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching notification:", error);
    throw error;
  }
};

/**
 * Hook to fetch notification by ID
 */
export const useGetNotificationById = (
  notificationId: string,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ["notification", notificationId],
    queryFn: () => getNotificationById(notificationId),
    enabled: enabled && !!notificationId,
    staleTime: 1000 * 60 * 5,
  });
};

// ============================================
// CREATE OPERATIONS
// ============================================

/**
 * Create notification
 */
export const createNotification = async (
  payload: ICreateNotificationPayload,
) => {
  try {
    const response = await axiosInstance.post<INotificationResponse>(
      API_ENDPOINTS.NOTIFICATION.CREATE,
      payload,
    );
    return response.data;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

/**
 * Hook to create notification
 */
export const useCreateNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ICreateNotificationPayload) =>
      createNotification(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

// ============================================
// UPDATE OPERATIONS
// ============================================

/**
 * Update notification
 */
export const updateNotification = async (
  notificationId: string,
  payload: IUpdateNotificationPayload,
) => {
  try {
    const response = await axiosInstance.patch<INotificationResponse>(
      API_ENDPOINTS.NOTIFICATION.UPDATE(notificationId),
      payload,
    );
    return response.data;
  } catch (error) {
    console.error("Error updating notification:", error);
    throw error;
  }
};

/**
 * Hook to update notification
 */
export const useUpdateNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      notificationId,
      payload,
    }: {
      notificationId: string;
      payload: IUpdateNotificationPayload;
    }) => updateNotification(notificationId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

/**
 * Mark notification as read by ID
 */
export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const response = await axiosInstance.patch<INotificationResponse>(
      `${API_ENDPOINTS.NOTIFICATION.MARK_AS_READ_BY_ID(notificationId)}`,
      {},
    );
    return response.data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

/**
 * Hook to mark notification as read
 */
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: string) =>
      markNotificationAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsAsRead = async (userId: string) => {
  try {
    const params: Record<string, any> = { userId };

    const response = await axiosInstance.patch<INotificationResponse>(
      API_ENDPOINTS.NOTIFICATION.MARK_AS_READ_ALL,
      {},
      { params },
    );
    return response.data;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
};

/**
 * Hook to mark all notifications as read
 */
export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => markAllNotificationsAsRead(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

// ============================================
// DELETE OPERATIONS
// ============================================

/**
 * Delete notification
 */
export const deleteNotification = async (notificationId: string) => {
  try {
    const response = await axiosInstance.delete<INotificationResponse>(
      API_ENDPOINTS.NOTIFICATION.DELETE(notificationId),
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
};

/**
 * Hook to delete notification
 */
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: string) => deleteNotification(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

/**
 * Bulk delete notifications
 */
export const bulkDeleteNotifications = async (notificationIds: string[]) => {
  try {
    const response = await axiosInstance.post<TBlkDelRes>(
      API_ENDPOINTS.NOTIFICATION.BULK_DELETE,
      { notificationIds },
    );
    return response.data;
  } catch (error) {
    console.error("Error bulk deleting notifications:", error);
    throw error;
  }
};

/**
 * Hook to bulk delete notifications
 */
export const useBulkDeleteNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationIds: string[]) =>
      bulkDeleteNotifications(notificationIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
