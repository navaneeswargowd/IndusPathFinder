package com.induspathfinder.app.service;

import com.induspathfinder.app.dto.request.ReportRequest;
import com.induspathfinder.app.dto.response.ReportResponse;

public interface ReportService {

    ReportResponse generateReport(
            ReportRequest request);
}