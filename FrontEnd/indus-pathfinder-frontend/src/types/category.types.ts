export type CategoryStatus =
  | "ACTIVE"
  | "INACTIVE";

export interface CategoryRequest {
  categoryName: string;

  status: CategoryStatus;
}

export interface CategoryResponse {
  categoryId: number;

  categoryName: string;

  status: CategoryStatus;

  createOn: string | null;

  updateOn: string | null;
}

export interface CategorySearchParams {
  search?: string;

  status?: CategoryStatus | "";

  page: number;

  size: number;

  sortBy: string;

  sortDir:
    | "asc"
    | "desc";
}

export interface CategoryPageResponse {
  content:
    CategoryResponse[];

  totalElements:
    number;

  totalPages:
    number;

  size:
    number;

  number:
    number;

  first:
    boolean;

  last:
    boolean;

  empty:
    boolean;
}