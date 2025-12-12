import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  type INotification,
  useGetAllNotifications,
  useMarkAllNotificationsAsRead,
} from "@/api";
import { useUserStore } from "@/stores/useAuthStore";

interface NotificationsContextType {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  notifications: INotification[];
  setNotifications: (notifications: INotification[]) => void;
  isFetching: boolean;
  markAllAsRead: () => Promise<void>;
}

const NotificationsContext = createContext<
  NotificationsContextType | undefined
>(undefined);

// Helper function to format date
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

  return date.toLocaleDateString();
};

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { user } = useUserStore();
  const [notifications, setNotifications] = useState<INotification[]>([]);

  const userId = user?.id || "";

  // Fetch notifications
  const { data: notificationsResponse, isLoading: isFetching } =
    useGetAllNotifications(userId, 10, 0, !!userId);

  // Mark all as read mutation
  const { mutateAsync: markAllAsReadMutation } =
    useMarkAllNotificationsAsRead();

  useEffect(() => {
    if (notificationsResponse?.data) {
      // Handle nested response structure: { notifications: [...], total: X }
      const notificationsArray = Array.isArray(notificationsResponse.data)
        ? notificationsResponse.data
        : (notificationsResponse.data as any)?.notifications || [];
      setNotifications(notificationsArray);
    }
  }, [notificationsResponse]);

  const markAllAsRead = async () => {
    try {
      await markAllAsReadMutation(userId);
      // Update local state to mark all as read
      setNotifications(
        notifications.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  return (
    <NotificationsContext.Provider
      value={{
        isDrawerOpen,
        setIsDrawerOpen,
        notifications,
        setNotifications,
        isFetching,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    // Fallback for development/testing - return a no-op implementation
    console.warn(
      "useNotifications called outside NotificationsProvider, using fallback",
    );
    return {
      isDrawerOpen: false,
      setIsDrawerOpen: () => {},
      notifications: [],
      setNotifications: () => {},
      isFetching: false,
      markAllAsRead: async () => {},
    };
  }
  return context;
}
