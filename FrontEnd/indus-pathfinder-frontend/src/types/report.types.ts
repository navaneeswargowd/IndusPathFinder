import type {
  ExportFormat,
  ReportType,
} from "../enums/report.enums";

export interface ReportRequest {
  projectId: number;

  reportType: ReportType;

  exportFormat: ExportFormat;

  /*
   * Backend accepts these fields,
   * but current ReportServiceImpl does not use them.
   *
   * We therefore do not expose them in the UI yet.
   */
  fromDate?: string;

  toDate?: string;
}

export interface GeneratedReport {
  blob: Blob;

  fileName: string;

  contentType: string;

  reportType: string | null;

  exportFormat: string | null;
}