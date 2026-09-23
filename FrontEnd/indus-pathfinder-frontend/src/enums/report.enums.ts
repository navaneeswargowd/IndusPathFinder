export const ReportType = {
  PROJECT: "PROJECT",
  ACTIVITY: "ACTIVITY",
  DEPENDENCY: "DEPENDENCY",
  CPM: "CPM",
  FLOAT: "FLOAT",
} as const;

export type ReportType =
  (typeof ReportType)[keyof typeof ReportType];

export const ExportFormat = {
  PDF: "PDF",
  EXCEL: "EXCEL",
  CSV: "CSV",
} as const;

export type ExportFormat =
  (typeof ExportFormat)[keyof typeof ExportFormat];