package com.induspathfinder.app.dto.response;

import com.induspathfinder.app.enums.ExportFormat;
import com.induspathfinder.app.enums.ReportType;

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
public class ReportResponse {

    private String fileName;

    private String contentType;

    private byte[] fileData;

    private ReportType reportType;

    private ExportFormat exportFormat;
}