package com.induspathfinder.app.controller;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.induspathfinder.app.constants.MessageConstants;
import com.induspathfinder.app.dto.request.NotificationCreateRequest;
import com.induspathfinder.app.dto.request.NotificationDeleteRequest;
import com.induspathfinder.app.dto.request.NotificationDetailsRequest;
import com.induspathfinder.app.dto.request.NotificationReadRequest;
import com.induspathfinder.app.dto.request.NotificationSearchRequest;
import com.induspathfinder.app.dto.response.ApiResponse;
import com.induspathfinder.app.dto.response.NotificationResponse;
import com.induspathfinder.app.dto.response.PageResponse;
import com.induspathfinder.app.service.NotificationService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {

    private final NotificationService
            notificationService;

    public NotificationController(
            NotificationService notificationService) {

        this.notificationService =
                notificationService;
    }

    @PostMapping("/create")
    public ResponseEntity<
            ApiResponse<NotificationResponse>>
    createNotification(
            @Valid
            @RequestBody
            NotificationCreateRequest request) {

        NotificationResponse response =
                notificationService
                        .createNotification(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                    ApiResponse.success(
                            MessageConstants
                                    .NOTIFICATION_CREATED,
                            response));
    }

    @PostMapping("/search")
    public ResponseEntity<
            ApiResponse<
                    PageResponse<NotificationResponse>>>
    searchNotifications(
            @Valid
            @RequestBody
            NotificationSearchRequest request) {

        Page<NotificationResponse> page =
                notificationService
                        .searchNotifications(request);

        PageResponse<NotificationResponse>
                pageResponse =
                PageResponse.from(page);

        return ResponseEntity.ok(
                ApiResponse.success(
                        MessageConstants
                                .NOTIFICATIONS_FETCHED,
                        pageResponse));
    }

    @PostMapping("/details")
    public ResponseEntity<
            ApiResponse<NotificationResponse>>
    getNotificationDetails(
            @Valid
            @RequestBody
            NotificationDetailsRequest request) {

        NotificationResponse response =
                notificationService
                        .getNotificationDetails(request);

        return ResponseEntity.ok(
                ApiResponse.success(
                        MessageConstants
                                .NOTIFICATION_FETCHED,
                        response));
    }

    @PutMapping("/read")
    public ResponseEntity<ApiResponse<Void>>
    markAsRead(
            @Valid
            @RequestBody
            NotificationReadRequest request) {

        return ResponseEntity.ok(
                notificationService.markAsRead(request));
    }

    @PutMapping("/read-all/{userId}")
    public ResponseEntity<ApiResponse<Void>>
    markAllAsRead(
            @PathVariable
            @Positive(
                message =
                    "User ID must be greater than zero")
            Long userId) {

        return ResponseEntity.ok(
                notificationService
                        .markAllAsRead(userId));
    }

    @DeleteMapping("/delete")
    public ResponseEntity<ApiResponse<Void>>
    deleteNotification(
            @Valid
            @RequestBody
            NotificationDeleteRequest request) {

        return ResponseEntity.ok(
                notificationService
                        .deleteNotification(request));
    }
}