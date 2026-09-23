package com.induspathfinder.app.serviceimpl;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.induspathfinder.app.aop.AuditAction;
import com.induspathfinder.app.constants.MessageConstants;
import com.induspathfinder.app.constants.ReportConstants;
import com.induspathfinder.app.dto.request.NotificationCreateRequest;
import com.induspathfinder.app.dto.request.ReportRequest;
import com.induspathfinder.app.dto.response.ActivityReportRow;
import com.induspathfinder.app.dto.response.CpmReportData;
import com.induspathfinder.app.dto.response.CpmReportRow;
import com.induspathfinder.app.dto.response.DependencyReportRow;
import com.induspathfinder.app.dto.response.FloatReportData;
import com.induspathfinder.app.dto.response.FloatReportRow;
import com.induspathfinder.app.dto.response.ProjectReportRow;
import com.induspathfinder.app.dto.response.ReportResponse;
import com.induspathfinder.app.entity.Activity;
import com.induspathfinder.app.entity.Dependency;
import com.induspathfinder.app.entity.Project;
import com.induspathfinder.app.entity.User;
import com.induspathfinder.app.enums.ExportFormat;
import com.induspathfinder.app.enums.ReportType;
import com.induspathfinder.app.exception.BadRequestException;
import com.induspathfinder.app.exception.ReportGenerationException;
import com.induspathfinder.app.exception.ResourceNotFoundException;
import com.induspathfinder.app.repository.ActivityRepository;
import com.induspathfinder.app.repository.DependencyRepository;
import com.induspathfinder.app.repository.ProjectRepository;
import com.induspathfinder.app.service.AnalysisReportProvider;
import com.induspathfinder.app.service.NotificationService;
import com.induspathfinder.app.service.ReportService;
import com.induspathfinder.app.util.CsvUtil;
import com.induspathfinder.app.util.CurrentUserUtil;
import com.induspathfinder.app.util.DateUtil;
import com.induspathfinder.app.util.ExcelUtil;
import com.induspathfinder.app.util.JasperUtil;

@Service
public class ReportServiceImpl implements ReportService {

    private static final Logger LOGGER =
            LogManager.getLogger(ReportServiceImpl.class);

    private final ProjectRepository projectRepository;

    private final ActivityRepository activityRepository;

    private final DependencyRepository dependencyRepository;

    /*
     * ObjectProvider allows the application to start even when
     * Developer 3's AnalysisReportProvider implementation is
     * not yet available.
     */
    private final ObjectProvider<AnalysisReportProvider>
            analysisReportProvider;

    private final NotificationService notificationService;

    private final CurrentUserUtil currentUserUtil;

    public ReportServiceImpl(
            ProjectRepository projectRepository,
            ActivityRepository activityRepository,
            DependencyRepository dependencyRepository,
            ObjectProvider<AnalysisReportProvider>
                    analysisReportProvider,
            NotificationService notificationService,
            CurrentUserUtil currentUserUtil) {

        this.projectRepository = projectRepository;
        this.activityRepository = activityRepository;
        this.dependencyRepository = dependencyRepository;
        this.analysisReportProvider = analysisReportProvider;
        this.notificationService = notificationService;
        this.currentUserUtil = currentUserUtil;
    }

    @Override
    @Transactional
    @AuditAction(
        actionName = "GENERATE_REPORT",
        actionScreen = "REPORTS",
        actionScreenId = "#request.projectId",
        userId = "@currentUserUtil.getCurrentUserId()",
        username = "@currentUserUtil.getCurrentUserName()",
        details = "Report generated successfully"
    )
    public ReportResponse generateReport(
            ReportRequest request) {

        validateRequest(request);

        validateProjectExists(
                request.getProjectId());

        ReportResponse response =
                switch (request.getReportType()) {

                    case PROJECT ->
                            generateProjectReport(request);

                    case ACTIVITY ->
                            generateActivityReport(request);

                    case DEPENDENCY ->
                            generateDependencyReport(request);

                    case CPM ->
                            generateCpmReport(request);

                    case FLOAT ->
                            generateFloatReport(request);
                };

        createReportGeneratedNotification(
                request);

        LOGGER.info(
                "Report generated successfully. "
                        + "projectId={}, reportType={}, "
                        + "exportFormat={}, fileName={}",
                request.getProjectId(),
                request.getReportType(),
                request.getExportFormat(),
                response.getFileName());

        return response;
    }

