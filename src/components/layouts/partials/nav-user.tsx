import { IconChevronDown, IconLogout } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import IconBell from "@/assets/Icons/ic-bell.svg?react";
import IconMail from "@/assets/Icons/ic-mail.svg?react";
import IconLanguage from "@/assets/Icons/ic-translate.svg?react";
import IconUserCircle from "@/assets/Icons/ic-user-circle.svg?react";
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
import { constant } from "@/lib/constant";
import { useUserStore } from "@/stores/useAuthStore";
import { Button } from "../../ui/button";

export function NavUser() {
  const { user } = useUserStore();
  const navigate = useNavigate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outlineNavBtnBlack"
          size="xl"
          spacing="lg"
          className="group"
        >
          <Avatar className="size-7">
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
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="size-8 rounded">
              <AvatarImage src={user?.profilePicture} alt={user?.name} />
              <AvatarFallback className="rounded bg-base-primary/10">
                {(
                  (user?.firstName?.[0] ?? "") + (user?.lastName?.[0] ?? "") ||
                  "N/A"
                ).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user?.name}</span>
              <span className="text-muted-foreground truncate text-xs">
                {user?.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem>
            <IconUserCircle />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem className="sm:hidden">
            <IconLanguage />
            Languages
          </DropdownMenuItem>
          <DropdownMenuItem className="md:hidden">
            <IconMail />
            Mails
          </DropdownMenuItem>
          <DropdownMenuItem className="md:hidden">
            <IconBell />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => {
            localStorage.clear();
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
