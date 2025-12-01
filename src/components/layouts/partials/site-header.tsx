import { X } from "lucide-react";
import IconBell from "@/assets/Icons/ic-bell.svg?react";
import IconMail from "@/assets/Icons/ic-mail.svg?react";
import IconSearch from "@/assets/Icons/ic-search.svg?react";
import IconLanguage from "@/assets/Icons/ic-translate.svg?react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { useNotifications } from "./notifications-context";

const notificationData = [
  {
    id: 1,
    title: "Regional Admin Update",
    message: "Regional admin Sarah updated her profile details.",
    time: "5 minutes ago",
    read: false,
  },
  {
    id: 2,
    title: "New Staff Member Added",
    message: "A new staff member, Rohan Patel, has been added to your team.",
    time: "20 minutes ago",
    read: false,
  },
  {
    id: 3,
    title: "Fleet Update",
    message: "Vehicle BMW X7 (Plate: MH12AB1234) has been added to the fleet.",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 4,
    title: "Chauffeur Assignment",
    message: "Chauffeur Imran has been assigned to booking #45678.",
    time: "3 hours ago",
    read: true,
  },
  {
    id: 5,
    title: "System Alert",
    message: "Tonight’s scheduled maintenance will start at 2:00 AM.",
    time: "1 day ago",
    read: true,
  },
  {
    id: 6,
    title: "Fleet Maintenance Update",
    message: "Mercedes S-Class is due for maintenance tomorrow.",
    time: "2 days ago",
    read: true,
  },
];

export function SiteHeader() {
  const { isDrawerOpen, setIsDrawerOpen } = useNotifications();

  return (
    <header className="bg-base-background-light sticky top-0 z-40 flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-5 p-4 sm:gap-2 md:gap-2 lg:gap-4">
        <SidebarTrigger className="-ml-1" />
        <div className="w-full max-w-[400px]">
          <InputGroup>
            <InputGroupInput placeholder="Search for Bookings, Fleets, Chauffeurs..." />
            <InputGroupAddon>
              <IconSearch />
            </InputGroupAddon>
          </InputGroup>
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
                <DropdownMenuItem>English</DropdownMenuItem>
                <DropdownMenuItem>Spanish</DropdownMenuItem>
                <DropdownMenuItem>Arabic</DropdownMenuItem>
                <DropdownMenuItem>French</DropdownMenuItem>
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
                <Button variant="outlineNavBtnBlack" size="xl" spacing="lg">
                  <IconBell />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="font-quicksand h-screen max-h-screen w-full rounded-none">
                <div className="flex h-full flex-col">
                  <div className="flex items-center justify-between border-b p-4">
                    <DrawerTitle>Notifications</DrawerTitle>
                    <DrawerClose asChild>
                      <Button variant="ghost" size="xl" spacing="lg">
                        <X />
                      </Button>
                    </DrawerClose>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <div className="divide-y">
                      {notificationData.map((notification) => (
                        <div
                          key={notification.id}
                          className={`border-l-4 p-4 transition-colors hover:bg-gray-50 ${
                            notification.read
                              ? "border-l-transparent bg-white"
                              : "border-l-blue-500 bg-blue-50"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">
                                {notification.title}
                              </h3>
                              <p className="mt-1 text-sm text-gray-600">
                                {notification.message}
                              </p>
                              <p className="mt-2 text-xs text-gray-500">
                                {notification.time}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="ml-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border-t p-4">
                    <Button variant="outline" className="w-full">
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
