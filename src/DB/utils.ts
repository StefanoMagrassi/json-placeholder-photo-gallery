export const paginate =
  <A>(as: A[]) =>
  (page: number, size: number): A[] => {
    const current = page < 1 ? 0 : page - 1;
    const start = current * size;
    const end = start + size;

    return as.slice(start, end);
  };
