import { IconFileCheck } from "@tabler/icons-react";
import { Eraser, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { INotification } from "@/api";
import IconBell from "@/assets/Icons/ic-bell.svg?react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { constant } from "@/lib/constant";
import { formatDate, useNotifications } from "./notifications-context";

export function NotificationsDrawer() {
  const navigate = useNavigate();
  const {
    isDrawerOpen,
    setIsDrawerOpen,
    notifications,
    setNotifications,
    unreadCount,
    isFetching,
    markAllAsRead,
  } = useNotifications();

  return (
    <Drawer
      open={isDrawerOpen}
      onOpenChange={setIsDrawerOpen}
      direction="right"
    >
      <DrawerTrigger asChild>
        <div className="relative">
          <Button variant="outlineNavBtnBlack" size="xl" spacing="lg">
            <IconBell />
          </Button>
          {unreadCount > 0 && (
            <Badge className="absolute -right-1 -top-1 p-0 size-5">
              {unreadCount}
            </Badge>
          )}
        </div>
      </DrawerTrigger>
      <DrawerContent className="font-quicksand rounded-none bg-base-white">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-base-gray p-4">
            <DrawerTitle className="text-black text-lg font-montserrat">
              Notifications
            </DrawerTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outlineNavBtnDestructive"
                className="border border-destructive"
                size="xl"
                spacing="lg"
                onClick={() => {
                  setNotifications([]);
                  console.log("Clear all notifications");
                }}
                tooltip="Clear All"
              >
                <Eraser />
              </Button>
              <Button
                variant="outlineNavBtnPrimary"
                className="border border-base-primary"
                size="xl"
                spacing="lg"
                onClick={() => {
                  markAllAsRead();
                  console.log("Mark all as read");
                }}
                tooltip="Mark All as Read"
              >
                <IconFileCheck />
              </Button>
              <DrawerClose asChild>
                <Button
                  variant="outlineNavBtnBlack"
                  className="border border-base-black"
                  size="xl"
                  spacing="lg"
                  tooltip="Close"
                >
                  <X />
                </Button>
              </DrawerClose>
            </div>
          </div>
          <ScrollArea className="h-full min-h-0 flex-1">
            <div className="flex-1 divide-y divide-base-gray">
              {isFetching ? (
                <div className="space-y-4 p-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-3/4 rounded" />
                      <Skeleton className="h-3 w-full rounded" />
                      <Skeleton className="h-3 w-1/2 rounded" />
                    </div>
                  ))}
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex items-center justify-center p-8">
                  <p className="text-base-black">No notifications</p>
                </div>
              ) : (
                notifications.map((notification: INotification) => (
                  <div
                    key={notification.id}
                    className={`border-l-4 p-4 transition-colors hover:bg-base-light-gray ${
                      notification.isRead
                        ? "border-l-transparent bg-base-white"
                        : "border-l-base-primary bg-base-primary/5"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-1">
                        <h3 className="font-semibold text-black">
                          {notification.title}
                        </h3>
                        <p className="text-sm text-base-black">
                          {notification.message}
                        </p>
                        <p className="mt-2 text-xs text-base-black">
                          {formatDate(notification.createdAt)}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div className="ml-2 h-2 w-2 flex-shrink-0 rounded-full bg-base-primary" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
          <div className="border-t border-base-gray p-4">
            <Button
              variant="outlinePrimary"
              className="w-full"
              onClick={() => {
                setIsDrawerOpen(false);
                navigate(constant.ROUTING_URLS.NOTIFICATION);
              }}
            >
              View All Notifications
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
