export type OrganizationStatus =
  | "ACTIVE"
  | "INACTIVE";
  
export interface OrganizationRequest {
  categoryId: number;

  orgName: string;

  cin: string;

  regNum: string;

  orgEmail: string;

  orgPhone: string;

  contact: string;

  pan: string;

  gst: string;

  address: string;

  city: string;

  dist: string;

  state: string;

  country: string;

  pin: string;

  logo: string;

  website: string;

  firstName: string;

  lastName: string;

  userName: string;

  email: string;
}

export interface OrganizationResponse {
  orgId: number;

  categoryName: string;

  orgName: string;

  cin: string;

  regNum: string;

  orgEmail: string;

  orgPhone: string;

  contact: string;

  pan: string;

  gst: string;

  address: string;

  city: string;

  dist: string;

  state: string;

  country: string;

  pin: string;

  logo: string;

  website: string;

  status: string;

  createOn: string;
}

export interface OrganizationSearchRequest {
  search?:
    string;

  status?:
    OrganizationStatus | "";

  page:
    number;

  size:
    number;

  sortBy:
    string;

  sortDir:
    "asc" | "desc";
}

export interface OrganizationPageResponse {
  content:
    OrganizationResponse[];

  totalElements:
    number;

  totalPages:
    number;

  size:
    number;

  number:
    number;

  numberOfElements:
    number;

  first:
    boolean;

  last:
    boolean;

  empty:
    boolean;
}