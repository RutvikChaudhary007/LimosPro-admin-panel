//@ts-nocheck

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

const BulkDeleteBtn = ({
	rowSelection,
	tableRef,
	bulkDeleteMutation,
	refetch,
	setRowSelection,
	title,
	descTitle,
}: {
	rowSelection: Record<string, boolean>;
	tableRef: any;
	bulkDeleteMutation: any;
	refetch: any;
	setRowSelection: any;
	title?: string;
	descTitle?: string;
}) => {
	const [isDailogOpen, setIsDailogOpen] = useState(false);
	const handleBulkDelete = async () => {
		if (!tableRef) return;
		// ✅ Extract selected IDs
		const selectedIds = tableRef
			.getSelectedRowModel()
			.rows.map((row) => row.original.id);

		console.log("Selected IDs to delete:", selectedIds);
		try {
			setIsDailogOpen(false);
			toastPromise(bulkDeleteMutation.mutateAsync(selectedIds), {
				loading: `Deleting ${title}...`,
				success: (res) => {
					if (res) refetch();
					setRowSelection({});
					return `Yeah! ${title} deleted successfully`;
				},
				error: (e) =>
					e instanceof AxiosError
						? e.message
						: `Opps! Failed to delete ${title}`,
			});
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error("Opps! An unknown error occurred");
			}
		}
	};
	return (
		<Dialog
			open={isDailogOpen}
			onOpenChange={(open) => {
				setIsDailogOpen(open);
			}}
		>
			<DialogTrigger asChild>
				<Button
					variant={"outline"}
					className="p-2.5 w-[137px] h-full rounded flex items-center justify-evenly  cursor-pointer bg-[#FDFDFD] shadow-inner shadow-[#F1F1F1] hover:bg-none outline-0"
					disabled={
						Object.keys(rowSelection).filter((k) => rowSelection[k]).length ===
						0
					}
				>
					<span className="text-[#959595] text-sm w-[93px] h-[19px]">
						Delete
					</span>
					<Trash2 size={14} className="text-[#959595] cursor-pointer" />
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
