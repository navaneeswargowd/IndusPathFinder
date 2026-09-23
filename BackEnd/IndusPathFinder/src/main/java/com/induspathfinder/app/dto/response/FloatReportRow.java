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
public class FloatReportRow {

    private Long activityId;

    private String activityCode;

    private String activityName;

    private Integer totalFloat;

    private Integer freeFloat;

    private Integer independentFloat;

    private Boolean critical;
}