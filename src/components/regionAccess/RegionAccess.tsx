import type { Row } from "@tanstack/react-table";
import { useState } from "react";
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

interface AccessCellProps<T extends { id: string; permissionAccess?: string[] }> {
  row: Row<T>;
  onAccess: (id: string, permissionIds: string[]) => void;
}
const AccessCell = <T extends { id: string; permissionAccess?: string[] }>({ row, onAccess }: AccessCellProps<T>) => {
  const [selected, setSelected] = useState<string[]>(row.original.permissionAccess || []);

  return (
    <Dialog modal={false}>
      <DialogTrigger asChild>
        <Button variant="outlinePrimary">Manage Access</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Permissions</DialogTitle>
          <DialogDescription>Make changes for permissions.</DialogDescription>
        </DialogHeader>

        <MultiSelectComp selected={selected} setSelected={setSelected} />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={() => onAccess(row.original.id, selected)}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AccessCell;
