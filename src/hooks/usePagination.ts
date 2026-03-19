import { useEffect, useState } from "react";

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

  // Sync internal state with prop changes
  useEffect(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);

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

// import { useEffect, useMemo, useState } from "react";

// export default function usePagination<T>(data: T[], initialPage = 1, perPage = 10) {
//   const [currentPage, setCurrentPage] = useState(initialPage);

//   // Change page to 1 if data/perPage changes and currentPage would be out of range
//   useEffect(() => {
//     const totalPages = Math.ceil(data.length / perPage) || 1;
//     if(currentPage > totalPages) setCurrentPage(totalPages);
//     if(currentPage < 1) setCurrentPage(1);
//   }, [data, perPage]);

//   const totalPages = Math.ceil(data.length / perPage) || 1;
//   const currentItems = useMemo(() => {
//     const startIdx = (currentPage - 1) * perPage;
//     return data.slice(startIdx, startIdx + perPage);
//   }, [data, perPage, currentPage]);

//   const nextPage = () => setCurrentPage(p => Math.min(totalPages, p + 1));
//   const prevPage = () => setCurrentPage(p => Math.max(1, p - 1));
//   const setPage = (n: number) => setCurrentPage(() => Math.max(1, Math.min(totalPages, n)));

//   return { currentPage, nextPage, prevPage, setPage, totalPages, currentItems };
// }
