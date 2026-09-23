package com.induspathfinder.app.constants;

public final class ApiConstants {

    private ApiConstants() {
        throw new IllegalStateException("Constants class cannot be instantiated");
    }

    public static final String API_BASE_PATH = "/api";

    public static final String STATUS_SUCCESS = "SUCCESS";
    public static final String STATUS_FAILURE = "FAILURE";

    public static final int DEFAULT_PAGE_NUMBER = 0;
    public static final int DEFAULT_PAGE_SIZE = 10;
    public static final int MAX_PAGE_SIZE = 100;
}