package com.induspathfinder.app.constants;

public final class ApplicationConstants {

    private ApplicationConstants() {
        throw new IllegalStateException("Constants class cannot be instantiated");
    }

    public static final String APPLICATION_NAME = "IndusPathFinder";

    public static final String ROLE_ADMIN = "ADMIN";
    public static final String ROLE_PROJECT_MANAGER = "PROJECT_MANAGER";

    public static final String ACTIVE_STATUS = "ACTIVE";
    public static final String INACTIVE_STATUS = "INACTIVE";

    public static final String SYSTEM_USER = "SYSTEM";

    public static final String DATE_FORMAT = "yyyy-MM-dd";
    public static final String DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
}