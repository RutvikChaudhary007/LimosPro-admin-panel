import { useState } from "react";

type pagination = {
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
};
export default function usePagination<T>(
  items: T[] = [],
  initialPage = 1,
  perPage = 10,
  pagination?: pagination,
) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const totalPages =
    pagination?.totalPages ?? Math.ceil(items.length / perPage);
  const currentItems = items;

  const setPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const nextPage = () => setPage(currentPage + 1);
  const prevPage = () => setPage(currentPage - 1);
  return { currentPage, totalPages, currentItems, setPage, nextPage, prevPage };
}
