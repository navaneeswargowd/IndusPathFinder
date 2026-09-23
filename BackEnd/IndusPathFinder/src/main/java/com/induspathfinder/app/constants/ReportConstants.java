package com.induspathfinder.app.constants;

public final class ReportConstants {

    private ReportConstants() {
        throw new IllegalStateException("Constants class cannot be instantiated");
    }

    public static final String REPORTS_DIRECTORY =
            "reports/";

    public static final String PROJECT_REPORT_TEMPLATE =
            "reports/ProjectReport.jrxml";

    public static final String ACTIVITY_REPORT_TEMPLATE =
            "reports/ActivityReport.jrxml";

    public static final String DEPENDENCY_REPORT_TEMPLATE =
            "reports/DependencyReport.jrxml";

    public static final String CPM_REPORT_TEMPLATE =
            "reports/CPMReport.jrxml";

    public static final String FLOAT_REPORT_TEMPLATE =
            "reports/FloatReport.jrxml";

    public static final String PROJECT_REPORT_FILE_NAME =
            "project-report";

    public static final String ACTIVITY_REPORT_FILE_NAME =
            "activity-report";

    public static final String DEPENDENCY_REPORT_FILE_NAME =
            "dependency-report";

    public static final String CPM_REPORT_FILE_NAME =
            "cpm-report";

    public static final String FLOAT_REPORT_FILE_NAME =
            "float-report";

    public static final String PDF_EXTENSION = ".pdf";
    public static final String EXCEL_EXTENSION = ".xlsx";
    public static final String CSV_EXTENSION = ".csv";

    public static final String PDF_CONTENT_TYPE =
            "application/pdf";

    public static final String EXCEL_CONTENT_TYPE =
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    public static final String CSV_CONTENT_TYPE =
            "text/csv";
    public static final String AUDIT_LOG_REPORT_TEMPLATE =
            "reports/AuditLogReport.jrxml";

    public static final String AUDIT_LOG_REPORT_FILE_NAME =
            "audit-log-report";
}
