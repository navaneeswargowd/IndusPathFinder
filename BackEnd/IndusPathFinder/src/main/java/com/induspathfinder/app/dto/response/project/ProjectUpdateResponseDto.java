package com.induspathfinder.app.dto.response.project;

import java.time.LocalDate;

import com.induspathfinder.app.enums.ProjectStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectUpdateResponseDto {

	 private Long projectId;

	    private String projectCode;

	    private String projectName;

	    private String description;

	    private LocalDate startDate;

	    private LocalDate endDate;

	    private ProjectStatus status;
	    
}
