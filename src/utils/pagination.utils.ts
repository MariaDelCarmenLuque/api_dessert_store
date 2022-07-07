import { PaginationOptionsDessertDto } from 'src/desserts/dtos/request/pagination-options-dessert.dto';

export const getPagination = (
  pagination: PaginationOptionsDessertDto,
  totalItems: number,
) => {
  const totalPages = Math.ceil(totalItems / pagination.take);
  const nextPage = pagination.page < totalPages ? pagination.page + 1 : null;
  const prevPage =
    pagination.page > 1 && pagination.page <= totalPages
      ? pagination.page - 1
      : null;

  return {
    totalItems,
    totalPages,
    perPage: pagination.take,
    currentPage: pagination.page,
    prevPage,
    nextPage,
  };
};
