package com.induspathfinder.app.dto.response;

import java.time.LocalDateTime;

import com.induspathfinder.app.enums.NotificationStatus;

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
public class NotificationResponse {

    private Long notificationId;

    private Long userId;

    private String title;

    private String message;

    private NotificationStatus status;

    private LocalDateTime createdOn;

    private LocalDateTime readOn;
}