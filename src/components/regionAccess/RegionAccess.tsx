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

const AccessCell = ({ row, onAccess }: { row: any; onAccess: (id: string, permissionIds: string[]) => void }) => {
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
