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
  // if pagination is provided from outside, use it
  const totalPages =
    pagination?.totalPages ?? Math.ceil(items.length / perPage);
  // const totalPages =  pagination.totalPages  ;
  // console.log(perPage)
  // const offset = (currentPage - 1) * perPage;
  // console.log("pagination currentItems:",offset, offset+perPage)
  const currentItems = items;

  const setPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const nextPage = () => setPage(currentPage + 1);
  const prevPage = () => setPage(currentPage - 1);
  return { currentPage, totalPages, currentItems, setPage, nextPage, prevPage };
}
