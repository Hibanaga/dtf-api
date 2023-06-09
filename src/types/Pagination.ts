export interface PaginationParams<T> {
  edges: T[];
  pageInfo: {
    total?: number;
    page?: number;
    perPage?: number;
    lastPage?: number;
    hasMorePages?: boolean;
  };
}
