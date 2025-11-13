import type {
  QueryObserverResult,
  RefetchOptions,
  UseMutationResult,
} from "@tanstack/react-query";
import type { Table } from "@tanstack/react-table";
import { AxiosError } from "axios";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toastPromise } from "@/hooks/use-toast";
import { Button } from "../ui/button";

// ✅ Generic Props
interface BulkDeleteBtnProps<TData, TResponse> {
  rowSelection: Record<string, boolean>;
  tableRef: Table<TData> | null;
  bulkDeleteMutation: UseMutationResult<TResponse, unknown, string[], unknown>;
  refetch: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<TData, Error>>;
  setRowSelection: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  title?: string;
  descTitle?: string;
}

const BulkDeleteBtn = <TData, TResponse>({
  rowSelection,
  tableRef,
  bulkDeleteMutation,
  refetch,
  setRowSelection,
  title,
  descTitle,
}: BulkDeleteBtnProps<TData, TResponse>) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleBulkDelete = async () => {
    if (!tableRef) return;

    // Extract selected IDs (assumes your data rows have an `id` field)
    const selectedIds = tableRef
      .getSelectedRowModel()
      .rows.map((row) => (row.original as { id: string }).id);

    try {
      setIsDialogOpen(false);
      toastPromise(bulkDeleteMutation.mutateAsync(selectedIds), {
        loading: `Deleting ${title}...`,
        success: async (res) => {
          if (res) await refetch();
          setRowSelection({});
          return `Yeah! ${title} deleted successfully`;
        },
        error: (e) =>
          e instanceof AxiosError
            ? e.message
            : `Oops! Failed to delete ${title}`,
      });
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Oops! An unknown error occurred");
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outlineBlack"
          disabled={
            Object.keys(rowSelection).filter((k) => rowSelection[k]).length ===
            0
          }
        >
          <span>Delete</span>
          <Trash2 />
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-[425px]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Delete {title}</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete these {descTitle}? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            <strong>Are you absolutely sure?</strong> This action cannot be
            undone.
          </p>
        </div>

        <DialogFooter className="mt-6">
          <Button
            variant="destructive"
            disabled={
              Object.keys(rowSelection).filter((k) => rowSelection[k])
                .length === 0
            }
            onClick={handleBulkDelete}
          >
            Confirm Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkDeleteBtn;
