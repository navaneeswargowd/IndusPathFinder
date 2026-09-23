export interface ApiResponse<T> {
    success: boolean;
    status: string;
    message: string;
    data: T;
  }
  
  /*
   * TODO BACKEND RESPONSE MAPPING:
   *
   * Confirm this structure against your Spring Boot ApiResponse class.
   *
   * If your backend ApiResponse does NOT contain "data",
   * we will modify this interface during API integration.
   */
  
 export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  page: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
  
  /*
   * TODO BACKEND PAGINATION MAPPING:
   *
   * Confirm property names against actual Spring Page JSON.
   *
   * Important:
   * Spring usually returns:
   *
   * content
   * totalElements
   * totalPages
   * size
   * number
   *
   * But we will verify from Postman before integrating.
   */
  
  export interface SelectOption<T = string> {
    label: string;
    value: T;
  }
  
  export interface PaginationParams {
    page: number;
    size: number;
  }
  
  export interface SortParams {
    sortBy?: string;
    sortDirection?: "ASC" | "DESC";
  }