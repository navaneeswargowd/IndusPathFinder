package com.induspathfinder.app.constants;

public final class MessageConstants {

    private MessageConstants() {
        throw new IllegalStateException("Constants class cannot be instantiated");
    }

    // Common messages
    public static final String OPERATION_SUCCESSFUL =
            "Operation completed successfully";

    public static final String INVALID_REQUEST =
            "Invalid request";

    public static final String INTERNAL_SERVER_ERROR =
            "An unexpected error occurred";

    public static final String RESOURCE_NOT_FOUND =
            "Requested resource was not found";

    // Notification messages
    public static final String NOTIFICATION_CREATED =
            "Notification created successfully";

    public static final String NOTIFICATION_FETCHED =
            "Notification fetched successfully";

    public static final String NOTIFICATIONS_FETCHED =
            "Notifications fetched successfully";

    public static final String NOTIFICATION_MARKED_AS_READ =
            "Notification marked as read successfully";

    public static final String ALL_NOTIFICATIONS_MARKED_AS_READ =
            "All notifications marked as read successfully";

    public static final String NOTIFICATION_DELETED =
            "Notification deleted successfully";

    public static final String NOTIFICATION_NOT_FOUND =
            "Notification not found";

    // Audit log messages
    public static final String AUDIT_LOG_FETCHED =
            "Audit log fetched successfully";

    public static final String AUDIT_LOGS_FETCHED =
            "Audit logs fetched successfully";

    public static final String AUDIT_LOG_NOT_FOUND =
            "Audit log not found";

    public static final String AUDIT_LOG_EXPORT_SUCCESS =
            "Audit logs exported successfully";

    // Dashboard messages
    public static final String ADMIN_DASHBOARD_FETCHED =
            "Admin dashboard data fetched successfully";

    public static final String PROJECT_MANAGER_DASHBOARD_FETCHED =
            "Project Manager dashboard data fetched successfully";

    // Report messages
    public static final String REPORT_GENERATED =
            "Report generated successfully";

    public static final String REPORT_GENERATION_FAILED =
            "Report generation failed";

    public static final String REPORT_DATA_NOT_FOUND =
            "No data found for the requested report";

    public static final String UNSUPPORTED_EXPORT_FORMAT =
            "Unsupported report export format";
    

    public static final String PROJECT_NOT_FOUND =
            "Project not found";

    public static final String ANALYSIS_SERVICE_NOT_AVAILABLE =
            "CPM and Float analysis service is not available";
}