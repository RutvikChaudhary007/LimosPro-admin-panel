import type { Row } from "@tanstack/react-table";
import { FolderKey } from "lucide-react";
import { useEffect, useState } from "react";
import { useFetchStaffPermissions } from "@/api";
import MultiSelectComp from "../multiSelect/MultiSelect";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

interface AccessCellProps<T extends { id: string }> {
  row: Row<T>;
  onAccess: (id: string, permissionIds: string[]) => void;
  initialSelected?: string[];
  entityType?: "region" | "staff";
  staffId?: string;
}
const AccessCell = <T extends { id: string }>({
  row,
  onAccess,
  initialSelected,
  heading = "Edit Permissions",
  entityType = "region",
  staffId,
}: AccessCellProps<T> & { heading?: string }) => {
  const [selected, setSelected] = useState<string[]>(
    initialSelected || (row.original as any).permissionAccess || [],
  );
  const [isOpen, setIsOpen] = useState(false);

  const { data: staffPermissions, isFetching } = useFetchStaffPermissions(
    staffId || "",
  );

  useEffect(() => {
    if (entityType === "staff" && isOpen && staffPermissions) {
      // Assuming staffPermissions.permissions is the array of permission objects
      // We need to verify the exact structure of staffPermissions response
      // Based on staff.api.ts: returns response.data.data
      const perms = (staffPermissions as any)?.permissions || [];
      const ids = perms.map((p: any) => p.id);
      setSelected(ids);
    } else if (entityType === "region" && !initialSelected) {
      // fallback for region if needed, though usually initialSelected is passed
      setSelected((row.original as any).permissionAccess || []);
    } else if (initialSelected && entityType !== "staff") {
      setSelected(initialSelected);
    }
  }, [isOpen, staffPermissions, entityType, initialSelected]);

  // Sync initialSelected when dialog opens if provided (and not staff fetching)
  useEffect(() => {
    if (isOpen && initialSelected && entityType !== "staff") {
      setSelected(initialSelected);
    }
  }, [isOpen, initialSelected, entityType]);

  return (
    <Dialog modal={false} open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outlineNavBtnBlack"
          size="xl"
          spacing="lg"
          tooltip="Manage Access"
        >
          <FolderKey />
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{heading}.</DialogTitle>
          <DialogDescription>Make changes for permissions.</DialogDescription>
        </DialogHeader>

        {entityType === "staff" && isFetching ? (
          <div className="flex justify-center p-4">Loading permissions...</div>
        ) : (
          <MultiSelectComp selected={selected} setSelected={setSelected} />
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outlinePrimary">Cancel</Button>
          </DialogClose>
          <Button
            type="button"
            onClick={() => onAccess(row.original.id, selected)}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AccessCell;
