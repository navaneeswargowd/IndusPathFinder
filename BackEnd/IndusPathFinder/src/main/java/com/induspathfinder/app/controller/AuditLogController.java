package com.induspathfinder.app.controller;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.induspathfinder.app.constants.MessageConstants;
import com.induspathfinder.app.dto.request.AuditLogDetailsRequest;
import com.induspathfinder.app.dto.request.AuditLogExportRequest;
import com.induspathfinder.app.dto.request.AuditLogSearchRequest;
import com.induspathfinder.app.dto.response.ApiResponse;
import com.induspathfinder.app.dto.response.AuditLogResponse;
import com.induspathfinder.app.dto.response.PageResponse;
import com.induspathfinder.app.dto.response.ReportResponse;
import com.induspathfinder.app.service.AuditLogService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/audit-logs")
public class AuditLogController {

    private final AuditLogService auditLogService;

    public AuditLogController(
            AuditLogService auditLogService) {

        this.auditLogService = auditLogService;
    }

    @PostMapping("/details")
    public ResponseEntity<
            ApiResponse<AuditLogResponse>>
    getAuditLogDetails(
            @Valid
            @RequestBody
            AuditLogDetailsRequest request) {

        AuditLogResponse response =
                auditLogService
                        .getAuditLogDetails(request);

        return ResponseEntity.ok(
                ApiResponse.success(
                        MessageConstants
                                .AUDIT_LOG_FETCHED,
                        response));
    }

    @PostMapping("/search")
    public ResponseEntity<
            ApiResponse<
                    PageResponse<AuditLogResponse>>>
    searchAuditLogs(
            @Valid
            @RequestBody
            AuditLogSearchRequest request) {

        Page<AuditLogResponse> page =
                auditLogService
                        .searchAuditLogs(request);

        PageResponse<AuditLogResponse>
                pageResponse =
                PageResponse.from(page);

        return ResponseEntity.ok(
                ApiResponse.success(
                        MessageConstants
                                .AUDIT_LOGS_FETCHED,
                        pageResponse));
    }

    @PostMapping("/export")
    public ResponseEntity<byte[]> exportAuditLogs(
            @Valid
            @RequestBody
            AuditLogExportRequest request) {

        ReportResponse report =
                auditLogService
                        .exportAuditLogs(request);

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\""
                                + report.getFileName()
                                + "\"")
                .header(
                        HttpHeaders.CONTENT_TYPE,
                        report.getContentType())
                .body(report.getFileData());
    }
}