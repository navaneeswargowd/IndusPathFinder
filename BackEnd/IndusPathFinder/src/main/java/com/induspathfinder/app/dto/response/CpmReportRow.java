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
public class CpmReportRow {

    private Long activityId;

    private String activityCode;

    private String activityName;

    private Integer duration;

    private Integer earliestStart;

    private Integer earliestFinish;

    private Integer latestStart;

    private Integer latestFinish;

    private Boolean critical;
}