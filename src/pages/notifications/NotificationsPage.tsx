import { IconFileCheck, IconFilterX } from "@tabler/icons-react";
import type { Table } from "@tanstack/react-table";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { INotification } from "@/api";
import {
  useBulkDeleteNotification,
  useDeleteNotification,
  useGetAllNotifications,
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
} from "@/api";
import BulkDeleteBtn from "@/components/bulkDeleteBtn/BulkDeleteBtn";
import { ErrorCard } from "@/components/common/ErrorCard";
import PageTitle from "@/components/common/PageTitle";
import { PageHeader } from "@/components/layouts/PageHeader";
import PaginationControls from "@/components/pagination/PaginationControls";
import { Spinner } from "@/components/Spinner";
import { getNotification } from "@/components/table/column";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { toastPromise } from "@/hooks/use-toast";
import usePagination from "@/hooks/usePagination";
import { useUserStore } from "@/stores/useAuthStore";
import type { TBlkDelRes } from "@/types/global/BulkDeleteResponse.type";
import { generatePageTitle } from "@/utils/seo";

function NotificationsPage() {
  const { user } = useUserStore();
  const [perPage, setperPage] = useState<number>(10);
  const [newPage, setNewPage] = useState<number>(1);
  const [searchValue, setSearchValue] = useState("");
  const [tableRef, setTableRef] = useState<Table<INotification> | null>(null);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const {
    data: notificationsResponse,
    isFetching,
    isError,
    refetch,
  } = useGetAllNotifications(
    user?.id || "",
    perPage,
    (newPage - 1) * perPage,
    !!user?.id,
  );

  useEffect(() => {
    if (newPage) {
      setRowSelection({});
    }
  }, [newPage]);

  // Handle nested response structure
  const notificationsData = useMemo(() => {
    if (!notificationsResponse?.data) return { notifications: [], total: 0 };

    const data = notificationsResponse.data;
    if (Array.isArray(data)) {
      return { notifications: data, total: data.length };
    }

    return {
      notifications: (data as any)?.notifications || [],
      total: (data as any)?.total || 0,
    };
  }, [notificationsResponse]);

  const { currentPage, setPage, totalPages } = usePagination<INotification>(
    notificationsData.notifications,
    newPage,
    perPage,
    {
      currentPage: newPage,
      hasNextPage: newPage < Math.ceil(notificationsData.total / perPage),
      hasPreviousPage: newPage > 1,
      itemsPerPage: perPage,
      totalItems: notificationsData.total,
      totalPages: Math.ceil(notificationsData.total / perPage),
    },
  );

  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();
  const deleteNotificationMutation = useDeleteNotification();
  const bulkDeleteNotificationMutation = useBulkDeleteNotification();

  const handleMarkAsRead = async (id: string) => {
    const promise = markAsReadMutation.mutateAsync(id);
    toastPromise(promise, {
      loading: "Marking as read...",
      success: () => {
        refetch();
        return "Notification marked as read";
      },
      error: (e) => {
        return e instanceof Error
          ? e.message
          : "Failed to mark notification as read.";
      },
    });
  };

  const handleDelete = async (id: string) => {
    const promise = deleteNotificationMutation.mutateAsync(id);
    toastPromise(promise, {
      loading: "Deleting...",
      success: () => {
        refetch();
        return "Notification deleted successfully";
      },
      error: (e) => {
        return e instanceof Error
          ? e.message
          : "Failed to delete notification.";
      },
    });
  };

  const handleMarkAllAsRead = async () => {
    const promise = markAllAsReadMutation.mutateAsync(user?.id || "");
    toastPromise(promise, {
      loading: "Marking all as read...",
      success: () => {
        refetch();
        return "All notifications marked as read";
      },
      error: (e) => {
        return e instanceof Error
          ? e.message
          : "Failed to mark all notifications as read.";
      },
    });
  };

  const columns = getNotification(handleMarkAsRead, handleDelete);

  const calculatedTotalPages = Math.max(1, totalPages);

  const handlePageChange = (value: number) => {
    if (value > perPage || value === 10 || value === 20 || value === 30) {
      setperPage(value);
      setNewPage(1);
      setPage(1);
      refetch();
    } else {
      setNewPage(value);
      setPage(value);
      window.scrollTo(0, 0);
    }
  };

  if (isError) return <ErrorCard refetch={refetch} />;

  return (
    <>
      <PageTitle title={generatePageTitle("Notifications")} />
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <PageHeader
          title="Notifications"
          breadcrumbs={[
            { label: "Home", path: "/" },
            { label: "Notifications" },
          ]}
        />

        <div className="w-full flex flex-wrap items-center justify-end gap-4">
          <Button
            onClick={() => {
              setSearchValue("");
            }}
            type="button"
            variant={"outlineSecondary"}
          >
            <IconFilterX /> <span>Clear Filter</span>
          </Button>
          <Button
            onClick={handleMarkAllAsRead}
            type="button"
            variant={"outlineNavBtnPrimary"}
            className="border border-base-primary"
          >
            <IconFileCheck /> <span>Mark All as Read</span>
          </Button>
          <span
            className={`${Object.keys(rowSelection).filter((k) => rowSelection[k]).length === 0 ? "cursor-no-drop" : "cursor-pointer"} ml-auto`}
          >
            <BulkDeleteBtn<INotification, TBlkDelRes>
              rowSelection={rowSelection}
              tableRef={tableRef}
              bulkDeleteMutation={bulkDeleteNotificationMutation}
              refetch={refetch as any}
              setRowSelection={setRowSelection}
              title="Notifications"
              descTitle="notifications"
            />
          </span>
          <div className="">
            <InputGroup>
              <InputGroupInput
                type="search"
                placeholder="Search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
            </InputGroup>
          </div>
        </div>

        {isFetching ? (
          <Spinner />
        ) : (
          <DataTable
            columns={columns}
            data={notificationsData.notifications}
            rowSelection={rowSelection}
            onTableReady={setTableRef}
            onRowSelectionChange={setRowSelection}
            globalFilter={searchValue}
            onGlobalFilterChange={setSearchValue}
          />
        )}

        {/* Pagination */}
        {totalPages >= 0 && calculatedTotalPages >= 1 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={calculatedTotalPages}
            onPageChange={handlePageChange}
            totalItems={notificationsData.total}
            perPage={perPage}
          />
        )}
      </div>
    </>
  );
}

export default NotificationsPage;
