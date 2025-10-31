import { Button } from "@/components/ui/button"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Bell, CircleUserRound, Languages, Mail, Search } from "lucide-react"

export function SiteHeader() {
  return (
    <header className="bg-base-background-light sticky top-0 z-40 flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-5 p-4 sm:gap-2 md:gap-2 lg:gap-4">
        <SidebarTrigger className="-ml-1" />
        <div className="w-full max-w-[400px]">
          <InputGroup>
            <InputGroupInput placeholder="Search for Bookings, Fleets, Chauffeurs..." />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>
        </div>
        <div className="ml-auto flex items-center gap-6 sm:gap-2 md:gap-2 lg:gap-4">
          <div className="hidden sm:block">
            <Button variant="outlineNavBtnPrimary" size="xl" spacing="lg">
              <Languages />
              <span>English</span>
            </Button>
          </div>
          <div className="hidden gap-2 md:flex">
            <Button variant="outlineNavBtnBlack" size="xl" spacing="lg">
              <Mail />
            </Button>
            <Button variant="outlineNavBtnBlack" size="xl" spacing="lg">
              <Bell />
            </Button>
          </div>
          <div className="">
            <Button variant="outlineNavBtnBlack" size="xl" spacing="lg">
              <CircleUserRound />
              <h1>Alaadin</h1>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
