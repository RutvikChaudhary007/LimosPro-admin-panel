import { Plus, Search, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetchAllRegionAdmins from "@/api/regionAdmin.api";
import PageTitle from "@/components/common/PageTitle";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PageHeader } from "@/components/layouts/PageHeader";
import { Spinner } from "@/components/Spinner";
import { getRegionAdminColumns, type TRegionAdmin } from "@/components/table/column";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
// import { Checkbox } from '@/components/ui/checkbox';
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { SelectDropDown } from "@/components/ui/select";
import usePagination from "@/hooks/use-pagination";
import { constant } from "@/lib/constant";
import { generatePageTitle } from "@/utils/seo";

const showOptions = [
  { value: "10", label: "Show 10" },
  { value: "20", label: "Show 20" },
  { value: "30", label: "Show 30" },
];

const tableData: TRegionAdmin[] = [
  { id: "1", regionName: "Region 1", email: "name@email.com" },
  { id: "2", regionName: "Region 2", email: "name@email.com" },
  { id: "3", regionName: "Region 3", email: "name@email.com" },
  { id: "4", regionName: "Region 4", email: "name@email.com" },
  { id: "5", regionName: "Region 5", email: "name@email.com" },
  { id: "6", regionName: "Region 6", email: "name@email.com" },
  { id: "7", regionName: "Region 7", email: "name@email.com" },
  { id: "8", regionName: "Region 8", email: "name@email.com" },
  { id: "9", regionName: "Region 9", email: "name@email.com" },
  { id: "10", regionName: "Region 10", email: "name@email.com" },
  { id: "11", regionName: "Region 11", email: "name@email.com" },
  { id: "12", regionName: "Region 12", email: "name@email.com" },
  { id: "13", regionName: "Region 13", email: "name@email.com" },
  { id: "14", regionName: "Region 14", email: "name@email.com" },
];

function RegionAdminPage() {
  const [{ value: optionDefaultValue }] = showOptions;
  const navigate = useNavigate();
  const [perPage, setPerPage] = useState(Number(optionDefaultValue));
  const [selected, setSelected] = useState(optionDefaultValue);
  // const [data, setData] = useState<TRegionAdmin[]>(tableData);
  const { data, isFetching } = useFetchAllRegionAdmins({ limit: perPage });
  const { currentPage, setPage, totalPages, currentItems } = usePagination<TRegionAdmin>(
    data?.regionalAdmins,
    1,
    perPage,
    data?.pagination,
  );

  useEffect(() => {
    setPerPage(Number(selected));
  }, [selected]);

  const handleEdit = useCallback(
    (id: string) => {
      console.log("Edit:", id);
      navigate(constant.ROUTING_URLS.EDIT_REGION_ADMIN);
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
    window.scrollTo(0, 0);
  };

  // Generate pagination items
  const generatePaginationItems = () => {
    const items = [];

    // Always show first page
    items.push(
      <PaginationItem key="first">
        <PaginationLink isActive={currentPage === 1} onClick={() => handlePageChange(1)}>
          1
        </PaginationLink>
      </PaginationItem>,
    );

    // Show ellipsis if needed
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>,
      );
    }

    // Show nearby pages
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(calculatedTotalPages - 1, currentPage + 1); i++) {
      if (i === 1 || i === calculatedTotalPages) continue; // Skip first and last pages as they're added separately

      items.push(
        <PaginationItem key={i}>
          <PaginationLink isActive={currentPage === i} onClick={() => handlePageChange(i)}>
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    // Show ellipsis if needed
    if (currentPage < calculatedTotalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>,
      );
    }

    // Always show last page if there's more than one page
    if (calculatedTotalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink
            isActive={currentPage === calculatedTotalPages}
            onClick={() => handlePageChange(calculatedTotalPages)}
          >
            {calculatedTotalPages}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return items;
  };
  return (
    <>
      <PageTitle title={generatePageTitle("Region Admin")} />
      <div className="p-6 space-y-6 lg:p-8 lg:space-y-8">
        <PageHeader
          title="Region Management"
          breadcrumbs={[{ label: "Home", path: "/" }, { label: "Region Management" }, { label: "Regional Admins" }]}
          action={{
            label: "Add Regional Admin",
            icon: <Plus />,
            link: constant.ROUTING_URLS.CREATE_REGION_ADMIN,
          }}
        />

        <div className="flex justify-between">
          <SelectDropDown placeholder={selected} items={showOptions} value={selected} setSelectedItem={setSelected} />
          <div className="w-full max-w-fit flex items-center justify-between gap-4">
            <span
              className={`${
                Object.keys(rowSelection).filter((k) => rowSelection[k]).length === 0
                  ? "cursor-no-drop"
                  : "cursor-pointer"
              }`}
            >
              <Button
                variant={"outlineBlack"}
                disabled={Object.keys(rowSelection).filter((k) => rowSelection[k]).length === 0}
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
        {/* <div className="mt-5 py-4 border border-[#F1F1F1] rounded-[6px] inset-shadow-xs inset-shadow-[#F1F1F1]  shadow-base-light">
          <Table className=" bg-[#FDFDFD] ">
            <TableHeader className="w-full h-[31px] bg-[#F5F5F5]">
              <TableRow className="w-full h-full ">
                <TableHead className="w-[100px] px-4">#</TableHead>
                <TableHead>Regions</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-center">Access</TableHead>
                <TableHead className="text-right px-4">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="p-4">
              {currentItems && currentItems.map((row, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium px-4"><Checkbox className="data-[state=checked]:bg-[#d6d6d6] data-[state=checked]:border-[#d6d6d6] [&_[data-state=checked]>svg]:text-[#5A5A5A] " /></TableCell>
                  <TableCell>{row?.regionName}</TableCell>
                  <TableCell>{row?.email}</TableCell>
                  <TableCell className="text-center"><Button variant={"outline"} className='cursor-pointer w-[108px] h-[33px] text-sm'>Manage Access</Button></TableCell>
                  <TableCell className="text-right flex gap-2 justify-end px-4">
                    <Button variant={"outline"} className='cursor-pointer bg-[#F1F1F1] rounded w-[34px] h-[33px]'><Edit className='text-[#5A5A5A]' /></Button>
                    <Button variant={"outline"} className='cursor-pointer bg-[#F1F1F1] rounded w-[34px] h-[33px]'><Trash2 className='text-[#5A5A5A]' /></Button>
                  </TableCell>
                </TableRow>
              ))}

            </TableBody>
          </Table>

        </div> */}
        {/* Pagination */}
        {tableData.length > 0 && calculatedTotalPages > 1 && (
          <Pagination className="justify-end mt-5 cursor-pointer">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {generatePaginationItems()}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={currentPage === calculatedTotalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </>
  );
}

export default RegionAdminPage;
