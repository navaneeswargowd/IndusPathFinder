package com.induspathfinder.app.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
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
public class NotificationCreateRequest {

    @NotNull(message = "User ID is required")
    @Positive(message = "User ID must be greater than zero")
    private Long userId;

    @NotBlank(message = "Notification title is required")
    @Size(
        max = 150,
        message = "Notification title cannot exceed 150 characters"
    )
    private String title;

    @NotBlank(message = "Notification message is required")
    @Size(
        max = 1000,
        message = "Notification message cannot exceed 1000 characters"
    )
    private String message;
}