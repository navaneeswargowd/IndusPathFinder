package com.induspathfinder.app.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogReportRow {

    private Long auditId;

    private Long userId;

    private String actionName;

    private String actionScreen;

    private Long actionScreenId;

    private String username;

    private String details;

    private String actionDate;
}