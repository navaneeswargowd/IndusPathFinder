package com.induspathfinder.app.mapper;

import org.springframework.stereotype.Component;

import com.induspathfinder.app.dto.response.AuditLogReportRow;
import com.induspathfinder.app.dto.response.AuditLogResponse;
import com.induspathfinder.app.entity.AuditLog;
import com.induspathfinder.app.entity.User;
import com.induspathfinder.app.util.DateUtil;

@Component
public class AuditLogMapper {

    public AuditLogResponse toResponse(
            AuditLog auditLog) {

        if (auditLog == null) {
            return null;
        }

        return AuditLogResponse.builder()
                .auditId(auditLog.getAuditId())
                .userId(
                        auditLog.getUser() == null
                                ? null
                                : auditLog.getUser().getUserId())
                .actionName(auditLog.getActionName())
                .actionScreen(auditLog.getActionScreen())
                .actionScreenId(auditLog.getActionScreenId())
                .username(auditLog.getUsername())
                .details(auditLog.getDetails())
                .actionDate(auditLog.getActionDate())
                .build();
    }

    public AuditLog toEntity(
            String actionName,
            String actionScreen,
            Long actionScreenId,
            User user,
            String details) {

        String username =
                user == null
                        ? "SYSTEM"
                        : user.getUserName();

        return AuditLog.builder()
                .actionName(normalize(actionName))
                .actionScreen(normalize(actionScreen))
                .actionScreenId(actionScreenId)
                .user(user)
                .username(normalizeUsername(username))
                .details(normalizeDetails(details))
                .build();
    }

    public AuditLogReportRow toReportRow(
            AuditLog auditLog) {

        if (auditLog == null) {
            return null;
        }

        return AuditLogReportRow.builder()
                .auditId(auditLog.getAuditId())
                .userId(
                        auditLog.getUser() == null
                                ? null
                                : auditLog.getUser().getUserId())
                .actionName(auditLog.getActionName())
                .actionScreen(auditLog.getActionScreen())
                .actionScreenId(auditLog.getActionScreenId())
                .username(auditLog.getUsername())
                .details(auditLog.getDetails())
                .actionDate(
                        DateUtil.formatDateTime(
                                auditLog.getActionDate()))
                .build();
    }

    private String normalize(String value) {

        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim().toUpperCase();
    }

    private String normalizeUsername(
            String username) {

        if (username == null || username.isBlank()) {
            return "SYSTEM";
        }

        return username.trim();
    }

    private String normalizeDetails(
            String details) {

        if (details == null || details.isBlank()) {
            return null;
        }

        return details.trim();
    }
}