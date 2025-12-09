import { IconFileCheck, IconX } from "@tabler/icons-react";
import { Car, Eraser, FileText, Phone, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { INotification } from "@/api";
import IconBell from "@/assets/Icons/ic-bell.svg?react";
import IconMail from "@/assets/Icons/ic-mail.svg?react";
import IconSearch from "@/assets/Icons/ic-search.svg?react";
import IconLanguage from "@/assets/Icons/ic-translate.svg?react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { constant } from "@/lib/constant";
import { NavUser } from "./nav-user";
import { formatDate, useNotifications } from "./notifications-context";
export function SiteHeader() {
  const navigate = useNavigate();
  const {
    isDrawerOpen,
    setIsDrawerOpen,
    notifications,
    setNotifications,
    isFetching,
    markAllAsRead,
  } = useNotifications();
  const [query, setQuery] = useState("");
  const [show, setShow] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Mock data (replace with API later)
  const data = [
    {
      type: "Booking",
      label: "#BK1023 – Airport Pickup – John Doe",
      icon: <FileText className="size-5" />,
    },
    {
      type: "Booking",
      label: "#BK1024 – City Transfer – Amaan Shaikh",
      icon: <FileText className="size-5" />,
    },
    {
      type: "Chauffeur",
      label: "Imran Shaikh – Available",
      icon: <User className="size-5" />,
    },
    {
      type: "Chauffeur",
      label: "Zaid Patel – On Trip",
      icon: <User className="size-5" />,
    },
    {
      type: "Fleet",
      label: "Mercedes S-Class – MH04 1122",
      icon: <Car className="size-5" />,
    },
    {
      type: "Fleet",
      label: "BMW 7 Series – MH01 AX 2200",
      icon: <Car className="size-5" />,
    },
    {
      type: "Customer",
      label: "Sarah Ali – 9988223344",
      icon: <Phone className="size-5" />,
    },
    {
      type: "Affiliate",
      label: "John Samuel – 8877445522",
      icon: <Phone className="size-5" />,
    },
  ];

  // GROUP + FILTER MATCHING RESULTS
  const groups = data.reduce((acc: any, item) => {
    if (item.label.toLowerCase().includes(query.toLowerCase())) {
      if (!acc[item.type]) acc[item.type] = [];
      acc[item.type].push(item);
    }
    return acc;
  }, {});

  const hasResults = Object.keys(groups).length > 0;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShow(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="bg-base-background-light sticky top-0 z-40 flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-5 p-4 sm:gap-2 md:gap-2 lg:gap-4">
        <SidebarTrigger />
        <div className="relative w-full max-w-[400px]" ref={wrapperRef}>
          <InputGroup>
            <InputGroupInput
              placeholder="Search for Bookings, Fleets, Chauffeurs..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShow(true);
              }}
            />

            <InputGroupAddon>
              <IconSearch />
            </InputGroupAddon>
            {query.length > 0 && (
              <InputGroupAddon align="inline-end">
                <IconX
                  className="hover:text-base-danger cursor-pointer transition-colors"
                  onClick={() => {
                    setQuery("");
                    setShow(false);
                  }}
                />
              </InputGroupAddon>
            )}
          </InputGroup>

          {/* Dropdown with Keyboard Navigation */}
          {show && query.length > 0 && (
            <div className="font-quicksand absolute mt-2 w-full bg-base-white shadow-sm rounded border border-base-gray z-20 max-h-80 [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden">
              <Command className="bg-transparent">
                <CommandList className="max-h-80 overflow-y-auto [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden">
                  {!hasResults ? (
                    <div className="px-4 py-6 font-medium text-base text-center text-base-black">
                      No results found
                    </div>
                  ) : (
                    Object.keys(groups).map((type) => (
                      <CommandGroup
                        key={type}
                        heading={type}
                        className="overflow-hidden [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-base-gray [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest"
                      >
                        {groups[type].map((item: any, idx: number) => (
                          <CommandItem
                            key={idx}
                            value={`${type}-${idx}`}
                            onSelect={() => {
                              // Handle selection - navigate or perform action
                              setQuery(item.label);
                              console.log("Selected:", item.label);
                              setShow(false);
                            }}
                            className="flex items-center gap-4 cursor-pointer transition-all duration-200 font-medium text-base text-base-black [&_svg]:text-base-gray aria-selected:[&_svg]:text-base-primary aria-selected:bg-base-light-gray"
                          >
                            {item.icon}
                            <span className="flex-1 truncate">
                              {item.label}
                            </span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    ))
                  )}
                </CommandList>
              </Command>
            </div>
          )}
        </div>
        <div className="ml-auto flex items-center gap-6 sm:gap-2 md:gap-2 lg:gap-4">
          <div className="hidden sm:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outlineNavBtnPrimary" size="xl" spacing="lg">
                  <IconLanguage />
                  <span>English</span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuCheckboxItem checked={true}>
                  English
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Spanish</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Arabic</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>French</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="hidden gap-2 md:flex">
            <Button
              variant="outlineNavBtnBlack"
              size="xl"
              spacing="lg"
              className="hidden"
            >
              <IconMail />
            </Button>

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
                  {notifications.filter((n) => !n.isRead).length > 0 && (
                    <Badge className="absolute -right-1 -top-1 p-0 size-5">
                      {notifications.filter((n) => !n.isRead).length}
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
                  <div className="flex-1 overflow-y-auto">
                    <div className="divide-y divide-base-gray">
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
                  </div>
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
          </div>
          <div className="">
            <NavUser />
          </div>
        </div>
      </div>
    </header>
  );
}
