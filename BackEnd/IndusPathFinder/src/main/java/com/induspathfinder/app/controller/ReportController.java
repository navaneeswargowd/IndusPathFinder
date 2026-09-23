package com.induspathfinder.app.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.induspathfinder.app.dto.request.ReportRequest;
import com.induspathfinder.app.dto.response.ReportResponse;
import com.induspathfinder.app.service.ReportService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/reports")
@CrossOrigin(
    origins = "http://localhost:5173",
    exposedHeaders = {
        HttpHeaders.CONTENT_DISPOSITION,
        HttpHeaders.CONTENT_TYPE,
        "X-Report-Type",
        "X-Export-Format"
    }
)
public class ReportController {

    private final ReportService reportService;

    public ReportController(
            ReportService reportService) {

        this.reportService = reportService;
    }

    @PostMapping("/generate")
    public ResponseEntity<byte[]> generateReport(
            @Valid
            @RequestBody
            ReportRequest request) {

        ReportResponse report =
                reportService.generateReport(request);

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\""
                                + report.getFileName()
                                + "\"")
                .header(
                        HttpHeaders.CONTENT_TYPE,
                        report.getContentType())
                .header(
                        "X-Report-Type",
                        report.getReportType().name())
                .header(
                        "X-Export-Format",
                        report.getExportFormat().name())
                .body(report.getFileData());
    }
}