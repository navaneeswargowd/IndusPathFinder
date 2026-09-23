package com.induspathfinder.app.dto.request.project;

import java.time.LocalDate;

import com.induspathfinder.app.enums.ProjectPriority;
import com.induspathfinder.app.enums.ProjectStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectUpdateRequestDto {
	
	private Long projectId;

//	@NotBlank(message = "Project Code is required")
//	@Size(max = 20, message = "Project Code cannot exceed 20 characters")
//    private String projectCode;

	@NotBlank(message = "Project Name is required")
	@Size(min=3,max=100,message="Project Name must be between 3 and 100 characters")
    private String projectName;

	@Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

	@NotNull(message = "Start Date is required")
    private LocalDate startDate;

	@NotNull(message = "End Date is required")
    private LocalDate endDate;

	@NotNull(message = "Status is required")
    private ProjectStatus status;
	
	@NotNull(message = "Priority is required")
	private ProjectPriority priority;

}
