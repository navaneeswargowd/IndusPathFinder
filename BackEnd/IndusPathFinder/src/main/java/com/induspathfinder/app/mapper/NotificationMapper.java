package com.induspathfinder.app.mapper;

import org.springframework.stereotype.Component;

import com.induspathfinder.app.dto.request.NotificationCreateRequest;
import com.induspathfinder.app.dto.response.NotificationResponse;
import com.induspathfinder.app.entity.Notification;
import com.induspathfinder.app.entity.User;
import com.induspathfinder.app.enums.NotificationStatus;

@Component
public class NotificationMapper {

    public Notification toEntity(
            NotificationCreateRequest request,
            User user) {

        if (request == null || user == null) {
            return null;
        }

        return Notification.builder()
                .user(user)
                .title(request.getTitle().trim())
                .message(request.getMessage().trim())
                .status(NotificationStatus.UNREAD)
                .build();
    }

    public NotificationResponse toResponse(
            Notification notification) {

        if (notification == null) {
            return null;
        }

        return NotificationResponse.builder()
                .notificationId(
                        notification.getNotificationId())
                .userId(
                        notification.getUser() == null
                                ? null
                                : notification.getUser()
                                        .getUserId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .status(notification.getStatus())
                .createdOn(notification.getCreatedOn())
                .readOn(notification.getReadOn())
                .build();
    }
}