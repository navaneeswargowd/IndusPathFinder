import {
  axiosClient,
} from "./axiosClient";

import type {
  ApiResponse,
} from "../types/common.types";

import type {
  AuditLogDetailsRequest,
  AuditLogExportRequest,
  AuditLogResponse,
  AuditLogSearchRequest,
  PageResponse,
} from "../types/audit-log.types";

const AUDIT_LOG_BASE_URL =
  "/api/v1/audit-logs";

/*
 * ==========================================================
 * SEARCH AUDIT LOGS
 * ==========================================================
 */

export async function searchAuditLogsApi(
  request:
    AuditLogSearchRequest
): Promise<
  PageResponse<AuditLogResponse>
> {
  const response =
    await axiosClient.post<
      ApiResponse<
        PageResponse<AuditLogResponse>
      >
    >(
      `${AUDIT_LOG_BASE_URL}/search`,
      request
    );

  return response.data.data;
}

/*
 * ==========================================================
 * AUDIT LOG DETAILS
 * ==========================================================
 */

export async function getAuditLogDetailsApi(
  request:
    AuditLogDetailsRequest
): Promise<AuditLogResponse> {
  const response =
    await axiosClient.post<
      ApiResponse<AuditLogResponse>
    >(
      `${AUDIT_LOG_BASE_URL}/details`,
      request
    );

  return response.data.data;
}

/*
 * ==========================================================
 * EXPORT AUDIT LOGS
 * ==========================================================
 */

export async function exportAuditLogsApi(
  request:
    AuditLogExportRequest
): Promise<void> {
  const response =
    await axiosClient.post(
      `${AUDIT_LOG_BASE_URL}/export`,
      request,
      {
        responseType:
          "blob",
      }
    );

  const rawContentDisposition =
    response.headers[
      "content-disposition"
    ];

  const contentDisposition =
    typeof rawContentDisposition ===
    "string"
      ? rawContentDisposition
      : undefined;

  let fileName =
    getDefaultFileName(
      request.exportFormat
    );

  if (
    contentDisposition
  ) {
    const match =
      contentDisposition.match(
        /filename="?([^"]+)"?/
      );

    if (
      match?.[1]
    ) {
      fileName =
        match[1];
    }
  }

  const rawContentType =
    response.headers[
      "content-type"
    ];

  const contentType =
    typeof rawContentType ===
    "string"
      ? rawContentType
      : getContentType(
          request.exportFormat
        );

  const blob =
    new Blob(
      [
        response.data,
      ],
      {
        type:
          contentType,
      }
    );

  const url =
    window.URL.createObjectURL(
      blob
    );

  const link =
    document.createElement(
      "a"
    );

  link.href =
    url;

  link.download =
    fileName;

  document.body.appendChild(
    link
  );

  link.click();

  document.body.removeChild(
    link
  );

  window.URL.revokeObjectURL(
    url
  );
}

function getDefaultFileName(
  format:
    AuditLogExportRequest["exportFormat"]
): string {
  switch (
    format
  ) {
    case "PDF":
      return "audit_logs.pdf";

    case "EXCEL":
      return "audit_logs.xlsx";

    case "CSV":
      return "audit_logs.csv";

    default:
      return "audit_logs";
  }
}

function getContentType(
  format:
    AuditLogExportRequest["exportFormat"]
): string {
  switch (
    format
  ) {
    case "PDF":
      return "application/pdf";

    case "EXCEL":
      return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    case "CSV":
      return "text/csv";

    default:
      return "application/octet-stream";
  }
}