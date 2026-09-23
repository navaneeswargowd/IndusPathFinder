package com.induspathfinder.app.service;

import org.springframework.data.domain.Page;

import com.induspathfinder.app.dto.request.AuditLogDetailsRequest;
import com.induspathfinder.app.dto.request.AuditLogExportRequest;
import com.induspathfinder.app.dto.request.AuditLogSearchRequest;
import com.induspathfinder.app.dto.response.AuditLogResponse;
import com.induspathfinder.app.dto.response.ReportResponse;

public interface AuditLogService {

    void saveAuditLog(
            String actionName,
            String actionScreen,
            Long actionScreenId,
            Long userId,
            String username,
            String details);

    AuditLogResponse getAuditLogDetails(
            AuditLogDetailsRequest request);

    Page<AuditLogResponse> searchAuditLogs(
            AuditLogSearchRequest request);

    ReportResponse exportAuditLogs(
            AuditLogExportRequest request);
}