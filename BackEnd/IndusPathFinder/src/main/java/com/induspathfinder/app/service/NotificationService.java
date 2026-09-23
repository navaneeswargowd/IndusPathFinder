package com.induspathfinder.app.service;

import org.springframework.data.domain.Page;

import com.induspathfinder.app.dto.request.NotificationCreateRequest;
import com.induspathfinder.app.dto.request.NotificationDeleteRequest;
import com.induspathfinder.app.dto.request.NotificationDetailsRequest;
import com.induspathfinder.app.dto.request.NotificationReadRequest;
import com.induspathfinder.app.dto.request.NotificationSearchRequest;
import com.induspathfinder.app.dto.response.ApiResponse;
import com.induspathfinder.app.dto.response.NotificationResponse;

public interface NotificationService {

    NotificationResponse createNotification(
            NotificationCreateRequest request);

    Page<NotificationResponse> searchNotifications(
            NotificationSearchRequest request);

    NotificationResponse getNotificationDetails(
            NotificationDetailsRequest request);

    ApiResponse<Void> markAsRead(
            NotificationReadRequest request);

    ApiResponse<Void> markAllAsRead(
            Long userId);

    ApiResponse<Void> deleteNotification(
            NotificationDeleteRequest request);
}