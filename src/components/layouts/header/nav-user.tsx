import { IconChevronDown, IconLogout } from "@tabler/icons-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import IconBell from "@/assets/Icons/ic-bell.svg?react";
import IconMail from "@/assets/Icons/ic-mail.svg?react";
import IconLanguage from "@/assets/Icons/ic-translate.svg?react";
import IconUserCircle from "@/assets/Icons/ic-user-circle.svg?react";
import { PermissionGate } from "@/components/permissions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthContext } from "@/context/AuthContext";
import { constant } from "@/lib/constant";
import { useUserStore } from "@/stores/useAuthStore";
import { Button } from "../../ui/button";
import { useNotifications } from "./notifications-context";

export function NavUser() {
  const { user } = useUserStore();
  const { logout } = useAuthContext();
  const navigate = useNavigate();
  const { setIsDrawerOpen } = useNotifications();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleNotificationsClick = () => {
    setIsDrawerOpen(true);
    setIsDropdownOpen(false); // Close the dropdown menu
  };

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outlineNavBtnBlack"
          size="xl"
          spacing="lg"
          className="group"
        >
          <Avatar className="size-7 border border-base-primary/20">
            <AvatarImage src={user?.profilePicture} alt={user?.name} />
            <AvatarFallback className="group-hover:bg-base-black transition-all bg-base-primary/10 text-xs">
              {(
                (user?.firstName?.[0] ?? "") + (user?.lastName?.[0] ?? "") ||
                "N/A"
              ).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span>{user?.name}</span>
          <IconChevronDown />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="font-quicksand min-w-56 rounded"
        side="bottom"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel>
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="size-8 border border-base-primary/20">
              <AvatarImage src={user?.profilePicture} alt={user?.name} />
              <AvatarFallback className="bg-base-primary/10">
                {(
                  (user?.firstName?.[0] ?? "") + (user?.lastName?.[0] ?? "") ||
                  "N/A"
                ).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium text-black">
                {user?.name}
              </span>
              <span className="text-base-black truncate text-xs">
                {user?.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <PermissionGate permission="manageAccount" action="view">
            <DropdownMenuItem asChild>
              <Link to={constant.ROUTING_URLS.ACCOUNT_SETTINGS}>
                <IconUserCircle />
                Account
              </Link>
            </DropdownMenuItem>
          </PermissionGate>
          <DropdownMenuItem className="sm:hidden">
            <IconLanguage />
            Languages
          </DropdownMenuItem>
          <DropdownMenuItem className="hidden">
            <IconMail />
            Mails
          </DropdownMenuItem>
          <DropdownMenuItem
            className="md:hidden"
            onClick={handleNotificationsClick}
          >
            <IconBell />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuItem
          className="text-base-danger"
          onClick={() => {
            logout();
            navigate(constant.ROUTING_URLS.ADMIN_LOGIN);
          }}
        >
          <IconLogout />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
