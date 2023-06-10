export interface PaginationProps {
  total?: number;
  page?: number;
  perPage?: number;
  lastPage?: number;
  hasMorePages?: boolean;
}

export interface PaginationParams<T> {
  edges: T[];
  pageInfo: PaginationProps;
}

export type NestedObject = { [key: string]: any };