    // =====================================================
    // PROJECT REPORT
    // =====================================================

    private ReportResponse generateProjectReport(
            ReportRequest request) {

        Project project =
                projectRepository
                        .findById(request.getProjectId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        MessageConstants
                                                .PROJECT_NOT_FOUND));

        ProjectReportRow row =
                mapProjectToReportRow(project);

        List<ProjectReportRow> rows =
                List.of(row);

        Map<String, Object> parameters =
                createBaseParameters(
                        "Project Report",
                        request);

        parameters.put(
                "projectCode",
                safeValue(project.getProjectCode()));

        parameters.put(
                "projectName",
                safeValue(project.getProjectName()));

        return exportProjectReport(
                rows,
                parameters,
                request.getExportFormat());
    }

    private ProjectReportRow mapProjectToReportRow(
            Project project) {

        return ProjectReportRow.builder()
                .projectId(project.getProjectId())
                .projectCode(project.getProjectCode())
                .projectName(project.getProjectName())
                .description(project.getDescription())
                .startDate(
                        DateUtil.formatDate(
                                project.getStartDate()))
                .endDate(
                        DateUtil.formatDate(
                                project.getEndDate()))
                .priority(
                        project.getPriority() == null
                                ? null
                                : project.getPriority().name())
                .status(
                        project.getStatus() == null
                                ? null
                                : project.getStatus().name())
                .build();
    }

    // =====================================================
    // ACTIVITY REPORT
    // =====================================================

    private ReportResponse generateActivityReport(
            ReportRequest request) {

        List<Activity> activities =
                activityRepository
                        .findByProjectProjectIdOrderByActCodeAsc(
                                request.getProjectId());

        if (activities == null
                || activities.isEmpty()) {

            throw new ResourceNotFoundException(
                    "No activities found for project ID: "
                            + request.getProjectId());
        }

        List<ActivityReportRow> rows =
                activities.stream()
                        .map(this::mapActivityToReportRow)
                        .toList();

        validateReportData(rows);

        Map<String, Object> parameters =
                createBaseParameters(
                        "Activity Report",
                        request);

        Project project =
                activities.get(0).getProject();

        parameters.put(
                "projectCode",
                project == null
                        ? ""
                        : safeValue(
                                project.getProjectCode()));

        parameters.put(
                "projectName",
                project == null
                        ? ""
                        : safeValue(
                                project.getProjectName()));

        return exportActivityReport(
                rows,
                parameters,
                request.getExportFormat());
    }

    private ActivityReportRow mapActivityToReportRow(
            Activity activity) {

        Project project =
                activity.getProject();

        return ActivityReportRow.builder()
                .activityId(activity.getActId())
                .projectId(
                        project == null
                                ? null
                                : project.getProjectId())
                .projectCode(
                        project == null
                                ? null
                                : project.getProjectCode())
                .activityCode(activity.getActCode())
                .activityName(activity.getActName())
                .description(activity.getDescription())
                .duration(activity.getDuration())
                .startDate(
                        DateUtil.formatDate(
                                activity.getStartDate()))
                .endDate(
                        DateUtil.formatDate(
                                activity.getEndDate()))
                .priority(
                        activity.getPriority() == null
                                ? null
                                : activity.getPriority().name())
                .status(
                        activity.getStatus() == null
                                ? null
                                : activity.getStatus().name())
                .build();
    }

    // =====================================================
    // DEPENDENCY REPORT
    // =====================================================

    private ReportResponse generateDependencyReport(
            ReportRequest request) {

        /*
         * Your Dependency entity currently contains:
         *
         * private Project projectId;
         *
         * Therefore the repository property path is:
         *
         * projectId.projectId
         */
        List<Dependency> dependencies =
                dependencyRepository
                        .findByProjectProjectIdOrderByDependencyIdAsc(
                                request.getProjectId());

        if (dependencies == null
                || dependencies.isEmpty()) {

            throw new ResourceNotFoundException(
                    "No dependencies found for project ID: "
                            + request.getProjectId());
        }

        List<DependencyReportRow> rows =
                dependencies.stream()
                        .map(this::mapDependencyToReportRow)
                        .toList();

        validateReportData(rows);

        Map<String, Object> parameters =
                createBaseParameters(
                        "Dependency Report",
                        request);

        Project project =
                dependencies.get(0).getProject();

        parameters.put(
                "projectCode",
                project == null
                        ? ""
                        : safeValue(
                                project.getProjectCode()));

        parameters.put(
                "projectName",
                project == null
                        ? ""
                        : safeValue(
                                project.getProjectName()));

        return exportDependencyReport(
                rows,
                parameters,
                request.getExportFormat());
    }

    private DependencyReportRow mapDependencyToReportRow(
            Dependency dependency) {

        Project project =
                dependency.getProject();

        Activity predecessor =
                dependency.getPredecessorActivity();

        Activity successor =
                dependency.getSuccessorActivity();

        return DependencyReportRow.builder()
                .dependencyId(
                        dependency.getDependencyId())
                .projectId(
                        project == null
                                ? null
                                : project.getProjectId())
                .projectCode(
                        project == null
                                ? null
                                : project.getProjectCode())
                .predecessorActivityId(
                        predecessor == null
                                ? null
                                : predecessor.getActId())
                .predecessorActivityCode(
                        predecessor == null
                                ? null
                                : predecessor.getActCode())
                .predecessorActivityName(
                        predecessor == null
                                ? null
                                : predecessor.getActName())
                .successorActivityId(
                        successor == null
                                ? null
                                : successor.getActId())
                .successorActivityCode(
                        successor == null
                                ? null
                                : successor.getActCode())
                .successorActivityName(
                        successor == null
                                ? null
                                : successor.getActName())
                .dependencyType(
                        dependency.getDependencyType() == null
                                ? null
                                : dependency
                                        .getDependencyType()
                                        .name())
                .build();
    }

    // =====================================================
    // CPM REPORT
    // =====================================================

    private ReportResponse generateCpmReport(
            ReportRequest request) {

        AnalysisReportProvider provider =
                getAnalysisReportProvider();

        /*
         * The provider calls Developer 3's CPM service.
         *
         * CPM data is calculated dynamically from Project,
         * Activity and Dependency records. No CPM table is
         * required.
         */
        CpmReportData reportData =
                provider.getCpmReportData(
                        request.getProjectId());

        if (reportData == null
                || reportData.getActivities() == null
                || reportData.getActivities().isEmpty()) {

            throw new ResourceNotFoundException(
                    MessageConstants
                            .REPORT_DATA_NOT_FOUND);
        }

        Map<String, Object> parameters =
                createBaseParameters(
                        "CPM Analysis Report",
                        request);

        parameters.put(
                "projectCode",
                safeValue(
                        reportData.getProjectCode()));

        parameters.put(
                "projectName",
                safeValue(
                        reportData.getProjectName()));

        parameters.put(
                "projectDuration",
                reportData.getProjectDuration());

        parameters.put(
                "criticalPath",
                reportData.getCriticalPath() == null
                        ? ""
                        : String.join(
                                " → ",
                                reportData.getCriticalPath()));

        return exportCpmReport(
                reportData.getActivities(),
                parameters,
                request.getExportFormat());
    }

    // =====================================================
    // FLOAT REPORT
    // =====================================================

    private ReportResponse generateFloatReport(
            ReportRequest request) {

        AnalysisReportProvider provider =
                getAnalysisReportProvider();

        /*
         * Float values are also calculated dynamically by
         * Developer 3's analysis service.
         */
        FloatReportData reportData =
                provider.getFloatReportData(
                        request.getProjectId());

        if (reportData == null
                || reportData.getActivities() == null
                || reportData.getActivities().isEmpty()) {

            throw new ResourceNotFoundException(
                    MessageConstants
                            .REPORT_DATA_NOT_FOUND);
        }

        Map<String, Object> parameters =
                createBaseParameters(
                        "Float Analysis Report",
                        request);

        parameters.put(
                "projectCode",
                safeValue(
                        reportData.getProjectCode()));

        parameters.put(
                "projectName",
                safeValue(
                        reportData.getProjectName()));

        return exportFloatReport(
                reportData.getActivities(),
                parameters,
                request.getExportFormat());
    }

    // =====================================================
    // PROJECT EXPORT
    // =====================================================

    private ReportResponse exportProjectReport(
            List<ProjectReportRow> rows,
            Map<String, Object> parameters,
            ExportFormat exportFormat) {

        return switch (exportFormat) {

            case PDF ->
                    createPdfResponse(
                            ReportType.PROJECT,
                            ReportConstants
                                    .PROJECT_REPORT_TEMPLATE,
                            ReportConstants
                                    .PROJECT_REPORT_FILE_NAME,
                            parameters,
                            rows);

            case EXCEL ->
                    createExcelResponse(
                            ReportType.PROJECT,
                            ReportConstants
                                    .PROJECT_REPORT_FILE_NAME,
                            "Projects",
                            projectHeaders(),
                            rows.stream()
                                    .map(this::projectExportRow)
                                    .toList());

            case CSV ->
                    createCsvResponse(
                            ReportType.PROJECT,
                            ReportConstants
                                    .PROJECT_REPORT_FILE_NAME,
                            projectHeaders(),
                            rows.stream()
                                    .map(this::projectExportRow)
                                    .toList());
        };
    }

    // =====================================================
    // ACTIVITY EXPORT
    // =====================================================

    private ReportResponse exportActivityReport(
            List<ActivityReportRow> rows,
            Map<String, Object> parameters,
            ExportFormat exportFormat) {

        return switch (exportFormat) {

            case PDF ->
                    createPdfResponse(
                            ReportType.ACTIVITY,
                            ReportConstants
                                    .ACTIVITY_REPORT_TEMPLATE,
                            ReportConstants
                                    .ACTIVITY_REPORT_FILE_NAME,
                            parameters,
                            rows);

            case EXCEL ->
                    createExcelResponse(
                            ReportType.ACTIVITY,
                            ReportConstants
                                    .ACTIVITY_REPORT_FILE_NAME,
                            "Activities",
                            activityHeaders(),
                            rows.stream()
                                    .map(this::activityExportRow)
                                    .toList());

            case CSV ->
                    createCsvResponse(
                            ReportType.ACTIVITY,
                            ReportConstants
                                    .ACTIVITY_REPORT_FILE_NAME,
                            activityHeaders(),
                            rows.stream()
                                    .map(this::activityExportRow)
                                    .toList());
        };
    }

    // =====================================================
    // DEPENDENCY EXPORT
    // =====================================================

    private ReportResponse exportDependencyReport(
            List<DependencyReportRow> rows,
            Map<String, Object> parameters,
            ExportFormat exportFormat) {

        return switch (exportFormat) {

            case PDF ->
                    createPdfResponse(
                            ReportType.DEPENDENCY,
                            ReportConstants
                                    .DEPENDENCY_REPORT_TEMPLATE,
                            ReportConstants
                                    .DEPENDENCY_REPORT_FILE_NAME,
                            parameters,
                            rows);

            case EXCEL ->
                    createExcelResponse(
                            ReportType.DEPENDENCY,
                            ReportConstants
                                    .DEPENDENCY_REPORT_FILE_NAME,
                            "Dependencies",
                            dependencyHeaders(),
                            rows.stream()
                                    .map(this::dependencyExportRow)
                                    .toList());

            case CSV ->
                    createCsvResponse(
                            ReportType.DEPENDENCY,
                            ReportConstants
                                    .DEPENDENCY_REPORT_FILE_NAME,
                            dependencyHeaders(),
                            rows.stream()
                                    .map(this::dependencyExportRow)
                                    .toList());
        };
    }

    // =====================================================
    // CPM EXPORT
    // =====================================================

    private ReportResponse exportCpmReport(
            List<CpmReportRow> rows,
            Map<String, Object> parameters,
            ExportFormat exportFormat) {

        return switch (exportFormat) {

            case PDF ->
                    createPdfResponse(
                            ReportType.CPM,
                            ReportConstants
                                    .CPM_REPORT_TEMPLATE,
                            ReportConstants
                                    .CPM_REPORT_FILE_NAME,
                            parameters,
                            rows);

            case EXCEL ->
                    createExcelResponse(
                            ReportType.CPM,
                            ReportConstants
                                    .CPM_REPORT_FILE_NAME,
                            "CPM Analysis",
                            cpmHeaders(),
                            rows.stream()
                                    .map(this::cpmExportRow)
                                    .toList());

            case CSV ->
                    createCsvResponse(
                            ReportType.CPM,
                            ReportConstants
                                    .CPM_REPORT_FILE_NAME,
                            cpmHeaders(),
                            rows.stream()
                                    .map(this::cpmExportRow)
                                    .toList());
        };
    }

    // =====================================================
    // FLOAT EXPORT
    // =====================================================

    private ReportResponse exportFloatReport(
            List<FloatReportRow> rows,
            Map<String, Object> parameters,
            ExportFormat exportFormat) {

        return switch (exportFormat) {

            case PDF ->
                    createPdfResponse(
                            ReportType.FLOAT,
                            ReportConstants
                                    .FLOAT_REPORT_TEMPLATE,
                            ReportConstants
                                    .FLOAT_REPORT_FILE_NAME,
                            parameters,
                            rows);

            case EXCEL ->
                    createExcelResponse(
                            ReportType.FLOAT,
                            ReportConstants
                                    .FLOAT_REPORT_FILE_NAME,
                            "Float Analysis",
                            floatHeaders(),
                            rows.stream()
                                    .map(this::floatExportRow)
                                    .toList());

            case CSV ->
                    createCsvResponse(
                            ReportType.FLOAT,
                            ReportConstants
                                    .FLOAT_REPORT_FILE_NAME,
                            floatHeaders(),
                            rows.stream()
                                    .map(this::floatExportRow)
                                    .toList());
        };
    }

    // =====================================================
    // COMMON EXPORT METHODS
    // =====================================================

    private ReportResponse createPdfResponse(
            ReportType reportType,
            String templatePath,
            String baseFileName,
            Map<String, Object> parameters,
            List<?> reportRows) {

        byte[] fileData =
                JasperUtil.generatePdf(
                        templatePath,
                        parameters,
                        reportRows);

        return buildReportResponse(
                baseFileName
                        + ReportConstants.PDF_EXTENSION,
                ReportConstants.PDF_CONTENT_TYPE,
                fileData,
                reportType,
                ExportFormat.PDF);
    }

    private ReportResponse createExcelResponse(
            ReportType reportType,
            String baseFileName,
            String sheetName,
            List<String> headers,
            List<List<Object>> rows) {

        byte[] fileData =
                ExcelUtil.generateExcel(
                        sheetName,
                        headers,
                        rows);

        return buildReportResponse(
                baseFileName
                        + ReportConstants.EXCEL_EXTENSION,
                ReportConstants.EXCEL_CONTENT_TYPE,
                fileData,
                reportType,
                ExportFormat.EXCEL);
    }

    private ReportResponse createCsvResponse(
            ReportType reportType,
            String baseFileName,
            List<String> headers,
            List<List<Object>> rows) {

        byte[] fileData =
                CsvUtil.generateCsv(
                        headers,
                        rows);

        return buildReportResponse(
                baseFileName
                        + ReportConstants.CSV_EXTENSION,
                ReportConstants.CSV_CONTENT_TYPE,
                fileData,
                reportType,
                ExportFormat.CSV);
    }

    private ReportResponse buildReportResponse(
            String fileName,
            String contentType,
            byte[] fileData,
            ReportType reportType,
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
                .reportType(reportType)
                .exportFormat(exportFormat)
                .build();
    }

    // =====================================================
    // PROJECT HEADERS AND EXPORT ROW
    // =====================================================

    private List<String> projectHeaders() {

        return List.of(
                "Project ID",
                "Project Code",
                "Project Name",
                "Description",
                "Start Date",
                "End Date",
                "Priority",
                "Status"
        );
    }

    private List<Object> projectExportRow(
            ProjectReportRow row) {

        return Arrays.asList(
                row.getProjectId(),
                row.getProjectCode(),
                row.getProjectName(),
                row.getDescription(),
                row.getStartDate(),
                row.getEndDate(),
                row.getPriority(),
                row.getStatus()
        );
    }

    // =====================================================
    // ACTIVITY HEADERS AND EXPORT ROW
    // =====================================================

    private List<String> activityHeaders() {

        return List.of(
                "Activity ID",
                "Project ID",
                "Project Code",
                "Activity Code",
                "Activity Name",
                "Description",
                "Duration",
                "Start Date",
                "End Date",
                "Priority",
                "Status"
        );
    }

    private List<Object> activityExportRow(
            ActivityReportRow row) {

        return Arrays.asList(
                row.getActivityId(),
                row.getProjectId(),
                row.getProjectCode(),
                row.getActivityCode(),
                row.getActivityName(),
                row.getDescription(),
                row.getDuration(),
                row.getStartDate(),
                row.getEndDate(),
                row.getPriority(),
                row.getStatus()
        );
    }

    // =====================================================
    // DEPENDENCY HEADERS AND EXPORT ROW
    // =====================================================

    private List<String> dependencyHeaders() {

        return List.of(
                "Dependency ID",
                "Project ID",
                "Project Code",
                "Predecessor ID",
                "Predecessor Code",
                "Predecessor Name",
                "Successor ID",
                "Successor Code",
                "Successor Name",
                "Dependency Type"
        );
    }

    private List<Object> dependencyExportRow(
            DependencyReportRow row) {

        return Arrays.asList(
                row.getDependencyId(),
                row.getProjectId(),
                row.getProjectCode(),
                row.getPredecessorActivityId(),
                row.getPredecessorActivityCode(),
                row.getPredecessorActivityName(),
                row.getSuccessorActivityId(),
                row.getSuccessorActivityCode(),
                row.getSuccessorActivityName(),
                row.getDependencyType()
        );
    }

    // =====================================================
    // CPM HEADERS AND EXPORT ROW
    // =====================================================

    private List<String> cpmHeaders() {

        return List.of(
                "Activity ID",
                "Activity Code",
                "Activity Name",
                "Duration",
                "EST",
                "EFT",
                "LST",
                "LFT",
                "Critical"
        );
    }

    private List<Object> cpmExportRow(
            CpmReportRow row) {

        return Arrays.asList(
                row.getActivityId(),
                row.getActivityCode(),
                row.getActivityName(),
                row.getDuration(),
                row.getEarliestStart(),
                row.getEarliestFinish(),
                row.getLatestStart(),
                row.getLatestFinish(),
                row.getCritical()
        );
    }

    // =====================================================
    // FLOAT HEADERS AND EXPORT ROW
    // =====================================================

    private List<String> floatHeaders() {

        return List.of(
                "Activity ID",
                "Activity Code",
                "Activity Name",
                "Total Float",
                "Free Float",
                "Independent Float",
                "Critical"
        );
    }

    private List<Object> floatExportRow(
            FloatReportRow row) {

        return Arrays.asList(
                row.getActivityId(),
                row.getActivityCode(),
                row.getActivityName(),
                row.getTotalFloat(),
                row.getFreeFloat(),
                row.getIndependentFloat(),
                row.getCritical()
        );
    }

    // =====================================================
    // NOTIFICATION
    // =====================================================

    private void createReportGeneratedNotification(
            ReportRequest request) {

        User currentUser =
                currentUserUtil.getCurrentUser();

        notificationService.createNotification(
                NotificationCreateRequest.builder()
                        .userId(currentUser.getUserId())
                        .title("Report Generated")
                        .message(
                                request.getReportType()
                                        + " report for Project ID "
                                        + request.getProjectId()
                                        + " was generated successfully in "
                                        + request.getExportFormat()
                                        + " format.")
                        .build());
    }

    // =====================================================
    // VALIDATION
    // =====================================================

    private void validateRequest(
            ReportRequest request) {

        if (request == null) {

            throw new BadRequestException(
                    MessageConstants.INVALID_REQUEST);
        }

        if (request.getProjectId() == null
                || request.getProjectId() <= 0) {

            throw new BadRequestException(
                    "Valid Project ID is required");
        }

        if (request.getReportType() == null) {

            throw new BadRequestException(
                    "Report type is required");
        }

        if (request.getExportFormat() == null) {

            throw new BadRequestException(
                    "Export format is required");
        }
    }

    private void validateProjectExists(
            Long projectId) {

        if (!projectRepository.existsById(projectId)) {

            throw new ResourceNotFoundException(
                    MessageConstants.PROJECT_NOT_FOUND);
        }
    }

    private void validateReportData(
            List<?> rows) {

        if (rows == null || rows.isEmpty()) {

            throw new ResourceNotFoundException(
                    MessageConstants
                            .REPORT_DATA_NOT_FOUND);
        }
    }

    // =====================================================
    // REPORT PARAMETERS
    // =====================================================

    private Map<String, Object> createBaseParameters(
            String reportTitle,
            ReportRequest request) {

        Map<String, Object> parameters =
                new HashMap<>();

        parameters.put(
                "reportTitle",
                reportTitle);

        parameters.put(
                "projectId",
                request.getProjectId());

        return parameters;
    }

    // =====================================================
    // ANALYSIS PROVIDER
    // =====================================================

    private AnalysisReportProvider
    getAnalysisReportProvider() {

        AnalysisReportProvider provider =
                analysisReportProvider
                        .getIfAvailable();

        if (provider == null) {

            throw new ReportGenerationException(
                    MessageConstants
                            .ANALYSIS_SERVICE_NOT_AVAILABLE);
        }

        return provider;
    }

    private String safeValue(
            String value) {

        return value == null
                ? ""
                : value;
    }
}