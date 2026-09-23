export type ExportFormat =
  | "PDF"
  | "EXCEL"
  | "CSV";

export interface AuditLogResponse {
  auditId: number;

  userId: number | null;

  actionName: string;

  actionScreen: string;

  actionScreenId:
    number | null;

  username: string;

  details:
    string | null;

  actionDate: string;
}

export interface AuditLogDetailsRequest {
  auditId: number;
}

export interface AuditLogSearchRequest {
  userId?: number;

  actionName?: string;

  actionScreen?: string;

  username?: string;

  fromDate?: string;

  toDate?: string;

  page: number;

  size: number;

  sortBy: string;

  direction:
    | "asc"
    | "desc";
}

export interface AuditLogExportRequest {
  userId?: number;

  actionName?: string;

  actionScreen?: string;

  username?: string;

  fromDate?: string;

  toDate?: string;

  exportFormat:
    ExportFormat;
}

export interface PageResponse<T> {
  content: T[];

  page: number;

  size: number;

  totalElements: number;

  totalPages: number;

  first: boolean;

  last: boolean;

  empty: boolean;
}