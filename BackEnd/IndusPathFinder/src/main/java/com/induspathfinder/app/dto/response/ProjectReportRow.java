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
public class ProjectReportRow {

    private Long projectId;

    private String projectCode;

    private String projectName;

    private String description;

    private String startDate;

    private String endDate;

    private String priority;

    private String status;

    private String createdBy;

    private String createdOn;
}