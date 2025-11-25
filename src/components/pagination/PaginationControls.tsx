import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className,
  showPrevNext = true,
  showFirstLast = true,
  disabled = false,
}: PaginationControlsProps) {
  // Validate inputs
  if (totalPages <= 0) return null;
  if (totalPages === 1) return null;

  // Calculate page range to display
  const getPageRange = (): (number | string)[] => {
    const totalPageNumbers = siblingCount + 5;

    // If total pages fit in range, show all
    if (totalPageNumbers >= totalPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    // Only right dots
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftRange = Array.from(
        { length: 3 + 2 * siblingCount },
        (_, i) => i + 1,
      );
      return [...leftRange, "...", totalPages];
    }

    // Only left dots
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightRange = Array.from(
        { length: 3 + 2 * siblingCount },
        (_, i) => totalPages - (3 + 2 * siblingCount) + i + 1,
      );
      return [1, "...", ...rightRange];
    }

    // Both dots
    const middleRange = Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i,
    );
    return [1, "...", ...middleRange, "...", totalPages];
  };

  const pageRange = getPageRange();

  const handlePageClick = (page: number) => {
    if (!disabled && page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
      // Scroll to top for better UX
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const isPrevDisabled = currentPage === 1 || disabled;
  const isNextDisabled = currentPage === totalPages || disabled;

  return (
    <Pagination className={cn("justify-end cursor-pointer", className)}>
      <PaginationContent>
        {/* Previous Button */}
        {showPrevNext && (
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageClick(currentPage - 1);
              }}
              className={cn(isPrevDisabled && "pointer-events-none opacity-50")}
              aria-disabled={isPrevDisabled}
            />
          </PaginationItem>
        )}

        {/* First Page Button */}
        {showFirstLast && currentPage > 2 && (
          <PaginationItem>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageClick(1);
              }}
              isActive={false}
              className={cn(disabled && "pointer-events-none opacity-50")}
            >
              1
            </PaginationLink>
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
          if (showFirstLast && pageNum === 1 && currentPage > 2) {
            return null;
          }
          if (
            showFirstLast &&
            pageNum === totalPages &&
            currentPage < totalPages - 1
          ) {
            return null;
          }

          return (
            <PaginationItem key={pageNum}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageClick(pageNum);
                }}
                isActive={currentPage === pageNum}
                className={cn(disabled && "pointer-events-none opacity-50")}
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {/* Last Page Button */}
        {showFirstLast && currentPage < totalPages - 1 && (
          <PaginationItem>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageClick(totalPages);
              }}
              isActive={false}
              className={cn(disabled && "pointer-events-none opacity-50")}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}

        {/* Next Button */}
        {showPrevNext && (
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageClick(currentPage + 1);
              }}
              className={cn(isNextDisabled && "pointer-events-none opacity-50")}
              aria-disabled={isNextDisabled}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}

export default PaginationControls;
