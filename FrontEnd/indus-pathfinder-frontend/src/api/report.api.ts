import {
  axiosClient,
} from "./axiosClient";

import {
  API_ENDPOINTS,
} from "./apiEndpoints";

import type {
  GeneratedReport,
  ReportRequest,
} from "../types/report.types";

export async function generateReportApi(
  request: ReportRequest
): Promise<GeneratedReport> {
  const response =
    await axiosClient.post<Blob>(
      API_ENDPOINTS.REPORTS.GENERATE,
      request,
      {
        responseType:
          "blob",
      }
    );

  const contentDispositionHeader =
    response.headers[
      "content-disposition"
    ];

  const contentTypeHeader =
    response.headers[
      "content-type"
    ];

  const reportTypeHeader =
    response.headers[
      "x-report-type"
    ];

  const exportFormatHeader =
    response.headers[
      "x-export-format"
    ];

  const contentDisposition =
    typeof contentDispositionHeader ===
    "string"
      ? contentDispositionHeader
      : undefined;

  const contentType =
    typeof contentTypeHeader ===
    "string"
      ? contentTypeHeader
      : "application/octet-stream";

  const reportType =
    typeof reportTypeHeader ===
    "string"
      ? reportTypeHeader
      : null;

  const exportFormat =
    typeof exportFormatHeader ===
    "string"
      ? exportFormatHeader
      : null;

  const fileName =
    extractFileName(
      contentDisposition
    ) ??
    createFallbackFileName(
      request.reportType,
      request.exportFormat
    );

  return {
    blob:
      response.data,

    fileName,

    contentType,

    reportType,

    exportFormat,
  };
}

function extractFileName(
  contentDisposition:
    string | undefined
): string | null {
  if (
    !contentDisposition
  ) {
    return null;
  }

  const utf8Match =
    contentDisposition.match(
      /filename\*=UTF-8''([^;]+)/i
    );

  if (
    utf8Match?.[1]
  ) {
    return decodeURIComponent(
      utf8Match[1]
    );
  }

  const normalMatch =
    contentDisposition.match(
      /filename="?([^";]+)"?/i
    );

  if (
    normalMatch?.[1]
  ) {
    return normalMatch[1]
      .trim();
  }

  return null;
}

function createFallbackFileName(
  reportType:
    string,
  exportFormat:
    string
): string {
  const extension =
    exportFormat ===
    "PDF"
      ? "pdf"
      : exportFormat ===
          "EXCEL"
        ? "xlsx"
        : "csv";

  return `${reportType.toLowerCase()}-report.${extension}`;
}