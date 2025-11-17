// @ts-nocheck

import { Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetchAllContentBlock, {
  useFetchPageContentBlockTab,
} from "@/api/contentBlock.api";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Spinner } from "@/components/Spinner";
import { getHomeContent, type THomeContent } from "@/components/table/column";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
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
import usePagination from "@/hooks/use-pagination";
import { toastPromise } from "@/hooks/use-toast";
import { constant } from "@/lib/constant";
import queries from "@/lib/queries";

const ContentManagement = () => {
  const navigate = useNavigate();
  const perPage = 10;
  const [page, setCPage] = useState(1);

  const { data: tabsData, isFetching: fetchingTabs } =
    useFetchPageContentBlockTab();
  // console.log("tabsData:",tabsData?.pageNames)
  const { data, refetch, isFetching } = useFetchAllContentBlock({
    limit: perPage,
    page,
  });
  const [activeBtn, setActiveBtn] = useState<string>("Home");
  // const tabsData = useMemo(()=>{
  //     const uniqueTabs = new Set();
  //     if (data?.blocks) {
  //       for (const rawData of data.blocks) {
  //         uniqueTabs.add(rawData?.pageName);
  //       }
  //     }
  //     return Array.from(uniqueTabs);
  //   },[data])
  const filteredData = data?.blocks?.filter((row) => {
    // console.log("activeBtn",row?.pageName?.toLowerCase())
    if (activeBtn?.toLowerCase() === row?.pageName?.toLowerCase()) {
      return true;
    }
    return false;
  });
  // console.log("filteredData:",filteredData)
  const { currentPage, nextPage, prevPage, setPage, totalPages, currentItems } =
    usePagination<THomeContent>(filteredData, page, perPage, data?.pagination);

  useEffect(() => {
    if (currentPage) setCPage(currentPage);
  }, [currentPage]);
  const handleEdit = (id: string) => {
    // console.log("Edit:", id)
    navigate(constant.ROUTING_URLS.EDIT_CONTENT_MANAGEMENT.replace(":id", id));
  };
  const deleteContentMutation = queries.useDeleteContentBlockMutation();
  const handleDelete = (id: string) => {
    toastPromise(deleteContentMutation.mutateAsync(id), {
      loading: "Deleting...",
      success: (res) => {
        if (res?.status === true) refetch();
        setActiveBtn("Home");
        return "Yeah! successfully deleted the content.";
      },
      error: (e) =>
        e instanceof Error ? e.message : "Opps! failed to delete content.",
    });
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
        title="Content Management"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Content Management" },
          { label: "Pages" },
        ]}
        action={{
          label: "Add New Page",
          icon: <Plus />,
          link: constant.ROUTING_URLS.CREATE_CONTENT_MANAGEMENT,
        }}
      />

      <div className="w-full max-w-2xs">
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
      <div className="flex items-center justify-between gap-2">
        {!fetchingTabs &&
          tabsData?.pageNames?.length > 1 &&
          tabsData?.pageNames?.map((btn, i) => (
            <Button
              type="buttom"
              key={i}
              className="capitalize"
              onClick={() => setActiveBtn(btn)}
            >
              {btn}
            </Button>
          ))}
      </div>

      {/* Data */}

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

export default ContentManagement;
