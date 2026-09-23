package com.induspathfinder.app.service;

import com.induspathfinder.app.dto.response.CpmReportData;
import com.induspathfinder.app.dto.response.FloatReportData;

public interface AnalysisReportProvider {

    CpmReportData getCpmReportData(Long projectId);

    FloatReportData getFloatReportData(Long projectId);
}