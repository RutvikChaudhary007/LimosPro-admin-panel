// @ts-nocheck

import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/layouts/PageHeader";
import { getHomeContent, type THomeContent } from "@/components/table/column";
import { DataTable } from "@/components/table/data-table";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import usePagination from "@/hooks/usePagination";
import { constant } from "@/lib/constant";

const tableData: THomeContent[] = [
  {
    id: "1",
    content: "Hero Section",
    description:
      "You can book online the hourly service for the Houston rodeo on our website. If you are looking for a point-point one-way or round trip for the Houston rodeo, please call us to book by phone because the regular online point-point rates are not valid for Houston rodeo one-way or round trip.",
  },
  {
    id: "2",
    content: "Our Section",
    description:
      "Special rates may apply during the events seasons and sports games in the Houston greater areas such as Houston rodeo, Christmas lights, new year's night, and big sports games.",
  },
  {
    id: "3",
    content: "Cities We Serve",
    description:
      "The rate is subject to change at any time without advanced announcement but it will not reflect in the reservations that are under processing or already booked.",
  },
  {
    id: "4",
    content: "Customer Reviews",
    description: "Office times: Monday – Sunday  8:00 AM – 10:00 PM.",
  },
  {
    id: "5",
    content: "Our partner",
    description:
      "Transportation between Houston Airports, Houston greater area, and Galveston Cruise Port, Galveston Hotels, please book online by clicking on the Houston – Galveston button at the Online Quote & Booking and start from there.",
  },
];

const SeoPage = () => {
  const navigate = useNavigate();
  const [perPage, _setPerPage] = useState(10);
  const [data, setData] = useState<THomeContent[]>(tableData);
  const [_activeBtn, _setActiveBtn] = useState<string>("Home");
  const { currentPage, nextPage, prevPage, setPage, totalPages, currentItems } =
    usePagination<THomeContent>(data, 1, perPage);

  const handleEdit = (id: string) => {
    console.log("Edit:", id);
    navigate(constant.ROUTING_URLS.EDIT_CONTENT_MANAGEMENT.replace(":id", id));
  };
  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((row) => row.id !== id));
  };
  const columns = getHomeContent(handleEdit, handleDelete);

  const [searchValue, setSearchValue] = useState("");
  const [rowSelection, setRowSelection] = useState({});
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
        <PaginationLink
          isActive={currentPage === 1}
          onClick={() => handlePageChange(1)}
        >
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
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(calculatedTotalPages - 1, currentPage + 1);
      i++
    ) {
      if (i === 1 || i === calculatedTotalPages) continue; // Skip first and last pages as they're added separately

      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={currentPage === i}
            onClick={() => handlePageChange(i)}
          >
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
    <div className="p-6 space-y-6 md:p-8 md:space-y-8">
      <PageHeader
        title="SEO"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Content Management" },
          { label: "SEO" },
        ]}
        action={{
          label: "Add New SEO",
          icon: <Plus />,
          link: constant.ROUTING_URLS.CREATE_CONTENT_MANAGEMENT,
        }}
      />

      <div className="w-full max-w-2xs">
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

      <DataTable
        columns={columns}
        data={currentItems}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        globalFilter={searchValue}
        onGlobalFilterChange={setSearchValue}
      />

      {/* Pagination */}
      {tableData.length > 0 && calculatedTotalPages > 1 && (
        <Pagination className="justify-end mt-5 cursor-pointer">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={`?page=${currentPage}`}
                onClick={prevPage}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

            {generatePaginationItems()}

            <PaginationItem>
              <PaginationNext
                href={`?page=${currentPage}`}
                onClick={nextPage}
                className={
                  currentPage === calculatedTotalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default SeoPage;
