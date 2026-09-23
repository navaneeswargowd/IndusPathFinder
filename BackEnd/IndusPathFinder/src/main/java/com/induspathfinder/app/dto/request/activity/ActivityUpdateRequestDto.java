package com.induspathfinder.app.dto.request.activity;

import java.time.LocalDate;

import com.induspathfinder.app.enums.ActivityPriority;
import com.induspathfinder.app.enums.ActivityStatus;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityUpdateRequestDto {
	    private Long actId;

	    @NotNull(message="Project Id is required")
	    private Long projectId;

//	    @NotBlank(message="Activity Code is required")
//	    private String actCode;

	    @NotBlank(message="Activity Name is required")
	    private String actName;

	    @NotNull(message="Duration is required")
	    @Min(value=1,message="Duration must be greater than zero")
	    private Integer duration;

	    @NotNull(message="Start Date is required")
	    private LocalDate startDate;

	    @NotNull(message="End Date is required")
	    private LocalDate endDate;

	    @NotNull(message="Priority is required")
	    private ActivityPriority priority;

	    @NotNull(message="Status is required")
	    private ActivityStatus status;

	    private String description;
}
