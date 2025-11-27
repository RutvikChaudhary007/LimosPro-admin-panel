// @ts-nocheck

import { Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useFetchALLIPWhiteLists from "@/api/ipWhiteList.api";
import BulkDeleteBtn from "@/components/bulkDeleteBtn/BulkDeleteBtn";
import { ErrorCard } from "@/components/common/ErrorCard";
import PageTitle from "@/components/common/PageTitle";
import { PageHeader } from "@/components/layouts/PageHeader";
import { PaginationControls } from "@/components/pagination";
import { Spinner } from "@/components/Spinner";
import { getIpWhiteList, type TIpWhiteList } from "@/components/table/column";
import { DataTable } from "@/components/table/data-table";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SelectDropDown } from "@/components/ui/select";
import usePagination from "@/hooks/use-pagination";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";
import { generatePageTitle } from "@/utils/seo";

const showOptions = [
  { value: "10", label: "Show 10" },
  { value: "20", label: "Show 20" },
  { value: "30", label: "Show 30" },
];

const IpWhiteListPage = () => {
  const [{ value: optionDefaultValue }] = showOptions;
  const navigate = useNavigate();
  const [newPage, setNewPage] = useState(1);
  const [tableRef, setTableRef] = useState<any>(null);
  const [perPage, setPerPage] = useState(10);
  const [selectedOption, setSelectedOption] =
    useState<string>(optionDefaultValue);
  // const [data, setData] = useState<TIpWhiteList[]>(tableData);
  const { data, refetch, isFetching, isError } =
    useFetchALLIPWhiteLists(perPage);

  const { currentPage, setPage, totalPages, currentItems } =
    usePagination<TIpWhiteList>(
      data?.items,
      newPage,
      perPage,
      data?.pagination,
    );
  // console.log("tableData:",tableData.length)
  useEffect(() => {
    setPerPage(Number(selectedOption));
    setPage(1);
    setNewPage(1);
  }, [selectedOption]);
  const handleEdit = (id: string) => {
    console.log("Edit:", id);
    navigate(constant.ROUTING_URLS.EDIT_IP_WHITE_LIST.replace(":id", id));
  };
  const deleteIPWhiteListMutation = queries.useDeleteIPWhiteListMutation();
  const bulkDeleteIPWhiteListMutation =
    queries.useBulkDeleteIPWhiteListMutation();
  const handleDelete = (id: string) => {
    try {
      toastPromise(deleteIPWhiteListMutation.mutateAsync(id), {
        loading: "Deleting IP White List...",
        success: (res) => {
          if (res) refetch();
          return "Yeah! IP White List deleted successfully.";
        },
        error: (e) =>
          e instanceof Error ? e.message : "Failed to delete IP White List.",
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred.");
      }
    }
  };
  const columns = getIpWhiteList(handleEdit, handleDelete);

  const [searchValue, setSearchValue] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  // Number of pages based on filtered data
  const calculatedTotalPages = Math.max(1, totalPages);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setNewPage(newPage);
    window.scrollTo(0, 0);
  };

  if (isError) return <ErrorCard refetch={refetch} />;
  return (
    <>
      <PageTitle title={generatePageTitle("Ip WhiteList")} />
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <PageHeader
          title="IP White List"
          breadcrumbs={[
            { label: "Home", path: "/" },
            { label: "IP White List" },
          ]}
          action={{
            label: "Add New IP",
            icon: <Plus />,
            link: constant.ROUTING_URLS.CREATE_IP_WHITE_LIST,
          }}
        />

        <div className="flex justify-between">
          <SelectDropDown
            placeholder={selectedOption}
            items={showOptions}
            value={selectedOption}
            setSelectedItem={setSelectedOption}
          />
          <div className="w-full max-w-fit flex items-center justify-between gap-4">
            <span
              className={`${Object.keys(rowSelection).filter((k) => rowSelection[k]).length === 0 ? "cursor-no-drop" : "cursor-pointer"}`}
            >
              <BulkDeleteBtn
                rowSelection={rowSelection}
                tableRef={tableRef}
                bulkDeleteMutation={bulkDeleteIPWhiteListMutation}
                refetch={refetch}
                setRowSelection={setRowSelection}
                title="Ip WhiteLists"
                descTitle="ip whiteLists"
              />
            </span>
            <div className="">
              <InputGroup>
                <InputGroupInput
                  type="search"
                  placeholder="search"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <InputGroupAddon>
                  <Search />
                </InputGroupAddon>
              </InputGroup>
            </div>
          </div>
        </div>
        {isFetching ? (
          <Spinner />
        ) : (
          <DataTable
            columns={columns}
            data={currentItems}
            rowSelection={rowSelection}
            onTableReady={setTableRef}
            onRowSelectionChange={setRowSelection}
            globalFilter={searchValue}
            onGlobalFilterChange={setSearchValue}
          />
        )}

        {/* Pagination */}
        {totalPages > 0 && calculatedTotalPages > 1 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={calculatedTotalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </>
  );
};

export default IpWhiteListPage;
