import { createContext, type ReactNode, useContext, useState } from "react";

interface NotificationsContextType {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
}

const NotificationsContext = createContext<
  NotificationsContextType | undefined
>(undefined);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <NotificationsContext.Provider value={{ isDrawerOpen, setIsDrawerOpen }}>
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
    };
  }
  return context;
}
