package com.induspathfinder.app.dto.response;

import java.util.List;

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
public class FloatReportData {

    private Long projectId;

    private String projectCode;

    private String projectName;

    private List<FloatReportRow> activities;
}