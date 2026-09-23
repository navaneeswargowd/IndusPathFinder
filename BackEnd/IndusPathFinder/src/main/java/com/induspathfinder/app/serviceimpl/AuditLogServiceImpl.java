package com.induspathfinder.app.serviceimpl;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.induspathfinder.app.constants.MessageConstants;
import com.induspathfinder.app.constants.ReportConstants;
import com.induspathfinder.app.dto.request.AuditLogDetailsRequest;
import com.induspathfinder.app.dto.request.AuditLogExportRequest;
import com.induspathfinder.app.dto.request.AuditLogSearchRequest;
import com.induspathfinder.app.dto.response.AuditLogReportRow;
import com.induspathfinder.app.dto.response.AuditLogResponse;
import com.induspathfinder.app.dto.response.ReportResponse;
import com.induspathfinder.app.entity.AuditLog;
import com.induspathfinder.app.entity.User;
import com.induspathfinder.app.enums.ExportFormat;
import com.induspathfinder.app.exception.BadRequestException;
import com.induspathfinder.app.exception.ReportGenerationException;
import com.induspathfinder.app.exception.ResourceNotFoundException;
import com.induspathfinder.app.mapper.AuditLogMapper;
import com.induspathfinder.app.repository.AuditLogRepository;
import com.induspathfinder.app.repository.UserRepository;
import com.induspathfinder.app.service.AuditLogService;
import com.induspathfinder.app.specification.AuditLogSpecification;
import com.induspathfinder.app.util.CsvUtil;
import com.induspathfinder.app.util.ExcelUtil;
import com.induspathfinder.app.util.JasperUtil;
import com.induspathfinder.app.util.PaginationUtil;

