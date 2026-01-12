import IconMail from "@/assets/Icons/ic-mail.svg?react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { GlobalSearch } from "./global-search";
import { LanguageSelector } from "./language-selector";
import { NavUser } from "./nav-user";
import { NotificationsDrawer } from "./notifications-drawer";

export function SiteHeader() {
  return (
    <header className="bg-base-background-light sticky top-0 z-40 flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-5 p-4 sm:gap-2 md:gap-2 lg:gap-4">
        <SidebarTrigger />
        <GlobalSearch />
        <div className="ml-auto flex items-center gap-6 sm:gap-2 md:gap-2 lg:gap-4">
          <div className="hidden">
            <LanguageSelector />
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

            <NotificationsDrawer />
          </div>
          <div className="">
            <NavUser />
          </div>
        </div>
      </div>
    </header>
  );
}
