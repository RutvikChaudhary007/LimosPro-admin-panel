import { Plus, Search, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetchAllRegionAdmins from "@/api/regionAdmin.api";
import PageTitle from "@/components/common/PageTitle";
import { PageHeader } from "@/components/layouts/PageHeader";
import { PaginationControls } from "@/components/pagination";
import { Spinner } from "@/components/Spinner";
import {
  getRegionAdminColumns,
  type TRegionAdmin,
} from "@/components/table/column";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SelectDropDown } from "@/components/ui/select";
import usePagination from "@/hooks/use-pagination";
import { constant } from "@/lib/constant";
import { generatePageTitle } from "@/utils/seo";

const showOptions = [
  { value: "10", label: "Show 10" },
  { value: "20", label: "Show 20" },
  { value: "30", label: "Show 30" },
];

function RegionAdminPage() {
  const [{ value: optionDefaultValue }] = showOptions;
  const navigate = useNavigate();
  const [newPage, setNewPage] = useState(1);
  const [perPage, setPerPage] = useState(Number(optionDefaultValue));
  const [selected, setSelected] = useState(optionDefaultValue);
  const { data, isFetching } = useFetchAllRegionAdmins({
    limit: perPage,
    page: newPage,
  });
  const { currentPage, setPage, totalPages, currentItems } =
    usePagination<TRegionAdmin>(
      data?.regionalAdmins || [],
      newPage,
      perPage,
      data?.pagination,
    );

  useEffect(() => {
    setPerPage(Number(selected));
    setNewPage(1);
    setPage(1);
  }, [selected]);

  const handleEdit = useCallback(
    (id: string) => {
      navigate(constant.ROUTING_URLS.EDIT_REGION_ADMIN.replace(":id", id));
    },
    [navigate],
  );
  const handleDelete = useCallback((id: string) => {
    console.log(id);
    // setData((prev) =>
    //   prev.filter((row) => row.id != id))
  }, []);
  const handleAccess = useCallback((id: string) => {
    console.log("manage access:", id);
  }, []);
  const columns = useMemo(
    () => getRegionAdminColumns(handleEdit, handleDelete, handleAccess),
    [handleEdit, handleDelete, handleAccess],
  );
  const [searchValue, setSearchValue] = useState("");
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  // Number of pages based on filtered data
  const calculatedTotalPages = Math.max(1, totalPages);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setNewPage(newPage);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <PageTitle title={generatePageTitle("Region Admin")} />
      <div className="p-6 space-y-6 lg:p-8 lg:space-y-8">
        <PageHeader
          title="Region Management"
          breadcrumbs={[
            { label: "Home", path: "/" },
            { label: "Region Management" },
            { label: "Regional Admins" },
          ]}
          action={{
            label: "Add Regional Admin",
            icon: <Plus />,
            link: constant.ROUTING_URLS.CREATE_REGION_ADMIN,
          }}
        />

        <div className="flex justify-between">
          <SelectDropDown
            placeholder={selected}
            items={showOptions}
            value={selected}
            setSelectedItem={setSelected}
          />
          <div className="w-full max-w-fit flex items-center justify-between gap-4">
            <span
              className={`${
                Object.keys(rowSelection).filter((k) => rowSelection[k])
                  .length === 0
                  ? "cursor-no-drop"
                  : "cursor-pointer"
              }`}
            >
              <Button
                variant={"outlineBlack"}
                disabled={
                  Object.keys(rowSelection).filter((k) => rowSelection[k])
                    .length === 0
                }
                onClick={() => {
                  // console.log("data:", data);
                  // console.log("rowSelection:", rowSelection);
                  setRowSelection({});
                }}
              >
                <span>Delete</span>
                <Trash2 />
              </Button>
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
}

export default RegionAdminPage;
