import { useState } from 'react';

export type UsePaginationOptions = {
  initialPage?: number;
  initialTotalPages?: number;
};

export function usePagination({
  initialPage = 1,
  initialTotalPages = 1,
}: UsePaginationOptions = {}) {
  const [page, setPage] = useState<number>(initialPage);
  const [totalPages, setTotalPages] = useState<number>(initialTotalPages);

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePageChange = (newPage: number) => {
    setPage(Math.min(Math.max(newPage, 1), totalPages));
  };

  const hasPrevious = page > 1;
  const hasNext = page < totalPages;

  return {
    page,
    totalPages,
    setTotalPages,
    handlePreviousPage,
    handleNextPage,
    handlePageChange,
    hasPrevious,
    hasNext,
  };
}