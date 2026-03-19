// @ts-nocheck

import { IconFilterX } from "@tabler/icons-react";
import { Download } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetchAllPayments } from "@/api";
import { ErrorCard } from "@/components/common/ErrorCard";
import PageTitle from "@/components/common/PageTitle";
import { PageHeader } from "@/components/layouts/PageHeader";
import { PaginationControls } from "@/components/pagination";
import { PermissionGate } from "@/components/permissions";
import { Spinner } from "@/components/Spinner";
import { getPayments, type TPayments } from "@/components/table/column";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import { SelectDropDown } from "@/components/ui/select";
import { constant } from "@/lib/constant";
import { generatePageTitle } from "@/utils/seo";

const showStatus = [
  { label: "Pending", value: "pending" },
  { label: "Failed", value: "failed" },
  { label: "Completed", value: "completed" },
  { label: "Refunded", value: "refunded" },
];

const managePaymentsPage = () => {
  const navigate = useNavigate();
  const [perPage, setperPage] = useState<number>(10);
  const [newPage, setNewPage] = useState<number>(1);
  const [selectedStatus, setSelectedStatus] = useState("");
  const { data, isFetching, isError, refetch } = useFetchAllPayments({
    page: newPage,
    limit: perPage,
    status: selectedStatus,
  });
  const totalPages = data?.pagination?.totalPages || 1;
  const calculatedTotalPages = Math.max(1, totalPages);

  const handleView = useCallback(
    (id: string) => {
      console.log("view:", id);
      navigate(constant.ROUTING_URLS.VIEW_PAYMENTS.replace(":id", id));
    },
    [navigate],
  );
  const handleEdit = useCallback(
    (id: string) => {
      console.log("Edit:", id);
      navigate(constant.ROUTING_URLS.EDIT_USERS.replace(":id", id));
    },
    [navigate],
  );
  const columns = useMemo(
    () => getPayments(handleView, { showWithdraw: false }),
    [handleView],
  );
  const [searchValue, setSearchValue] = useState("");
  const [rowSelection, setRowSelection] = useState({});

  const handlePageChange = (value: number) => {
    setNewPage(value);
    window.scrollTo(0, 0);
  };

  const handlePerPageChange = (value: number) => {
    setperPage(value);
    setNewPage(1);
    refetch();
  };

  if (isError) return <ErrorCard refetch={refetch} />;
  return (
    <>
      <PageTitle title={generatePageTitle("Payments")} />
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <PageHeader
          title="Payments"
          breadcrumbs={[{ label: "Home", path: "/" }, { label: "Payments" }]}
        />

        <div className="w-full flex flex-wrap items-center justify-end gap-4">
          <Button
            onClick={() => {
              setSelectedStatus("");
              setperPage(10);
              setNewPage(1);
            }}
            type="button"
            variant={"outlineSecondary"}
          >
            <IconFilterX /> <span>Clear Filter</span>
          </Button>
          <SelectDropDown
            placeholder="Select Status"
            items={showStatus}
            value={selectedStatus}
            setSelectedItem={(val) => {
              setSelectedStatus(val);
              setNewPage(1);
            }}
          />
          <PermissionGate permission="managePayments" action="export">
            <span
              // @ts-expect-error: We are intentionally assigning a number to a string type for testing.
              className={`${Object.keys(rowSelection).filter((k) => rowSelection[k]).length === 0 ? "cursor-no-drop" : "cursor-pointer"}`}
            >
              <Button
                variant="outlineBlack"
                type="button"
                disabled={
                  Object.keys(rowSelection).filter((k) => rowSelection[k])
                    .length === 0
                }
                onClick={() => {
                  // setData((prev) => prev.filter((_row, i) => !rowSelection[i]));
                  setRowSelection({});
                }}
              >
                Export
                <Download />
              </Button>
            </span>
          </PermissionGate>
        </div>
        {isFetching ? (
          <Spinner />
        ) : (
          <DataTable
            key={`${selectedStatus}-${newPage}-${perPage}`}
            columns={columns}
            data={data?.payments || []}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            globalFilter={searchValue}
            onGlobalFilterChange={setSearchValue}
            manualFiltering={true}
            manualPagination={true}
          />
        )}

        {/* Pagination */}
        {totalPages >= 0 && calculatedTotalPages >= 1 && (
          <PaginationControls
            currentPage={newPage}
            totalPages={calculatedTotalPages}
            onPageChange={handlePageChange}
            onPerPageChange={handlePerPageChange}
            totalItems={data?.pagination?.total}
            perPage={perPage}
          />
        )}
      </div>
    </>
  );
};

export default managePaymentsPage;
