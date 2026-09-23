package com.induspathfinder.app.dto.request;

import java.time.LocalDateTime;

import com.induspathfinder.app.enums.ExportFormat;
import com.induspathfinder.app.enums.ReportType;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
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
public class ReportRequest {

    @NotNull(message = "Project ID is required")
    @Positive(message = "Project ID must be greater than zero")
    private Long projectId;

    @NotNull(message = "Report type is required")
    private ReportType reportType;

    @NotNull(message = "Export format is required")
    private ExportFormat exportFormat;

    private LocalDateTime fromDate;

    private LocalDateTime toDate;

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