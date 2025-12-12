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
import { cn } from "@/lib/utils";

export interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  className?: string;
  showPrevNext?: boolean;
  showFirstLast?: boolean;
  disabled?: boolean;
  totalItems?: number;
  showPageInfo?: boolean;
  perPage?: number;
  showperPageSelector?: boolean;
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className,
  showPrevNext = true,
  disabled = false,
  totalItems,
  showPageInfo = true,
  perPage = 10,
  showperPageSelector = true,
}: PaginationControlsProps) {
  const getPageRange = (): (number | string)[] => {
    const range: (number | string)[] = [];
    const delta = siblingCount;

    const start = Math.max(1, currentPage - delta);
    const end = Math.min(totalPages, currentPage + delta);

    if (start > 1) {
      range.push(1);
      if (start > 2) {
        range.push("...");
      }
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        range.push("...");
      }
      range.push(totalPages);
    }

    return range;
  };

  const pageRange = getPageRange();

  const startIndex =
    totalItems && totalItems > 0 ? (currentPage - 1) * perPage + 1 : 0;
  const endIndex =
    totalItems && currentPage * perPage < totalItems
      ? currentPage * perPage
      : totalItems;

  const handlePagination = (
    type: "page" | "perPage" | "next" | "prev",
    value?: number,
  ) => {
    if (disabled) return;

    let targetPage: number | null = null;

    switch (type) {
      case "perPage":
        if (value !== undefined) {
          onPageChange(value);
        }
        return;
      case "page":
        if (
          value !== undefined &&
          value >= 1 &&
          value <= totalPages &&
          value !== currentPage
        ) {
          targetPage = value;
        }
        break;
      case "next":
        if (currentPage < totalPages) {
          targetPage = currentPage + 1;
        }
        break;
      case "prev":
        if (currentPage > 1) {
          targetPage = currentPage - 1;
        }
        break;
    }

    if (targetPage !== null) {
      onPageChange(targetPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const isPrevDisabled = currentPage === 1 || disabled;
  const isNextDisabled = currentPage === totalPages || disabled;

  const perPageOptions = [
    { label: "10", value: "10" },
    { label: "20", value: "20" },
    { label: "30", value: "30" },
  ];

  const [{ value: perPageValue }] = perPageOptions;

  return (
    <div className="flex justify-between items-center w-full gap-3">
      {/* LEFT: Page Info Section */}
      {showPageInfo && totalItems !== undefined && totalItems > 0 && (
        <div className="font-quicksand text-sm text-base-black shrink-0">
          Showing <span className="font-semibold text-black">{startIndex}</span>
          {" - "}
          <span className="font-semibold text-black">{endIndex}</span>
          {totalItems !== undefined && (
            <>
              {" "}
              of{" "}
              <span className="font-semibold text-black">
                {totalItems.toLocaleString()}
              </span>{" "}
              results
            </>
          )}
        </div>
      )}

      {/* LEFT: Rows per Page Selector */}
      {showperPageSelector &&
        totalItems !== undefined &&
        totalItems > Number(perPageValue) && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-quicksand text-sm text-base-black hidden">
              Rows per page:
            </span>
            <SelectDropDown
              size="sm"
              placeholder={perPage.toString()}
              items={perPageOptions}
              value={perPage.toString()}
              setSelectedItem={(value) =>
                handlePagination("perPage", parseInt(value, 10))
              }
            />
          </div>
        )}

      {/* RIGHT: Pagination Controls */}
      {totalItems !== undefined && totalItems > Number(perPageValue) && (
        <Pagination className={cn("justify-end", className)}>
          <PaginationContent>
            {/* Previous Button */}
            {showPrevNext && (
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePagination("prev");
                  }}
                  className={cn(
                    isPrevDisabled && "pointer-events-none opacity-50",
                  )}
                  aria-disabled={isPrevDisabled}
                />
              </PaginationItem>
            )}

            {/* Page Numbers */}
            {pageRange.map((page, index) => {
              if (page === "...") {
                return (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }

              const pageNum = page as number;

              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePagination("page", pageNum);
                    }}
                    isActive={currentPage === pageNum}
                    className={cn(disabled && "pointer-events-none opacity-50")}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            {/* Next Button */}
            {showPrevNext && (
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePagination("next");
                  }}
                  className={cn(
                    isNextDisabled && "pointer-events-none opacity-50",
                  )}
                  aria-disabled={isNextDisabled}
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

export default PaginationControls;
