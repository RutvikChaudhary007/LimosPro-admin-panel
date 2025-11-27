// @ts-nocheck

import { Plus, Search } from "lucide-react";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useFetchAllCrewMember from "@/api/crewMember.api";
import BulkDeleteBtn from "@/components/bulkDeleteBtn/BulkDeleteBtn";
import { ErrorCard } from "@/components/common/ErrorCard";
import PageTitle from "@/components/common/PageTitle";
import { PageHeader } from "@/components/layouts/PageHeader";
import { PaginationControls } from "@/components/pagination";
import { Spinner } from "@/components/Spinner";
import { getCrewMember, type TCrewMember } from "@/components/table/column";
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
  { value: 10, label: "Show 10" },
  { value: 20, label: "Show 20" },
  { value: 30, label: "Show 30" },
];

const CrewMemberPage = () => {
  const [{ value: optionDefaultValue }] = showOptions;
  const navigate = useNavigate();
  const [tableRef, setTableRef] = useState<any>(null);
  const [newPage, setNewPage] = useState(1);
  const [perPage, setPerPage] = useState<number>(optionDefaultValue);
  const [selectedOption, setSelectedOption] = useState(optionDefaultValue);
  // const [data, setData] = useState<TCrewMember[]>(tableData);
  const { data, refetch, isFetching, isError } = useFetchAllCrewMember({
    page: newPage,
    limit: perPage,
  });
  const { currentPage, setPage, totalPages, currentItems } =
    usePagination<TCrewMember>(
      data?.crewMembers || [],
      newPage,
      selectedOption,
      data?.pagination,
    );

  const handleEdit = useCallback(
    (id: string) => {
      console.log("Edit:", id);
      navigate(constant.ROUTING_URLS.EDIT_CREW_MEMBERS.replace(":id", id));
    },
    [navigate],
  );
  const deleteCrewMember = queries.useDeleteCrewMemberMutation();
  const bulkDeleteCrewMember = queries.useBulkDeleteCrewMemberMutation();

  const handleDelete = (id: string) => {
    try {
      toastPromise(deleteCrewMember.mutateAsync({ id }), {
        loading: "Deleting crew member...",
        success: (res) => {
          if (res) refetch();
          return `Crew member deleted successfully`;
        },
        error: (e) =>
          e instanceof Error ? e.message : "Failed to delete crew member",
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    }
    // setData((prev) =>
    //   prev.filter((row) => row.id !== id))
  };
  const columns = getCrewMember(handleEdit, handleDelete);

  const [searchValue, setSearchValue] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const calculatedTotalPages = Math.max(1, totalPages);

  // Handle page change
  const handlePageChange = (newPageNum: number) => {
    setPage(newPageNum);
    setNewPage(newPageNum);
    window.scrollTo(0, 0);
  };

  if (isError) return <ErrorCard refetch={refetch} />;
  return (
    <>
      <PageTitle title={generatePageTitle("Crew Member")} />
      <div className="p-6 space-y-6 md:p-8 md:space-y-8">
        <PageHeader
          title="Crew Member"
          breadcrumbs={[{ label: "Home", path: "/" }, { label: "Crew Member" }]}
          action={{
            label: "Add a Crew Member",
            icon: <Plus />,
            link: constant.ROUTING_URLS.CREATE_CREW_MEMBERS,
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
                bulkDeleteMutation={bulkDeleteCrewMember}
                refetch={refetch}
                setRowSelection={setRowSelection}
                title="Crew Members"
                descTitle="crew members"
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

export default CrewMemberPage;
