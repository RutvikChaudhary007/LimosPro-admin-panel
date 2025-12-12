import IconLanguage from "@/assets/Icons/ic-translate.svg?react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageSelector() {
  return (
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
  );
}
