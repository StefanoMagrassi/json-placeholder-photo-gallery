export interface Pagination {
  page: number;
  size: number;
}

export const paginate =
  <A>(as: A[]) =>
  ({page, size}: Pagination): A[] => {
    const current = page < 1 ? 0 : page - 1;
    const start = current * size;
    const end = start + size;

    return as.slice(start, end);
  };
