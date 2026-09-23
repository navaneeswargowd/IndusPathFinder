package com.induspathfinder.app.dto.response;

import java.time.LocalDateTime;

import com.induspathfinder.app.constants.ApiConstants;

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
public class ApiResponse<T> {

    private boolean success;

    private String status;

    private String message;

    private T data;

    private LocalDateTime timestamp;

    public static <T> ApiResponse<T> success(
            String message,
            T data) {

        return ApiResponse.<T>builder()
                .success(true)
                .status(ApiConstants.STATUS_SUCCESS)
                .message(message)
                .data(data)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public static ApiResponse<Void> success(String message) {

        return ApiResponse.<Void>builder()
                .success(true)
                .status(ApiConstants.STATUS_SUCCESS)
                .message(message)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public static <T> ApiResponse<T> failure(
            String message,
            T data) {

        return ApiResponse.<T>builder()
                .success(false)
                .status(ApiConstants.STATUS_FAILURE)
                .message(message)
                .data(data)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public static ApiResponse<Void> failure(String message) {

        return ApiResponse.<Void>builder()
                .success(false)
                .status(ApiConstants.STATUS_FAILURE)
                .message(message)
                .timestamp(LocalDateTime.now())
                .build();
    }
}