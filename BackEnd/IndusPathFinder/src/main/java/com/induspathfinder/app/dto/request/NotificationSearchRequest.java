package com.induspathfinder.app.dto.request;

import com.induspathfinder.app.enums.NotificationStatus;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationSearchRequest
        extends PaginationRequest {

	@NotNull(message = "User ID is required")
	@Positive(message = "User ID must be greater than zero")
    private Long userId;

    @Size(
        max = 150,
        message = "Notification title cannot exceed 150 characters"
    )
    private String title;

    private NotificationStatus status;
}