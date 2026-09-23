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
public class DependencyReportRow {

    private Long dependencyId;

    private Long projectId;

    private String projectCode;

    private Long predecessorActivityId;

    private String predecessorActivityCode;

    private String predecessorActivityName;

    private Long successorActivityId;

    private String successorActivityCode;

    private String successorActivityName;

    private String dependencyType;
}