@Service
public class AuditLogServiceImpl
        implements AuditLogService {

    private static final Logger LOGGER =
            LogManager.getLogger(
                    AuditLogServiceImpl.class);

    private static final String DEFAULT_SORT_FIELD =
            "actionDate";

    private static final String AUDIT_SHEET_NAME =
            "Audit Logs";

    private final AuditLogRepository auditLogRepository;

    private final AuditLogMapper auditLogMapper;
    
    private final UserRepository userRepository;

    public AuditLogServiceImpl(
            AuditLogRepository auditLogRepository,
            AuditLogMapper auditLogMapper,
            UserRepository userRepository) {

        this.auditLogRepository =
                auditLogRepository;

        this.auditLogMapper =
                auditLogMapper;

        this.userRepository =
                userRepository;
    }

    @Override
    @Transactional(
        propagation = Propagation.REQUIRES_NEW
    )
    public void saveAuditLog(
            String actionName,
            String actionScreen,
            Long actionScreenId,
            Long userId,
            String username,
            String details) {

        User user = null;

        if (userId != null) {
            user = userRepository
                    .findById(userId)
                    .orElse(null);
        }

        AuditLog auditLog =
                auditLogMapper.toEntity(
                        actionName,
                        actionScreen,
                        actionScreenId,
                        user,
                        details);

        AuditLog savedAuditLog =
                auditLogRepository.save(auditLog);

        LOGGER.info(
                "Audit log stored. auditId={}, userId={}, username={}",
                savedAuditLog.getAuditId(),
                savedAuditLog.getUser() == null
                        ? null
                        : savedAuditLog.getUser().getUserId(),
                savedAuditLog.getUsername());
    }
    
    
    @Override
    @Transactional(readOnly = true)
    public AuditLogResponse getAuditLogDetails(
            AuditLogDetailsRequest request) {

        if (request == null) {
            throw new BadRequestException(
                    MessageConstants.INVALID_REQUEST);
        }

        AuditLog auditLog =
                auditLogRepository
                        .findById(request.getAuditId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        MessageConstants
                                                .AUDIT_LOG_NOT_FOUND));

        LOGGER.info(
                "Audit log details fetched. auditId={}",
                auditLog.getAuditId());

        return auditLogMapper.toResponse(auditLog);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AuditLogResponse> searchAuditLogs(
            AuditLogSearchRequest request) {

        if (request == null) {
            throw new BadRequestException(
                    MessageConstants.INVALID_REQUEST);
        }

        Specification<AuditLog> specification =
                AuditLogSpecification
                        .fromSearchRequest(request);

        String sortBy =
                request.getSortBy() == null
                        || request.getSortBy().isBlank()
                        ? DEFAULT_SORT_FIELD
                        : request.getSortBy().trim();

        Pageable pageable =
                PaginationUtil.createPageable(
                        request.getValidPage(),
                        request.getValidSize(),
                        sortBy,
                        request.getValidSortDirection());

        Page<AuditLog> auditLogPage =
                auditLogRepository.findAll(
                        specification,
                        pageable);

        LOGGER.info(
                "Audit logs searched. page={}, size={}, "
                        + "totalElements={}",
                auditLogPage.getNumber(),
                auditLogPage.getSize(),
                auditLogPage.getTotalElements());

        return auditLogPage.map(
                auditLogMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public ReportResponse exportAuditLogs(
            AuditLogExportRequest request) {

        if (request == null) {
            throw new BadRequestException(
                    MessageConstants.INVALID_REQUEST);
        }

        if (request.getExportFormat() == null) {
            throw new BadRequestException(
                    "Export format is required");
        }

        Specification<AuditLog> specification =
                AuditLogSpecification
                        .fromExportRequest(request);

        List<AuditLog> auditLogs =
                auditLogRepository.findAll(
                        specification,
                        Sort.by(
                                Sort.Direction.DESC,
                                DEFAULT_SORT_FIELD));

        if (auditLogs.isEmpty()) {
            throw new ResourceNotFoundException(
                    MessageConstants.REPORT_DATA_NOT_FOUND);
        }

        List<AuditLogReportRow> reportRows =
                auditLogs.stream()
                        .map(auditLogMapper::toReportRow)
                        .toList();

        ReportResponse reportResponse =
                switch (request.getExportFormat()) {

                    case PDF ->
                            generatePdf(reportRows);

                    case EXCEL ->
                            generateExcel(reportRows);

                    case CSV ->
                            generateCsv(reportRows);
                };

        LOGGER.info(
                "Audit logs exported successfully. "
                        + "format={}, recordCount={}, fileName={}",
                request.getExportFormat(),
                reportRows.size(),
                reportResponse.getFileName());

        return reportResponse;
    }

    private ReportResponse generatePdf(
            List<AuditLogReportRow> reportRows) {

        Map<String, Object> parameters =
                Map.of(
                        "reportTitle",
                        "Audit Log Report"
                );

        byte[] fileData =
                JasperUtil.generatePdf(
                        ReportConstants
                                .AUDIT_LOG_REPORT_TEMPLATE,
                        parameters,
                        reportRows);

        return buildReportResponse(
                ReportConstants
                        .AUDIT_LOG_REPORT_FILE_NAME
                        + ReportConstants.PDF_EXTENSION,
                ReportConstants.PDF_CONTENT_TYPE,
                fileData,
                ExportFormat.PDF);
    }

    private ReportResponse generateExcel(
            List<AuditLogReportRow> reportRows) {

        List<String> headers =
                getAuditHeaders();

        List<List<Object>> rows =
                reportRows.stream()
                        .map(this::toExportRow)
                        .toList();

        byte[] fileData =
                ExcelUtil.generateExcel(
                        AUDIT_SHEET_NAME,
                        headers,
                        rows);

        return buildReportResponse(
                ReportConstants
                        .AUDIT_LOG_REPORT_FILE_NAME
                        + ReportConstants.EXCEL_EXTENSION,
                ReportConstants.EXCEL_CONTENT_TYPE,
                fileData,
                ExportFormat.EXCEL);
    }

    private ReportResponse generateCsv(
            List<AuditLogReportRow> reportRows) {

        List<String> headers =
                getAuditHeaders();

        List<List<Object>> rows =
                reportRows.stream()
                        .map(this::toExportRow)
                        .toList();

        byte[] fileData =
                CsvUtil.generateCsv(
                        headers,
                        rows);

        return buildReportResponse(
                ReportConstants
                        .AUDIT_LOG_REPORT_FILE_NAME
                        + ReportConstants.CSV_EXTENSION,
                ReportConstants.CSV_CONTENT_TYPE,
                fileData,
                ExportFormat.CSV);
    }

    private List<String> getAuditHeaders() {

        return List.of(
                "Audit ID",
                "User ID",
                "Action Name",
                "Action Screen",
                "Action Screen ID",
                "Username",
                "Details",
                "Action Date"
        );
    }

    private List<Object> toExportRow(
            AuditLogReportRow row) {

        return Arrays.asList(
                row.getAuditId(),
                row.getUserId(),
                row.getActionName(),
                row.getActionScreen(),
                row.getActionScreenId(),
                row.getUsername(),
                row.getDetails(),
                row.getActionDate()
        );
    }

    private ReportResponse buildReportResponse(
            String fileName,
            String contentType,
            byte[] fileData,
            ExportFormat exportFormat) {

        if (fileData == null
                || fileData.length == 0) {

            throw new ReportGenerationException(
                    MessageConstants
                            .REPORT_GENERATION_FAILED);
        }

        return ReportResponse.builder()
                .fileName(fileName)
                .contentType(contentType)
                .fileData(fileData)
                .reportType(null)
                .exportFormat(exportFormat)
                .build();
    }

    private void validateAuditLog(
            AuditLog auditLog) {

        if (auditLog == null) {
            throw new BadRequestException(
                    "Audit log data cannot be null");
        }

        if (auditLog.getActionName() == null
                || auditLog.getActionName().isBlank()) {

            throw new BadRequestException(
                    "Audit action name is required");
        }

        if (auditLog.getActionScreen() == null
                || auditLog.getActionScreen().isBlank()) {

            throw new BadRequestException(
                    "Audit action screen is required");
        }

        if (auditLog.getUsername() == null
                || auditLog.getUsername().isBlank()) {

            throw new BadRequestException(
                    "Audit username is required");
        }
    }
}