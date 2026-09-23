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
public class ActivityReportRow {

    private Long activityId;

    private Long projectId;

    private String projectCode;

    private String activityCode;

    private String activityName;

    private String description;

    private Integer duration;

    private String startDate;

    private String endDate;

    private String priority;

    private String status;
}