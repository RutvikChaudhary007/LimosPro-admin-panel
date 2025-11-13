import { IconCreditCard, IconLogout } from "@tabler/icons-react";
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
import { Button } from "../../ui/button";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
}) {
  const navigate = useNavigate();
  return (
    <DropdownMenu>
      {/* 👇 Your custom button becomes the trigger */}
      <DropdownMenuTrigger asChild>
        <Button variant="outlineNavBtnBlack" size="xl" spacing="lg">
          <IconUserCircle />
          <span>{user?.name}</span>
        </Button>
      </DropdownMenuTrigger>

      {/* 👇 Dropdown content */}
      <DropdownMenuContent
        className="font-quicksand min-w-56 rounded"
        side="bottom"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback className="rounded">
                {user?.name?.[0] ?? "N/A"}
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
          <DropdownMenuItem>
            <IconCreditCard />
            Billing
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
