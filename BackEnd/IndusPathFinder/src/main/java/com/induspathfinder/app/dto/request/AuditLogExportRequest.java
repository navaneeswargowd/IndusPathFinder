package com.induspathfinder.app.dto.request;

import java.time.LocalDateTime;

import com.induspathfinder.app.enums.ExportFormat;

import jakarta.validation.constraints.AssertTrue;
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
public class AuditLogExportRequest {

    @Positive(message = "User ID must be greater than zero")
    private Long userId;

    @Size(
        max = 100,
        message = "Action name cannot exceed 100 characters"
    )
    private String actionName;

    @Size(
        max = 100,
        message = "Action screen cannot exceed 100 characters"
    )
    private String actionScreen;

    @Size(
        max = 100,
        message = "Username cannot exceed 100 characters"
    )
    private String username;

    private LocalDateTime fromDate;

    private LocalDateTime toDate;

    @NotNull(message = "Export format is required")
    private ExportFormat exportFormat;

    @AssertTrue(
        message = "From date must be before or equal to To date"
    )
    public boolean isDateRangeValid() {

        if (fromDate == null || toDate == null) {
            return true;
        }

        return !fromDate.isAfter(toDate);
    }
}