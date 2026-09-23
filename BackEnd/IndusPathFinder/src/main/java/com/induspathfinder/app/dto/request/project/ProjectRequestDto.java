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
public class ProjectRequestDto {
	 
	@NotBlank(message = "Project name is required")
	@Size(max = 100, message = "Project Name cannot exceed 100 characters")
	private String projectName;

//	@NotBlank(message = "Project code is required")
//	@Size(min=3,max=100,message="Project Name must be between 3 and 100 characters")
//	private String projectCode;
	
	@Size(max = 500, message = "Description cannot exceed 500 characters")
	private String description;

	@NotNull(message = "Start date is required")
	private LocalDate startDate;

	@NotNull(message = "End date is required")
	private LocalDate endDate;

	@NotNull(message = "Status is required")
	private ProjectStatus status;
	
	@NotNull(message = "Priority is required")
	private ProjectPriority priority;

}
